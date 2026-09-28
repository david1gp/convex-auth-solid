import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import type { UserProfile } from "#src/auth/model/UserProfile.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"
import type { UserProfileMeEditFormStateManagement } from "./userProfileMeEditFormState.ts"

export function userProfileMeDemoStateCreate() {
  const store = pageDemoFixtureStoreGet()
  const profile = createSignalObject<UserProfile>(
    store.get<UserProfile>("auth.profile") ??
      ({
        name: "Alex Example",
        email: "alex@example.com",
        bio: "Building useful things.",
        url: "",
      } as UserProfile),
  )
  const message = createSignalObject("")
  function save(sm: UserProfileMeEditFormStateManagement) {
    const name = sm.state.name.get().trim()
    if (!name) {
      sm.errors.name.set("Name is required")
      return
    }
    const next = { ...profile.get(), name, bio: sm.state.bio.get(), url: sm.state.url.get() }
    store.set("auth.profile", next)
    profile.set(next)
    message.set("Demo profile saved locally. No account was changed.")
  }
  return { profile: profile.get, message: message.get, save }
}
