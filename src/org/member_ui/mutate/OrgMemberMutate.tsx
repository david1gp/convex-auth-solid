import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { DocOrgMember, IdOrgMember } from "@/org/member_convex/IdOrgMember"
import { OrgMemberForm } from "@/org/member_ui/form/OrgMemberForm"
import { orgMemberFormStateManagement } from "@/org/member_ui/form/orgMemberFormStateManagement"
import type { HasOrgHandle } from "@/org/org_model/HasOrgHandle"
import type { HasOrgMemberId } from "@/org/org_model/HasOrgMemberId"
import { LoadingSection } from "@/ui/pages/LoadingSection"
import { createQuery } from "@/utils/convex/createQuery"
import { api } from "@convex/_generated/api"
import { Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import type { HasFormModeMutate } from "~ui/input/form/formModeMutate"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

interface OrgMemberMutateProps extends HasOrgHandle, HasOrgMemberId, HasFormModeMutate, MayHaveClass {}

export function OrgMemberMutate(p: OrgMemberMutateProps) {
  const getMember = createQuery(api.org.orgMemberGetQuery, {
    token: userTokenGet(),
    orgHandle: p.orgHandle,
    memberId: p.memberId as IdOrgMember,
  }) as () => DocOrgMember | undefined
  return (
    <Show when={getMember()} fallback={<OrgMemberLoading />}>
      <OrgMemberMutateForm mode={p.mode} orgHandle={p.orgHandle} memberId={p.memberId} member={getMember()!} />
    </Show>
  )
}

interface OrgMemberMutateFormProps extends OrgMemberMutateProps {
  member: DocOrgMember
}

function OrgMemberLoading() {
  return <LoadingSection loadingSubject={ttt("Organization Member")} />
}

function OrgMemberMutateForm(p: OrgMemberMutateFormProps) {
  const sm = orgMemberFormStateManagement(p.mode, p.orgHandle, p.memberId as IdOrgMember, p.member)
  return <OrgMemberForm mode={p.mode} sm={sm} />
}
