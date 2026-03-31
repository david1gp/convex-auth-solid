import { api } from "#convex/_generated/api.js"
import { ttc } from "#src/app/i18n/ttc.ts"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { IdOrgMember } from "#src/org/member_convex/IdOrgMember.ts"
import type { OrgMemberModel } from "#src/org/member_model/OrgMemberModel.ts"
import { OrgMemberForm } from "#src/org/member_ui/form/OrgMemberForm.tsx"
import { orgMemberFormStateManagement } from "#src/org/member_ui/form/orgMemberFormStateManagement.ts"
import type { HasOrgHandle } from "#src/org/org_model_field/HasOrgHandle.ts"
import type { HasOrgMemberId } from "#src/org/org_model_field/HasOrgMemberId.ts"
import { ErrorPage } from "#src/ui/pages/ErrorPage.tsx"
import { LoadingSection } from "#src/ui/pages/LoadingSection.tsx"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import { resultHasData } from "#src/utils/result/resultHasData.ts"
import { resultHasErrorMessage } from "#src/utils/result/resultHasErrorMessage.ts"
import type { HasFormModeMutate } from "#ui/input/form/formModeMutate.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import { Match, Switch } from "solid-js"

interface OrgMemberMutateProps extends HasOrgHandle, HasOrgMemberId, HasFormModeMutate, MayHaveClass {}

export function OrgMemberMutate(p: OrgMemberMutateProps) {
  const getMember = createQuery(api.org.orgMemberGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
    memberId: p.memberId as IdOrgMember,
  })
  const member = (): OrgMemberModel | null => resultHasData(getMember()) as OrgMemberModel | null
  return (
    <Switch>
      <Match when={!getMember()}>
        <LoadingSection loadingSubject={ttc("Organization Member")} />
      </Match>
      <Match when={resultHasErrorMessage(getMember())}>{(errorMessage) => <ErrorPage title={errorMessage()} />}</Match>
      <Match when={member()}>
        <OrgMemberMutateForm mode={p.mode} orgHandle={p.orgHandle} memberId={p.memberId} member={member()!} />
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
