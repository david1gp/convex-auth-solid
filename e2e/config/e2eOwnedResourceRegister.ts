import { readFile } from "node:fs/promises"
import * as v from "valibot"
import { type E2eOwnedResource, e2eCheckpointSchema } from "./e2eCheckpointSchema.ts"
import { e2eCheckpointWrite } from "./e2eCheckpointWrite.ts"

let registrations = Promise.resolve()

/** Register immediately after creating a run-owned resource; IDs should start with `e2e-${runId}-`. */
export async function e2eOwnedResourceRegister(
  resource: Omit<E2eOwnedResource, "ownerRunId" | "createdAt">,
): Promise<void> {
  const registration = registrations.then(() => e2eOwnedResourceRegisterWrite(resource))
  registrations = registration.then(
    () => undefined,
    () => undefined,
  )
  await registration
}

async function e2eOwnedResourceRegisterWrite(
  resource: Omit<E2eOwnedResource, "ownerRunId" | "createdAt">,
): Promise<void> {
  const checkpointPath = process.env.E2E_CHECKPOINT_PATH
  if (!checkpointPath) throw new Error("E2E_CHECKPOINT_PATH is required to register an owned E2E resource")
  const raw = await readFile(checkpointPath, "utf8")
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch (error) {
    throw new Error("Cannot register a resource against invalid E2E checkpoint JSON", { cause: error })
  }
  const parsed = v.safeParse(e2eCheckpointSchema, value)
  if (!parsed.success) throw new Error("Cannot register a resource against an invalid E2E checkpoint")
  if (
    process.env.E2E_RUN_ID !== parsed.output.runId ||
    !resource.resourceId.startsWith(`e2e-${parsed.output.runId}-`)
  ) {
    throw new Error("Owned E2E resource IDs must use the e2e-<runId>- prefix")
  }
  await e2eCheckpointWrite(checkpointPath, {
    ...parsed.output,
    ownedResources: [
      ...parsed.output.ownedResources,
      { ...resource, ownerRunId: parsed.output.runId, createdAt: Date.now() },
    ],
  })
}
