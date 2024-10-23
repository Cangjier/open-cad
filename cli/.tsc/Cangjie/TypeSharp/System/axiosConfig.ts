import { HttpRequestMessage } from "../../../System/Net/Http/HttpRequestMessage";
import { Type } from "../../../System/Type";
export class axiosConfig {
    public static op_Implicit(target?: any): axiosConfig {
        return {} as any;
    }
    public headers?: { [key: string]: string };
    public params?: { [key: string]: string };
    public responseType?: string;
}