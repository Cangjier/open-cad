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
            let index = items.indexOf(name);
            if (index == -1) {
                console.log(`Cannot find ${name}`);
                return;
            }
            await wclManager.selectComboboxIndex(comboboxes[0].hWnd, index);
        }
    };
    let isCheckMessage = async () => {
        let matchResult = await wclManager.match(genPath);
        // console.log(matchResult);
        if (matchResult.CheckMessage) {
            wclManager.click(matchResult.CheckMessage[matchResult.CheckMessage.length - 1].Window.hWnd);
            return true;
        }
        return false;
    };
    let sureGenerate = async (hwnd: string) => {
        let childWindows = await wclManager.getChildrenWindows(hwnd);
        let buttons = childWindows.filter((item: any) => item.ClassName == "TButton");
        if (buttons.length == 1) {
            await wclManager.click(buttons[0].hWnd);
        }
    };
    let saveGenerate = async () => {
        let matchResult = await wclManager.match(genPath);
        if (matchResult.Save) {
            wclManager.click(matchResult.Save[matchResult.Save.length - 1].Window.hWnd);
            return true;
        }
        return false;
    };
    let clickEnjoy = async () => {
        let matchResult = await wclManager.match(genPath);
        if (matchResult.Enjoy) {
            wclManager.click(matchResult.Enjoy[matchResult.Enjoy.length - 1].Window.hWnd);
            return true;
        }
        return false;
    };
    let create = async (outputPath: string) => {
        let desktopPath = env("desktop");
        let liczFiles = Directory.GetFiles(desktopPath, "*.licz");
        for (let file of liczFiles) {
            File.Delete(file);
        }
        let generator = getGenFilePaths()[0];
        let startResult = await startGenerator(generator);
        let mainWindow = startResult.hwnd;
        let pid = startResult.pid;
        await setServerName(mainWindow, "WIN-IGMS40QQ1BC", "WFY-414910016C204D6A");
        await selectSSQByIndex(mainWindow, 1);
        await sureGenerate(mainWindow);
        await Task.Delay(500);
        if (await isCheckMessage()) {
            console.log("Server name or id is invalid");
            return;
        }
        await Task.Delay(500);
        await saveGenerate();
        await Task.Delay(2000);
        await clickEnjoy();
        await Task.Delay(1000);
        await wclManager.close(mainWindow);
        liczFiles = Directory.GetFiles(desktopPath, "*.licz");
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
        wclManager.install();
        ssqManager.download();
    }
    else if (command == "create") {
        if (args.length < 2) {
            console.log("Usage: dsls create <outputPath>");
            return;
        }
        let outputPath = args[1];
        await ssqManager.create(outputPath);
    }
};

await main();

