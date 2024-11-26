import { args, copyDirectory } from "../.tsc/context";
import { Directory } from "../.tsc/System/IO/Directory";
import { Environment } from "../.tsc/System/Environment";

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
        let packageInclude = (outputDirectory: string) => {
            if (Directory.Exists(vs2005DefaultPath) == false) {
                throw "Visual Studio 2005 not found";
            }
            Directory.CreateDirectory(`${outputDirectory}\\include`);
            Directory.CreateDirectory(`${outputDirectory}\\atlmfc\\include`);
            Directory.CreateDirectory(`${outputDirectory}\\ce\\include`);
            Directory.CreateDirectory(`${outputDirectory}\\ce\\atlmfc\\include`);
            copyDirectory(`${vcDefaultPath}\\include`, `${outputDirectory}\\include`);
            copyDirectory(`${vcDefaultPath}\\atlmfc\\include`, `${outputDirectory}\\atlmfc\\include`);
            copyDirectory(`${vcDefaultPath}\\ce\\include`, `${outputDirectory}\\ce\\include`);
            copyDirectory(`${vcDefaultPath}\\ce\\atlmfc\\include`, `${outputDirectory}\\ce\\atlmfc\\include`);
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
        if (outputDirectory == ".") {
            outputDirectory = Environment.CurrentDirectory;
        }
        vs2005.default.Package(outputDirectory);
    }
};

await main();