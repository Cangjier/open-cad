import { TimeSpan } from "./TimeSpan";
import { DateTimeKind } from "./DateTimeKind";
import { DayOfWeek } from "./DayOfWeek";
import { IFormatProvider } from "./IFormatProvider";
import { DateTimeStyles } from "./Globalization/DateTimeStyles";
import { TypeCode } from "./TypeCode";
import { Type } from "./Type";
import { DateOnly } from "./DateOnly";
import { TimeOnly } from "./TimeOnly";
import { Calendar } from "./Globalization/Calendar";
export class DateTime {
    public Add(value?: TimeSpan): DateTime {
        return {} as any;
    }
    public AddDays(value?: number): DateTime {
        return {} as any;
    }
    public AddHours(value?: number): DateTime {
        return {} as any;
    }
    public AddMilliseconds(value?: number): DateTime {
        return {} as any;
    }
    public AddMicroseconds(value?: number): DateTime {
        return {} as any;
    }
    public AddMinutes(value?: number): DateTime {
        return {} as any;
    }
    public AddMonths(months?: number): DateTime {
        return {} as any;
    }
    public AddSeconds(value?: number): DateTime {
        return {} as any;
    }
    public AddTicks(value?: number): DateTime {
        return {} as any;
    }
    public AddYears(value?: number): DateTime {
        return {} as any;
    }
    public CompareTo(value?: any | DateTime): number {
        return {} as any;
    }
    public Equals(value?: any | DateTime): boolean {
        return {} as any;
    }
    public IsDaylightSavingTime(): boolean {
        return {} as any;
    }
    public ToBinary(): number {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Subtract(value?: DateTime | TimeSpan): TimeSpan | DateTime {
        return {} as any;
    }
    public ToOADate(): number {
        return {} as any;
    }
    public ToFileTime(): number {
        return {} as any;
    }
    public ToFileTimeUtc(): number {
        return {} as any;
    }
    public ToLocalTime(): DateTime {
        return {} as any;
    }
    public ToLongDateString(): string {
        return {} as any;
    }
    public ToLongTimeString(): string {
        return {} as any;
    }
    public ToShortDateString(): string {
        return {} as any;
    }
    public ToShortTimeString(): string {
        return {} as any;
    }
    public ToString(format_or_provider?: string | IFormatProvider, provider?: IFormatProvider): string {
        return {} as any;
    }
    public ToUniversalTime(): DateTime {
        return {} as any;
    }
    public GetDateTimeFormats(provider_or_format?: IFormatProvider | string, provider?: IFormatProvider): string[] {
        return {} as any;
    }
    public GetTypeCode(): TypeCode {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(ticks_or_date_or_year?: number | DateOnly, kind_or_time_or_month?: DateTimeKind | TimeOnly | number, kind_or_day?: DateTimeKind | number, calendar_or_hour?: Calendar | number, minute?: number, second?: number, millisecond_or_kind_or_calendar?: number | DateTimeKind | Calendar, calendar_or_kind_or_microsecond?: Calendar | DateTimeKind | number, kind_or_calendar?: DateTimeKind | Calendar, kind?: DateTimeKind) {
    }
    public static Compare(t1?: DateTime, t2?: DateTime): number {
        return {} as any;
    }
    public static DaysInMonth(year?: number, month?: number): number {
        return {} as any;
    }
    public static Equals(t1?: DateTime, t2?: DateTime): boolean {
        return {} as any;
    }
    public static FromBinary(dateData?: number): DateTime {
        return {} as any;
    }
    public static FromFileTime(fileTime?: number): DateTime {
        return {} as any;
    }
    public static FromFileTimeUtc(fileTime?: number): DateTime {
        return {} as any;
    }
    public static FromOADate(d?: number): DateTime {
        return {} as any;
    }
    public static SpecifyKind(value?: DateTime, kind?: DateTimeKind): DateTime {
        return {} as any;
    }
    public static IsLeapYear(year?: number): boolean {
        return {} as any;
    }
    public static Parse(s?: string, provider?: IFormatProvider, styles?: DateTimeStyles): DateTime {
        return {} as any;
    }
    public static ParseExact(s?: string, format_or_formats?: string | string[], provider?: IFormatProvider, style?: DateTimeStyles): DateTime {
        return {} as any;
    }
    public static op_Addition(d?: DateTime, t?: TimeSpan): DateTime {
        return {} as any;
    }
    public static op_Subtraction(d_or_d1?: DateTime, t_or_d2?: TimeSpan | DateTime): DateTime | TimeSpan {
        return {} as any;
    }
    public static op_Equality(d1?: DateTime, d2?: DateTime): boolean {
        return {} as any;
    }
    public static op_Inequality(d1?: DateTime, d2?: DateTime): boolean {
        return {} as any;
    }
    public static op_LessThan(t1?: DateTime, t2?: DateTime): boolean {
        return {} as any;
    }
    public static op_LessThanOrEqual(t1?: DateTime, t2?: DateTime): boolean {
        return {} as any;
    }
    public static op_GreaterThan(t1?: DateTime, t2?: DateTime): boolean {
        return {} as any;
    }
    public static op_GreaterThanOrEqual(t1?: DateTime, t2?: DateTime): boolean {
        return {} as any;
    }
    public static MinValue: DateTime;
    public static MaxValue: DateTime;
    public static UnixEpoch: DateTime;
    public get Date(): DateTime {
        return {} as any;
    }
    public get Day(): number {
        return {} as any;
    }
    public get DayOfWeek(): DayOfWeek {
        return {} as any;
    }
    public get DayOfYear(): number {
        return {} as any;
    }
    public get Hour(): number {
        return {} as any;
    }
    public get Kind(): DateTimeKind {
        return {} as any;
    }
    public get Millisecond(): number {
        return {} as any;
    }
    public get Microsecond(): number {
        return {} as any;
    }
    public get Nanosecond(): number {
        return {} as any;
    }
    public get Minute(): number {
        return {} as any;
    }
    public get Month(): number {
        return {} as any;
    }
    public static get Now(): DateTime {
        return {} as any;
    }
    public get Second(): number {
        return {} as any;
    }
    public get Ticks(): number {
        return {} as any;
    }
    public get TimeOfDay(): TimeSpan {
        return {} as any;
    }
    public static get Today(): DateTime {
        return {} as any;
    }
    public get Year(): number {
        return {} as any;
    }
    public static get UtcNow(): DateTime {
        return {} as any;
    }
}