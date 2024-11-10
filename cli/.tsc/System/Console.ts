import { TextReader } from "./IO/TextReader";
import { Encoding } from "./Text/Encoding";
import { ConsoleKeyInfo } from "./ConsoleKeyInfo";
import { TextWriter } from "./IO/TextWriter";
import { ConsoleColor } from "./ConsoleColor";
import { ConsoleCancelEventHandler } from "./ConsoleCancelEventHandler";
import { Stream } from "./IO/Stream";
import { Type } from "./Type";
export class Console {
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
    public static ReadKey(intercept?: boolean): ConsoleKeyInfo {
        return {} as any;
    }
    public static ResetColor(): void {
        return {} as any;
    }
    public static SetBufferSize(width?: number, height?: number): void {
        return {} as any;
    }
    public static SetWindowPosition(left?: number, top?: number): void {
        return {} as any;
    }
    public static SetWindowSize(width?: number, height?: number): void {
        return {} as any;
    }
    public static Beep(frequency?: number, duration?: number): void {
        return {} as any;
    }
    public static MoveBufferArea(sourceLeft?: number, sourceTop?: number, sourceWidth?: number, sourceHeight?: number, targetLeft?: number, targetTop?: number, sourceChar?: string, sourceForeColor?: ConsoleColor, sourceBackColor?: ConsoleColor): void {
        return {} as any;
    }
    public static Clear(): void {
        return {} as any;
    }
    public static SetCursorPosition(left?: number, top?: number): void {
        return {} as any;
    }
    public static add_CancelKeyPress(value?: ConsoleCancelEventHandler): void {
        return {} as any;
    }
    public static remove_CancelKeyPress(value?: ConsoleCancelEventHandler): void {
        return {} as any;
    }
    public static OpenStandardInput(bufferSize?: number): Stream {
        return {} as any;
    }
    public static OpenStandardOutput(bufferSize?: number): Stream {
        return {} as any;
    }
    public static OpenStandardError(bufferSize?: number): Stream {
        return {} as any;
    }
    public static SetIn(newIn?: TextReader): void {
        return {} as any;
    }
    public static SetOut(newOut?: TextWriter): void {
        return {} as any;
    }
    public static SetError(newError?: TextWriter): void {
        return {} as any;
    }
    public static Read(): number {
        return {} as any;
    }
    public static ReadLine(): string {
        return {} as any;
    }
    public static WriteLine(value_or_buffer_or_format?: boolean | string | string[] | number | any, index_or_arg0_or_arg?: number | any | any[], count_or_arg1?: number | any, arg2?: any): void {
        return {} as any;
    }
    public static Write(format_or_value_or_buffer?: string | boolean | string[] | number | any, arg0_or_arg_or_index?: any | any[] | number, arg1_or_count?: any | number, arg2?: any): void {
        return {} as any;
    }
    public static get In(): TextReader {
        return {} as any;
    }
    public static get InputEncoding(): Encoding {
        return {} as any;
    }
    public static set InputEncoding(value: Encoding) {
    }
    public static get OutputEncoding(): Encoding {
        return {} as any;
    }
    public static set OutputEncoding(value: Encoding) {
    }
    public static get KeyAvailable(): boolean {
        return {} as any;
    }
    public static get Out(): TextWriter {
        return {} as any;
    }
    public static get Error(): TextWriter {
        return {} as any;
    }
    public static get IsInputRedirected(): boolean {
        return {} as any;
    }
    public static get IsOutputRedirected(): boolean {
        return {} as any;
    }
    public static get IsErrorRedirected(): boolean {
        return {} as any;
    }
    public static get CursorSize(): number {
        return {} as any;
    }
    public static set CursorSize(value: number) {
    }
    public static get NumberLock(): boolean {
        return {} as any;
    }
    public static get CapsLock(): boolean {
        return {} as any;
    }
    public static get BackgroundColor(): ConsoleColor {
        return {} as any;
    }
    public static set BackgroundColor(value: ConsoleColor) {
    }
    public static get ForegroundColor(): ConsoleColor {
        return {} as any;
    }
    public static set ForegroundColor(value: ConsoleColor) {
    }
    public static get BufferWidth(): number {
        return {} as any;
    }
    public static set BufferWidth(value: number) {
    }
    public static get BufferHeight(): number {
        return {} as any;
    }
    public static set BufferHeight(value: number) {
    }
    public static get WindowLeft(): number {
        return {} as any;
    }
    public static set WindowLeft(value: number) {
    }
    public static get WindowTop(): number {
        return {} as any;
    }
    public static set WindowTop(value: number) {
    }
    public static get WindowWidth(): number {
        return {} as any;
    }
    public static set WindowWidth(value: number) {
    }
    public static get WindowHeight(): number {
        return {} as any;
    }
    public static set WindowHeight(value: number) {
    }
    public static get LargestWindowWidth(): number {
        return {} as any;
    }
    public static get LargestWindowHeight(): number {
        return {} as any;
    }
    public static get CursorVisible(): boolean {
        return {} as any;
    }
    public static set CursorVisible(value: boolean) {
    }
    public static get CursorLeft(): number {
        return {} as any;
    }
    public static set CursorLeft(value: number) {
    }
    public static get CursorTop(): number {
        return {} as any;
    }
    public static set CursorTop(value: number) {
    }
    public static get Title(): string {
        return {} as any;
    }
    public static set Title(value: string) {
    }
    public static get TreatControlCAsInput(): boolean {
        return {} as any;
    }
    public static set TreatControlCAsInput(value: boolean) {
    }
}