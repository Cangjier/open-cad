import { args } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Guid } from "../.tsc/System/Guid";
import { Directory } from "../.tsc/System/IO/Directory";
import { Path } from "../.tsc/System/IO/Path";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";

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


let main = async () => {
    if (args.length < 1 || (args[0].startsWith("-"))) {
        console.log("Usage: <manifestPath> --input <inputPath> --output <outputPath> --logger <loggerPath>");
        return;
    }
    let manifestPath = args[0];
    let manifest = Json.Load(manifestPath);
    let activeConfig = manifest.configs.find(item => item.name == manifest.activeConfig);
    if (activeConfig == undefined) {
        console.log("Active config not found");
        return;
    }
    let tempDirectory = Path.Combine(Environment.CurrentDirectory, "debug", manifest.activeConfig);
    Directory.CreateDirectory(tempDirectory);



};

await main();