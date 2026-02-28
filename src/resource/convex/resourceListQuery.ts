import { languageValidator } from "@/app/i18n/language"
import type { DocResource } from "@/resource/convex/IdResource"
import { resourceDocToModel } from "@/resource/convex/resourceDocToModel"
import type { ResourceModel } from "@/resource/model/ResourceModel"
import { visibilityValidator } from "@/resource/model_field/visibility"
import { authQuery } from "@/utils/convex_backend/authQuery"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export const resourceListFields = {
  l: v.optional(languageValidator),
  orgHandle: v.optional(v.string()),
  meetingId: v.optional(v.string()),
  visibility: v.optional(visibilityValidator),
} as const

export type ResourceListValidatorType = typeof resourceListValidator.type
export const resourceListValidator = v.object(resourceListFields)

export const resourcesListQuery = query({
  args: createTokenValidator(resourceListFields),
  handler: async (ctx, args) => authQuery(ctx, args, resourceListFn),
})

export const resourcesListInternalQuery = internalQuery({
  args: resourceListValidator,
  handler: resourceListFn,
})

export async function resourceListFn(ctx: QueryCtx, args: ResourceListValidatorType): Promise<ResourceModel[]> {
  let docs: DocResource[]
  if (args.visibility) {
    docs = await ctx.db
      .query("resources")
      .withIndex("visibility", (q) => q.eq("visibility", args.visibility!))
      .collect()
  } else {
    docs = await ctx.db.query("resources").collect()
  }

  if (args.orgHandle) {
    const orgResources = await ctx.db.query("orgResources").withIndex("orgHandle").collect()
    const orgResourceIds = new Set(
      orgResources.filter((or) => or.orgHandle === args.orgHandle).map((or) => or.resourceId),
    )
    docs = docs.filter((d) => orgResourceIds.has(d.resourceId))
  }

  let models = docs.map(resourceDocToModel)

  if (args.l) {
    models = models.filter((m) => m.language === args.l)
  }

  return models
}
