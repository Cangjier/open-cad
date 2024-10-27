import { args, copyDirectory, script_path } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
let utf8 = new UTF8Encoding(false);
let cmd_package_sdk = async () => {
    if (args.length < 3) {
        console.log("Usage: caa package-sdk <CatiaDirectory> <OutputDirectory>");
        return;
    }
    let catiaDirectory = args[1];
    let outputDirectory = args[2];
    if (Directory.Exists(catiaDirectory) == false) {
        console.log(`Catia directory does not exist: ${catiaDirectory}`);
        return;
    }
    if(Directory.Exists(outputDirectory) == false) {
        Directory.CreateDirectory(outputDirectory);
    }
    let directories = Directory.GetDirectories(catiaDirectory);
    let frameworkDirectories = [] as string[];
    for (let directory of directories) {
        let identityCard = Path.Combine(directory, "IdentityCard");
        if (Directory.Exists(identityCard)) {
            frameworkDirectories.push(directory);
        }
        else {
            let subDirectories = Directory.GetDirectories(directory);
            if (subDirectories.findIndex(item => item.endsWith(".m")) != -1) {
                frameworkDirectories.push(directory);
            }
        }
    }
    for (let directory of frameworkDirectories) {
        copyDirectory(directory, Path.Combine(outputDirectory, Path.GetFileName(directory)));
    }
    let catiaVersion = Path.GetFileName(catiaDirectory);
    if (catiaVersion.startsWith("B")) {
        catiaVersion = catiaVersion.substring(1);
    }
    let projectName = `CAA${catiaVersion}`;
    let templateContent = await File.ReadAllTextAsync(Path.Combine(Path.GetDirectoryName(script_path), "CMakeLists.txt"), utf8);
    templateContent = templateContent.replace("__PROJECT_NAME__", projectName);
    await File.WriteAllTextAsync(Path.Combine(outputDirectory, "CMakeLists.txt"), templateContent, utf8);
};


let main = async () => {
    if (args.length < 2) {
        console.log("Usage: caa <command>");
        return;
    }
    let command = args[0];
    if (command.toLowerCase() == "package-sdk") {
        await cmd_package_sdk();
    }
    else {
        console.log("Unknown command");
    }
};

await main();

//tscl run E:\Downloads\Temp\open-cad\cli\caa\main.ts package-sdk C:\Users\ELEAD-33\Downloads\李东明\B21  E:\Downloads\李东明\SDK