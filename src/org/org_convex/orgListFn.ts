import type { DocOrg } from "@/org/org_convex/IdOrg"
import { type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type OrgsListValidatorType = typeof orgsListValidator.type

export const orgsListFields = {} as const

export const orgsListValidator = v.object(orgsListFields)

export async function orgListFn(ctx: QueryCtx, args: OrgsListValidatorType): Promise<DocOrg[]> {
  return await ctx.db.query("orgs").collect()
}
