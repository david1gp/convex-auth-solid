import type * as a from "valibot"
import type {
  workspaceInvitationDataSchema,
  workspaceInvitationSchema,
} from "#src/workspace/invitation_model/WorkspaceInvitationSchema.ts"

export type WorkspaceInvitationDataModel = a.InferOutput<typeof workspaceInvitationDataSchema>

export type WorkspaceInvitationModel = a.InferOutput<typeof workspaceInvitationSchema>
