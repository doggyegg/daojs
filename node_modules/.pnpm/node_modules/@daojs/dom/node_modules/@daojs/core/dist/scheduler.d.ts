type Job = () => void;
export declare function schedule(job: Job): void;
export declare function batch<T>(fn: () => T): T;
export declare function isInBatch(): boolean;
export {};
//# sourceMappingURL=scheduler.d.ts.map