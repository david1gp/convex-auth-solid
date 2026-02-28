import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavUserProfile } from "@/app/nav/NavUserProfile"
import type { UserProfile } from "@/auth/model/UserProfile"
import { UserProfileForm } from "@/auth/ui/profile/UserProfileForm"
import {
  userProfileFormStateManagement,
  type UserProfileFormStateManagement,
} from "@/auth/ui/profile/userProfileFormState"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"
import {
  urlUserProfileMe,
  urlUserProfileMeChangeEmail,
  urlUserProfileMeChangePassword,
  urlUserProfileMeEdit,
  urlUserProfileMeImage,
} from "@/auth/url/pageRouteAuth"
import { orgNameGet } from "@/org/org_ui/orgNameRecordSignal"
import { urlOrgLeave, urlOrgView } from "@/org/org_url/urlOrg"
import { mdiLocationExit, mdiSquareEditOutline } from "@mdi/js"
import { Show } from "solid-js"
import { formMode } from "~ui/input/form/formMode"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { LinkButtonIconOnly } from "~ui/interactive/link/LinkButtonIconOnly"
import { Icon } from "~ui/static/icon/Icon"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classArr } from "~ui/utils/classArr"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { capitalizeFirstLetter } from "~utils/text/capitalizeFirstLetter"

export function UserProfileMePage() {
  return (
    <LayoutWrapperAuth>
      <PageWrapper>
        <NavUserProfile
          childrenLeft={
            <>
              <NavBreadcrumbSeparator />
              <NavLinkButton href={urlUserProfileMe()} isActive={true}>
                {ttc("My Profile")}
              </NavLinkButton>
            </>
          }
        />
        <PageContent />
        {/* <PageContent /> */}
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}

function PageContent1() {
  const mode = formMode.view
  const sm: UserProfileFormStateManagement = userProfileFormStateManagement(mode, {})
  sm.loadData(userSessionGet().profile)
  return <UserProfileForm sm={sm} mode={mode} class="max-w-4xl mx-auto" />
}

function PageContent() {
  const userSession = userSessionGet()
  const userProfile = userSession.profile
  return (
    <div class={classMerge("max-w-2xl mx-auto", "space-y-6")}>
      <ProfileSectionImage image={userProfile.image} name={userProfile.name} />
      <ProfileSectionInfo userProfile={userProfile} />
      <ProfileSectionEmail email={userProfile.email} />
      <ProfileSectionOrg orgHandle={userProfile.orgHandle} orgRole={userProfile.orgRole} />
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
      <a
        href={urlUserProfileMeImage()}
        class={classMerge(
          "group relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700",
          "z-10",
          p.class,
        )}
      >
        {p.image ? (
          <img src={p.image} alt={ttc("Profile picture")} class="w-full h-full object-cover" />
        ) : (
          <div class="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span class="text-3xl font-bold text-gray-600 dark:text-gray-300">{p.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon path={mdiSquareEditOutline} class="w-8 h-8 fill-white text-white" />
        </div>
      </a>
    </div>
  )
}

function ProfileSectionInfo(p: { userProfile: Pick<UserProfile, "name" | "bio" | "url"> }) {
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
          <span class="text-sm text-muted-foreground font-medium">{ttc("Email")}</span>
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

function ProfileSectionOrg(p: { orgHandle?: string; orgRole?: string }) {
  return (
    <section id="org" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <Show
        when={p.orgHandle}
        fallback={
          <div>
            <span class="text-sm text-muted-foreground font-medium">{ttc("Organization")}</span>
            <p class="text-gray-900 dark:text-gray-100">{ttc("None")}</p>
            <p class="text-sm text-muted-foreground mt-1">{ttc("You are not part of any organization")}</p>
          </div>
        }
      >
        {(orgHandle) => {
          const orgName = orgNameGet(orgHandle())
          return (
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span class="text-sm text-muted-foreground font-medium">{ttc("Organization")}</span>
                <br />
                <div class="flex flex-wrap gap-2">
                  <LinkButton href={urlOrgView(orgHandle())} variant={buttonVariant.link} class="pl-0">
                    {orgName ?? orgHandle()}
                  </LinkButton>
                  {p.orgRole && <p class="text-gray-600 dark:text-gray-400 py-2">{capitalizeFirstLetter(p.orgRole)}</p>}
                </div>
              </div>
              <LinkButtonIconOnly href={urlOrgLeave(orgHandle())} icon={mdiLocationExit} variant={buttonVariant.link} />
            </div>
          )
        }}
      </Show>
    </section>
  )
}

function ProfileSectionActions() {
  return (
    <section id="actions" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 class="text-sm text-muted-foreground font-medium">{ttc("Account Actions")}</h3>
      <div class={classArr("grid grid-cols-1 md:grid-cols-3 gap-4")}>
        <LinkButton href={urlUserProfileMeChangePassword()} variant={buttonVariant.link} class="justify-start pl-0">
          {ttc("Change Password")}
        </LinkButton>
      </div>
    </section>
  )
}
