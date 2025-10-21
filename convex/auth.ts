import type { MutationCtx } from "@convex/_generated/server"
import { internalAction, internalMutation, internalQuery } from "@convex/_generated/server"
import { createUserFromAuthProviderFn } from "@convex/auth/crud/createUserFromAuthProviderFn"
import { findUserByEmailFn } from "@convex/auth/crud/findUserByEmailFn"
import {
  authSessionInsertValidator,
  saveTokenIntoSessionReturnExpiresAtFn,
} from "@convex/auth/crud/saveTokenIntoSessionReturnExpiresAtFn"
import type { DocUser, IdAuthUserEmailRegistration } from "@convex/auth/IdUser"
import {
  signInViaEmail2InternalMutationFn,
  signInViaEmailSaveCodeValidator,
} from "@convex/auth/sign_in_email/signInViaEmail2InternalMutationFn"
import {
  signInViaEmailEnterOtp2InternalMutationFn,
  signInViaEmailEnterOtp2Validator,
} from "@convex/auth/sign_in_email/signInViaEmailEnterOtp2InternalMutationFn"
import {
  notifyTelegramNewSignInInternalActionFn,
  notifyTelegramNewSignUpArgsValidator,
} from "@convex/auth/sign_in_social/notifyTelegramNewSignInInternalActionFn"
import { signInUsingSocialAuth3MutationFn } from "@convex/auth/sign_in_social/signInUsingSocialAuth3MutationFn"
import { notifyTelegramNewSignUpInternalActionFn } from "@convex/auth/sign_up/notifyTelegramNewSignUpInternalActionFn"
import {
  signUp2InternalMutationFn,
  signUpCodeValidator,
  type SignUpCodeValidatorType,
} from "@convex/auth/sign_up/signUp2InternalMutationFn"
import {
  signUpConfirmEmail2InternalMutationFn,
  signUpConfirmEmailValidator,
} from "@convex/auth/sign_up/signUpConfirmEmail2InternalMutationFn"
import { signUpConfirmEmail3CleanupOldCodesInternalMutationFn } from "@convex/auth/sign_up/signUpConfirmEmail3CleanupOldCodesInternalMutationFn"
import { v } from "convex/values"
import type { UserSession } from "~auth/model/UserSession"
import { commonAuthProviderValidator } from "~auth/server/social_identity_providers/CommonAuthProvider"
import type { PromiseResult } from "~utils/result/Result"

//
// Crud
//

export const createUserFromAuthProvider = internalMutation({
  args: commonAuthProviderValidator,
  handler: async (ctx, args) => {
    const authProvider = args
    const got = await createUserFromAuthProviderFn(ctx, authProvider)
    if (!got.success) {
      throw new Error(got.op + ": " + got.errorMessage)
    }
    return got.data
  },
})

export const findUserByEmailQuery = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args): Promise<DocUser | null> => {
    return findUserByEmailFn(ctx, args.email)
  },
})

export const authSessionInsertInternalMutation = internalMutation({
  args: authSessionInsertValidator,
  handler: async (ctx, args) => {
    return saveTokenIntoSessionReturnExpiresAtFn(ctx, args.loginMethod, args.userId, args.token)
  },
})

//
// Sign in via Social
//

export const signInUsingSocialAuth3Mutation = internalMutation({
  args: commonAuthProviderValidator,
  handler: async (ctx, args): PromiseResult<UserSession> => {
    return signInUsingSocialAuth3MutationFn(ctx, args)
  },
})

//
// Sign in via Email
//

export const signInViaEmailEnterOtp2InternalMutation = internalMutation({
  args: signInViaEmailEnterOtp2Validator,
  handler: async (ctx, args): PromiseResult<UserSession> => {
    return signInViaEmailEnterOtp2InternalMutationFn(ctx, args)
  },
})
export const signInViaEmail2InternalMutation = internalMutation({
  args: signInViaEmailSaveCodeValidator,
  handler: async (ctx, args): PromiseResult<string> => {
    return signInViaEmail2InternalMutationFn(ctx, args)
  },
})

export const notifyTelegramNewSignInInternalAction = internalAction({
  args: notifyTelegramNewSignUpArgsValidator,
  handler: async (ctx, args): Promise<void> => {
    return notifyTelegramNewSignInInternalActionFn(ctx, args)
  },
})

//
// Sign up
//

export const signUp2InternalMutation = internalMutation({
  args: signUpCodeValidator,
  handler: async (ctx: MutationCtx, args: SignUpCodeValidatorType): Promise<{ id: IdAuthUserEmailRegistration }> => {
    return signUp2InternalMutationFn(ctx, args)
  },
})

export const signUpConfirmEmail2InternalMutation = internalMutation({
  args: signUpConfirmEmailValidator,
  handler: async (ctx, args): PromiseResult<UserSession> => {
    return signUpConfirmEmail2InternalMutationFn(ctx, args)
  },
})

export const signUpConfirmEmail3CleanupOldCodesInternalMutation = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx): Promise<{ deleted: number }> => {
    return signUpConfirmEmail3CleanupOldCodesInternalMutationFn(ctx)
  },
})

export const notifyTelegramNewSignUpInternalAction = internalAction({
  args: notifyTelegramNewSignUpArgsValidator,
  handler: async (ctx, args): Promise<void> => {
    return notifyTelegramNewSignUpInternalActionFn(ctx, args)
  },
})
