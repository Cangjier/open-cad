import { CacheControlHeaderValue } from "../../../../System/Net/Http/Headers/CacheControlHeaderValue";
import { UrlResponse } from "./UrlResponse";
import { Type } from "../../../../System/Type";
export class MultiplyStreamFile {
    public ToString(): string {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(obj_or_other?: any | UrlResponse | MultiplyStreamFile): boolean {
        return {} as any;
    }
    public <Clone>$(): MultiplyStreamFile | UrlResponse {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(Streams?: Stream[], ContentType?: string, ContentDisposition?: string, ContentEncoding?: string, FileEncoding?: string, CacheControl?: CacheControlHeaderValue) {
    }
    public static op_Inequality(left?: MultiplyStreamFile, right?: MultiplyStreamFile): boolean {
        return {} as any;
    }
    public static op_Equality(left?: MultiplyStreamFile, right?: MultiplyStreamFile): boolean {
        return {} as any;
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