import { r2CreateClient } from "@/r2/api/r2CreateClient"
import { createResult, type PromiseResult } from "~utils/result/Result"

const log = false

export async function r2ApiGetUploadUrl(key: string): PromiseResult<string> {
  const op = "r2ApiGetUploadUrl"
  const r2Result = r2CreateClient()
  if (!r2Result.success) return r2Result
  const r2 = r2Result.data
  const url = await r2.getPresignedUrl("PUT", key, {
    expirySeconds: 3600,
  })
  if (log) console.log(op, url)
  return createResult(url)
}
