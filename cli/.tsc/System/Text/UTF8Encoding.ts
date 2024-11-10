import { Decoder } from "./Decoder";
import { Encoder } from "./Encoder";
import { EncoderFallback } from "./EncoderFallback";
import { DecoderFallback } from "./DecoderFallback";
import { NormalizationForm } from "./NormalizationForm";
import { Type } from "../Type";
export class UTF8Encoding {
    public GetByteCount(chars_or_s?: string[] | string, index?: number, count?: number): number {
        return {} as any;
    }
    public GetBytes(s_or_chars?: string | string[], charIndex_or_index?: number, charCount_or_count?: number, bytes?: number[], byteIndex?: number): number | number[] {
        return {} as any;
    }
    public GetCharCount(bytes?: number[], index?: number, count?: number): number {
        return {} as any;
    }
    public GetChars(bytes?: number[], byteIndex_or_index?: number, byteCount_or_count?: number, chars?: string[], charIndex?: number): number | string[] {
        return {} as any;
    }
    public GetString(bytes?: number[], index?: number, count?: number): string {
        return {} as any;
    }
    public GetDecoder(): Decoder {
        return {} as any;
    }
    public GetEncoder(): Encoder {
        return {} as any;
    }
    public GetMaxByteCount(charCount?: number): number {
        return {} as any;
    }
    public GetMaxCharCount(byteCount?: number): number {
        return {} as any;
    }
    public GetPreamble(): number[] {
        return {} as any;
    }
    public Equals(value?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Clone(): any {
        return {} as any;
    }
    public IsAlwaysNormalized(form?: NormalizationForm): boolean {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public constructor(encoderShouldEmitUTF8Identifier?: boolean, throwOnInvalidBytes?: boolean) {
    }
    public get BodyName(): string {
        return {} as any;
    }
    public get EncodingName(): string {
        return {} as any;
    }
    public get HeaderName(): string {
        return {} as any;
    }
    public get WebName(): string {
        return {} as any;
    }
    public get WindowsCodePage(): number {
        return {} as any;
    }
    public get IsBrowserDisplay(): boolean {
        return {} as any;
    }
    public get IsBrowserSave(): boolean {
        return {} as any;
    }
    public get IsMailNewsDisplay(): boolean {
        return {} as any;
    }
    public get IsMailNewsSave(): boolean {
        return {} as any;
    }
    public get IsSingleByte(): boolean {
        return {} as any;
    }
    public get EncoderFallback(): EncoderFallback {
        return {} as any;
    }
    public set EncoderFallback(value: EncoderFallback) {
    }
    public get DecoderFallback(): DecoderFallback {
        return {} as any;
    }
    public set DecoderFallback(value: DecoderFallback) {
    }
    public get IsReadOnly(): boolean {
        return {} as any;
    }
    public get CodePage(): number {
        return {} as any;
    }
}