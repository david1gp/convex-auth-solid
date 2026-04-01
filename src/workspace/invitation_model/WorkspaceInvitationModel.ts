import type { workspaceInvitationDataSchema, workspaceInvitationSchema } from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"
import * as a from "valibot"

export type WorkspaceInvitationDataModel = a.InferOutput<typeof workspaceInvitationDataSchema>

export type WorkspaceInvitationModel = a.InferOutput<typeof workspaceInvitationSchema>