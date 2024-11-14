import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { args, cmdAsync, lockFile, md5, script_path, setLoggerPath, unlockFile } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Path } from "../.tsc/System/IO/Path";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { fileUtils } from "../.tsc/Cangjie/TypeSharp/System/fileUtils";
import { stringUtils } from "../.tsc/Cangjie/TypeSharp/System/stringUtils";
import { File } from "../.tsc/System/IO/File";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
let utf8 = new UTF8Encoding(false);
let upload = async (server: string, filePath: string) => {
    server = stringUtils.trimEnd(server, '/');
    // 计算文件内容的MD5
    const fileName = Path.GetFileName(filePath);
    const contentMD5 = fileUtils.md5(filePath);
    const fileMD5 = md5(fileName + contentMD5);
    let file = File.OpenRead(filePath);
    let response = await axios.post(`${server}/api/v1/iostorage/upload`, file, {
        params: {
            fileName: fileName,
            fileMD5: fileMD5,
            contentMD5: contentMD5,
        }
    });
    console.log(response);
    file.Close();
    file.Dispose();
    return response.data.data;
};

let main = async () => {
    if (args.length < 4) {
        console.log("Usage: plugin <inputPath> <outputPath> <loggerPath> <server>");
        return;
    }

    let inputPath = args[0];
    let outputPath = args[1];
    let loggerPath = args[2];
    let server = args[3];

    setLoggerPath(loggerPath);
    let script_directory = Path.GetDirectoryName(script_path);
    let lockFilePath = Path.Combine(script_directory, "dsls.lock");
    if (lockFile(lockFilePath) == false) {
        let output = {
            FileID: null,
            Message: "正忙"
        };
        File.WriteAllText(outputPath, JSON.stringify(output), utf8);
        return;
    }
    let input = Json.Load(inputPath);
    let serverName = input.ServerName;
    let serverID = input.ServerID;
    let generator = input.Generator;
    let ssq = input.SSQ;
    let liczOutputPath = Path.Combine(Path.GetTempPath(), `${serverName}_${serverID}_${Path.GetFileNameWithoutExtension(ssq)}.licz`);
    await cmdAsync(Environment.CurrentDirectory, `opencad dsls create ${serverName} ${serverID} ${ssq} ${generator} ${liczOutputPath}`);
    console.log(`opencad dsls create ${serverName} ${serverID} ${ssq} ${liczOutputPath}`)
    if (File.Exists(liczOutputPath) == false) {
        let output = {
            FileID: null,
            Message: "生成失败，请检查ServerName和ServerID是否正确"
        };
        File.WriteAllText(outputPath, JSON.stringify(output), utf8);
    }
    else {
        let fileID = await upload(server, liczOutputPath);
        let output = {
            FileID: fileID
        };
        File.WriteAllText(outputPath, JSON.stringify(output), utf8);
    }
    unlockFile(lockFilePath);
};

await main();