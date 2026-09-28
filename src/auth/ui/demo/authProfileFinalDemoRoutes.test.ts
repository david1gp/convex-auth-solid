import { expect, test } from "bun:test"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"

test("each final auth demo reuses its production view with isolated state and demo-only links", async () => {
  const renderer = await Bun.file(new URL("./AuthRemainingPageDemoRenderer.tsx", import.meta.url)).text()
  for (const [route, page, view, factory] of [
    [
      "/profile/change-password",
      "profile_me/UserProfileMeChangePasswordPage",
      "UserProfileMeChangePasswordView",
      "passwordStateCreate",
    ],
    [
      "/profile/change-email",
      "profile_me/UserProfileMeChangeEmailPage",
      "UserProfileMeChangeEmailView",
      "emailStateCreate",
    ],
    ["/profile/update-image", "profile_me/UserProfileMeImagePage", "UserProfileMeImageView", "imageStateCreate"],
    ["/profile/delete", "profile_me/UserProfileMeDeletePage", "UserProfileMeDeleteView", "deleteStateCreate"],
  ] as const) {
    const productionPage = await Bun.file(new URL(`../${page}.tsx`, import.meta.url)).text()
    expect(productionPage).toContain(`<${view}`)
    expect(renderer).toContain(`p.route === "${route}"`)
    expect(renderer).toContain(`<${view}`)
    expect(renderer).toContain(`stateFactory={state.profileFinal.${factory}}`)
    expect(pageDemoHref(route)).toStartWith("/demos/profile/")
  }
  const publicPage = await Bun.file(new URL("../profile/UserProfilePage.tsx", import.meta.url)).text()
  expect(publicPage).toContain("<UserProfileView profile={profile()} />")
  expect(renderer).toContain('p.route === "/u/:username"')
  expect(renderer).toContain("<UserProfileView profile={state.profileFinal.publicProfile()} />")
  expect(pageDemoHref("/u/:username")).toBe("/demos/u/sample-user")
  expect(renderer).not.toMatch(/UserProfileLoader|LayoutWrapperAuth|NavStatic|userSessionSignal|urlUserProfile|fetch\(/)
  const profilePage = await Bun.file(new URL("../profile_me/UserProfileMePage.tsx", import.meta.url)).text()
  expect(profilePage).toContain('component={p.demo ? Link : "a"}')
  expect(profilePage).toContain("href={state.hrefs().image} demo={!!p.hrefs}")
})
