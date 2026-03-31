import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavFile } from "#src/app/nav/NavFile.tsx"
import { FileMutate } from "#src/file/ui/mutate/FileMutate.tsx"
import { urlFileRemove } from "#src/file/url/urlFile.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { formMode, getFormModeTitle } from "#ui/input/form/formMode.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { useParams } from "@solidjs/router"
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
