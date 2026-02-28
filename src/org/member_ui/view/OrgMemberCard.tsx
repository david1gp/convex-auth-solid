import { ttc } from "@/app/i18n/ttc"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { orgInvitationShowRole } from "@/org/invitation_model/orgInvitationShowRole"
import type { OrgMemberProfile } from "@/org/member_model/OrgMemberProfile"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { DateView } from "@/ui/date/DateView"
import { ClipboardCopyButtonIcon } from "@/ui/links/ClipboardCopyButtonIcon"
import { createMutation } from "@/utils/convex_client/createMutation"
import { api } from "@convex/_generated/api"
import { mdiClose, mdiEmailOutline, mdiPencil } from "@mdi/js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface OrgMemberCardProps extends MayHaveClass, HasOrgHandle {
  member: OrgMemberProfile
  showActions: boolean
}

export function OrgMemberCard(p: OrgMemberCardProps) {
  return (
    <section
      class={classMerge(
        "p-4", // padding
        "border border-gray-200 dark:border-gray-500 rounded-lg ", // border
        "bg-gray-50 dark:bg-stone-800", // bg
        "flex flex-col justify-start gap-2", // layout children
        p.class,
      )}
    >
      <h3 class="text-xl font-medium">{p.member.profile.name}</h3>

      {p.member.profile.email && (
        <div class="flex flex-wrap gap-1">
          <LinkButton
            variant={buttonVariant.subtle}
            icon={mdiEmailOutline}
            href={"mailto:" + p.member.profile.email}
            class="flex-1 flex"
          >
            {p.member.profile.email}
          </LinkButton>
          <ClipboardCopyButtonIcon
            data={p.member.profile.email}
            copyText={ttc("Copy E-Mail to clipboard")}
            toastText={ttc("E-Mail copied")}
          />
        </div>
      )}

      {orgInvitationShowRole && (
        <div class="text-muted-foreground capitalize">
          <span>{ttc("Role:")}</span>
          {p.member.role}
        </div>
      )}
      {p.showActions && <OrgMemberActions {...p} />}

      <ShowTimes {...p} />
    </section>
  )
}

function ShowTimes(p: OrgMemberCardProps) {
  return (
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="font-medium text-muted-foreground">{ttc("Created at:")}</span>
        <DateView date={p.member.profile.createdAt} />
      </div>
      <div class="flex items-center gap-2">
        <span class="font-medium text-muted-foreground">{ttc("Joined at:")}</span>
        <DateView date={p.member.createdAt} />
      </div>
    </div>
  )
}

function OrgMemberActions(p: OrgMemberCardProps) {
  const editMutation = createMutation(api.org.orgMemberEditMutation)
  const deleteMutation = createMutation(api.org.orgMemberDeleteMutation)

  async function editClick() {
    const newRole = p.member.role === "member" ? "guest" : "member"
    const gotResult = await editMutation({
      token: userTokenGet(),
      orgHandle: p.orgHandle,
      memberId: p.member.memberId,
      role: newRole,
    })
    if (!gotResult.success) {
      const icon = mdiPencil
      const title = gotResult.errorMessage
      toastAdd({ icon, title, variant: toastVariant.error })
    }
  }

  async function deleteClick() {
    const gotResult = await deleteMutation({
      token: userTokenGet(),
      orgHandle: p.orgHandle,
      memberId: p.member.memberId,
    })
    if (!gotResult.success) {
      const icon = mdiClose
      const title = gotResult.errorMessage
      toastAdd({ icon, title, variant: toastVariant.error })
    }
  }

  return (
    <div class="flex flex-wrap gap-2">
      <ButtonIcon variant={buttonVariant.outline} icon={mdiPencil} onClick={editClick} class="flex-1">
        {ttc("Edit")}
      </ButtonIcon>
      <ButtonIcon
        variant={buttonVariant.outline}
        icon={mdiClose}
        iconClass="fill-red-800 text-red-800 dark:fill-red-800 dark:text-red-800"
        onClick={deleteClick}
        class="flex-1"
      >
        {ttc("Remove")}
      </ButtonIcon>
    </div>
  )
}
