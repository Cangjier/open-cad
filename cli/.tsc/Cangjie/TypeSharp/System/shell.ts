import { processConfig } from "./processConfig";
import { Type } from "../../../System/Type";
import { Process } from "../../../System/Diagnostics/Process";
export class shell {
    public kill(): void {
        return {} as any;
    }
    public read(): string {
        return {} as any;
    }
    public readLines(): string[] {
        return {} as any;
    }
    public readLinesWhen(predicate?: ((arg0?:string)=>boolean)): Promise<string[]> {
        return {} as any;
    }
    public when(predicate?: ((arg0?:string)=>boolean)): Promise<void> {
        return {} as any;
    }
    public writeLine(value?: string): void {
        return {} as any;
    }
    public write(value?: string): void {
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
    public constructor(process?: Process) {
    }
    public static start(config?: processConfig): shell {
        return {} as any;
    }
    public static cmd(workingDirectory?: string, commandLine?: string): shell {
        return {} as any;
    }
}