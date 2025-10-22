import { requiredPasswordLength } from "@/auth/ui/sign_up/requiredPasswordLength"
import * as v from "valibot"
import { inputMaxLength100, inputMaxLength50, urlMaxLength } from "~ui/input/input/inputMaxLength"

export const signUpNameSchema = v.pipe(
  v.string(),
  v.minLength(1, "Name is required"),
  v.maxLength(inputMaxLength50, "Only a max length of 50 is allowed"),
)

export const signUpTermsSchema = v.pipe(
  v.boolean(),
  v.check((input) => input === true, "You must agree to the Terms of Service and Privacy Policy"),
)

export const emailSchema = v.pipe(
  v.string(),
  v.minLength(1, "Email is required"),
  v.maxLength(inputMaxLength100, "Only a max length of 100 is allowed"),
  v.email("Please enter a valid email"),
)

export const passwordSchema = v.pipe(
  v.string(),
  v.minLength(1, "Password is required"),
  v.minLength(requiredPasswordLength, "Password is to short"),
  v.maxLength(urlMaxLength),
)

export const otpSchema = v.pipe(
  v.string(),
  v.minLength(6, "Code must be exactly 6 digits"),
  v.maxLength(6, "Code must be exactly 6 digits"),
  v.regex(/^\d{6}$/, "Code must contain only numbers"),
)
