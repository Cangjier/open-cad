import { IResponseHeaders } from "./IResponseHeaders";
import { Stream } from "../../../../System/IO/Stream";
export class IResponse {
    public get Headers(): IResponseHeaders {
        return {} as any;
    }
    public get Body(): Stream {
        return {} as any;
    }
    public get StatusCode(): number {
        return {} as any;
    }
    public set StatusCode(value: number) {
    }
}