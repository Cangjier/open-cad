import { MemberTypes } from "./MemberTypes";
import { ParameterInfo } from "./ParameterInfo";
import { Type } from "../Type";
import { ICustomAttributeProvider } from "./ICustomAttributeProvider";
import { Delegate } from "../Delegate";
import { MethodAttributes } from "./MethodAttributes";
import { MethodImplAttributes } from "./MethodImplAttributes";
import { MethodBody } from "./MethodBody";
import { CallingConventions } from "./CallingConventions";
import { BindingFlags } from "./BindingFlags";
import { Binder } from "./Binder";
import { CultureInfo } from "../Globalization/CultureInfo";
import { RuntimeMethodHandle } from "../RuntimeMethodHandle";
import { Module } from "./Module";
import { MemberInfo } from "./MemberInfo";
export class MethodInfo {
    public GetGenericArguments(): Type[] {
        return {} as any;
    }
    public GetGenericMethodDefinition(): MethodInfo {
        return {} as any;
    }
    public MakeGenericMethod(typeArguments?: Type[]): MethodInfo {
        return {} as any;
    }
    public GetBaseDefinition(): MethodInfo {
        return {} as any;
    }
    public CreateDelegate(delegateType_or_target?: Type | any, target?: any): Delegate | null {
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
    public Invoke(obj?: any, parameters_or_invokeAttr?: any[] | BindingFlags, binder?: Binder, parameters?: any[], culture?: CultureInfo): any {
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
    public static op_Equality(left?: MethodInfo, right?: MethodInfo): boolean {
        return {} as any;
    }
    public static op_Inequality(left?: MethodInfo, right?: MethodInfo): boolean {
        return {} as any;
    }
    public get MemberType(): MemberTypes {
        return {} as any;
    }
    public get ReturnParameter(): ParameterInfo {
        return {} as any;
    }
    public get ReturnType(): Type {
        return {} as any;
    }
    public get ReturnTypeCustomAttributes(): ICustomAttributeProvider {
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