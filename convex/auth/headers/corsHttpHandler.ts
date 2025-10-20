import { httpAction } from "@convex/_generated/server"
import { returnCorsPreflightResponse } from "@convex/auth/headers/addCorsHeaders"

export const corsOptionsHttpHandler = httpAction(returnCorsPreflightResponse)
