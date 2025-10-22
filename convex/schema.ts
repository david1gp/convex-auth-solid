import { authTables } from "@/auth/convex/authTables"
import { defineSchema } from "convex/server"

const schema = defineSchema({
  // technical
  ...authTables,
})

export default schema
