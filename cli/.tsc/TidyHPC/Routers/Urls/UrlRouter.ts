import { UrlFilter } from "./UrlFilter";
import { UrlRouterEvents } from "./UrlRouterEvents";
import { Session } from "./Session";
import { IServer } from "./Interfaces/IServer";
import { MethodInfo } from "../../../System/Reflection/MethodInfo";
import { Delegate } from "../../../System/Delegate";
import { Type } from "../../../System/Type";
export class UrlRouter {
    public get Filter(): UrlFilter {
        return {} as any;
    }
    public get Events(): UrlRouterEvents {
        return {} as any;
    }
    public Route(url?: string, session?: Session): Promise<void> {
        return {} as any;
    }
    public Listen(server?: IServer): Promise<void> {
        return {} as any;
    }
    public Register(urlAliases?: string[], method_or_func?: Delegate | null): void {
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