import { AuthSectionHeroIcon } from "#src/auth/ui/shared/AuthSectionHeroIcon.jsx"
import { classesCardWrapperP4 } from "#ui/static/card/classesCardWrapper.js"
import { classArr } from "#ui/utils/classArr.js"
import type { HasIcon } from "#ui/utils/HasIcon.js"
import type { HasSubtitle } from "#ui/utils/HasSubtitle.js"
import type { HasTitle } from "#ui/utils/HasTitle.js"
import type { MayHaveChildrenAndClass } from "#ui/utils/MayHaveChildrenAndClass.js"

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
