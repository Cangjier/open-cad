import { args, cmdAsync, copyDirectory, script_path } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";
import { EnvironmentVariableTarget } from "../.tsc/System/EnvironmentVariableTarget";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { Regex } from "../.tsc/System/Text/RegularExpressions/Regex";
import { Encoding } from "../.tsc/System/Text/Encoding";
import { ICATNls, IDictionary, IPrereqComponent, Languages, Visiblity } from "./Inerfaces";
import { Match } from "../.tsc/System/Text/RegularExpressions/Match";
let utf8 = new UTF8Encoding(false);
let gb2312 = Encoding.GetEncoding("gb2312");


let OPEN_CAD_DIR = "C:\\OPEN_CAD";
if (Environment.GetEnvironmentVariable("OPEN_CAD_DIR") == null) {
    Environment.SetEnvironmentVariable("OPEN_CAD_DIR", OPEN_CAD_DIR, EnvironmentVariableTarget.User);
}
let repositoryDirectory = Path.Combine(OPEN_CAD_DIR, "repository");
if (Directory.Exists(repositoryDirectory) == false) {
    Directory.CreateDirectory(repositoryDirectory);
}
let downloadDirectory = Path.Combine(OPEN_CAD_DIR, "download");
let sdkDirectory = Path.Combine(OPEN_CAD_DIR, "sdk");
if (Directory.Exists(downloadDirectory) == false) {
    Directory.CreateDirectory(downloadDirectory);
}
if (Directory.Exists(sdkDirectory) == false) {
    Directory.CreateDirectory(sdkDirectory);
}

