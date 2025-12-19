import { isInBatch, schedule } from "./scheduler";

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

let activeCollector: DepCollector | null = null;

export function setActiveCollector(next: DepCollector | null) {
  const prev = activeCollector;
  activeCollector = next;
  return prev;
}

export function collectDep(dep: Dep) {
  if (!activeCollector) return;
  if (!activeCollector.deps.has(dep)) {
    activeCollector.deps.add(dep);
    dep.subs.add(activeCollector);
  }
}

export function createState<T>(initial: T): StateGetter<T> {
  const dep: Dep = { subs: new Set() };
  let value = initial;

  const get = (() => {
    collectDep(dep);
    return value;
  }) as StateGetter<T>;

  const set = (next: T | ((prev: T) => T)) => {
    const nextValue =
      typeof next === "function" ? (next as (p: T) => T)(value) : next;
    if (Object.is(nextValue, value)) return;
    value = nextValue;

    for (const sub of dep.subs) {
      if (isInBatch()) {
        schedule(sub.onTrigger);
      } else {
        schedule(sub.onTrigger);
      }
    }
  };

  get.set = set;

  return get;
}
