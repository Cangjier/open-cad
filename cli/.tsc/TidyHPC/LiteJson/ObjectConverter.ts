import { Type } from "../../System/Type";
import { JsonSerializerOptions } from "../../System/Text/Json/JsonSerializerOptions";
import { Utf8JsonWriter } from "../../System/Text/Json/Utf8JsonWriter";
export class ObjectConverter {
    public Write(writer?: Utf8JsonWriter, value?: any, options?: JsonSerializerOptions): void {
        return {} as any;
    }
    public CanConvert(typeToConvert?: Type): boolean {
        return {} as any;
    }
    public WriteAsPropertyName(writer?: Utf8JsonWriter, value?: any, options?: JsonSerializerOptions): void {
        return {} as any;
    }
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
    public constructor() {
    }
    public get HandleNull(): boolean {
        return {} as any;
    }
    public get Type(): Type {
        return {} as any;
    }
}