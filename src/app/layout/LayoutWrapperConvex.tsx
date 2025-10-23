import { getBaseUrlConvex } from "@/app/url/getBaseUrl"
import { ConvexContext } from "@/utils/convex/convexContext"
import { ConvexClient } from "convex/browser"
import { createEffect } from "solid-js"
import { Toaster } from "~ui/interactive/toast/Toaster"
import { TailwindIndicator } from "~ui/static/dev/TailwindIndicator"
import type { HasChildren } from "~ui/utils/HasChildren"
import type { MayHaveTitle } from "~ui/utils/MayHaveTitle"

export interface LayoutWrapperConvexProps extends HasChildren, MayHaveTitle {}

export function LayoutWrapperConvex(p: LayoutWrapperConvexProps) {
  const convex = new ConvexClient(getBaseUrlConvex()!)
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
