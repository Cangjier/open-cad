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

let OPEN_CAD_DIR = Path.Combine(env('userprofile'), 'OPEN_CAD');
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

let cmd_init = async () => {
    if (args.length < 2) {
        console.log("Usage: nx init <sdk_name> [project_directory]");
        return;
    }
    console.log(`args: ${args}`);
    let cadName = "nx";
    let sdkName = args[1];
    let projectDirectory = Environment.CurrentDirectory;
    let projectName = Path.GetFileName(projectDirectory);
    let script_directory = Path.GetDirectoryName(script_path);
    let cmakePath = Path.Combine(sdkDirectory, cadName, sdkName, `Find${sdkName}.cmake`);
    // 自动创建CMakeLists.txt
    let cmakeListsPath = Path.Combine(projectDirectory, "CMakeLists.txt");
    let cmakeListsText = await File.ReadAllTextAsync(Path.Combine(script_directory, "CMakeLists.txt"), utf8);
    cmakeListsText = cmakeListsText.replace("__PROJECT_NAME__", projectName);
    await File.WriteAllTextAsync(Path.Combine(projectDirectory, "CMakeLists.txt"), cmakeListsText, utf8);
    await cmdAsync(Environment.CurrentDirectory, `opencad cmake add_find_package ${cmakeListsPath} ${cmakePath}`);
    await cmdAsync(Environment.CurrentDirectory, `opencad cmake set_toolchain ${cmakeListsPath} ${Path.Combine(OPEN_CAD_DIR, "vcpkg\\scripts\\buildsystems\\vcpkg.cmake").replace("\\", "/")}`);
    // 自动创建.vscode/settings.json
    let vscodeDirectory = Path.Combine(projectDirectory, ".vscode");
    if (Directory.Exists(vscodeDirectory) == false) {
        Directory.CreateDirectory(vscodeDirectory);
    }
    let vscodeSettingsPath = Path.Combine(vscodeDirectory, "settings.json");
    let vscodeSettingsText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "settings.json"), utf8);
    await File.WriteAllTextAsync(vscodeSettingsPath, vscodeSettingsText, utf8);
    // 自动创建.vscode/c_cpp_properties.json
    // let vscodeCppPropertiesPath = Path.Combine(vscodeDirectory, "c_cpp_properties.json");
    // let vscodeCppPropertiesText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "c_cpp_properties.json"), utf8);
    // await File.WriteAllTextAsync(vscodeCppPropertiesPath, vscodeCppPropertiesText, utf8);
    // 自动创建.vscode/tasks.json
    // let vscodeTasksPath = Path.Combine(vscodeDirectory, "tasks.json");
    // let vscodeTasksText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "tasks.json"), utf8);
    // await File.WriteAllTextAsync(vscodeTasksPath, vscodeTasksText, utf8);
    // 自动创建.vscode/launch.json
    // let vscodeLaunchPath = Path.Combine(vscodeDirectory, "launch.json");
    // let vscodeLaunchText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "launch.json"), utf8);
    // await File.WriteAllTextAsync(vscodeLaunchPath, vscodeLaunchText, utf8);
    // 自动创建 main.cpp
    let mainCppPath = Path.Combine(projectDirectory, "main.cpp");
    let templateMainCppPath = Path.Combine(script_directory, "template.cpp");
    if (File.Exists(mainCppPath) == false) {
        File.Copy(templateMainCppPath, mainCppPath, true);
    }
};

let main = async () => {
    if (args.length < 1) {
        help();
        return;
    }
    let command = args[0];
    if (command == "init") {
        await cmd_init();
    }
};

await main();