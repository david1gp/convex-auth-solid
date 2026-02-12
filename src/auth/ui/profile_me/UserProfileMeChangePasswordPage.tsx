import { ttt } from "~ui/i18n/ttt"
import { LayoutWrapperConvex } from "@/app/layout/LayoutWrapperConvex"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { urlUserProfileMe } from "@/auth/url/pageRouteAuth"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { createMutation } from "@/utils/convex_client/createMutation"
import { navigateTo } from "@/utils/router/navigateTo"
import { api } from "@convex/_generated/api"
import { formMode } from "~ui/input/form/formMode"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classMerge } from "~ui/utils/classMerge"
import { profileMeFormFieldConfig } from "./profileMeFormFieldConfig"
import { createSignalObject, type SignalObject } from "./createStepUrlSignal"

export function UserProfileMeChangePasswordPage() {
  return (
    <LayoutWrapperConvex title={ttt("Change Password")}>
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
      <h1 class="text-3xl font-bold mb-4">{ttt("Change Password")}</h1>
      <ChangePasswordForm />
    </div>
  )
}

function ChangePasswordForm() {
  const currentPassword = createSignalObject("")
  const newPassword = createSignalObject("")
  const confirmPassword = createSignalObject("")
  const errors = {
    currentPassword: createSignalObject(""),
    newPassword: createSignalObject(""),
    confirmPassword: createSignalObject(""),
  } as const
  const isSubmitting = createSignalObject(false)

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form class="space-y-6" onSubmit={(e) => handleSubmit(e, { currentPassword, newPassword, confirmPassword, errors, isSubmitting })}>
        <FormFieldInput
          config={profileMeFormFieldConfig.currentPassword}
          value={currentPassword.get()}
          error={errors.currentPassword.get()}
          mode={formMode.edit}
          onInput={currentPassword.set}
          onBlur={currentPassword.set}
        />

        <FormFieldInput
          config={profileMeFormFieldConfig.newPassword}
          value={newPassword.get()}
          error={errors.newPassword.get()}
          mode={formMode.edit}
          onInput={newPassword.set}
          onBlur={newPassword.set}
        />

        <FormFieldInput
          config={profileMeFormFieldConfig.confirmPassword}
          value={confirmPassword.get()}
          error={errors.confirmPassword.get()}
          mode={formMode.edit}
          onInput={confirmPassword.set}
          onBlur={confirmPassword.set}
        />

        <SubmitButton isSubmitting={isSubmitting.get()} loadingText={ttt("Changing...")} text={ttt("Change Password")} />
      </form>
    </div>
  )
}

function handleSubmit(
  e: SubmitEvent,
  p: {
    currentPassword: SignalObject<string>
    newPassword: SignalObject<string>
    confirmPassword: SignalObject<string>
    errors: {
      currentPassword: SignalObject<string>
      newPassword: SignalObject<string>
      confirmPassword: SignalObject<string>
    }
    isSubmitting: SignalObject<boolean>
  },
) {
  e.preventDefault()

  if (p.isSubmitting.get()) return

  const currentPasswordValue = p.currentPassword.get()
  const newPasswordValue = p.newPassword.get()
  const confirmPasswordValue = p.confirmPassword.get()

  if (!currentPasswordValue) {
    p.errors.currentPassword.set("Current password is required")
  } else {
    p.errors.currentPassword.set("")
  }

  if (newPasswordValue.length < 12) {
    p.errors.newPassword.set("Password must be at least 12 characters")
  } else {
    p.errors.newPassword.set("")
  }

  if (newPasswordValue !== confirmPasswordValue) {
    p.errors.confirmPassword.set("Passwords do not match")
  } else {
    p.errors.confirmPassword.set("")
  }

  if (Object.values(p.errors).some((error) => error.get() !== "")) {
    toastAdd({
      title: ttt("Please fix the errors and try again"),
      variant: toastVariant.error,
    })
    return
  }

  p.isSubmitting.set(true)

  createMutation(api.auth.userPasswordChangeMutation)({
    currentPassword: currentPasswordValue,
    newPassword: newPasswordValue,
  } as any).then((result) => {
    if (result.success) {
      toastAdd({
        title: ttt("Password changed successfully!"),
        variant: toastVariant.success,
      })
      navigateTo(urlUserProfileMe())
    } else {
      toastAdd({
        title: ttt("Password Change Failed"),
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
