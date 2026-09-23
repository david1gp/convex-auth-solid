import { execFileSync } from "node:child_process"

type E2eCredentialCommandRun = (args: string[]) => string

const e2eCredentialCommandRun: E2eCredentialCommandRun = (args) =>
  execFileSync("zitadel-cli", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  })

export function e2eAuthCredentialsGet(
  environment: Record<string, string | undefined>,
  credentialCommandRun: E2eCredentialCommandRun = e2eCredentialCommandRun,
): { username: string; password: string } {
  const username = environment.E2E_AUTH_USERNAME?.trim()
  const password = environment.E2E_AUTH_PASSWORD

  if (username && password) return { username, password }
  if (username || password) {
    throw new Error("Set both E2E_AUTH_USERNAME and E2E_AUTH_PASSWORD, or set neither to use zitadel-cli")
  }

  try {
    const args = ["credentials", "get", "testuser", "--profile", "contentoren", "--field"]
    const resolvedUsername = credentialCommandRun([...args, "username"]).trim()
    const resolvedPassword = credentialCommandRun([...args, "password"]).trim()
    if (!resolvedUsername || !resolvedPassword) throw new Error("Zitadel CLI returned empty credentials")
    return { username: resolvedUsername, password: resolvedPassword }
  } catch {
    throw new Error(
      "Unable to resolve ssotest credentials; set both E2E_AUTH_USERNAME and E2E_AUTH_PASSWORD or configure zitadel-cli",
    )
  }
}
