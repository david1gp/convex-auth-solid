import { ttc } from "@/app/i18n/ttc"
import { Img } from "~ui/static/img/Img"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"

export interface ProfileSectionImageProps extends MayHaveClass {
  image?: string
  name: string
}

export function ProfileSectionImage(p: ProfileSectionImageProps) {
  return (
    <section id="image" class="flex flex-col items-center space-y-4">
      <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
        {p.image ? (
          <Img src={p.image} alt={ttc("Profile picture")} class="w-full h-full object-cover" />
        ) : (
          <div class="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span class="text-3xl font-bold text-gray-600 dark:text-gray-300">{p.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
    </section>
  )
}
