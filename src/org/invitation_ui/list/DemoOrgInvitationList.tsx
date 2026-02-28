import { language } from "@/app/i18n/language"
import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { OrgInvitationListSection, type OrgInvitationsProps } from "@/org/invitation_ui/list/OrgInvitationListSection"
import { convexSystemFieldsCreateEmpty } from "@/utils/convex_client/HasConvexSystemFields"
import { createdAtUpdatedAtCreate } from "@/utils/data/HasCreatedAtUpdatedAt"
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
