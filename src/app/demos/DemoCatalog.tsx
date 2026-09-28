import { For } from "solid-js"
import { demoCatalogDataCreate } from "#src/app/demos/demoCatalogDataCreate.ts"
import { demoList } from "#src/app/demos/demoList.ts"

export function DemoCatalog() {
  const categories = demoCatalogDataCreate(demoList)

  return (
    <main class="mx-auto max-w-5xl p-6">
      <h1 class="mb-6 text-2xl font-semibold">Demos</h1>
      <section class="mb-8">
        <h2 class="mb-4 text-xl font-medium">Component examples</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={categories.componentCategories}>
            {(category) => (
              <section>
                <h3 class="mb-2 text-lg font-medium capitalize">{category.category}</h3>
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
      </section>
      <section>
        <h2 class="mb-4 text-xl font-medium">Full-page demos</h2>
        <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <For each={categories.pageDemos}>
            {(demo) => (
              <li>
                <a class="underline" href={demo.href}>
                  {demo.title} <span class="text-muted-foreground">({demo.route})</span>
                </a>
              </li>
            )}
          </For>
        </ul>
      </section>
    </main>
  )
}
