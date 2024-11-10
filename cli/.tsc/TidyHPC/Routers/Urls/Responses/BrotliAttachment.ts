import { BrotliFile } from "./BrotliFile";
import { BinaryFile } from "./BinaryFile";
import { UrlResponse } from "./UrlResponse";
import { Type } from "../../../../System/Type";
export class BrotliAttachment {
    public ToString(): string {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(obj_or_other?: any | BrotliFile | BrotliAttachment | BinaryFile | UrlResponse): boolean {
        return {} as any;
    }
    public <Clone>$(): BrotliAttachment | BrotliFile | BinaryFile | UrlResponse {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(Path?: string, FileName?: string) {
    }
    public static op_Inequality(left?: BrotliAttachment, right?: BrotliAttachment): boolean {
        return {} as any;
    }
    public static op_Equality(left?: BrotliAttachment, right?: BrotliAttachment): boolean {
        return {} as any;
    }
    public get Path(): string {
        return {} as any;
    }
    public set Path(value: string) {
    }
    public get FileName(): string {
        return {} as any;
    }
    public set FileName(value: string) {
    }
    public get FilePath(): string {
        return {} as any;
    }
    public set FilePath(value: string) {
    }
    public get ContentType(): string {
        return {} as any;
    }
    public set ContentType(value: string) {
    }
    public get ContentDisposition(): string {
        return {} as any;
    }
    public set ContentDisposition(value: string) {
    }
    public get ContentEncoding(): string {
        return {} as any;
    }
    public set ContentEncoding(value: string) {
    }
    public get FileEncoding(): string {
        return {} as any;
    }
    public set FileEncoding(value: string) {
    }
    public get RelativeFilePath(): string {
        return {} as any;
    }
    public set RelativeFilePath(value: string) {
    }
}