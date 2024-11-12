import { processResult } from "./processResult";
import { processConfig } from "./processConfig";
import { Guid } from "../../../System/Guid";
import { Type } from "../../../System/Type";
export class context {
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
    public static exec(config?: processConfig): processResult {
        return {} as any;
    }
    public static execAsync(config?: processConfig): Promise<processResult> {
        return {} as any;
    }
    public static start(config?: processConfig): number {
        return {} as any;
    }
    public static kill(pid?: number): void {
        return {} as any;
    }
    public static cmd(workingDirectory?: string, commandLine?: string): processResult {
        return {} as any;
    }
    public static cmdAsync(workingDirectory?: string, commandLine?: string): Promise<processResult> {
        return {} as any;
    }
    public static startCmd(workingDirectory?: string, commandLine?: string): void {
        return {} as any;
    }
    public static parseFloat(value?: string): number {
        return {} as any;
    }
    public static parseInt(value?: string): number {
        return {} as any;
    }
    public static toString(value?: any): string {
        return {} as any;
    }
    public static Number(value?: any): any {
        return {} as any;
    }
    public static copyDirectory(sourceDirectory?: string, destinationDirectory?: string): void {
        return {} as any;
    }
    public static deleteFile(sourcePath?: string): void {
        return {} as any;
    }
    public static deleteDirectory(sourceDirectory?: string): void {
        return {} as any;
    }
    public static setLoggerPath(path?: string): void {
        return {} as any;
    }
    public static getLoggerPath(): string {
        return {} as any;
    }
    public static locate(searchDirectory_or_path?: string, path?: string): string {
        return {} as any;
    }
    public static lock(id?: Guid): void {
        return {} as any;
    }
    public static lockAsync(id?: Guid): Promise<void> {
        return {} as any;
    }
    public static unlock(id?: Guid): void {
        return {} as any;
    }
    public static lockFile(filePath?: string): boolean {
        return {} as any;
    }
    public static unlockFile(filePath?: string): boolean {
        return {} as any;
    }
    public static env(environmentVariable?: string): string {
        return {} as any;
    }
    public static md5(value?: any): string {
        return {} as any;
    }
    public static args: string[];
    public static manifest: any;
    public static script_path: string;
    public static null: any;
    public static undefined: any;
}