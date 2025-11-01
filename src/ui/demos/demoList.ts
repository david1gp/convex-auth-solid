import { lazy } from "solid-js";
import type { DemoListType } from "~ui/generate_demo_list/DemoListType";

const DemoAuthLinks = lazy(async () => {
	const c = await import("@/auth/ui/DemoAuthLinks");
	return { default: c.DemoAuthLinks };
});

const DemoLoaders = lazy(async () => {
	const c = await import("@/ui/loaders/DemoLoaders");
	return { default: c.DemoLoaders };
});

const DemoNativeSingleSelect = lazy(async () => {
	const c = await import("@/ui/select/DemoNativeSingleSelect");
	return { default: c.DemoNativeSingleSelect };
});

export const demoList = {
	auth: {
		DemoAuthLinks: DemoAuthLinks,
	},
	ui: {
		DemoLoaders: DemoLoaders,
		DemoNativeSingleSelect: DemoNativeSingleSelect,
	},
} as const satisfies DemoListType;
