import { Int16 } from "./Int16";
import { Type } from "./Type";
export class Version {
    public Clone(): any {
        return {} as any;
    }
    public CompareTo(version_or_value?: any | Version): number {
        return {} as any;
    }
    public Equals(obj?: any | Version): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public ToString(fieldCount?: number): string {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(major_or_version?: number | string, minor?: number, build?: number, revision?: number) {
    }
    public static Parse(input?: string): Version {
        return {} as any;
    }
    public static op_Equality(v1?: Version, v2?: Version): boolean {
        return {} as any;
    }
    public static op_Inequality(v1?: Version, v2?: Version): boolean {
        return {} as any;
    }
    public static op_LessThan(v1?: Version, v2?: Version): boolean {
        return {} as any;
    }
    public static op_LessThanOrEqual(v1?: Version, v2?: Version): boolean {
        return {} as any;
    }
    public static op_GreaterThan(v1?: Version, v2?: Version): boolean {
        return {} as any;
    }
    public static op_GreaterThanOrEqual(v1?: Version, v2?: Version): boolean {
        return {} as any;
    }
    public get Major(): number {
        return {} as any;
    }
    public get Minor(): number {
        return {} as any;
    }
    public get Build(): number {
        return {} as any;
    }
    public get Revision(): number {
        return {} as any;
    }
    public get MajorRevision(): Int16 {
        return {} as any;
    }
    public get MinorRevision(): Int16 {
        return {} as any;
    }
}