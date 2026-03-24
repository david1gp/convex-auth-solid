import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.jsx"
import { NavCenter } from "#src/app/nav/NavCenter.jsx"
import { NavStatic } from "#src/app/nav/NavStatic.jsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.jsx"
import { ResourceListNavButton } from "#src/app/nav/links/ResourceListNavButton.jsx"
import { fileNameGet, fileNameRecordSignalRegisterHandler } from "#src/file/ui/fileNameRecordSignal.js"
import { urlFileEdit } from "#src/file/url/urlFile.js"
import type { HasResourceId } from "#src/resource/model/HasResourceId.js"
import { resourceNameGet, resourceNameRecordSignalRegisterHandler } from "#src/resource/ui/resourceNameRecordSignal.js"
import { urlResourceView } from "#src/resource/url/urlResource.js"
import { SetPageTitle } from "#ui/static/meta/SetPageTitle.jsx"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { Show, splitProps } from "solid-js"

export interface NavFileProps extends NavFileBreadcrumbsProps, MayHaveChildren, MayHaveClass {}

export function NavFile(p: NavFileProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenCenter={
        <NavCenter>
          <div class="flex flex-wrap gap-2">
            <NavFileBreadcrumbs {...rest}>{s.children}</NavFileBreadcrumbs>
          </div>
        </NavCenter>
      }
    />
  )
}

export interface NavFileBreadcrumbsProps extends HasResourceId, MayHaveChildren {
  fileId?: string
  getFilePageTitle?: (resourceName?: string, fileName?: string) => string
}

function NavFileBreadcrumbs(p: NavFileBreadcrumbsProps) {
  resourceNameRecordSignalRegisterHandler()
  fileNameRecordSignalRegisterHandler()
  return (
    <>
      <Show when={p.getFilePageTitle}>
        {(getPageTitle) => <SetPageTitle title={getPageTitle()(p.fileId && fileNameGet(p.fileId))} />}
      </Show>
      {/* 1 */}
      <ResourceListNavButton isActive={false} />
      {/* 2 */}
      <NavBreadcrumbSeparator />
      <NavLinkButton href={urlResourceView(p.resourceId)} isActive={!p.children && !p.fileId}>
        {resourceNameGet(p.resourceId) || p.resourceId}
      </NavLinkButton>
      {/* 3 */}
      <Show when={p.fileId && fileNameGet(p.fileId)}>
        {(fileName) => (
          <>
            <NavBreadcrumbSeparator />
            <NavLinkButton href={p.fileId ? urlFileEdit(p.resourceId, p.fileId) : ""} isActive={!p.children}>
              {fileName()}
            </NavLinkButton>
          </>
        )}
      </Show>
      {/* 4 */}
      <Show when={p.children}>
        {(getChildren) => (
          <>
            <NavBreadcrumbSeparator />
            {getChildren()}
          </>
        )}
      </Show>
    </>
  )
}
