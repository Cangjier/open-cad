import { Regex } from "../../../System/Text/RegularExpressions/Regex";
import { Type } from "../../../System/Type";
export class ArgsRouterRecord {
    public ToString(): string {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(obj_or_other?: any | ArgsRouterRecord): boolean {
        return {} as any;
    }
    public <Clone>$(): ArgsRouterRecord {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(CommandPattern?: string, CommandRegex?: Regex, Handler?: ((arg0?:ArgsVisitor)=>Promise<void>)) {
    }
    public static op_Inequality(left?: ArgsRouterRecord, right?: ArgsRouterRecord): boolean {
        return {} as any;
    }
    public static op_Equality(left?: ArgsRouterRecord, right?: ArgsRouterRecord): boolean {
        return {} as any;
    }
    public get CommandPattern(): string {
        return {} as any;
    }
    public set CommandPattern(value: string) {
    }
    public get CommandRegex(): Regex {
        return {} as any;
    }
    public set CommandRegex(value: Regex) {
    }
    public get Handler(): ((arg0?:ArgsVisitor)=>Promise<void>) {
        return {} as any;
    }
    public set Handler(value: ((arg0?:ArgsVisitor)=>Promise<void>)) {
    }
}