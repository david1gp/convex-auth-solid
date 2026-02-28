import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavUserProfile } from "@/app/nav/NavUserProfile"
import { apiAuthUserDelete } from "@/auth/api/apiAuthUserDelete"
import { userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { urlUserProfileMe, urlUserProfileMeDelete } from "@/auth/url/pageRouteAuth"
import { Button } from "~ui/interactive/button/Button"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classMerge } from "~ui/utils/classMerge"
import { navigateTo } from "@/utils/router/navigateTo"
import { createSignal } from "solid-js"

export function UserProfileMeDeletePage() {
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
              <NavLinkButton href={urlUserProfileMeDelete()} isActive={true}>
                {ttc("Delete Account")}
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
        "max-w-xl mx-auto",
      )}
    >
      <h1 class="text-3xl font-bold mb-4">{ttc("Delete Account")}</h1>

      <DeleteAccountForm />
    </div>
  )
}

function DeleteAccountForm() {
  const [isDeleting, setIsDeleting] = createSignal(false)

  const handleDelete = async () => {
    if (isDeleting()) return

    setIsDeleting(true)

    const result = await apiAuthUserDelete()

    if (result.success) {
      toastAdd({
        title: ttc("Account deleted successfully"),
        variant: toastVariant.success,
      })

      userSessionSignal.set(null)

      navigateTo("/")
    } else {
      toastAdd({
        title: ttc("Failed to delete account"),
        variant: toastVariant.error,
      })
    }

    setIsDeleting(false)
  }

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      <p class="text-gray-600 dark:text-gray-400">
        {ttc("Are you sure you want to delete your account? This action cannot be undone.")}
      </p>

      <Button
        type="button"
        variant={buttonVariant.destructive}
        onClick={handleDelete}
        disabled={isDeleting()}
        class="w-full"
      >
        {isDeleting() ? ttc("Deleting...") : ttc("Delete My Account")}
      </Button>

      <div class="text-center">
        <NavLinkButton href={urlUserProfileMe()} isActive={false}>
          {ttc("Cancel")}
        </NavLinkButton>
      </div>
    </div>
  )
}
