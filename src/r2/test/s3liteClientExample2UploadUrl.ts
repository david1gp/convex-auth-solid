import { envR2AccessKeyIdResult } from "@/app/env/private/envR2AccessKeyIdResult"
import { envR2AccountIdResult } from "@/app/env/private/envR2AccountIdResult"
import { envR2BucketNameResult } from "@/app/env/private/envR2BucketNameResult"
import { envR2SecretAccessKeyResult } from "@/app/env/private/envR2SecretAccessKeyResult"
import { S3Client } from "@bradenmacdonald/s3-lite-client"

const accessKeyIdResult = envR2AccessKeyIdResult()
if (!accessKeyIdResult.success) {
  console.error(accessKeyIdResult)
  process.exit(1)
}
const accessKeyId = accessKeyIdResult.data

const accessKeySecretResult = envR2SecretAccessKeyResult()
if (!accessKeySecretResult.success) {
  console.error(accessKeySecretResult)
  process.exit(2)
}
const accessKeySecret = accessKeySecretResult.data

const bucketNameResult = envR2BucketNameResult()
if (!bucketNameResult.success) {
  console.error(bucketNameResult)
  process.exit(3)
}
const bucket = bucketNameResult.data

const accountIdResult = envR2AccountIdResult()
if (!accountIdResult.success) {
  console.error(accountIdResult)
  process.exit(4)
}
const accountId = accountIdResult.data

const s3 = new S3Client({
  endPoint: `https://${accountId}.r2.cloudflarestorage.com`,
  accessKey: accessKeyId,
  secretKey: accessKeySecret,
  region: "auto",
  bucket: bucket,
  pathStyle: true,
})

async function generateUploadUrl(customKey?: string) {
  const key = customKey ?? crypto.randomUUID()
  const url = await s3.getPresignedUrl("PUT", key, {
    expirySeconds: 3600,
  })
  return { key, url }
}

async function uploadFile(url: string, data: Uint8Array, contentType: string) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: new Blob([data.buffer as ArrayBuffer]),
  })
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }
}

async function downloadFile(url: string): Promise<{ data: Uint8Array; contentType: string }> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`)
  }
  const data = new Uint8Array(await response.arrayBuffer())
  const contentType = response.headers.get("content-type") ?? "application/octet-stream"
  return { data, contentType }
}

async function main() {
  console.log("Downloading test image...")
  const { data, contentType } = await downloadFile("https://picsum.photos/seed/picsum/200/300")
  console.log(`Downloaded: ${data.length} bytes, type: ${contentType}`)

  console.log("\nGenerating upload URL...")
  const { key, url } = await generateUploadUrl()
  console.log("Key:", key)
  console.log("URL:", url)

  console.log("\nUploading...")
  await uploadFile(url, data, contentType)
  console.log("Upload complete!")

  console.log("\nVerifying upload...")
  const uploaded = await s3.getObject(key)
  console.log("Uploaded file size:", (await uploaded.arrayBuffer()).byteLength, "bytes")
}

main()
