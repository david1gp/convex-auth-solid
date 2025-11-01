import * as v from "valibot"

export const otpSchema = v.pipe(
  v.string(),
  v.minLength(6, "Code must be exactly 6 digits"),
  v.maxLength(6, "Code must be exactly 6 digits"),
  v.regex(/^\d{6}$/, "Code must contain only numbers"),
)
