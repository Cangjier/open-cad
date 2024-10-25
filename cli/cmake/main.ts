
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
    let cmakeDirectory = Path.GetDirectoryName(cmakePath);
    cmakeListsLines.splice(findPackageIndex + 1, 0, `list(APPEND CMAKE_MODULE_PATH "${cmakeDirectory.replace("\\", "/")}")`);
    // 添加find_package
    let cmakeFileName = Path.GetFileNameWithoutExtension(cmakePath);
    if (cmakeFileName.toLowerCase().startsWith("find")) {
        cmakeFileName = cmakeFileName.substring(4);
    }
    cmakeListsLines.splice(findPackageIndex + 2, 0, `find_package(${cmakeFileName} REQUIRED)`);
    // 添加到项目
    cmakeListsLines.splice(findPackageIndex + 3, 0, `target_link_libraries(\${PROJECT_NAME} INTERFACE ${cmakeFileName})`);
    await File.WriteAllTextAsync(cmakeListsPath, cmakeListsLines.join("\n"), utf8);
};

let cmd_add_find_package = async () => {
    if (args.length < 3) {
        console.log("Usage: cmake add_find_package <CMakeLists.txt> <CMakePath>");
        return;
    }
    let cmakeListsPath = args[1];
    let cmakePath = args[2];
    if (Path.GetFileName(cmakeListsPath).toLowerCase() != "cmakelists.txt") {
        console.log("The first argument must be a CMakeLists.txt file");
        return;
    }
    if (Path.GetExtension(cmakePath).toLowerCase() != ".cmake") {
        console.log("The second argument must be a .cmake file");
        return;
    }
    await addThirdParty(cmakeListsPath, cmakePath);
};

let cmd_set_toolchain = async () => {
    if (args.length < 3) {
        console.log("Usage: cmake set_toolchain <CMakeLists.txt> <CMakePath>");
        return;
    }
    let cmakeListsPath = args[1];
    let cmakePath = args[2];
    if (Path.GetFileName(cmakeListsPath).toLowerCase() != "cmakelists.txt") {
        console.log("The first argument must be a CMakeLists.txt file");
        return;
    }
    if (Path.GetExtension(cmakePath).toLowerCase() != ".cmake") {
        console.log("The second argument must be a .cmake file");
        return;
    }
    let cmakeLists = await File.ReadAllTextAsync(cmakeListsPath, utf8);
    cmakeLists = cmakeLists.replace("C:/vcpkg/scripts/buildsystems/vcpkg.cmake", cmakePath);
    await File.WriteAllTextAsync(cmakeListsPath, cmakeLists, utf8);
};

let main = async () => {
    if (args.length < 1) {
        await help();
        return
    }
    let script_directory = Path.GetDirectoryName(script_path);
    let command = args[0];
    if (command.toLowerCase() == "add_find_package") {
        await cmd_add_find_package();
    }
    else if (command.toLowerCase() == "set_toolchain") {
        await cmd_set_toolchain();
    }
    else {
        await help();
    }
};


await main();