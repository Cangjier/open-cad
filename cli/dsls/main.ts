import { Path } from "../.tsc/System/IO/Path";
import { args, script_path } from "../.tsc/context";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
axios.setDefaultProxy();
let script_directory = Path.Combine(script_path);
let cli_directory = Path.GetDirectoryName(script_directory);
let dsls_directory = Path.Combine(cli_directory, "dsls");
let dslsIndexPath = Path.Combine(dsls_directory, "index.json");
let opencadDirectory = "C:\\OPEN_CAD";
let ssqDirectory = Path.Combine(opencadDirectory, "CATIA", "SSQ");
if (!Path.Exists(ssqDirectory)) {
    ssqDirectory = Path.Combine(opencadDirectory, "CATIA", "SSQ");
}
let cmd_install = async () => {
    let indexJson = await Json.LoadAsync(dslsIndexPath);
    for (let item of indexJson["DSLS.Gen"]) {
        let download_url = item["download_url"];
        let download_path = Path.Combine(ssqDirectory, Path.GetFileName(download_url));
        await axios.download(download_url, download_path);
    }
    for (let item of indexJson["RADE.SSQ"]) {
        let download_url = item["download_url"];
        let download_path = Path.Combine(ssqDirectory, Path.GetFileName(download_url));
        await axios.download(download_url, download_path);
    }
    for (let item of indexJson["CATIA.SSQ"]) {
        let download_url = item["download_url"];
        let download_path = Path.Combine(ssqDirectory, Path.GetFileName(download_url));
        await axios.download(download_url, download_path);
    }
};

let main = async () => {
    if (args.length < 1) {
        console.log("Usage: dsls <command>");
        console.log("Usage: dsls install");
        return;
    }
    let command = args[0];
    if (command == "install") {
        await cmd_install();
    }
};

await main();