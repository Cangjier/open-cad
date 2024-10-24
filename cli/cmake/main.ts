
import { args, script_path } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";

let help = () => {

};

let main = async () => {
    let utf8 = new UTF8Encoding(false);
    let script_directory = Path.GetDirectoryName(script_path);
    let projectDirectory = Environment.CurrentDirectory;
    let projectName = Path.GetFileName(projectDirectory);
    let cmakeLines = [] as string[];
    cmakeLines.push("set(MYLIBRARY_DIR \"\${CMAKE_CURRENT_LIST_DIR}\")");
    
};


await main();