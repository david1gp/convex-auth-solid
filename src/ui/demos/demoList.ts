import { lazy } from "solid-js"
import { type DemoListType } from "~ui/generate_demo_list/DemoListType"

const DemoOrgMemberList = lazy(async () => {
  const c = await import("@/org/member_ui/list/DemoOrgMemberList")
  return { default: c.DemoOrgMemberList }
})

const DemoOrgInvitationList = lazy(async () => {
  const c = await import("@/org/invitation_ui/list/DemoOrgInvitationList")
  return { default: c.DemoOrgInvitationList }
})

const DemoAuthLinks = lazy(async () => {
  const c = await import("@/auth/ui/DemoAuthLinks")
  return { default: c.DemoAuthLinks }
})

const DemoSignInErrorPage = lazy(async () => {
  const c = await import("@/auth/ui/sign_in/error/DemoSignInErrorPage")
  return { default: c.DemoSignInErrorPage }
})

const DemoAnimateFadeIn = lazy(async () => {
  const c = await import("@/ui/loaders/DemoAnimateFadeIn")
  return { default: c.DemoAnimateFadeIn }
})

const DemoLoaders = lazy(async () => {
  const c = await import("@/ui/loaders/DemoLoaders")
  return { default: c.DemoLoaders }
})

const DemosLinkButton = lazy(async () => {
  const c = await import("@/ui/links/DemosLinkButton")
  return { default: c.DemosLinkButton }
})

export const demoList = {
  auth: {
    DemoAuthLinks: DemoAuthLinks,
    DemoSignInErrorPage: DemoSignInErrorPage,
  },
  org: {
    DemoOrgMemberList: DemoOrgMemberList,
    DemoOrgInvitationList: DemoOrgInvitationList,
  },
  ui: {
    DemoAnimateFadeIn: DemoAnimateFadeIn,
    DemoLoaders: DemoLoaders,
    DemosLinkButton: DemosLinkButton,
  },
} as const satisfies DemoListType
