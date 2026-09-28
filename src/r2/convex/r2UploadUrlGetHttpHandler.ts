import type { ActionCtx } from "#convex/_generated/server.js"
import { createResultError } from "#result"
import { authorizationHeaderGetToken } from "#src/auth/server/authorizationHeaderGetToken.ts"
import { r2ApiGetUploadUrl } from "#src/r2/api_r2/r2ApiGetUploadUrl.ts"
import { authActionCredentialResolve } from "#src/utils/convex_backend/authActionCredentialResolve.ts"
import { jsonStringifyPretty } from "#utils/json/jsonStringifyPretty.js"

export async function r2UploadUrlGetHttpHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "r2UploadUrlHttpHandler"
  const url = new URL(request.url)

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
