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
  process.exit(2)
}
const bucketName = bucketNameResult.data

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
  bucket: bucketName,
  pathStyle: true,
})

const key = "hello-s3lite.txt"
await s3.putObject(key, "Hello from s3-lite-client!")

const text = await s3.getObject(key)
console.log(text)

const objects: { key: string }[] = []
for await (const obj of s3.listObjects({ prefix: "hello" })) {
  objects.push({ key: obj.key })
}
console.log(objects)

await s3.deleteObject(key)
console.log("Deleted:", key)
