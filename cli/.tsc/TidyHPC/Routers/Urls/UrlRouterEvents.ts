import { UrlRouter } from "./UrlRouter";
import { Type } from "../../../System/Type";
export class UrlRouterEvents {
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
    public constructor(urlRouter?: UrlRouter) {
    }
    public get UrlRouter(): UrlRouter {
        return {} as any;
    }
    public get OnBeforeRouteAsync(): ((arg0?:string, arg1?:Session)=>Promise<boolean>) {
        return {} as any;
    }
    public set OnBeforeRouteAsync(value: ((arg0?:string, arg1?:Session)=>Promise<boolean>)) {
    }
    public get OnBeforeHandlerAsync(): ((arg0?:string, arg1?:Session)=>Promise<boolean>) {
        return {} as any;
    }
    public set OnBeforeHandlerAsync(value: ((arg0?:string, arg1?:Session)=>Promise<boolean>)) {
    }
    public get OnAfterHandler(): ((arg0?:string, arg1?:Session)=>Promise<void>) {
        return {} as any;
    }
    public set OnAfterHandler(value: ((arg0?:string, arg1?:Session)=>Promise<void>)) {
    }
    public get OnNoRoute(): ((arg0?:string, arg1?:Session)=>Promise<void>) {
        return {} as any;
    }
    public set OnNoRoute(value: ((arg0?:string, arg1?:Session)=>Promise<void>)) {
    }
    public get OnResponseJsonGenerated(): ((arg0?:Session, arg1?:any)=>Promise<void>) {
        return {} as any;
    }
    public set OnResponseJsonGenerated(value: ((arg0?:Session, arg1?:any)=>Promise<void>)) {
    }
}