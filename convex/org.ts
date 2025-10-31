import { orgInvitation10ListFn, orgInvitationsListValidator } from "@/org/invitation_convex/orgInvitation10ListFn"
import {
  orgInvitation20InitMutationFn,
  orgInvitationInitMutationFields,
} from "@/org/invitation_convex/orgInvitation20InitMutationFn"
import {
  orgInvitation21CreateMutationFn,
  orgInvitationCreateMutationValidator,
} from "@/org/invitation_convex/orgInvitation21CreateMutationFn"
import { orgInvitation30ResendFn, orgInvitationResendFields } from "@/org/invitation_convex/orgInvitation30ResendFn"
import { orgInvitation32UpdateFn, orgInvitationUpdateValidator } from "@/org/invitation_convex/orgInvitation32UpdateFn"
import { orgInvitation40GetFn, orgInvitationGetFields } from "@/org/invitation_convex/orgInvitation40GetFn"
import { orgInvitation50AcceptFn, orgInvitationAcceptFields } from "@/org/invitation_convex/orgInvitation50AcceptFn"
import { orgMemberCreateFields, orgMemberCreateFn } from "@/org/member_convex/orgMemberCreateFn"
import { orgMemberDeleteFields, orgMemberDeleteFn } from "@/org/member_convex/orgMemberDeleteFn"
import { orgMemberEditFields, orgMemberEditFn } from "@/org/member_convex/orgMemberEditFn"
import { orgMemberGetFields, orgMemberGetFn } from "@/org/member_convex/orgMemberGetFn"
import {
  getOrgMemberHandleAndRoleQueryFn,
  getOrgMemberHandleAndRoleValidator,
} from "@/org/member_convex/orgMemberGetHandleAndRoleFn"
import { orgMemberListFn, orgMembersListFields } from "@/org/member_convex/orgMemberListFn"
import { orgCreateFields, orgCreateFn } from "@/org/org_convex/orgCreateFn"
import { orgDeleteFields, orgDeleteFn } from "@/org/org_convex/orgDeleteFn"
import { orgEditFields, orgEditFn } from "@/org/org_convex/orgEditFn"
import { orgGetFields, orgGetFn } from "@/org/org_convex/orgGetFn"
import { orgGetPageFields, orgGetPageFn } from "@/org/org_convex/orgGetPageFn"
import { orgHandleAvailableFields, orgHandleAvailableFn } from "@/org/org_convex/orgHandleAvailableFn"
import { orgListFn, orgsListFields } from "@/org/org_convex/orgListFn"
import { action, internalMutation, internalQuery, mutation, query } from "@convex/_generated/server"
import { authMutation } from "@convex/utils/authMutation"
import { authMutationR } from "@convex/utils/authMutationR"
import { authQuery } from "@convex/utils/authQuery"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"

export const orgCreateMutation = mutation({
  args: createTokenValidator(orgCreateFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgCreateFn),
})

export const orgEditMutation = mutation({
  args: createTokenValidator(orgEditFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgEditFn),
})

export const orgGetPageQuery = query({
  args: createTokenValidator(orgGetPageFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgGetPageFn),
})

export const orgGetQuery = query({
  args: createTokenValidator(orgGetFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgGetFn),
})

export const orgHandleAvailable = query({
  args: createTokenValidator(orgHandleAvailableFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgHandleAvailableFn),
})

export const orgsListQuery = query({
  args: createTokenValidator(orgsListFields),
  handler: async (ctx, args) => authQuery(ctx, args, orgListFn),
})

export const orgDeleteMutation = mutation({
  args: createTokenValidator(orgDeleteFields),
  handler: async (ctx, args) => authMutation(ctx, args, orgDeleteFn),
})

export const orgMemberCreateMutation = mutation({
  args: orgMemberCreateFields,
  handler: orgMemberCreateFn,
})

export const orgMemberEditMutation = mutation({
  args: createTokenValidator(orgMemberEditFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgMemberEditFn),
})

export const orgMemberGetQuery = query({
  args: createTokenValidator(orgMemberGetFields),
  handler: async (ctx, args) => {
    return await authQueryR(ctx, args, orgMemberGetFn)
  },
})

export const orgMembersListQuery = query({
  args: createTokenValidator(orgMembersListFields),
  handler: async (ctx, args) => await authQueryR(ctx, args, orgMemberListFn),
})

export const orgMemberDeleteMutation = mutation({
  args: createTokenValidator(orgMemberDeleteFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgMemberDeleteFn),
})

export const orgInvitationCreateMutation = internalMutation({
  args: orgInvitationCreateMutationValidator,
  handler: async (ctx, args) => {
    return orgInvitation21CreateMutationFn(ctx, args)
  },
})

export const orgInvitationInitMutation = mutation({
  args: orgInvitationInitMutationFields,
  handler: async (ctx, args) => {
    return orgInvitation20InitMutationFn(ctx, args)
  },
})

export const orgInvitationResendAction = action({
  args: orgInvitationResendFields,
  handler: orgInvitation30ResendFn,
})

export const orgInvitationAcceptMutation = mutation({
  args: orgInvitationAcceptFields,
  handler: orgInvitation50AcceptFn,
})

export const orgInvitationGetQuery = query({
  args: orgInvitationGetFields,
  handler: orgInvitation40GetFn,
})

export const orgInvitationsListQuery = query({
  args: orgInvitationsListValidator,
  handler: orgInvitation10ListFn,
})

export const getOrgMemberHandleAndRoleQuery = internalQuery({
  args: getOrgMemberHandleAndRoleValidator,
  handler: async (ctx, args) => {
    return await getOrgMemberHandleAndRoleQueryFn(ctx, args)
  },
})

export const orgInvitationUpdateMutation = internalMutation({
  args: orgInvitationUpdateValidator,
  handler: orgInvitation32UpdateFn,
})
