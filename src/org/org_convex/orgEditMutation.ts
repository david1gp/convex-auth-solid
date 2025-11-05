import { orgGetByHandleFn } from "@/org/org_convex/orgGetByHandleFn"
import { orgDataSchemaFields } from "@/org/org_model/orgSchema"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { authMutationR } from "@convex/utils/authMutationR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"
import { v } from "convex/values"
import * as va from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createError, createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import type { DocOrg } from "./IdOrg"

export type OrgEditValidatorType = typeof orgEditValidator.type

export const orgEditFields = {
  orgHandle: v.string(),
  // data
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  image: v.optional(v.string()),
} as const

export const orgEditValidator = v.object(orgEditFields)

export const orgEditMutation = mutation({
  args: createTokenValidator(orgEditFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgEditMutationFn),
})

export async function orgEditMutationFn(ctx: MutationCtx, args: OrgEditValidatorType): PromiseResult<null> {
  const op = "orgEditFn"

  const schema = va.partial(va.object(orgDataSchemaFields))
  const parse = va.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, va.summarize(parse.issues))
  }

  const org = await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Org not found", args.orgHandle)
  }
  const { orgHandle, ...partial } = args
  const patch: Partial<DocOrg> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch(org._id, patch)
  return createResult(null)
}
