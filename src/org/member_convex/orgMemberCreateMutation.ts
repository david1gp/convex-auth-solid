import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import { orgRoleValidator } from "@/org/org_model/orgRoleValidator"
import { mutation, type MutationCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { nowIso } from "~utils/date/nowIso"
import { createResult, createResultError, type PromiseResult } from "~utils/result/Result"
import { vIdUser } from "../../auth/convex/vIdUser"
import type { IdOrgMember } from "./IdOrgMember"

export type OrgMemberCreateValidatorType = typeof orgMemberCreateValidator.type

export const orgMemberCreateFields = {
  token: v.string(),
  // id
  orgHandle: v.string(),
  userId: vIdUser,
  // data
  role: orgRoleValidator,
  // meta
  // invitedBy: vIdUser,
} as const

export const orgMemberCreateValidator = v.object(orgMemberCreateFields)

export const orgMemberCreateMutation = mutation({
  args: orgMemberCreateValidator,
  handler: orgMemberCreateFn,
})

export async function orgMemberCreateFn(
  ctx: MutationCtx,
  args: OrgMemberCreateValidatorType,
): PromiseResult<IdOrgMember> {
  const op = "orgMemberCreateFn"

  const verifiedResult = await verifyTokenResult(args.token)
  if (!verifiedResult.success) {
    console.info(verifiedResult)
    return verifiedResult
  }
  const invitedBy = verifiedResult.data.sub as IdUser

  const user = await ctx.db.get(args.userId)
  if (!user) {
    const errorMessage = "user not found"
    console.info(op, errorMessage, args.userId)
    return createResultError(op, errorMessage, args.userId)
  }

  const org = await ctx.db
    .query("orgs")
    .withIndex("orgHandle", (q) => q.eq("orgHandle", args.orgHandle))
    .unique()
  if (!org) {
    return createResultError(op, "Organization not found", args.orgHandle)
  }

  const now = nowIso()
  const orgMemberId = await ctx.db.insert("orgMembers", {
    orgId: org._id,
    userId: args.userId,
    role: args.role,
    invitedBy: invitedBy,
    createdAt: now,
    updatedAt: now,
  })
  return createResult(orgMemberId)
}
