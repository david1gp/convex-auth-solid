import { ttc, ttc1 } from "@/app/i18n/ttc"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { allowEmailResendingInSeconds } from "@/org/invitation_model/allowEmailResendingInSeconds"
import type { OrgInvitationModel } from "@/org/invitation_model/OrgInvitationModel"
import { orgInvitationShowRole } from "@/org/invitation_model/orgInvitationShowRole"
import {
  invitationModelToStatus,
  orgInvitationStatusIcon,
  orgInvitationStatusText,
} from "@/org/invitation_ui/view/orgInvitationStatus"
import { DateView } from "@/ui/date/DateView"
import { createAction } from "@/utils/convex_client/createAction"
import { createMutation } from "@/utils/convex_client/createMutation"
import { api } from "@convex/_generated/api"
import { mdiClose, mdiEmailAlert, mdiEmailFast } from "@mdi/js"
import { Show } from "solid-js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { Icon } from "~ui/static/icon/Icon"
import { classArr } from "~ui/utils/classArr"
import { classMerge } from "~ui/utils/classMerge"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveClassAndChildren } from "~ui/utils/MayHaveClassAndChildren"

export interface OrgInvitationCardProps extends MayHaveClass {
  invitation: OrgInvitationModel
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
      <OrgInvitationStatusTextDetails invitation={p.invitation} />
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
          <span>{ttc("Role:")}</span>
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
  const resendAction = createAction(api.org.orgInvitation30ResendAction)
  const dismissAction = createMutation(api.org.orgInvitation60DismissMutation)

  async function resendClick() {
    const allowResendingIn = allowEmailResendingInSeconds(
      p.invitation.emailSendAt || p.invitation.createdAt,
      p.invitation.emailSendAmount,
    )
    if (allowResendingIn > 0) {
      const title = ttc1("Allow resending in [X] seconds", allowResendingIn.toString())
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
      <ButtonIcon variant={buttonVariant.outline} icon={mdiEmailFast} onClick={resendClick} class="flex-1">
        {ttc("Resend")}
      </ButtonIcon>
      <ButtonIcon
        variant={buttonVariant.outline}
        icon={mdiClose}
        iconClass="fill-red-800 text-red-800 dark:fill-red-800 dark:text-red-800"
        onClick={dismissClick}
        class="flex-1"
      >
        {ttc("Remove")}
      </ButtonIcon>
    </div>
  )
}

interface OrgInvitationStatusProps extends MayHaveClassAndChildren {
  invitation: OrgInvitationModel
}

function OrgInvitationStatusText(p: OrgInvitationStatusProps) {
  const status = invitationModelToStatus(p.invitation)
  return <span>{orgInvitationStatusText[status]}</span>
}

function OrgInvitationStatusTextDetails(p: OrgInvitationStatusProps) {
  return (
    <Show when={p.invitation.emailSendAt}>
      {(getDate) => (
        <DateView date={getDate()} start={<span class="text-muted-foreground mr-1">{ttc("Email send") + ":"}</span>} />
      )}
    </Show>
  )
}

interface OrgInvitationStatusIconProps extends MayHaveClass {
  invitation: OrgInvitationModel
}

function OrgInvitationStatusIcon(p: OrgInvitationStatusIconProps) {
  return (
    <Icon path={orgInvitationStatusIcon[invitationModelToStatus(p.invitation)]} class={classMerge("size-8", p.class)} />
  )
}
