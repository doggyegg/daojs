type Job = () => void;

let isBatching = false;
let queue: Job[] = [];
let queued = new Set<Job>();
let scheduled = false;

function flush() {
  scheduled = false;
  const jobs = queue;
  queue = [];
  queued = new Set<Job>();
  for (const job of jobs) job();
}

export function schedule(job: Job) {
  if (queued.has(job)) return;
  queued.add(job);
  queue.push(job);
  if (!scheduled) {
    scheduled = true;
    queueMicrotask(flush);
  }
}

export function batch<T>(fn: () => T): T {
  if (isBatching) return fn();
  isBatching = true;
  try {
    return fn();
  } finally {
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
