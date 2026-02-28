import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import { r2ApiGetUploadUrl } from "@/r2/api/r2ApiGetUploadUrl"
import type { ActionCtx } from "@convex/_generated/server"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createResultError } from "~utils/result/Result"

export async function r2UploadUrlGetHttpHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "r2UploadUrlHttpHandler"
  const url = new URL(request.url)

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

  const fileId = url.searchParams.get("fileId")
  if (!fileId) {
    const errorMessage = "Missing fileId query parameter"
    console.warn(op, errorMessage)
    const err = createResultError(op, errorMessage)
    return new Response(jsonStringifyPretty(err), { status: 400 })
  }

  const urlResult = await r2ApiGetUploadUrl(fileId)

  if (!urlResult.success) {
    return new Response(jsonStringifyPretty(urlResult), { status: 500 })
  }

  return new Response(urlResult.data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
