import * as a from "valibot"
import { internal } from "#convex/_generated/api.js"
import type { ActionCtx } from "#convex/_generated/server.js"
import { createResultError } from "#result"
import { authorizationHeaderGetToken } from "#src/auth/server/authorizationHeaderGetToken.ts"
import type { FileDataModelWithUserMetadata } from "#src/file/model/FileModel.ts"
import { fileDataSchema } from "#src/file/model/fileSchema.ts"
import { authActionCredentialResolve } from "#src/utils/convex_backend/authActionCredentialResolve.ts"
import { jsonStringifyPretty } from "#utils/json/jsonStringifyPretty.js"

export const apiPathR2FileCreate = "/fileCreate"

export async function r2FileCreateHttpHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "r2FileCreateHttpHandler"

  const token = authorizationHeaderGetToken(request.headers.get("authorization"))
  if (!token) {
    const errorMessage = "Missing authorization header"
    console.warn(op, errorMessage)
    const err = createResultError(op, errorMessage)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  const credentialResult = await authActionCredentialResolve(ctx, token)
  if (!credentialResult.success) {
    return new Response(jsonStringifyPretty(credentialResult), { status: 400 })
  }
  const userId = credentialResult.data.userId

  const user = await ctx.runQuery(internal.auth.userGetInternalQuery, {
    userId,
  })
  if (!user) {
    const errorMessage = "User not found"
    console.error(op, errorMessage)
    const err = createResultError(op, errorMessage)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  const body = await request.json()
  const parseResult = a.safeParse(fileDataSchema, body)
  if (!parseResult.success) {
    const errorMessage = a.summarize(parseResult.issues)
    console.warn(op, errorMessage)
    const err = createResultError(op, errorMessage)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  const data: FileDataModelWithUserMetadata = { ...parseResult.output, userId }
  if (user.username) data.username = user.username

  console.log(op, "insertingFile:", data)

  const result = await ctx.runMutation(internal.file.fileCreateInternalMutation, data)
  if (!result.success) {
    console.warn(op, result)
    return new Response(jsonStringifyPretty(result), { status: 500 })
  }

  return new Response(jsonStringifyPretty(result))
}
