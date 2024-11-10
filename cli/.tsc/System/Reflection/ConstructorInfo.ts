import { MemberTypes } from "./MemberTypes";
import { BindingFlags } from "./BindingFlags";
import { Binder } from "./Binder";
import { CultureInfo } from "../Globalization/CultureInfo";
import { MethodAttributes } from "./MethodAttributes";
import { MethodImplAttributes } from "./MethodImplAttributes";
import { MethodBody } from "./MethodBody";
import { CallingConventions } from "./CallingConventions";
import { RuntimeMethodHandle } from "../RuntimeMethodHandle";
import { Type } from "../Type";
import { Module } from "./Module";
import { MemberInfo } from "./MemberInfo";
export class ConstructorInfo {
    public Invoke(parameters_or_invokeAttr_or_obj?: any[] | BindingFlags | any, binder_or_parameters_or_invokeAttr?: Binder | any[] | BindingFlags, parameters_or_binder?: any[] | Binder, culture_or_parameters?: CultureInfo | any[], culture?: CultureInfo): any {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public GetParameters(): ParameterInfo[] {
        return {} as any;
    }
    public GetMethodImplementationFlags(): MethodImplAttributes {
        return {} as any;
    }
    public GetMethodBody(): MethodBody {
        return {} as any;
    }
    public GetGenericArguments(): Type[] {
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
    public static op_Equality(left?: ConstructorInfo, right?: ConstructorInfo): boolean {
        return {} as any;
    }
    public static op_Inequality(left?: ConstructorInfo, right?: ConstructorInfo): boolean {
        return {} as any;
    }
    public static ConstructorName: string;
    public static TypeConstructorName: string;
    public get MemberType(): MemberTypes {
        return {} as any;
    }
    public get Attributes(): MethodAttributes {
        return {} as any;
    }
    public get MethodImplementationFlags(): MethodImplAttributes {
        return {} as any;
    }
    public get CallingConvention(): CallingConventions {
        return {} as any;
    }
    public get IsAbstract(): boolean {
        return {} as any;
    }
    public get IsConstructor(): boolean {
        return {} as any;
    }
    public get IsFinal(): boolean {
        return {} as any;
    }
    public get IsHideBySig(): boolean {
        return {} as any;
    }
    public get IsSpecialName(): boolean {
        return {} as any;
    }
    public get IsStatic(): boolean {
        return {} as any;
    }
    public get IsVirtual(): boolean {
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
    public get IsConstructedGenericMethod(): boolean {
        return {} as any;
    }
    public get IsGenericMethod(): boolean {
        return {} as any;
    }
    public get IsGenericMethodDefinition(): boolean {
        return {} as any;
    }
    public get ContainsGenericParameters(): boolean {
        return {} as any;
    }
    public get MethodHandle(): RuntimeMethodHandle {
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