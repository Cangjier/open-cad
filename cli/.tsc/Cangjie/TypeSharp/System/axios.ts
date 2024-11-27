import { axiosResponse } from "./axiosResponse";
import { axiosConfig } from "./axiosConfig";
import { Type } from "../../../System/Type";
export class axios {
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
    public static setProxy(proxy?: string): void {
        return {} as any;
    }
    public static unsetProxy(): void {
        return {} as any;
    }
    public static setDefaultProxy(): void {
        return {} as any;
    }
    public static get(url?: string, config?: axiosConfig): Promise<axiosResponse> {
        return {} as any;
    }
    public static delete(url?: string, config?: axiosConfig): Promise<axiosResponse> {
        return {} as any;
    }
    public static post(url?: string, data?: any, config?: axiosConfig): Promise<axiosResponse> {
        return {} as any;
    }
    public static put(url?: string, data?: any, config?: axiosConfig): Promise<axiosResponse> {
        return {} as any;
    }
    public static patch(url?: string, data?: any, config?: axiosConfig): Promise<axiosResponse> {
        return {} as any;
    }
    public static download(url?: string, path_or_onPath?: string | ((arg0?:string)=>string)): Promise<string> {
        return {} as any;
    }
}