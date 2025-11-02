import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { OrgInvitationListSection, type OrgInvitationsProps } from "@/org/invitation_ui/list/OrgInvitationListSection"
import { convexSystemFieldsCreateEmpty } from "@/utils/convex/HasConvexSystemFields"
import { createdAtUpdatedAtCreate } from "@/utils/convex/HasCreatedAtUpdatedAt"
import { PageWrapper } from "~ui/static/page/PageWrapper"

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
    role: "guest",
    invitedBy: "admin@example.com",
    emailSendAmount: 1,
    emailSendAt: "2025-11-01T00:10:00Z",
  },
  // Accepted status - accepted 1 hour ago
  {
    ...convexSystemFieldsCreateEmpty(),
    ...createdAtUpdatedAtCreate(),
    orgHandle: "example-org",
    invitationCode: "inv-accepted-001",
    invitedName: "Alice Johnson",
    invitedEmail: "alice@example.com",
    role: "member",
    invitedBy: "admin@example.com",
    emailSendAmount: 1,
    emailSendAt: "2025-11-01T23:00:00Z",
    acceptedAt: "2025-11-01T23:10:00Z",
  },
]
