import type { Language } from "@/app/i18n/language"
import { languageParseString } from "@/app/i18n/language"
import { visibility } from "@/resource/model_field/visibility"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"

export const apiBaseResource = "/api/resource"
export const apiPathResourceList = "/list"

export async function resourceListHttpHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "resourceListRequestHandler"
  const url = new URL(request.url)

  const orgHandle = url.searchParams.get("orgHandle")
  const meetingId = url.searchParams.get("meetingId")
  const lRaw = url.searchParams.get("l")
  const l: Language | undefined = lRaw ? languageParseString(lRaw, undefined) : undefined

  const resources = await ctx.runQuery(internal.resource.resourcesListInternalQuery, {
    orgHandle: orgHandle || undefined,
    meetingId: meetingId || undefined,
    l,
    visibility: visibility.public,
  })

  return new Response(jsonStringifyPretty(resources), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
