import { IRequest } from "./Interfaces/IRequest";
import { IResponse } from "./Interfaces/IResponse";
import { SessionCache } from "./SessionCache";
import { SessionSetter } from "./SessionSetter";
import { Type } from "../../../System/Type";
export class Session {
    public Complete(onComplete?: (()=>Promise<void>) | ()=>void): Promise<void> | void {
        return {} as any;
    }
    public Dispose(): void {
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
    public constructor(request?: IRequest, response?: IResponse) {
    }
    public get Request(): IRequest {
        return {} as any;
    }
    public get Response(): IResponse {
        return {} as any;
    }
    public get Cache(): SessionCache {
        return {} as any;
    }
    public get Setter(): SessionSetter {
        return {} as any;
    }
}