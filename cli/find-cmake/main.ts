
import { args, script_path } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Path } from "../.tsc/System/IO/Path";
import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { UTF8Encoding } from "../.tsc/System/Text/UTF8Encoding";

let help = () => {

};

let main = async () => {
    let utf8 = new UTF8Encoding(false);
    let script_directory = Path.GetDirectoryName(script_path);
    let projectDirectory = Environment.CurrentDirectory;
    if (args.length > 0 && args[0].startsWith("--") == false) {
        projectDirectory = args[0];
        if (projectDirectory == "." || projectDirectory == "./") {
            projectDirectory = Environment.CurrentDirectory;
        }
    }
    let projectName = Path.GetFileName(projectDirectory);
    let includeDirectory = Path.Combine(projectDirectory, "include");
    let incDirectory = Path.Combine(projectDirectory, "inc");
    if (Directory.Exists(includeDirectory) || Directory.Exists(incDirectory) || Directory.GetFiles(projectDirectory, "*.h").length > 0) {
        let cmakeLines = [] as string[];
        cmakeLines.push(`add_library(${projectName} INTERFACE)`);
        cmakeLines.push(`target_sources(${projectName} INTERFACE)`);
        cmakeLines.push(`set(${projectName}_DIR \"\${CMAKE_CURRENT_LIST_DIR}\")`);
        cmakeLines.push(`file(GLOB_RECURSE ${projectName}_LIBRARIES "\${${projectName}_DIR}/*.lib")`);
        if (Directory.Exists(Path.Combine(projectDirectory, "include"))) {
            cmakeLines.push(`set(${projectName}_INCLUDE_DIR "\${${projectName}_DIR}/include")`);
        }
        else if (Directory.Exists(Path.Combine(projectDirectory, "inc"))) {
            cmakeLines.push(`set(${projectName}_INCLUDE_DIR "\${${projectName}_DIR}/inc")`);
        }
        else {
            cmakeLines.push(`set(${projectName}_INCLUDE_DIR "\${${projectName}_DIR}")`);
        }
        cmakeLines.push(`target_include_directories(${projectName} INTERFACE "\${${projectName}_INCLUDE_DIR}")`);
        cmakeLines.push(`target_link_libraries(${projectName} INTERFACE "\${${projectName}_LIBRARIES}")`);
        await File.WriteAllTextAsync(Path.Combine(projectDirectory, `Find${projectName}.cmake`), cmakeLines.join("\n"), utf8);
    }
    else {
        let templatePath = Path.Combine(script_directory, "Template", "Find.cmake");
        let template = await File.ReadAllTextAsync(templatePath, utf8);
        template = template.replace("__PROJECT_NAME___", projectName);
        await File.WriteAllTextAsync(Path.Combine(projectDirectory, `Find${projectName}.cmake`), template, utf8);
    }


};


await main();