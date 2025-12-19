let isBatching = false;
let queue = [];
let queued = new Set();
let scheduled = false;
function flush() {
    scheduled = false;
    const jobs = queue;
    queue = [];
    queued = new Set();
    for (const job of jobs)
        job();
}
export function schedule(job) {
    if (queued.has(job))
        return;
    queued.add(job);
    queue.push(job);
    if (!scheduled) {
        scheduled = true;
        queueMicrotask(flush);
    }
}
export function batch(fn) {
    if (isBatching)
        return fn();
    isBatching = true;
    try {
        return fn();
    }
    finally {
        isBatching = false;
        if (queue.length > 0 && !scheduled) {
            scheduled = true;
            queueMicrotask(flush);
        }
    }
}
export function isInBatch() {
    return isBatching;
}
//# sourceMappingURL=scheduler.js.map