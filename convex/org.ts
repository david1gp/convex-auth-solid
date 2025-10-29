import { orgInvitationAcceptFields, orgInvitationAcceptFn } from "@/org/invitation_convex/orgInvitationAccept"
import { orgInvitationCreateFields, orgInvitationCreateFn } from "@/org/invitation_convex/orgInvitationCreate"
import { orgInvitationGetFields, orgInvitationGetFn } from "@/org/invitation_convex/orgInvitationGet"
import { orgInvitationResendFields, orgInvitationResendFn } from "@/org/invitation_convex/orgInvitationResend"
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
import { internalQuery, mutation, query } from "@convex/_generated/server"
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
  handler: async (ctx, args) => {
    return orgMemberCreateFn(ctx, args)
  },
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

export const orgInvitationCreateMutation = mutation({
  args: orgInvitationCreateFields,
  handler: async (ctx, args) => {
    return orgInvitationCreateFn(ctx, args)
  },
})

export const orgInvitationResendMutation = mutation({
  args: orgInvitationResendFields,
  handler: async (ctx, args) => {
    return orgInvitationResendFn(ctx, args)
  },
})

export const orgInvitationAcceptMutation = mutation({
  args: orgInvitationAcceptFields,
  handler: async (ctx, args) => {
    return orgInvitationAcceptFn(ctx, args)
  },
})

export const orgInvitationGetQuery = query({
  args: orgInvitationGetFields,
  handler: async (ctx, args) => {
    return await orgInvitationGetFn(ctx, args)
  },
})

export const getOrgMemberHandleAndRoleQuery = internalQuery({
  args: getOrgMemberHandleAndRoleValidator,
  handler: async (ctx, args) => {
    return await getOrgMemberHandleAndRoleQueryFn(ctx, args)
  },
})
