import type { UserProfile } from "#src/auth/model/UserProfile.ts"
import { UserProfileForm } from "./UserProfileForm.tsx"
import { userProfileViewStateCreate } from "./userProfileViewStateCreate.ts"

export function UserProfileView(p: { profile: UserProfile }) {
  const state = userProfileViewStateCreate(() => p.profile)
  return <UserProfileForm sm={state.sm} mode={state.mode} class="max-w-4xl mx-auto" />
}
