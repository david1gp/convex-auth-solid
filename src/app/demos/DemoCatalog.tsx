import { For } from "solid-js"
import { demoCatalogDataCreate } from "#src/app/demos/demoCatalogDataCreate.ts"
import { demoList } from "#src/app/demos/demoList.ts"

export function DemoCatalog() {
  const categories = demoCatalogDataCreate(demoList)

  return (
    <main class="mx-auto max-w-5xl p-6">
      <h1 class="mb-6 text-2xl font-semibold">Demos</h1>
      <a class="mb-8 inline-block underline" href="/demos/pages">
        Browse page demos
      </a>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <For each={categories}>
          {(category) => (
            <section>
              <h2 class="mb-2 text-lg font-medium capitalize">{category.category}</h2>
              <ul class="space-y-1">
                <For each={category.demos}>
                  {(demo) => (
                    <li>
                      <a class="underline" href={`/demos/${category.category}/${demo}`}>
                        {demo}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          )}
        </For>
      </div>
    </main>
  )
}
