import * as a from "valibot"

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

const integerMin1Schema = a.pipe(a.number(), a.integer(), a.minValue(1))

export const decodedTokenSchema = a.object({
  sub: a.string(),
  org: a.nullish(a.string()),
  iat: integerMin1Schema,
  exp: integerMin1Schema,
})

function types1(d: a.InferOutput<typeof decodedTokenSchema>): DecodedToken {
  return { ...d }
}

function types2(d: DecodedToken): a.InferOutput<typeof decodedTokenSchema> {
  return { ...d }
}
