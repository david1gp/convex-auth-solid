import { ttc } from "#src/app/i18n/ttc.js"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { IdOrgMember } from "#src/org/member_convex/IdOrgMember.js"
import type { OrgMemberModel } from "#src/org/member_model/OrgMemberModel.js"
import { OrgMemberForm } from "#src/org/member_ui/form/OrgMemberForm.js"
import { orgMemberFormStateManagement } from "#src/org/member_ui/form/orgMemberFormStateManagement.js"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.js"
import type { HasOrgMemberId } from "#src/org/org_model_field/HasOrgMemberId.js"
import { ErrorPage } from "#src/ui/pages/ErrorPage.js"
import { LoadingSection } from "#src/ui/pages/LoadingSection.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
import { resultHasData } from "#src/utils/result/resultHasData.js"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.js"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate"
import type { MayHaveClass } from "#ui/utils/MayHaveClass"
import { api } from "@convex/_generated/api.js"
import { Match, Switch } from "solid-js"

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
        <LoadingSection loadingSubject={ttc("Organization Member")} />
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
