import { orgRole } from "@/org/org_model_field/orgRole"
import { v } from "convex/values"

export const orgRoleValidator = v.union(v.literal(orgRole.member), v.literal(orgRole.guest))
