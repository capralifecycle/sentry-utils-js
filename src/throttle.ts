/**
 * Make a throttler that will return true if being throttled.
 *
 * The time period is the mean lifetime for a request counting
 * towards [maxRequests].
 *
 * This means after [timePeriodMs], 1/e of the [maxRequests] is the new count.
 */
export default function makeThrottleByMeanLifetime(
  timePeriodMs: number,
  maxRequests: number,
): () => boolean {
  let lastTimestamp = new Date().getTime()
  const exp = Math.exp(-1.0 / timePeriodMs)
  let count = 0

  return function checkIsThrottled() {
    const now = new Date().getTime()
    const ticks = now - lastTimestamp
    lastTimestamp = now

    count = Math.pow(exp, ticks) * count
    const accept = count <= maxRequests
    if (accept) {
      count++
    }
    return !accept
  }
}
