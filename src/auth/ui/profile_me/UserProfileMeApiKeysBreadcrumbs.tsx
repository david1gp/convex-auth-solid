import { ttc } from "#src/app/i18n/ttc.ts"
import { NavLinkButton } from "#src/app/nav/links/NavLinkButton.tsx"
import { NavBreadcrumbSeparator } from "#src/app/nav/NavBreadcrumbSeparator.tsx"

export function UserProfileMeApiKeysBreadcrumbs(p: { profileHref: string; apiKeysHref: string }) {
  return (
    <>
      <NavBreadcrumbSeparator />
      <NavLinkButton href={p.profileHref} isActive={false}>
        {ttc("My Profile")}
      </NavLinkButton>
      <NavBreadcrumbSeparator />
      <NavLinkButton href={p.apiKeysHref} isActive={true}>
        {ttc("API Keys")}
      </NavLinkButton>
    </>
  )
}
