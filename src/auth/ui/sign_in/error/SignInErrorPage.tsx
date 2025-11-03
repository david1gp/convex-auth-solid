import { ContactSupportLinkButton } from "@/ui/links/ContactSupportLinkButton"
import { GoSignInLinkButton } from "@/ui/links/GoSignInLinkButton"
import { mdiAlertBoxOutline } from "@mdi/js"
import { buttonSize, buttonVariant } from "~ui/interactive/button/buttonCva"
import { Icon1 } from "~ui/static/icon/Icon1"
import { classesPageWrapper } from "~ui/static/page/classesPageWrapper"
import { classArr } from "~ui/utils/classArr"

const classesPageWrapperInner = classArr(
  "max-w-md w-full", // sizing
  "bg-white dark:bg-gray-800", // background
  "rounded-lg shadow-md", // styling
  "p-8", // spacing
)

export function SignInErrorPage() {
  const title = "Authentication Error"
  const tryAgainText = "Try again, if the problem persists contact support"
  // const [searchParams] = useSearchParams()
  const searchParams = new URLSearchParams(document.location.search)
  const errorMessage = searchParams.get("errorMessage")
  return (
    <div class={classArr(classesPageWrapper)}>
      <section id={"authenticationError"} class="flex flex-col gap-2">
        <Icon1
          path={mdiAlertBoxOutline}
          class={classArr(
            "size-16 mx-auto", // sizing + layout
            "fill-red-500", // color
          )}
        />
        <h1 class={"text-2xl font-bold"}>{title}</h1>
      </section>
      <section id={"errorMessage"} class={classArr("flex flex-col gap-2 py-12")}>
        <h2 class={"text-lg text-foreground-muted"}>{"Error Message:"}</h2>
        <code class={classArr("text-xl", classesPageWrapperInner)}>{errorMessage}</code>
      </section>
      <section id={"tryAgain"} class="container max-w-7xl mx-auto text-center space-y-8">
        <h2>{tryAgainText}</h2>
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
