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

const DemoAccessBlocked = lazy(async () => {
  const c = await import("@/auth/ui/locked/DemoAccessBlocked")
  return { default: c.DemoAccessBlocked }
})

const DemoUploadArea = lazy(async () => {
  const c = await import("@/file/ui/upload_file/DemoUploadArea")
  return { default: c.DemoUploadArea }
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

const DemoR2Upload = lazy(async () => {
  const c = await import("@/r2/ui/DemoR2Upload")
  return { default: c.DemoR2Upload }
})

export const demoList = {
  auth: {
    DemoAuthLinks: DemoAuthLinks,
    DemoSignInErrorPage: DemoSignInErrorPage,
    DemoAccessBlocked: DemoAccessBlocked,
  },
  file: {
    DemoUploadArea: DemoUploadArea,
  },
  org: {
    DemoOrgMemberList: DemoOrgMemberList,
    DemoOrgInvitationList: DemoOrgInvitationList,
  },
  r2: {
    DemoR2Upload: DemoR2Upload,
  },
  ui: {
    DemoAnimateFadeIn: DemoAnimateFadeIn,
    DemoLoaders: DemoLoaders,
    DemosLinkButton: DemosLinkButton,
  },
} as const satisfies DemoListType
