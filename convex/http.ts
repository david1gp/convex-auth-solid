import { addHttpRoutesAuth } from "@/auth/convex/addHttpRoutesAuth"
import { addHttpRoutesR2 } from "@/r2/convex/addHttpRoutesR2"
import { addHttpRoutesResource } from "@/resource/convex/addHttpRoutesResource"
import { httpRouter } from "convex/server"

const http = httpRouter()

addHttpRoutesAuth(http)
addHttpRoutesResource(http)
addHttpRoutesR2(http)

export default http
