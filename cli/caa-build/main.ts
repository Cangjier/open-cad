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
        await Task.Delay(1000);
        sh.writeLine(`call "${tck_initPath}"`);
        await Task.Delay(1000);
        console.log(sh.readLines());
        sh.writeLine("tck_list");
        await Task.Delay(1000);
        console.log(sh.readLines());
        sh.writeLine("tck_profile V5R21_B21");
        await Task.Delay(1000);
        console.log(sh.readLines());
        sh.writeLine("mkmk -a -g -u && mkrtv");
        await Task.Delay(12000);
        console.log(sh.readLines());
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