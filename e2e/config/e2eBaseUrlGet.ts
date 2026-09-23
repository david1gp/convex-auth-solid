export function e2eBaseUrlGet(environment: Record<string, string | undefined>): string {
  const baseUrl = environment.E2E_BASE_URL?.trim() || "http://localhost:3012"
  let url: URL

  try {
    url = new URL(baseUrl)
  } catch {
    throw new Error("E2E_BASE_URL must be an absolute HTTP(S) URL")
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("E2E_BASE_URL must use HTTP or HTTPS")
  }

  return url.toString().replace(/\/$/u, "")
}
