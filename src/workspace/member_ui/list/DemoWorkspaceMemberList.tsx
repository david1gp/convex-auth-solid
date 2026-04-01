import { LayoutWrapperApp } from "#src/app/layout/LayoutWrapperApp.tsx"
import type { WorkspaceMemberProfile } from "#src/workspace/member_model/WorkspaceMemberProfile.ts"
import type { WorkspaceMemberListProps } from "#src/workspace/member_ui/list/WorkspaceMemberListSection.tsx"
import { WorkspaceMemberListSection } from "#src/workspace/member_ui/list/WorkspaceMemberListSection.tsx"
import { createdAtUpdatedAtCreate } from "#src/utils/data/HasCreatedAtUpdatedAt.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"

export function DemoWorkspaceMemberList() {
  const props: WorkspaceMemberListProps = {
    workspaceHandle: "demo-workspace",
    members,
  }
  return (
    <LayoutWrapperApp>
      <PageWrapper>
        <WorkspaceMemberListSection {...props} />
      </PageWrapper>
    </LayoutWrapperApp>
  )
}

const members: WorkspaceMemberProfile[] = [
  {
    memberId: "id",
    workspaceHandle: "workspace-demo-123",
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
  {
    memberId: "a",
    workspaceHandle: "workspace-demo-123",
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
  {
    memberId: "aa",
    workspaceHandle: "workspace-demo-22",
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