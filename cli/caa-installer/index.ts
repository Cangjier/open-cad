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
        mouseClick
    }
};

let wclManager = WCLManager();


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
    let installCatia = async (archiveDirectory: string) => {
        console.log(`Installing CATIA from ${archiveDirectory}`);
        let arctiveFilePaths = Directory.GetFiles(archiveDirectory, "*.7z");
        console.log(arctiveFilePaths);
        let cd1 = arctiveFilePaths.find(x => x.includes("CD1"));
        let cd2 = arctiveFilePaths.find(x => x.includes("CD2"));
        let cd3 = arctiveFilePaths.find(x => x.includes("CD3"));
        if (cd1 == undefined || cd2 == undefined || cd3 == undefined) {
            console.log("CD1, CD2, CD3 not found");
            return;
        }
        let extractDirectory = Path.Combine(archiveDirectory, "catia-extract");
        if (Directory.Exists(extractDirectory)) {
            deleteDirectory(extractDirectory);
        }
        console.log(`Extracting ${cd1} to ${extractDirectory}`);
        await wclManager.extract(cd1, extractDirectory);
        let rootDirectory = Directory.GetDirectories(extractDirectory)[0];
        Directory.Move(rootDirectory, Path.Combine(extractDirectory, "CATIA"));
        rootDirectory = Path.Combine(extractDirectory, "CATIA");
        let setupPath = Path.Combine(rootDirectory, "setup.exe");
        if (File.Exists(setupPath) == false) {
            console.log(`setup.exe not found in ${rootDirectory}`);
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
                if (currentKey != "Message") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                await wclManager.click(state[state.length - 1].Window.hWnd);
                if (currentKey == "CopyFile") {
                    console.log("Waiting for copy file");
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
        console.log("CD1 done");
        let cd2hWnd = "";
        while (true) {
            let matchResult = await wclManager.match(catiar21MatchPath);
            if (matchResult.InsertCD) {
                console.log("Insert CD2");
                cd2hWnd = matchResult.InsertCD[1].Window.hWnd;
                break;
            }
            console.log("Waiting for insert CD2");
            await Task.Delay(1000);
        }
        deleteDirectory(extractDirectory);
        await wclManager.extract(cd2, extractDirectory);
        rootDirectory = Directory.GetDirectories(extractDirectory)[0];
        Directory.Move(rootDirectory, Path.Combine(extractDirectory, "CATIA"));
        rootDirectory = Path.Combine(extractDirectory, "CATIA");
        await wclManager.click(cd2hWnd);
        await Task.Delay(1000);
        let cd3hWnd = "";
        while (true) {
            let matchResult = await wclManager.match(catiar21MatchPath);
            if (matchResult.InsertCD) {
                console.log("Insert CD3");
                cd3hWnd = matchResult.InsertCD[1].Window.hWnd;
                break;
            }
            console.log("Waiting for insert CD3");
            await Task.Delay(1000);
        }
        deleteDirectory(extractDirectory);
        await wclManager.extract(cd3, extractDirectory);
        rootDirectory = Directory.GetDirectories(extractDirectory)[0];
        Directory.Move(rootDirectory, Path.Combine(extractDirectory, "CATIA"));
        rootDirectory = Path.Combine(extractDirectory, "CATIA");
        await wclManager.click(cd3hWnd);
        await Task.Delay(1000);
        let finishhWnd = "";
        let startCatiahWnd = "";
        while (true) {
            let matchResult = await wclManager.match(catiar21MatchPath);
            if (matchResult.Finish && matchResult.StartCatia) {
                console.log("Finish");
                finishhWnd = matchResult.Finish[1].Window.hWnd;
                startCatiahWnd = matchResult.StartCatia[2].Window.hWnd;
                break;
            }
            console.log("Waiting for finish");
            await Task.Delay(1000);
        }
        await wclManager.click(startCatiahWnd);
        await Task.Delay(1000);
        await wclManager.click(finishhWnd);
        deleteDirectory(extractDirectory);
    };
    let installCatiaCrack = async (archivePath: string) => {
        let archiveDirectory = Path.GetDirectoryName(archivePath);
        let extractDirectory = Path.Combine(archiveDirectory, "catia-crack-extract");
        if (Directory.Exists(extractDirectory)) {
            deleteDirectory(extractDirectory);
        }
        console.log(`Extracting ${archivePath} to ${extractDirectory}`);
        await wclManager.extract(archivePath, extractDirectory);
        let dlls = Directory.GetFiles(extractDirectory, "*.dll", SearchOption.AllDirectories);
        let catiaDirectory = "C:/Program Files/Dassault Systemes/B21/win_b64/code/bin";
        console.log(`Copying ${dlls} to ${catiaDirectory}`);
        dlls.forEach(dll => {
            let targetPath = Path.Combine(catiaDirectory, Path.GetFileName(dll));
            File.Copy(dll, targetPath, true);
        });
        deleteDirectory(extractDirectory);
    };
    let installCAA = async (archivePath: string) => {
        let archiveDirectory = Path.GetDirectoryName(archivePath);
        let extractDirectory = Path.Combine(archiveDirectory, "caa-crack-extract");
        if (Directory.Exists(extractDirectory)) {
            deleteDirectory(extractDirectory);
        }
        console.log(`Extracting ${archivePath} to ${extractDirectory}`);
        await wclManager.extract(archivePath, extractDirectory);
        let rootDirectory = Directory.GetDirectories(extractDirectory)[0];
        let startcaa = Directory.GetFiles(rootDirectory, "startcaa.exe", SearchOption.AllDirectories)[0];
        console.log(`Starting ${startcaa}`);
        start({
            filePath: startcaa
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
                if (currentKey != "Message") {
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

        deleteDirectory(extractDirectory);
    };
    let installRade = async (archivePath: string) => {
        let archiveDirectory = Path.GetDirectoryName(archivePath);
        let extractDirectory = Path.Combine(archiveDirectory, "rade-crack-extract");
        if (Directory.Exists(extractDirectory)) {
            deleteDirectory(extractDirectory);
        }
        console.log(`Extracting ${archivePath} to ${extractDirectory}`);
        await wclManager.extract(archivePath, extractDirectory);
        let rootDirectory = Directory.GetDirectories(extractDirectory)[0];
        let startcaa = Directory.GetFiles(rootDirectory, "setup.exe", SearchOption.AllDirectories)[0];
        console.log(`Starting ${startcaa}`);
        start({
            filePath: startcaa
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
                if (currentKey != "Message") {
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

        deleteDirectory(extractDirectory);
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
    let installVS2008 = async (archivePath: string) => {
        let archiveDirectory = Path.GetDirectoryName(archivePath);
        let extractDirectory = Path.Combine(archiveDirectory, "vs2008-extract");
        if (Directory.Exists(extractDirectory)) {
            deleteDirectory(extractDirectory);
        }
        console.log(`Extracting ${archivePath} to ${extractDirectory}`);
        await wclManager.extract(archivePath, extractDirectory);
        let rootDirectory = Directory.GetDirectories(extractDirectory)[0];
        let setup = Directory.GetFiles(rootDirectory, "setup.exe", SearchOption.AllDirectories)[0];
        console.log(`Starting ${setup}`);
        start({
            filePath: setup
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
                if (currentKey != "InstallingPageDoing" && currentKey != "Message") {
                    doneKeys.push(currentKey);
                }
                console.log(`Processing ${currentKey}`);
                if (currentKey == "Readme") {
                    await wclManager.click(state[state.length - 1].Window.hWnd);
                }
                else if (currentKey != "InstallingPageDoing") {
                    await wclManager.mouseClickWindowAtRatio(state[state.length - 1].Window.hWnd, 0.5, 0.2);
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

        deleteDirectory(extractDirectory);
    };
    let installVS2008SP1 = async (archivePath: string) => {
        let archiveDirectory = Path.GetDirectoryName(archivePath);
        let extractDirectory = Path.Combine(archiveDirectory, "vs2008-sp1-extract");
        if (Directory.Exists(extractDirectory)) {
            deleteDirectory(extractDirectory);
        }
        console.log(`Extracting ${archivePath} to ${extractDirectory}`);
        await wclManager.extract(archivePath, extractDirectory);
        let rootDirectory = Directory.GetDirectories(extractDirectory)[0];
        let setup = Directory.GetFiles(rootDirectory, "SPInstaller.exe", SearchOption.AllDirectories)[0];
        console.log(`Starting ${setup}`);
        start({
            filePath: setup
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
        let matchPath = Path.Combine(script_directory, "catiar21", "dsls.json");
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
    let getDSLSInfomation = async (exePath: string) => {
        let sh = shell.start({
            filePath: "C:/Program Files (x86)/Dassault Systemes/DS License Server/intel_a/code/bin/DSLicSrv.exe",
            arguments: ["/test", "-admin"]
        });
        await Task.Delay(1000);
        sh.writeLine("c localhost 4084");
        await Task.Delay(1000);
        let lines = sh.readLines();
        let lastLine = lines[lines.length - 1];
        let items = lastLine.trim().split(' ').filter(item => item.length > 0);
        let parameters = {};
        for (let item of items) {
            if (item.includes("：")) {
                parameters[item.split('：')[0]] = item.split('：')[1]
            }
        }
        console.log(parameters)
        sh.kill();
        return {
            "ServerName": parameters["服务器名称"],
            "ServerID": parameters["ID"]
        };
    };
    let registerSSQ = async (serverName: string, serverID: string, ssqName: string, generatorName: string) => {
        let outputPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N") + ".licz");
        await cmdAsync(Environment.CurrentDirectory, `opencad dsls create ${serverName} ${serverID} ${ssqName} ${generatorName} ${outputPath}`);
        return outputPath;
    };
    let installLiczFilePath = async (liczFilePath: string) => {
        let sh = shell.start({
            filePath: "C:/Program Files (x86)/Dassault Systemes/DS License Server/intel_a/code/bin/DSLicSrv.exe",
            arguments: ["/test", "-admin"]
        });
        await Task.Delay(1000);
        let liczDirectory = Path.GetDirectoryName(liczFilePath);
        sh.writeLine(`setConfig –licensingPort 4085`);
        await Task.Delay(1000);
        sh.writeLine(`connect localhost 4084`);
        await Task.Delay(1000);
        sh.writeLine(`e -dir ${liczDirectory} -file ${Path.GetFileName(liczFilePath)}`);
        await Task.Delay(1000);
        console.log(sh.readLines());
        sh.kill();
    };
    let entry = async (archiveDirectory: string) => {
        let catiaDirectory = Path.Combine(archiveDirectory, "1");
        if (Directory.Exists(catiaDirectory) == false) {
            console.log(`Directory ${catiaDirectory} not found`);
            return;
        }
        let crackArchivePath = Directory.GetFiles(Path.Combine(archiveDirectory, "2"), "*.7z", SearchOption.AllDirectories)[0];
        let caaArchivePath = Directory.GetFiles(Path.Combine(archiveDirectory, "3"), "*.7z", SearchOption.AllDirectories)[0];
        let radeArchivePath = Directory.GetFiles(Path.Combine(archiveDirectory, "4"), "*.7z", SearchOption.AllDirectories)[0];
        let dotnet35Path = Path.Combine(archiveDirectory, "5", "dotnetfx35.exe");
        let dotnet20Path = Path.Combine(archiveDirectory, "5", "NetFx20SP1_x64");
        let vs2008Path = Path.Combine(archiveDirectory, "5", "VS2008.7z");
        let vs2008SP1Path = Path.Combine(archiveDirectory, "5", "VS2008__SP1.7z");
        let dslsPath = Path.Combine(archiveDirectory, "6", "_SolidSQUAD_", "DSLS_SSQ_V6R2017x_Installer_20170620.exe");
        let catiaSSQ = "CATIA V5R21-V5R22-V23.SSQ";
        let caaSSQ = "CAA Rade V5R21-V5R22.SSQ";
        if (isInstallCatia() == false) {
            console.log("Installing CATIA");
            await installCatia(catiaDirectory);
            await installCatiaCrack(crackArchivePath);
        }
        else {
            console.log("Catia is already installed");
        }
        if (isInstallCAA() == false) {
            console.log("Installing CAA");
            await installCAA(caaArchivePath);
        }
        else {
            console.log("CAA is already installed");
        }
        if (isInstallRade() == false) {
            console.log("Installing Rade");
            await installRade(radeArchivePath);
        }
        else {
            console.log("Rade is already installed");
        }
        await installDotNet(dotnet35Path);
        await installDotNet(dotnet20Path);
        await installVS2008(vs2008Path);
        await installVS2008SP1(vs2008SP1Path);
        await installDSLS(dslsPath);
        let dslsInfo = await getDSLSInfomation(dslsPath);
        let catiaLiczPath = await registerSSQ(dslsInfo.ServerName, dslsInfo.ServerID, catiaSSQ, "DSLS.LicGen.v1.6.SSQ.exe");
        let caaLiczPath = await registerSSQ(dslsInfo.ServerName, dslsInfo.ServerID, caaSSQ, "DSLS.LicGen.v1.6.SSQ.exe");
        await installLiczFilePath(catiaLiczPath);
        await installLiczFilePath(caaLiczPath);
    };
    return {
        installCatia,
        installCatiaCrack,
        installCAA,
        entry,
        installVS2008,
        installDotNet
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
};

await main();