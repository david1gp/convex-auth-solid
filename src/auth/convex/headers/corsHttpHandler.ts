import { returnCorsPreflightResponse } from "@/auth/convex/headers/addCorsHeaders"
import { httpAction } from "@convex/_generated/server"

export const corsOptionsHttpHandler = httpAction(returnCorsPreflightResponse)
