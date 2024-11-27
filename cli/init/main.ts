import { args, cmdAsync, copyDirectory, script_path, execAsync, env } from "../.tsc/context";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { Environment } from "../.tsc/System/Environment";
import { EnvironmentVariableTarget } from "../.tsc/System/EnvironmentVariableTarget";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
import { OperatingSystem } from "../.tsc/System/OperatingSystem";
let utf8 = new UTF8Encoding(false);
let parameters = {} as { [key: string]: string };
for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg.startsWith("--")) {
        let key = arg.substring(2);
        if (i + 1 < args.length) {
            let value = args[i + 1];
            parameters[key] = value;
            i++;
        }
        else {
            parameters[key] = "true";
        }
    }
    else if (arg.startsWith("-")) {
        let key = arg.substring(1);
        let value = args[i + 1];
        parameters[key] = value;
        i++;
    }
}
console.log(`parameters: ${parameters}`);
let help = () => {
    console.log(File.ReadAllText(Path.Combine(Path.GetDirectoryName(script_path), "README.md"), utf8));
};

let OPEN_CAD_DIR = Path.Combine(env("userprofile"), "OPEN_CAD");

let repositoryDirectory = Path.Combine(OPEN_CAD_DIR, "repository");
if (Directory.Exists(repositoryDirectory) == false) {
    Directory.CreateDirectory(repositoryDirectory);
}
let downloadDirectory = Path.Combine(OPEN_CAD_DIR, "download");
let sdkDirectory = Path.Combine(OPEN_CAD_DIR, "sdk");
if (Directory.Exists(downloadDirectory) == false) {
    Directory.CreateDirectory(downloadDirectory);
}
if (Directory.Exists(sdkDirectory) == false) {
    Directory.CreateDirectory(sdkDirectory);
}


let GitManager = () => {
    let cache = {} as { [key: string]: any };
    let clone = async () => {
        let gitDirectory = Path.Combine(repositoryDirectory, ".git");
        if (Directory.Exists(gitDirectory)) {
            let cmd = `git pull origin master`;
            console.log(cmd);
            if ((await cmdAsync(repositoryDirectory, cmd)).exitCode != 0) {
                console.log("pull failed");
                return false;
            }
        }
        else {
            let cmd = `git clone https://github.com/Cangjier/open-cad.git .`;
            console.log(cmd);
            if ((await cmdAsync(repositoryDirectory, cmd)).exitCode != 0) {
                console.log("clone failed");
                return false;
            }
        }
        return true;
    };
    let getIndexJson = async () => {
        let indexJsonPath = Path.Combine(repositoryDirectory, "index.json");
        if (cache["indexJson"] == undefined) {
            cache["indexJson"] = await Json.LoadAsync(indexJsonPath);
        }
        return cache["indexJson"];
    };
    let getHttpProxy = async () => {
        return (await cmdAsync(Environment.CurrentDirectory, "git config --get http.proxy")).output ?? "";
    };
    let getLatestSdkName = async (cadName: string) => {
        cadName = cadName.toUpperCase();
        // 安装cad的sdk
        let indexJson = await getIndexJson();
        let sdks = indexJson.SDK[cadName] as {
            name: string,
            version: string,
            download_url: string
        }[];
        if (sdks == undefined) {
            throw `cadName ${cadName} not found`;
        }
        // 从sdks中找到最新的版本
        let sdk = sdks[0];
        return sdk.name;
    };

    return {
        clone,
        getIndexJson,
        getHttpProxy,
        getLatestSdkName
    };
};

let gitManager = GitManager();

