import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { authSignInDemoStoreGet } from "#src/auth/ui/sign_in/authSignInDemoStoreGet.ts"

export function authPageDemoRendererStateCreate() {
  const store = authSignInDemoStoreGet()
  return {
    store,
    signInHref: pageDemoHref("/sign-in"),
    otpHref: pageDemoHref("/sign-in-enter-otp"),
    errorHref: pageDemoHref("/sign-in-error"),
    async confirm(otp: string, email: string) {
      store.email.set(email)
      store.message.set(`Demo code ${otp} submitted for ${email}. No sign-in was attempted.`)
    },
  }
}
