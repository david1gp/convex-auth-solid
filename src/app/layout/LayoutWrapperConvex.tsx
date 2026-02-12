import { envBaseUrlConvexResult } from "@/app/env/public/envBaseUrlConvexResult"
import { ConvexContext } from "@/utils/convex_client/convexContext"
import { ConvexClient } from "convex/browser"
import { createEffect } from "solid-js"
import { Toaster } from "~ui/interactive/toast/Toaster"
import { TailwindIndicator } from "~ui/static/dev/TailwindIndicator"
import type { HasChildren } from "~ui/utils/HasChildren"
import type { MayHaveTitle } from "~ui/utils/MayHaveTitle"

export interface LayoutWrapperConvexProps extends HasChildren, MayHaveTitle {}

export function LayoutWrapperConvex(p: LayoutWrapperConvexProps) {
  const baseUrlResult = envBaseUrlConvexResult()
  if (!baseUrlResult.success) {
    console.error("!envBaseUrlConvex")
    return null
  }
  const convex = new ConvexClient(baseUrlResult.data)
  createEffect(() => {
    if (!p.title) return
    document.title = p.title
  })
  return (
    <>
      <ConvexContext.Provider value={convex}>{p.children}</ConvexContext.Provider>
      <TailwindIndicator />
      <Toaster />
    </>
  )
}
