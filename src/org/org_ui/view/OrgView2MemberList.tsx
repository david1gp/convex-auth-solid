import type { OrgMemberProfile } from "@/org/member_model/OrgMemberProfile"
import { For, Show } from "solid-js"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { orgPageSection } from "./orgPageSection"

export interface OrgMemberListProps extends MayHaveClass {
  members: OrgMemberProfile[]
}

export function OrgView2MemberList(p: OrgMemberListProps) {
  return (
    <section id={orgPageSection.members} class={classMerge("space-y-4", p.class)}>
      <h2 class="text-xl font-semibold">Members</h2>
      <Show when={p.members.length > 0} fallback={<p class="text-muted-foreground">No members yet</p>}>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={p.members}>{(member) => <OrgMember member={member} />}</For>
        </div>
      </Show>
    </section>
  )
}

interface OrgMemberProps extends MayHaveClass {
  member: OrgMemberProfile
}

function OrgMember(p: OrgMemberProps) {
  return (
    <div class={classMerge("flex items-center gap-3 p-4 border rounded-lg bg-card", p.class)}>
      <div class="flex-1">
        <div class="font-medium">{p.member.profile.name}</div>
        <div class="text-muted-foreground">{p.member.profile.email || "No email"}</div>
        <div class="text-muted-foreground capitalize">Role: {p.member.role}</div>
      </div>
    </div>
  )
}
