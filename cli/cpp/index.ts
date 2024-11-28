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

let Installer = () => {
    let cache = {};
    let validExtensions = [".h", ".cpp"];
    let getIndexJson = async () => {
        let indexJsonPath = Path.Combine(repositoryDirectory, "cpp", "index.json");
        if (cache["indexJson"] == undefined) {
            cache["indexJson"] = await Json.LoadAsync(indexJsonPath);
        }
        return cache["indexJson"];
    };
    let clone = async (url: string) => {
        let tempDirectory = Path.Combine(downloadDirectory, Guid.NewGuid().ToString());
        await cmdAsync(tempDirectory, `git clone ${url} .`);
        return tempDirectory;
    };
    let install = async (name: string, outputDirectory: string) => {
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
                    let targetPath = Path.Combine(outputDirectory, relativePath);
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
                generator = generator.replace("{output}", outputDirectory);
                await cmdAsync(outputDirectory, generator);
            }
        }
    };

    return {
        install
    };
};

let installer = Installer();

let main = async () => {
    let noArgs = args.length == 0 || (args[0] == "--application-name");
    if (noArgs) {
        if (OperatingSystem.IsLinux()) {
            // 确认是否需要注册cpp方法到.bashrc
            let bashrcPath = Path.Combine(env("userprofile"), ".bashrc");
            let bashrc = File.ReadAllText(bashrcPath, utf8);
            if (bashrc.includes("cpp()") == false) {
                console.log("是否需要注册cpp方法到.bashrc？(y/n)");
                var answer = Console.ReadLine();
                if (answer == "y") {
                    let bashrcScript = `\cpp() {\nopencad cpp "$@"\n}`;
                    File.AppendAllText(bashrcPath, bashrcScript, utf8);
                    console.log("已注册cpp方法到.bashrc");
                    console.log("请执行source ~/.bashrc");
                }
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
        await installer.install(name, Environment.CurrentDirectory);
    }
    else {
        console.log(`Unknown command: ${command}`);
        console.log("Usage: install <name>");
    }
};

await main();