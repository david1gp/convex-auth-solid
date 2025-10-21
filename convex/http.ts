import { addHttpRoutesAuth } from "@convex/auth/addHttpRoutesAuth"
import { httpRouter } from "convex/server"

const http = httpRouter()

addHttpRoutesAuth(http)

export default http
