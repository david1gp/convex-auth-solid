import { ttc } from "@/app/i18n/ttc"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavFile } from "@/app/nav/NavFile"
import { FileMutate } from "@/file/ui/mutate/FileMutate"
import { urlResourceEdit } from "@/resource/url/urlResource"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { useParams } from "@solidjs/router"
import { Match, Switch } from "solid-js"
import { formMode, getFormModeTitle } from "~ui/input/form/formMode"
import { PageWrapper } from "~ui/static/page/PageWrapper"

const mode = formMode.edit

export function ResourceFileEditPage() {
  const params = useParams()
  const getResourceId = () => params.resourceId
  const getFileId = () => params.fileId

  return (
    <Switch>
      <Match when={!getResourceId()}>
        <ErrorPage title={ttc("Missing :resourceId in path")} />
      </Match>
      <Match when={!getFileId()}>
        <ErrorPage title={ttc("Missing :fileId in path")} />
      </Match>
      <Match when={true}>
        <PageWrapper>
          <NavFile resourceId={getResourceId()!} fileId={getFileId()} getFilePageTitle={getPageTitle}>
            <NavLinkButton href={urlResourceEdit(getResourceId()!)} isActive>
              {ttc("Edit")}
            </NavLinkButton>
          </NavFile>
          <FileMutate mode={mode} resourceId={getResourceId()!} fileId={getFileId()!} />
        </PageWrapper>
      </Match>
    </Switch>
  )
}

function getPageTitle(fileName?: string) {
  return getFormModeTitle(mode, fileName ?? ttc("File"))
}
