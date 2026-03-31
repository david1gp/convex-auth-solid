import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavUserProfile } from "#src/app/nav/NavUserProfile.tsx"
import { apiAuthUserDelete } from "#src/auth/api/apiAuthUserDelete.ts"
import { userSessionSignal } from "#src/auth/ui/signals/userSessionSignal.ts"
import { urlUserProfileMe, urlUserProfileMeDelete } from "#src/auth/url/pageRouteAuth.ts"
import { navigateTo } from "#src/utils/router/navigateTo.ts"
import { Button } from "#ui/interactive/button/Button.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.jsx"
import { classMerge } from "#ui/utils/classMerge.ts"
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
        variant={buttonVariant.filledRed}
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
