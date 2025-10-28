import { NavAppDir } from "@/app/nav/NavAppDir"
import { OrgMutate } from "@/org/ui/mutate/OrgMutate"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import { formMode, getFormTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { ErrorPage } from "~ui/static/pages/ErrorPage"

const mode = formMode.remove

export function OrgDeletePage() {
  const params = useParams()
  const getSlug = () => params.slug
  return (
    <Switch>
      <Match when={!getSlug()}>
        <ErrorPage title={ttt("Missing :slug in path")} />
      </Match>
      <Match when={getSlug()}>
        <PageWrapper>
          <NavAppDir getPageTitle={getPageTitle} orgSlug={getSlug()} />
          <OrgMutate mode={mode} orgSlug={getSlug()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(orgName?: string, workspaceName?: string) {
  return getFormTitle(mode, workspaceName ?? ttt("Organization"))
}