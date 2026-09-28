import { Show } from "solid-js"
import { NavUserProfile } from "#src/app/nav/NavUserProfile.tsx"
import { UserProfileMeApiKeysBreadcrumbs } from "#src/auth/ui/profile_me/UserProfileMeApiKeysBreadcrumbs.tsx"
import { UserProfileMeApiKeysContent } from "#src/auth/ui/profile_me/UserProfileMeApiKeysContent.tsx"
import type { userProfileMeApiKeysPageStateCreate } from "#src/auth/ui/profile_me/userProfileMeApiKeysPageStateCreate.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function UserProfileMeApiKeysView(p: {
  stateFactory: typeof userProfileMeApiKeysPageStateCreate
  profileHref: string
  apiKeysHref: string
  demo?: boolean
}) {
  return (
    <PageWrapper>
      <Show
        when={p.demo}
        fallback={
          <NavUserProfile
            childrenLeft={<UserProfileMeApiKeysBreadcrumbs profileHref={p.profileHref} apiKeysHref={p.apiKeysHref} />}
          />
        }
      >
        <nav aria-label="Profile breadcrumbs" class="flex flex-wrap gap-2 mb-4">
          <UserProfileMeApiKeysBreadcrumbs profileHref={p.profileHref} apiKeysHref={p.apiKeysHref} />
        </nav>
      </Show>
      <UserProfileMeApiKeysContent stateFactory={p.stateFactory} />
    </PageWrapper>
  )
}
