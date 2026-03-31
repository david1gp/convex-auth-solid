import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavCenter } from "#src/app/nav/NavCenter.tsx"
import { NavStatic } from "#src/app/nav/NavStatic.tsx"
import type { DocUser } from "#src/auth/convex/IdUser.ts"
import { docUserToUserProfile } from "#src/auth/convex/user/docUserToUserProfile.ts"
import { UserProfileForm } from "#src/auth/ui/profile/UserProfileForm.tsx"
import {
    userProfileFormStateManagement,
    type UserProfileFormStateManagement,
} from "#src/auth/ui/profile/userProfileFormState.ts"
import { urlUserProfileView } from "#src/auth/url/pageRouteAuth.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
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
