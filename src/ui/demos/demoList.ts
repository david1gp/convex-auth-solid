import { lazy } from "solid-js"
import type { DemoListType } from "~ui/generate_demo_list/DemoListType"

const DemoOrgInvitationList = lazy(async () => {
	const c = await import("@/org/invitation_ui/view/DemoOrgInvitationList");
	return { default: c.DemoOrgInvitationList };
});

const DemoAuthLinks = lazy(async () => {
	const c = await import("@/auth/ui/DemoAuthLinks");
	return { default: c.DemoAuthLinks };
});

const DemoLoaders = lazy(async () => {
	const c = await import("@/ui/loaders/DemoLoaders");
	return { default: c.DemoLoaders };
});

export const demoList = {
	auth: {
		DemoAuthLinks: DemoAuthLinks,
	},
	org: {
		DemoOrgInvitationList: DemoOrgInvitationList,
	},
	ui: {
		DemoLoaders: DemoLoaders,
	},
} as const satisfies DemoListType;
