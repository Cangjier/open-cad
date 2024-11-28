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

    return {
        install
    };
};

let installer = Installer();

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
    return {
        findHeaderDirectory,
        findSourceDirectory
    };
};

let directoryFinder = DirectoryFinder();

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
    else {
        console.log(`Unknown command: ${command}`);
        console.log("Usage: install <name>");
    }
};

await main();