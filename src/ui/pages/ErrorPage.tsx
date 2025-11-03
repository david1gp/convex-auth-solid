import { ContactSupportLinkButton } from "@/ui/links/ContactSupportLinkButton"
import { GoBackLinkButton } from "@/ui/links/GoBackLinkButton"
import { GoHomeLinkButton } from "@/ui/links/GoHomeLinkButton"
import { mdiAlertBoxOutline } from "@mdi/js"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { Icon1 } from "~ui/static/icon/Icon1"
import { classMerge } from "~ui/utils/classMerge"
import type { HasTitle } from "~ui/utils/HasTitle"
import type { MayHaveChildren } from "~ui/utils/MayHaveChildren"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveIcon } from "~ui/utils/MayHaveIcon"
import type { MayHaveSubtitle } from "~ui/utils/MayHaveSubtitle"

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
    <section id={"error"} class={classMerge("flex flex-col gap-2 my-20", p.class)}>
      <Icon1
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
    <section id={"options"} class={classMerge("container max-w-7xl mx-auto text-center space-y-8", p.class)}>
      {/* <h2>{ttt("If the problem persists contact support")}</h2> */}
      <GoBackLinkButton size={buttonSize.lg} variant={buttonVariant.link} class="text-xl" iconClass="size-8" />
      <GoHomeLinkButton size={buttonSize.lg} variant={buttonVariant.link} class="text-xl" iconClass="size-8" />
      <ContactSupportLinkButton size={buttonSize.lg} variant={buttonVariant.link} class="text-xl" iconClass="size-8" />
    </section>
  )
}
