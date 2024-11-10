import { UrlFilterStatus } from "./UrlFilterStatus";
import { UrlResponse } from "./UrlResponse";
import { Type } from "../../../../System/Type";
export class FilterResult {
    public ToString(): string {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public Equals(obj_or_other?: any | UrlResponse | FilterResult): boolean {
        return {} as any;
    }
    public <Clone>$(): FilterResult | UrlResponse {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(status?: UrlFilterStatus) {
    }
    public static op_Implicit(status?: UrlFilterStatus | boolean): FilterResult {
        return {} as any;
    }
    public static op_Inequality(left?: FilterResult, right?: FilterResult): boolean {
        return {} as any;
    }
    public static op_Equality(left?: FilterResult, right?: FilterResult): boolean {
        return {} as any;
    }
    public get Status(): UrlFilterStatus {
        return {} as any;
    }
}