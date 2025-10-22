import { ConvexContext } from "@/utils/convex/convexContext"
import { getBaseUrlConvex } from "@/auth/url/getBaseUrl"
import { ConvexClient } from "convex/browser"
import { createEffect } from "solid-js"
import { Toaster } from "~ui/interactive/toast/Toaster"
import { TailwindIndicator } from "~ui/static/dev/TailwindIndicator"
import type { HasChildren } from "~ui/utils/ui/HasChildren"
import type { MayHaveTitle } from "~ui/utils/ui/MayHaveTitle"

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
