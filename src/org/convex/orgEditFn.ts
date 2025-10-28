import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrg } from "./IdOrg"
import { vIdOrg } from "./vIdOrg"

export type OrgEditValidatorType = typeof orgEditValidator.type

export const orgEditFields = {
  orgId: vIdOrg,
  // data
  name: v.optional(v.string()),
  slug: v.optional(v.string()),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  image: v.optional(v.string()),
} as const

export const orgEditValidator = v.object(orgEditFields)

export async function orgEditFn(ctx: MutationCtx, args: OrgEditValidatorType): PromiseResult<null> {
  const op = "orgEditFn"
  const org = await ctx.db.get(args.orgId)
  if (!org) {
    return createResultError(op, "Org not found", args.orgId)
  }
  const { orgId, ...partial } = args
  const patch: Partial<DocOrg> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch(args.orgId, patch)
  return createResult(null)
}
