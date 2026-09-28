import { ttc } from "#src/app/i18n/ttc.ts"
import { LayoutWrapperAuth } from "#src/app/layout/LayoutWrapperAuth.tsx"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"
import { NavUserProfile } from "#src/app/nav/NavUserProfile.tsx"
import { urlUserProfileMe, urlUserProfileMeChangePassword } from "#src/auth/url/pageRouteAuth.ts"
import { PageWrapper } from "#ui/static/page/PageWrapper.tsx"
import { UserProfileMeChangePasswordView } from "./UserProfileMeChangePasswordView.tsx"

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
        <UserProfileMeChangePasswordView />
      </PageWrapper>
    </LayoutWrapperAuth>
  )
}
