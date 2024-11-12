import { processResult } from "./Cangjie/TypeSharp/System/processResult";
import { processConfig } from "./Cangjie/TypeSharp/System/processConfig";
import { Guid } from "./System/Guid";
import { Type } from "./System/Type";
export const args: string[] = 0 as any;
export const manifest: any = 0 as any;
export const script_path: string = 0 as any;
export const null: any = 0 as any;
export const undefined: any = 0 as any;
export const GetType:()=> Type = 0 as any
export const ToString:()=> string = 0 as any
export const Equals:(obj?: any)=> boolean = 0 as any
export const GetHashCode:()=> number = 0 as any
export const exec:(config?: processConfig) => processResult = 0 as any
export const execAsync:(config?: processConfig) => Promise<processResult> = 0 as any
export const start:(config?: processConfig) => number = 0 as any
export const kill:(pid?: number) => void = 0 as any
export const cmd:(workingDirectory?: string, commandLine?: string) => processResult = 0 as any
export const cmdAsync:(workingDirectory?: string, commandLine?: string) => Promise<processResult> = 0 as any
export const startCmd:(workingDirectory?: string, commandLine?: string) => void = 0 as any
export const parseFloat:(value?: string) => number = 0 as any
export const parseInt:(value?: string) => number = 0 as any
export const toString:(value?: any) => string = 0 as any
export const Number:(value?: any) => any = 0 as any
export const copyDirectory:(sourceDirectory?: string, destinationDirectory?: string) => void = 0 as any
export const deleteFile:(sourcePath?: string) => void = 0 as any
export const deleteDirectory:(sourceDirectory?: string) => void = 0 as any
export const setLoggerPath:(path?: string) => void = 0 as any
export const getLoggerPath:() => string = 0 as any
export const locate:(searchDirectory_or_path?: string, path?: string) => string = 0 as any
export const lock:(id?: Guid) => void = 0 as any
export const lockAsync:(id?: Guid) => Promise<void> = 0 as any
export const unlock:(id?: Guid) => void = 0 as any
export const lockFile:(filePath?: string) => boolean = 0 as any
export const unlockFile:(filePath?: string) => boolean = 0 as any
export const env:(environmentVariable?: string) => string = 0 as any
export const md5:(value?: any) => string = 0 as any