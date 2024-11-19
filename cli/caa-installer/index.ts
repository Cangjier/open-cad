import { Path } from "../.tsc/System/IO/Path";
import { Directory } from "../.tsc/System/IO/Directory";
import { args, cmdAsync, copyDirectory, deleteDirectory, deleteFile, env, execAsync, kill, script_path, start } from "../.tsc/context";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
import { Task } from "../.tsc/System/Threading/Tasks/Task";
import { Environment } from "../.tsc/System/Environment";
import { File } from "../.tsc/System/IO/File";
import { SearchOption } from "../.tsc/System/IO/SearchOption";
import { shell } from "../.tsc/Cangjie/TypeSharp/System/shell";
import { Guid } from "../.tsc/System/Guid";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { registry } from "../.tsc/Cangjie/TypeSharp/System/registry";
let utf8 = new UTF8Encoding(false);
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
    let isInstalled = () => {
        let binDirectory = Path.Combine(opencadDirectory, "bin");
        let wclPath = Path.Combine(binDirectory, "wcl.exe");
        return File.Exists(wclPath);
    };
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
        console.log(`wcl list-children-windows ${hwnd} ${outputPath}`);
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
    let mouseClickWindowAtRatio = async (hwnd: string, xRatio: number, yRatio: number) => {
        await cmdAsync(Environment.CurrentDirectory, `wcl mouse-click-window-at-ratio ${hwnd} ${xRatio} ${yRatio} --delay 500`);
    };
    let mouseClickWindowAt = async (hwnd: string, x: number, y: number) => {
        await cmdAsync(Environment.CurrentDirectory, `wcl mouse-click-window-at ${hwnd} ${x} ${y} --delay 500`);
    };
    let mouseClick = async () => {
        await cmdAsync(Environment.CurrentDirectory, `wcl mouse-click`);
    };
    return {
        isInstalled,
        install,
        getChildrenWindows,
        setWindowText,
        getComboboxItems,
        selectComboboxIndex,
        click,
        match,
        close,
        extract,
        mouseClickWindowAtRatio,
        mouseClickWindowAt,
        mouseClick
    }
};

let wclManager = WCLManager();


let TaskManager = () => {
    let formatApiUrl = (path: string) => {
        return `http://124.221.102.24:8080${path}`;
    };
    let runSync = async (pluginName: string, input: any) => {
        let response = await axios.post(formatApiUrl("/api/v1/tasks/run"), {
            Input: input,
            Processor: {
                "Name": pluginName,
                "Type": "Plugin"
            }
        });
        if (response.status == 200) {
            if (response.data.success) {
                return response.data.data;
            }
            else {
                throw response.data.message ?? "Unkown error";
            }
        }
        else {
            throw "Net error"
        }
    };
    let download = async (fileID: string, outputPath: string) => {
        await axios.download(formatApiUrl(`/api/v1/iostorage/download/${fileID}`), outputPath);
    };

    return {
        runSync,
        download
    }
};

let taskManager = TaskManager();


