import { MethodBase } from "../../../../System/Reflection/MethodBase";
import { IDictionary } from "../../../../System/Collections/IDictionary";
import { Exception } from "../../../../System/Exception";
import { SerializationInfo } from "../../../../System/Runtime/Serialization/SerializationInfo";
import { StreamingContext } from "../../../../System/Runtime/Serialization/StreamingContext";
import { Type } from "../../../../System/Type";
export class NoRouterException {
    public GetBaseException(): Exception {
        return {} as any;
    }
    public GetObjectData(info?: SerializationInfo, context?: StreamingContext): void {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public constructor(url?: string) {
    }
    public get Url(): string {
        return {} as any;
    }
    public get TargetSite(): MethodBase {
        return {} as any;
    }
    public get Message(): string {
        return {} as any;
    }
    public get Data(): IDictionary {
        return {} as any;
    }
    public get InnerException(): Exception {
        return {} as any;
    }
    public get HelpLink(): string {
        return {} as any;
    }
    public set HelpLink(value: string) {
    }
    public get Source(): string {
        return {} as any;
    }
    public set Source(value: string) {
    }
    public get HResult(): number {
        return {} as any;
    }
    public set HResult(value: number) {
    }
    public get StackTrace(): string {
        return {} as any;
    }
}