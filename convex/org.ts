import { orgInvitation10ListFn, orgInvitationsListValidator } from "@/org/invitation_convex/orgInvitation10ListFn"
import {
  orgInvitation20InitMutationFn,
  orgInvitationCreateActionValidator,
} from "@/org/invitation_convex/orgInvitation20InitMutationFn"
import {
  orgInvitation21CreateMutationFn,
  orgInvitationCreateMutationValidator,
} from "@/org/invitation_convex/orgInvitation21CreateMutationFn"
import { orgInvitation30ResendFn, orgInvitationResendValidator } from "@/org/invitation_convex/orgInvitation30ResendFn"
import { orgInvitation31SendFn, orgInvitationSendValidator } from "@/org/invitation_convex/orgInvitation31SendFn"
import { orgInvitation33UpdateFn, orgInvitationUpdateValidator } from "@/org/invitation_convex/orgInvitation33UpdateFn"
import { orgInvitation40GetFn, orgInvitationGetValidator } from "@/org/invitation_convex/orgInvitation40GetFn"
import { orgInvitation50AcceptFn, orgInvitationAcceptValidator } from "@/org/invitation_convex/orgInvitation50AcceptFn"
import {
  orgInvitation60DismissMutationFn,
  orgInvitationDismissFields,
} from "@/org/invitation_convex/orgInvitation60DismissMutationFn"
import {
  orgInvitation70CleanupMutationFn,
  orgInvitationCleanupValidator,
} from "@/org/invitation_convex/orgInvitation70CleanupMutationFn"
import { orgMemberCreateFn, orgMemberCreateValidator } from "@/org/member_convex/orgMemberCreateFn"
import { orgMemberDeleteFields, orgMemberDeleteFn } from "@/org/member_convex/orgMemberDeleteFn"
import { orgMemberEditFields, orgMemberEditFn } from "@/org/member_convex/orgMemberEditFn"
import { orgMemberGetFields, orgMemberGetFn } from "@/org/member_convex/orgMemberGetFn"
import {
  getOrgMemberHandleAndRoleQueryFn,
  getOrgMemberHandleAndRoleValidator,
} from "@/org/member_convex/orgMemberGetHandleAndRoleFn"
import { orgMemberListFn, orgMembersListFields } from "@/org/member_convex/orgMemberListFn"
import { orgCreateMutation } from "@/org/org_convex/orgCreateMutation"
import { orgDeleteMutation } from "@/org/org_convex/orgDeleteMutation"
import { orgEditMutation } from "@/org/org_convex/orgEditMutation"
import { orgGetPageQuery } from "@/org/org_convex/orgGetPageQuery"
import { orgGetQuery } from "@/org/org_convex/orgGetQuery"
import { orgHandleAvailableQuery } from "@/org/org_convex/orgHandleAvailableQuery"
import { orgsListQuery } from "@/org/org_convex/orgsListQuery"
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "@convex/_generated/server"
import { authMutationR } from "@convex/utils/authMutationR"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"

export {
  orgCreateMutation,
  orgDeleteMutation,
  orgEditMutation,
  orgGetPageQuery,
  orgGetQuery,
  orgHandleAvailableQuery,
  orgsListQuery
}

//
// Members
//
export const orgMemberCreateMutation = mutation({
  args: orgMemberCreateValidator,
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

//
// Invitations
//

export const orgInvitationCreateMutation = internalMutation({
  args: orgInvitationCreateMutationValidator,
  handler: orgInvitation21CreateMutationFn,
})

export const orgInvitationInitMutation = mutation({
  args: orgInvitationCreateActionValidator,
  handler: orgInvitation20InitMutationFn,
})

export const orgInvitationResendAction = action({
  args: orgInvitationResendValidator,
  handler: orgInvitation30ResendFn,
})

export const orgInvitationSendAction = internalAction({
  args: orgInvitationSendValidator,
  handler: orgInvitation31SendFn,
})

export const orgInvitationUpdateMutation = internalMutation({
  args: orgInvitationUpdateValidator,
  handler: orgInvitation33UpdateFn,
})

export const orgInvitationAcceptMutation = mutation({
  args: orgInvitationAcceptValidator,
  handler: orgInvitation50AcceptFn,
})

export const orgInvitationGetQuery = query({
  args: orgInvitationGetValidator,
  handler: orgInvitation40GetFn,
})

export const orgInvitationsListQuery = query({
  args: orgInvitationsListValidator,
  handler: orgInvitation10ListFn,
})

export const getOrgMemberHandleAndRoleQuery = internalQuery({
  args: getOrgMemberHandleAndRoleValidator,
  handler: getOrgMemberHandleAndRoleQueryFn,
})

export const orgInvitationDismissMutation = mutation({
  args: createTokenValidator(orgInvitationDismissFields),
  handler: async (ctx, args) => authMutationR(ctx, args, orgInvitation60DismissMutationFn),
})

export const orgInvitationCleanupMutation = internalMutation({
  args: orgInvitationCleanupValidator,
  handler: orgInvitation70CleanupMutationFn,
})
