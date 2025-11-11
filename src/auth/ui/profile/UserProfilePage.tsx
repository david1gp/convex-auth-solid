import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import type { DocUser } from "@/auth/convex/IdUser"
import { docUserToUserProfile } from "@/auth/convex/user/docUserToUserProfile"
import { UserProfileForm } from "@/auth/ui/profile/UserProfileForm"
import {
  userProfileFormStateManagement,
  type UserProfileFormStateManagement,
} from "@/auth/ui/profile/userProfileFormState"
import { urlUserProfileView } from "@/auth/url/pageRouteAuth"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function UserProfilePage() {
  const params = useParams()
  const getUsername = () => params.username
  return (
    <Switch>
      <Match when={!getUsername()}>
        <ErrorPage title={ttt("Missing :username in path")} />
      </Match>
      <Match when={getUsername()}>
        <PageWrapper>
          <NavStatic
            dense={true}
            childrenLeft={
              <>
                <NavBreadcrumbSeparator />
                <NavLinkButton href={urlUserProfileView(getUsername()!)} isActive={true}>
                  {ttt("User Profile")}
                </NavLinkButton>
              </>
            }
            childrenCenter={
              <>
                <OrganizationListNavButton />
                <WorkspaceListLinkNavButton />
              </>
            }
          />
          <UserProfileLoader username={getUsername()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

interface UserProfileLoaderProps {
  username: string
}

function UserProfileLoader(p: UserProfileLoaderProps) {
  const getData = createQuery(api.auth.userGetByUsernameQuery, {
    username: p.username,
  })
  return (
    <Switch>
      <Match when={getData() === undefined}>
        <ErrorPage title={ttt("Error loading user profile")} />
      </Match>
      <Match when={getData() === null}>
        <ErrorPage title={ttt("User not found")} />
      </Match>
      <Match when={getData()}>
        <UserProfileDisplay data={getData()!} />
      </Match>
    </Switch>
  )
}

interface UserProfileDisplayProps {
  data: DocUser
}

function UserProfileDisplay(p: UserProfileDisplayProps) {
  const mode = formMode.view
  const sm: UserProfileFormStateManagement = userProfileFormStateManagement(mode, {})
  sm.loadData(docUserToUserProfile(p.data))
  return <UserProfileForm sm={sm} mode={mode} class="max-w-4xl mx-auto" />
}
