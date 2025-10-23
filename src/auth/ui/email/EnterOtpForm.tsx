import { otpSchema } from "@/auth/model/emailSchema"
import { mdiEmailCheck } from "@mdi/js"
import { Show, createEffect } from "solid-js"
import * as v from "valibot"
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
  email: string
  actionFn: (otp: string, email: string) => Promise<void>
}

export function EnterOtpForm(p: EnterOtpFormProps) {
  const otp = createSignalObject("")
  const otpError = createSignalObject("")
  const isSubmitting = createSignalObject(false)

  const validateOtp = (value: string) => {
    const result = v.safeParse(otpSchema, value)
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
    const otpValue = otp.get()
    const valid = validateOtp(otpValue)
    if (!valid) return
    isSubmitting.set(true)
    try {
      await p.actionFn(otpValue, p.email)
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
          {p.sentMessage} <span class="font-medium">{p.email}</span>.
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
        disabled={isSubmitting.get() || otp.get().length !== 6}
        icon={mdiEmailCheck}
        variant={buttonVariant.primary}
        class="w-full"
      >
        {isSubmitting.get() ? "Verifying..." : p.buttonText}
      </ButtonIcon>
    </form>
  )
}
