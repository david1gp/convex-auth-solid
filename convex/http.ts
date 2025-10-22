import { addHttpRoutesAuth } from "@/auth/convex/addHttpRoutesAuth"
import { httpRouter } from "convex/server"

const http = httpRouter()

addHttpRoutesAuth(http)

export default http
