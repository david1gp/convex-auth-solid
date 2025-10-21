import { defineSchema } from "convex/server"
import { authTables } from "../lib/convex/authTables"

const schema = defineSchema({
  // technical
  ...authTables,
})

export default schema
