import { languageSignalGet } from "@/app/i18n/languageSignal"
import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavUserProfile } from "@/app/nav/NavUserProfile"
import { createSignalObject, createStepUrlSignal, type SignalObject } from "@/auth/ui/profile_me/createStepUrlSignal"
import { profileMeFormFieldConfig } from "@/auth/ui/profile_me/profileMeFormFieldConfig"
import { signInSessionNew } from "@/auth/ui/sign_in/logic/signInSessionNew"
import { userSessionGet, userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import { urlUserProfileMe, urlUserProfileMeChangeEmail } from "@/auth/url/pageRouteAuth"
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

export function UserProfileMeChangeEmailPage() {
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
              <NavLinkButton href={urlUserProfileMeChangeEmail()} isActive={true}>
                {ttc("Change Email")}
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
      <h1 class="text-3xl font-bold mb-4">{ttc("Change Email")}</h1>

      <ChangeEmailForm />
    </div>
  )
}

function ChangeEmailForm() {
  const userSession = userSessionGet()
  const userHasPassword = userSession.hasPw

  const currentStep = createStepUrlSignal("step", 1)
  const currentPassword = createSignalObject("")
  const newEmail = createSignalObject("")
  const confirmationCode = createSignalObject("")
  const errors = {
    currentPassword: createSignalObject(""),
    newEmail: createSignalObject(""),
    confirmationCode: createSignalObject(""),
  } as const
  const isSubmitting = createSignalObject(false)

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <Show when={currentStep.get() === 1}>
        <EmailChangeStep1Form
          userHasPassword={userHasPassword}
          currentPassword={currentPassword}
          newEmail={newEmail}
          errors={errors}
          isSubmitting={isSubmitting}
          currentStep={currentStep}
        />
      </Show>

      <Show when={currentStep.get() === 2}>
        <EmailChangeStep2Form
          confirmationCode={confirmationCode}
          newEmail={newEmail}
          errors={errors}
          isSubmitting={isSubmitting}
          currentStep={currentStep}
        />
      </Show>
    </div>
  )
}

function EmailChangeStep1Form(p: {
  userHasPassword: boolean
  currentPassword: SignalObject<string>
  newEmail: SignalObject<string>
  errors: {
    currentPassword: SignalObject<string>
    newEmail: SignalObject<string>
    confirmationCode: SignalObject<string>
  }
  isSubmitting: SignalObject<boolean>
  currentStep: SignalObject<number>
}) {
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const emailChangeRequest = createAction(api.auth.userEmailChange1RequestAction)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    if (p.isSubmitting.get()) return

    const currentPasswordValue = p.currentPassword.get()
    const newEmailValue = p.newEmail.get().trim()

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
        title: ttc("Please fix the errors and try again"),
        variant: toastVariant.error,
      })
      return
    }

    p.isSubmitting.set(true)

    const result = await emailChangeRequest({
      token: userTokenGet(),
      newEmail: newEmailValue,
      currentPassword: p.userHasPassword ? currentPasswordValue : undefined,
      l: languageSignalGet(),
    })

    if (result.success) {
      toastAdd({
        title: ttc("Verification code sent"),
        description: ttc("Please check your email"),
        variant: toastVariant.success,
      })
      p.currentStep.set(2)
    } else {
      toastAdd({
        title: ttc("Email Change Request Failed"),
        description: result.errorMessage,
        variant: toastVariant.error,
      })
    }

    p.isSubmitting.set(false)
  }

  return (
    <form class="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 class="text-xl font-semibold mb-2">{ttc("Step 1: Enter New Email")}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {p.userHasPassword
            ? ttc("Enter your current password and the new email address you want to use.")
            : ttc("Enter the new email address you want to use.")}
        </p>
      </div>

      <Show when={p.userHasPassword}>
        <FormFieldInput
          config={profileMeFormFieldConfig.currentPassword}
          value={p.currentPassword.get()}
          error={p.errors.currentPassword.get()}
          mode={formMode.edit}
          onInput={p.currentPassword.set}
          onBlur={p.currentPassword.set}
        />
      </Show>

      <FormFieldInput
        config={profileMeFormFieldConfig.newEmail}
        value={p.newEmail.get()}
        error={p.errors.newEmail.get()}
        mode={formMode.edit}
        onInput={p.newEmail.set}
        onBlur={p.newEmail.set}
      />

      <SubmitButton
        isSubmitting={p.isSubmitting.get()}
        loadingText={ttc("Sending...")}
        text={ttc("Send Verification Code")}
      />
    </form>
  )
}

function EmailChangeStep2Form(p: {
  confirmationCode: SignalObject<string>
  newEmail: SignalObject<string>
  errors: {
    currentPassword: SignalObject<string>
    newEmail: SignalObject<string>
    confirmationCode: SignalObject<string>
  }
  isSubmitting: SignalObject<boolean>
  currentStep: SignalObject<number>
}) {
  const emailChangeConfirmMutation = createMutation(api.auth.userEmailChange2ConfirmMutation)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    if (p.isSubmitting.get()) return

    const confirmationCodeValue = p.confirmationCode.get()

    if (!confirmationCodeValue || confirmationCodeValue.length !== 6) {
      p.errors.confirmationCode.set("Please enter a valid 6-digit confirmation code")
    } else {
      p.errors.confirmationCode.set("")
    }

    if (Object.values(p.errors).some((error) => error.get() !== "")) {
      toastAdd({
        title: ttc("Please fix the errors and try again"),
        variant: toastVariant.error,
      })
      return
    }

    p.isSubmitting.set(true)

    const result = await emailChangeConfirmMutation({
      token: userTokenGet(),
      newEmail: p.newEmail.get(),
      confirmationCode: confirmationCodeValue,
    })

    if (result.success) {
      toastAdd({
        title: ttc("Email changed successfully!"),
        variant: toastVariant.success,
      })
      const userSession = result.data
      signInSessionNew(userSession)
      navigateTo(urlUserProfileMe())
    } else {
      toastAdd({
        title: ttc("Email Change Confirmation Failed"),
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
          {ttc(
            "We've sent a 6-digit confirmation code to your new email address. Enter it below to complete the email change.",
          )}
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

      <div class="space-y-3">
        <SubmitButton
          isSubmitting={p.isSubmitting.get()}
          loadingText={ttc("Confirming...")}
          text={ttc("Confirm Email Change")}
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
