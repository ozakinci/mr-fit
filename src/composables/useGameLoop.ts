import { onMounted, onUnmounted } from 'vue'

/**
 * Drives a game loop with setInterval, invoking `onTick` with the real
 * elapsed time (in seconds) since the previous tick. Starts automatically
 * on mount and cleans up automatically on unmount.
 *
 * @param onTick - callback invoked each tick with the elapsed seconds.
 * @param intervalMs - desired interval between ticks, in milliseconds.
 */
export function useGameLoop(
  onTick: (deltaSeconds: number) => void,
  intervalMs = 200,
): void {
  let intervalId: ReturnType<typeof setInterval> | undefined
  let lastTickAt = 0

  const tick = (): void => {
    const now = performance.now()
    const deltaSeconds = (now - lastTickAt) / 1000
    lastTickAt = now
    onTick(deltaSeconds)
  }

  onMounted(() => {
    lastTickAt = performance.now()
    intervalId = setInterval(tick, intervalMs)
  })

  onUnmounted(() => {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  })
}
