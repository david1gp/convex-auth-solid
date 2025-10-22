import * as v from "valibot"

export type DecodedToken = {
  // subject, whom the token refers to
  sub: string
  // org
  org?: string | null
  // issued at, seconds since unix epoch
  iat: number
  // expires, seconds since unix epoch
  exp: number
}

const integerMin1Schema = v.pipe(v.number(), v.integer(), v.minValue(1))

export const decodedTokenSchema = v.object({
  sub: v.string(),
  org: v.nullish(v.string()),
  iat: integerMin1Schema,
  exp: integerMin1Schema,
})

function types1(d: v.InferOutput<typeof decodedTokenSchema>): DecodedToken {
  return { ...d }
}

function types2(d: DecodedToken): v.InferOutput<typeof decodedTokenSchema> {
  return { ...d }
}
