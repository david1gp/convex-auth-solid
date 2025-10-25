import { httpAction } from "@convex/_generated/server"
import { returnCorsPreflightResponse } from "./returnCorsPreflightResponse"

export const corsOptionsHttpHandler = httpAction(returnCorsPreflightResponse)
