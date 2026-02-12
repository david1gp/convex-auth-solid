import { commonApiErrorMessages } from "@/auth/convex/sign_up/commonApiErrorMessages"
import type { UserSession } from "@/auth/model/UserSession"
import { api } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { createError, createResult } from "~utils/result/Result"

const userProfileUpdateSchema = a.object({
  token: a.string(),
  name: a.optional(a.string()),
  image: a.optional(a.string()),
})

export async function userProfileUpdate1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "userProfileUpdate1RequestHandler"

  if (request.method !== "POST") {
    return new Response(commonApiErrorMessages.methodNotAllowed, { status: 405 })
  }

  const body = await request.text()
  if (!body) {
    const errorMessage = commonApiErrorMessages.emptyBody
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }
  const schema = a.pipe(a.string(), a.parseJson(), userProfileUpdateSchema)
  const validation = a.safeParse(schema, body)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + a.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const result = await ctx.runMutation(api.auth.userProfileUpdateMutation, validation.output)
  if (!result.success) {
    const errorResult = result
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  if (!result.data) {
    return new Response(JSON.stringify(createResult(null)), { status: 200 })
  }

  const userSession: UserSession = result.data
  return new Response(JSON.stringify(userSession), { status: 200 })
}
