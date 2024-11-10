import { ParameterAttributes } from "./ParameterAttributes";
import { MemberInfo } from "./MemberInfo";
import { Type } from "../Type";
import { StreamingContext } from "../Runtime/Serialization/StreamingContext";
export class ParameterInfo {
    public IsDefined(attributeType?: Type, inherit?: boolean): boolean {
        return {} as any;
    }
    public GetCustomAttributes(inherit_or_attributeType?: boolean | Type, inherit?: boolean): any[] {
        return {} as any;
    }
    public GetModifiedParameterType(): Type {
        return {} as any;
    }
    public GetOptionalCustomModifiers(): Type[] {
        return {} as any;
    }
    public GetRequiredCustomModifiers(): Type[] {
        return {} as any;
    }
    public GetRealObject(context?: StreamingContext): any {
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
    public get Attributes(): ParameterAttributes {
        return {} as any;
    }
    public get Member(): MemberInfo {
        return {} as any;
    }
    public get Name(): string {
        return {} as any;
    }
    public get ParameterType(): Type {
        return {} as any;
    }
    public get Position(): number {
        return {} as any;
    }
    public get IsIn(): boolean {
        return {} as any;
    }
    public get IsLcid(): boolean {
        return {} as any;
    }
    public get IsOptional(): boolean {
        return {} as any;
    }
    public get IsOut(): boolean {
        return {} as any;
    }
    public get IsRetval(): boolean {
        return {} as any;
    }
    public get DefaultValue(): any {
        return {} as any;
    }
    public get RawDefaultValue(): any {
        return {} as any;
    }
    public get HasDefaultValue(): boolean {
        return {} as any;
    }
    public get MetadataToken(): number {
        return {} as any;
    }
}