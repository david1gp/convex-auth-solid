import { ttc } from "#src/app/i18n/ttc.js"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.js"
import { NavUserProfile } from "#src/app/nav/NavUserProfile.js"
import { userSessionGet } from "#src/auth/ui/signals/userSessionSignal.js"
import { urlUserProfileMe, urlUserProfileMeEdit } from "#src/auth/url/pageRouteAuth.js"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { classMerge } from "#ui/utils/classMerge"
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
