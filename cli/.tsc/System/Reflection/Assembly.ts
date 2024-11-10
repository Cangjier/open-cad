import { AssemblyName } from "./AssemblyName";
import { MethodInfo } from "./MethodInfo";
import { ManifestResourceInfo } from "./ManifestResourceInfo";
import { Stream } from "../IO/Stream";
import { Type } from "../Type";
import { BindingFlags } from "./BindingFlags";
import { Binder } from "./Binder";
import { CultureInfo } from "../Globalization/CultureInfo";
import { ModuleResolveEventHandler } from "./ModuleResolveEventHandler";
import { Module } from "./Module";
import { Version } from "../Version";
import { FileStream } from "../IO/FileStream";
import { SerializationInfo } from "../Runtime/Serialization/SerializationInfo";
import { StreamingContext } from "../Runtime/Serialization/StreamingContext";
import { AssemblyHashAlgorithm } from "../Configuration/Assemblies/AssemblyHashAlgorithm";
import { SecurityRuleSet } from "../Security/SecurityRuleSet";
export class Assembly {
    public GetTypes(): Type[] {
        return {} as any;
    }
    public GetExportedTypes(): Type[] {
        return {} as any;
    }
    public GetForwardedTypes(): Type[] {
        return {} as any;
    }
    public GetManifestResourceInfo(resourceName?: string): ManifestResourceInfo {
        return {} as any;
    }
    public GetManifestResourceNames(): string[] {
        return {} as any;
    }
    public GetManifestResourceStream(name_or_type?: string | Type, name?: string): Stream {
        return {} as any;
    }
    public GetName(copiedName?: boolean): AssemblyName {
        return {} as any;
    }
    public GetType(name?: string, throwOnError?: boolean, ignoreCase?: boolean): Type {
        return {} as any;
    }
    public IsDefined(attributeType?: Type, inherit?: boolean): boolean {
        return {} as any;
    }
    public GetCustomAttributes(inherit_or_attributeType?: boolean | Type, inherit?: boolean): any[] {
        return {} as any;
    }
    public CreateInstance(typeName?: string, ignoreCase?: boolean, bindingAttr?: BindingFlags, binder?: Binder, args?: any[], culture?: CultureInfo, activationAttributes?: any[]): any {
        return {} as any;
    }
    public add_ModuleResolve(value?: ModuleResolveEventHandler): void {
        return {} as any;
    }
    public remove_ModuleResolve(value?: ModuleResolveEventHandler): void {
        return {} as any;
    }
    public GetModule(name?: string): Module {
        return {} as any;
    }
    public GetModules(getResourceModules?: boolean): Module[] {
        return {} as any;
    }
    public GetLoadedModules(getResourceModules?: boolean): Module[] {
        return {} as any;
    }
    public GetReferencedAssemblies(): AssemblyName[] {
        return {} as any;
    }
    public GetSatelliteAssembly(culture?: CultureInfo, version?: Version): Assembly {
        return {} as any;
    }
    public GetFile(name?: string): FileStream {
        return {} as any;
    }
    public GetFiles(getResourceModules?: boolean): FileStream[] {
        return {} as any;
    }
    public GetObjectData(info?: SerializationInfo, context?: StreamingContext): void {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public Equals(o?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public LoadModule(moduleName?: string, rawModule?: number[], rawSymbolStore?: number[]): Module {
        return {} as any;
    }
    public static Load(assemblyString_or_assemblyRef_or_rawAssembly?: string | AssemblyName | number[], rawSymbolStore?: number[]): Assembly {
        return {} as any;
    }
    public static LoadWithPartialName(partialName?: string): Assembly {
        return {} as any;
    }
    public static GetExecutingAssembly(): Assembly {
        return {} as any;
    }
    public static GetCallingAssembly(): Assembly {
        return {} as any;
    }
    public static op_Equality(left?: Assembly, right?: Assembly): boolean {
        return {} as any;
    }
    public static op_Inequality(left?: Assembly, right?: Assembly): boolean {
        return {} as any;
    }
    public static CreateQualifiedName(assemblyName?: string, typeName?: string): string {
        return {} as any;
    }
    public static GetAssembly(type?: Type): Assembly {
        return {} as any;
    }
    public static SetEntryAssembly(assembly?: Assembly): void {
        return {} as any;
    }
    public static GetEntryAssembly(): Assembly {
        return {} as any;
    }
    public static LoadFile(path?: string): Assembly {
        return {} as any;
    }
    public static LoadFrom(assemblyFile?: string, hashValue?: number[], hashAlgorithm?: AssemblyHashAlgorithm): Assembly {
        return {} as any;
    }
    public static UnsafeLoadFrom(assemblyFile?: string): Assembly {
        return {} as any;
    }
    public static ReflectionOnlyLoad(rawAssembly_or_assemblyString?: number[] | string): Assembly {
        return {} as any;
    }
    public static ReflectionOnlyLoadFrom(assemblyFile?: string): Assembly {
        return {} as any;
    }
    public get CodeBase(): string {
        return {} as any;
    }
    public get EntryPoint(): MethodInfo {
        return {} as any;
    }
    public get FullName(): string {
        return {} as any;
    }
    public get ImageRuntimeVersion(): string {
        return {} as any;
    }
    public get IsDynamic(): boolean {
        return {} as any;
    }
    public get Location(): string {
        return {} as any;
    }
    public get ReflectionOnly(): boolean {
        return {} as any;
    }
    public get IsCollectible(): boolean {
        return {} as any;
    }
    public get IsFullyTrusted(): boolean {
        return {} as any;
    }
    public get EscapedCodeBase(): string {
        return {} as any;
    }
    public get ManifestModule(): Module {
        return {} as any;
    }
    public get GlobalAssemblyCache(): boolean {
        return {} as any;
    }
    public get HostContext(): number {
        return {} as any;
    }
    public get SecurityRuleSet(): SecurityRuleSet {
        return {} as any;
    }
}