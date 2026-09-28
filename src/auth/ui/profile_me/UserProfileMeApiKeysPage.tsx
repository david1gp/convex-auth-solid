import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { UserProfileMeApiKeysView } from "#src/auth/ui/profile_me/UserProfileMeApiKeysView.tsx"
import { userProfileMeApiKeysPageStateCreate } from "#src/auth/ui/profile_me/userProfileMeApiKeysPageStateCreate.ts"
import { urlUserProfileMe, urlUserProfileMeApiKeys } from "#src/auth/url/pageRouteAuth.ts"

export function UserProfileMeApiKeysPage() {
  return (
    <LayoutWrapperAuth>
      <UserProfileMeApiKeysView
        stateFactory={userProfileMeApiKeysPageStateCreate}
        profileHref={urlUserProfileMe()}
        apiKeysHref={urlUserProfileMeApiKeys()}
      />
    </LayoutWrapperAuth>
  )
}
