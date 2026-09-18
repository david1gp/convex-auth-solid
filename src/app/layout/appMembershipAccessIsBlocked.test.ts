import { expect, test } from "bun:test"
import { appMembershipAccessIsBlocked } from "#src/app/layout/appMembershipAccessIsBlocked.ts"
import type { UserSession } from "#src/auth/model/UserSession.ts"

const unaffiliatedSession = {
  token: "session-token",
  profile: {
    userId: "user-id",
    name: "Invited User",
    role: "user",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  hasPw: false,
  signedInMethod: "email",
  signedInAt: "2026-01-01T00:00:00.000Z",
  expiresAt: "2027-01-01T00:00:00.000Z",
} satisfies UserSession

test("an authenticated unaffiliated user can reach an organization invitation acceptance page", () => {
  expect(appMembershipAccessIsBlocked(unaffiliatedSession, "/org/acme/invitations/invitation-code/accept")).toBe(false)
})

test("an authenticated unaffiliated user can reach a workspace invitation acceptance page", () => {
  expect(appMembershipAccessIsBlocked(unaffiliatedSession, "/invite/invitation-code/accept")).toBe(false)
})

test("an unauthenticated user cannot bypass auth on an invitation acceptance page", () => {
  expect(appMembershipAccessIsBlocked(null, "/invite/invitation-code/accept")).toBe(true)
})

test("an authenticated unaffiliated user is denied protected application routes", () => {
  expect(appMembershipAccessIsBlocked(unaffiliatedSession, "/org/acme/invitations")).toBe(true)
})
