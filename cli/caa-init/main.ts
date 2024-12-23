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
import { ICATNls, IDictionary, IPrereqComponent, Languages, Visiblity } from "./Interfaces";
import { Match } from "../.tsc/System/Text/RegularExpressions/Match";
import { code } from '../.tsc/Cangjie/TypeSharp/System/code';
import { env } from "../.tsc/context";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { OperatingSystem } from "../.tsc/System/OperatingSystem";
let utf8 = new UTF8Encoding(false);
let gb2312 = Encoding.GetEncoding("gb2312");

let script_directory = Path.GetDirectoryName(script_path);
let OPEN_CAD_DIR = Path.Combine(env("userprofile"), "OPEN_CAD");
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

let cppAnalyser = () => {
    let isStatement = (node: any) => {
        return node.type == 'Statement' || node.type == 'PreprocessorDirectives' || node.type == 'LineAnnotation' || node.type == 'AreaAnnotation'
    }
    let getStatementStart = (codeTree: any, index: number) => {
        for (let i = index; i >= 0; i--) {
            let node = codeTree[i];
            if (isStatement(node)) {
                return i + 1;
            }
        }
        return 0;
    };
    let getPreviousIndex = (codeTree: any, index: number) => {
        for (let i = index - 1; i >= 0; i--) {
            let node = codeTree[i];
            if (node.type == 'WrapSymbol' || node.type == 'LineAnnotation' || node.type == 'AreaAnnotation') {
                continue;
            }
            return i;
        }
        return -1;
    };
    let getPrevious = (codeTree: any, index: number) => {
        let previousIndex = getPreviousIndex(codeTree, index);
        return codeTree[previousIndex];
    };
    let getNextIndex = (codeTree: any, index: number) => {
        for (let i = index + 1; i < codeTree.length; i++) {
            let node = codeTree[i];
            if (node.type == 'WrapSymbol') {
                continue;
            }
            return i;
        }
        return -1;
    };
    let getNext = (codeTree: any, index: number) => {
        let nextIndex = getNextIndex(codeTree, index);
        return codeTree[nextIndex];
    };
    let createParameters = (script: string, codeTree: any) => {
        console.log(`createParameters not implemented`);
    };
    let pickParametersToStatement = (script: string, codeTree: any) => {
        for (let i = 0; i < codeTree.length; i++) {
            let node = codeTree[i];
            if (node.type != 'Statement') continue;
            let children = node.children;
            if (children == undefined) continue;
            let bracketIndex = children.findIndex((node: any) => node.type == 'Bracket' && node.startBracketChar == '(');
            if (bracketIndex == -1) continue;
            let commonIndex = getPreviousIndex(children, bracketIndex);
            if (commonIndex == -1) continue;
            if (children[commonIndex].type != 'Common') continue;
            if (commonIndex != -1 && bracketIndex != -1) {
                let common = children[commonIndex];
                let bracket = children[bracketIndex];
                if (bracket.parameters && common.value && node.caller == undefined) {
                    node.parameters = bracket.parameters;
                    node.caller = common.value;
                }
                else {
                    console.log(`common: ${common.value}, bracket: ${bracket}`);
                }
            }
            else {
                console.log(`commonIndex: ${commonIndex}, bracketIndex: ${bracketIndex}`);
            }
        }
    };
    let createStatement = (script: string, codeTree: any) => {
        for (let i = 0; i < codeTree.length; i++) {
            let node = codeTree[i];
            if (node.type == 'WrapSymbol') {
                if (i == 0) {
                    codeTree.splice(i, 1);
                    i--;
                }
                else {
                    let previous = codeTree[i - 1];
                    if (isStatement(previous)) {
                        codeTree.splice(i, 1);
                        i--;
                    }
                }
            }
            else if (node.type == 'Symbol' && node.value == ';') {
                let start = getStatementStart(codeTree, i);
                let startNode = codeTree[start];
                let statement = codeTree.slice(start, i);
                createParameters(script, statement);
                codeTree.splice(start, i - start + 1, {
                    type: 'Statement',
                    children: statement,
                    source: script.substring(startNode.range[0], node.range[1]),
                    range: [startNode.range[0], node.range[1]]
                });
                i = start;
            }
            else if (node.type == 'Bracket' && node.startBracketChar == '{') {
                let previousIndex = getPreviousIndex(codeTree, i);
                let previous = codeTree[previousIndex];
                if (previous.type == 'Bracket' && previous.startBracketChar == '(') {
                    let start = getStatementStart(codeTree, i);
                    let startNode = codeTree[start];
                    let end = i;
                    let statement = codeTree.slice(start, end + 1);
                    createParameters(script, statement);
                    codeTree.splice(start, end - start + 1, {
                        type: 'Statement',
                        children: statement,
                        source: script.substring(startNode.range[0], node.range[1] + 1),
                        range: [startNode.range[0], node.range[1] + 1]
                    });
                    i = start;
                }
            }
            else if (i == codeTree.length - 1) {
                let start = getStatementStart(codeTree, i);
                if (start >= codeTree.length) continue;
                let startNode = codeTree[start];
                let statement = codeTree.slice(start, i + 1);
                if (statement.length == 1 && statement[0].type == 'Statement') {
                    continue;
                }
                createParameters(script, statement);
                codeTree.splice(start, i - start + 1, {
                    type: 'Statement',
                    children: statement,
                    source: script.substring(startNode.range[0], node.range[1] + 1),
                    range: [startNode.range[0], node.range[1] + 1]
                });
            }
        }
    };

    let createMethods = (script: string, codeTree: any) => {
        for (let i = 0; i < codeTree.length; i++) {
            let node = codeTree[i];
            if (node.type != 'Statement') continue;
            let children = node.children;
            let bodyIndex = children.findIndex((node: any) => node.type == 'Bracket' && node.startBracketChar == '{');
            if (bodyIndex == -1) continue;
            let body = children[bodyIndex];
            let parametersIndex = getPreviousIndex(children, bodyIndex);
            if (parametersIndex == -1) continue;
            let parameters = children[parametersIndex];
            if (parameters.type != 'Bracket' || parameters.startBracketChar != '(') continue;
            let nameIndex = getPreviousIndex(children, parametersIndex);
            if (nameIndex == -1) continue;
            let name = children[nameIndex];
            if (name.type != 'Common') continue;
            createStatement(script, body.children);
            pickParametersToStatement(script, body.children);
            let method = {
                type: 'Method',
                name: name.value,
                parameters: parameters.children ?? [],
                body: body.children,
                source: node.source,
                range: node.range,
                bodyRange: body.range
            }
            codeTree.splice(i, 1, method);
        }
    };
    createParameters = (script: string, codeTree: any) => {
        for (let i = 0; i < codeTree.length; i++) {
            let node = codeTree[i];
            if (node.type != 'Bracket' || node.startBracketChar != '(') continue;
            let previousIndex = getPreviousIndex(codeTree, i);
            if (previousIndex == -1) continue;
            let previous = codeTree[previousIndex];
            if (previous.type != 'Common') continue;
            let parameters = [] as string[];
            let lastStart = -1;
            if (node.children == undefined) continue;
            for (let j = 0; j < node.children.length; j++) {
                if (lastStart == -1) {
                    lastStart = node.children[j].range[0];
                }
                let child = node.children[j];
                if (child.type == 'WrapSymbol') continue;
                if (child.type == 'Symbol' && child.value == ',') {
                    parameters.push(script.substring(lastStart, child.range[0]));
                    lastStart = -1;
                }
                else if (j == node.children.length - 1) {
                    parameters.push(script.substring(lastStart, child.range[1] + 1));
                    lastStart = -1;
                }
            }
            node.parameters = parameters;
        }
    };
    let analyse = (script: string) => {
        let codeTree = code.analyse(script);
        createStatement(script, codeTree);
        createMethods(script, codeTree);
        createParameters(script, codeTree);
        pickParametersToStatement(script, codeTree);
        return codeTree;
    };
    return {
        analyse: analyse
    };
};

