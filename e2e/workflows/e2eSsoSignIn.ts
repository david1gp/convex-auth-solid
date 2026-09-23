import { expect, type Page } from "@rstest/playwright"
import { e2eAuthCredentialsGet } from "../config/e2eAuthCredentialsGet.ts"

export async function e2eSsoSignIn(page: Page, baseUrl: string): Promise<void> {
  const credentials = e2eAuthCredentialsGet(process.env)
  const appOrigin = new URL(baseUrl).origin

  await page.goto(`${baseUrl}/sign-in`)
  const ssoLink = page.locator('a[href*="/oidc/start"]')
  await expect(ssoLink).toBeVisible({ timeout: 30_000 })
  await ssoLink.click()

  const username = page.getByRole("textbox", { name: /loginname|username|email/i })
  await expect(username).toBeVisible({ timeout: 60_000 })
  await username.fill(credentials.username)

  const nextButton = page.getByRole("button", { name: /next|continue|weiter/i })
  if (await nextButton.isVisible().catch(() => false)) await nextButton.click()

  const password = page.getByRole("textbox", { name: /password|passwort/i })
  await expect(password).toBeVisible({ timeout: 60_000 })
  await password.fill(credentials.password)
  await page.getByRole("button", { name: /next|continue|sign in|log in|weiter|anmelden/i }).click()

  await page.waitForURL((url) => url.origin === appOrigin, { timeout: 60_000 })
  await page.waitForURL((url) => url.pathname === "/overview", { timeout: 60_000 })
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText("This is a private page seen only to logged in users", { exact: true })).toBeVisible()
}
