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
let opencadDirectory = "C:\\OPEN_CAD";
let downloadDirectory = Path.Combine(opencadDirectory, "download");
if (!Directory.Exists(downloadDirectory)) {
    Directory.CreateDirectory(downloadDirectory);
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
    let extract = async (archiveFilePath: string, outputPath: string) => {
        await cmdAsync(Environment.CurrentDirectory, `wcl extract ${archiveFilePath} ${outputPath}`);
    };
    return {
        install,
        getChildrenWindows,
        setWindowText,
        getComboboxItems,
        selectComboboxIndex,
        click,
        match,
        close,
        extract
    }
};

let wclManager = WCLManager();

let Installer = () => {
    let installCatia = async (catiaDirectory: string) => {
        let arctiveFilePaths = Directory.GetFiles(catiaDirectory, "*.7z");
        let cd1 = arctiveFilePaths.find(x => x.includes("CD1"));
        let cd2 = arctiveFilePaths.find(x => x.includes("CD2"));
        let cd3 = arctiveFilePaths.find(x => x.includes("CD3"));
        if (cd1 == undefined || cd2 == undefined || cd3 == undefined) {
            console.log("CD1, CD2, CD3 not found");
            return;
        }
        let extractDirectory = Path.Combine(catiaDirectory, "extract");
        await wclManager.extract(cd1, extractDirectory);
        let setupPath = Path.Combine(extractDirectory, "setup.exe");
        start({
            filePath: setupPath
        });
        let catiar21MatchPath = Path.Combine(script_directory, "catiar21.json");
        let orderKeys = Object.keys(Json.Load(catiar21MatchPath)).reverse();
        while (true) {
            let matchResult = await wclManager.match(catiar21MatchPath);
            for (let key of orderKeys) {
                let state = matchResult[key];
                if (state != undefined) {
                    console.log(`clicking ${key}`);
                    await wclManager.click(state[state.length - 1].hWnd);
                    if (key == "CopyFile") {
                        break;
                    }
                    else {
                        await Task.Delay(1000);
                    }
                }
            }
        }
    }

    return {
        installCatia
    }
};

let installer = Installer();


let main = async () => {
    if (args.length < 1) {
        console.log("Usage: caa-installer installCatia <catiaDirectory>");
        return;
    }
    let command = args[0];
    if (command == "installCatia") {
        if (args.length < 2) {
            console.log("Usage: caa-installer installCatia <catiaDirectory>");
            return;
        }
        let catiaDirectory = args[1];
        await installer.installCatia(catiaDirectory);
    }
};

await main();