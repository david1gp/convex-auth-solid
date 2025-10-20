import { describe, expect, it } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join } from "node:path"

describe("disallowSrcImportsInLib", () => {
  const files = getAllTsFiles("lib")
  for (const file of files) {
    const content = readFileSync(file, "utf-8")

    it(file, () => {
      const lines = content.split("\n")
      lines.forEach((line, index) => {
        const hasImport = line.trim().startsWith("import") && line.includes('from "@/')
        const errorMessage = `Disallowed import found in ${file}:${index + 1}: ${line.trim()}`
        expect(hasImport, errorMessage).toBeFalse()
      })
    })
  }
})

function getAllTsFiles(dir: string): string[] {
  const files: string[] = []
  const items = readdirSync(dir)
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      files.push(...getAllTsFiles(fullPath))
    } else if (extname(item) === ".ts" || extname(item) === ".tsx") {
      files.push(fullPath)
    }
  }
  return files
}
