export type DepCollector = {
    deps: Set<Dep>;
    onTrigger: () => void;
};
export type Dep = {
    subs: Set<DepCollector>;
};
export type StateGetter<T> = (() => T) & {
    set: (next: T | ((prev: T) => T)) => void;
};
export declare function setActiveCollector(next: DepCollector | null): DepCollector | null;
export declare function collectDep(dep: Dep): void;
export declare function createState<T>(initial: T): StateGetter<T>;
//# sourceMappingURL=state.d.ts.map