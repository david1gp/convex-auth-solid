import type { orgInvitationDataSchema, orgInvitationSchema } from "#src/org/invitation_model/orgInvitationSchema.ts"
import * as a from "valibot"

export type OrgInvitationDataModel = a.InferOutput<typeof orgInvitationDataSchema>

export type OrgInvitationModel = a.InferOutput<typeof orgInvitationSchema>
