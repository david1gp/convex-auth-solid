import type { DocOrg } from "@/org/org_convex/IdOrg"
import { orgGetByHandleFn } from "@/org/org_convex/orgGetByHandleFn"
import { orgDataSchemaFields } from "@/org/org_model/orgSchema"
import { valibotToConvex } from "@/utils/convex/valibotToConvex"
import { authMutationR } from "@/utils/convex_backend/authMutationR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as a from "valibot"
import { createError, createResult, createResultError, type PromiseResult } from "~result"
import { nowIso } from "~utils/date/nowIso"

export type OrgEditValidatorType = typeof orgEditValidator.type

export const orgEditFields = valibotToConvex(orgDataSchemaFields)

export const orgEditValidator = v.object(orgEditFields)

export const orgEditMutation = mutation({
  args: createTokenValidator(orgEditFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgEditMutationFn),
})

export async function orgEditMutationFn(ctx: MutationCtx, args: OrgEditValidatorType): PromiseResult<null> {
  const op = "orgEditFn"

  const schema = a.partial(a.object(orgDataSchemaFields))
  const parse = a.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, a.summarize(parse.issues))
  }

  const org = await orgGetByHandleFn(ctx, args.orgHandle)
  if (!org) {
    return createResultError(op, "Org not found", args.orgHandle)
  }
  const { orgHandle, ...partial } = args
  const patch: Partial<DocOrg> = partial
  patch.updatedAt = nowIso()

  await ctx.db.patch("orgs", org._id, patch)
  return createResult(null)
}
