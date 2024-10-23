import { StreamReader } from "./StreamReader";
import { StreamWriter } from "./StreamWriter";
import { FileStream } from "./FileStream";
import { FileOptions } from "./FileOptions";
import { FileStreamOptions } from "./FileStreamOptions";
import { FileMode } from "./FileMode";
import { FileAccess } from "./FileAccess";
import { FileShare } from "./FileShare";
import { SafeFileHandle } from "../../Microsoft/Win32/SafeHandles/SafeFileHandle";
import { DateTime } from "../DateTime";
import { FileAttributes } from "./FileAttributes";
import { UnixFileMode } from "./UnixFileMode";
import { Encoding } from "../Text/Encoding";
import { CancellationToken } from "../Threading/CancellationToken";
import { FileSystemInfo } from "./FileSystemInfo";
import { Type } from "../Type";
export class File {
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
    public static OpenText(path?: string): StreamReader {
        return {} as any;
    }
    public static CreateText(path?: string): StreamWriter {
        return {} as any;
    }
    public static AppendText(path?: string): StreamWriter {
        return {} as any;
    }
    public static Copy(sourceFileName?: string, destFileName?: string, overwrite?: boolean): void {
        return {} as any;
    }
    public static Create(path?: string, bufferSize?: number, options?: FileOptions): FileStream {
        return {} as any;
    }
    public static Delete(path?: string): void {
        return {} as any;
    }
    public static Exists(path?: string): boolean {
        return {} as any;
    }
    public static Open(path?: string, options_or_mode?: FileStreamOptions | FileMode, access?: FileAccess, share?: FileShare): FileStream {
        return {} as any;
    }
    public static OpenHandle(path?: string, mode?: FileMode, access?: FileAccess, share?: FileShare, options?: FileOptions, preallocationSize?: number): SafeFileHandle {
        return {} as any;
    }
    public static SetCreationTime(path_or_fileHandle?: string | SafeFileHandle, creationTime?: DateTime): void {
        return {} as any;
    }
    public static SetCreationTimeUtc(path_or_fileHandle?: string | SafeFileHandle, creationTimeUtc?: DateTime): void {
        return {} as any;
    }
    public static GetCreationTime(path_or_fileHandle?: string | SafeFileHandle): DateTime {
        return {} as any;
    }
    public static GetCreationTimeUtc(path_or_fileHandle?: string | SafeFileHandle): DateTime {
        return {} as any;
    }
    public static SetLastAccessTime(path_or_fileHandle?: string | SafeFileHandle, lastAccessTime?: DateTime): void {
        return {} as any;
    }
    public static SetLastAccessTimeUtc(path_or_fileHandle?: string | SafeFileHandle, lastAccessTimeUtc?: DateTime): void {
        return {} as any;
    }
    public static GetLastAccessTime(path_or_fileHandle?: string | SafeFileHandle): DateTime {
        return {} as any;
    }
    public static GetLastAccessTimeUtc(path_or_fileHandle?: string | SafeFileHandle): DateTime {
        return {} as any;
    }
    public static SetLastWriteTime(path_or_fileHandle?: string | SafeFileHandle, lastWriteTime?: DateTime): void {
        return {} as any;
    }
    public static SetLastWriteTimeUtc(path_or_fileHandle?: string | SafeFileHandle, lastWriteTimeUtc?: DateTime): void {
        return {} as any;
    }
    public static GetLastWriteTime(path_or_fileHandle?: string | SafeFileHandle): DateTime {
        return {} as any;
    }
    public static GetLastWriteTimeUtc(path_or_fileHandle?: string | SafeFileHandle): DateTime {
        return {} as any;
    }
    public static GetAttributes(path_or_fileHandle?: string | SafeFileHandle): FileAttributes {
        return {} as any;
    }
    public static SetAttributes(path_or_fileHandle?: string | SafeFileHandle, fileAttributes?: FileAttributes): void {
        return {} as any;
    }
    public static GetUnixFileMode(path_or_fileHandle?: string | SafeFileHandle): UnixFileMode {
        return {} as any;
    }
    public static SetUnixFileMode(path_or_fileHandle?: string | SafeFileHandle, mode?: UnixFileMode): void {
        return {} as any;
    }
    public static OpenRead(path?: string): FileStream {
        return {} as any;
    }
    public static OpenWrite(path?: string): FileStream {
        return {} as any;
    }
    public static ReadAllText(path?: string, encoding?: Encoding): string {
        return {} as any;
    }
    public static WriteAllText(path?: string, contents?: string, encoding?: Encoding): void {
        return {} as any;
    }
    public static ReadAllBytes(path?: string): number[] {
        return {} as any;
    }
    public static WriteAllBytes(path?: string, bytes?: number[]): void {
        return {} as any;
    }
    public static ReadAllLines(path?: string, encoding?: Encoding): string[] {
        return {} as any;
    }
    public static WriteAllLines(path?: string, contents?: string[], encoding?: Encoding): void {
        return {} as any;
    }
    public static AppendAllText(path?: string, contents?: string, encoding?: Encoding): void {
        return {} as any;
    }
    public static Replace(sourceFileName?: string, destinationFileName?: string, destinationBackupFileName?: string, ignoreMetadataErrors?: boolean): void {
        return {} as any;
    }
    public static Move(sourceFileName?: string, destFileName?: string, overwrite?: boolean): void {
        return {} as any;
    }
    public static Encrypt(path?: string): void {
        return {} as any;
    }
    public static Decrypt(path?: string): void {
        return {} as any;
    }
    public static ReadAllTextAsync(path?: string, cancellationToken_or_encoding?: CancellationToken | Encoding, cancellationToken?: CancellationToken): Promise<string> {
        return {} as any;
    }
    public static WriteAllTextAsync(path?: string, contents?: string, cancellationToken_or_encoding?: CancellationToken | Encoding, cancellationToken?: CancellationToken): Promise<void> {
        return {} as any;
    }
    public static ReadAllBytesAsync(path?: string, cancellationToken?: CancellationToken): Promise<number[]> {
        return {} as any;
    }
    public static WriteAllBytesAsync(path?: string, bytes?: number[], cancellationToken?: CancellationToken): Promise<void> {
        return {} as any;
    }
    public static ReadAllLinesAsync(path?: string, cancellationToken_or_encoding?: CancellationToken | Encoding, cancellationToken?: CancellationToken): Promise<string[]> {
        return {} as any;
    }
    public static AppendAllTextAsync(path?: string, contents?: string, cancellationToken_or_encoding?: CancellationToken | Encoding, cancellationToken?: CancellationToken): Promise<void> {
        return {} as any;
    }
    public static CreateSymbolicLink(path?: string, pathToTarget?: string): FileSystemInfo {
        return {} as any;
    }
    public static ResolveLinkTarget(linkPath?: string, returnFinalTarget?: boolean): FileSystemInfo {
        return {} as any;
    }
}