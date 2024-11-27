import { Regex } from "../../../System/Text/RegularExpressions/Regex";
import { Type } from "../../../System/Type";
export class UrlRouterRecord {
    public ToString(): string {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(obj_or_other?: any | UrlRouterRecord): boolean {
        return {} as any;
    }
    public <Clone>$(): UrlRouterRecord {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(Pattern?: string, Regex?: Regex, Handler?: ((arg0?:Session)=>Promise<void>)) {
    }
    public static op_Inequality(left?: UrlRouterRecord, right?: UrlRouterRecord): boolean {
        return {} as any;
    }
    public static op_Equality(left?: UrlRouterRecord, right?: UrlRouterRecord): boolean {
        return {} as any;
    }
    public get Pattern(): string {
        return {} as any;
    }
    public set Pattern(value: string) {
    }
    public get Regex(): Regex {
        return {} as any;
    }
    public set Regex(value: Regex) {
    }
    public get Handler(): ((arg0?:Session)=>Promise<void>) {
        return {} as any;
    }
    public set Handler(value: ((arg0?:Session)=>Promise<void>)) {
    }
}