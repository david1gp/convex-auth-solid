import { ttt } from "~ui/i18n/ttt"
import { LayoutWrapperConvex } from "@/app/layout/LayoutWrapperConvex"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { urlUserProfileMe } from "@/auth/url/pageRouteAuth"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { createMutation } from "@/utils/convex_client/createMutation"
import { navigateTo } from "@/utils/router/navigateTo"
import { api } from "@convex/_generated/api"
import { Show } from "solid-js"
import { formMode } from "~ui/input/form/formMode"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classMerge } from "~ui/utils/classMerge"
import { profileMeFormFieldConfig } from "./profileMeFormFieldConfig"
import { createSignalObject, type SignalObject } from "./createStepUrlSignal"
import { userSessionGet } from "@/auth/ui/signals/userSessionSignal"

export function UserProfileMeChangeEmailPage() {
  return (
    <LayoutWrapperConvex title={ttt("Change Email")}>
      <PageWrapper>
        <NavBreadcrumbSeparator />
        <NavLinkButton href={urlUserProfileMe()} isActive={false}>
          {ttt("My Profile")}
        </NavLinkButton>
        <NavBreadcrumbSeparator />
        <PageContent />
      </PageWrapper>
    </LayoutWrapperConvex>
  )
}

function PageContent() {
  return (
    <div class={classMerge("max-w-xl mx-auto")}>
      <h1 class="text-3xl font-bold mb-4">{ttt("Change Email")}</h1>
      <ChangeEmailForm />
    </div>
  )
}

function ChangeEmailForm() {
  const userSession = userSessionGet()
  const userHasPassword = userSession.hasPw

  const currentPassword = createSignalObject("")
  const newEmail = createSignalObject("")
  const errors = {
    currentPassword: createSignalObject(""),
    newEmail: createSignalObject(""),
  } as const
  const isSubmitting = createSignalObject(false)

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form class="space-y-6" onSubmit={(e) => handleSubmit(e, { userHasPassword, currentPassword, newEmail, errors, isSubmitting })}>
        <Show when={userHasPassword}>
          <FormFieldInput
            config={profileMeFormFieldConfig.currentPassword}
            value={currentPassword.get()}
            error={errors.currentPassword.get()}
            mode={formMode.edit}
            onInput={currentPassword.set}
            onBlur={currentPassword.set}
          />
        </Show>

        <FormFieldInput
          config={profileMeFormFieldConfig.newEmail}
          value={newEmail.get()}
          error={errors.newEmail.get()}
          mode={formMode.edit}
          onInput={newEmail.set}
          onBlur={newEmail.set}
        />

        <SubmitButton isSubmitting={isSubmitting.get()} loadingText={ttt("Changing...")} text={ttt("Change Email")} />
      </form>
    </div>
  )
}

function handleSubmit(
  e: SubmitEvent,
  p: {
    userHasPassword: boolean
    currentPassword: SignalObject<string>
    newEmail: SignalObject<string>
    errors: {
      currentPassword: SignalObject<string>
      newEmail: SignalObject<string>
    }
    isSubmitting: SignalObject<boolean>
  },
) {
  e.preventDefault()

  if (p.isSubmitting.get()) return

  const currentPasswordValue = p.currentPassword.get()
  const newEmailValue = p.newEmail.get().trim()

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  if (p.userHasPassword && !currentPasswordValue) {
    p.errors.currentPassword.set("Current password is required")
  } else {
    p.errors.currentPassword.set("")
  }

  if (!newEmailValue) {
    p.errors.newEmail.set("New email is required")
  } else if (!validateEmail(newEmailValue)) {
    p.errors.newEmail.set("Please enter a valid email address")
  } else {
    p.errors.newEmail.set("")
  }

  if (Object.values(p.errors).some((error) => error.get() !== "")) {
    toastAdd({
      title: ttt("Please fix the errors and try again"),
      variant: toastVariant.error,
    })
    return
  }

  p.isSubmitting.set(true)

  createMutation(api.auth.userEmailChangeMutation)({
    currentPassword: p.userHasPassword ? currentPasswordValue : undefined,
    newEmail: newEmailValue,
  } as any).then((result) => {
    if (result.success) {
      toastAdd({
        title: ttt("Email changed successfully!"),
        variant: toastVariant.success,
      })
      navigateTo(urlUserProfileMe())
    } else {
      toastAdd({
        title: ttt("Email Change Failed"),
        description: result.errorMessage,
        variant: toastVariant.error,
      })
    }
    p.isSubmitting.set(false)
  })
}

function SubmitButton(p: { isSubmitting: boolean; loadingText: string; text: string }) {
  return (
    <Button type="submit" variant={buttonVariant.primary} disabled={p.isSubmitting} class="w-full">
      {p.isSubmitting ? p.loadingText : p.text}
    </Button>
  )
}
