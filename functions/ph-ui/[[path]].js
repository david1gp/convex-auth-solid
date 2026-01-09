export async function onRequest({ request }) {
  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/ph-ui/, "")
  const newUrl = new URL(path, "https://eu-assets.i.posthog.com")
  return fetch(newUrl, { cf: { cacheTtl: 86400 } })
}
