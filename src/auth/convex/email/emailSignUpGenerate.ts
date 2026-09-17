import { type GeneratedEmailType, type SignUpV1Type } from "@adaptive-ds/email-generator/index.js"
import { type PromiseResult } from "#result"
import type { Language } from "#src/app/i18n/language.ts"
import { generateSharedEmailProps } from "#src/auth/convex/email/generateSharedEmailProps.ts"
import { registerEmailGenerateApi } from "#src/auth/convex/email/registerEmailGenerateApi.ts"

export async function emailSignUpGenerate(code: string, url: string, l: Language): PromiseResult<GeneratedEmailType> {
  const op = "emailSignUpGenerate"
  const props: SignUpV1Type = {
    // l: "en",
    ...generateSharedEmailProps(l),
    code,
    url,
  }
  return await registerEmailGenerateApi(props)
}
