import { expect, type Page } from "@rstest/playwright"

export async function e2eSsoUsernameSubmit(
  page: Page,
  credentials: { username: string; password: string },
): Promise<void> {
  const username = page.getByRole("textbox", { name: /loginname|username|email/i })
  await expect(username).toBeVisible({ timeout: 60_000 })
  await username.fill(credentials.username)

  const nextButton = page.getByRole("button", { name: /next|continue|weiter/i })
  if (await nextButton.isVisible().catch(() => false)) await nextButton.click()
}
