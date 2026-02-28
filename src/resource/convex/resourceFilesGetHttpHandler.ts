import { visibility } from "@/resource/model_field/visibility"
import { internal } from "@convex/_generated/api"
import type { ActionCtx } from "@convex/_generated/server"
import { jsonStringifyPretty } from "~utils/json/jsonStringifyPretty"
import { createResultError } from "~utils/result/Result"

export const apiPathResourceGet = "/get"

export async function resourceGetRequestHandler(ctx: ActionCtx, request: Request): Promise<Response> {
  const op = "resourceGetRequestHandler"
  const url = new URL(request.url)

  // Get required query parameters
  const resourceId = url.searchParams.get("resourceId")

  if (!resourceId) {
    return new Response(jsonStringifyPretty(createResultError(op, "Missing required parameter: resourceId")), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  // Get resource files using the new query
  const resourceFilesResult = await ctx.runQuery(internal.resource.resourceFilesGetInternalQuery, {
    resourceId,
  })

  if (!resourceFilesResult.success) {
    return new Response(jsonStringifyPretty(resourceFilesResult), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  const resourceFiles = resourceFilesResult.data

  if (!resourceFiles) {
    return new Response(jsonStringifyPretty(createResultError(op, "Resource not found", resourceId)), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  if (resourceFiles.resource.visibility !== visibility.public) {
    const err = createResultError(op, "Resource is not public", resourceId)
    return new Response(jsonStringifyPretty(err), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return new Response(jsonStringifyPretty(resourceFiles), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
