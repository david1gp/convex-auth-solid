import { createResult, createResultError } from "#result"
import { pageDemoFixtureStoreGet } from "#src/app/demos/pageDemoFixtureStoreGet.ts"
import type { UserProfile } from "#src/auth/model/UserProfile.ts"
import { userProfileMeChangeEmailStateCreate } from "#src/auth/ui/profile_me/userProfileMeChangeEmailStateCreate.ts"
import { userProfileMeChangePasswordStateCreate } from "#src/auth/ui/profile_me/userProfileMeChangePasswordStateCreate.ts"
import { userProfileMeDeleteStateCreate } from "#src/auth/ui/profile_me/userProfileMeDeleteStateCreate.ts"
import { userProfileMeDemoStateCreate } from "#src/auth/ui/profile_me/userProfileMeDemoStateCreate.ts"
import { userProfileMeImageStateCreate } from "#src/auth/ui/profile_me/userProfileMeImageStateCreate.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"

/** Only fixture writes and local file previews: no production adapter is instantiated. */
export function authProfileFinalDemoStateCreate() {
  const store = pageDemoFixtureStoreGet()
  const profile = userProfileMeDemoStateCreate()
  const message = createSignalObject("Local-only demo. No real account, email, upload, or session changes.")
  function profilePatch(patch: Partial<UserProfile>) {
    store.set("auth.profile", { ...profile.profile(), ...store.get<UserProfile>("auth.profile"), ...patch })
  }
  function publicProfile() {
    const current = { ...profile.profile(), ...store.get<UserProfile>("auth.profile") }
    return {
      ...current,
      userId: current.userId ?? "demo-user",
      username: current.username ?? "sample-user",
      role: current.role ?? "user",
      createdAt: current.createdAt ?? "2026-01-15T10:00:00.000Z",
      updatedAt: current.updatedAt ?? "2026-01-15T10:00:00.000Z",
    }
  }

  return {
    message: message.get,
    publicProfile,
    passwordStateCreate: () =>
      userProfileMeChangePasswordStateCreate({
        request: async () => {
          store.set("auth.profile.passwordRequested", true)
          message.set("Demo verification code: 123456. No email was sent.")
          return createResult(null)
        },
        confirm: async (code) => {
          if (!store.get<boolean>("auth.profile.passwordRequested") || code !== "123456") {
            return createResultError(
              "authProfileFinalDemoStateCreate.passwordConfirm",
              "Send a demo code first, then use 123456.",
            )
          }
          store.delete("auth.profile.passwordRequested")
          store.set("auth.profile.passwordChanged", true)
          message.set("Demo password step completed locally. No password or session was changed or stored.")
          return createResult(null)
        },
      }),
    emailStateCreate: () =>
      userProfileMeChangeEmailStateCreate({
        hasPassword: () => true,
        initialEmail: store.get<string>("auth.profile.emailRequested") ?? "",
        request: async (email) => {
          store.set("auth.profile.emailRequested", email)
          message.set("Demo verification code: 123456. No email was sent.")
          return createResult(null)
        },
        confirm: async (email, code) => {
          if (store.get<string>("auth.profile.emailRequested") !== email || code !== "123456") {
            return createResultError(
              "authProfileFinalDemoStateCreate.emailConfirm",
              "Request a demo code for this email first, then use 123456.",
            )
          }
          profilePatch({ email })
          store.delete("auth.profile.emailRequested")
          message.set("Demo email saved locally. No account or session was changed.")
          return createResult(null)
        },
      }),
    imageStateCreate: () =>
      userProfileMeImageStateCreate({
        initialImage: publicProfile().image ?? "",
        saveOnRemove: true,
        selectFile: async (file) => {
          const op = "authProfileFinalDemoStateCreate.imageSelect"
          if (!file.type.startsWith("image/")) return createResultError(op, "Please select an image file")
          try {
            return createResult(URL.createObjectURL(file))
          } catch (error) {
            return createResultError(op, "Unable to preview this local file", String(error))
          }
        },
        save: async (image) => {
          const previousImage = publicProfile().image
          if (previousImage?.startsWith("blob:") && previousImage !== image) URL.revokeObjectURL(previousImage)
          profilePatch({ image: image || undefined })
          message.set(
            image
              ? "Demo image preview saved locally. No file was uploaded."
              : "Demo image removed locally. No account was changed.",
          )
          return createResult(null)
        },
      }),
    deleteStateCreate: () =>
      userProfileMeDeleteStateCreate(async () => {
        store.set("auth.profile.deleted", true)
        message.set(
          "Demo deletion confirmed locally. The sample profile remains available; no account or session was deleted.",
        )
        return createResult(null)
      }, store.get<boolean>("auth.profile.deleted") ?? false),
  }
}
