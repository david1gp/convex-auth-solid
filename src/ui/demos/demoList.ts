import { type DemoListType } from "#ui/generate_demo_list/DemoListType.js"
import { lazy } from "solid-js"

const DemoOrgMemberList = lazy(async () => {
  const c = await import("#src/org/member_ui/list/DemoOrgMemberList.jsx")
  return { default: c.DemoOrgMemberList }
})

const DemoOrgInvitationList = lazy(async () => {
  const c = await import("#src/org/invitation_ui/list/DemoOrgInvitationList.jsx")
  return { default: c.DemoOrgInvitationList }
})

const DemoAuthLinks = lazy(async () => {
  const c = await import("#src/auth/ui/DemoAuthLinks.jsx")
  return { default: c.DemoAuthLinks }
})

const DemoSignInErrorPage = lazy(async () => {
  const c = await import("#src/auth/ui/sign_in/error/DemoSignInErrorPage.jsx")
  return { default: c.DemoSignInErrorPage }
})

const DemoAccessBlocked = lazy(async () => {
  const c = await import("#src/auth/ui/locked/DemoAccessBlocked.jsx")
  return { default: c.DemoAccessBlocked }
})

const DemoUploadArea = lazy(async () => {
  const c = await import("#src/file/ui/upload_file/DemoUploadArea.jsx")
  return { default: c.DemoUploadArea }
})

const DemoAnimateFadeIn = lazy(async () => {
  const c = await import("#src/ui/loaders/DemoAnimateFadeIn.jsx")
  return { default: c.DemoAnimateFadeIn }
})

const DemoLoaders = lazy(async () => {
  const c = await import("#src/ui/loaders/DemoLoaders.jsx")
  return { default: c.DemoLoaders }
})

const DemosLinkButton = lazy(async () => {
  const c = await import("#src/ui/links/DemosLinkButton.jsx")
  return { default: c.DemosLinkButton }
})

const DemoR2Upload = lazy(async () => {
  const c = await import("#src/r2/ui/DemoR2Upload.jsx")
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
