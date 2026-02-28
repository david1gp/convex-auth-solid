import { languageSignalGet } from "@/app/i18n/languageSignal"
import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavUserProfile } from "@/app/nav/NavUserProfile"
import { requiredPasswordLength } from "@/auth/model_field/passwordSchema"
import { createSignalObject, createStepUrlSignal, type SignalObject } from "@/auth/ui/profile_me/createStepUrlSignal"
import { profileMeFormFieldConfig } from "@/auth/ui/profile_me/profileMeFormFieldConfig"
import { signInSessionNew } from "@/auth/ui/sign_in/logic/signInSessionNew"
import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { urlUserProfileMe, urlUserProfileMeChangePassword } from "@/auth/url/pageRouteAuth"
import { FormFieldInput } from "@/ui/form/FormFieldInput"
import { createAction } from "@/utils/convex_client/createAction"
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

export function UserProfileMeChangePasswordPage() {
  return (
    <LayoutWrapperAuth>
      <PageWrapper>
        <NavUserProfile
          childrenLeft={
            <>
              <NavBreadcrumbSeparator />
              <NavLinkButton href={urlUserProfileMe()} isActive={false}>
                {ttc("My Profile")}
              </NavLinkButton>
              <NavBreadcrumbSeparator />
              <NavLinkButton href={urlUserProfileMeChangePassword()} isActive={true}>
                {ttc("Change Password")}
              </NavLinkButton>
            </>
          }
        />
        <PageContent />
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}

function PageContent() {
  return (
    <div
      class={classMerge(
        "max-w-xl mx-auto", // layout & sizing
      )}
    >
      <h1 class="text-3xl font-bold mb-4">{ttc("Change Password")}</h1>

      <ChangePasswordForm />
    </div>
  )
}

function ChangePasswordForm() {
  const currentStep = createStepUrlSignal("step", 1)
  const confirmationCode = createSignalObject("")
  const newPassword = createSignalObject("")
  const errors = {
    confirmationCode: createSignalObject(""),
    newPassword: createSignalObject(""),
  } as const
  const isSubmitting = createSignalObject(false)

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <Show when={currentStep.get() === 1}>
        <PasswordChangeStep1Form isSubmitting={isSubmitting} currentStep={currentStep} />
      </Show>

      <Show when={currentStep.get() === 2}>
        <PasswordChangeStep2Form
          confirmationCode={confirmationCode}
          newPassword={newPassword}
          errors={errors}
          isSubmitting={isSubmitting}
          currentStep={currentStep}
        />
      </Show>
    </div>
  )
}

function PasswordChangeStep1Form(p: { isSubmitting: SignalObject<boolean>; currentStep: SignalObject<number> }) {
  const passwordChangeRequestAction = createAction(api.auth.userPasswordChange1RequestAction)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    if (p.isSubmitting.get()) return

    p.isSubmitting.set(true)

    const result = await passwordChangeRequestAction({
      token: userTokenGet(),
      l: languageSignalGet(),
    })

    if (result.success) {
      toastAdd({
        title: ttc("Verification code sent"),
        variant: toastVariant.success,
      })
      p.currentStep.set(2)
    } else {
      toastAdd({
        title: ttc("Password Change Request Failed"),
        variant: toastVariant.error,
      })
    }

    p.isSubmitting.set(false)
  }

  return (
    <form class="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 class="text-xl font-semibold mb-2">{ttc("Step 1: Send Verification Code")}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {ttc("We'll send a verification code to your email address.")}
        </p>
      </div>

      <SubmitButton
        isSubmitting={p.isSubmitting.get()}
        loadingText={ttc("Sending...")}
        text={ttc("Send Code to my email")}
      />
    </form>
  )
}

function PasswordChangeStep2Form(p: {
  confirmationCode: SignalObject<string>
  newPassword: SignalObject<string>
  errors: {
    confirmationCode: SignalObject<string>
    newPassword: SignalObject<string>
  }
  isSubmitting: SignalObject<boolean>
  currentStep: SignalObject<number>
}) {
  const validatePassword = (password: string): boolean => {
    return password.length >= requiredPasswordLength
  }

  const passwordChangeConfirmMutation = createMutation(api.auth.userPasswordChange2ConfirmMutation)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    if (p.isSubmitting.get()) return

    const confirmationCodeValue = p.confirmationCode.get()
    const newPasswordValue = p.newPassword.get()

    if (!confirmationCodeValue || confirmationCodeValue.length !== 6) {
      p.errors.confirmationCode.set("Please enter a valid 6-digit confirmation code")
    } else {
      p.errors.confirmationCode.set("")
    }

    if (!validatePassword(newPasswordValue)) {
      p.errors.newPassword.set("Password must be at least 12 characters")
    } else {
      p.errors.newPassword.set("")
    }

    if (Object.values(p.errors).some((error) => error.get() !== "")) {
      toastAdd({
        title: ttc("Please fix the errors and try again"),
        variant: toastVariant.error,
      })
      return
    }

    p.isSubmitting.set(true)

    const result = await passwordChangeConfirmMutation({
      token: userTokenGet(),
      confirmationCode: confirmationCodeValue,
      newPassword: newPasswordValue,
    })

    if (result.success) {
      toastAdd({
        title: ttc("Password changed successfully!"),
        variant: toastVariant.success,
      })
      const userSession = result.data
      signInSessionNew(userSession)

      navigateTo(urlUserProfileMe())
    } else {
      toastAdd({
        title: ttc("Password Change Confirmation Failed"),
        variant: toastVariant.error,
      })
    }

    p.isSubmitting.set(false)
  }

  return (
    <form class="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 class="text-xl font-semibold mb-2">{ttc("Step 2: Enter Confirmation Code")}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {ttc("Enter the 6-digit code from your email and your new password.")}
        </p>
      </div>

      <FormFieldInput
        config={profileMeFormFieldConfig.confirmationCode}
        value={p.confirmationCode.get()}
        error={p.errors.confirmationCode.get()}
        mode={formMode.edit}
        onInput={p.confirmationCode.set}
        onBlur={p.confirmationCode.set}
      />

      <FormFieldInput
        config={profileMeFormFieldConfig.newPassword}
        value={p.newPassword.get()}
        error={p.errors.newPassword.get()}
        mode={formMode.edit}
        onInput={p.newPassword.set}
        onBlur={p.newPassword.set}
      />

      <div class="space-y-3">
        <SubmitButton
          isSubmitting={p.isSubmitting.get()}
          loadingText={ttc("Confirming...")}
          text={ttc("Change Password")}
        />

        <BackButton currentStep={p.currentStep} />
      </div>
    </form>
  )
}

function SubmitButton(p: { isSubmitting: boolean; loadingText: string; text: string }) {
  return (
    <Button type="submit" variant={buttonVariant.primary} disabled={p.isSubmitting} class="w-full">
      {p.isSubmitting ? p.loadingText : p.text}
    </Button>
  )
}

function BackButton(p: { currentStep: SignalObject<number> }) {
  return (
    <Button variant={buttonVariant.outline} onClick={() => p.currentStep.set(1)} class="w-full">
      {ttc("Back")}
    </Button>
  )
}