let CMakeManager = () => {
    let checkInstalled = async () => {
        return (await cmdAsync(Environment.CurrentDirectory, "cmake --version")).output?.includes("cmake version") == true;
    };
    let install = async () => {
        try {
            console.log(`CMake Installing...`);
            let response = await axios.get("https://api.github.com/repos/Kitware/CMake/releases/latest", {
                headers: {
                    "User-Agent": "open-cad"
                }
            });
            let assets = response.data.assets;
            let asset = assets.find(item => item.name.includes("windows-x86_64.msi"));
            if (asset) {
                let browser_download_url = asset.browser_download_url;
                let download_path = Path.Combine(downloadDirectory, Path.GetFileName(browser_download_url));
                await axios.download(browser_download_url, download_path);
                await cmdAsync(downloadDirectory, `msiexec /i ${download_path} /quiet /norestart`);
            }
            else {
                throw "cmake asset not found";
            }
        }
        catch {
            console.log("CMake Install Failed");
            console.log("CMake Download: https://cmake.org/download/");
        }

    };
    return {
        checkInstalled,
        install
    };
};

let cmakeManager = CMakeManager();

let VsCodeManager = () => {
    let checkInstalled = async () => {
        let result = await cmdAsync(Environment.CurrentDirectory, "code --version");
        console.log(result);
        if (result.output != undefined) {
            if (result.output.length > 0) {
                return true;
            }
        }
        return false;
    };
    let install = async () => {
        try {
            console.log(`VsCode Installing...`);
            let download_path = Path.Combine(downloadDirectory, "vs_code.exe");
            await axios.download("https://code.visualstudio.com/sha/download?build=stable&os=win32-x64", download_path);
            // 静态安装，要求挂载右键菜单
            await cmdAsync(downloadDirectory, `start /wait ${download_path} /VERYSILENT /MERGETASKS=!runcode,addcontextmenufiles,addcontextmenufolders`);
        }
        catch {
            console.log("VsCode Install Failed");
            console.log("VsCode Download: https://code.visualstudio.com/download");
        }
    };
    return {
        checkInstalled,
        install
    };
};

let vscodeManager = VsCodeManager();

let VisualStudioManager = () => {
    let checkInstalled = async () => {
        let vswhere = Path.Combine(Environment.GetEnvironmentVariable("ProgramFiles(x86)"), "Microsoft Visual Studio", "Installer", "vswhere.exe");
        return File.Exists(vswhere);
    };
    let install = async () => {
        console.log("VisualStudio Download: https://visualstudio.microsoft.com/zh-hans/downloads/");
    };
    let resgiterEnvironment = async () => {
        // 检查所有Visual Studio的版本是否正确注册环境变量
        let vswhere = Path.Combine(Environment.GetEnvironmentVariable("ProgramFiles(x86)"), "Microsoft Visual Studio", "Installer", "vswhere.exe");
        if (File.Exists(vswhere) == false) {
            return;
        }
        console.log(`resgiterEnvironment`);
        let cmdResult = await cmdAsync(Path.GetDirectoryName(vswhere), `${Path.GetFileName(vswhere)} -latest -products * -requires Microsoft.Component.MSBuild -property installationPath`);
        if (cmdResult.output && cmdResult.output.length > 0) {
            let installationPath = cmdResult.output;
            console.log(`installationPath: ${installationPath}`);
            let vcvarsall = [installationPath, "VC", "Auxiliary", "Build", "vcvarsall.bat"].join("\\");
            let vcvarsallx86 = [installationPath, "VC", "Auxiliary", "Build", "vcvarsall.bat"].join("\\");
            let vsDevCmd = Path.Combine(installationPath, "Common7", "Tools", "VsDevCmd.bat");
            let vsDevCmdx86 = Path.Combine(installationPath, "Common7", "Tools", "VsDevCmd.bat");
            console.log(`vcvarsall: ${vcvarsall}`);
            console.log(`vcvarsallx86: ${vcvarsallx86}`);
            console.log(`vsDevCmd: ${vsDevCmd}`);
            console.log(`vsDevCmdx86: ${vsDevCmdx86}`);
            if (File.Exists(vcvarsall) && File.Exists(vcvarsallx86)) {
                if (Environment.GetEnvironmentVariable("VCVARSALL") == null) {
                    Environment.SetEnvironmentVariable("VCVARSALL", vcvarsall, EnvironmentVariableTarget.User);
                }
                if (Environment.GetEnvironmentVariable("VCVARSALLX86") == null) {
                    Environment.SetEnvironmentVariable("VCVARSALLX86", vcvarsallx86, EnvironmentVariableTarget.User);
                }
            }
            if (File.Exists(vsDevCmd) && File.Exists(vsDevCmdx86)) {
                if (Environment.GetEnvironmentVariable("VSDEVCMD") == null) {
                    Environment.SetEnvironmentVariable("VSDEVCMD", vsDevCmd, EnvironmentVariableTarget.User);
                }
                if (Environment.GetEnvironmentVariable("VSDEVCMDX86") == null) {
                    Environment.SetEnvironmentVariable("VSDEVCMDX86", vsDevCmdx86, EnvironmentVariableTarget.User);
                }
            }
            // 设置 VSINSTALLDIR 环境变量
            if (Environment.GetEnvironmentVariable("VSINSTALLDIR") == null) {
                Environment.SetEnvironmentVariable("VSINSTALLDIR", installationPath, EnvironmentVariableTarget.User);
            }
        }
    };
    return {
        checkInstalled,
        install,
        resgiterEnvironment
    };
};

