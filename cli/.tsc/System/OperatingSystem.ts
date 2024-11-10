import { SerializationInfo } from "./Runtime/Serialization/SerializationInfo";
import { StreamingContext } from "./Runtime/Serialization/StreamingContext";
import { PlatformID } from "./PlatformID";
import { Version } from "./Version";
import { Type } from "./Type";
export class OperatingSystem {
    public GetObjectData(info?: SerializationInfo, context?: StreamingContext): void {
        return {} as any;
    }
    public Clone(): any {
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
    public constructor(platform?: PlatformID, version?: Version) {
    }
    public static IsOSPlatform(platform?: string): boolean {
        return {} as any;
    }
    public static IsOSPlatformVersionAtLeast(platform?: string, major?: number, minor?: number, build?: number, revision?: number): boolean {
        return {} as any;
    }
    public static IsBrowser(): boolean {
        return {} as any;
    }
    public static IsWasi(): boolean {
        return {} as any;
    }
    public static IsLinux(): boolean {
        return {} as any;
    }
    public static IsFreeBSD(): boolean {
        return {} as any;
    }
    public static IsFreeBSDVersionAtLeast(major?: number, minor?: number, build?: number, revision?: number): boolean {
        return {} as any;
    }
    public static IsAndroid(): boolean {
        return {} as any;
    }
    public static IsAndroidVersionAtLeast(major?: number, minor?: number, build?: number, revision?: number): boolean {
        return {} as any;
    }
    public static IsIOS(): boolean {
        return {} as any;
    }
    public static IsIOSVersionAtLeast(major?: number, minor?: number, build?: number): boolean {
        return {} as any;
    }
    public static IsMacOS(): boolean {
        return {} as any;
    }
    public static IsMacOSVersionAtLeast(major?: number, minor?: number, build?: number): boolean {
        return {} as any;
    }
    public static IsMacCatalyst(): boolean {
        return {} as any;
    }
    public static IsMacCatalystVersionAtLeast(major?: number, minor?: number, build?: number): boolean {
        return {} as any;
    }
    public static IsTvOS(): boolean {
        return {} as any;
    }
    public static IsTvOSVersionAtLeast(major?: number, minor?: number, build?: number): boolean {
        return {} as any;
    }
    public static IsWatchOS(): boolean {
        return {} as any;
    }
    public static IsWatchOSVersionAtLeast(major?: number, minor?: number, build?: number): boolean {
        return {} as any;
    }
    public static IsWindows(): boolean {
        return {} as any;
    }
    public static IsWindowsVersionAtLeast(major?: number, minor?: number, build?: number, revision?: number): boolean {
        return {} as any;
    }
    public get Platform(): PlatformID {
        return {} as any;
    }
    public get ServicePack(): string {
        return {} as any;
    }
    public get Version(): Version {
        return {} as any;
    }
    public get VersionString(): string {
        return {} as any;
    }
}