let catnlsRegex = new Regex("(?<MacDeclareHeader>.*)\\.(?<CommandHeader>.*)\\.(?<Property>.*)=\"(?<Value>.*)\"");
let identityCardRegex = new Regex("AddPrereqComponent\\(\"(?<Framework>.*)\",(?<Visiblity>.*)\\);");
let imakefileRegex = (/^(?!#)(\w+)\s*=\s*(.*?)(?:\s*\\\s*\n\s*(.*?))*\s*(?=\n|$)/gm) as any as Regex;
let ProjectV1 = (projectDirectory: string) => {
    let Dictionary = (dicoPath: string) => {
        let getTIEs = () => {
            if (File.Exists(dicoPath) == false) {
                return [];
            };
            let lines = File.ReadAllLines(dicoPath, utf8);
            let result = [] as IDictionary[];
            for (let line of lines) {
                let items = line.trim().split(" ");
                if (items.length == 3) {
                    result.push({
                        TieName: items[0],
                        WorkshopName: items[1],
                        ModuleName: items[2].substring(3)
                    });
                }
            }
            return result;
        };
        let setTIEs = (ties: IDictionary[]) => {
            let dictionaryDirectory = Path.GetDirectoryName(dicoPath);
            if (Directory.Exists(dictionaryDirectory) == false) {
                Directory.CreateDirectory(dictionaryDirectory);
            }
            let lines = [] as string[];
            for (let item of ties) {
                lines.push(`${item.TieName} ${item.WorkshopName} lib${item.ModuleName}`);
            }
            File.WriteAllText(dicoPath, lines.join("\n"), utf8);
        };
        let addTIE = (tieName: string, workshopName: string, moduleName: string) => {
            let ties = getTIEs();
            let index = ties.findIndex(item => item.TieName == tieName);
            if (index == -1) {
                ties.push({
                    TieName: tieName,
                    WorkshopName: workshopName,
                    ModuleName: moduleName
                });
            }
            else {
                ties[index].WorkshopName = workshopName;
                ties[index].ModuleName = moduleName;
            }
            setTIEs(ties);
        };
        let removeTIE = (tieName: string) => {
            let ties = getTIEs();
            let index = ties.findIndex(item => item.TieName == tieName);
            if (index != -1) {
                ties.splice(index, 1);
                setTIEs(ties);
            }
        };

        return {
            getTIEs,
            setTIEs,
            addTIE,
            removeTIE
        };
    };
    let Icons = (iconsDirectory: string) => {
        let initialize = () => {
            if (Directory.Exists(iconsDirectory) == false) {
                Directory.CreateDirectory(iconsDirectory);
            }
            let normalDirectory = Path.Combine(iconsDirectory, "normal");
            if (Directory.Exists(normalDirectory) == false) {
                Directory.CreateDirectory(normalDirectory);
            }
        };
        return {
            initialize
        };
    };
    let CATNls = (catnlsPath: string, language: Languages) => {
        let encoding = language == "Simplified_Chinese" ? gb2312 : utf8;
        let getNls = () => {
            if (File.Exists(catnlsPath) == false) {
                return [];
            }
            let lines = File.ReadAllLines(catnlsPath, encoding);
            let result = [] as ICATNls[];
            for (let line of lines) {
                let match = catnlsRegex.Match(line);
                if (match.Success) {
                    result.push({
                        MacDeclareHeader: match.Groups["MacDeclareHeader"].Value,
                        CommandHeader: match.Groups["CommandHeader"].Value,
                        Property: match.Groups["Property"].Value,
                        Value: match.Groups["Value"].Value
                    });
                }
            }
            return result;
        };
        let setNls = (nls: ICATNls[]) => {
            let catnlsDirectory = Path.GetDirectoryName(catnlsPath);
            if (Directory.Exists(catnlsDirectory) == false) {
                Directory.CreateDirectory(catnlsDirectory);
            }
            File.WriteAllText(catnlsPath, nls.map(item => {
                return `${item.MacDeclareHeader}.${item.CommandHeader}.${item.Property}="${item.Value}";`;
            }).join("\n"), encoding);
        };
        let setProperty = (macDeclareHeader: string, commandHeader: string, titleValue: string, shortHelpValue: string, longHelpValue: string) => {
            let properties = ["Title", "ShortHelp", "LongHelp"];
            let values = [titleValue, shortHelpValue, longHelpValue];
            let nls = getNls();
            for (let property of properties) {
                let index = nls.findIndex(item => item.MacDeclareHeader == macDeclareHeader && item.CommandHeader == commandHeader && item.Property == property);
                if (index == -1) {
                    nls.push({
                        MacDeclareHeader: macDeclareHeader,
                        CommandHeader: commandHeader,
                        Property: property,
                        Value: values[properties.indexOf(property)]
                    });
                }
                else {
                    nls[index].Value = values[properties.indexOf(property)];
                }
            }
            setNls(nls);
        };
        let getProperty = (macDeclareHeader: string, commandHeader: string) => {
            let properties = ["Title", "ShortHelp", "LongHelp"];
            let nls = getNls();
            let result = {} as {
                [key: string]: string
            };
            for (let property of properties) {
                let index = nls.findIndex(item => item.MacDeclareHeader == macDeclareHeader && item.CommandHeader == commandHeader && item.Property == property);
                if (index != -1) {
                    result[property] = nls[index].Value;
                }
            }
        };
        return {
            getNls,
            setNls,
            setProperty,
            getProperty
        };
    };
    let Msgcatalog = (msgcatalogDirectory: string) => {
        let simplifiedChineseDirectory = Path.Combine(msgcatalogDirectory, "Simplified_Chinese");
        let getCATNls = (macDeclareHeader: string, language: Languages) => {
            let filePath = Path.Combine(msgcatalogDirectory, `${macDeclareHeader}.CATNls`);
            if (language == "Simplified_Chinese") {
                filePath = Path.Combine(simplifiedChineseDirectory, `${macDeclareHeader}.CATNls`);
            };
            return CATNls(filePath, language);
        };
        return {
            getCATNls
        };
    };
    let CNext = (frameworkDirectory: string) => {
        let dictionaryDirectory = Path.Combine(frameworkDirectory, "CNext", "code", "dictionary");
        let dictionary = Dictionary(Path.Combine(dictionaryDirectory, `${Path.GetFileName(frameworkDirectory)}.dico`));
        let icons = Icons([frameworkDirectory, "CNext", "resources", "graphic", "icons"].join(Path.DirectorySeparatorChar.toString()));
        let msgcatalog = Msgcatalog(Path.Combine(frameworkDirectory, "CNext", "resources", "msgcatalog"));

        return {
            dictionary,
            icons,
            msgcatalog
        };
    };
    let IdentityCard = (IdentityCardPath: string) => {
        let getItems = () => {
            if (File.Exists(IdentityCardPath) == false) {
                return [];
            }
            let lines = File.ReadAllLines(IdentityCardPath, utf8);
            let result = [] as IPrereqComponent[];
            for (let line of lines) {
                let match = identityCardRegex.Match(line);
                if (match.Success) {
                    result.push({
                        Framework: match.Groups["Framework"].Value,
                        Visiblity: match.Groups["Visiblity"].Value
                    });
                }
            }
            return result;
        };
        let setItems = (items: IPrereqComponent[]) => {
            let identityCardDirectory = Path.GetDirectoryName(IdentityCardPath);
            if (Directory.Exists(identityCardDirectory) == false) {
                Directory.CreateDirectory(identityCardDirectory);
            }
            let lines = [] as string[];
            lines.push(`// COPYRIGHT Dassault Systemes 2023
//===================================================================
//
// IdentityCard.h
// Supplies the list of prerequisite components for framework DemoFrm
//
//===================================================================
//
// Usage notes:
//   For every prereq framework FW, use the syntax:
//   AddPrereqComponent ("FW", Public);
//
//===================================================================
//
//  May 2023  Creation: Code generated by the CAA wizard  Administrator
//===================================================================`.replace("\r", ""));
            for (let item of items) {
                lines.push(`AddPrereqComponent("${item.Framework}",${item.Visiblity});`);
            }
            lines.push("// END WIZARD EDITION ZONE");
            File.WriteAllText(IdentityCardPath, lines.join("\n"), utf8);
        };
        let addItem = (framework: string, visiblity: Visiblity) => {
            let items = getItems();
            if (items.findIndex(item => item.Framework == framework) == -1) {
                items.push({
                    Framework: framework,
                    Visiblity: visiblity
                });
                setItems(items);
            }
        };
        let removeItem = (framework: string) => {
            let items = getItems();
            let index = items.findIndex(item => item.Framework == framework);
            if (index != -1) {
                items.splice(index, 1);
                setItems(items);
            }
        };
        return {
            getItems,
            setItems,
            addItem,
            removeItem
        };
    };
    let ImakeFile = (imakeFilePath: string) => {
        let getItems = () => {
            if (File.Exists(imakeFilePath) == false) {
                return [];
            }
            let text = File.ReadAllText(imakeFilePath, utf8);
            let matches = imakefileRegex.Matches(text) as any;
            let result = [] as {
                key: string,
                value: string
            }[];
            for (let match of matches) {
                let line = (match as Match).Value;
                result.push({
                    key: line.substring(0, line.indexOf("=")).trim(),
                    value: line.substring(line.indexOf("=") + 1).trim()
                });
            }
            return result;
        };
        return {
            getItems
        };
    };
    let Module = (framework: any, moduleDirectory: string) => {
        let moduleName = Path.GetFileNameWithoutExtension(moduleDirectory);
        let frameworkDirectory = framework.getFrameDirectory();
        let frameworkName = Path.GetFileName(frameworkDirectory);
        let frameworkProtectedInterfacesDirectory = Path.Combine(frameworkDirectory, "ProtectedInterfaces");
        let addModuleHeader = () => {
            let headerPath = Path.Combine(frameworkProtectedInterfacesDirectory, `${moduleName}.h`);
            if (File.Exists(headerPath) == false) {
                File.WriteAllText(headerPath, `#ifdef  _WINDOWS_SOURCE
#ifdef  __${frameworkName}
#define ExportedBy${frameworkName}     __declspec(dllexport)
#else
#define ExportedBy${frameworkName}     __declspec(dllimport)
#endif
#else
#define ExportedBy${frameworkName}
#endif
`, utf8);
            }
        };
        let imakefile = ImakeFile(Path.Combine(moduleDirectory, "Imakefile.mk"));
        return {
            addModuleHeader,
            imakefile
        };
    };
    let Framework = (frameworkDirectory: string) => {
        let _this = {};
        let cnext = CNext(frameworkDirectory);
        let identityCard = IdentityCard(Path.Combine(frameworkDirectory, "IdentityCard", "IdentityCard.h"));
        let getModule = (moduleName: string) => {
            return Module(_this, Path.Combine(frameworkDirectory, `${moduleName}.m`));
        };
        let getModules = () => {
            if (Directory.Exists(frameworkDirectory) == false) {
                return [];
            }
            let directories = Directory.GetDirectories(frameworkDirectory);
            let result = [] as string[];
            for (let directory of directories) {
                if (directory.endsWith(".m")) {
                    result.push(Path.GetFileNameWithoutExtension(directory));
                }
            }
            return result;
        }
        let self = {
            getFrameDirectory: () => frameworkDirectory,
            cnext,
            identityCard,
            getModule,
            getModules
        }
        _this = self;
        return self;
    };

    let getFramework = (frameworkName: string) => {
        return Framework(Path.Combine(projectDirectory, frameworkName));
    };
    let isFramework = (frameworkName: string) => {
        let frameworkDirectory = Path.Combine(projectDirectory, frameworkName);
        return Directory.Exists(Path.Combine(frameworkDirectory, "CNext", "code"));
    };
    let getFrameworks = () => {
        if (Directory.Exists(projectDirectory) == false) {
            return [];
        }
        let directories = Directory.GetDirectories(projectDirectory);
        let result = [] as string[];
        for (let directory of directories) {
            if (isFramework(directory)) {
                result.push(Path.GetFileName(directory));
            }
        }
        return result;
    };
    let createFramework = (frameworkName: string) => {
        let frameworkDirectory = Path.Combine(projectDirectory, frameworkName);
        if (Directory.Exists(frameworkDirectory) == false) {
            Directory.CreateDirectory(frameworkDirectory);
        }
    };
    return {
        getFramework,
        isFramework,
        getFrameworks,
        createFramework
    };
};

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
    if (Directory.Exists(outputDirectory) == false) {
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
    let index = 0;
    for (let directory of frameworkDirectories) {
        console.log(`${index++}/${frameworkDirectories.length}: ${directory}`);
        copyDirectory(directory, Path.Combine(outputDirectory, Path.GetFileName(directory)));
    }
    let catiaVersion = Path.GetFileName(catiaDirectory);
    if (catiaVersion.startsWith("B")) {
        catiaVersion = catiaVersion.substring(1);
    }
    let projectName = `CAA${catiaVersion}`;
    let templateContent = await File.ReadAllTextAsync(Path.Combine(Path.GetDirectoryName(script_path), "SDK", "CMakeLists.txt"), utf8);
    templateContent = templateContent.replace("__PROJECT_NAME__", projectName);
    await File.WriteAllTextAsync(Path.Combine(outputDirectory, "CMakeLists.txt"), templateContent, utf8);
};
let cmd_init = async () => {
    if (args.length < 2) {
        console.log("Usage: caa init <sdk_name> [project_directory]");
        return;
    }
    console.log(`args: ${args}`);
    let cadName = "caa";
    let sdkName = args[1];
    let projectDirectory = Environment.CurrentDirectory;
    let projectName = Path.GetFileName(projectDirectory);
    let script_directory = Path.GetDirectoryName(script_path);
    let cmakePath = Path.Combine(sdkDirectory, cadName, sdkName, `Find${sdkName}.cmake`);
    // 自动创建CMakeLists.txt
    let cmakeListsPath = Path.Combine(projectDirectory, "CMakeLists.txt");
    let cmakeListsText = await File.ReadAllTextAsync(Path.Combine(script_directory, "CMakeLists.txt"), utf8);
    cmakeListsText = cmakeListsText.replace("__PROJECT_NAME__", projectName);
    await File.WriteAllTextAsync(Path.Combine(projectDirectory, "CMakeLists.txt"), cmakeListsText, utf8);
    await cmdAsync(Environment.CurrentDirectory, `opencad cmake add_find_package ${cmakeListsPath} ${cmakePath}`);
    await cmdAsync(Environment.CurrentDirectory, `opencad cmake set_toolchain ${cmakeListsPath} ${Path.Combine(OPEN_CAD_DIR, "vcpkg\\scripts\\buildsystems\\vcpkg.cmake").replace("\\", "/")}`);
    // 自动创建.vscode/settings.json
    let vscodeDirectory = Path.Combine(projectDirectory, ".vscode");
    if (Directory.Exists(vscodeDirectory) == false) {
        Directory.CreateDirectory(vscodeDirectory);
    }
    let vscodeSettingsPath = Path.Combine(vscodeDirectory, "settings.json");
    let vscodeSettingsText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "settings.json"), utf8);
    await File.WriteAllTextAsync(vscodeSettingsPath, vscodeSettingsText, utf8);
    // 自动创建.vscode/c_cpp_properties.json
    // let vscodeCppPropertiesPath = Path.Combine(vscodeDirectory, "c_cpp_properties.json");
    // let vscodeCppPropertiesText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "c_cpp_properties.json"), utf8);
    // await File.WriteAllTextAsync(vscodeCppPropertiesPath, vscodeCppPropertiesText, utf8);
    // 自动创建.vscode/tasks.json
    // let vscodeTasksPath = Path.Combine(vscodeDirectory, "tasks.json");
    // let vscodeTasksText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "tasks.json"), utf8);
    // await File.WriteAllTextAsync(vscodeTasksPath, vscodeTasksText, utf8);
    // 自动创建.vscode/launch.json
    // let vscodeLaunchPath = Path.Combine(vscodeDirectory, "launch.json");
    // let vscodeLaunchText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "launch.json"), utf8);
    // await File.WriteAllTextAsync(vscodeLaunchPath, vscodeLaunchText, utf8);
    // 自动创建 main.cpp
    let mainCppPath = Path.Combine(projectDirectory, "main.cpp");
    let templateMainCppPath = Path.Combine(script_directory, "template.cpp");
    if (File.Exists(mainCppPath) == false) {
        File.Copy(templateMainCppPath, mainCppPath, true);
    }
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

// await main();
//tscl run E:\Downloads\Temp\open-cad\cli\caa\main.ts package-sdk C:\Users\ELEAD-33\Downloads\李东明\B21  E:\Downloads\李东明\SDK

let project = ProjectV1("E:\\Downloads\\Temp\\open-cad\\cli\\caa\\Project");
let framework = project.getFramework("DemoFrm");
console.log(framework.getModule(framework.getModules()[0]).imakefile.getItems());