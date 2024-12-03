import { args, cmdAsync, deleteDirectory, execAsync, script_path, setLoggerPath } from "../.tsc/context";
import { DateTime } from "../.tsc/System/DateTime";
import { Path } from "../.tsc/System/IO/Path";
import { cryptography } from "../.tsc/Cangjie/TypeSharp/System/cryptography";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { File } from "../.tsc/System/IO/File";
import { Version } from "../.tsc/System/Version";
import { Directory } from "../.tsc/System/IO/Directory";
import { Environment } from "../.tsc/System/Environment";
import { Regex } from "../.tsc/System/Text/RegularExpressions/Regex";
import { Guid } from "../.tsc/System/Guid";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { stringUtils } from "../.tsc/Cangjie/TypeSharp/System/stringUtils";
let utf8 = new UTF8Encoding(false);

let GitTokenManager = (gitUserTokenMap: any) => {
    console.log(`gitToken: ${gitUserTokenMap}`);
    let getGitUserToken = (gitUrl: string) => {
        let gitSite = gitUrl.split("/")[2];
        if (gitUserTokenMap[gitSite]) {
            return gitUserTokenMap[gitSite];
        }
        return gitUserTokenMap.default;
    };
    let getGitToken = (gitUrl: string) => {
        let userToken = getGitUserToken(gitUrl);
        if (userToken.includes(":") == false) {
            return userToken;
        }
        return userToken.split(":")[1];
    };
    let getGitUser = (gitUrl: string) => {
        let userToken = getGitUserToken(gitUrl);
        if (userToken.includes(":") == false) {
            return "";
        }
        return userToken.split(":")[0];
    };
    let insertGitUserToken = (gitUrl: string) => {
        let index = gitUrl.indexOf("//");
        let userToken = getGitUserToken(gitUrl);
        return gitUrl.substring(0, index + 2) + userToken + "@" + gitUrl.substring(index + 2);
    };

    return {
        get: () => gitUserTokenMap,
        getGitToken,
        getGitUserToken,
        getGitUser,
        insertGitUserToken
    };
};

