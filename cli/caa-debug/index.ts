import { args } from "../.tsc/context";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";

let main = async () => {
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

    console.log(`parameters: ${parameters}`);

    let inputPath = parameters.i ?? parameters.input;
    let outputPath = parameters.o ?? parameters.output;
    let loggerPath = parameters.l ?? parameters.logger;
    let server = parameters.s ?? parameters.server;

    let input = Json.Load(inputPath);
    let manifest = input.manifest;
    let webhook = input.webhook;
    if (manifest) {

    }
};

await main();