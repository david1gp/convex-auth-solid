import { workspaceCreateFields, workspaceCreateFn } from "@/workspace/convex/workspaceCreateFn"
import { workspaceDeleteFields, workspaceDeleteFn } from "@/workspace/convex/workspaceDeleteFn"
import { workspaceEditFields, workspaceEditFn } from "@/workspace/convex/workspaceEditFn"
import { workspaceGetFields, workspaceGetFn } from "@/workspace/convex/workspaceGetFn"
import { workspaceHandleAvailableFields, workspaceHandleAvailableFn } from "@/workspace/convex/workspaceHandleAvailableFn"
import { workspaceListFields, workspaceListFn } from "@/workspace/convex/workspaceListFn"
import { mutation, query } from "@convex/_generated/server"
import { authMutation } from "@convex/utils/authMutation"
import { authMutationR } from "@convex/utils/authMutationR"
import { authQuery } from "@convex/utils/authQuery"
import { authQueryR } from "@convex/utils/authQueryR"
import { createTokenValidator } from "@convex/utils/createTokenValidator"

export const workspaceCreateMutation = mutation({
  args: createTokenValidator(workspaceCreateFields),
  handler: async (ctx, args) => authMutationR(ctx, args, workspaceCreateFn),
})

export const workspaceEditMutation = mutation({
  args: createTokenValidator(workspaceEditFields),
  handler: async (ctx, args) => authMutationR(ctx, args, workspaceEditFn),
})

export const workspaceGetQuery = query({
  args: createTokenValidator(workspaceGetFields),
  handler: async (ctx, args) => authQueryR(ctx, args, workspaceGetFn),
})

export const workspaceHandleAvailable = query({
  args: createTokenValidator(workspaceHandleAvailableFields),
  handler: async (ctx, args) => authQueryR(ctx, args, workspaceHandleAvailableFn),
})

export const workspacesListQuery = query({
  args: createTokenValidator(workspaceListFields),
  handler: async (ctx, args) => authQuery(ctx, args, workspaceListFn),
})

export const workspaceDeleteMutation = mutation({
  args: createTokenValidator(workspaceDeleteFields),
  handler: async (ctx, args) => authMutation(ctx, args, workspaceDeleteFn),
})