let GitManager = (gitUserTokenMap: any) => {
    let gitTokenManager = GitTokenManager(gitUserTokenMap);
    let getHttpProxy = async () => {
        return (await cmdAsync(Environment.CurrentDirectory, "git config --get http.proxy")).output?.trim();
    };
    let getGitUrlInfo = (gitUrl: string) => {
        console.log(`get git url info: ${gitUrl}`);
        console.log(`split: ${gitUrl.split("/")}`);
        let owner = gitUrl.split("/")[3];
        let repo = gitUrl.split("/")[4].split(".")[0];
        return { owner, repo };
    };
    let getLatestTag = async (owner: string, repo: string, token: string) => {
        let response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/tags`, {
            headers: {
                Authorization: `token ${token}`,
                "User-Agent": "tscl"
            }
        });
        if (response.data.length == 0) {
            return "";
        }
        return response.data[0].name as string;
    };

    let createTag = async (owner: string, repo: string, tagName: string, commit: string, token: string) => {
        // 创建标签对象
        let tagObjectResponse = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/tags`, {
            tag: tagName,
            message: tagName,
            object: commit,
            type: "commit"
        }, {
            headers: {
                Authorization: `token ${token}`,
                "User-Agent": "tscl"
            }
        });

        if (tagObjectResponse.status != 201) {
            console.log(`Create tag object ${tagName} failed`);
            return false;
        }

        // 创建引用指向标签对象
        let refResponse = await axios.post(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
            ref: `refs/tags/${tagName}`,
            sha: tagObjectResponse.data.sha
        }, {
            headers: {
                Authorization: `token ${token}`,
                "User-Agent": "tscl"
            }
        });

        if (refResponse.status != 201) {
            console.log(`Create tag ref ${tagName} failed`);
            return false;
        }

        return true;
    };
    let gitClone = async (tempDirectory: string, gitUrl: string, commit: string) => {
        gitUrl = gitTokenManager.insertGitUserToken(gitUrl);
        // 下一步，使用cloneUrl和commit下载代码
        console.log(`Create temp directory: ${tempDirectory}`);
        if (Directory.Exists(tempDirectory)) {
            deleteDirectory(tempDirectory);
        }
        Directory.CreateDirectory(tempDirectory);
        console.log(`Working Directory : ${tempDirectory}, Existing: ${Directory.Exists(tempDirectory)}`);
        console.log(`git clone ${gitUrl} .`);
        if ((await cmdAsync(tempDirectory, `git clone ${gitUrl} .`)).exitCode != 0) {
            console.log(`git clone ${gitUrl} failed, delete temp directory: ${tempDirectory}`);
            deleteDirectory(tempDirectory);
            return false;
        }
        if (commit != "") {
            console.log(`git checkout ${commit}`);
            if ((await cmdAsync(tempDirectory, `git checkout ${commit}`)).exitCode != 0) {
                console.log(`git checkout ${commit} failed, delete temp directory: ${tempDirectory}`);
                deleteDirectory(tempDirectory);
                return false;
            }
        }
        return true;
    };
    // tag such as v1.0.0
    let regex_TagName = new Regex("v\\d+\\.\\d+\\.\\d+");
    let increaseTag = async (gitUrl: string, commit: string) => {
        let info = getGitUrlInfo(gitUrl);
        let latestTag = await getLatestTag(info.owner, info.repo, gitTokenManager.getGitToken(gitUrl));
        if (!regex_TagName.IsMatch(latestTag)) {
            console.log(`Latest tag is not a valid version: ${latestTag}`);
            return {
                success: false,
                tag: ""
            };
        }
        let version = Version.Parse(latestTag.substring(1));
        let newVersion = new Version(version.Major, version.Minor, version.Build + 1);
        let newTag = `v${newVersion}`;
        console.log(`New tag: ${newTag}`);
        await createTag(info.owner, info.repo, newTag, commit, gitTokenManager.getGitToken(gitUrl));
        return {
            success: true,
            tag: newTag
        };
    };

    return {
        getGitUrlInfo,
        getLatestTag,
        createTag,
        gitClone,
        increaseTag,
        getHttpProxy,
        gitTokenManager
    };
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
    let input = Json.Load(inputPath);
    let tempDirectory = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));

    let gitManager = GitManager(input.gitUserToken);
    let output = {

    };
    let gitUrl = input.webhook.repository.clone_url;
    let message = input.webhook.head_commit.message;
    if (await gitManager.gitClone(tempDirectory, gitUrl, input.webhook.head_commit.id)) {
        let manifestPath = Path.Combine(tempDirectory, "manifest.json");
        let manifest = Json.Load(manifestPath);
        let buildLoggerPath = Path.Combine(tempDirectory, "build.log");
        File.WriteAllText(buildLoggerPath, "", utf8);
        await cmdAsync(tempDirectory, `opencad caa-build --logger ${buildLoggerPath}`);
        let win_b64Directory = Path.Combine(tempDirectory, "win_b64");
        if (Directory.Exists(win_b64Directory)) {
            let zipFilePath = Path.Combine(tempDirectory, "win_b64.zip");
            await zip.compress(win_b64Directory, zipFilePath);
            let info = gitManager.getGitUrlInfo(gitUrl);
            let token = gitManager.gitTokenManager.getGitToken(gitUrl);
            let tagName = await gitManager.getLatestTag(info.owner, info.repo, token);
            await execAsync({
                filePath: Environment.ProcessPath,
                arguments: ["run", "gitapis", "release", gitUrl, tagName,
                    "--files", `${zipFilePath},${buildLoggerPath}`,
                    "--token", token]
            });
            if (manifest.wechaty.id) {
                let loggerLines = File.ReadAllLines(buildLoggerPath, utf8);
                let errorLoggerLines = loggerLines.filter(line => line.toLowerCase().includes("error"));
                let toReportLines = [] as string[];
                for (let i = 0; (i < 2) && (i < errorLoggerLines.length); i++) {
                    toReportLines.push(errorLoggerLines[i]);
                }
                let errorMessage = toReportLines.join("\n");
                let isSuccess = toReportLines.length == 0;
                let headerMessage = `${isSuccess ? "✅" : "❌"} ${Path.GetFileName(gitUrl)} ${tagName} ${isSuccess ? "编译成功" : "编译失败"} ${message ?? ""}`;
                let finalMessage = isSuccess ? headerMessage : `${headerMessage}\r\n${errorMessage}`;
                await axios.post(`${stringUtils.trimEnd(server, "/")}/api/v1/tasks/run`, {
                    Input: {
                        id: manifest.wechaty.id,
                        message: finalMessage
                    },
                    Processor: {
                        "Name": "lidongming/wechaty",
                        "Type": "Plugin"
                    }
                }, {
                    useDefaultProxy: false
                });
            }
        }
    }
    else {
        console.log("git clone failed");
    }

    File.WriteAllText(outputPath, JSON.stringify(output));
    deleteDirectory(tempDirectory);
};


await main();