let visualStudioManager = VisualStudioManager();

let VcpkgManager = () => {
    let checkInstalled = async () => {
        let cmdResult = await cmdAsync(Environment.CurrentDirectory, "vcpkg version");
        if (cmdResult.output && cmdResult.output.trim().length > 0) {
            return true;
        }
        return false;
    };
    let install = async () => {
        let vcpkgDirectory = Path.Combine(OPEN_CAD_DIR, "vcpkg");
        if (Directory.Exists(vcpkgDirectory) == false) {
            Directory.CreateDirectory(vcpkgDirectory);
        }
        let gitDirectory = Path.Combine(vcpkgDirectory, ".github");
        if (Directory.Exists(gitDirectory) == false) {
            console.log("vcpkg Installing...");
            let cmd = `git clone --depth 1 https://github.com/microsoft/vcpkg.git .`;
            console.log(cmd);
            if ((await cmdAsync(vcpkgDirectory, cmd)).exitCode != 0) {
                console.log("clone failed");
                return;
            }
            let proxyInfo = await gitManager.getHttpProxy();
            if (proxyInfo.trim() != "") {
                // 在bootstrap-vcpkg.bat 中添加代理
                let bootstrapVcpkgPath = Path.Combine(vcpkgDirectory, "bootstrap-vcpkg.bat");
                let bootstrapLines = [...await File.ReadAllLinesAsync(bootstrapVcpkgPath, utf8)];
                bootstrapLines.splice(1, 0, `set https_proxy=${proxyInfo}`);
                await File.WriteAllTextAsync(bootstrapVcpkgPath, bootstrapLines.join("\n"), utf8);
            }
            await cmdAsync(vcpkgDirectory, `bootstrap-vcpkg.bat`);
            if (proxyInfo.trim() != "") {
                // 恢复bootstrap-vcpkg.bat
                let bootstrapVcpkgPath = Path.Combine(vcpkgDirectory, "bootstrap-vcpkg.bat");
                let bootstrapLines = [...await File.ReadAllLinesAsync(bootstrapVcpkgPath, utf8)];
                bootstrapLines.splice(1, 1);
                await File.WriteAllTextAsync(bootstrapVcpkgPath, bootstrapLines.join("\n"), utf8);
            }
        }
        var vcpkg_root = Environment.GetEnvironmentVariable("VCPKG_ROOT");
        if (vcpkg_root == null) {
            Environment.SetEnvironmentVariable("VCPKG_ROOT", vcpkgDirectory, EnvironmentVariableTarget.User);
        }
        var path = Environment.GetEnvironmentVariable("Path");
        if ((path == null) || (path.includes(vcpkgDirectory) == false)) {
            Environment.SetEnvironmentVariable("Path", `${vcpkgDirectory};${path}`, EnvironmentVariableTarget.User);
        }
    };
    return {
        checkInstalled,
        install
    };
};

