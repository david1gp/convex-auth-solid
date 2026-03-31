import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavUserProfile } from "#src/app/nav/NavUserProfile.tsx"
import { userSessionGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { urlUserProfileMe, urlUserProfileMeEdit } from "#src/auth/url/pageRouteAuth.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"
import { UserProfileMeEditForm } from "./UserProfileMeEditForm.js"
import { userProfileMeEditFormStateManagement } from "./userProfileMeEditFormState.js"

export function UserProfileMeEditPage() {
  return (
    <LayoutWrapperAuth>
      <PageWrapper>
        <NavUserProfile
          childrenLeft={
            <>
              <NavBreadcrumbSeparator />
              <NavLinkButton href={urlUserProfileMe()} isActive={false}>
                {ttc("My Profile")}
              </NavLinkButton>
              <NavBreadcrumbSeparator />
              <NavLinkButton href={urlUserProfileMeEdit()} isActive={true}>
                {ttc("Edit")}
              </NavLinkButton>
            </>
          }
        />
        <PageContent />
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}

function PageContent() {
  const session = userSessionGet()
  const initialData = {
    name: session.profile.name,
    bio: session.profile.bio || "",
    url: session.profile.url || "",
  }
  const sm = userProfileMeEditFormStateManagement(initialData)

  return (
    <div class={classMerge("max-w-4xl mx-auto px-4 py-8")}>
      <h1 class="text-3xl font-bold mb-4">{ttc("Edit Profile")}</h1>
      <UserProfileMeEditForm sm={sm} />
    </div>
  )
}
