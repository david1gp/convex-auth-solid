import { resourceGetModelFn } from "@/resource/convex/resourceGetQuery"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { authQuery } from "@/utils/convex_backend/authQuery"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { notEmptyFilter } from "~utils/arr/notEmptyFilter"

export type OrgResourceListValidatorType = typeof orgResourceListValidator.type

export const orgResourceListFields = {
  orgHandle: v.string(),
} as const

export const orgResourceListValidator = v.object(orgResourceListFields)

export const orgResourceListQuery = query({
  args: createTokenValidator(orgResourceListFields),
  handler: async (ctx, args) => authQuery(ctx, args, orgResourceListFn),
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
