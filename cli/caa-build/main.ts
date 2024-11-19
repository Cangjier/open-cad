import { shell } from "../.tsc/Cangjie/TypeSharp/System/shell";
import { args } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Task } from "../.tsc/System/Threading/Tasks/Task";

let Rade = () => {
    let tck_initPath = "C:\\Program Files (x86)\\Dassault Systemes\\B21\\intel_a\\code\\command\\tck_init.bat";
    let build = async (frameworkDirectory: string) => {
        let sh = shell.start({
            filePath: "cmd",
            workingDirectory: frameworkDirectory
        });
        sh.writeLine(`call "${tck_initPath}" & echo ---`);
        console.log(await sh.readLinesWhen(item => item == "---"));
        sh.writeLine("tck_list && echo ---");
        console.log(await sh.readLinesWhen(item => item == "---"));
        sh.writeLine("tck_profile V5R21_B21 & echo ---");
        console.log(await sh.readLinesWhen(item => item == "---"));
        sh.writeLine("mkmk -a -g -u && mkrtv & echo ---");
        console.log(await sh.readLinesWhen(item => item == "---"));
        sh.kill();
    };
    return {
        build
    };
};

let rade = Rade();

let main = async () => {
    await rade.build(Environment.CurrentDirectory);
};

await main();