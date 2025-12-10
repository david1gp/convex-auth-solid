import { AuthSectionHeroIcon } from "@/auth/ui/shared/AuthSectionHeroIcon"
import { classesCardWrapperP4 } from "~ui/static/container/classesCardWrapper"
import { classArr } from "~ui/utils/classArr"
import type { HasIcon } from "~ui/utils/HasIcon"
import type { HasSubtitle } from "~ui/utils/HasSubtitle"
import type { HasTitle } from "~ui/utils/HasTitle"
import type { MayHaveChildrenAndClass } from "~ui/utils/MayHaveChildrenAndClass"

export interface AuthSectionCardProps extends HasIcon, HasTitle, HasSubtitle, MayHaveChildrenAndClass {}

export function AuthSectionCard(p: AuthSectionCardProps) {
  return (
    <section class={classArr(classesCardWrapperP4, "flex flex-col items-center")}>
      <AuthSectionHeroIcon icon={p.icon} />
      <h2 class="text-xl font-semibold">{p.title}</h2>
      <p class="text-muted-foreground mb-4">{p.subtitle}</p>
      {p.children}
    </section>
  )
}
