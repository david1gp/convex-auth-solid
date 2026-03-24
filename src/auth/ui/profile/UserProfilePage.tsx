import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.js"
import { NavCenter } from "#src/app/nav/NavCenter.js"
import { NavStatic } from "#src/app/nav/NavStatic.js"
import type { DocUser } from "#src/auth/convex/IdUser.js"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.js"
import { UserProfileForm } from "#src/auth/ui/profile/UserProfileForm.js"
import {
    userProfileFormStateManagement,
    type UserProfileFormStateManagement,
} from "#src/auth/ui/profile/userProfileFormState.js"
import { urlUserProfileView } from "#src/auth/url/pageRouteAuth.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { formMode } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { api } from "@convex/_generated/api.js"
import { useParams } from "@solidjs/router.js"
import { Match, Switch } from "solid-js"

export function UserProfilePage() {
  const params = useParams()
  const getUsername = () => params.username
  return (
    <Switch>
      <Match when={!getUsername()}>
        <ErrorPage title={ttc("Missing :username in path")} />
      </Match>
      <Match when={getUsername()}>
        <PageWrapper>
          <NavStatic
            dense={true}
            childrenLeft={
              <>
                <NavBreadcrumbSeparator />
                <NavLinkButton href={urlUserProfileView(getUsername()!)} isActive={true}>
                  {ttc("User Profile")}
                </NavLinkButton>
              </>
            }
            childrenCenter={<NavCenter hasBreadcrumbs={false} />}
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
        <ErrorPage title={ttc("Error loading user profile")} />
      </Match>
      <Match when={getData() === null}>
        <ErrorPage title={ttc("User not found")} />
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
