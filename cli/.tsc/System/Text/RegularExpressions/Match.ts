import { GroupCollection } from "./GroupCollection";
import { CaptureCollection } from "./CaptureCollection";
import { Type } from "../../Type";
export class Match {
    public NextMatch(): Match {
        return {} as any;
    }
    public Result(replacement?: string): string {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public static Synchronized(inner?: Match): Match {
        return {} as any;
    }
    public static get Empty(): Match {
        return {} as any;
    }
    public get Groups(): GroupCollection {
        return {} as any;
    }
    public get Success(): boolean {
        return {} as any;
    }
    public get Name(): string {
        return {} as any;
    }
    public get Captures(): CaptureCollection {
        return {} as any;
    }
    public get Index(): number {
        return {} as any;
    }
    public get Length(): number {
        return {} as any;
    }
    public get Value(): string {
        return {} as any;
    }
}