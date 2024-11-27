import { RuntimeTypeHandle } from "./RuntimeTypeHandle";
import { MemberTypes } from "./Reflection/MemberTypes";
import { Assembly } from "./Reflection/Assembly";
import { Module } from "./Reflection/Module";
import { MethodBase } from "./Reflection/MethodBase";
import { GenericParameterAttributes } from "./Reflection/GenericParameterAttributes";
import { TypeAttributes } from "./Reflection/TypeAttributes";
import { StructLayoutAttribute } from "./Runtime/InteropServices/StructLayoutAttribute";
import { ConstructorInfo } from "./Reflection/ConstructorInfo";
import { BindingFlags } from "./Reflection/BindingFlags";
import { Binder } from "./Reflection/Binder";
import { CallingConventions } from "./Reflection/CallingConventions";
import { EventInfo } from "./Reflection/EventInfo";
import { FieldInfo } from "./Reflection/FieldInfo";
import { MemberInfo } from "./Reflection/MemberInfo";
import { MethodInfo } from "./Reflection/MethodInfo";
import { PropertyInfo } from "./Reflection/PropertyInfo";
import { TypeCode } from "./TypeCode";
import { Guid } from "./Guid";
import { CultureInfo } from "./Globalization/CultureInfo";
import { InterfaceMapping } from "./Reflection/InterfaceMapping";
import { TypeFilter } from "./Reflection/TypeFilter";
import { MemberFilter } from "./Reflection/MemberFilter";
export class Type {
    public GetType(): Type {
        return {} as any;
    }
    public GetElementType(): Type {
        return {} as any;
    }
    public GetArrayRank(): number {
        return {} as any;
    }
    public GetGenericTypeDefinition(): Type {
        return {} as any;
    }
    public GetGenericArguments(): Type[] {
        return {} as any;
    }
    public GetOptionalCustomModifiers(): Type[] {
        return {} as any;
    }
    public GetRequiredCustomModifiers(): Type[] {
        return {} as any;
    }
    public GetGenericParameterConstraints(): Type[] {
        return {} as any;
    }
    public IsAssignableTo(targetType?: Type): boolean {
        return {} as any;
    }
    public GetConstructor(types_or_bindingAttr?: Type[] | BindingFlags, types_or_binder?: Type[] | Binder, types_or_callConvention?: Type[] | CallingConventions, modifiers_or_types?: ParameterModifier[] | Type[], modifiers?: ParameterModifier[]): ConstructorInfo {
        return {} as any;
    }
    public GetConstructors(bindingAttr?: BindingFlags): ConstructorInfo[] {
        return {} as any;
    }
    public GetEvent(name?: string, bindingAttr?: BindingFlags): EventInfo {
        return {} as any;
    }
    public GetEvents(bindingAttr?: BindingFlags): EventInfo[] {
        return {} as any;
    }
    public GetField(name?: string, bindingAttr?: BindingFlags): FieldInfo {
        return {} as any;
    }
    public GetFields(bindingAttr?: BindingFlags): FieldInfo[] {
        return {} as any;
    }
    public GetFunctionPointerCallingConventions(): Type[] {
        return {} as any;
    }
    public GetFunctionPointerReturnType(): Type {
        return {} as any;
    }
    public GetFunctionPointerParameterTypes(): Type[] {
        return {} as any;
    }
    public GetMember(name?: string, bindingAttr_or_type?: BindingFlags | MemberTypes, bindingAttr?: BindingFlags): MemberInfo[] {
        return {} as any;
    }
    public GetMembers(bindingAttr?: BindingFlags): MemberInfo[] {
        return {} as any;
    }
    public GetMemberWithSameMetadataDefinitionAs(member?: MemberInfo): MemberInfo {
        return {} as any;
    }
    public GetMethod(name?: string, bindingAttr_or_types_or_genericParameterCount?: BindingFlags | Type[] | number, types_or_modifiers_or_binder_or_bindingAttr?: Type[] | ParameterModifier[] | Binder | BindingFlags, types_or_callConvention_or_modifiers_or_binder?: Type[] | CallingConventions | ParameterModifier[] | Binder, modifiers_or_types_or_callConvention?: ParameterModifier[] | Type[] | CallingConventions, modifiers_or_types?: ParameterModifier[] | Type[], modifiers?: ParameterModifier[]): MethodInfo {
        return {} as any;
    }
    public GetMethods(bindingAttr?: BindingFlags): MethodInfo[] {
        return {} as any;
    }
    public GetNestedType(name?: string, bindingAttr?: BindingFlags): Type {
        return {} as any;
    }
    public GetNestedTypes(bindingAttr?: BindingFlags): Type[] {
        return {} as any;
    }
    public GetProperty(name?: string, bindingAttr_or_returnType_or_types?: BindingFlags | Type | Type[], types_or_binder?: Type[] | Binder, modifiers_or_returnType?: ParameterModifier[] | Type, types?: Type[], modifiers?: ParameterModifier[]): PropertyInfo {
        return {} as any;
    }
    public GetProperties(bindingAttr?: BindingFlags): PropertyInfo[] {
        return {} as any;
    }
    public GetDefaultMembers(): MemberInfo[] {
        return {} as any;
    }
    public InvokeMember(name?: string, invokeAttr?: BindingFlags, binder?: Binder, target?: any, args?: any[], culture_or_modifiers?: CultureInfo | ParameterModifier[], culture?: CultureInfo, namedParameters?: string[]): any {
        return {} as any;
    }
    public GetInterface(name?: string, ignoreCase?: boolean): Type {
        return {} as any;
    }
    public GetInterfaces(): Type[] {
        return {} as any;
    }
    public GetInterfaceMap(interfaceType?: Type): InterfaceMapping {
        return {} as any;
    }
    public IsInstanceOfType(o?: any): boolean {
        return {} as any;
    }
    public IsEquivalentTo(other?: Type): boolean {
        return {} as any;
    }
    public GetEnumUnderlyingType(): Type {
        return {} as any;
    }
    public GetEnumValues(): any[] {
        return {} as any;
    }
    public GetEnumValuesAsUnderlyingType(): any[] {
        return {} as any;
    }
    public MakeArrayType(rank?: number): Type {
        return {} as any;
    }
    public MakeByRefType(): Type {
        return {} as any;
    }
    public MakeGenericType(typeArguments?: Type[]): Type {
        return {} as any;
    }
    public MakePointerType(): Type {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public Equals(o?: any | Type): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public IsEnumDefined(value?: any): boolean {
        return {} as any;
    }
    public GetEnumName(value?: any): string {
        return {} as any;
    }
    public GetEnumNames(): string[] {
        return {} as any;
    }
    public FindInterfaces(filter?: TypeFilter, filterCriteria?: any): Type[] {
        return {} as any;
    }
    public FindMembers(memberType?: MemberTypes, bindingAttr?: BindingFlags, filter?: MemberFilter, filterCriteria?: any): MemberInfo[] {
        return {} as any;
    }
    public IsSubclassOf(c?: Type): boolean {
        return {} as any;
    }
    public IsAssignableFrom(c?: Type): boolean {
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
    public static GetType(typeName?: string, throwOnError_or_assemblyResolver?: boolean | ((arg0?:AssemblyName)=>Assembly), ignoreCase_or_typeResolver?: boolean | ((arg0?:Assembly, arg1?:string, arg2?:boolean)=>Type), throwOnError?: boolean, ignoreCase?: boolean): Type {
        return {} as any;
    }
    public static GetTypeFromHandle(handle?: RuntimeTypeHandle): Type {
        return {} as any;
    }
    public static GetTypeHandle(o?: any): RuntimeTypeHandle {
        return {} as any;
    }
    public static GetTypeArray(args?: any[]): Type[] {
        return {} as any;
    }
    public static GetTypeCode(type?: Type): TypeCode {
        return {} as any;
    }
    public static GetTypeFromCLSID(clsid?: Guid, throwOnError_or_server?: boolean | string, throwOnError?: boolean): Type {
        return {} as any;
    }
    public static GetTypeFromProgID(progID?: string, throwOnError_or_server?: boolean | string, throwOnError?: boolean): Type {
        return {} as any;
    }
    public static MakeGenericSignatureType(genericTypeDefinition?: Type, typeArguments?: Type[]): Type {
        return {} as any;
    }
    public static MakeGenericMethodParameter(position?: number): Type {
        return {} as any;
    }
    public static op_Equality(left?: Type, right?: Type): boolean {
        return {} as any;
    }
    public static op_Inequality(left?: Type, right?: Type): boolean {
        return {} as any;
    }
    public static ReflectionOnlyGetType(typeName?: string, throwIfNotFound?: boolean, ignoreCase?: boolean): Type {
        return {} as any;
    }
    public static Delimiter: string;
    public static EmptyTypes: Type[];
    public static Missing: any;
    public static FilterAttribute: MemberFilter;
    public static FilterName: MemberFilter;
    public static FilterNameIgnoreCase: MemberFilter;
    public get IsInterface(): boolean {
        return {} as any;
    }
    public get MemberType(): MemberTypes {
        return {} as any;
    }
    public get Namespace(): string {
        return {} as any;
    }
    public get AssemblyQualifiedName(): string {
        return {} as any;
    }
    public get FullName(): string {
        return {} as any;
    }
    public get Assembly(): Assembly {
        return {} as any;
    }
    public get Module(): Module {
        return {} as any;
    }
    public get IsNested(): boolean {
        return {} as any;
    }
    public get DeclaringType(): Type {
        return {} as any;
    }
    public get DeclaringMethod(): MethodBase {
        return {} as any;
    }
    public get ReflectedType(): Type {
        return {} as any;
    }
    public get UnderlyingSystemType(): Type {
        return {} as any;
    }
    public get IsTypeDefinition(): boolean {
        return {} as any;
    }
    public get IsArray(): boolean {
        return {} as any;
    }
    public get IsByRef(): boolean {
        return {} as any;
    }
    public get IsPointer(): boolean {
        return {} as any;
    }
    public get IsConstructedGenericType(): boolean {
        return {} as any;
    }
    public get IsGenericParameter(): boolean {
        return {} as any;
    }
    public get IsGenericTypeParameter(): boolean {
        return {} as any;
    }
    public get IsGenericMethodParameter(): boolean {
        return {} as any;
    }
    public get IsGenericType(): boolean {
        return {} as any;
    }
    public get IsGenericTypeDefinition(): boolean {
        return {} as any;
    }
    public get IsSZArray(): boolean {
        return {} as any;
    }
    public get IsVariableBoundArray(): boolean {
        return {} as any;
    }
    public get IsByRefLike(): boolean {
        return {} as any;
    }
    public get IsFunctionPointer(): boolean {
        return {} as any;
    }
    public get IsUnmanagedFunctionPointer(): boolean {
        return {} as any;
    }
    public get HasElementType(): boolean {
        return {} as any;
    }
    public get GenericTypeArguments(): Type[] {
        return {} as any;
    }
    public get GenericParameterPosition(): number {
        return {} as any;
    }
    public get GenericParameterAttributes(): GenericParameterAttributes {
        return {} as any;
    }
    public get Attributes(): TypeAttributes {
        return {} as any;
    }
    public get IsAbstract(): boolean {
        return {} as any;
    }
    public get IsImport(): boolean {
        return {} as any;
    }
    public get IsSealed(): boolean {
        return {} as any;
    }
    public get IsSpecialName(): boolean {
        return {} as any;
    }
    public get IsClass(): boolean {
        return {} as any;
    }
    public get IsNestedAssembly(): boolean {
        return {} as any;
    }
    public get IsNestedFamANDAssem(): boolean {
        return {} as any;
    }
    public get IsNestedFamily(): boolean {
        return {} as any;
    }
    public get IsNestedFamORAssem(): boolean {
        return {} as any;
    }
    public get IsNestedPrivate(): boolean {
        return {} as any;
    }
    public get IsNestedPublic(): boolean {
        return {} as any;
    }
    public get IsNotPublic(): boolean {
        return {} as any;
    }
    public get IsPublic(): boolean {
        return {} as any;
    }
    public get IsAutoLayout(): boolean {
        return {} as any;
    }
    public get IsExplicitLayout(): boolean {
        return {} as any;
    }
    public get IsLayoutSequential(): boolean {
        return {} as any;
    }
    public get IsAnsiClass(): boolean {
        return {} as any;
    }
    public get IsAutoClass(): boolean {
        return {} as any;
    }
    public get IsUnicodeClass(): boolean {
        return {} as any;
    }
    public get IsCOMObject(): boolean {
        return {} as any;
    }
    public get IsContextful(): boolean {
        return {} as any;
    }
    public get IsEnum(): boolean {
        return {} as any;
    }
    public get IsMarshalByRef(): boolean {
        return {} as any;
    }
    public get IsPrimitive(): boolean {
        return {} as any;
    }
    public get IsValueType(): boolean {
        return {} as any;
    }
    public get IsSignatureType(): boolean {
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
    public get StructLayoutAttribute(): StructLayoutAttribute {
        return {} as any;
    }
    public get TypeInitializer(): ConstructorInfo {
        return {} as any;
    }
    public get TypeHandle(): RuntimeTypeHandle {
        return {} as any;
    }
    public get GUID(): Guid {
        return {} as any;
    }
    public get BaseType(): Type {
        return {} as any;
    }
    public static get DefaultBinder(): Binder {
        return {} as any;
    }
    public get IsSerializable(): boolean {
        return {} as any;
    }
    public get ContainsGenericParameters(): boolean {
        return {} as any;
    }
    public get IsVisible(): boolean {
        return {} as any;
    }
    public get Name(): string {
        return {} as any;
    }
    public get IsCollectible(): boolean {
        return {} as any;
    }
    public get MetadataToken(): number {
        return {} as any;
    }
}