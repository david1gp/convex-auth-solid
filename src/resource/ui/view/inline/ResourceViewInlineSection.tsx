import { ttc } from "@/app/i18n/ttc"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { FileModel } from "@/file/model/FileModel"
import { fileSchema } from "@/file/model/fileSchema"
import { FileCardView } from "@/file/ui/list/FileCardView"
import type { HasResourceModel } from "@/resource/model/HasResourceModel"
import { ResourceViewInline } from "@/resource/ui/view/inline/ResourceViewInline"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { resultHasList } from "@/utils/result/resultHasList"
import { api } from "@convex/_generated/api"
import { For, Match, Switch } from "solid-js"
import * as a from "valibot"
import { classArr } from "~ui/utils/classArr"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface ResourceViewInlineSectionProps extends HasResourceModel, MayHaveClass {}

export function ResourceViewInlineSection(p: ResourceViewInlineSectionProps) {
  return (
    <section class={classArr("border border-gray-400 rounded-xl", "p-4", p.class)}>
      <ResourceViewInline showCardWrapper={false} showMetaDates={false} {...p} />
      <h3 class="text-xl font-semibold mt-4 mb-2">{ttc("Files")}</h3>
      <FileLoader {...p} />
    </section>
  )
}

export function FileLoader(p: ResourceViewInlineSectionProps) {
  const getFilesResult = createQueryCached<FileModel[]>(
    createQuery(api.resource.resourceFileListQuery, {
      token: userTokenGet(),
      resourceId: p.resource.resourceId,
    }),
    "resourceFileListQuery" + "/" + p.resource.resourceId,
    a.array(fileSchema),
  )

  return (
    <Switch>
      <Match when={!getFilesResult()}>
        <p class={classArr("text-muted-foreground")}>{ttc("Loading files...")}</p>
      </Match>
      <Match when={!resultHasList(getFilesResult())}>
        <p class="text-muted-foreground mt-4">{ttc("No files in this resource")}</p>
      </Match>
      <Match when={resultHasList(getFilesResult())}>
        {(getFiles) => (
          <div class={classArr("flex flex-col gap-4")}>
            <For each={getFiles()}>{(file) => <FileCardView resourceId={p.resource.resourceId} file={file} />}</For>
          </div>
        )}
      </Match>
    </Switch>
  )
}
