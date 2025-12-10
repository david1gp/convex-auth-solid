import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import type { OrgMemberProfile } from "@/org/member_model/OrgMemberProfile"
import type { OrgMemberListProps } from "@/org/member_ui/list/OrgMemberListSection"
import { OrgMemberListSection } from "@/org/member_ui/list/OrgMemberListSection"
import { createdAtUpdatedAtCreate } from "@/utils/data/HasCreatedAtUpdatedAt"
import { PageWrapper } from "~ui/static/page/PageWrapper"

export function DemoOrgMemberList() {
  const props: OrgMemberListProps = {
    orgHandle: "demo-org",
    members,
  }
  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <OrgMemberListSection {...props} />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

// Example members showing different roles with profile data
const members: OrgMemberProfile[] = [
  // Regular member - created recently
  {
    memberId: "id",
    orgHandle: "org-demo-123",
    userId: "user-alice-456",
    role: "member",
    invitedBy: "user-admin-789",
    profile: {
      userId: "user-alice-456",
      name: "Alice Johnson",
      email: "alice@example.com",
      username: "alice",
      role: "user",
      createdAt: "2025-11-01T10:00:00Z",
      updatedAt: "2025-11-01T10:00:00Z",
    },
    ...createdAtUpdatedAtCreate(),
    createdAt: "2025-11-01T10:00:00Z",
  },
  // Another member - created earlier
  {
    memberId: "a",
    orgHandle: "org-demo-123",
    userId: "user-bob-789",
    role: "member",
    invitedBy: "user-alice-456",
    profile: {
      userId: "user-bob-789",
      name: "Bob Smith",
      email: "bob@example.com",
      username: "bobsmith",
      role: "user",
      createdAt: "2025-10-30T15:30:00Z",
      updatedAt: "2025-10-30T15:30:00Z",
    },
    ...createdAtUpdatedAtCreate(),
    createdAt: "2025-11-01T10:00:00Z",
  },
  // Guest member - created 2 days ago
  {
    memberId: "aa",
    orgHandle: "org-demo-22",
    userId: "user-carol-101",
    role: "guest",
    invitedBy: "user-alice-456",
    profile: {
      userId: "user-carol-101",
      name: "Carol Williams",
      email: "super_carol_long_name@gmail.com",
      username: "carolw",
      role: "user",
      createdAt: "2025-10-31T09:15:00Z",
      updatedAt: "2025-10-31T09:15:00Z",
    },
    ...createdAtUpdatedAtCreate(),
    createdAt: "2025-11-01T10:00:00Z",
  },
]
