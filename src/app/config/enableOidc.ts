export function enableOidc(): boolean {
  return process.env.PUBLIC_OIDC_ENABLED === "true"
}
