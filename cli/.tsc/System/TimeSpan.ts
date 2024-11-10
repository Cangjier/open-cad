import { IFormatProvider } from "./IFormatProvider";
import { TimeSpanStyles } from "./Globalization/TimeSpanStyles";
import { Type } from "./Type";
export class TimeSpan {
    public Add(ts?: TimeSpan): TimeSpan {
        return {} as any;
    }
    public CompareTo(value?: any | TimeSpan): number {
        return {} as any;
    }
    public Duration(): TimeSpan {
        return {} as any;
    }
    public Equals(value_or_obj?: any | TimeSpan): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Negate(): TimeSpan {
        return {} as any;
    }
    public Subtract(ts?: TimeSpan): TimeSpan {
        return {} as any;
    }
    public Multiply(factor?: number): TimeSpan {
        return {} as any;
    }
    public Divide(divisor_or_ts?: number | TimeSpan): TimeSpan | number {
        return {} as any;
    }
    public ToString(format?: string, formatProvider?: IFormatProvider): string {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(ticks_or_hours_or_days?: number, minutes_or_hours?: number, seconds_or_minutes?: number, seconds?: number, milliseconds?: number, microseconds?: number) {
    }
    public static Compare(t1?: TimeSpan, t2?: TimeSpan): number {
        return {} as any;
    }
    public static FromDays(value?: number): TimeSpan {
        return {} as any;
    }
    public static Equals(t1?: TimeSpan, t2?: TimeSpan): boolean {
        return {} as any;
    }
    public static FromHours(value?: number): TimeSpan {
        return {} as any;
    }
    public static FromMilliseconds(value?: number): TimeSpan {
        return {} as any;
    }
    public static FromMicroseconds(value?: number): TimeSpan {
        return {} as any;
    }
    public static FromMinutes(value?: number): TimeSpan {
        return {} as any;
    }
    public static FromSeconds(value?: number): TimeSpan {
        return {} as any;
    }
    public static FromTicks(value?: number): TimeSpan {
        return {} as any;
    }
    public static Parse(s_or_input?: string, formatProvider?: IFormatProvider): TimeSpan {
        return {} as any;
    }
    public static ParseExact(input?: string, format_or_formats?: string | string[], formatProvider?: IFormatProvider, styles?: TimeSpanStyles): TimeSpan {
        return {} as any;
    }
    public static op_UnaryNegation(t?: TimeSpan): TimeSpan {
        return {} as any;
    }
    public static op_Subtraction(t1?: TimeSpan, t2?: TimeSpan): TimeSpan {
        return {} as any;
    }
    public static op_UnaryPlus(t?: TimeSpan): TimeSpan {
        return {} as any;
    }
    public static op_Addition(t1?: TimeSpan, t2?: TimeSpan): TimeSpan {
        return {} as any;
    }
    public static op_Multiply(timeSpan_or_factor?: TimeSpan | number, factor_or_timeSpan?: number | TimeSpan): TimeSpan {
        return {} as any;
    }
    public static op_Division(timeSpan_or_t1?: TimeSpan, divisor_or_t2?: number | TimeSpan): TimeSpan | number {
        return {} as any;
    }
    public static op_Equality(t1?: TimeSpan, t2?: TimeSpan): boolean {
        return {} as any;
    }
    public static op_Inequality(t1?: TimeSpan, t2?: TimeSpan): boolean {
        return {} as any;
    }
    public static op_LessThan(t1?: TimeSpan, t2?: TimeSpan): boolean {
        return {} as any;
    }
    public static op_LessThanOrEqual(t1?: TimeSpan, t2?: TimeSpan): boolean {
        return {} as any;
    }
    public static op_GreaterThan(t1?: TimeSpan, t2?: TimeSpan): boolean {
        return {} as any;
    }
    public static op_GreaterThanOrEqual(t1?: TimeSpan, t2?: TimeSpan): boolean {
        return {} as any;
    }
    public static Zero: TimeSpan;
    public static MaxValue: TimeSpan;
    public static MinValue: TimeSpan;
    public static NanosecondsPerTick: number;
    public static TicksPerMicrosecond: number;
    public static TicksPerMillisecond: number;
    public static TicksPerSecond: number;
    public static TicksPerMinute: number;
    public static TicksPerHour: number;
    public static TicksPerDay: number;
    public get Ticks(): number {
        return {} as any;
    }
    public get Days(): number {
        return {} as any;
    }
    public get Hours(): number {
        return {} as any;
    }
    public get Milliseconds(): number {
        return {} as any;
    }
    public get Microseconds(): number {
        return {} as any;
    }
    public get Nanoseconds(): number {
        return {} as any;
    }
    public get Minutes(): number {
        return {} as any;
    }
    public get Seconds(): number {
        return {} as any;
    }
    public get TotalDays(): number {
        return {} as any;
    }
    public get TotalHours(): number {
        return {} as any;
    }
    public get TotalMilliseconds(): number {
        return {} as any;
    }
    public get TotalMicroseconds(): number {
        return {} as any;
    }
    public get TotalNanoseconds(): number {
        return {} as any;
    }
    public get TotalMinutes(): number {
        return {} as any;
    }
    public get TotalSeconds(): number {
        return {} as any;
    }
}