import { args } from "../.tsc/context";
import { Environment } from "../.tsc/System/Environment";
import { Guid } from "../.tsc/System/Guid";
import { Directory } from "../.tsc/System/IO/Directory";
import { Path } from "../.tsc/System/IO/Path";
import { Json } from "../.tsc/TidyHPC/LiteJson/Json";
import { axios } from "../.tsc/Cangjie/TypeSharp/System/axios";
import { zip } from "../.tsc/Cangjie/TypeSharp/System/zip";
import { File } from "../.tsc/System/IO/File";
import { jsonUtils } from "../.tsc/Cangjie/TypeSharp/System/jsonUtils";
let p = { name: '{name}', age: 1 };
jsonUtils.replaceValue(p, val => {
    if (typeof val == 'string') {
        console.log(`val=${val},type=${typeof val}`);
        return val.replace('{name}', 'ldm');
    }
    else {
        return val;
    }
});
console.log(p);