import { ttc } from "@/app/i18n/ttc"
import type { OrgMemberProfile } from "@/org/member_model/OrgMemberProfile"
import { OrgMemberCard } from "@/org/member_ui/view/OrgMemberCard"
import type { HasOrgHandle } from "@/org/org_model_field/HasOrgHandle"
import { orgPageSection } from "@/org/org_ui/view/orgPageSection"
import { SectionHeader } from "@/ui/header/SectionHeader"
import { mdiAccountMultiple } from "@mdi/js"
import { For, Show } from "solid-js"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"

export interface OrgMemberListProps extends HasOrgHandle, MayHaveClass {
  members: OrgMemberProfile[]
}

export function OrgMemberListSection(p: OrgMemberListProps) {
  const showMemberActionsNotImplemented = false
  return (
    <section id={orgPageSection.members} class={classMerge("space-y-1", "my-2", p.class)}>
      <Header {...p} />
      <Show when={p.members.length > 0} fallback={<NoOrgMembersText />}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.members}>
            {(member) => (
              <OrgMemberCard showActions={showMemberActionsNotImplemented} orgHandle={p.orgHandle} member={member} />
            )}
          </For>
        </div>
      </Show>
    </section>
  )
}

function Header(p: OrgMemberListProps) {
  return (
    <SectionHeader icon={mdiAccountMultiple} title={ttc("Organization Members")}>
      {/* <LinkButton href={urlOrgMemberAdd(p.org.orgHandle)} variant={buttonVariant.default} icon={formIcon.add}>
        {ttt("Add")}
      </LinkButton> */}
    </SectionHeader>
  )
}

function NoOrgMembersText() {
  return <p class="text-muted-foreground">{ttc("No members yet")}</p>
}
