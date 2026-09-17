import {
  apiGenerateEmailSignUpV1,
  type GeneratedEmailType,
  type SignUpV1Type,
} from "@adaptive-ds/email-generator/index.js"
import { type PromiseResult } from "#result"
import { envBaseUrlEmailGeneratorResult } from "#src/app/env/private/envBaseUrlEmailGeneratorResult.ts"

export async function registerEmailGenerateApi(props: SignUpV1Type): PromiseResult<GeneratedEmailType> {
  const baseUrlResult = envBaseUrlEmailGeneratorResult()
  if (!baseUrlResult.success) return baseUrlResult
  return apiGenerateEmailSignUpV1(props, baseUrlResult.data)
}
