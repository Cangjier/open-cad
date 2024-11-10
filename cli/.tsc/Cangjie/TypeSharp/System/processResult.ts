import { Type } from "../../../System/Type";
export class processResult {
    public static op_Implicit(target?: any): processResult {
        return {} as any;
    }
    public exitCode?: number;
    public output?: string;
    public error?: string;
}