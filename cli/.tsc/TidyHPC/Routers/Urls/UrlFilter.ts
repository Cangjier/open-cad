import { UrlRouter } from "./UrlRouter";
import { MethodInfo } from "../../../System/Reflection/MethodInfo";
import { Type } from "../../../System/Type";
export class UrlFilter {
    public Register(order?: number, method_or_urlPatterns?: MethodInfo | string[], onPattern_or_method_or_func?: (()=>string) | MethodInfo | (()=>Promise<FilterResult>) | null, onInstance?: (()=>any)): void {
        return {} as any;
    }
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
    public constructor(urlRouter?: UrlRouter) {
    }
    public get UrlRouter(): UrlRouter {
        return {} as any;
    }
}