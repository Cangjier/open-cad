import { args, cmdAsync, copyDirectory, script_path, execAsync, env, deleteDirectory } from "../.tsc/context";
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
import { shell } from "../.tsc/Cangjie/TypeSharp/System/shell";
import { Guid } from "../.tsc/System/Guid";
import { SearchOption } from "../.tsc/System/IO/SearchOption";
import { Console } from "../.tsc/System/Console";
import { stringUtils } from "../.tsc/Cangjie/TypeSharp/System/stringUtils";
let OPEN_CAD_DIR = Path.Combine(env("userprofile"), "OPEN_CAD");
let utf8 = new UTF8Encoding(false);
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

let DirectoryFinder = () => {
    let isSourceDirectory = (path: string) => {
        return Directory.GetFiles(path, "*.cpp").length > 0;
    };
    let isHeaderDirectory = (path: string) => {
        return Directory.GetFiles(path, "*.h").length > 0;
    };
    let findHeaderDirectory = (path: string) => "";
    findHeaderDirectory = (path: string) => {
        if (isHeaderDirectory(path)) {
            return path;
        }
        let subDirectories = Directory.GetDirectories(path);
        for (let subDirectory of subDirectories) {
            if (isHeaderDirectory(subDirectory)) {
                return subDirectory;
            }
        }
        let parentPath = Path.GetDirectoryName(path);
        if ((stringUtils.trimEnd(parentPath, "/") == "") || (stringUtils.trimEnd(parentPath, "/").endsWith(":"))) {
            return "";
        }
        return findHeaderDirectory(parentPath);
    };
    let findSourceDirectory = (path: string) => "";
    findSourceDirectory = (path: string) => {
        if (isSourceDirectory(path)) {
            return path;
        }
        let subDirectories = Directory.GetDirectories(path);
        for (let subDirectory of subDirectories) {
            if (isSourceDirectory(subDirectory)) {
                return subDirectory;
            }
        }
        let parentPath = Path.GetDirectoryName(path);
        if ((stringUtils.trimEnd(parentPath, "/") == "") || (stringUtils.trimEnd(parentPath, "/").endsWith(":"))) {
            return "";
        }
        return findSourceDirectory(parentPath);
    };
    let findVsCodeDirectory = (path: string) => "";
    findVsCodeDirectory = (path: string) => {
        let directories = Directory.GetDirectories(path);
        for (let directory of directories) {
            if (Path.GetFileName(directory) == ".vscode") {
                return directory;
            }
        }
        let parentPath = Path.GetDirectoryName(path);
        if (parentPath == "" || parentPath == "/" || parentPath.endsWith(":")) {
            return "";
        }

        return findVsCodeDirectory(parentPath);
    };
    return {
        findHeaderDirectory,
        findSourceDirectory,
        findVsCodeDirectory
    };
};

let directoryFinder = DirectoryFinder();

