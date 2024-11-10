import { AssemblyName } from "../../Reflection/AssemblyName";
import { RegexOptions } from "./RegexOptions";
import { TimeSpan } from "../../TimeSpan";
import { Match } from "./Match";
import { MatchCollection } from "./MatchCollection";
import { MatchEvaluator } from "./MatchEvaluator";
import { ValueMatchEnumerator } from "./Regex+ValueMatchEnumerator";
import { Type } from "../../Type";
export class Regex {
    public ToString(): string {
        return {} as any;
    }
    public GetGroupNames(): string[] {
        return {} as any;
    }
    public GetGroupNumbers(): number[] {
        return {} as any;
    }
    public GroupNameFromNumber(i?: number): string {
        return {} as any;
    }
    public GroupNumberFromName(name?: string): number {
        return {} as any;
    }
    public Count(input?: string): number {
        return {} as any;
    }
    public IsMatch(input?: string, startat?: number): boolean {
        return {} as any;
    }
    public Match(input?: string, startat_or_beginning?: number, length?: number): Match {
        return {} as any;
    }
    public Matches(input?: string, startat?: number): MatchCollection {
        return {} as any;
    }
    public Replace(input?: string, replacement_or_evaluator?: string | MatchEvaluator, count?: number, startat?: number): string {
        return {} as any;
    }
    public Split(input?: string, count?: number, startat?: number): string[] {
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
    public constructor(pattern?: string, options?: RegexOptions, matchTimeout?: TimeSpan) {
    }
    public static CompileToAssembly(regexinfos?: RegexCompilationInfo[], assemblyname?: AssemblyName, attributes?: CustomAttributeBuilder[], resourceFile?: string): void {
        return {} as any;
    }
    public static Escape(str?: string): string {
        return {} as any;
    }
    public static Unescape(str?: string): string {
        return {} as any;
    }
    public static Count(input?: string, pattern?: string, options?: RegexOptions, matchTimeout?: TimeSpan): number {
        return {} as any;
    }
    public static IsMatch(input?: string, pattern?: string, options?: RegexOptions, matchTimeout?: TimeSpan): boolean {
        return {} as any;
    }
    public static Match(input?: string, pattern?: string, options?: RegexOptions, matchTimeout?: TimeSpan): Match {
        return {} as any;
    }
    public static Matches(input?: string, pattern?: string, options?: RegexOptions, matchTimeout?: TimeSpan): MatchCollection {
        return {} as any;
    }
    public static Replace(input?: string, pattern?: string, replacement_or_evaluator?: string | MatchEvaluator, options?: RegexOptions, matchTimeout?: TimeSpan): string {
        return {} as any;
    }
    public static Split(input?: string, pattern?: string, options?: RegexOptions, matchTimeout?: TimeSpan): string[] {
        return {} as any;
    }
    public static InfiniteMatchTimeout: TimeSpan;
    public get Options(): RegexOptions {
        return {} as any;
    }
    public get RightToLeft(): boolean {
        return {} as any;
    }
    public static get CacheSize(): number {
        return {} as any;
    }
    public static set CacheSize(value: number) {
    }
    public get MatchTimeout(): TimeSpan {
        return {} as any;
    }
}