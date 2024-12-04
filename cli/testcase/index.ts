import { args, cmdAsync, execAsync } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Guid } from "../.tsc/System/Guid";
import { Directory } from "../.tsc/System/IO/Directory";
import { Path } from "../.tsc/System/IO/Path";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
import { File } from "../.tsc/System/IO/File";
import { jsonUtils } from "../.tsc/Cangjie/TypeSharp/System/jsonUtils";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";

let utf8 = new UTF8Encoding(false);

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
        console.log("Usage: <manifestPath> --input <inputPath> --output <outputPath> --logger <loggerPath> --result <resultPath> --env <envPath>");
        return;
    }
    if (parameters.result == undefined) {
        throw `--result is required`;
    }
    let envPath = parameters.env;
    let env = {};
    if (envPath && (File.Exists(envPath))) {
        env = Json.Load(envPath);
    }
    axios.setDefaultProxy();
    let manifestPath = args[0];
    let manifest = Json.Load(manifestPath);
    if (manifest.testCase == undefined) {
        throw `testCase in manifest is required`;
    }
    let testCase = manifest.testCase;
    let result = {} as any;
    let testCaseResult = [] as any[];
    result.testCase = testCaseResult;
    for (let testCaseItem of testCase) {
        let testCaseItemResult = {} as any;
        testCaseItemResult.name = testCaseItem.name;
        testCaseResult.push(testCaseItemResult);

        let tempDirectory = Path.Combine(Environment.CurrentDirectory, "testcase", testCaseItem.name);
        testCaseItemResult.tempDirectory = tempDirectory;
        let configOutputPath = parameters.output ?? Path.Combine(tempDirectory, "output.json");
        testCaseItemResult.outputPath = configOutputPath;
        let configLoggerPath = parameters.logger ?? Path.Combine(tempDirectory, "logger.json");
        testCaseItemResult.loggerPath = configLoggerPath;
        Directory.CreateDirectory(tempDirectory);
        let downloadDirectory = Path.Combine(tempDirectory, "download");
        testCaseItemResult.downloadDirectory = downloadDirectory;
        Directory.CreateDirectory(downloadDirectory);
        let configDownloads = testCaseItem.downloads;

        for (let configDownload of configDownloads) {
            if (configDownload.url == undefined) {
                continue;
            }
            if (configDownload.name == undefined) {
                continue;
            }
            let downloadPath = await axios.download(configDownload.url, fileName => {
                if (fileName) {
                    return Path.Combine(downloadDirectory, fileName);
                }
                else {
                    return Path.Combine(downloadDirectory, Guid.NewGuid().toString());
                }
            });
            if (configDownload.action == 'extract') {
                let extractDirectory = Path.Combine(tempDirectory, configDownload.name);
                await zip.extract(downloadPath, extractDirectory);
                configDownload.path = extractDirectory;
            }
            else {
                let movedPath = Path.Combine(tempDirectory, configDownload.name);
                File.Move(downloadPath, movedPath, true);
                configDownload.path = movedPath;
            }

        }
        let testCaseInput = testCaseItem.input;
        jsonUtils.replaceValue(testCaseInput, value => {
            if (typeof value == "string") {
                for (let configDownload of configDownloads) {
                    value = value.replace(`{${configDownload.name}}`, configDownload.path);
                }
                return value;
            }
            else {
                return value;
            }
        });
        testCaseItemResult.input = testCaseInput;
        let configInputPath = Path.Combine(tempDirectory, "input.json");
        testCaseItemResult.inputPath = configInputPath;
        File.WriteAllText(configInputPath, JSON.stringify(testCaseInput), utf8);
        let entry = testCaseItem.entry;
        entry = entry.replace("{input}", configInputPath);
        entry = entry.replace("{output}", configOutputPath);
        entry = entry.replace("{logger}", configLoggerPath);
        testCaseItemResult.entry = entry;
        await cmdAsync(Environment.CurrentDirectory, entry, {
            environment: env
        });
    }

    File.WriteAllText(parameters.result, JSON.stringify(result), utf8);
};

await main();