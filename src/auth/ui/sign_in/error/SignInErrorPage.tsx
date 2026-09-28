import { SignInErrorView } from "#src/auth/ui/sign_in/error/SignInErrorView.tsx"
import { signInErrorPageStateCreate } from "#src/auth/ui/sign_in/error/signInErrorPageStateCreate.ts"

export function SignInErrorPage() {
  const state = signInErrorPageStateCreate()
  return <SignInErrorView errorMessage={state.errorMessage} />
}
