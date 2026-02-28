import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavUserProfile } from "@/app/nav/NavUserProfile"
import { urlUserProfileMe, urlUserProfileMeEdit } from "@/auth/url/pageRouteAuth"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classMerge } from "~ui/utils/classMerge"
import { UserProfileMeEditForm } from "./UserProfileMeEditForm"
import { userProfileMeEditFormStateManagement } from "./userProfileMeEditFormState"

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
