import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"
import type { HasIcon } from "#ui/utils/HasIcon.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"

interface AuthSectionHeroIconProps extends HasIcon, MayHaveClass {}

export function AuthSectionHeroIcon(p: AuthSectionHeroIconProps) {
  return (
    <div
      class={classMerge(
        "flex justify-center items-center size-25 bg-gray-200 dark:bg-gray-700 rounded-full mb-4",
        p.class,
      )}
    >
      <Icon path={p.icon} class={classMerge("size-17", p.iconClass)} />
    </div>
  )
}
