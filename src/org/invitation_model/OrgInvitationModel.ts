import type { orgInvitationDataSchema, orgInvitationSchema } from "@/org/invitation_model/orgInvitationSchema"
import * as a from "valibot"

export type OrgInvitationDataModel = a.InferOutput<typeof orgInvitationDataSchema>

export type OrgInvitationModel = a.InferOutput<typeof orgInvitationSchema>
