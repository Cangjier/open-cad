import { Path } from "../.tsc/System/IO/Path";
import { Directory } from "../.tsc/System/IO/Directory";
import { args, cmdAsync, copyDirectory, deleteDirectory, deleteFile, script_path, start } from "../.tsc/context";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
axios.setDefaultProxy();
let script_directory = Path.GetDirectoryName(script_path);
let cli_directory = Path.GetDirectoryName(script_directory);
let repositoryDirectory = Path.GetDirectoryName(cli_directory);
let dsls_directory = Path.Combine(repositoryDirectory, "dsls");
let dslsIndexPath = Path.Combine(dsls_directory, "index.json");
let opencadDirectory = "C:\\OPEN_CAD";
let downloadDirectory = Path.Combine(opencadDirectory, "download");
let ssqDirectory = Path.Combine(opencadDirectory, "CATIA", "SSQ");
if (!Directory.Exists(ssqDirectory)) {
    Directory.CreateDirectory(ssqDirectory);
}
let installWCL = async () => {
    let binDirectory = Path.Combine(opencadDirectory, "bin");
    // 获取https://github.com/Cangjier/windows-common-cli/最新的release
    let url = "https://api.github.com/repos/Cangjier/windows-common-cli/releases/latest";
    let releaseResponse = await axios.get(url, {
        headers: {
            "User-Agent": "Cangjier"
        }
    });
    let release = releaseResponse.data;
    let assets = release["assets"];
    let asset = assets[0];
    let browser_download_url = asset["browser_download_url"];
    let download_path = Path.Combine(downloadDirectory, Path.GetFileName(browser_download_url));
    console.log(`Downloading ${browser_download_url} to ${download_path}`);
    await axios.download(browser_download_url, download_path);
    let zipDirectory = Path.Combine(downloadDirectory, Path.GetFileNameWithoutExtension(download_path));
    console.log(`Extracting ${download_path} to ${zipDirectory}`);
    await zip.extract(download_path, zipDirectory);
    console.log(`Copying ${zipDirectory} to ${binDirectory}`);
    copyDirectory(zipDirectory, binDirectory);
    deleteDirectory(zipDirectory);
    deleteFile(download_path);
};

let SSQManager = () => {
    let download = async () => {
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
    let getGenFilePaths = () => {
        return Directory.GetFiles(ssqDirectory, "*.exe");
    };
    let create = async () => {
        let generator = getGenFilePaths()[0];
        console.log(`Starting ${generator}`);
        await start({
            filePath: generator,
            workingDirectory: ssqDirectory
        });
    };
    return {
        create,
        download
    };
};

let ssqManager = SSQManager();


let main = async () => {
    if (args.length < 1) {
        console.log("Usage: dsls <command>");
        console.log("Usage: dsls install");
        return;
    }
    let command = args[0];
    if (command == "install") {

    }
};

// await main();

// await installWCL();
// await ssqManager.download();
await ssqManager.create();