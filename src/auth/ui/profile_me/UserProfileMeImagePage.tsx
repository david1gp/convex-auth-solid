import { ttc } from "@/app/i18n/ttc"
import { LayoutWrapperAuth } from "@/app/layout/LayoutWrapperAuth"
import { NavLinkButton } from "@/app/nav/links/NavLinkButton"
import { NavBreadcrumbSeparator } from "@/app/nav/NavBreadcrumbSeparator"
import { NavUserProfile } from "@/app/nav/NavUserProfile"
import { apiAuthProfileUpdate } from "@/auth/api/apiAuthProfileUpdate"
import { userSessionGet, userSessionSignal } from "@/auth/ui/signals/userSessionSignal"
import { userSessionsSignalAdd } from "@/auth/ui/signals/userSessionsSignal"
import { urlUserProfileMe, urlUserProfileMeImage } from "@/auth/url/pageRouteAuth"
import type { UploadAreaFileInfo } from "@/file/ui/stats/UploadAreaFileInfo"
import { UploadAreaImage } from "@/file/ui/upload_image/UploadAreaImage"
import { classesCard } from "@/ui/card/classesCard"
import { navigateTo } from "@/utils/router/navigateTo"
import { mdiArrowLeft, mdiTrashCanOutline } from "@mdi/js"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { LinkButton } from "~ui/interactive/link/LinkButton"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import { PageWrapper } from "~ui/static/page/PageWrapper"
import { classMerge } from "~ui/utils/classMerge"
import { createSignalObject } from "~ui/utils/createSignalObject"

const showUrlInput = false

export function UserProfileMeImagePage() {
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
              <NavLinkButton href={urlUserProfileMeImage()} isActive={true}>
                {ttc("Image")}
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
    <div class={classMerge("max-w-4xl mx-auto px-4 py-8")}>
      <h1 class="text-3xl font-bold mb-4">{ttc("Change Profile Image")}</h1>
      <UserProfileImageForm />
    </div>
  )
}

function UserProfileImageForm() {
  const userSession = userSessionGet()
  const initialImage = userSession.profile.image || ""
  const image = createSignalObject(initialImage)
  const uploadInfo = createSignalObject<UploadAreaFileInfo | null>(null)
  const uploadError = createSignalObject<string | null>(null)
  const isLoading = createSignalObject(false)

  function hasUploaded() {
    return !!uploadInfo.get()
  }

  function hasImageUrl() {
    return !!image.get()
  }

  function handleRemoveImage() {
    image.set("")
  }

  function handleUploadSuccess(data: { url: string }) {
    image.set(data.url)
    handleSave()
  }

  async function handleSave() {
    isLoading.set(true)

    const formData = {
      name: userSession.profile.name,
      image: image.get() || undefined,
      token: userSession.token,
    }

    const result = await apiAuthProfileUpdate(formData)

    if (result.success) {
      toastAdd({
        title: ttc("Profile Image Updated"),
        variant: toastVariant.success,
      })

      const newSession = result.data
      userSessionsSignalAdd(newSession)
      userSessionSignal.set(newSession)

      navigateTo(urlUserProfileMe())
    } else {
      toastAdd({
        title: ttc("Update Failed"),
        variant: toastVariant.error,
      })
    }

    isLoading.set(false)
  }

  return (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <Show when={hasImageUrl()}>
          <div class="flex flex-col gap-2 max-w-sm">
            <img src={image.get()!} alt="Profile preview" class="w-full rounded-lg" />
            <ButtonIcon icon={mdiTrashCanOutline} variant={buttonVariant.outline} class="" onClick={handleRemoveImage}>
              {ttc("Remove image")}
            </ButtonIcon>
          </div>
        </Show>

        <Show when={!hasImageUrl()}>
          <div class="flex flex-col gap-2">
            <UploadAreaImage
              hasUploaded={hasUploaded}
              info={uploadInfo}
              error={uploadError}
              onUploadSuccess={handleUploadSuccess}
              class={classesCard}
            />
          </div>
        </Show>

        <Show when={showUrlInput}>
          <div>
            <label for="imageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {ttc("Or enter image URL")}
            </label>
            <input
              id="imageUrl"
              type="text"
              value={image.get()}
              onInput={(e) => image.set(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder={"https://example.com/image.jpg"}
            />
          </div>
        </Show>
      </div>

      <div class="mt-6 flex justify-start">
        <LinkButton icon={mdiArrowLeft} href={urlUserProfileMe()} variant={buttonVariant.link}>
          {ttc("Back to Profile")}
        </LinkButton>
      </div>
    </div>
  )
}

import { Show } from "solid-js"
