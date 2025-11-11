import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { IdOrgMember } from "@/org/member_convex/IdOrgMember"
import type { OrgMemberModel } from "@/org/member_model/OrgMemberModel"
import { OrgMemberForm } from "@/org/member_ui/form/OrgMemberForm"
import { orgMemberFormStateManagement } from "@/org/member_ui/form/orgMemberFormStateManagement"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import type { HasOrgMemberId } from "@/org/org_model/HasOrgMemberId"
import { ErrorPage } from "@/ui/pages/ErrorPage"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQuery } from "@/utils/convex/createQuery"
import { resultHasData } from "@/utils/result/resultHasData"
import { resultHasErrorMessage } from "@/utils/result/resultHasErrorMessage"
import { api } from "@convex/_generated/api"
import { Match, Switch } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgMemberMutateProps extends HasOrgHandle, HasOrgMemberId, HasFormModeMutate, MayHaveClass {}

export function OrgMemberMutate(p: OrgMemberMutateProps) {
  const getMember = createQuery(api.org.orgMemberGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
    memberId: p.memberId as IdOrgMember,
  })
  return (
    <Switch>
      <Match when={!getMember()}>
        <LoadingSection loadingSubject={ttt("Organization Member")} />
      </Match>
      <Match when={resultHasErrorMessage(getMember())}>{(errorMessage) => <ErrorPage title={errorMessage()} />}</Match>
      <Match when={resultHasData(getMember())}>
        {(getData) => (
          <OrgMemberMutateForm mode={p.mode} orgHandle={p.orgHandle} memberId={p.memberId} member={getData()} />
        )}
      </Match>
    </Switch>
  )
}

interface OrgMemberMutateFormProps extends OrgMemberMutateProps {
  member: OrgMemberModel
}

function OrgMemberMutateForm(p: OrgMemberMutateFormProps) {
  const sm = orgMemberFormStateManagement(p.mode, p.orgHandle, p.memberId as IdOrgMember, p.member)
  return <OrgMemberForm mode={p.mode} sm={sm} />
}
