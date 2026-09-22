import * as a from "valibot"

/** Schema validating the persisted automatic sign-in attempt counter. */
export const allgroupsSsoAttemptsSchema = a.pipe(a.number(), a.integer(), a.minValue(0))
export type AllgroupsSsoAttempts = a.InferOutput<typeof allgroupsSsoAttemptsSchema>
