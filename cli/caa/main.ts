import { args, cmdAsync, copyDirectory, script_path } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { EnvironmentVariableTarget } from "../.tsc/System/EnvironmentVariableTarget";
let utf8 = new UTF8Encoding(false);


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

let ProjectManager = () => {
    let createFramework = async (projectDirectory: string, frameworkName: string) => {
        
    };
};

let cmd_package_sdk = async () => {
    if (args.length < 3) {
        console.log("Usage: caa package-sdk <CatiaDirectory> <OutputDirectory>");
        return;
    }
    let catiaDirectory = args[1];
    let outputDirectory = args[2];
    if (Directory.Exists(catiaDirectory) == false) {
        console.log(`Catia directory does not exist: ${catiaDirectory}`);
        return;
    }
    if (Directory.Exists(outputDirectory) == false) {
        Directory.CreateDirectory(outputDirectory);
    }
    let directories = Directory.GetDirectories(catiaDirectory);
    let frameworkDirectories = [] as string[];
    for (let directory of directories) {
        let identityCard = Path.Combine(directory, "IdentityCard");
        if (Directory.Exists(identityCard)) {
            frameworkDirectories.push(directory);
        }
        else {
            let subDirectories = Directory.GetDirectories(directory);
            if (subDirectories.findIndex(item => item.endsWith(".m")) != -1) {
                frameworkDirectories.push(directory);
            }
        }
    }
    let index = 0;
    for (let directory of frameworkDirectories) {
        console.log(`${index++}/${frameworkDirectories.length}: ${directory}`);
        copyDirectory(directory, Path.Combine(outputDirectory, Path.GetFileName(directory)));
    }
    let catiaVersion = Path.GetFileName(catiaDirectory);
    if (catiaVersion.startsWith("B")) {
        catiaVersion = catiaVersion.substring(1);
    }
    let projectName = `CAA${catiaVersion}`;
    let templateContent = await File.ReadAllTextAsync(Path.Combine(Path.GetDirectoryName(script_path), "SDK", "CMakeLists.txt"), utf8);
    templateContent = templateContent.replace("__PROJECT_NAME__", projectName);
    await File.WriteAllTextAsync(Path.Combine(outputDirectory, "CMakeLists.txt"), templateContent, utf8);
};
let cmd_init = async () => {
    if (args.length < 2) {
        console.log("Usage: caa init <sdk_name> [project_directory]");
        return;
    }
    console.log(`args: ${args}`);
    let cadName = "caa";
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
    if (args.length < 2) {
        console.log("Usage: caa <command>");
        return;
    }
    let command = args[0];
    if (command.toLowerCase() == "package-sdk") {
        await cmd_package_sdk();
    }
    else {
        console.log("Unknown command");
    }
};

await main();

//tscl run E:\Downloads\Temp\open-cad\cli\caa\main.ts package-sdk C:\Users\ELEAD-33\Downloads\李东明\B21  E:\Downloads\李东明\SDK