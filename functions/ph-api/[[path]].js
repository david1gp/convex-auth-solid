export async function onRequest({ request }) {
  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/ph-api/, "")
  const newUrl = new URL(path, "https://eu.i.posthog.com")
  newUrl.search = url.search
  return fetch(newUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
}
