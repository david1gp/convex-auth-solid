import type { IdOrg } from "@/org/convex/IdOrg"
import { orgDataFields } from "@/org/convex/orgTables"
import { orgDataSchemaFields } from "@/org/model/orgSchema"
import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import * as va from "valibot"
import { nowIso } from "~utils/date/nowIso"
import { createError, createResult, type PromiseResult } from "~utils/result/Result"

export type OrgCreateValidatorType = typeof orgCreateValidator.type

export const orgCreateFields = orgDataFields

export const orgCreateValidator = v.object(orgCreateFields)

export async function orgCreateFn(ctx: MutationCtx, args: OrgCreateValidatorType): PromiseResult<IdOrg> {
  const op = "orgCreateFn"
  const now = nowIso()

  const schema = va.object(orgDataSchemaFields)
  const parse = va.safeParse(schema, args)
  if (!parse.success) {
    return createError(op, va.summarize(parse.issues))
  }

  const orgId = await ctx.db.insert("orgs", {
    ...args,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(orgId)
}
