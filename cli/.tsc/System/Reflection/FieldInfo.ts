import { RuntimeFieldHandle } from "../RuntimeFieldHandle";
import { RuntimeTypeHandle } from "../RuntimeTypeHandle";
import { MemberTypes } from "./MemberTypes";
import { FieldAttributes } from "./FieldAttributes";
import { Type } from "../Type";
import { BindingFlags } from "./BindingFlags";
import { Binder } from "./Binder";
import { CultureInfo } from "../Globalization/CultureInfo";
import { TypedReference } from "../TypedReference";
import { Module } from "./Module";
import { MemberInfo } from "./MemberInfo";
export class FieldInfo {
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public GetValue(obj?: any): any {
        return {} as any;
    }
    public SetValue(obj?: any, value?: any, invokeAttr?: BindingFlags, binder?: Binder, culture?: CultureInfo): void {
        return {} as any;
    }
    public SetValueDirect(obj?: TypedReference, value?: any): void {
        return {} as any;
    }
    public GetValueDirect(obj?: TypedReference): any {
        return {} as any;
    }
    public GetRawConstantValue(): any {
        return {} as any;
    }
    public GetModifiedFieldType(): Type {
        return {} as any;
    }
    public GetOptionalCustomModifiers(): Type[] {
        return {} as any;
    }
    public GetRequiredCustomModifiers(): Type[] {
        return {} as any;
    }
    public HasSameMetadataDefinitionAs(other?: MemberInfo): boolean {
        return {} as any;
    }
    public IsDefined(attributeType?: Type, inherit?: boolean): boolean {
        return {} as any;
    }
    public GetCustomAttributes(inherit_or_attributeType?: boolean | Type, inherit?: boolean): any[] {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public static GetFieldFromHandle(handle?: RuntimeFieldHandle, declaringType?: RuntimeTypeHandle): FieldInfo {
        return {} as any;
    }
    public static op_Equality(left?: FieldInfo, right?: FieldInfo): boolean {
        return {} as any;
    }
    public static op_Inequality(left?: FieldInfo, right?: FieldInfo): boolean {
        return {} as any;
    }
    public get MemberType(): MemberTypes {
        return {} as any;
    }
    public get Attributes(): FieldAttributes {
        return {} as any;
    }
    public get FieldType(): Type {
        return {} as any;
    }
    public get IsInitOnly(): boolean {
        return {} as any;
    }
    public get IsLiteral(): boolean {
        return {} as any;
    }
    public get IsNotSerialized(): boolean {
        return {} as any;
    }
    public get IsPinvokeImpl(): boolean {
        return {} as any;
    }
    public get IsSpecialName(): boolean {
        return {} as any;
    }
    public get IsStatic(): boolean {
        return {} as any;
    }
    public get IsAssembly(): boolean {
        return {} as any;
    }
    public get IsFamily(): boolean {
        return {} as any;
    }
    public get IsFamilyAndAssembly(): boolean {
        return {} as any;
    }
    public get IsFamilyOrAssembly(): boolean {
        return {} as any;
    }
    public get IsPrivate(): boolean {
        return {} as any;
    }
    public get IsPublic(): boolean {
        return {} as any;
    }
    public get IsSecurityCritical(): boolean {
        return {} as any;
    }
    public get IsSecuritySafeCritical(): boolean {
        return {} as any;
    }
    public get IsSecurityTransparent(): boolean {
        return {} as any;
    }
    public get FieldHandle(): RuntimeFieldHandle {
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