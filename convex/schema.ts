import { defineSchema } from "convex/server"
import { authTables } from "./auth/authTables"

const schema = defineSchema({
  // technical
  ...authTables,
})

export default schema
