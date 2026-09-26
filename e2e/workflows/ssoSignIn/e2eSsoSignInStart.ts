import { expect, type Page } from "@rstest/playwright"

export async function e2eSsoSignInStart(page: Page, baseUrl: string): Promise<void> {
  await page.goto(`${baseUrl}/sign-in`)
  const ssoLink = page.locator('a[href*="/oidc/start"]')
  await expect(ssoLink).toBeVisible({ timeout: 30_000 })
  await ssoLink.click()
}
