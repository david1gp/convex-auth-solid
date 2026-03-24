import { addHttpRoutesAuth } from "#src/auth/convex/addHttpRoutesAuth.js"
import { addHttpRoutesR2 } from "#src/r2/convex/addHttpRoutesR2.js"
import { addHttpRoutesResource } from "#src/resource/convex/addHttpRoutesResource.js"
import { httpRouter } from "convex/server"

const http = httpRouter()

addHttpRoutesAuth(http)
addHttpRoutesResource(http)
addHttpRoutesR2(http)

export default http
