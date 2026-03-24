import { type Result, createResult } from "#result"
import { envR2AccessKeyIdResult } from "#src/app/env/private/envR2AccessKeyIdResult.js"
import { envR2AccountIdResult } from "#src/app/env/private/envR2AccountIdResult.js"
import { envR2BucketNameResult } from "#src/app/env/private/envR2BucketNameResult.js"
import { envR2SecretAccessKeyResult } from "#src/app/env/private/envR2SecretAccessKeyResult.js"
import { S3Client } from "@bradenmacdonald/s3-lite-client"

/**
 * - code - https://github.com/bradenmacdonald/s3-lite-client
 * - jsr - https://jsr.io/@bradenmacdonald/s3-lite-client
 * - src - https://raw.githubusercontent.com/bradenmacdonald/s3-lite-client/refs/heads/main/client.ts
 * @returns
 */
export function r2CreateClient(): Result<S3Client> {
  const bucketResult = envR2BucketNameResult()
  if (!bucketResult.success) return bucketResult

  const accessKeyIdResult = envR2AccessKeyIdResult()
  if (!accessKeyIdResult.success) return accessKeyIdResult

  const secretAccessKeyResult = envR2SecretAccessKeyResult()
  if (!secretAccessKeyResult.success) return secretAccessKeyResult

  const accountIdResult = envR2AccountIdResult()
  if (!accountIdResult.success) return accountIdResult

  const client = new S3Client({
    endPoint: `https://${accountIdResult.data}.r2.cloudflarestorage.com`,
    accessKey: accessKeyIdResult.data,
    secretKey: secretAccessKeyResult.data,
    region: "auto",
    bucket: bucketResult.data,
    pathStyle: true,
  })

  return createResult(client)
}
