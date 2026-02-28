import { type Result, createResult, createResultError } from "~utils/result/Result"

export async function apiR2UploadFile(url: string, data: Uint8Array, contentType: string): Promise<Result<void>> {
  const op = "r2ClientUploadFile"

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: new Blob([data.buffer as ArrayBuffer]),
  })

  if (!response.ok) {
    return createResultError(op, `Upload failed: ${response.status} ${response.statusText}`)
  }

  return createResult(undefined)
}

export async function apiR2UploadFileWithProgress(
  url: string,
  file: File,
  onProgress?: (progress: { loaded: number; total: number }) => void,
): Promise<Result<void>> {
  const op = "r2ClientUploadFileWithProgress"

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        onProgress({ loaded: event.loaded, total: event.total })
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(createResult(undefined))
      } else {
        resolve(createResultError(op, `Failed to upload file: ${xhr.statusText}`))
      }
    }

    xhr.onerror = () => resolve(createResultError(op, "Failed to upload file"))
    xhr.send(file)
  })
}
