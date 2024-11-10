import { ContentType } from "../Headers/ContentType";
import { CacheControlHeaderValue } from "../../../../System/Net/Http/Headers/CacheControlHeaderValue";
import { AuthenticationHeaderValue } from "../../../../System/Net/Http/Headers/AuthenticationHeaderValue";
import { ContentRangeHeaderValue } from "../../../../System/Net/Http/Headers/ContentRangeHeaderValue";
export class IResponseHeaders {
    public GetHeader(key?: string): string {
        return {} as any;
    }
    public SetHeader(key?: string, value?: string): void {
        return {} as any;
    }
    public get ContentType(): ContentType {
        return {} as any;
    }
    public set ContentType(value: ContentType) {
    }
    public get ContentDisposition(): string {
        return {} as any;
    }
    public set ContentDisposition(value: string) {
    }
    public get CacheControl(): CacheControlHeaderValue {
        return {} as any;
    }
    public set CacheControl(value: CacheControlHeaderValue) {
    }
    public get Authorization(): AuthenticationHeaderValue {
        return {} as any;
    }
    public set Authorization(value: AuthenticationHeaderValue) {
    }
    public get ContentRange(): ContentRangeHeaderValue {
        return {} as any;
    }
    public set ContentRange(value: ContentRangeHeaderValue) {
    }
    public get ContentEncoding(): string {
        return {} as any;
    }
    public set ContentEncoding(value: string) {
    }
}