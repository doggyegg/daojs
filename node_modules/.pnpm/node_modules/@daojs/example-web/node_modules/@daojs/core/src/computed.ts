import type { Dep, DepCollector } from "./state";
import { collectDep, createState, setActiveCollector } from "./state";
import { schedule } from "./scheduler";

export function createComputed<T>(fn: () => T): () => T {
  const dep: Dep = { subs: new Set() };
  const collector: DepCollector = {
    deps: new Set<Dep>(),
    onTrigger: () => {
      markDirty();
    },
  };

  let dirty = true;
  let value!: T;

  function clearDeps() {
    for (const d of collector.deps) d.subs.delete(collector);
    collector.deps.clear();
  }

  function compute() {
    clearDeps();
    const prev = setActiveCollector(collector);
    try {
      value = fn();
    } finally {
      setActiveCollector(prev);
      dirty = false;
    }
  }

  function markDirty() {
    if (dirty) return;
    dirty = true;
    for (const sub of dep.subs) schedule(sub.onTrigger);
  }

  return () => {
    collectDep(dep);
    if (dirty) compute();
    return value;
  };
}
