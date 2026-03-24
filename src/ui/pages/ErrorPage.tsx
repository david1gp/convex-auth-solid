import { ContactSupportLinkButton } from "#src/ui/links/ContactSupportLinkButton.jsx"
import { GoBackLinkButton } from "#src/ui/links/GoBackLinkButton.jsx"
import { GoHomeLinkButton } from "#src/ui/links/GoHomeLinkButton.jsx"
import styles from "#src/ui/loaders/AnimateFadeIn.module.css"
import { buttonSize, buttonVariant } from "#ui/interactive/button/buttonCva.js"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classMerge } from "#ui/utils/classMerge.js"
import type { HasTitle } from "#ui/utils/HasTitle.js"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.js"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.js"
import type { MayHaveIcon } from "#ui/utils/MayHaveIcon.js"
import type { MayHaveSubtitle } from "#ui/utils/MayHaveSubtitle.js"
import { mdiAlertBoxOutline } from "@mdi/js"

export interface ErrorPageProps extends HasTitle, MayHaveSubtitle, MayHaveIcon, MayHaveClass, MayHaveChildren {}

export function ErrorPage(p: ErrorPageProps) {
  return (
    <>
      <ErrorSection {...p} />
      <OptionsSection {...p} />
    </>
  )
}

function ErrorSection(p: ErrorPageProps) {
  return (
    <section id={"error"} class={classMerge("flex flex-col gap-2 my-20", styles.animateFadeIn2s, p.class)}>
      <Icon
        path={p.icon ?? mdiAlertBoxOutline}
        class={classMerge(
          "size-16 mx-auto", // sizing + layout
          "fill-red-500 dark:fill-red-600",
          // "fill-red-400 text-red-400 dark:fill-red-600 dark:text-red-600", // color
          p.iconClass,
        )}
      />
      <h1 class={"text-2xl font-semibold text-center my-5"}>{p.title}</h1>
      {p.subtitle && <p class="text-lg mt-10">{p.subtitle}</p>}
    </section>
  )
}

function OptionsSection(p: ErrorPageProps) {
  return (
    <section
      id={"options"}
      class={classMerge("container max-w-7xl mx-auto text-center space-y-8", styles.animateFadeIn2s, p.class)}
    >
      {/* <h2>{ttt("If the problem persists contact support")}</h2> */}
      <GoBackLinkButton size={buttonSize.lg} variant={buttonVariant.link} class="text-xl" iconClass="size-8" />
      <GoHomeLinkButton size={buttonSize.lg} variant={buttonVariant.link} class="text-xl" iconClass="size-8" />
      <ContactSupportLinkButton size={buttonSize.lg} variant={buttonVariant.link} class="text-xl" iconClass="size-8" />
    </section>
  )
}
