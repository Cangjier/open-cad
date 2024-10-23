import { Type } from "../../../System/Type";
import { MethodInfo } from "../../../System/Reflection/MethodInfo";
import { Delegate } from "../../../System/Delegate";
export class ArgsRouter {
    public RegisterClass(handler_or_instanceHandler?: Type | null): void {
        return {} as any;
    }
    public Register(commandAliases_or_func_or_method?: string[] | Delegate | MethodInfo | null, func_or_method?: Delegate | MethodInfo | null): void {
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