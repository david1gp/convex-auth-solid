import { r2ApiGetUploadUrl } from "@/r2/api/r2ApiGetUploadUrl"
import { authQueryR } from "@/utils/convex_backend/authQueryR"
import { createTokenValidator } from "@/utils/convex_backend/createTokenValidator"
import { internalQuery, query, type QueryCtx } from "@convex/_generated/server"
import { v } from "convex/values"
import { type PromiseResult } from "~utils/result/Result"

export const r2UploadUrlGetFields = {
  fileId: v.string(),
} as const

export type R2UploadUrlGetValidatorType = typeof r2UploadUrlGetValidator.type
export const r2UploadUrlGetValidator = v.object(r2UploadUrlGetFields)

export const r2UploadUrlGetFieldsWithToken = createTokenValidator(r2UploadUrlGetFields)

export const r2UploadUrlGetQuery = query({
  args: r2UploadUrlGetFieldsWithToken,
  handler: async (ctx, args) => authQueryR(ctx, args, r2UploadUrlGetFn),
})

export const r2UploadUrlGetInternalQuery = internalQuery({
  args: r2UploadUrlGetValidator,
  handler: r2UploadUrlGetFn,
})

export async function r2UploadUrlGetFn(ctx: QueryCtx, args: R2UploadUrlGetValidatorType): PromiseResult<string> {
  return r2ApiGetUploadUrl(args.fileId)
}
