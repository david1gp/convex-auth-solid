import * as v from "valibot"

export const signUpTermsSchema = v.pipe(
  v.boolean(),
  v.check((input) => input === true, "You must agree to the Terms of Service and Privacy Policy"),
)
