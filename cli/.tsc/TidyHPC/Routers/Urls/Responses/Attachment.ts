import { BinaryFile } from "./BinaryFile";
import { UrlResponse } from "./UrlResponse";
import { Type } from "../../../../System/Type";
export class Attachment {
    public ToString(): string {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(obj_or_other?: any | BinaryFile | Attachment | UrlResponse): boolean {
        return {} as any;
    }
    public <Clone>$(): Attachment | BinaryFile | UrlResponse {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(FilePath?: string, FileName?: string, RelativeFilePath?: string) {
    }
    public static op_Inequality(left?: Attachment, right?: Attachment): boolean {
        return {} as any;
    }
    public static op_Equality(left?: Attachment, right?: Attachment): boolean {
        return {} as any;
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