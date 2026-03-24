import { ttc } from "#src/app/i18n/ttc.js"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.js"
import { NavFile } from "#src/app/nav/NavFile.js"
import { FileMutate } from "#src/file/ui/mutate/FileMutate.js"
import { urlFileRemove } from "#src/file/url/urlFile.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode"
import { PageWrapper } from "#ui/static/page/PageWrapper"
import { useParams } from "@solidjs/router.js"
import { Match, Switch } from "solid-js"

const mode = formMode.remove

export function ResourceFileRemovePage() {
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
            <NavLinkButton href={urlFileRemove(getResourceId()!, getFileId()!)} isActive={true}>
              {ttc("Remove")}
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
