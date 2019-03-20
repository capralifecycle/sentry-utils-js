export default function makeThrottleByMeanLifetime(
  timePeriodMs: number,
  maxRequests: number
): () => boolean {
  let lastTimestamp = new Date().getTime();
  const exp = Math.exp(-1.0 / timePeriodMs);
  let count = 0;

  return () => {
    const now = new Date().getTime();
    const ticks = now - lastTimestamp;
    lastTimestamp = now;

    count = Math.pow(exp, ticks) * count;
    const accept = count <= maxRequests;
    if (accept) {
      count++;
    }
    return accept;
  };
}
