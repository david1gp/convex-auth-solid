import { httpRouter } from "convex/server"
import { addHttpRoutesAuth } from "~auth/convex/addHttpRoutesAuth"

const http = httpRouter()

addHttpRoutesAuth(http)

export default http
