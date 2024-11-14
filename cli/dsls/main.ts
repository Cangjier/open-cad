import { Path } from "../.tsc/System/IO/Path";
import { Directory } from "../.tsc/System/IO/Directory";
import { args, cmdAsync, copyDirectory, deleteDirectory, deleteFile, env, execAsync, kill, script_path, start } from "../.tsc/context";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
import { Task } from "../.tsc/System/Threading/Tasks/Task";
import { Environment } from "../.tsc/System/Environment";
import { File } from "../.tsc/System/IO/File";
axios.setDefaultProxy();
let script_directory = Path.GetDirectoryName(script_path);
let cli_directory = Path.GetDirectoryName(script_directory);
let repositoryDirectory = Path.GetDirectoryName(cli_directory);
let dsls_directory = Path.Combine(repositoryDirectory, "dsls");
let dslsIndexPath = Path.Combine(dsls_directory, "index.json");
let opencadDirectory = "C:\\OPEN_CAD";
let downloadDirectory = Path.Combine(opencadDirectory, "download");
if (!Directory.Exists(downloadDirectory)) {
    Directory.CreateDirectory(downloadDirectory);
}
let ssqDirectory = Path.Combine(opencadDirectory, "CATIA", "SSQ");
if (!Directory.Exists(ssqDirectory)) {
    Directory.CreateDirectory(ssqDirectory);
}

let WCLManager = () => {
    let install = async () => {
        let binDirectory = Path.Combine(opencadDirectory, "bin");
        // 获取https://github.com/Cangjier/windows-common-cli/最新的release
        let url = "https://api.github.com/repos/Cangjier/windows-common-cli/releases/latest";
        let releaseResponse = await axios.get(url, {
            headers: {
                "User-Agent": "Cangjier"
            }
        });
        let release = releaseResponse.data;
        let assets = release["assets"];
        let asset = assets[0];
        let browser_download_url = asset["browser_download_url"];
        let download_path = Path.Combine(downloadDirectory, Path.GetFileName(browser_download_url));
        console.log(`Downloading ${browser_download_url} to ${download_path}`);
        await axios.download(browser_download_url, download_path);
        let zipDirectory = Path.Combine(downloadDirectory, Path.GetFileNameWithoutExtension(download_path));
        console.log(`Extracting ${download_path} to ${zipDirectory}`);
        await zip.extract(download_path, zipDirectory);
        console.log(`Copying ${zipDirectory} to ${binDirectory}`);
        copyDirectory(zipDirectory, binDirectory);
        deleteDirectory(zipDirectory);
        deleteFile(download_path);
    };
    let getChildrenWindows = async (hwnd: string) => {
        let outputPath = Path.GetTempFileName();
        await cmdAsync(Environment.CurrentDirectory, `wcl list-children-windows ${hwnd} ${outputPath}`);
        let result = Json.Load(outputPath);
        File.Delete(outputPath);
        return result;
    };
    let setWindowText = async (hwnd: string, text: string) => {
        await cmdAsync(Environment.CurrentDirectory, `wcl set-window-text ${hwnd} "${text}" --type text`);
    };
    let getComboboxItems = async (hwnd: string) => {
        let outputPath = Path.GetTempFileName();
        await cmdAsync(Environment.CurrentDirectory, `wcl get-window ${hwnd} ${outputPath}`);
        let result = Json.Load(outputPath);
        File.Delete(outputPath);
        return result.Items as string[];
    };
    let selectComboboxIndex = async (hwnd: string, index: number) => {
        await cmdAsync(Environment.CurrentDirectory, `wcl select-combobox-index ${hwnd} ${index}`);
    };
    let click = async (hwnd: string) => {
        if (hwnd == undefined) {
            console.log("hwnd is undefined");
            return;
        }
        await cmdAsync(Environment.CurrentDirectory, `wcl click-window ${hwnd}`);
    };
    let match = async (matchPath: string) => {
        let outputPath = Path.GetTempFileName();
        await cmdAsync(Environment.CurrentDirectory, `wcl match-window ${matchPath} ${outputPath}`);
        let result = Json.Load(outputPath);
        File.Delete(outputPath);
        return result;
    };
    let close = async (hwnd: string) => {
        console.log(`wcl close-window ${hwnd}`);
        await cmdAsync(Environment.CurrentDirectory, `wcl close-window ${hwnd}`);
    };
    return {
        install,
        getChildrenWindows,
        setWindowText,
        getComboboxItems,
        selectComboboxIndex,
        click,
        match,
        close
    }
};

let wclManager = WCLManager();


