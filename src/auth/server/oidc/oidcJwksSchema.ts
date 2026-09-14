import * as a from "valibot"

const oidcJwkSchema = a.object({
  kty: a.pipe(a.string(), a.minLength(1)),
  kid: a.optional(a.string()),
  alg: a.optional(a.string()),
  use: a.optional(a.string()),
  key_ops: a.optional(a.array(a.string())),
  x5u: a.optional(a.string()),
  x5c: a.optional(a.array(a.string())),
  x5t: a.optional(a.string()),
  "x5t#S256": a.optional(a.string()),
  crv: a.optional(a.string()),
  x: a.optional(a.string()),
  y: a.optional(a.string()),
  n: a.optional(a.string()),
  e: a.optional(a.string()),
  d: a.optional(a.string()),
  p: a.optional(a.string()),
  q: a.optional(a.string()),
  dp: a.optional(a.string()),
  dq: a.optional(a.string()),
  qi: a.optional(a.string()),
  oth: a.optional(a.array(a.unknown())),
  k: a.optional(a.string()),
})

const oidcJwksSchema = a.object({
  keys: a.pipe(a.array(oidcJwkSchema), a.minLength(1)),
})

export type OidcJwks = a.InferOutput<typeof oidcJwksSchema>

export { oidcJwksSchema }
