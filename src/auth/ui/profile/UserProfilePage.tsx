import { dbUsersToUserProfile } from "@/auth/convex/crud/dbUsersToUserProfile"
import type { DocUser } from "@/auth/convex/IdUser"
import { UserProfileForm } from "@/auth/ui/profile/UserProfileForm"
import {
  userProfileFormStateManagement,
  type UserProfileFormStateManagement,
} from "@/auth/ui/profile/userProfileFormState"
import { LinkLikeText } from "@/ui/links/LinkLikeText"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formModeView } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"

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
          <LinkLikeText>{ttt("User Profile")}</LinkLikeText>
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
  const mode = formModeView.view
  const sm: UserProfileFormStateManagement = userProfileFormStateManagement(mode, {})
  sm.loadData(dbUsersToUserProfile(p.data))
  return <UserProfileForm sm={sm} mode={mode} class="max-w-4xl mx-auto" />
}
