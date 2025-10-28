import type { IdUser } from "@/auth/convex/IdUser"
import { verifyTokenResult } from "@/auth/server/jwt_token/verifyTokenResult"
import { orgCreateFields, orgCreateFn } from "@/org/convex/orgCreateFn"
import { orgDeleteFields, orgDeleteFn } from "@/org/convex/orgDeleteFn"
import { orgEditFields, orgEditFn } from "@/org/convex/orgEditFn"
import { orgGetFields, orgGetFn } from "@/org/convex/orgGetFn"
import { orgListFn, orgsListFields } from "@/org/convex/orgListFn"
import { orgMemberCreateFields, orgMemberCreateFn } from "@/org/convex/orgMemberCreateFn"
import { orgMemberDeleteFields, orgMemberDeleteFn } from "@/org/convex/orgMemberDeleteFn"
import { orgMemberEditFields, orgMemberEditFn } from "@/org/convex/orgMemberEditFn"
import { orgMemberGetFields, orgMemberGetFn } from "@/org/convex/orgMemberGetFn"
import { orgMemberListFn, orgMembersListFields } from "@/org/convex/orgMemberListFn"
import { orgSlugAvailableFields, orgSlugAvailableFn } from "@/org/convex/orgSlugAvailableFn"
import { mutation, query } from "@convex/_generated/server"
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

export const orgGetQuery = query({
  args: createTokenValidator(orgGetFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgGetFn),
})

export const orgSlugAvailable = query({
  args: createTokenValidator(orgSlugAvailableFields),
  handler: async (ctx, args) => authQueryR(ctx, args, orgSlugAvailableFn),
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
  args: createTokenValidator(orgMemberCreateFields),
  handler: async (ctx, args) => {
    const verifiedResult = await verifyTokenResult(args.token)
    if (!verifiedResult.success) {
      console.info(verifiedResult)
      return verifiedResult
    }
    const { token, ...rest } = args
    const data = { ...rest, invitedBy: verifiedResult.data.sub as IdUser }
    return orgMemberCreateFn(ctx, data)
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
  handler: async (ctx, args) => await authQuery(ctx, args, orgMemberListFn),
})

export const orgMemberDeleteMutation = mutation({
  args: createTokenValidator(orgMemberDeleteFields),
  handler: async (ctx, args) => authMutation(ctx, args, orgMemberDeleteFn),
})
