import type { Dep, DepCollector } from "./state";
import { collectDep, setActiveCollector } from "./state";

let currentCleanup: (() => void) | undefined;

export function onCleanup(fn: () => void) {
  currentCleanup = fn;
}

export type EffectDispose = () => void;

export function createEffect(fn: () => void): EffectDispose {
  const collector: DepCollector = {
    deps: new Set<Dep>(),
    onTrigger: () => {
      run();
    },
  };

  let disposed = false;
  let cleanup: (() => void) | undefined;

  function clearDeps() {
    for (const dep of collector.deps) dep.subs.delete(collector);
    collector.deps.clear();
  }

  function run() {
    if (disposed) return;

    clearDeps();

    const prev = setActiveCollector(collector);
    const prevCleanup = currentCleanup;
    currentCleanup = undefined;

    try {
      fn();
    } finally {
      setActiveCollector(prev);
      if (cleanup) cleanup();
      cleanup = currentCleanup;
      currentCleanup = prevCleanup;
    }
  }

  run();

  return () => {
    disposed = true;
    clearDeps();
    if (cleanup) cleanup();
    cleanup = undefined;
  };
}
