import { Exception } from "../../System/Exception";
import { Levels } from "../Loggers/Logger+Levels";
import { Type } from "../../System/Type";
export class TraceInterface {
    public Error(message?: string, exception?: Exception): void {
        return {} as any;
    }
    public Info(message?: string, exception?: Exception): void {
        return {} as any;
    }
    public Update(trace?: TraceInterface, overwrite?: boolean): void {
        return {} as any;
    }
    public Log(level?: Levels, message?: string, exception?: Exception, popOuterFunctionCount?: number, showTrace?: boolean): void {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(target?: any) {
    }
    public static op_Implicit(trace_or_target?: TraceInterface | any): any | TraceInterface {
        return {} as any;
    }
    public Target: any;
    public get Success(): boolean {
        return {} as any;
    }
    public set Success(value: boolean) {
    }
    public get Message(): string {
        return {} as any;
    }
    public set Message(value: string) {
    }
    public get ErrorLogger(): any {
        return {} as any;
    }
    public get InfoLogger(): any {
        return {} as any;
    }
    public get DebugLogger(): any {
        return {} as any;
    }
}