type Phase = 'hidden' | 'visible' | 'leaving'
type Clock = { now: () => number; schedule: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>; clear: (id: ReturnType<typeof setTimeout>) => void }
export function createLoadingGate(update: (phase: Phase) => void, clock: Clock = { now: Date.now, schedule: (fn, ms) => setTimeout(fn, ms), clear: id => clearTimeout(id) }) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let shown: number | null = null
  let resolveFinish: (() => void) | undefined
  function cancel() {
    if (timer !== undefined) clock.clear(timer)
    timer = undefined; shown = null; update('hidden'); resolveFinish?.(); resolveFinish = undefined
  }
  return {
    start() { cancel(); timer = clock.schedule(() => { shown = clock.now(); update('visible') }, 450) },
    finish() {
      if (timer !== undefined) clock.clear(timer)
      if (shown === null) { update('hidden'); return Promise.resolve() }
      const visibleSince = shown
      return new Promise<void>(resolve => {
        resolveFinish = resolve
        timer = clock.schedule(() => {
          update('leaving')
          timer = clock.schedule(() => { shown = null; update('hidden'); resolveFinish = undefined; resolve() }, 180)
        }, Math.max(0, 350 - (clock.now() - visibleSince)))
      })
    },
    cancel,
  }
}
