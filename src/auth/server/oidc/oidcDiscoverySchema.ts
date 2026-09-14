import * as a from "valibot"

const oidcDiscoverySchema = a.object({
  issuer: a.pipe(a.string(), a.minLength(1)),
  authorization_endpoint: a.pipe(a.string(), a.minLength(1)),
  token_endpoint: a.pipe(a.string(), a.minLength(1)),
  jwks_uri: a.pipe(a.string(), a.minLength(1)),
  response_types_supported: a.pipe(a.array(a.string()), a.minLength(1)),
  id_token_signing_alg_values_supported: a.pipe(a.array(a.string()), a.minLength(1)),
  token_endpoint_auth_methods_supported: a.optional(a.pipe(a.array(a.string()), a.minLength(1))),
  userinfo_endpoint: a.optional(a.pipe(a.string(), a.minLength(1))),
  scopes_supported: a.optional(a.pipe(a.array(a.string()), a.minLength(1))),
})

export type OidcDiscovery = a.InferOutput<typeof oidcDiscoverySchema>

export { oidcDiscoverySchema }
