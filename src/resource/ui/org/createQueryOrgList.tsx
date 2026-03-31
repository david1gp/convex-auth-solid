import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import type { OrgModel } from "#src/org/org_model/OrgModel.ts"
import { orgSchema } from "#src/org/org_model/orgSchema.ts"
import { createQueryCached } from "#src/utils/cache/createQueryCached.ts"
import { createQuery } from "#src/utils/convex_client/createQuery.ts"
import * as a from "valibot"

export function createQueryOrgList(): () => Result<OrgModel[]> | undefined {
  return createQueryCached<OrgModel[]>(
    createQuery(api.org.orgListQuery, {
      token: userTokenGet(),
    }),
    "orgListQuery",
    a.array(orgSchema),
  )
}
