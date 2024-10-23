import { IFormatProvider } from "./IFormatProvider";
import { Type } from "./Type";
import { UInt16 } from "./UInt16";
import { Int16 } from "./Int16";
export class Guid {
    public ToByteArray(bigEndian?: boolean): number[] {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(o_or_g?: any | Guid): boolean {
        return {} as any;
    }
    public CompareTo(value?: any | Guid): number {
        return {} as any;
    }
    public ToString(format?: string, provider?: IFormatProvider): string {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(b_or_a_or_g?: number[] | number | string, b?: UInt16 | Int16, c?: UInt16 | Int16, d?: number | number[], e?: number, f?: number, g?: number, h?: number, i?: number, j?: number, k?: number) {
    }
    public static Parse(input_or_s?: string, provider?: IFormatProvider): Guid {
        return {} as any;
    }
    public static ParseExact(input?: string, format?: string): Guid {
        return {} as any;
    }
    public static op_Equality(a?: Guid, b?: Guid): boolean {
        return {} as any;
    }
    public static op_Inequality(a?: Guid, b?: Guid): boolean {
        return {} as any;
    }
    public static op_LessThan(left?: Guid, right?: Guid): boolean {
        return {} as any;
    }
    public static op_LessThanOrEqual(left?: Guid, right?: Guid): boolean {
        return {} as any;
    }
    public static op_GreaterThan(left?: Guid, right?: Guid): boolean {
        return {} as any;
    }
    public static op_GreaterThanOrEqual(left?: Guid, right?: Guid): boolean {
        return {} as any;
    }
    public static NewGuid(): Guid {
        return {} as any;
    }
    public static Empty: Guid;
}