import * as a from "valibot"
import { orgSchema } from "#src/org/org_model/orgSchema.ts"

export const orgViewPageSchema = a.object({
  org: orgSchema,
})

export type OrgViewPageType = a.InferOutput<typeof orgViewPageSchema>
