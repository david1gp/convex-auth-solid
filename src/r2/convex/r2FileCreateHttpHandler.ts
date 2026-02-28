import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import type { FileDataModelWithUserMetadata } from "@/file/model/FileModel"
import { fileDataSchema } from "@/file/model/fileSchema"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import * as a from "valibot"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createResultError } from "~utils/result/Result"

export const apiPathR2FileCreate = "/fileCreate"

export async function r2FileCreateHttpHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "r2FileCreateHttpHandler"

  const authorization = request.headers.get("authorization")
  if (!authorization) {
    const errorMessage = "Missing authorization header"
    console.warn(op, errorMessage)
    const err = createResultError(op, errorMessage)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  const tokenResult = await verifyTokenResult(authorization)
  if (!tokenResult.success) {
    return new Response(jsonStringifyPretty(tokenResult), { status: 400 })
  }
  const userId = tokenResult.data.sub as IdUser

  const user = await ctx.runQuery(internal.auth.userGetInternalQuery, { userId })
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
