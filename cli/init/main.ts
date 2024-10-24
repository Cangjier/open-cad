import { args, cmdAsync, copyDirectory, script_path } from "../.tsc/context";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { Environment } from "../.tsc/System/Environment";
import { EnvironmentVariableTarget } from "../.tsc/System/EnvironmentVariableTarget";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
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

let OPEN_CAD_DIR = "C:\\OPEN_CAD";
if (Environment.GetEnvironmentVariable("OPEN_CAD_DIR") == null) {
    Environment.SetEnvironmentVariable("OPEN_CAD_DIR", OPEN_CAD_DIR, EnvironmentVariableTarget.User);
}
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
    let clone = async () => {
        let gitDirectory = Path.Combine(repositoryDirectory, ".git");
        if (Directory.Exists(gitDirectory)) {
            let cmd = `git pull origin master`;
            console.log(cmd);
            if (await cmdAsync(repositoryDirectory, cmd) != 0) {
                console.log("pull failed");
                return false;
            }
        }
        else {
            let cmd = `git clone https://github.com/Cangjier/open-cad.git .`;
            console.log(cmd);
            if (await cmdAsync(repositoryDirectory, cmd) != 0) {
                console.log("clone failed");
                return false;
            }
        }
        return true;
    };
    let getIndexJson = async () => {
        let indexJsonPath = Path.Combine(repositoryDirectory, "index.json");
        return await Json.LoadAsync(indexJsonPath);
    };
    let getHttpProxy = async () => {
        let output = {} as { lines: string[] };
        await cmdAsync(Environment.CurrentDirectory, "git config --get http.proxy", output);
        if (output.lines && output.lines.length > 0) {
            return output.lines[0];
        }
        return "";
    };

    return {
        clone,
        getIndexJson,
        getHttpProxy
    };
};

let gitManager = GitManager();


let main = async () => {
    if (await gitManager.clone() == false) {
        return;
    }
    let script_directory = Path.GetDirectoryName(script_path);
    let cadName = args[0];
    let projectDirectory = "";
    if (args.length > 1 && args[1].startsWith("--") == false) {
        projectDirectory = args[1];
        if (projectDirectory == "." || projectDirectory == "./") {
            projectDirectory = Environment.CurrentDirectory;
        }
    }
    let indexJson = await gitManager.getIndexJson();
    let sdks = indexJson.SDK[cadName.toUpperCase()] as {
        name: string,
        version: string,
        download_url: string
    }[];
    if (sdks == undefined) {
        console.log(`cadName ${cadName} not found`);
        return;
    }
    // 从sdks中找到最新的版本
    let sdk = sdks[0];
    let proxyInfo = await gitManager.getHttpProxy();
    if (proxyInfo != "") {
        console.log(`http.proxy: ${proxyInfo}`);
        axios.setProxy(proxyInfo);
    }
    let download_path = Path.Combine(downloadDirectory, Path.GetFileName(sdk.download_url));
    let cadDirectory = Path.Combine(sdkDirectory, cadName);
    let cadSdkDirectory = Path.Combine(cadDirectory, sdk.name);
    if (Directory.Exists(cadSdkDirectory) == false || Directory.GetFiles(cadSdkDirectory).length == 0) {
        console.log(`downloading ${sdk.download_url} to ${download_path}`);
        await axios.download(sdk.download_url, download_path);
        console.log(`downloaded ${download_path}`);
        if (Directory.Exists(cadDirectory) == false) {
            Directory.CreateDirectory(cadDirectory);
        }
        await zip.extract(download_path, cadSdkDirectory);
        File.Delete(download_path);
    }

    // 自动创建CMakeLists.txt
    let cmakeListsText = await File.ReadAllTextAsync(Path.Combine(script_directory, "CMakeLists.txt"), utf8);
    await File.WriteAllTextAsync(Path.Combine(projectDirectory, "CMakeLists.txt"), cmakeListsText, utf8);
    // 自动创建.vscode/settings.json
    let vscodeDirectory = Path.Combine(projectDirectory, ".vscode");
    if (Directory.Exists(vscodeDirectory) == false) {
        Directory.CreateDirectory(vscodeDirectory);
    }
    let vscodeSettingsPath = Path.Combine(vscodeDirectory, "settings.json");
    let vscodeSettingsText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "settings.json"), utf8);
    await File.WriteAllTextAsync(vscodeSettingsPath, vscodeSettingsText, utf8);
    // 自动创建.vscode/c_cpp_properties.json
    let vscodeCppPropertiesPath = Path.Combine(vscodeDirectory, "c_cpp_properties.json");
    let vscodeCppPropertiesText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "c_cpp_properties.json"), utf8);
    await File.WriteAllTextAsync(vscodeCppPropertiesPath, vscodeCppPropertiesText, utf8);
    // 自动创建.vscode/tasks.json
    let vscodeTasksPath = Path.Combine(vscodeDirectory, "tasks.json");
    let vscodeTasksText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "tasks.json"), utf8);
    await File.WriteAllTextAsync(vscodeTasksPath, vscodeTasksText, utf8);
    // 自动创建.vscode/launch.json
    let vscodeLaunchPath = Path.Combine(vscodeDirectory, "launch.json");
    let vscodeLaunchText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "launch.json"), utf8);
    await File.WriteAllTextAsync(vscodeLaunchPath, vscodeLaunchText, utf8);
};

await main();