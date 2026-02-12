import { createSignal } from "solid-js"
import { type SignalObject, createSignalObject } from "~ui/utils/createSignalObject"
import { onMount } from "solid-js"

export { createSignalObject, type SignalObject }

export function createStepUrlSignal(
  stepParamName: string = "step",
  initialStep: number = 1
): SignalObject<number> {
  const [get, set] = createSignal(initialStep)
  let url: URL | null = null

  onMount(() => {
    url = new URL(window.location.href)
    const stepParam = url.searchParams.get(stepParamName)
    if (stepParam) {
      const step = Number.parseInt(stepParam, 10)
      if (!Number.isNaN(step)) {
        set(step)
      }
    }
  })

  const wrappedSet: any = (step: number) => {
    set(step)
    if (url) {
      url.searchParams.set(stepParamName, String(step))
      window.history.pushState(null, "", url.href)
    }
  }

  return { get, set: wrappedSet }
}
