import { ttt } from "~ui/i18n/ttt"
import { LayoutWrapperConvex } from "@/app/layout/LayoutWrapperConvex"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { urlUserProfileMe, urlUserProfileMeEdit } from "@/auth/url/pageRouteAuth"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classMerge } from "~ui/utils/classMerge"
import { UserProfileMeEditForm } from "./UserProfileMeEditForm"
import { userProfileMeEditFormStateManagement } from "./userProfileMeEditFormState"

export function UserProfileMeEditPage() {
  return (
    <LayoutWrapperConvex title={ttt("Edit Profile")}>
      <PageWrapper>
        <NavBreadcrumbSeparator />
        <NavLinkButton href={urlUserProfileMe()} isActive={false}>
          {ttt("My Profile")}
        </NavLinkButton>
        <NavBreadcrumbSeparator />
        <NavLinkButton href={urlUserProfileMeEdit()} isActive={true}>
          {ttt("Edit")}
        </NavLinkButton>
        <PageContent />
      </PageWrapper>
    </LayoutWrapperConvex>
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
      <h1 class="text-3xl font-bold mb-4">{ttt("Edit Profile")}</h1>
      <UserProfileMeEditForm sm={sm} />
    </div>
  )
}
