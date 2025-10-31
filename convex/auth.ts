import { createUserFromAuthProviderFn } from "@/auth/convex/crud/createUserFromAuthProviderFn"
import { findUserByEmailFn } from "@/auth/convex/crud/findUserByEmailFn"
import {
  authSessionInsertValidator,
  saveTokenIntoSessionReturnExpiresAtFn,
} from "@/auth/convex/crud/saveTokenIntoSessionReturnExpiresAtFn"
import {
  signInViaEmail2InternalMutationFn,
  signInViaEmailSaveCodeValidator,
} from "@/auth/convex/sign_in_email/signInViaEmail2InternalMutationFn"
import {
  signInViaEmailEnterOtp2InternalMutationFn,
  signInViaEmailEnterOtp2Validator,
} from "@/auth/convex/sign_in_email/signInViaEmailEnterOtp2InternalMutationFn"
import { signInViaEmailEnterOtp3CleanupOldCodesFn } from "@/auth/convex/sign_in_email/signInViaEmailEnterOtp3CleanupOldCodesFn"
import {
  notifyTelegramNewSignInInternalActionFn,
  notifyTelegramNewSignUpArgsValidator,
} from "@/auth/convex/sign_in_social/notifyTelegramNewSignInInternalActionFn"
import { signInUsingSocialAuth3MutationFn } from "@/auth/convex/sign_in_social/signInUsingSocialAuth3MutationFn"
import { notifyTelegramNewSignUpInternalActionFn } from "@/auth/convex/sign_up/notifyTelegramNewSignUpInternalActionFn"
import { signUp2InternalMutationFn, signUpCodeValidator } from "@/auth/convex/sign_up/signUp2InternalMutationFn"
import {
  signUpConfirmEmail2InternalMutationFn,
  signUpConfirmEmailValidator,
} from "@/auth/convex/sign_up/signUpConfirmEmail2InternalMutationFn"
import { signUpConfirmEmail3CleanupOldCodesInternalMutationFn } from "@/auth/convex/sign_up/signUpConfirmEmail3CleanupOldCodesInternalMutationFn"
import { userGetQueryFn } from "@/auth/convex/user/userGetQueryFn"
import { usernameAvailableFields, usernameAvailableFn } from "@/auth/convex/usernameAvailableFn"
import { commonAuthProviderValidator } from "@/auth/server/social_identity_providers/CommonAuthProvider"
import type { MutationCtx, QueryCtx } from "@convex/_generated/server"
import { internalAction, internalMutation, internalQuery } from "@convex/_generated/server"
import { v } from "convex/values"
//

export const createUserFromAuthProvider = internalMutation({
  args: commonAuthProviderValidator,
  handler: createUserFromAuthProviderFn,
})

export const findUserByEmailQuery = internalQuery({
  args: { email: v.string() },
  handler: async (ctx: QueryCtx, args) => findUserByEmailFn(ctx, args.email),
})

export const authSessionInsertInternalMutation = internalMutation({
  args: authSessionInsertValidator,
  handler: async (ctx: MutationCtx, args) =>
    saveTokenIntoSessionReturnExpiresAtFn(ctx, args.loginMethod, args.userId, args.token),
})

//
// Sign in via Social
//

export const signInUsingSocialAuth3Mutation = internalMutation({
  args: commonAuthProviderValidator,
  handler: signInUsingSocialAuth3MutationFn,
})

//
// Sign in via Email
//

export const signInViaEmailEnterOtp2InternalMutation = internalMutation({
  args: signInViaEmailEnterOtp2Validator,
  handler: signInViaEmailEnterOtp2InternalMutationFn,
})
export const signInViaEmail2InternalMutation = internalMutation({
  args: signInViaEmailSaveCodeValidator,
  handler: signInViaEmail2InternalMutationFn,
})

export const signInViaEmailEnterOtp3CleanupOldCodesInternalMutation = internalMutation({
  args: {},
  handler: signInViaEmailEnterOtp3CleanupOldCodesFn,
})

export const notifyTelegramNewSignInInternalAction = internalAction({
  args: notifyTelegramNewSignUpArgsValidator,
  handler: notifyTelegramNewSignInInternalActionFn,
})

//
// Sign up
//

export const signUp2InternalMutation = internalMutation({
  args: signUpCodeValidator,
  handler: signUp2InternalMutationFn,
})

export const signUpConfirmEmail2InternalMutation = internalMutation({
  args: signUpConfirmEmailValidator,
  handler: signUpConfirmEmail2InternalMutationFn,
})

export const signUpConfirmEmail3CleanupOldCodesInternalMutation = internalMutation({
  args: {},
  handler: signUpConfirmEmail3CleanupOldCodesInternalMutationFn,
})

export const notifyTelegramNewSignUpInternalAction = internalAction({
  args: notifyTelegramNewSignUpArgsValidator,
  handler: notifyTelegramNewSignUpInternalActionFn,
})

//
// username
//
export const usernameAvailableQuery = internalQuery({
  args: usernameAvailableFields,
  handler: async (ctx: QueryCtx, args) => usernameAvailableFn(ctx, args),
})

export const userGetQuery = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx: QueryCtx, args) => userGetQueryFn(ctx, args.userId),
})
