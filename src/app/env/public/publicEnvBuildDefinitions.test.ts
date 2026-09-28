import { expect, test } from "bun:test"
import { publicEnvVariableName } from "#src/app/env/publicEnvVariableName.ts"
import rsbuildConfig from "../../../../rsbuild.config.ts"

test("Rsbuild defines every public environment variable used in the browser", () => {
  const definitions = rsbuildConfig.source?.define ?? {}

  for (const name of Object.values(publicEnvVariableName)) {
    expect(Object.hasOwn(definitions, `process.env.${name}`)).toBe(true)
  }
})
