import { TaskScheduler } from "./TaskScheduler";
import { AggregateException } from "../../AggregateException";
import { TaskStatus } from "./TaskStatus";
import { TaskCreationOptions } from "./TaskCreationOptions";
import { TaskFactory } from "./TaskFactory";
import { TaskAwaiter } from "../../Runtime/CompilerServices/TaskAwaiter";
import { ConfiguredTaskAwaitable } from "../../Runtime/CompilerServices/ConfiguredTaskAwaitable";
import { ConfigureAwaitOptions } from "./ConfigureAwaitOptions";
import { YieldAwaitable } from "../../Runtime/CompilerServices/YieldAwaitable";
import { TimeSpan } from "../../TimeSpan";
import { CancellationToken } from "../CancellationToken";
import { TimeProvider } from "../../TimeProvider";
import { TaskContinuationOptions } from "./TaskContinuationOptions";
import { Exception } from "../../Exception";
import { Type } from "../../Type";
export class Task {
    public Start(scheduler?: TaskScheduler): void {
        return {} as any;
    }
    public RunSynchronously(scheduler?: TaskScheduler): void {
        return {} as any;
    }
    public Dispose(): void {
        return {} as any;
    }
    public GetAwaiter(): TaskAwaiter {
        return {} as any;
    }
    public ConfigureAwait(continueOnCapturedContext_or_options?: boolean | ConfigureAwaitOptions): ConfiguredTaskAwaitable {
        return {} as any;
    }
    public Wait(timeout_or_cancellationToken_or_millisecondsTimeout?: TimeSpan | CancellationToken | number, cancellationToken?: CancellationToken): void | boolean {
        return {} as any;
    }
    public WaitAsync(cancellationToken_or_timeout?: CancellationToken | TimeSpan, timeProvider_or_cancellationToken?: TimeProvider | CancellationToken, cancellationToken?: CancellationToken): Promise<void> {
        return {} as any;
    }
    public ContinueWith(continuationFunction?: null, cancellationToken_or_scheduler_or_continuationOptions_or_state?: CancellationToken | TaskScheduler | TaskContinuationOptions | any, continuationOptions_or_cancellationToken_or_scheduler?: TaskContinuationOptions | CancellationToken | TaskScheduler, scheduler_or_continuationOptions?: TaskScheduler | TaskContinuationOptions, scheduler?: TaskScheduler): null {
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
    public constructor(action?: ()=>void, cancellationToken_or_creationOptions?: CancellationToken | TaskCreationOptions, creationOptions?: TaskCreationOptions) {
    }
    public static Yield(): YieldAwaitable {
        return {} as any;
    }
    public static WaitAll(tasks?: Promise<void>, timeout_or_millisecondsTimeout_or_cancellationToken?: TimeSpan | number | CancellationToken, cancellationToken?: CancellationToken): void | boolean {
        return {} as any;
    }
    public static WaitAny(tasks?: Promise<void>, timeout_or_cancellationToken_or_millisecondsTimeout?: TimeSpan | CancellationToken | number, cancellationToken?: CancellationToken): number {
        return {} as any;
    }
    public static FromResult(result?: null): null {
        return {} as any;
    }
    public static FromException(exception?: Exception): Promise<void> | null {
        return {} as any;
    }
    public static FromCanceled(cancellationToken?: CancellationToken): Promise<void> | null {
        return {} as any;
    }
    public static Run(action_or_function?: ()=>void | null | (()=>Promise<void>), cancellationToken?: CancellationToken): Promise<void> | null {
        return {} as any;
    }
    public static Delay(delay_or_millisecondsDelay?: TimeSpan | number, timeProvider_or_cancellationToken?: TimeProvider | CancellationToken, cancellationToken?: CancellationToken): Promise<void> {
        return {} as any;
    }
    public static WhenAll(tasks?: Promise<void> | null): Promise<void> | null {
        return {} as any;
    }
    public static WhenAny(tasks_or_task1?: Promise<void> | null, task2?: Promise<void> | null): Promise<Promise<void>> | null {
        return {} as any;
    }
    public get Id(): number {
        return {} as any;
    }
    public get Exception(): AggregateException {
        return {} as any;
    }
    public get Status(): TaskStatus {
        return {} as any;
    }
    public get IsCanceled(): boolean {
        return {} as any;
    }
    public get IsCompleted(): boolean {
        return {} as any;
    }
    public get IsCompletedSuccessfully(): boolean {
        return {} as any;
    }
    public get CreationOptions(): TaskCreationOptions {
        return {} as any;
    }
    public get AsyncState(): any {
        return {} as any;
    }
    public static get Factory(): TaskFactory {
        return {} as any;
    }
    public static get CompletedTask(): Promise<void> {
        return {} as any;
    }
    public get IsFaulted(): boolean {
        return {} as any;
    }
}