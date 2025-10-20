import { addHttpRoutesAuth } from "@convex/auth/addHttpRoutes"
import { httpRouter } from "convex/server"

const http = httpRouter()

addHttpRoutesAuth(http)

export default http
