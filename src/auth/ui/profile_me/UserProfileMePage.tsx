import { ttt } from "~ui/i18n/ttt"
import { LayoutWrapperConvex } from "@/app/layout/LayoutWrapperConvex"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { urlUserProfileMe, urlUserProfileMeChangeEmail, urlUserProfileMeChangePassword, urlUserProfileMeEdit } from "@/auth/url/pageRouteAuth"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"
import { mdiSquareEditOutline } from "@mdi/js"
import { Show } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LinkButtonIconOnly } from "~ui/interactive/link/LinkButtonIconOnly"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export function UserProfileMePage() {
  return (
    <LayoutWrapperConvex title={ttt("My Profile")}>
      <PageWrapper>
        <NavBreadcrumbSeparator />
        <NavLinkButton href={urlUserProfileMe()} isActive={true}>
          {ttt("My Profile")}
        </NavLinkButton>
        <PageContent />
      </PageWrapper>
    </LayoutWrapperConvex>
  )
}

function PageContent() {
  const userSession = userSessionGet()
  const userProfile = userSession.profile
  return (
    <div class={classMerge("max-w-2xl mx-auto", "space-y-6")}>
      <ProfileSectionImage image={userProfile.image} name={userProfile.name} />
      <ProfileSectionInfo userProfile={userProfile} />
      <ProfileSectionEmail email={userProfile.email} />
      <ProfileSectionActions />
    </div>
  )
}

interface ProfileSectionImageProps extends MayHaveClass {
  image?: string
  name: string
}

function ProfileSectionImage(p: ProfileSectionImageProps) {
  return (
    <div class="flex justify-center -mb-7">
      {p.image ? (
        <img src={p.image} alt={ttt("Profile picture")} class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" />
      ) : (
        <div class="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
          <span class="text-3xl font-bold text-gray-600 dark:text-gray-300">{p.name.charAt(0).toUpperCase()}</span>
        </div>
      )}
    </div>
  )
}

function ProfileSectionInfo(p: { userProfile: { name: string; bio?: string; url?: string } }) {
  return (
    <section id="info" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{p.userProfile.name}</h2>
        <LinkButtonIconOnly href={urlUserProfileMeEdit()} icon={mdiSquareEditOutline} variant={buttonVariant.link} />
      </div>

      {p.userProfile.bio && <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{p.userProfile.bio}</p>}

      {p.userProfile.url && (
        <a
          href={p.userProfile.url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:underline break-all"
        >
          {p.userProfile.url}
        </a>
      )}
    </section>
  )
}

function ProfileSectionEmail(p: { email?: string }) {
  return (
    <section id="email" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm text-muted-foreground font-medium">{ttt("Email")}</span>
          <p class="text-gray-900 dark:text-gray-100">{p.email ?? ""}</p>
        </div>
        <LinkButtonIconOnly
          href={urlUserProfileMeChangeEmail()}
          icon={mdiSquareEditOutline}
          variant={buttonVariant.link}
        />
      </div>
    </section>
  )
}

function ProfileSectionActions() {
  return (
    <section id="actions" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 class="text-sm text-muted-foreground font-medium">{ttt("Account Actions")}</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LinkButton href={urlUserProfileMeChangePassword()} variant={buttonVariant.link} class="justify-start pl-0">
          {ttt("Change Password")}
        </LinkButton>
      </div>
    </section>
  )
}
