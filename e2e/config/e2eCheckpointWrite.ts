import { mkdir, rename, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import * as v from "valibot"
import { type E2eCheckpoint, e2eCheckpointSchema } from "./e2eCheckpointSchema.ts"

export async function e2eCheckpointWrite(path: string, checkpoint: E2eCheckpoint): Promise<void> {
  const parsed = v.parse(e2eCheckpointSchema, checkpoint)
  await mkdir(dirname(path), { recursive: true })
  const temporaryPath = `${path}.${process.pid}.${crypto.randomUUID()}.tmp`
  await writeFile(temporaryPath, `${JSON.stringify(parsed, null, 2)}\n`, { mode: 0o600 })
  await rename(temporaryPath, path)
}
