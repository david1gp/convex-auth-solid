import { type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { vIdOrgMembers } from "./vIdOrgMembers"

export type OrgMemberDeleteValidatorType = typeof orgMemberDeleteValidator.type

export const orgMemberDeleteFields = {
  memberId: vIdOrgMembers,
} as const

export const orgMemberDeleteValidator = v.object(orgMemberDeleteFields)

export async function orgMemberDeleteFn(ctx: MutationCtx, args: OrgMemberDeleteValidatorType): Promise<null> {
  const member = await ctx.db.get(args.memberId)
  if (!member) return null // idempotent

  await ctx.db.delete(args.memberId)
  return null
}