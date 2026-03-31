import type { PageHeaderProps } from "#src/ui/header/PageHeader.tsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { LinkButton } from "#ui/interactive/link/LinkButton.jsx"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"

export interface SectionHeaderProps extends PageHeaderProps {
  icon: string
  href?: string
}

export function SectionHeader(p: SectionHeaderProps) {
  return (
    <div class={classMerge("flex flex-wrap items-center justify-between gap-4", p.class)}>
      <h2 class={classMerge("text-2xl font-semibold", p.titleClass)}>
        {p.href ? (
          <LinkButton href={p.href} icon={p.icon} variant={buttonVariant.link} class="pl-0">
            {p.title}
          </LinkButton>
        ) : (
          <div class="flex gap-1.5 items-center">
            {p.icon && <Icon path={p.icon} class={p.iconClass} />}
            <span>{p.title}</span>
          </div>
        )}
      </h2>
      {p.subtitle && <p class={classMerge("text-lg", p.subtitleClass)}>{p.subtitle}</p>}
      {p.children}
    </div>
  )
}
