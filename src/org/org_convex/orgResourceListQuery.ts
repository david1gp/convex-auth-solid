import { resourceGetModelFn } from "#src/resource/convex/resourceGetQuery.js"
import type { ResourceModel } from "#src/resource/model/ResourceModel.js"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.js"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.js"
import { notEmptyFilter } from "#utils/arr/notEmptyFilter"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server.js"
import { v } from "convex/values"

export type OrgResourceListValidatorType = typeof orgResourceListValidator.type

export const orgResourceListFields = {
  orgHandle: v.string(),
} as const

export const orgResourceListValidator = v.object(orgResourceListFields)

export const orgResourceListQuery = query({
  args: createTokenValidator(orgResourceListFields),
  handler: async (ctx, args) => authQueryWrapResult(ctx, args, orgResourceListFn),
})

export const orgResourceListInternalQuery = internalQuery({
  args: orgResourceListValidator,
  handler: orgResourceListFn,
})

export async function orgResourceListFn(ctx: QueryCtx, args: OrgResourceListValidatorType): Promise<ResourceModel[]> {
  const list = await ctx.db
    .query("orgResources")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .collect()
  const all = await Promise.all(list.map((mr) => resourceGetModelFn(ctx, mr.resourceId)))
  const filtered = all.filter(notEmptyFilter)
  return filtered
}
