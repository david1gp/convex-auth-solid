import { expect, test } from "bun:test"
import { urlAuthAdmin } from "#src/auth/url/urlAuthProvider.ts"

test("the admin login URL uses the admin auth route", () => {
  const previousBaseUrl = process.env.PUBLIC_BASE_URL_API
  process.env.PUBLIC_BASE_URL_API = "https://api.example.test"
  try {
    const url = urlAuthAdmin("admin-user", "/signed-in")
    expect(url).toBe("https://api.example.test/api/auth/admin?code=admin-user&state=%2Fsigned-in")
  } finally {
    if (previousBaseUrl === undefined) delete process.env.PUBLIC_BASE_URL_API
    else process.env.PUBLIC_BASE_URL_API = previousBaseUrl
  }
})
