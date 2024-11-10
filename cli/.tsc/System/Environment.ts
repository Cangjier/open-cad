import { Exception } from "./Exception";
import { EnvironmentVariableTarget } from "./EnvironmentVariableTarget";
import { IDictionary } from "./Collections/IDictionary";
import { SpecialFolder } from "./Environment+SpecialFolder";
import { SpecialFolderOption } from "./Environment+SpecialFolderOption";
import { OperatingSystem } from "./OperatingSystem";
import { Version } from "./Version";
import { Type } from "./Type";
export class Environment {
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
    public static Exit(exitCode?: number): void {
        return {} as any;
    }
    public static FailFast(message?: string, exception?: Exception): void {
        return {} as any;
    }
    public static GetEnvironmentVariable(variable?: string, target?: EnvironmentVariableTarget): string {
        return {} as any;
    }
    public static GetEnvironmentVariables(target?: EnvironmentVariableTarget): IDictionary {
        return {} as any;
    }
    public static SetEnvironmentVariable(variable?: string, value?: string, target?: EnvironmentVariableTarget): void {
        return {} as any;
    }
    public static GetCommandLineArgs(): string[] {
        return {} as any;
    }
    public static ExpandEnvironmentVariables(name?: string): string {
        return {} as any;
    }
    public static GetFolderPath(folder?: SpecialFolder, option?: SpecialFolderOption): string {
        return {} as any;
    }
    public static GetLogicalDrives(): string[] {
        return {} as any;
    }
    public static get CurrentManagedThreadId(): number {
        return {} as any;
    }
    public static get ExitCode(): number {
        return {} as any;
    }
    public static set ExitCode(value: number) {
    }
    public static get TickCount(): number {
        return {} as any;
    }
    public static get TickCount64(): number {
        return {} as any;
    }
    public static get ProcessorCount(): number {
        return {} as any;
    }
    public static get IsPrivilegedProcess(): boolean {
        return {} as any;
    }
    public static get HasShutdownStarted(): boolean {
        return {} as any;
    }
    public static get CommandLine(): string {
        return {} as any;
    }
    public static get CurrentDirectory(): string {
        return {} as any;
    }
    public static set CurrentDirectory(value: string) {
    }
    public static get ProcessId(): number {
        return {} as any;
    }
    public static get ProcessPath(): string {
        return {} as any;
    }
    public static get Is64BitProcess(): boolean {
        return {} as any;
    }
    public static get Is64BitOperatingSystem(): boolean {
        return {} as any;
    }
    public static get NewLine(): string {
        return {} as any;
    }
    public static get OSVersion(): OperatingSystem {
        return {} as any;
    }
    public static get Version(): Version {
        return {} as any;
    }
    public static get StackTrace(): string {
        return {} as any;
    }
    public static get SystemPageSize(): number {
        return {} as any;
    }
    public static get UserName(): string {
        return {} as any;
    }
    public static get UserDomainName(): string {
        return {} as any;
    }
    public static get MachineName(): string {
        return {} as any;
    }
    public static get SystemDirectory(): string {
        return {} as any;
    }
    public static get UserInteractive(): boolean {
        return {} as any;
    }
    public static get WorkingSet(): number {
        return {} as any;
    }
}