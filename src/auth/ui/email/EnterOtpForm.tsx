import { otpSchema } from "@/auth/model_field/otpSchema"
import { urlSignInRedirectUrl } from "@/auth/url/urlSignInRedirectUrl"
import { createUrl } from "@/utils/router/createUrl"
import { searchParamGet } from "@/utils/router/searchParamGet"
import { mdiEmailCheck } from "@mdi/js"
import { Show, createEffect, onMount } from "solid-js"
import * as a from "valibot"
import { ttt } from "~ui/i18n/ttt"
import { Label } from "~ui/input/label/Label"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import { createSignalObject } from "~ui/utils/createSignalObject"
import { OtpInput6Numbers } from "./OtpInput6Numbers"

interface EnterOtpFormProps extends MayHaveClass {
  title: string
  subtitle: string
  sentMessage: string
  instruction: string
  buttonText: string
  actionFn: (otp: string, email: string, returnPath: string) => Promise<void>
}

export function EnterOtpForm(p: EnterOtpFormProps) {
  const otpError = createSignalObject("")
  const isSubmitting = createSignalObject(false)

  let url: URL | null = null
  const otp = createSignalObject("")
  const email = createSignalObject("")

  onMount(() => {
    url = createUrl()
    const emailParam = searchParamGet("email", url)
    if (emailParam) {
      email.set(emailParam)
    }
    const codeParam = searchParamGet("code", url) ?? ""
    if (codeParam) {
      otp.set(codeParam)
    }
  })
  function getReturnPath() {
    if (!url) return ""
    return searchParamGet("returnPath", url) || urlSignInRedirectUrl()
  }

  const validateOtp = (value: string) => {
    const result = a.safeParse(otpSchema, value)
    if (result.success) {
      otpError.set("")
      return true
    } else {
      const message = result.issues[0]?.message || "Invalid code"
      otpError.set(message)
      return false
    }
  }

  createEffect(() => {
    const value = otp.get()
    if (value.length === 6) {
      validateOtp(value)
    } else {
      otpError.set("")
    }
  })

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    if (isSubmitting.get()) {
      const title = ttt("Submission in progress, please wait")
      console.info(title)
      return
    }
    const otpValue = otp.get()
    const valid = validateOtp(otpValue)
    if (!valid) return
    isSubmitting.set(true)
    try {
      await p.actionFn(otpValue, email.get(), getReturnPath())
    } catch (error) {
      console.error("Email confirmation failed:", error)
      otpError.set("Verification failed. Please try again.")
    } finally {
      isSubmitting.set(false)
    }
  }

  const otpInputId = "otp-input"

  return (
    <form onSubmit={handleSubmit} autocomplete="off" class={classMerge("flex flex-col gap-2", p.class)}>
      <div class="flex flex-col gap-2 mb-2">
        <h1 class="text-2xl font-bold text-foreground">{p.title}</h1>
        <p class="text-muted-foreground">{p.subtitle}</p>
        <p class="text-muted-foreground">
          {p.sentMessage} <span class="font-medium">{email.get()}</span>.
        </p>
        <p class="text-muted-foreground">{p.instruction}</p>
      </div>
      <div class="flex flex-col gap-2">
        <Label for={otpInputId}>{ttt("Verification Code")}</Label>
        <OtpInput6Numbers id={otpInputId} valueSignal={otp} error={!!otpError.get()} />
        <Show when={otpError.get()}>
          <p class="text-sm text-red-500">{otpError.get()}</p>
        </Show>
      </div>
      <ButtonIcon
        type="submit"
        variant={buttonVariant.primary}
        icon={mdiEmailCheck}
        disabled={otp.get().length !== 6}
        isLoading={isSubmitting.get()}
        class="w-full"
      >
        {isSubmitting.get() ? "Verifying..." : p.buttonText}
      </ButtonIcon>
    </form>
  )
}
