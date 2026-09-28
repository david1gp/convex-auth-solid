import type { DemoListType } from "#ui/generate_demo_list/DemoListType.ts"

export function demoCatalogDataCreate(demoList: DemoListType) {
  return Object.entries(demoList).map(([category, demos]) => ({
    category,
    demos: Object.keys(demos),
  }))
}
