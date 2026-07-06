import { httpRouter } from "convex/server"
import { addHttpRoutesAuth } from "#src/auth/convex/addHttpRoutesAuth.ts"
import { addHttpRoutesR2 } from "#src/r2/convex/addHttpRoutesR2.ts"
import { addHttpRoutesResource } from "#src/resource/convex/addHttpRoutesResource.ts"

const http = httpRouter()

addHttpRoutesAuth(http)
addHttpRoutesResource(http)
addHttpRoutesR2(http)

export default http
