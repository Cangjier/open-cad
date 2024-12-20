import { shell } from "../.tsc/Cangjie/TypeSharp/System/shell";
import { args, setLoggerPath } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Task } from "../.tsc/System/Threading/Tasks/Task";
import { File } from "../.tsc/System/IO/File";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { stringUtils } from "../.tsc/Cangjie/TypeSharp/System/stringUtils";

let utf8 = new UTF8Encoding(false);

let Rade = () => {
    let tck_initPath = "C:\\Program Files (x86)\\Dassault Systemes\\B21\\intel_a\\code\\command\\tck_init.bat";
    let build = async (frameworkDirectory: string, loggerPath: string) => {
        let sh = shell.start({
            filePath: "cmd",
            workingDirectory: frameworkDirectory
        });

        sh.writeLine(`call "${tck_initPath}" & echo ---`);
        await sh.readLinesWhen(item => {
            if (item == "---") {
                return true;
            }
            console.log(item);
            return false;
        });
        sh.writeLine("tck_list & echo ---");
        await sh.readLinesWhen(item => {
            if (item == "---") {
                return true;
            }
            console.log(item);
            return false;
        });
        sh.writeLine("tck_profile V5R21_B21 & echo ---");
        await sh.readLinesWhen(item => {
            if (item == "---") {
                return true;
            }
            console.log(item);
            return false;
        });
        sh.writeLine(`mkCI -a & echo ---`);
        await sh.readLinesWhen(item => {
            if (item == "---") {
                return true;
            }
            console.log(item);
            return false;
        });
        sh.writeLine("mkmk -a -g -u && mkrtv & echo ---");
        await sh.readLinesWhen(item => {
            if (item == "---") {
                return true;
            }
            console.log(item);
            if (loggerPath != "") {
                File.AppendAllText(loggerPath, item + "\r\n", utf8);
            }
            return false;
        });
        sh.kill();
    };
    return {
        build
    };
};

let rade = Rade();

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

let main = async () => {
    await rade.build(Environment.CurrentDirectory, parameters.logger ?? "");
};

await main();