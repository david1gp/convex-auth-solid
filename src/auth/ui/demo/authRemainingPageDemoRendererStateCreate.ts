import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { userProfileMeDemoStateCreate } from "#src/auth/ui/profile_me/userProfileMeDemoStateCreate.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"
import { authProfileFinalDemoStateCreate } from "./authProfileFinalDemoStateCreate.ts"

export function authRemainingPageDemoRendererStateCreate() {
  const store = pageDemoFixtureStoreGet()
  const message = createSignalObject("")
  const signUpMessage = createSignalObject(store.get<string>("auth.signUp.message") ?? "")
  store.set("auth.signUp.messageSignal", signUpMessage)
  return {
    profile: userProfileMeDemoStateCreate(),
    profileFinal: authProfileFinalDemoStateCreate(),
    email: () => store.get<string>("auth.signUp.email") ?? "alex@example.com",
    signUpMessage: signUpMessage.get,
    message: message.get,
    confirm: async (_otp: string, email: string) => {
      store.set("auth.signUp.email", email)
      message.set("Demo code accepted locally. No email was verified and no session was created.")
    },
  }
}
