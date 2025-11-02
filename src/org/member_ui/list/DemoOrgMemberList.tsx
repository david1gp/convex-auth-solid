import { LayoutWrapperApp } from "@/app/layout/LayoutWrapperApp"
import type { OrgMemberProfile } from "@/org/member_model/OrgMemberProfile"
import type { OrgMemberListProps } from "@/org/member_ui/list/OrgMemberListSection"
import { OrgMemberListSection } from "@/org/member_ui/list/OrgMemberListSection"
import { convexSystemFieldsCreateEmpty } from "@/utils/convex/HasConvexSystemFields"
import { createdAtUpdatedAtCreate } from "@/utils/convex/HasCreatedAtUpdatedAt"
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
    ...convexSystemFieldsCreateEmpty(),
    ...createdAtUpdatedAtCreate(),
    orgId: "org-demo-123" as any,
    userId: "user-alice-456" as any,
    role: "member",
    invitedBy: "user-admin-789" as any,
    createdAt: "2025-11-01T10:00:00Z",
    profile: {
      userId: "user-alice-456" as any,
      name: "Alice Johnson",
      email: "alice@example.com",
      username: "alice",
      hasPw: true,
      role: "user" as any,
      createdAt: "2025-11-01T10:00:00Z",
    },
  },
  // Another member - created earlier
  {
    ...convexSystemFieldsCreateEmpty(),
    ...createdAtUpdatedAtCreate(),
    orgId: "org-demo-123" as any,
    userId: "user-bob-789" as any,
    role: "member",
    invitedBy: "user-alice-456" as any,
    createdAt: "2025-11-01T10:00:00Z",
    profile: {
      userId: "user-bob-789" as any,
      name: "Bob Smith",
      email: "bob@example.com",
      username: "bobsmith",
      hasPw: true,
      role: "user" as any,
      createdAt: "2025-10-30T15:30:00Z",
    },
  },
  // Guest member - created 2 days ago
  {
    ...convexSystemFieldsCreateEmpty(),
    ...createdAtUpdatedAtCreate(),
    orgId: "org-demo-123" as any,
    userId: "user-carol-101" as any,
    role: "guest",
    invitedBy: "user-alice-456" as any,
    createdAt: "2025-11-01T10:00:00Z",
    profile: {
      userId: "user-carol-101" as any,
      name: "Carol Williams",
      email: "super_carol_long_name@gmail.com",
      username: "carolw",
      hasPw: false,
      role: "user" as any,
      createdAt: "2025-10-31T09:15:00Z",
    },
  },
]
