import { language } from "#src/app/i18n/language.ts"
import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import type { DocOrgInvitation } from "#src/org/invitation_convex/IdOrgInvitation.ts"
import { OrgInvitationListSection, type OrgInvitationsProps } from "#src/org/invitation_ui/list/OrgInvitationListSection.tsx"
import { convexSystemFieldsCreateEmpty } from "#src/utils/convex_client/HasConvexSystemFields.ts"
import { createdAtUpdatedAtCreate } from "#src/utils/data/HasCreatedAtUpdatedAt.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function DemoOrgInvitationList() {
  const props: OrgInvitationsProps = {
    orgHandle: "demo-org",
    invitations,
  }

  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <OrgInvitationListSection {...props} />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

// Example invitations showing all 3 orgInvitationStatus with different times
const invitations: DocOrgInvitation[] = [
  // Sending email status - no email sent yet
  {
    ...convexSystemFieldsCreateEmpty(),
    ...createdAtUpdatedAtCreate(),
    orgHandle: "example-org",
    invitationCode: "inv-sending-003",
    invitedName: "Carol Williams",
    invitedEmail: "carol@example.com",
    l: language.en,
    role: "member",
    invitedBy: "admin@example.com",
    emailSendAmount: 0,
  },
  // Waiting for confirmation status - email sent 1 day ago
  {
    ...convexSystemFieldsCreateEmpty(),
    ...createdAtUpdatedAtCreate(),
    orgHandle: "example-org",
    invitationCode: "inv-waiting-002",
    invitedName: "Bob Smith",
    invitedEmail: "bob@example.com",
    l: language.en,
    role: "guest",
    invitedBy: "admin@example.com",
    emailSendAmount: 1,
    emailSendAt: "2025-11-01T00:10:00Z",
  },
]
