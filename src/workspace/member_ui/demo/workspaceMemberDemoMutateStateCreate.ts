import type { IdWorkspaceMember } from "#src/workspace/member_convex/IdWorkspaceMember.ts"
import { workspaceMemberDemoStateCreate } from "#src/workspace/member_ui/demo/workspaceMemberDemoStateCreate.ts"
import { workspaceMemberFormStateManagement } from "#src/workspace/member_ui/form/workspaceMemberFormStateManagement.ts"
import { formMode } from "#ui/input/form/formMode.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

export function workspaceMemberDemoMutateStateCreate(
  mode: typeof formMode.edit | typeof formMode.remove,
  workspaceHandle?: () => string,
  memberId?: () => string,
) {
  const fixture = workspaceMemberDemoStateCreate(workspaceHandle, memberId)
  const selected = fixture.member()
  const saved = createSignalObject(false)
  const form = workspaceMemberFormStateManagement(
    mode,
    fixture.handle(),
    selected?.memberId as IdWorkspaceMember | undefined,
    selected,
    mode === formMode.edit
      ? {
          edit: async ({ role }) => {
            if (!selected || fixture.member()?.memberId !== selected.memberId) return
            fixture.editMember(selected.memberId, role)
            saved.set(true)
          },
        }
      : {
          remove: async () => {
            if (!selected || fixture.member()?.memberId !== selected.memberId) return
            fixture.removeMember(selected.memberId)
            saved.set(true)
          },
        },
  )

  return {
    member: fixture.member,
    form,
    saved: saved.get,
    listHref: fixture.listHref,
    editHref: () => fixture.editHref(selected?.memberId ?? ""),
    deleteHref: () => fixture.deleteHref(selected?.memberId ?? ""),
  }
}
