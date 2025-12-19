import { isInBatch, schedule } from "./scheduler";
let activeCollector = null;
export function setActiveCollector(next) {
    const prev = activeCollector;
    activeCollector = next;
    return prev;
}
export function collectDep(dep) {
    if (!activeCollector)
        return;
    if (!activeCollector.deps.has(dep)) {
        activeCollector.deps.add(dep);
        dep.subs.add(activeCollector);
    }
}
export function createState(initial) {
    const dep = { subs: new Set() };
    let value = initial;
    const get = (() => {
        collectDep(dep);
        return value;
    });
    const set = (next) => {
        const nextValue = typeof next === "function" ? next(value) : next;
        if (Object.is(nextValue, value))
            return;
        value = nextValue;
        for (const sub of dep.subs) {
            if (isInBatch()) {
                schedule(sub.onTrigger);
            }
            else {
                schedule(sub.onTrigger);
            }
        }
    };
    get.set = set;
    return get;
}
//# sourceMappingURL=state.js.map