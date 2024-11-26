import { args, copyDirectory } from "../.tsc/context";
import { Directory } from "../.tsc/System/IO/Directory";
import { Environment } from "../.tsc/System/Environment";
import { SearchOption } from "../.tsc/System/IO/SearchOption";

let VisualStudioManager = () => {
    let getVS2005 = () => {
        let vs2005DefaultPath = "C:\\Program Files (x86)\\Microsoft Visual Studio 9.0";
        let vcDefaultPath = `${vs2005DefaultPath}\\VC`;
        let vcDefaultIncludePath = [
            `${vcDefaultPath}\\include`,
            `${vcDefaultPath}\\atlmfc\\include`,
            `${vcDefaultPath}\\ce\\include`,
            `${vcDefaultPath}\\ce\\atlmfc\\include`
        ];
        let windowsSDKDefaultPaths = [
            `C:\\Program Files\\Microsoft SDKs\\Windows`,
            `C:\\Program Files (x86)\\Microsoft SDKs\\Windows`
        ];
        let packageInclude = (outputDirectory: string) => {
            if (Directory.Exists(vs2005DefaultPath)) {
                Directory.CreateDirectory(`${outputDirectory}\\VC\\include`);
                Directory.CreateDirectory(`${outputDirectory}\\VC\\atlmfc\\include`);
                Directory.CreateDirectory(`${outputDirectory}\\VC\\ce\\include`);
                Directory.CreateDirectory(`${outputDirectory}\\VC\\ce\\atlmfc\\include`);
                copyDirectory(`${vcDefaultPath}\\include`, `${outputDirectory}\\VC\\include`);
                copyDirectory(`${vcDefaultPath}\\atlmfc\\include`, `${outputDirectory}\\VC\\atlmfc\\include`);
                copyDirectory(`${vcDefaultPath}\\ce\\include`, `${outputDirectory}\\VC\\ce\\include`);
                copyDirectory(`${vcDefaultPath}\\ce\\atlmfc\\include`, `${outputDirectory}\\VC\\ce\\atlmfc\\include`);
            }
            let outputWindowsSDKDirectory = `${outputDirectory}\\Windows Kits`;
            let outputWindowsSDKDirectoryx86 = `${outputWindowsSDKDirectory}\\x86`;
            let outputWindowsSDKDirectoryx64 = `${outputWindowsSDKDirectory}\\x64`;
            for (let windowsSDKDefaultPath of windowsSDKDefaultPaths) {
                if (Directory.Exists(windowsSDKDefaultPath)) {
                    let isx86 = windowsSDKDefaultPath.includes("x86");
                    let includePaths = Directory.GetDirectories(windowsSDKDefaultPath, "Include", SearchOption.AllDirectories);
                    for (let includePath of includePaths) {
                        let includePathRelative = includePath.replace(windowsSDKDefaultPath, "");
                        let outputIncludePath = `${isx86 ? outputWindowsSDKDirectoryx86 : outputWindowsSDKDirectoryx64}${includePathRelative}`;
                        Directory.CreateDirectory(outputIncludePath);
                        copyDirectory(includePath, outputIncludePath);
                    }
                }
            }
        };
        return {
            default: {
                InstallPath: vs2005DefaultPath,
                VCPath: vcDefaultPath,
                IncludePaths: vcDefaultIncludePath,
                Package: packageInclude
            }
        };
    };

    return {
        getVS2005: getVS2005
    };

};
let vsManager = VisualStudioManager();
let main = async () => {
    if (args.length < 2) {
        console.log("Usage: <vs-version> <output-directory>");
        return;
    }
    let vsName = args[0].toLowerCase();
    if (vsName == "2005" || vsName == "vs2005") {
        let vs2005 = vsManager.getVS2005();
        let outputDirectory = args.length > 1 ? args[1] : ".";
        if (outputDirectory == "." || outputDirectory.startsWith("-")) {
            outputDirectory = Environment.CurrentDirectory;
        }
        vs2005.default.Package(outputDirectory);
    }
};

await main();