import { FileAttributes } from "./FileAttributes";
import { MatchType } from "./MatchType";
import { MatchCasing } from "./MatchCasing";
import { Type } from "../Type";
export class EnumerationOptions {
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
    public constructor() {
    }
    public get RecurseSubdirectories(): boolean {
        return {} as any;
    }
    public set RecurseSubdirectories(value: boolean) {
    }
    public get IgnoreInaccessible(): boolean {
        return {} as any;
    }
    public set IgnoreInaccessible(value: boolean) {
    }
    public get BufferSize(): number {
        return {} as any;
    }
    public set BufferSize(value: number) {
    }
    public get AttributesToSkip(): FileAttributes {
        return {} as any;
    }
    public set AttributesToSkip(value: FileAttributes) {
    }
    public get MatchType(): MatchType {
        return {} as any;
    }
    public set MatchType(value: MatchType) {
    }
    public get MatchCasing(): MatchCasing {
        return {} as any;
    }
    public set MatchCasing(value: MatchCasing) {
    }
    public get MaxRecursionDepth(): number {
        return {} as any;
    }
    public set MaxRecursionDepth(value: number) {
    }
    public get ReturnSpecialDirectories(): boolean {
        return {} as any;
    }
    public set ReturnSpecialDirectories(value: boolean) {
    }
}