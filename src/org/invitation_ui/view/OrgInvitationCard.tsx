import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrgInvitation } from "@/org/invitation_convex/IdOrgInvitation"
import { allowEmailResendingInSeconds } from "@/org/invitation_model/allowEmailResendingInSeconds"
import { orgInvitationShowRole } from "@/org/invitation_model/orgInvitationShowRole"
import { OrgInvitationStatusIcon } from "@/org/invitation_ui/view/OrgInvitationStatusIcon"
import { OrgInvitationStatusText } from "@/org/invitation_ui/view/OrgInvitationStatusText"
import { createAction } from "@/utils/convex/createAction"
import { createMutation } from "@/utils/convex/createMutation"
import { api } from "@convex/_generated/api"
import { mdiClose, mdiEmailAlert, mdiEmailFast } from "@mdi/js"
import { ttt, ttt1 } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { classArr } from "~ui/utils/classArr"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface OrgInvitationCardProps extends MayHaveClass {
  invitation: DocOrgInvitation
}

export function OrgInvitationCard(p: OrgInvitationCardProps) {
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
      <div class="flex justify-start gap-2">
        <Left {...p} />
        <Right {...p} />
      </div>
      <OrgInvitationActions {...p} />
    </section>
  )
}

function Left(p: OrgInvitationCardProps) {
  return (
    <div class="flex-1 flex flex-col justify-start gap-2">
      <h3 class="text-xl font-medium">{p.invitation.invitedEmail}</h3>

      {orgInvitationShowRole && (
        <div class="text-muted-foreground capitalize">
          <span>{ttt("Role:")}</span>
          {p.invitation.role}
        </div>
      )}

      <OrgInvitationStatusText invitation={p.invitation} />
    </div>
  )
}

function Right(p: OrgInvitationCardProps) {
  return (
    <div
      class={classArr(
        "size-14",
        "bg-gray-200 dark:bg-gray-600",
        "rounded-full",
        "flex flex-col justify-center items-center", // layout children
      )}
    >
      <OrgInvitationStatusIcon invitation={p.invitation} />
    </div>
  )
}

function OrgInvitationActions(p: OrgInvitationCardProps) {
  const resendAction = createAction(api.org.orgInvitationResendAction)
  const dismissAction = createMutation(api.org.orgInvitationDismissMutation)

  async function resendClick() {
    const allowResendingIn = allowEmailResendingInSeconds(
      p.invitation.emailSendAt || p.invitation.createdAt,
      p.invitation.emailSendAmount,
    )
    if (allowResendingIn > 0) {
      const title = ttt1("Allow resending in [X] seconds", allowResendingIn.toString())
      toastAdd({ title, icon: mdiEmailAlert, variant: toastVariant.error })
      return
    }

    const gotResult = await resendAction({ token: userTokenGet(), invitationCode: p.invitation.invitationCode })
    if (!gotResult.success) {
      const icon = mdiEmailAlert
      const title = gotResult.errorMessage
      toastAdd({ icon, title, variant: toastVariant.error })
    }
  }
  async function dismissClick() {
    const gotResult = await dismissAction({ token: userTokenGet(), invitationCode: p.invitation.invitationCode })
    if (!gotResult.success) {
      const icon = mdiEmailAlert
      const title = gotResult.errorMessage
      toastAdd({ icon, title, variant: toastVariant.error })
    }
  }
  return (
    <div class="flex flex-wrap gap-2">
      {!p.invitation.acceptedAt && (
        <ButtonIcon variant={buttonVariant.outline} icon={mdiEmailFast} onClick={resendClick} class="flex-1">
          {ttt("Resend")}
        </ButtonIcon>
      )}
      <ButtonIcon
        variant={buttonVariant.outline}
        icon={mdiClose}
        iconClass="fill-red-800 text-red-800 dark:fill-red-800 dark:text-red-800"
        onClick={dismissClick}
        class="flex-1"
      >
        {ttt("Remove")}
      </ButtonIcon>
    </div>
  )
}