let SSQManager = () => {
    let genPath = Path.Combine(script_directory, "gen.json");
    let flag = 'toSave';
    let download = async () => {
        let indexJson = await Json.LoadAsync(dslsIndexPath);
        for (let item of indexJson["DSLS.Gen"]) {
            let download_url = item["download_url"];
            let download_path = Path.Combine(ssqDirectory, Path.GetFileName(download_url));
            await axios.download(download_url, download_path);
        }
        for (let item of indexJson["RADE.SSQ"]) {
            let download_url = item["download_url"];
            let download_path = Path.Combine(ssqDirectory, Path.GetFileName(download_url));
            await axios.download(download_url, download_path);
        }
        for (let item of indexJson["CATIA.SSQ"]) {
            let download_url = item["download_url"];
            let download_path = Path.Combine(ssqDirectory, Path.GetFileName(download_url));
            await axios.download(download_url, download_path);
        }
    };
    let getGenFilePaths = () => {
        return Directory.GetFiles(ssqDirectory, "*.exe");
    };
    let startGenerator = async (generator: string) => {
        let pid = start({
            filePath: generator,
            workingDirectory: ssqDirectory
        });
        let outputPath = Path.GetTempFileName();
        let hwnd = "";
        while (true) {
            await cmdAsync(Environment.CurrentDirectory, `wcl match-window ${genPath} ${outputPath}`);
            let result = Json.Load(outputPath);
            if (result.SSQ.Window.hWnd) {
                hwnd = result.SSQ.Window.hWnd;
                break;
            }
        }
        File.Delete(outputPath);
        return {
            pid,
            hwnd
        };
    };
    let setServerName = async (hwnd: string, serverName: string, serverID: string) => {
        let childWindows = await wclManager.getChildrenWindows(hwnd);
        let edits = childWindows.filter((item: any) => item.ClassName == "TEdit");
        if (edits.length == 2) {
            await wclManager.setWindowText(edits[0].hWnd, serverName);
            await wclManager.setWindowText(edits[1].hWnd, serverID);
        }
    };
    let selectSSQByIndex = async (hwnd: string, index: number) => {
        let childWindows = await wclManager.getChildrenWindows(hwnd);
        let comboboxes = childWindows.filter((item: any) => item.ClassName == "TComboBox");
        if (comboboxes.length == 1) {
            await wclManager.selectComboboxIndex(comboboxes[0].hWnd, index);
        }
    };
    let selectSSQByName = async (hwnd: string, name: string) => {
        let childWindows = await wclManager.getChildrenWindows(hwnd);
        let comboboxes = childWindows.filter((item: any) => item.ClassName == "TComboBox");
        if (comboboxes.length == 1) {
            let items = await wclManager.getComboboxItems(comboboxes[0].hWnd);
            let index = items.findIndex(item => item.toLowerCase().includes(name.toLowerCase()));
            if (index == -1) {
                console.log(`Cannot find ${name}`);
                return;
            }
            await wclManager.selectComboboxIndex(comboboxes[0].hWnd, index);
        }
    };
    let sureGenerate = async (hwnd: string) => {
        let childWindows = await wclManager.getChildrenWindows(hwnd);
        let buttons = childWindows.filter((item: any) => item.ClassName == "TButton");
        if (buttons.length == 1) {
            await wclManager.click(buttons[0].hWnd);
        }
    };
    let autoDo = async () => {
        while (true) {
            let matchResult = await wclManager.match(genPath);
            if (flag == "toSave") {
                if (matchResult.Save) {
                    wclManager.click(matchResult.Save[matchResult.Save.length - 1].Window.hWnd);
                    flag = "toClickOK";
                }
                else if (matchResult.OK) {
                    wclManager.click(matchResult.OK[matchResult.OK.length - 1].Window.hWnd);
                    break;
                }
            }
            else if (flag == "toClickOK") {
                if (matchResult.OK) {
                    wclManager.click(matchResult.OK[matchResult.OK.length - 1].Window.hWnd);
                    break;
                }

            }
        }
    };
    let deleteLiczFiles = () => {
        let directories = [
            env("desktop"),
            env("mydocuments")
        ];
        for (let directory of directories) {
            let liczFiles = Directory.GetFiles(directory, "*.licz");
            for (let file of liczFiles) {
                File.Delete(file);
            }
        }
    };
    let getLiczFiles = () => {
        let directories = [
            env("desktop"),
            env("mydocuments")
        ];
        let liczFiles: string[] = [];
        for (let directory of directories) {
            let files = Directory.GetFiles(directory, "*.licz");
            liczFiles = [...liczFiles, ...files];
        }
        return liczFiles;
    };
    let create = async (serverName: string, serverID: string, ssqName: string, generatorName: string, outputPath: string) => {
        deleteLiczFiles();
        let generator = Path.Combine(ssqDirectory, generatorName);
        let startResult = await startGenerator(generator);
        let mainWindow = startResult.hwnd;
        let pid = startResult.pid;
        await setServerName(mainWindow, serverName, serverID);
        await selectSSQByName(mainWindow, ssqName);
        await sureGenerate(mainWindow);
        await autoDo();
        await Task.Delay(500);
        let liczFiles = getLiczFiles();
        if (liczFiles.length == 1) {
            File.Copy(liczFiles[0], outputPath, true);
            console.log("Generate SSQ successfully");
        }
        else {
            console.log("Generate SSQ failed");
        }
        kill(pid);
        Environment.Exit(0);
    };
    return {
        create,
        download
    };
};

let ssqManager = SSQManager();


let main = async () => {
    if (args.length < 1) {
        console.log("Usage: dsls <command>");
        console.log("Usage: dsls install");
        return;
    }
    let command = args[0];
    if (command == "install") {
        await wclManager.install();
        await ssqManager.download();
    }
    else if (command == "create") {
        if (args.length < 5) {
            console.log("Usage: dsls create <serverName> <serverID> <ssqName> <generatorName> <outputPath>");
            return;
        }
        let serverName = args[1];
        let serverID = args[2];
        let ssqName = args[3];
        let generatorName = args[4];
        let outputPath = args[4];
        await ssqManager.create(serverName, serverID, ssqName, generatorName, outputPath);
    }
};

await main();

