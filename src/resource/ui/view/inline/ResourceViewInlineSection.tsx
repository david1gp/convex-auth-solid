import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { FileModel } from "#src/file/model/FileModel.js"
import { fileSchema } from "#src/file/model/fileSchema.js"
import { FileCardView } from "#src/file/ui/list/FileCardView.jsx"
import type { HasResourceModel } from "#src/resource/model/HasResourceModel.js"
import { ResourceViewInline } from "#src/resource/ui/view/inline/ResourceViewInline.jsx"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { resultHasList } from "#src/utils/result/resultHasList.js"
import { classArr } from "#ui/utils/classArr.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import { For, Match, Switch } from "solid-js"
import * as a from "valibot"

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
