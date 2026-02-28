import type { DocResource } from "@/resource/convex/IdResource"
import { resourceDocToModel } from "@/resource/convex/resourceDocToModel"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { authQueryR } from "@/utils/convex_backend/authQueryR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"

export const resourceGetFields = {
  resourceId: v.string(),
  updatedAt: v.optional(v.string()),
} as const

export type ResourceGetValidatorType = typeof resourceGetValidator.type
export const resourceGetValidator = v.object(resourceGetFields)

export const resourceGetQuery = query({
  args: createTokenValidator(resourceGetFields),
  handler: async (ctx, args) => authQueryR(ctx, args, resourceGetFn),
})

export const resourceGetInternalQuery = internalQuery({
  args: resourceGetValidator,
  handler: resourceGetFn,
})

export async function resourceGetFn(
  ctx: QueryCtx,
  args: ResourceGetValidatorType,
): PromiseResult<ResourceModel | null> {
  const op = "resourceGetFn"

  const resource = await resourceGetModelFn(ctx, args.resourceId)
  if (!resource) {
    return createResultError(op, "Resource not found", args.resourceId)
  }
  if (args.updatedAt && args.updatedAt === resource.updatedAt) {
    return createResult(null)
  }
  return createResult(resource)
}

export async function resourceGetDocFn(ctx: QueryCtx, resourceId: string): Promise<DocResource | null> {
  const op = "resourceGetFn"
  return await ctx.db
    .query("resources")
    .withIndex("resourceId", (q) => q.eq("resourceId", resourceId))
    .unique()
}

export async function resourceGetModelFn(ctx: QueryCtx, resourceId: string): Promise<ResourceModel | null> {
  const op = "resourceGetFn"
  const got = await resourceGetDocFn(ctx, resourceId)
  if (!got) return got
  return resourceDocToModel(got)
}
