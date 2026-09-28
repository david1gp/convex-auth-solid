import { userProfileMeEditFormStateManagement } from "./userProfileMeEditFormState.ts"

export function userProfileMeEditViewStateCreate(
  props: () => { profile: { name: string; bio?: string; url?: string } },
) {
  const profile = props().profile
  return {
    sm: userProfileMeEditFormStateManagement({ name: profile.name, bio: profile.bio ?? "", url: profile.url ?? "" }),
  }
}
