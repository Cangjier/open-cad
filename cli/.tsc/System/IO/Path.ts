import { Type } from "../Type";
export class Path {
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
    public static ChangeExtension(path?: string, extension?: string): string {
        return {} as any;
    }
    public static Exists(path?: string): boolean {
        return {} as any;
    }
    public static GetDirectoryName(path?: string): string {
        return {} as any;
    }
    public static GetExtension(path?: string): string {
        return {} as any;
    }
    public static GetFileName(path?: string): string {
        return {} as any;
    }
    public static GetFileNameWithoutExtension(path?: string): string {
        return {} as any;
    }
    public static GetRandomFileName(): string {
        return {} as any;
    }
    public static IsPathFullyQualified(path?: string): boolean {
        return {} as any;
    }
    public static HasExtension(path?: string): boolean {
        return {} as any;
    }
    public static Combine(path1_or_paths?: string | string[], path2?: string, path3?: string, path4?: string): string {
        return {} as any;
    }
    public static Join(path1_or_paths?: string | string[], path2?: string, path3?: string, path4?: string): string {
        return {} as any;
    }
    public static GetRelativePath(relativeTo?: string, path?: string): string {
        return {} as any;
    }
    public static TrimEndingDirectorySeparator(path?: string): string {
        return {} as any;
    }
    public static EndsInDirectorySeparator(path?: string): boolean {
        return {} as any;
    }
    public static GetInvalidFileNameChars(): string[] {
        return {} as any;
    }
    public static GetInvalidPathChars(): string[] {
        return {} as any;
    }
    public static GetFullPath(path?: string, basePath?: string): string {
        return {} as any;
    }
    public static GetTempPath(): string {
        return {} as any;
    }
    public static GetTempFileName(): string {
        return {} as any;
    }
    public static IsPathRooted(path?: string): boolean {
        return {} as any;
    }
    public static GetPathRoot(path?: string): string {
        return {} as any;
    }
    public static DirectorySeparatorChar: string;
    public static AltDirectorySeparatorChar: string;
    public static VolumeSeparatorChar: string;
    public static PathSeparator: string;
    public static InvalidPathChars: string[];
}