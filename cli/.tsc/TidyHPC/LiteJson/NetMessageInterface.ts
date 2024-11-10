import { Guid } from "../../System/Guid";
import { TraceInterface } from "./TraceInterface";
import { Exception } from "../../System/Exception";
import { Type } from "../../System/Type";
export class NetMessageInterface {
    public Error(message?: string, exception?: Exception): void {
        return {} as any;
    }
    public Info(message?: string): void {
        return {} as any;
    }
    public Dispose(): void {
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
    public constructor(target?: any) {
    }
    public static op_Implicit(target?: any | NetMessageInterface): NetMessageInterface | any {
        return {} as any;
    }
    public static New(): NetMessageInterface {
        return {} as any;
    }
    public Target: any;
    public get id(): Guid {
        return {} as any;
    }
    public set id(value: Guid) {
    }
    public get code(): string {
        return {} as any;
    }
    public set code(value: string) {
    }
    public get message(): string {
        return {} as any;
    }
    public set message(value: string) {
    }
    public get success(): boolean {
        return {} as any;
    }
    public set success(value: boolean) {
    }
    public get data(): any {
        return {} as any;
    }
    public set data(value: any) {
    }
    public get Trace(): TraceInterface {
        return {} as any;
    }
    public set Trace(value: TraceInterface) {
    }
}