let catnlsRegex = new Regex("(?<MacDeclareHeader>.*)\\.(?<CommandHeader>.*)\\.(?<Property>.*)=\"(?<Value>.*)\"");
let identityCardRegex = new Regex("AddPrereqComponent\\(\"(?<Framework>.*)\",(?<Visiblity>.*)\\);");
let imakefileRegex = (/^(?!#)(\w+)\s*=\s*(.*?)(?:\s*\\\s*\n\s*(.*?))*\s*(?=\n|$)/gm) as any as Regex;
let macDeclareHeaderRegex = (/MacDeclareHeader\((\w+)\);/) as any as Regex;
let catCommandRegex = (/.*:.*CATCommand.*\(.*\).*/) as any as Regex;

let CATIA = () => {
    let findCatiaDirectories = () => {
        let optionalDirectories = [
            "C:/Program Files/Dassault Systemes"
        ];
        let result = [] as string[];
        for (let directory of optionalDirectories) {
            if (Directory.Exists(directory)) {
                let catiaDirectories = Directory.GetDirectories(directory);
                // such as "C:/Program Files/Dassault Systemes/B28"
                for (let catiaDirectory of catiaDirectories) {
                    if (File.Exists(Path.Combine(catiaDirectory, "OSNT"))) {
                        result.push(catiaDirectory);
                    }
                }
            }
        }
        let desktopShortcuts = Directory.GetFiles(env("desktop"), "*.lnk");

        return result;
    };
    return {
        findCatiaDirectories
    }
};

let catia = CATIA();

let MingWManager = () => {
    let isInstalled = () => {
        return File.Exists("/usr/bin/x86_64-w64-mingw32-g++");
    };
    let install = async () => {
        console.log("sudo apt update");
        await cmdAsync(Environment.CurrentDirectory, "sudo apt update");
        console.log("sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mingw-w64");
        await cmdAsync(Environment.CurrentDirectory, "sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mingw-w64");
    };
    return {
        isInstalled,
        install
    };
};

let mingwManager = MingWManager();



let ProjectV1 = (projectDirectory: string) => {
    let Dictionary = (dicoPath: string) => {
        let getAddins = () => {
            if (File.Exists(dicoPath) == false) {
                return [];
            };
            let lines = File.ReadAllLines(dicoPath, utf8);
            let result = [] as IDictionary[];
            for (let line of lines) {
                let items = line.trim().split(" ");
                if (items.length == 3) {
                    result.push({
                        AddinName: items[0],
                        WorkshopName: items[1],
                        ModuleName: items[2].substring(3)
                    });
                }
            }
            return result;
        };
        let setAddins = (addins: IDictionary[]) => {
            let dictionaryDirectory = Path.GetDirectoryName(dicoPath);
            if (Directory.Exists(dictionaryDirectory) == false) {
                Directory.CreateDirectory(dictionaryDirectory);
            }
            let lines = [] as string[];
            for (let item of addins) {
                lines.push(`${item.AddinName} ${item.WorkshopName} lib${item.ModuleName}`);
            }
            File.WriteAllText(dicoPath, lines.join("\n"), utf8);
        };
        let addAddin = (addinName: string, workshopName: string, moduleName: string) => {
            let ties = getAddins();
            let index = ties.findIndex(item => item.AddinName == addinName);
            if (index == -1) {
                ties.push({
                    AddinName: addinName,
                    WorkshopName: workshopName,
                    ModuleName: moduleName
                });
            }
            else {
                ties[index].WorkshopName = workshopName;
                ties[index].ModuleName = moduleName;
            }
            setAddins(ties);
        };
        let removeAddin = (addinName: string) => {
            let ties = getAddins();
            let index = ties.findIndex(item => item.AddinName == addinName);
            if (index != -1) {
                ties.splice(index, 1);
                setAddins(ties);
            }
        };

        return {
            getAddins: getAddins,
            setAddins: setAddins,
            addAddin: addAddin,
            removeAddin: removeAddin
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
    let CATNls = (catnlsPath: string, language: Languages, macDeclareHeader: string) => {
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
        let setProperties = (commandHeader: string, properties: string[], values: string[]) => {
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
        let setTitle = (commandHeader: string, titleValue: string) => {
            setProperties(commandHeader, ["Title"], [titleValue]);
        };
        let setShortHelp = (commandHeader: string, shortHelpValue: string) => {
            setProperties(commandHeader, ["ShortHelp"], [shortHelpValue]);
        };
        let setLongHelp = (commandHeader: string, longHelpValue: string) => {
            setProperties(commandHeader, ["LongHelp"], [longHelpValue]);
        };
        let getProperties = (commandHeader: string) => {
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
            setProperties,
            getProperties,
            setTitle,
            setShortHelp,
            setLongHelp
        };
    };
    let Msgcatalog = (msgcatalogDirectory: string) => {
        let simplifiedChineseDirectory = Path.Combine(msgcatalogDirectory, "Simplified_Chinese");
        let getCATNls = (macDeclareHeader: string, language: Languages) => {
            let filePath = Path.Combine(msgcatalogDirectory, `${macDeclareHeader}.CATNls`);
            if (language == "Simplified_Chinese") {
                filePath = Path.Combine(simplifiedChineseDirectory, `${macDeclareHeader}.CATNls`);
            };
            return CATNls(filePath, language, macDeclareHeader);
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
        let initialize = () => {
            if (File.Exists(IdentityCardPath) == false) {
                let templatePath = Path.Combine(script_directory, "Project/Template", "IdentityCard.h");
                if (File.Exists(templatePath) == false) {
                    throw "Template not found";
                }
                File.Copy(templatePath, IdentityCardPath, true);
            }
        };
        return {
            getItems,
            setItems,
            addItem,
            removeItem,
            initialize
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
        let initialize = () => {
            if (File.Exists(imakeFilePath)) {
                return;
            }
            let templatePath = Path.Combine(script_directory, "Project/Template", "Imakefile.mk");
            if (File.Exists(templatePath) == false) {
                throw "Template not found";
            }
            File.Copy(templatePath, imakeFilePath, true);
        };
        return {
            getItems,
            initialize
        };
    };
    let Addin = (module: any, name: string) => {
        let _this = {} as any;
        let moduleLocalInterfacesDirectory = Path.Combine(module.getModuleDirectory(), "LocalInterfaces");
        let moduleSrcDirectory = Path.Combine(module.getModuleDirectory(), "src");
        let headerPath = Path.Combine(moduleLocalInterfacesDirectory, `${name}.h`);
        let srcPath = Path.Combine(moduleSrcDirectory, `${name}.cpp`);
        let getMacDeclareHeaderByCodeTree = (codeTree: any) => {
            let macDeclareHeaderStatement = codeTree.find(item => item.type == "Statement" && item.caller == 'MacDeclareHeader');
            if (macDeclareHeaderStatement == undefined) {
                throw `MacDeclareHeader not found in ${srcPath}`;
            }
            return macDeclareHeaderStatement.parameters[0];
        };
        let create = () => {
            let templateHeaderPath = Path.Combine(script_directory, "Project/Template", "Addin.h");
            let templateSrcPath = Path.Combine(script_directory, "Project/Template", "Addin.cpp");
            if (File.Exists(headerPath)) {
                throw `${headerPath} already exists`;
            }
            if (File.Exists(srcPath)) {
                throw `${srcPath} already exists`;
            }
            var templateHeader = File.ReadAllText(templateHeaderPath, utf8);
            var templateSrc = File.ReadAllText(templateSrcPath, utf8);
            templateHeader = templateHeader.replace("__ADDIN_NAME__", name);
            templateSrc = templateSrc.replace("__ADDIN_NAME__", name);
            File.WriteAllText(headerPath, templateHeader, utf8);
            File.WriteAllText(srcPath, templateSrc, utf8);
            let framework = module.getFramework();
            let addin = _this.get();
            framework.cnext.dictionary.addAddin(name, addin.workshopName, module.getModuleName());
        };
        let getCommandsByCodeTree = (codeTree: any) => {
            let macDeclareHeader = getMacDeclareHeaderByCodeTree(codeTree);
            let method = codeTree.find(item => item.type == "Method" && item.name == "CreateCommands");
            if (method == undefined) {
                throw `CreateCommands not found in ${srcPath}`;
            }
            if (method.body == undefined) {
                throw `CreateCommands body not found in ${srcPath}`;
            }
            return {
                commands: method.body.filter(item => item.caller == macDeclareHeader).map(item => {
                    return {
                        header: item.parameters[0].trim('"'),
                        module: item.parameters[1].trim('"'),
                        commandClass: item.parameters[2].trim('"'),
                        input: item.parameters[3],
                        available: item.parameters[4]
                    }
                }),
                range: method.bodyRange
            };
        };
        let getToolbarsByCodeTree = (codeTree: any) => {
            let macDeclareHeader = getMacDeclareHeaderByCodeTree(codeTree);
            let method = codeTree.find(item => item.type == "Method" && item.name == "CreateToolbars");
            if (method == undefined) {
                throw `CreateToolbars not found in ${srcPath}`;
            }
            if (method.body == undefined) {
                throw `CreateToolbars body not found in ${srcPath}`;
            }
            let accesses = [] as any[];
            let toolbar = [] as any[];
            for (let item of method.body) {
                if (item.caller == 'NewAccess') {
                    let access = {
                        className: item.parameters[0],
                        variableName: item.parameters[1],
                        objectName: item.parameters[2],
                    }
                    accesses.push(access);
                }
                else if (item.caller == 'AddToolbarView') {
                    let access = accesses.find(access => access.variableName == item.parameters[0]);
                    access.toolbar = {
                        visible: item.parameters[1],
                        where: item.parameters[2],
                    }
                    toolbar.push(access);
                }
                else if (item.caller == 'SetAccessCommand') {
                    let access = accesses.find(access => access.variableName == item.parameters[0]);
                    access.commandName = item.parameters[1].trim('"');
                }
                else if (item.caller == 'SetAccessChild') {
                    let access = accesses.find(access => access.variableName == item.parameters[0]);
                    if (access.children == undefined) {
                        access.children = [];
                    }
                    access.children.push(item.parameters[1]);
                }
            }
            return {
                accesses,
                toolbar,
                range: method.bodyRange
            }
        };
        let getWorkShopNameByCodeTree = (codeTree: any) => {
            let tie = codeTree.find(item => item.type == "Statement" && item.caller.startsWith("TIE_"));
            if (tie == undefined) {
                throw `TIE not found in ${srcPath}`;
            }
            return tie.caller.substring(4);
        };
        let commandToString = (macDeclareHeader: string, commands: any[]) => {
            let lines = [] as string[];
            for (let command of commands) {
                lines.push(`new ${macDeclareHeader} ("${command.header}", "${command.module}", "${command.commandClass}", ${command.input}, ${command.available});`);
            }
            return lines.join("\r\n");
        };
        let toolbarsToString = (toolbars: any) => {
            let lines = [] as string[];
            for (let access of toolbars.accesses) {
                lines.push(`NewAccess(${access.className}, ${access.variableName}, ${access.objectName});`);
                if (access.toolbar) {
                    lines.push(`AddToolbarView(${access.variableName}, ${access.toolbar.visible}, ${access.toolbar.where});`);
                }
                if (access.commandName) {
                    lines.push(`SetAccessCommand(${access.variableName}, "${access.commandName}");`);
                }
                lines.push("");
            }
            lines.push("");
            for (let access of toolbars.accesses) {
                if (access.children) {
                    for (let child of access.children) {
                        lines.push(`SetAccessChild(${access.variableName}, ${child});`);
                    }
                }
            }
            lines.push("");
            lines.push(`return ${toolbars.toolbar[0].variableName};`);
            return lines.join("\r\n");
        };
        let setByCodeTree = (script: string, codeTree: any, commands: any, toolbars: any) => {
            let lines = [] as string[];
            lines.push(script.substring(0, commands.range[0] + 1));
            lines.push(commandToString(getMacDeclareHeaderByCodeTree(codeTree), commands.commands));
            lines.push(script.substring(commands.range[1], toolbars.range[0] + 1));
            lines.push(toolbarsToString(toolbars));
            lines.push(script.substring(toolbars.range[1]));
            File.WriteAllText(srcPath, lines.join("\r\n"), utf8);
        };
        let get = () => {
            let content = File.ReadAllText(srcPath, utf8);
            let codeTree = cppAnalyser().analyse(content);
            let commands = getCommandsByCodeTree(codeTree);
            let toolbars = getToolbarsByCodeTree(codeTree);
            let workshopName = getWorkShopNameByCodeTree(codeTree);
            let macDeclareHeader = getMacDeclareHeaderByCodeTree(codeTree);
            return {
                commands,
                toolbars,
                workshopName,
                macDeclareHeader,
                set: (commands: any, toolbars: any) => {
                    setByCodeTree(content, codeTree, commands, toolbars);
                }
            };
        };
        let addCommandToFirstToolbar = (name: string, className: string) => {
            let moduleName = module.getModuleName();
            let addin = get();
            let isContains = addin.commands.commands.findIndex(item => item.header == name || item.header == `${name}Header`) != -1;
            if (isContains) {
                throw `${name} already exists`;
            }
            addin.commands.commands.push({
                header: name,
                module: moduleName,
                commandClass: className,
                input: "(void *)NULL",
                available: "CATFrmAvailable"
            });
            let toolbar = addin.toolbars.toolbar[0];
            if (toolbar.children == undefined) {
                toolbar.children = [];
            }
            addin.toolbars.accesses.push({
                className: "CATCmdStarter",
                variableName: name,
                objectName: `o_${name}`,
                commandName: name,
            });
            toolbar.children.push(name);
            addin.set(addin.commands, addin.toolbars);
        };
        let addCommand = (name: string, className: string, toolbarName: string) => {
            let moduleName = module.getModuleName();
            let addin = get();
            let isContains = addin.commands.commands.findIndex(item => item.header == name || item.header == `${name}Header`) != -1;
            if (isContains) {
                throw `${name} already exists`;
            }
            addin.commands.commands.push({
                header: name,
                module: moduleName,
                commandClass: className,
                input: "(void *)NULL",
                available: "CATFrmAvailable"
            });
            let toolbar = addin.toolbars.toolbar.find(item => item.variableName == toolbarName || item.variableName == `p_${toolbarName}` || item.variableName == `p${toolbarName}`);
            addin.toolbars.accesses.push({
                className: "CATCmdStarter",
                variableName: name,
                objectName: `o_${name}`,
                commandName: name,
            });
            if (toolbar.children == undefined) {
                toolbar.children = [];
            }
            toolbar.children.push(name);
            addin.set(addin.commands, addin.toolbars);
        };
        let addToolbar = (name: string, where: string) => {
            let addin = get();
            let isContains = addin.toolbars.toolbar.findIndex(item => item.variableName == name || item.variableName == `p_${name}` || item.variableName == `p${name}`) != -1;
            if (isContains) {
                throw `${name} already exists`;
            }
            addin.toolbars.accesses.push({
                className: "CATCmdContainer",
                variableName: name,
                objectName: `o_${name}`,
                toolbar: {
                    visible: '1',
                    where: where
                }
            });
            addin.set(addin.commands, addin.toolbars);
        };
        let getWorkShopName = () => {
            let content = File.ReadAllText(srcPath, utf8);
            let codeTree = cppAnalyser().analyse(content);
            return getWorkShopNameByCodeTree(codeTree);
        };
        let getMacDeclareHeader = () => {
            let content = File.ReadAllText(srcPath, utf8);
            let codeTree = cppAnalyser().analyse(content);
            return getMacDeclareHeaderByCodeTree(codeTree);
        };
        let setCommandProperties = (name: string, language: Languages, properties: string[], values: string[]) => {
            let addin = get();
            let command = addin.commands.commands.find(item => item.header == name || item.header == `${name}Header`);
            if (command == undefined) {
                throw `${name} not found`;
            }
            let framework = module.getFramework();
            let catnls = framework.cnext.msgcatalog.getCATNls(addin.macDeclareHeader, language);
            catnls.setProperties(command.header, properties, values);
        };
        let setCommandTitle = (name: string, title: string, language: Languages) => {
            setCommandProperties(name, language, ["Title"], [title]);
        };
        let setCommandShortHelp = (name: string, shortHelp: string, language: Languages) => {
            setCommandProperties(name, language, ["ShortHelp"], [shortHelp]);
        };
        let setCommandLongHelp = (name: string, longHelp: string, language: Languages) => {
            setCommandProperties(name, language, ["LongHelp"], [longHelp]);
        };
        let self = {
            getName: () => name,
            create,
            get,
            addCommandToFirstToolbar,
            addCommand,
            addToolbar,
            getWorkShopName,
            getMacDeclareHeader,
            setCommandProperties,
            setCommandTitle,
            setCommandShortHelp,
            setCommandLongHelp
        };
        _this = self;
        return self;
    };
    let CommandClass = (module: any, name: string) => {
        let _this = {};
        let moduleLocalInterfacesDirectory = Path.Combine(module.getModuleDirectory(), "LocalInterfaces");
        let moduleSrcDirectory = Path.Combine(module.getModuleDirectory(), "src");
        let headerPath = Path.Combine(moduleLocalInterfacesDirectory, `${name}.h`);
        let srcPath = Path.Combine(moduleSrcDirectory, `${name}.cpp`);
        let create = () => {
            let templateHeaderPath = Path.Combine(script_directory, "Project/Template", "CommandClass.h");
            let templateSrcPath = Path.Combine(script_directory, "Project/Template", "CommandClass.cpp");
            if (File.Exists(headerPath)) {
                throw `${headerPath} already exists`;
            }
            if (File.Exists(srcPath)) {
                throw `${srcPath} already exists`;
            }
            var templateHeader = File.ReadAllText(templateHeaderPath, utf8);
            var templateSrc = File.ReadAllText(templateSrcPath, utf8);
            templateHeader = templateHeader.replace("__COMMAND_CLASS_NAME__", name);
            templateSrc = templateSrc.replace("__COMMAND_CLASS_NAME__", name);
            File.WriteAllText(headerPath, templateHeader, utf8);
            File.WriteAllText(srcPath, templateSrc, utf8);
        };
        return {
            create
        };
    };
    let Module = (framework: any, moduleDirectory: string) => {
        let _this = {};
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
        let getAddins = () => {
            let moduleSrcDirectory = Path.Combine(moduleDirectory, "src");
            let files = Directory.GetFiles(moduleSrcDirectory, "*.cpp");
            let result = [] as string[];
            for (let file of files) {
                let content = File.ReadAllText(file, utf8);
                let match = macDeclareHeaderRegex.Match(content);
                if (match.Success) {
                    result.push(Path.GetFileNameWithoutExtension(file));
                }
            }
            return result;
        };
        let getAddin = (name: string) => {
            return Addin(_this, name);
        };
        let createAddin = (name: string) => {
            let addin = Addin(_this, name);
            addin.create();
        };
        let containsAddin = (name: string) => {
            let moduleSrcDirectory = Path.Combine(moduleDirectory, "src");
            let files = Directory.GetFiles(moduleSrcDirectory, "*.cpp");
            for (let file of files) {
                if (Path.GetFileNameWithoutExtension(file) == name) {
                    return true;
                }
            }
            return false;
        };
        let getCommandClasses = () => {
            let moduleSrcDirectory = Path.Combine(moduleDirectory, "src");
            let files = Directory.GetFiles(moduleSrcDirectory, "*.cpp");
            let result = [] as string[];
            for (let file of files) {
                let content = File.ReadAllText(file, utf8);
                let match = catCommandRegex.Match(content);
                if (match.Success) {
                    result.push(Path.GetFileNameWithoutExtension(file));
                }
            }
            return result;
        }
        let getCommandClass = (name: string) => {
            return CommandClass(_this, name);
        };
        let createCommandClass = (name: string) => {
            let commandClass = CommandClass(_this, name);
            commandClass.create();
        };
        let containsCommandClass = (name: string) => {
            let moduleSrcDirectory = Path.Combine(moduleDirectory, "src");
            let files = Directory.GetFiles(moduleSrcDirectory, "*.cpp");
            for (let file of files) {
                if (Path.GetFileNameWithoutExtension(file) == name) {
                    return true;
                }
            }
            return false;
        };
        let initialize = () => {
            let directories = [
                "LocalInterfaces",
                "src"
            ];
            for (let directory of directories) {
                let path = Path.Combine(moduleDirectory, directory);
                if (Directory.Exists(path) == false) {
                    Directory.CreateDirectory(path);
                }
            }
            imakefile.initialize();
            addModuleHeader();
        };
        let self = {
            getFramework: () => framework,
            getModuleDirectory: () => moduleDirectory,
            getModuleName: () => moduleName,
            addModuleHeader,
            getAddins,
            getAddin,
            createAddin,
            containsAddin,
            getCommandClasses,
            getCommandClass,
            createCommandClass,
            containsCommandClass,
            initialize,
            imakefile
        };
        _this = self;
        return self;
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
        let createModule = (moduleName: string) => {
            let moduleDirectory = Path.Combine(frameworkDirectory, `${moduleName}.m`);
            let module = Module(_this, moduleDirectory);
            module.initialize();
        };
        let initialize = () => {
            let directories = [
                "CNext",
                "IdentityCard",
                "PrivateInterfaces",
                "ProtectedInterfaces",
                "PublicInterfaces",
            ];
            for (let directory of directories) {
                let path = Path.Combine(frameworkDirectory, directory);
                if (Directory.Exists(path) == false) {
                    Directory.CreateDirectory(path);
                }
            }
            identityCard.initialize()
        }
        let self = {
            getFrameDirectory: () => frameworkDirectory,
            cnext,
            identityCard,
            getModule,
            getModules,
            createModule,
            initialize
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
        let framework = getFramework(frameworkName);
        framework.initialize();
    };
    let initialize = () => {
        let catiaV5LevelTemplatePath = Path.Combine(script_directory, "Project/Template", "CATIAV5Level.lvl");
        let Install_config_win_b64TemplatePath = Path.Combine(script_directory, "Project/Template", "Install_config_win_b64");
        let catiaV5LevelPath = Path.Combine(projectDirectory, "CATIAV5Level.lvl");
        let Install_config_win_b64Path = Path.Combine(projectDirectory, "Install_config_win_b64");
        if (File.Exists(catiaV5LevelPath) == false) {
            File.Copy(catiaV5LevelTemplatePath, catiaV5LevelPath, true);
        }
        if (File.Exists(Install_config_win_b64Path) == false) {
            File.Copy(Install_config_win_b64TemplatePath, Install_config_win_b64Path, true);
        }
    };
    return {
        getFramework,
        isFramework,
        getFrameworks,
        createFramework,
        initialize
    };
};

let cmd_package_sdk = async () => {
    if (args.length < 3) {
        console.log("Usage: caa-init package-sdk <CatiaDirectory> <OutputDirectory>");
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
    console.log("Initializing CAA project");
    if (args.length < 2) {
        console.log("Usage: caa init <sdk_name>");
        return;
    }
    console.log(`args: ${args}`);
    let cadName = "CAA";
    let sdkName = args[1];
    if (OperatingSystem.IsLinux()) {
        console.log("Checking Mingw");
        if (mingwManager.isInstalled() == false) {
            console.log("Installing Mingw");
            await mingwManager.install();
        }
        else{
            console.log("Mingw is installed");
        }
    }
    let projectDirectory = Environment.CurrentDirectory;
    let projectName = Path.GetFileName(projectDirectory);
    projectName = projectName.replace("-", "_");
    let cmakePath = Path.Combine(sdkDirectory, cadName, sdkName, `Find${sdkName}.cmake`);
    // 自动创建CMakeLists.txt
    let cmakeListsPath = Path.Combine(projectDirectory, "CMakeLists.txt.bak");
    let cmakeListsText = await File.ReadAllTextAsync(Path.Combine(script_directory, "Project", "CMakeLists.txt"), utf8);
    cmakeListsText = cmakeListsText.replace("__PROJECT_NAME__", projectName);
    await File.WriteAllTextAsync(cmakeListsPath, cmakeListsText, utf8);
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
    if (OperatingSystem.IsLinux()) {
        let vscodeCppPropertiesPath = Path.Combine(vscodeDirectory, "c_cpp_properties.json");
        let vscodeCppPropertiesText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "c_cpp_properties.json"), utf8);
        await File.WriteAllTextAsync(vscodeCppPropertiesPath, vscodeCppPropertiesText, utf8);
    }
    // 自动创建.vscode/tasks.json
    // let vscodeTasksPath = Path.Combine(vscodeDirectory, "tasks.json");
    // let vscodeTasksText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "tasks.json"), utf8);
    // await File.WriteAllTextAsync(vscodeTasksPath, vscodeTasksText, utf8);
    // 自动创建.vscode/launch.json
    // let vscodeLaunchPath = Path.Combine(vscodeDirectory, "launch.json");
    // let vscodeLaunchText = await File.ReadAllTextAsync(Path.Combine(script_directory, ".vscode", "launch.json"), utf8);
    // await File.WriteAllTextAsync(vscodeLaunchPath, vscodeLaunchText, utf8);
    // 自动创建 .gitignore
    let gitignorePath = Path.Combine(projectDirectory, ".gitignore");
    let gitignoreTemplatePath = Path.Combine(script_directory, "Project/Template/.gitignore");
    File.Copy(gitignoreTemplatePath, gitignorePath, true);
    // 自动创建 manifest.json
    let manifestPath = Path.Combine(projectDirectory, "manifest.json");
    let manifestTemplatePath = Path.Combine(script_directory, "Project/Template/manifest.json");
    File.Copy(manifestTemplatePath, manifestPath, true);
    // 自动创建 main.cpp
    let project = ProjectV1(projectDirectory);
    project.initialize();
    project.createFramework(projectName);
    let framework = project.getFramework(projectName);
    framework.createModule(projectName);
    let module = framework.getModule(projectName);
    module.createAddin("Addin");
    let addin = module.getAddin("Addin");
    addin.addCommandToFirstToolbar("HelloWorld", "HelloWorldCmd");
    module.createCommandClass("HelloWorldCmd");
    addin.setCommandTitle("HelloWorld", "Hello-World", "English");
    addin.setCommandShortHelp("HelloWorld", "Hello-World", "English");
    addin.setCommandLongHelp("HelloWorld", "Hello-World", "English");
};


let main = async () => {
    if (args.length < 2) {
        console.log("Usage: caa-init <command>");
        return;
    }
    axios.setDefaultProxy();
    let command = args[0].toLowerCase();
    if (command == "package-sdk") {
        await cmd_package_sdk();
    }
    else if (command == "init") {
        await cmd_init();
    }
    else {
        console.log("Unknown command");
    }
};

await main();
