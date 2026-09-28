import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavUserProfile } from "#src/app/nav/NavUserProfile.tsx"
import { urlUserProfileMe, urlUserProfileMeImage } from "#src/auth/url/pageRouteAuth.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.tsx"
import { UserProfileMeImageView } from "./UserProfileMeImageView.tsx"

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
        <UserProfileMeImageView />
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}
