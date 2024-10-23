import { TypeCode } from "./TypeCode";
import { IFormatProvider } from "./IFormatProvider";
import { Type } from "./Type";
import { SByte } from "./SByte";
import { Int16 } from "./Int16";
import { UInt16 } from "./UInt16";
import { DateTime } from "./DateTime";
import { Base64FormattingOptions } from "./Base64FormattingOptions";
export class Convert {
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
    public static GetTypeCode(value?: any): TypeCode {
        return {} as any;
    }
    public static IsDBNull(value?: any): boolean {
        return {} as any;
    }
    public static ChangeType(value?: any, typeCode_or_conversionType?: TypeCode | Type, provider?: IFormatProvider): any {
        return {} as any;
    }
    public static ToBoolean(value?: any | boolean | SByte | string | number | Int16 | UInt16 | DateTime, provider?: IFormatProvider): boolean {
        return {} as any;
    }
    public static ToChar(value?: any | boolean | string | SByte | number | Int16 | UInt16 | DateTime, provider?: IFormatProvider): string {
        return {} as any;
    }
    public static ToSByte(value?: any | boolean | SByte | string | number | Int16 | UInt16 | DateTime, provider_or_fromBase?: IFormatProvider | number): SByte {
        return {} as any;
    }
    public static ToByte(value?: any | boolean | number | string | SByte | Int16 | UInt16 | DateTime, provider_or_fromBase?: IFormatProvider | number): number {
        return {} as any;
    }
    public static ToInt16(value?: any | boolean | string | SByte | number | UInt16 | Int16 | DateTime, provider_or_fromBase?: IFormatProvider | number): Int16 {
        return {} as any;
    }
    public static ToUInt16(value?: any | boolean | string | SByte | number | Int16 | UInt16 | DateTime, provider_or_fromBase?: IFormatProvider | number): UInt16 {
        return {} as any;
    }
    public static ToInt32(value?: any | boolean | string | SByte | number | Int16 | UInt16 | DateTime, provider_or_fromBase?: IFormatProvider | number): number {
        return {} as any;
    }
    public static ToUInt32(value?: any | boolean | string | SByte | number | Int16 | UInt16 | DateTime, provider_or_fromBase?: IFormatProvider | number): number {
        return {} as any;
    }
    public static ToInt64(value?: any | boolean | string | SByte | number | Int16 | UInt16 | DateTime, provider_or_fromBase?: IFormatProvider | number): number {
        return {} as any;
    }
    public static ToUInt64(value?: any | boolean | string | SByte | number | Int16 | UInt16 | DateTime, provider_or_fromBase?: IFormatProvider | number): number {
        return {} as any;
    }
    public static ToSingle(value?: any | SByte | number | string | Int16 | UInt16 | boolean | DateTime, provider?: IFormatProvider): number {
        return {} as any;
    }
    public static ToDouble(value?: any | SByte | number | Int16 | string | UInt16 | boolean | DateTime, provider?: IFormatProvider): number {
        return {} as any;
    }
    public static ToDecimal(value?: any | SByte | number | string | Int16 | UInt16 | boolean | DateTime, provider?: IFormatProvider): number {
        return {} as any;
    }
    public static ToDateTime(value?: DateTime | any | string | SByte | number | Int16 | UInt16 | boolean, provider?: IFormatProvider): DateTime {
        return {} as any;
    }
    public static ToString(value?: any | boolean | string | SByte | number | Int16 | UInt16 | DateTime, provider_or_toBase?: IFormatProvider | number): string {
        return {} as any;
    }
    public static ToBase64String(inArray?: number[], options_or_offset?: Base64FormattingOptions | number, length?: number, options?: Base64FormattingOptions): string {
        return {} as any;
    }
    public static ToBase64CharArray(inArray?: number[], offsetIn?: number, length?: number, outArray?: string[], offsetOut?: number, options?: Base64FormattingOptions): number {
        return {} as any;
    }
    public static FromBase64String(s?: string): number[] {
        return {} as any;
    }
    public static FromBase64CharArray(inArray?: string[], offset?: number, length?: number): number[] {
        return {} as any;
    }
    public static FromHexString(s?: string): number[] {
        return {} as any;
    }
    public static ToHexString(inArray?: number[], offset?: number, length?: number): string {
        return {} as any;
    }
    public static DBNull: any;
}