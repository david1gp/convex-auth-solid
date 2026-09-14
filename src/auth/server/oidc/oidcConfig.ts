export type OidcConfig = {
  issuer: string
  clientId: string
  clientSecret?: string
  scopes: readonly string[]
}
