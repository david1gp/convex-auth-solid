import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavStatic } from "@/app/nav/NavStatic"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { OrganizationListNavButton } from "@/app/nav/links/OrganizationListNavButton"
import { ResourceListNavButton } from "@/app/nav/links/ResourceListNavButton"
import { WorkspaceListLinkNavButton } from "@/app/nav/links/WorkspaceListLinkNavButton"
import { fileNameGet, fileNameRecordSignalRegisterHandler } from "@/file/ui/fileNameRecordSignal"
import { urlFileEdit } from "@/file/url/urlFile"
import type { HasResourceId } from "@/resource/model/HasResourceId"
import { resourceNameGet, resourceNameRecordSignalRegisterHandler } from "@/resource/ui/resourceNameRecordSignal"
import { urlResourceView } from "@/resource/url/urlResource"
import { Show, splitProps } from "solid-js"
import { SetPageTitle } from "~ui/static/meta/SetPageTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface NavFileProps extends NavFileBreadcrumbsProps, MayHaveChildren, MayHaveClass {}

export function NavFile(p: NavFileProps) {
  const [s, rest] = splitProps(p, ["children", "class"])
  return (
    <NavStatic
      dense={true}
      class={p.class}
      childrenCenter={
        <>
          <OrganizationListNavButton />
          <WorkspaceListLinkNavButton />
          <div class="flex flex-wrap gap-2">
            <NavFileBreadcrumbs {...rest}>{s.children}</NavFileBreadcrumbs>
          </div>
        </>
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