let InstallerR21 = () => {
    let isInstallCatia = () => {
        return File.Exists('C:/Program Files/Dassault Systemes/B21/win_b64/code/bin/CATSTART.exe');
    };
    let isInstallCAA = () => {
        return File.Exists("C:/Program Files/Dassault Systemes/B21/InstallCAA2.log");
    };
    let isInstallRade = () => {
        return File.Exists("C:/Program Files (x86)/Dassault Systemes/B21/intel_a/CAA_RADE.lp");
    };
    let isInstallDSLS = () => {
        return File.Exists("C:/Program Files (x86)/Dassault Systemes/DS License Server/intel_a/code/bin/DSLicSrv.exe");
    };
    let isInstallVS2008 = () => {
        return File.Exists("C:/Program Files (x86)/Microsoft Visual Studio 9.0/Common7/IDE/devenv.exe");
    };
    let installCatia = async (setupDirectory: string) => {
        console.log(`Installing CATIA from ${setupDirectory}`);
        let setupPath = Path.Combine(setupDirectory, "setup.exe");
        if (File.Exists(setupPath) == false) {
            console.log(`setup.exe not found in ${setupDirectory}`);
            return;
        }
        start({
            filePath: setupPath
        });

        let catiar21MatchPath = Path.Combine(script_directory, "catiar21", "catia.json");
        let orderKeys = Object.keys(Json.Load(catiar21MatchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(catiar21MatchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "Message" && currentKey != "WindowsMessage") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                await wclManager.click(state[state.length - 1].Window.hWnd);
                if (currentKey == "Finish") {
                    console.log("Finish");
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let installCAA = async (exePath: string) => {
        console.log(`Starting ${exePath}`);
        start({
            filePath: exePath
        });
        let matchPath = Path.Combine(script_directory, "catiar21", "caa.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "Message" && currentKey != "WindowsMessage") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                await wclManager.click(state[state.length - 1].Window.hWnd);
                if (currentKey == "Finish") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let installRade = async (exePath: string) => {
        start({
            filePath: exePath
        });
        let matchPath = Path.Combine(script_directory, "catiar21", "rade.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "Message" && currentKey != "WindowsMessage") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                let end = state[state.length - 1];
                if (end.Window.ClassName == "Edit") {
                    if (currentKey == "InstallFlagEdit") {
                        await wclManager.setWindowText(end.Window.hWnd, "RADER21");
                    }
                }
                else if (end.Window.ClassName == "Button") {
                    await wclManager.click(state[state.length - 1].Window.hWnd);
                }

                if (currentKey == "Finish") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let installDotNet = async (exePath: string) => {
        console.log(`Installing .NET from ${exePath}`);
        start({
            filePath: exePath
        });
        let matchPath = Path.Combine(script_directory, "catiar21", "dotnet.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        let totalTime = 0;
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                totalTime += 1000;
                if (doneKeys.includes("Download") == false && totalTime > 3000) {
                    console.log("Download not found");
                    break;
                }
                continue;
            }
            else {
                totalTime = 0;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "WindowsInstalling") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                await wclManager.click(state[state.length - 1].Window.hWnd);
                if (currentKey == "WindowsClose") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let installVS2008 = async (exePath: string) => {
        start({
            filePath: exePath
        });
        await Task.Delay(2000);
        let matchPath = Path.Combine(script_directory, "catiar21", "vs2008.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                if (key == "NavigateExit" && doneKeys.includes("FinishPage") == false) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "InstallingPageDoing" && currentKey != "Message" && currentKey != "WindowsMessage") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                if (currentKey == "Readme") {
                    await wclManager.click(state[state.length - 1].Window.hWnd);
                    await Task.Delay(2000);
                }
                else if (currentKey == "ReadmeView") {
                    await wclManager.mouseClickWindowAtRatio(state[state.length - 1].Window.hWnd, 0.995, 0.005);
                    await Task.Delay(2000);
                }
                else if (currentKey != "InstallingPageDoing") {
                    await wclManager.mouseClickWindowAtRatio(state[state.length - 1].Window.hWnd, 0.5, 0.2);
                    await Task.Delay(2000);
                }

                if (currentKey == "NavigateExit") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let installVS2008SP1 = async (exePath: string) => {
        start({
            filePath: exePath
        });
        await Task.Delay(2000);
        let matchPath = Path.Combine(script_directory, "catiar21", "vs2008_sp1.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "Installing") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                if (currentKey != "Installing") {
                    await wclManager.mouseClickWindowAtRatio(state[state.length - 1].Window.hWnd, 0.5, 0.2);
                }
                if (currentKey == "Finish") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let installDSLS = async (exePath: string) => {
        start({
            filePath: exePath
        });
        await Task.Delay(2000);
        let matchPath = Path.Combine(script_directory, "catiar21", "dsls2015.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                if (key == "Tools" && doneKeys.includes("Settings") == false) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "WindowsMessage") {
                    doneKeys.push(currentKey);
                }

                console.log(`Processing ${currentKey}`);
                if (currentKey == "Settings" || currentKey == "Tools") {
                    await wclManager.mouseClickWindowAtRatio(state[state.length - 1].Window.hWnd, 0.9, 0.1);
                }
                else {
                    await wclManager.click(state[state.length - 1].Window.hWnd);
                }
                if (currentKey == "Finish") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let installDSLSConfig = () => {
        Directory.CreateDirectory("C:/ProgramData/DassaultSystemes/Licenses");
        File.WriteAllText("C:/ProgramData/DassaultSystemes/Licenses/DSLicSrv.txt", "localhost:4085", utf8);
    };
    let getDSLSInfomation = async () => {
        let sh = shell.start({
            filePath: "C:/Program Files (x86)/Dassault Systemes/DS License Server/intel_a/code/bin/DSLicSrv.exe",
            arguments: ["/test", "-admin"]
        });
        await Task.Delay(1000);
        sh.writeLine("c localhost 4084");
        await Task.Delay(1000);
        let lines = sh.readLines();
        console.log(lines);
        let lastLine = lines[lines.length - 1];
        let colonIndex = lastLine.indexOf(":");
        if (colonIndex == -1) {
            colonIndex = lastLine.indexOf("：");
        }
        let next = lastLine.substring(colonIndex + 1).trim();
        let whiteSpaceIndex = next.indexOf(" ");
        let serverName = next.substring(0, whiteSpaceIndex);
        next = next.substring(whiteSpaceIndex + 1).trim();
        colonIndex = next.indexOf(":");
        if (colonIndex == -1) {
            colonIndex = next.indexOf("：");
        }
        next = next.substring(colonIndex + 1).trim();
        whiteSpaceIndex = next.indexOf(" ");
        let serverID = next;
        sh.kill();
        return {
            "ServerName": serverName,
            "ServerID": serverID
        };
    };
    let registerSSQ = async (serverName: string, serverID: string, ssqName: string, generatorName: string) => {
        let outputPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N") + ".licz");
        let cmd = `opencad dsls create "${serverName}" "${serverID}" "${ssqName}" "${generatorName}" "${outputPath}"`;
        console.log(cmd)
        await cmdAsync(Environment.CurrentDirectory, cmd);
        return outputPath;
    };
    let resgiterSSQByNet = async (serverName: string, serverID: string, ssqName: string, generatorName: string) => {
        axios.unsetProxy();
        let task = await taskManager.runSync("dsls", {
            ServerName: serverName,
            ServerID: serverID,
            SSQ: ssqName,
            Generator: generatorName
        });
        let download_url = task.Output.FileID;
        let outputPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N") + ".licz");
        await taskManager.download(download_url, outputPath);
        axios.setDefaultProxy();
        return outputPath;
    };
    let installLiczFilePath = async (liczFilePath: string) => {
        console.log(`Installing ${liczFilePath}`);
        let sh = shell.start({
            filePath: "C:/Program Files (x86)/Dassault Systemes/DS License Server/intel_a/code/bin/DSLicSrv.exe",
            arguments: ["/test", "-admin"]
        });
        await Task.Delay(1000);
        let liczDirectory = Path.GetDirectoryName(liczFilePath);
        sh.writeLine(`connect localhost 4084`);
        await Task.Delay(1000);
        sh.writeLine(`e -dir ${liczDirectory} -file ${Path.GetFileName(liczFilePath)}`);
        await Task.Delay(1000);
        sh.writeLine(`sc -els yes`);
        await Task.Delay(1000);
        sh.writeLine(`yes`);
        await Task.Delay(1000);
        sh.writeLine(`sc -lp 4085`);
        await Task.Delay(1000);
        sh.writeLine(`yes`);
        await Task.Delay(1000);
        console.log(sh.readLines());
        sh.kill();
    };
    let selectLicense = async () => {
        start({
            filePath: "C:\\Program Files\\Dassault Systemes\\B21\\win_b64\\code\\bin\\CATSTART.exe",
            arguments: [
                "-run",
                "CNEXT.exe",
                "-env",
                "CATIA_P3.V5R21.B21",
                "-direnv",
                "C:\\ProgramData\\DassaultSystemes\\CATEnv",
                "-nowindow"
            ]
        });
        await Task.Delay(2000);
        let matchPath = Path.Combine(script_directory, "catiar21", "select-license.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                if ((key == "CATIA" || key == "Sure") && doneKeys.includes("LicenseSelect") == false) {
                    return false;
                }
                if (key == "CATIA" && doneKeys.includes("Sure") == false) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                if (currentKey != "Warning") {
                    doneKeys.push(currentKey);
                }
                doneKeys.push(currentKey);
                console.log(`Processing ${currentKey}`);
                if (currentKey == "Welcome" || currentKey == "Sure" || currentKey == "Warning") {
                    await wclManager.click(state[state.length - 1].Window.hWnd);
                }
                else if (currentKey == "LicenseSelect") {
                    let hWnd = state[state.length - 1].Window.hWnd;
                    let children = await wclManager.getChildrenWindows(hWnd);
                    for (let child of children) {
                        if (child.Text.startsWith("License_")) {
                            if (child.Text.includes("DIC") == false && child.Text.includes("ED2") == false && child.Text.includes("EX2") == false && child.Text.includes("I3D") == false) {
                                let subChildren = await wclManager.getChildrenWindows(child.hWnd);
                                let button = subChildren.find(x => x.ClassName == "Button" && x.Text == "");
                                if (button) {
                                    await wclManager.click(button.hWnd);
                                }
                            }
                        }
                    }
                }
                else if (currentKey == "CATIA") {
                    console.log(state);
                    await wclManager.mouseClickWindowAt(state.Window.hWnd, state.Window.Size.Width - 10, 10);
                }

                if (currentKey == "CATIA") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };
    let createRadeRegistry = () => {
        registry.set("HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\KeyExchangeAlgorithms\\Diffie-Hellman\\ClientMinKeyBitLength", {
            type: "DWORD",
            value: "512"
        });
    };
    let configCATVBTLicenser = async (exePath: string) => {
        start({
            filePath: exePath
        });
        let matchPath = Path.Combine(script_directory, "catiar21", "catvbtlicenser.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                doneKeys.push(currentKey);
                console.log(`Processing ${currentKey}`);
                if (currentKey == "Licenses") {
                    let children = await wclManager.getChildrenWindows(state[state.length - 1].Window.hWnd);
                    for (let child of children) {
                        let subChildren = await wclManager.getChildrenWindows(child.hWnd);
                        let button = subChildren.find(x => x.ClassName == "Button" && x.Text == "");
                        if (button) {
                            await wclManager.click(button.hWnd);
                        }
                    }
                }
                else if (currentKey == "Finish") {
                    await wclManager.mouseClickWindowAt(state.Window.hWnd, state.Window.Size.Width - 10, 10);
                }
                else {
                    await wclManager.click(state[state.length - 1].Window.hWnd);
                }
                if (currentKey == "Finish") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }

    };

    let configCATVBTSetup = async (exePath: string) => {
        start({
            filePath: exePath
        });
        let matchPath = Path.Combine(script_directory, "catiar21", "catvbtsetup.json");
        let orderKeys = Object.keys(Json.Load(matchPath)).reverse();
        let doneKeys = [] as string[];
        while (true) {
            let isDone = false;
            let matchResult = await wclManager.match(matchPath);
            let currentKey = orderKeys.find(key => {
                if (doneKeys.includes(key)) {
                    return false;
                }
                let state = matchResult[key];
                if (state != undefined) {
                    return true;
                }
            });
            if (currentKey == undefined) {
                await Task.Delay(1000);
                continue;
            }
            let state = matchResult[currentKey];
            if (state != undefined) {
                doneKeys.push(currentKey);
                console.log(`Processing ${currentKey}`);
                if (currentKey == "ComponentTree") {
                    let tree = state[state.length - 1].Window;
                    let nodes = tree.Nodes;
                    let height = nodes[1].Rectangle.Y - nodes[0].Rectangle.Y;
                    for (let node of nodes) {
                        await wclManager.mouseClickWindowAt(tree.hWnd, node.Rectangle.Height / 2, node.Rectangle.Y + (height / 2));
                    }
                }
                else if (currentKey == "Documentation") {
                    let tabControl = state[state.length - 1].Window;
                    let tabs = tabControl.Tabs;
                    let tab = tabs[3];
                    await wclManager.mouseClickWindowAt(tabControl.hWnd, tab.X + (tab.Width / 2), tab.Y + (tab.Height / 2));
                    await Task.Delay(500);
                    let tabWindows = await wclManager.getChildrenWindows(tabControl.hWnd);
                    let documentWindow = tabWindows[4];
                    let documentWindowChildren = await wclManager.getChildrenWindows(documentWindow.hWnd);
                    let edit = documentWindowChildren[0];
                    await wclManager.setWindowText(edit.hWnd, "C:\\Program Files\\Dassault Systemes\\B21\\CAADoc");
                    await Task.Delay(500);
                    tab = tabs[4];
                    await wclManager.mouseClickWindowAt(tabControl.hWnd, tab.X + (tab.Width / 2), tab.Y + (tab.Height / 2));
                }
                else if (currentKey == "Install") {

                }
                else {
                    await wclManager.click(state[state.length - 1].Window.hWnd);
                }
                if (currentKey == "Finish") {
                    isDone = true;
                    break;
                }
                else {
                    await Task.Delay(1000);
                }
            }
            if (isDone) {
                break;
            }
        }
    };

    let entry = async (archiveDirectory: string) => {
        // let catiaDirectory = Path.Combine(archiveDirectory, "1");
        // if (Directory.Exists(catiaDirectory) == false) {
        //     console.log(`Directory ${catiaDirectory} not found`);
        //     return;
        // }
        // if (isInstallCatia() == false) {
        //     console.log("Installing CATIA");
        //     await installCatia(catiaDirectory);
        // }
        // else {
        //     console.log("Catia is already installed");
        // }

        // let dslsPath = Path.Combine(archiveDirectory, "4", "DSLS_SSQ_V6R2015x_Installer_01042015.exe");
        // if (isInstallDSLS() == false) {
        //     await installDSLS(dslsPath);
        // }
        // else {
        //     console.log("DSLS is already installed");
        // }

        // let dslsInfo = await getDSLSInfomation();
        // if (dslsInfo.ServerID && dslsInfo.ServerName) {
        //     let catiaSSQ = "CATIA.V5R21-V5R25.SSQ";
        //     let catiaLiczPath = await resgiterSSQByNet(dslsInfo.ServerName, dslsInfo.ServerID, catiaSSQ, "DSLS.LicGen.v1.5.SSQ.exe");
        //     if (File.Exists(catiaLiczPath)) {
        //         await installLiczFilePath(catiaLiczPath);
        //         installDSLSConfig();
        //         await selectLicense();
        //     }
        // }

        // let caaStartPath = Path.Combine(archiveDirectory, "5", "startcaa.exe");
        // if (isInstallCAA() == false) {
        //     console.log("Installing CAA");
        //     await installCAA(caaStartPath);
        //     await Task.Delay(3000);
        // }
        // else {
        //     console.log("CAA is already installed");
        // }

        // let radeStartPath = Path.Combine(archiveDirectory, "6", "setup.exe");
        // if (isInstallRade() == false) {
        //     console.log("Installing Rade");
        //     createRadeRegistry();
        //     await installRade(radeStartPath);
        //     await Task.Delay(3000);
        // }
        // else {
        //     console.log("Rade is already installed");
        // }

        // let caaSSQ = "CAA.Rade.V5R21-V5R22.SSQ";
        // let caaLiczPath = await resgiterSSQByNet(dslsInfo.ServerName, dslsInfo.ServerID, caaSSQ, "DSLS.LicGen.v1.6.SSQ.exe");
        // await installLiczFilePath(caaLiczPath);

        // let catvbtlicenserPath = "C:\\Program Files (x86)\\Dassault Systemes\\B21\\intel_a\\code\\bin\\CATVBTLicenser.exe";
        // await configCATVBTLicenser(catvbtlicenserPath);

        let catvbtsetupPath = "C:\\Program Files (x86)\\Dassault Systemes\\B21\\intel_a\\code\\bin\\CATVBTSetup.exe";
        await configCATVBTSetup(catvbtsetupPath);

        // let dotnet35Path = Path.Combine(archiveDirectory, "7", "dotnetfx35.exe");
        // await installDotNet(dotnet35Path);

        // let vs2008Path = Path.Combine(archiveDirectory, "8", "setup.exe");
        // let vs2008SP1Path = Path.Combine(archiveDirectory, "9", "vs90sp1\\SPInstaller.exe");
        // if (isInstallVS2008() == false) {
        //     await installVS2008(vs2008Path);
        //     await installVS2008SP1(vs2008SP1Path);
        // }


    };
    return {
        entry
    }
};

let installer = InstallerR21();


let main = async () => {
    if (wclManager.isInstalled() == false) {
        await wclManager.install();
    }
    if (args.length < 1) {
        console.log("Usage: caa-installer r21 <archiveDirectory>");
        return;
    }
    let command = args[0];
    if (command == "r21") {
        if (args.length < 2) {
            console.log("Usage: caa-installer r21 <archiveDirectory>");
            return;
        }
        let archiveDirectory = args[1];
        await installer.entry(archiveDirectory);
    }
    else {
        console.log("Unknown command");
    }
};

await main();