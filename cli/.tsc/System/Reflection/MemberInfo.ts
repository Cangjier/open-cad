import { MemberTypes } from "./MemberTypes";
import { Type } from "../Type";
import { Module } from "./Module";
export class MemberInfo {
    public HasSameMetadataDefinitionAs(other?: MemberInfo): boolean {
        return {} as any;
    }
    public IsDefined(attributeType?: Type, inherit?: boolean): boolean {
        return {} as any;
    }
    public GetCustomAttributes(inherit_or_attributeType?: boolean | Type, inherit?: boolean): any[] {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public static op_Equality(left?: MemberInfo, right?: MemberInfo): boolean {
        return {} as any;
    }
    public static op_Inequality(left?: MemberInfo, right?: MemberInfo): boolean {
        return {} as any;
    }
    public get MemberType(): MemberTypes {
        return {} as any;
    }
    public get Name(): string {
        return {} as any;
    }
    public get DeclaringType(): Type {
        return {} as any;
    }
    public get ReflectedType(): Type {
        return {} as any;
    }
    public get Module(): Module {
        return {} as any;
    }
    public get IsCollectible(): boolean {
        return {} as any;
    }
    public get MetadataToken(): number {
        return {} as any;
    }
}