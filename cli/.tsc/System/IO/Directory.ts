import { DirectoryInfo } from "./DirectoryInfo";
import { UnixFileMode } from "./UnixFileMode";
import { DateTime } from "../DateTime";
import { SearchOption } from "./SearchOption";
import { EnumerationOptions } from "./EnumerationOptions";
import { FileSystemInfo } from "./FileSystemInfo";
import { Type } from "../Type";
export class Directory {
    public GetType(): Type {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public static GetParent(path?: string): DirectoryInfo {
        return {} as any;
    }
    public static CreateDirectory(path?: string, unixCreateMode?: UnixFileMode): DirectoryInfo {
        return {} as any;
    }
    public static CreateTempSubdirectory(prefix?: string): DirectoryInfo {
        return {} as any;
    }
    public static Exists(path?: string): boolean {
        return {} as any;
    }
    public static SetCreationTime(path?: string, creationTime?: DateTime): void {
        return {} as any;
    }
    public static SetCreationTimeUtc(path?: string, creationTimeUtc?: DateTime): void {
        return {} as any;
    }
    public static GetCreationTime(path?: string): DateTime {
        return {} as any;
    }
    public static GetCreationTimeUtc(path?: string): DateTime {
        return {} as any;
    }
    public static SetLastWriteTime(path?: string, lastWriteTime?: DateTime): void {
        return {} as any;
    }
    public static SetLastWriteTimeUtc(path?: string, lastWriteTimeUtc?: DateTime): void {
        return {} as any;
    }
    public static GetLastWriteTime(path?: string): DateTime {
        return {} as any;
    }
    public static GetLastWriteTimeUtc(path?: string): DateTime {
        return {} as any;
    }
    public static SetLastAccessTime(path?: string, lastAccessTime?: DateTime): void {
        return {} as any;
    }
    public static SetLastAccessTimeUtc(path?: string, lastAccessTimeUtc?: DateTime): void {
        return {} as any;
    }
    public static GetLastAccessTime(path?: string): DateTime {
        return {} as any;
    }
    public static GetLastAccessTimeUtc(path?: string): DateTime {
        return {} as any;
    }
    public static GetFiles(path?: string, searchPattern?: string, searchOption_or_enumerationOptions?: SearchOption | EnumerationOptions): string[] {
        return {} as any;
    }
    public static GetDirectories(path?: string, searchPattern?: string, searchOption_or_enumerationOptions?: SearchOption | EnumerationOptions): string[] {
        return {} as any;
    }
    public static GetFileSystemEntries(path?: string, searchPattern?: string, searchOption_or_enumerationOptions?: SearchOption | EnumerationOptions): string[] {
        return {} as any;
    }
    public static GetDirectoryRoot(path?: string): string {
        return {} as any;
    }
    public static GetCurrentDirectory(): string {
        return {} as any;
    }
    public static SetCurrentDirectory(path?: string): void {
        return {} as any;
    }
    public static Move(sourceDirName?: string, destDirName?: string): void {
        return {} as any;
    }
    public static Delete(path?: string, recursive?: boolean): void {
        return {} as any;
    }
    public static GetLogicalDrives(): string[] {
        return {} as any;
    }
    public static CreateSymbolicLink(path?: string, pathToTarget?: string): FileSystemInfo {
        return {} as any;
    }
    public static ResolveLinkTarget(linkPath?: string, returnFinalTarget?: boolean): FileSystemInfo {
        return {} as any;
    }
}