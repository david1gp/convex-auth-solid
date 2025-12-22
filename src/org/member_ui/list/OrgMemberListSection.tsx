import type { OrgMemberProfile } from "@/org/member_model/OrgMemberProfile"
import { OrgMemberCard } from "@/org/member_ui/view/OrgMemberCard"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { orgPageSection } from "@/org/org_ui/view/orgPageSection"
import { PageHeader } from "@/ui/header/PageHeader"
import { For, Show } from "solid-js"
import { ttt } from "~ui/i18n/ttt"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

export interface OrgMemberListProps extends HasOrgHandle, MayHaveClass {
  members: OrgMemberProfile[]
}

export function OrgMemberListSection(p: OrgMemberListProps) {
  return (
    <section id={orgPageSection.members} class={classMerge("space-y-4", p.class)}>
      <Header {...p} />
      <Show when={p.members.length > 0} fallback={<NoOrgMembersText />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.members}>
            {(member) => <OrgMemberCard showActions={true} orgHandle={p.orgHandle} member={member} />}
          </For>
        </div>
      </Show>
    </section>
  )
}

function NoOrgMembersText() {
  return <p class="text-muted-foreground">No members yet</p>
}

function Header(p: OrgMemberListProps) {
  return (
    <PageHeader title={ttt("Organization Members")}>
      {/* <LinkButton href={urlOrgMemberAdd(p.org.orgHandle)} variant={buttonVariant.default} icon={formIcon.add}>
        {ttt("Add")}
      </LinkButton> */}
    </PageHeader>
  )
}