let vcpkgManager = VcpkgManager();

let SDKManager = () => {
    let installSDK = async (sdkName: string, cadVersion: string) => {
        // 安装cad的sdk
        let indexJson = await gitManager.getIndexJson();
        let sdkKeys = Object.keys(indexJson.SDK);
        let formatSDKName = sdkKeys.find(item => item.toUpperCase() == sdkName.toUpperCase());
        if (formatSDKName == undefined) {
            throw `SDK ${sdkName} not found`;
        }
        let sdks = indexJson.SDK[formatSDKName] as {
            name: string,
            version: string,
            download_url: string
        }[];
        if (sdks == undefined) {
            throw `SDKName ${formatSDKName} not found`;
        }
        // 从sdks中找到最新的版本
        let sdk = {} as {
            name: string,
            version: string,
            download_url: string,
            dependency?: {
                sdkName: string,
                version: string
            }[]
        } | undefined;
        if (cadVersion == "latest") {
            sdk = sdks[0];
        }
        else {
            sdk = sdks.find(item => item.version == cadVersion);
        }
        if (sdk == undefined) {
            throw `cadVersion ${cadVersion} not found`;
        }

        let download_path = Path.Combine(downloadDirectory, Path.GetFileName(sdk.download_url));
        let cadDirectory = Path.Combine(sdkDirectory, formatSDKName);
        let cadSdkDirectory = Path.Combine(cadDirectory, sdk.name);
        if ((Directory.Exists(cadSdkDirectory) == false) || ((Directory.GetFiles(cadSdkDirectory).length == 0) && (Directory.GetDirectories(cadSdkDirectory).length == 0))) {
            console.log(`downloading ${sdk.download_url} to ${download_path}`);
            await axios.download(sdk.download_url, download_path);
            console.log(`downloaded ${download_path}`);
            if (Directory.Exists(cadDirectory) == false) {
                Directory.CreateDirectory(cadDirectory);
            }
            await zip.extract(download_path, cadSdkDirectory);
            File.Delete(download_path);
        }
        if (File.Exists(Path.Combine(cadSdkDirectory, `Find${Path.GetFileName(cadSdkDirectory)}.cmake`)) == false) {
            console.log(`generating Find${Path.GetFileName(cadSdkDirectory)}.cmake`);
            await cmdAsync(cadSdkDirectory, `opencad find-cmake`);
        }

        return sdk;
    };
    let install = async (cadName: string, cadVersion: string) => {
        let sdk = await installSDK(cadName, cadVersion);
        if (sdk.dependency) {
            for (let item of sdk.dependency) {
                await installSDK(item.sdkName, item.version);
            }
        }
        return sdk;
    };
    return {
        install
    };
};

let sdkManager = SDKManager();

let main = async () => {
    if (await gitManager.clone() == false) {
        return;
    }

    if (args.length < 1) {
        help();
        return;
    }

    axios.setDefaultProxy();

    let cadName = args[0];

    let cadVersion = args.length > 1 ? args[1] : "latest";
    if (cadVersion.startsWith("-")) {
        cadVersion = "latest";
    }

    // 安装cad的sdk
    let cadSDK = await sdkManager.install(cadName, cadVersion);

    // 检查是否安装了cmake
    if (OperatingSystem.IsWindows()) {
        if (await cmakeManager.checkInstalled() == false) {
            await cmakeManager.install();
        }
        // 检查是否安装了vscode
        if (await vscodeManager.checkInstalled() == false) {
            await vscodeManager.install();
        }
        // 检查是否安装了vcpkg
        if (await vcpkgManager.checkInstalled() == false) {
            await vcpkgManager.install();
        }
        // 检查是否安装了visual studio
        if (await visualStudioManager.checkInstalled() == false) {
            await visualStudioManager.install();
        }
        // 检查visual studio环境变量
        await visualStudioManager.resgiterEnvironment();
    }
    await cmdAsync(Environment.CurrentDirectory, `opencad ${cadName}-init init ${cadSDK.name}`);

};

await main();
