import { afterEach, expect, mock, test } from "bun:test"
import { createRoot } from "solid-js"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"

mock.module("@tanstack/solid-router", () => ({
  useNavigate: () => async () => {},
  useParams: () => () => ({ orgHandle: "sample-org" }),
}))
afterEach(() => pageDemoFixtureStoreGet().clear())

test("org view demo state starts from shared member and invitation fixtures", async () => {
  const [{ orgDemoStateCreate }, { orgMemberDemoStateCreate }, { orgInvitationDemoStateCreate }] = await Promise.all([
    import("#src/org/org_ui/demo/orgDemoStateCreate.ts"),
    import("#src/org/member_ui/demo/orgMemberDemoStateCreate.ts"),
    import("#src/org/invitation_ui/demo/orgInvitationDemoStateCreate.ts"),
  ])
  let dispose = () => {}
  const state = createRoot((cleanup) => {
    dispose = cleanup
    return {
      org: orgDemoStateCreate(),
      members: orgMemberDemoStateCreate(),
      invitations: orgInvitationDemoStateCreate(),
    }
  })

  try {
    expect(state.org.members()).toEqual(state.members.members())
    expect(state.org.members()).toHaveLength(1)
    expect(state.invitations.invitations()).toHaveLength(1)
    expect(state.invitations.invitations()[0]).toMatchObject({
      orgHandle: "sample-org",
      invitationCode: "invite-1",
      invitedEmail: "alex@example.com",
    })
  } finally {
    dispose()
  }
})

test("org member card limits mailto links to the non-demo branch", async () => {
  const source = await Bun.file(new URL("../../member_ui/view/OrgMemberCard.tsx", import.meta.url)).text()
  expect(source).toContain("{p.demo ? (")
  expect(source).toContain('<span class="flex-1">{p.member.profile.email}</span>')
  expect(source).toMatch(/href=\{`mailto:\$\{p\.member\.profile\.email\}`\}/)
})
