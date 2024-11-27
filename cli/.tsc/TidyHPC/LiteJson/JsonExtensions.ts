import { JsonNode } from "../../System/Text/Json/Nodes/JsonNode";
import { JsonPath } from "./JsonPath";
import { Type } from "../../System/Type";
export class JsonExtensions {
    public GetType(): Type {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public static IsObject(node?: JsonNode): boolean {
        return {} as any;
    }
    public static IsArray(node?: JsonNode): boolean {
        return {} as any;
    }
    public static EachAll(self?: any, onValue_or_selfPath?: ((arg0?:any)=>any) | JsonPath | ((arg0?:JsonPath, arg1?:any)=>any) | ((arg0?:any)=>Promise<void>) | ((arg0?:any)=>Promise<any>), onValue?: ((arg0?:JsonPath, arg1?:any)=>any)): any | Promise<void> | Promise<any> {
        return {} as any;
    }
}