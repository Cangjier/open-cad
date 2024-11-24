import { args, script_path, setLoggerPath } from "../.tsc/context";
import { DateTime } from "../.tsc/System/DateTime";
import { Path } from "../.tsc/System/IO/Path";
import { cryptography } from "../.tsc/Cangjie/TypeSharp/System/cryptography";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { File } from "../.tsc/System/IO/File";



let main = async () => {
    if (args.length < 4) {
        console.log("Usage: plugin <inputPath> <outputPath> <loggerPath> <server>");
        return;
    }

    let inputPath = args[0];
    let outputPath = args[1];
    let loggerPath = args[2];
    let server = args[3];

    // setLoggerPath(loggerPath);
    let script_directory = Path.GetDirectoryName(script_path);
    let input = Json.Load(inputPath);
    console.log(input);
    let output = {

    };
    File.WriteAllText(outputPath, JSON.stringify(output));
};

await main();