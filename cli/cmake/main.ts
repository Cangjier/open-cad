
import { args, script_path } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";

let utf8 = new UTF8Encoding(false);
let help = async () => {
    console.log(await File.ReadAllTextAsync(Path.Combine(Path.GetDirectoryName(script_path), "Readme.md")));
};

let addThirdParty = async (cmakeListsPath: string, cmakePath: string) => {
    let cmakeLists = await File.ReadAllTextAsync(cmakeListsPath, utf8);
    let cmakeListsLines = cmakeLists.replace("\r", "").split("\n");
    let findPackageIndex = cmakeListsLines.findIndex((line) => line.includes("find_package") && line.startsWith("#"));
    if (findPackageIndex == -1) {
        throw "Could not find find_package in CMakeLists.txt";
    }
    // 添加find_package查找路径
    cmakeListsLines.splice(findPackageIndex + 1, 0, `list(APPEND CMAKE_MODULE_PATH "${cmakePath}")`);
};

let main = async () => {

    let script_directory = Path.GetDirectoryName(script_path);
    let cmakeListsPath = args[0];
    let command = args[1];

};


await main();