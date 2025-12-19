import { setActiveCollector } from "./state";
let currentCleanup;
export function onCleanup(fn) {
    currentCleanup = fn;
}
export function createEffect(fn) {
    const collector = {
        deps: new Set(),
        onTrigger: () => {
            run();
        },
    };
    let disposed = false;
    let cleanup;
    function clearDeps() {
        for (const dep of collector.deps)
            dep.subs.delete(collector);
        collector.deps.clear();
    }
    function run() {
        if (disposed)
            return;
        clearDeps();
        const prev = setActiveCollector(collector);
        const prevCleanup = currentCleanup;
        currentCleanup = undefined;
        try {
            fn();
        }
        finally {
            setActiveCollector(prev);
            if (cleanup)
                cleanup();
            cleanup = currentCleanup;
            currentCleanup = prevCleanup;
        }
    }
    run();
    return () => {
        disposed = true;
        clearDeps();
        if (cleanup)
            cleanup();
        cleanup = undefined;
    };
}
//# sourceMappingURL=effect.js.map