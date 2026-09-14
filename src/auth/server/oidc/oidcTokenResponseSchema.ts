import * as a from "valibot"

const oidcTokenResponseSchema = a.object({
  id_token: a.pipe(a.string(), a.minLength(1)),
  access_token: a.optional(a.pipe(a.string(), a.minLength(1))),
  token_type: a.optional(a.pipe(a.string(), a.minLength(1))),
  expires_in: a.optional(a.union([a.number(), a.string()])),
  refresh_token: a.optional(a.pipe(a.string(), a.minLength(1))),
  scope: a.optional(a.pipe(a.string(), a.minLength(1))),
})

export type OidcTokenResponse = a.InferOutput<typeof oidcTokenResponseSchema>

export { oidcTokenResponseSchema }
