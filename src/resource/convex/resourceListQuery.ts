import { internalQuery, query, type QueryCtx } from "#convex/_generated/server.js"
import { languageValidator } from "#src/app/i18n/language.ts"
import type { DocResource } from "#src/resource/convex/IdResource.ts"
import { resourceDocToModel } from "#src/resource/convex/resourceDocToModel.ts"
import type { ResourceModel } from "#src/resource/model/ResourceModel.ts"
import { visibilityValidator } from "#src/resource/model_field/visibility.ts"
import { authQueryWrapResult } from "#src/utils/convex_backend/authQueryWrapResult.ts"
import { createTokenValidator } from "#src/utils/convex_backend/createTokenValidator.ts"
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
  handler: async (ctx, args) => authQueryWrapResult(ctx, args, resourceListFn),
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
