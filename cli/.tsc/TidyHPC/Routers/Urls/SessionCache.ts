import { GroupCollection } from "../../../System/Text/RegularExpressions/GroupCollection";
import { UrlFilterStatus } from "./Responses/UrlFilterStatus";
import { Type } from "../../../System/Type";
import { Session } from "./Session";
export class SessionCache {
    public TrySetUrlRegexMatchGroups(groupCollection?: GroupCollection): void {
        return {} as any;
    }
    public SetUrlRegexMatchGroups(groupCollection?: GroupCollection): void {
        return {} as any;
    }
    public GetRequstBodyJson(): Promise<any> {
        return {} as any;
    }
    public Dispose(): void {
        return {} as any;
    }
    public Reset(): void {
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
    public constructor(session?: Session) {
    }
    public get Completed(): boolean {
        return {} as any;
    }
    public set Completed(value: boolean) {
    }
    public get FilterStatus(): UrlFilterStatus {
        return {} as any;
    }
    public set FilterStatus(value: UrlFilterStatus) {
    }
    public get Data(): { [key: string]: any } {
        return {} as any;
    }
}