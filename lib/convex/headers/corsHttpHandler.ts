import { httpAction } from "@convex/_generated/server"
import { returnCorsPreflightResponse } from "~auth/convex/headers/addCorsHeaders"

export const corsOptionsHttpHandler = httpAction(returnCorsPreflightResponse)
