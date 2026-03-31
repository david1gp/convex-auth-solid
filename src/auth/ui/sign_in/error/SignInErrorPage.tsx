import { ttc } from "#src/app/i18n/ttc.ts"
import { ContactSupportLinkButton } from "#src/ui/links/ContactSupportLinkButton.tsx"
import { GoSignInLinkButton } from "#src/ui/links/GoSignInLinkButton.tsx"
import { buttonSize, buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { Icon } from "#ui/static/icon/Icon.jsx"
import { classesPageWrapper } from "#ui/static/page/classesPageWrapper.ts"
import { classArr } from "#ui/utils/classArr.ts"
import { mdiAlertBoxOutline } from "@mdi/js"

const classesPageWrapperInner = classArr(
  "max-w-md w-full", // sizing
  "bg-white dark:bg-gray-800", // background
  "rounded-lg shadow-md", // styling
  "p-8", // spacing
)

export function SignInErrorPage() {
  const searchParams = new URLSearchParams(document.location.search)
  const errorMessage = searchParams.get("errorMessage")
  return (
    <div class={classArr(classesPageWrapper)}>
      <section id={"authenticationError"} class="flex flex-col gap-2">
        <Icon
          path={mdiAlertBoxOutline}
          class={classArr(
            "size-16 mx-auto", // sizing + layout
            "fill-red-500", // color
          )}
        />
        <h1 class={"text-2xl font-bold"}>{ttc("Authentication Error")}</h1>
      </section>
      <section id={"errorMessage"} class={classArr("flex flex-col gap-2 py-12")}>
        <h2 class={"text-lg text-foreground-muted"}>{"Error Message:"}</h2>
        <code class={classArr("text-xl", classesPageWrapperInner)}>{errorMessage}</code>
      </section>
      <section id={"tryAgain"} class="container max-w-7xl mx-auto text-center space-y-8">
        <h2>{ttc("Please try again, if the problem persists contact support")}</h2>
        <GoSignInLinkButton size={buttonSize.lg} variant={buttonVariant.link} class="text-xl" iconClass="size-8" />
        <ContactSupportLinkButton
          size={buttonSize.lg}
          variant={buttonVariant.link}
          class="text-xl"
          iconClass="size-8"
        />
      </section>
    </div>
  )
}
