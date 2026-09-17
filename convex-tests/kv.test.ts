/// <reference types="vite/client" />

import { convexTest } from "convex-test"
import { expect, test } from "vitest"
import { internal } from "../convex/_generated/api.js"
import schema from "../convex/schema.js"

const modules = import.meta.glob("../convex/**/*.ts")

test("inserts, reads, and updates a key through the internal KV functions", async () => {
  const t = convexTest(schema, modules)
  const key = "convex-test-key"

  expect(
    await t.mutation(internal.kv.kvSetInternalMutation, {
      data: "initial-value",
      key,
    }),
  ).toBe(false)
  expect(await t.query(internal.kv.kvGetInternalQuery, { key })).toMatchObject({
    data: "initial-value",
    key,
  })

  expect(
    await t.mutation(internal.kv.kvSetInternalMutation, {
      data: "updated-value",
      key,
    }),
  ).toBe(true)
  expect(await t.query(internal.kv.kvGetInternalQuery, { key })).toMatchObject({
    data: "updated-value",
    key,
  })
})