let SDKManager = () => {
    let getIndexJson = async () => {
        let indexJsonPath = Path.Combine(repositoryDirectory, "index.json");
        return await Json.LoadAsync(indexJsonPath);
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
    let _createLowerCaseLink = (baseDirectory: string, directory: string, cmds: string[]) => { };
    _createLowerCaseLink = (baseDirectory: string, directory: string, cmds: string[]) => {
        // 创建小写的符号链接
        // ln -s /home/user/Project /home/user/project
        let name = Path.GetFileName(directory);
        let lowerName = name.toLowerCase();

        if (name != lowerName) {
            let baseRelativeDirectory = Path.GetRelativePath(baseDirectory, directory);
            if (baseRelativeDirectory != ".") {
                let lowerDirectory = Path.Combine(baseDirectory, baseRelativeDirectory.toLowerCase());
                cmds.push(`ln -s "${directory}" "${lowerDirectory}"`);
            }

        }
        let files = Directory.GetFiles(directory);
        for (let file of files) {
            let fileName = Path.GetFileName(file);
            let lowerFileName = fileName.toLowerCase();
            let baseRelativeFileName = Path.GetRelativePath(baseDirectory, file);
            if (fileName != lowerFileName) {
                let lowerFile = Path.Combine(baseDirectory, baseRelativeFileName.toLowerCase());
                cmds.push(`ln -s "${file}" "${lowerFile}"`);
            }
        }
        let directories = Directory.GetDirectories(directory);
        for (let subDirectory of directories) {
            _createLowerCaseLink(baseDirectory, subDirectory, cmds);
        }
    };
    let createLowerCaseLink = async (directory: string) => {
        let cmds = [] as string[];
        _createLowerCaseLink(directory, directory, cmds);
        let cmdScope = cmds.join("\n");
        let shPath = Path.Combine(directory, "createLowerCaseLink.sh");
        console.log(shPath);
        await File.WriteAllTextAsync(shPath, cmdScope, utf8);
        await cmdAsync(directory, `chmod +x createLowerCaseLink.sh`);
        await cmdAsync(directory, `./createLowerCaseLink.sh`);
    };
    let words = [
        "string",
        "spec"
    ];
    let pascalCase = (name: string) => {
        for (let word of words) {
            if (name.includes(word) == false) {
                continue;
            }
            name = name.replace(word, word[0].toUpperCase() + word.substring(1));
        }
        return name;
    };
    let _createPascalCaseLink = (baseDirectory: string, directory: string, cmds: string[]) => { };
    _createPascalCaseLink = (baseDirectory: string, directory: string, cmds: string[]) => {
        let files = Directory.GetFiles(directory);
        for (let file of files) {
            let fileName = Path.GetFileName(file);
            let formatFileName = pascalCase(Path.GetFileNameWithoutExtension(file)) + Path.GetExtension(file);
            if (fileName != formatFileName) {
                let formatFile = Path.Combine(Path.GetDirectoryName(file), formatFileName);
                cmds.push(`ln -s "${file}" "${formatFile}"`);
            }
        }
        let directories = Directory.GetDirectories(directory);
        for (let subDirectory of directories) {
            _createPascalCaseLink(baseDirectory, subDirectory, cmds);
        }
    };
    let createPascalCaseLink = async (directory: string) => {
        let cmds = [] as string[];
        _createPascalCaseLink(directory, directory, cmds);
        let cmdScope = cmds.join("\n");
        let shPath = Path.Combine(directory, "createPascalCaseLink.sh");
        console.log(shPath);
        await File.WriteAllTextAsync(shPath, cmdScope, utf8);
        await cmdAsync(directory, `chmod +x createPascalCaseLink.sh`);
        await cmdAsync(directory, `./createPascalCaseLink.sh`);
    };
    let installSDK = async (sdkName: string, cadVersion: string) => {
        console.log(`InstallSDK ${sdkName} ${cadVersion}`);
        // 安装cad的sdk
        let indexJson = await getIndexJson();
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
            installDirectory?: string,
            linkCase?: {
                lowerCase?: boolean,
                pascalCase?: boolean
            },
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
        sdk.installDirectory = cadSdkDirectory;
        if ((Directory.Exists(cadSdkDirectory) == false) || ((Directory.GetFiles(cadSdkDirectory).length == 0) && (Directory.GetDirectories(cadSdkDirectory).length == 0))) {
            console.log(`downloading ${sdk.download_url} to ${download_path}`);
            await axios.download(sdk.download_url, download_path);
            console.log(`downloaded ${download_path}`);
            if (Directory.Exists(cadDirectory) == false) {
                Directory.CreateDirectory(cadDirectory);
            }
            await zip.extract(download_path, cadSdkDirectory);
            File.Delete(download_path);
            if (OperatingSystem.IsLinux()) {
                if (sdk.linkCase?.lowerCase) {
                    await createLowerCaseLink(cadSdkDirectory);
                }
                if (sdk.linkCase?.pascalCase) {
                    await createPascalCaseLink(cadSdkDirectory);
                }
            }
        }
        if (File.Exists(Path.Combine(cadSdkDirectory, `Find${Path.GetFileName(cadSdkDirectory)}.cmake`)) == false) {
            console.log(`generating Find${Path.GetFileName(cadSdkDirectory)}.cmake`);
            await cmdAsync(cadSdkDirectory, `opencad find-cmake`);
        }
        console.log(`Installed ${sdk.name}`);
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
        install,
        createLowerCaseLink,
        pascalCase
    };
};

let sdkManager = SDKManager();

let Installer = () => {
    let cache = {};
    let validExtensions = [".h", ".cpp"];
    let isHeader = (file: string) => {
        return file.endsWith(".h");
    };
    let isSource = (file: string) => {
        return file.endsWith(".cpp");
    };
    let cloneSelf = async () => {
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
        let indexJsonPath = Path.Combine(repositoryDirectory, "cpp", "index.json");
        if (cache["indexJson"] == undefined) {
            cache["indexJson"] = await Json.LoadAsync(indexJsonPath);
        }
        return cache["indexJson"];
    };
    let clone = async (url: string) => {
        let tempDirectory = Path.Combine(downloadDirectory, Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempDirectory);
        await cmdAsync(tempDirectory, `git clone ${url} .`);
        return tempDirectory;
    };
    let install = async (name: string, headerDirectory: string, sourceDirectory: string) => {
        await cloneSelf();
        let indexJson = await getIndexJson();
        let sdks = indexJson["SDK"];
        let sdk = sdks.find(x => x["name"] == name);
        if (sdk) {
            let url = sdk["url"];
            let tempDirectory = await clone(url);
            let files = Directory.GetFiles(tempDirectory, "*.*", SearchOption.AllDirectories);
            for (let file of files) {
                let extension = Path.GetExtension(file);
                if (validExtensions.includes(extension)) {
                    let relativePath = Path.GetRelativePath(tempDirectory, file);
                    let targetPath = "";
                    if (isHeader(file)) {
                        targetPath = Path.Combine(headerDirectory, relativePath);
                    }
                    else if (isSource(file)) {
                        targetPath = Path.Combine(sourceDirectory, relativePath);
                    }
                    let targetDirectory = Path.GetDirectoryName(targetPath);
                    if (Directory.Exists(targetDirectory) == false) {
                        Directory.CreateDirectory(targetDirectory);
                    }
                    File.Copy(file, targetPath, true);
                }
            }
            deleteDirectory(tempDirectory);
            let generator = sdk["generator"];
            if (generator) {
                generator = generator.replace("{header}", headerDirectory);
                generator = generator.replace("{source}", sourceDirectory);
                console.log(generator);
                await cmdAsync(Environment.CurrentDirectory, generator);
            }
        }
        else {
            console.log(`SDK ${name} not found`);
        }
    };
    let installSDK = async (name: string, version: string) => {
        await cloneSelf();
        let sdk = await sdkManager.install(name, version);
        if (sdk.installDirectory) {
            let vsCodeDirectory = directoryFinder.findVsCodeDirectory(Environment.CurrentDirectory);
            if (vsCodeDirectory == "") {
                console.log("vscode directory not found");
                return;
            }
            let cppPropertiesPath = Path.Combine(vsCodeDirectory, "c_cpp_properties.json");
            let cppProperties = Json.Load(cppPropertiesPath);
            let configurations = cppProperties["configurations"];
            if (configurations == undefined) {
                configurations = [];
                cppProperties["configurations"] = configurations;
            }
            if (configurations.length == 0) {
                configurations.push({
                    "name": "Linux",
                    "includePath": [
                        "${workspaceFolder}/**",
                        `${sdk.installDirectory}/**`
                    ],
                    "defines": [],
                    "compilerPath": "/usr/bin/x86_64-w64-mingw32-g++",
                    "cStandard": "c11",
                    "cppStandard": "c++17",
                    "intelliSenseMode": "gcc-x64"
                });
            }
            else {
                let firstCppPropert = cppProperties["configurations"][0];
                if (firstCppPropert.includePath == undefined) {
                    firstCppPropert.includePath = [];
                }
                firstCppPropert.includePath.push(`${sdk.installDirectory}/**`);
            }
            File.WriteAllText(cppPropertiesPath, JSON.stringify(cppProperties), utf8);
        }
        else {
            console.log(`SDK ${name} ${version} not found`);
        }
    };

    return {
        install,
        installSDK
    };
};

let installer = Installer();

let main = async () => {
    let noArgs = args.length == 0 || (args[0] == "--application-name");
    if (OperatingSystem.IsLinux()) {
        // 确认是否需要注册cpp方法到.bashrc
        let bashrcPath = Path.Combine(env("userprofile"), ".bashrc");
        let bashrc = File.ReadAllText(bashrcPath, utf8);
        if (bashrc.includes("cpp()") == false) {
            console.log("是否需要注册cpp方法到.bashrc？(y/n)");
            var answer = Console.ReadLine();
            if (answer == "y") {
                let bashrcScript = `\ncpp() {\nopencad cpp "$@"\n}`;
                File.AppendAllText(bashrcPath, bashrcScript, utf8);
                console.log("已注册cpp方法到.bashrc");
                console.log("请执行source ~/.bashrc");
            }
        }
    }
    if (noArgs || args.length == 0) {
        console.log("Usage: install <name>");
        return;
    }
    let command = args[0];
    if (command == "install") {
        if (args.length < 2 || (args[1].startsWith("--"))) {
            console.log("Usage: install <name>");
            return;
        }
        let name = args[1];
        let inputHeaderPath = parameters["header"];
        if (inputHeaderPath == undefined) {
            let adviseHeaderPath = directoryFinder.findHeaderDirectory(Directory.GetCurrentDirectory());
            if (adviseHeaderPath == "") {
                adviseHeaderPath = Directory.GetCurrentDirectory();
            }
            console.log(`Please input header file path: (${adviseHeaderPath})`);
            var headerPath = Console.ReadLine();
            if (headerPath == "") {
                headerPath = adviseHeaderPath
            }

            inputHeaderPath = headerPath;
        }
        let inputSourcePath = parameters["source"];
        if (inputSourcePath == undefined) {
            let adviseSourcePath = directoryFinder.findSourceDirectory(Directory.GetCurrentDirectory());
            if (adviseSourcePath == "") {
                adviseSourcePath = Directory.GetCurrentDirectory();
            }
            console.log(`Please input source file path: (${adviseSourcePath})`);
            var sourcePath = Console.ReadLine();
            if (sourcePath == "") {
                sourcePath = adviseSourcePath
            }

            inputSourcePath = sourcePath;
        }
        if (Directory.Exists(inputHeaderPath) == false) {
            console.log("The header file path is not exist.");
            return;
        }
        if (Directory.Exists(inputSourcePath) == false) {
            console.log("The source file path is not exist.");
            return;
        }
        await installer.install(name, inputHeaderPath, inputSourcePath);
    }
    else if (command == "install-sdk") {
        if (args.length < 3 || (args[1].startsWith("--"))) {
            console.log("Usage: sdk <name> [version]");
            return;
        }
        let name = args[1];
        let version = args[2];
        if (version.startsWith("--")) {
            version = "latest";
        }
        await installer.installSDK(name, version);
    }
    else {
        console.log(`Unknown command: ${command}`);
        console.log("Usage: install <name>");
    }
};

await main();