import { expect, type Page } from "@rstest/playwright"

export async function e2eSsoPasswordSubmit(
  page: Page,
  credentials: { username: string; password: string },
): Promise<void> {
  const password = page.getByRole("textbox", { name: /password|passwort/i })
  await expect(password).toBeVisible({ timeout: 60_000 })
  await password.fill(credentials.password)
  await page.getByRole("button", { name: /next|continue|sign in|log in|weiter|anmelden/i }).click()
}
