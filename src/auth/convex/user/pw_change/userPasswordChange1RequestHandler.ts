import { commonApiErrorMessages } from "@/auth/convex/sign_up/commonApiErrorMessages"
import { api } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { createError } from "~utils/result/Result"

const userPasswordChange1RequestSchema = a.object({
  token: a.string(),
})

export async function userPasswordChange1RequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "userPasswordChange1RequestHandler"

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
  const schema = a.pipe(a.string(), a.parseJson(), userPasswordChange1RequestSchema)
  const validation = a.safeParse(schema, body)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + a.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const result = await ctx.runAction(api.auth.userPasswordChange1RequestAction, validation.output)
  if (!result.success) {
    const errorResult = result
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  return new Response(JSON.stringify(result), { status: 200 })
}
