import { test } from "@rstest/playwright"
import { e2eBaseUrlGet } from "../config/e2eBaseUrlGet.ts"
import { e2eSsoSignIn } from "./e2eSsoSignIn.ts"

const baseUrl = e2eBaseUrlGet(process.env)

test("an SSO test user can sign in and reach the private overview", { timeout: 180_000 }, async ({ page }) => {
  await e2eSsoSignIn(page, baseUrl)
})
