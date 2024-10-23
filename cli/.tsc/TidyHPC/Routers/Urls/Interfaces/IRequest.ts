import { Uri } from "../../../../System/Uri";
import { IRequestHeaders } from "./IRequestHeaders";
import { UrlMethods } from "../UrlMethods";
import { Stream } from "../../../../System/IO/Stream";
export class IRequest {
    public get Url(): Uri {
        return {} as any;
    }
    public get Headers(): IRequestHeaders {
        return {} as any;
    }
    public get Method(): UrlMethods {
        return {} as any;
    }
    public get Body(): Stream {
        return {} as any;
    }
}