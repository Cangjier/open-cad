import { MultiplyStreamFile } from "./MultiplyStreamFile";
import { CacheControlHeaderValue } from "../../../../System/Net/Http/Headers/CacheControlHeaderValue";
import { UrlResponse } from "./UrlResponse";
import { Type } from "../../../../System/Type";
export class MultiplyStreamAttachment {
    public ToString(): string {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(obj_or_other?: any | MultiplyStreamFile | MultiplyStreamAttachment | UrlResponse): boolean {
        return {} as any;
    }
    public <Clone>$(): MultiplyStreamAttachment | MultiplyStreamFile | UrlResponse {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(Streams?: Stream[], FileName?: string, CacheControl?: CacheControlHeaderValue) {
    }
    public static op_Inequality(left?: MultiplyStreamAttachment, right?: MultiplyStreamAttachment): boolean {
        return {} as any;
    }
    public static op_Equality(left?: MultiplyStreamAttachment, right?: MultiplyStreamAttachment): boolean {
        return {} as any;
    }
    public get FileName(): string {
        return {} as any;
    }
    public set FileName(value: string) {
    }
    public get Streams(): Stream[] {
        return {} as any;
    }
    public set Streams(value: Stream[]) {
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
    public get CacheControl(): CacheControlHeaderValue {
        return {} as any;
    }
    public set CacheControl(value: CacheControlHeaderValue) {
    }
}