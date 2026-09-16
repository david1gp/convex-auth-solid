import { api } from "#convex/_generated/api.js"
import { userSessionSignal, userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { orgSchema } from "#src/org/org_model/orgSchema.ts"
import { cursorPaginationCreate } from "#src/utils/convex_client/cursorPaginationCreate.ts"

export function createQueryOrgList() {
  return cursorPaginationCreate({
    query: api.org.orgListQuery,
    queryKey: "orgListQuery",
    args: () => ({ token: userTokenGet() }),
    identity: () => userSessionSignal.get()?.profile.userId ?? null,
    itemSchema: orgSchema,
  })
}
