import { Type } from "../../../System/Type";
import { MethodInfo } from "../../../System/Reflection/MethodInfo";
import { Delegate } from "../../../System/Delegate";
export class ArgsRouter {
    public RegisterNative(commandPattern_or_handler?: string | ((arg0?:ArgsVisitor)=>Promise<void>), handler?: ((arg0?:ArgsVisitor)=>Promise<void>)): void {
        return {} as any;
    }
    public RegisterClass(handler_or_instanceHandler?: Type | null, onInstance?: (()=>any)): void {
        return {} as any;
    }
    public Register(method_or_commandAliases_or_func?: MethodInfo | string[] | Delegate | (()=>Promise<void>) | null, onCommandPattern_or_func_or_method_or_onInstance?: (()=>string) | Delegate | MethodInfo | (()=>any) | (()=>Promise<void>) | null, onInstance?: (()=>any)): void {
        return {} as any;
    }
    public Route(args?: string[]): Promise<void> {
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
    public constructor() {
    }
}