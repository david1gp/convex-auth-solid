import * as a from "valibot"

/** Schema validating the browser-local preference for automatic sign-in. */
export const allgroupsSsoPreferenceSchema = a.boolean()
export type AllgroupsSsoPreference = a.InferOutput<typeof allgroupsSsoPreferenceSchema>
