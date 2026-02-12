import { commonApiErrorMessages } from "@/auth/convex/sign_up/commonApiErrorMessages"
import { passwordSchema } from "@/auth/model_field/passwordSchema"
import { api } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { createError } from "~utils/result/Result"

const userPasswordChange2ConfirmSchema = a.object({
  token: a.string(),
  newPassword: passwordSchema,
  confirmationCode: a.string(),
})

export async function userPasswordChange2ConfirmHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "userPasswordChangeConfirm2Handler"

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
  const schema = a.pipe(a.string(), a.parseJson(), userPasswordChange2ConfirmSchema)
  const validation = a.safeParse(schema, body)
  if (!validation.success) {
    const errorMessage = commonApiErrorMessages.schemaValidationFailed + ": " + a.summarize(validation.issues)
    const errorResult = createError(op, errorMessage, body)
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  const result = await ctx.runMutation(api.auth.userPasswordChange2ConfirmMutation, validation.output)
  if (!result.success) {
    const errorResult = result
    console.warn(errorResult)
    return new Response(JSON.stringify(errorResult), { status: 400 })
  }

  return new Response(JSON.stringify(result), { status: 200 })
}
