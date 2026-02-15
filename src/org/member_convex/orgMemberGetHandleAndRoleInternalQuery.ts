import type { IdUser } from "@/auth/convex/IdUser"
import { vIdUser } from "@/auth/convex/vIdUser"
import { orgMemberGetByUserIdFn } from "@/org/member_convex/orgMemberGetByUserIdFn"
import type { OrgRole } from "@/org/org_model_field/orgRole"
import { internalQuery, type MutationCtx, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"

export type OrgHandleAndRole = {
  orgHandle?: string
  orgRole?: OrgRole
}

function createEmptyOrgHandleAndRole(): OrgHandleAndRole {
  return { orgHandle: undefined, orgRole: undefined }
}

export type SignUpCodeValidatorType = typeof getOrgMemberHandleAndRoleValidator.type
export const getOrgMemberHandleAndRoleValidator = v.object({
  userId: vIdUser,
})

export const getOrgMemberHandleAndRoleInternalQuery = internalQuery({
  args: getOrgMemberHandleAndRoleValidator,
  handler: getOrgMemberHandleAndRoleQueryFn,
})

export async function getOrgMemberHandleAndRoleQueryFn(ctx: QueryCtx, args: SignUpCodeValidatorType) {
  return orgMemberGetHandleAndRoleFn(ctx, args.userId)
}

export async function orgMemberGetHandleAndRoleFn(
  ctx: QueryCtx | MutationCtx,
  userId: IdUser,
): Promise<OrgHandleAndRole> {
  const orgMember = await orgMemberGetByUserIdFn(ctx, userId)
  if (!orgMember) return createEmptyOrgHandleAndRole()
  const org = await ctx.db.get("orgs", orgMember.orgId)
  if (!org) return createEmptyOrgHandleAndRole()
  return { orgHandle: org.orgHandle, orgRole: orgMember.role }
}
