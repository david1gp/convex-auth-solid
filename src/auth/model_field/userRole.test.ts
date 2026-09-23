import { expect, test } from "bun:test"
import * as a from "valibot"
import { userRole, userRoleIsAdmin, userRoleSchema } from "#src/auth/model_field/userRole.ts"

test("the canonical role model contains only user and admin", () => {
  expect(userRole).toEqual({ user: "user", admin: "admin" })
  expect(a.safeParse(userRoleSchema, "dev").success).toBe(false)
})

test("admin is the only elevated role", () => {
  expect(userRoleIsAdmin(userRole.admin)).toBe(true)
  expect(userRoleIsAdmin(userRole.user)).toBe(false)
})
