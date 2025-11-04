import { urlOrgList } from "@/org/org_url/urlOrg"
import { ttt } from "~ui/i18n/ttt"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { LinkButton } from "~ui/interactive/link/LinkButton"

export function OrganizationListLinkButton() {
  return (
    <LinkButton variant={buttonVariant.link} href={urlOrgList()}>
      {ttt("Organizations")}
    </LinkButton>
  )
}
