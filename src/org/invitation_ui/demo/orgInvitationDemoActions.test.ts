import { afterEach, expect, test } from "bun:test"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import { pageDemoHref } from "#src/app/demos/pageDemoHref.ts"
import { language } from "#src/app/i18n/language.ts"
import { orgInvitationDemoAccept } from "#src/org/invitation_ui/demo/orgInvitationDemoAccept.ts"
import { orgInvitationDemoAdd } from "#src/org/invitation_ui/demo/orgInvitationDemoAdd.ts"
import { orgInvitationDemoFixturesGet } from "#src/org/invitation_ui/demo/orgInvitationDemoFixturesGet.ts"

afterEach(() => pageDemoFixtureStoreGet().clear())

test("invitation list, add and accept links stay inside the gallery", () => {
  expect(pageDemoHref("/org/:orgHandle/invitations", { orgHandle: "team" })).toBe("/demos/org/team/invitations")
  expect(pageDemoHref("/org/:orgHandle/invitations/add", { orgHandle: "team" })).toBe("/demos/org/team/invitations/add")
  expect(
    pageDemoHref("/org/:orgHandle/invitations/:invitationCode/accept", {
      orgHandle: "team",
      invitationCode: "invite-2",
    }),
  ).toBe("/demos/org/team/invitations/invite-2/accept")
})

test("adding a local invitation keeps earlier invitations, creates unique codes, and sends no email", () => {
  const initial = orgInvitationDemoFixturesGet("sample-org")
  const data = { invitedName: "Taylor", invitedEmail: "taylor@example.com", l: language.en, role: "guest" as const }
  const added = orgInvitationDemoAdd(initial, "sample-org", data)
  const twice = orgInvitationDemoAdd(added, "sample-org", data)
  expect(initial).toHaveLength(1)
  expect(added[1]).toMatchObject({ ...data, orgHandle: "sample-org", invitationCode: "invite-2", emailSendAmount: 0 })
  expect(added[1]?.emailSendAt).toBeUndefined()
  expect(twice[2]?.invitationCode).toBe("invite-3")
})

test("accepting changes only the selected organization's pending invitation fixtures", () => {
  const first = orgInvitationDemoFixturesGet("sample-org")
  const other = orgInvitationDemoFixturesGet("other-org")
  const updated = orgInvitationDemoAccept(first, "invite-1")
  pageDemoFixtureStoreGet().set("page-demo:org-invitations:sample-org", updated)
  expect(orgInvitationDemoFixturesGet("sample-org")).toEqual([])
  expect(orgInvitationDemoFixturesGet("other-org")).toEqual(other)
  expect(orgInvitationDemoAccept(other, "unknown")).toEqual(other)
})
