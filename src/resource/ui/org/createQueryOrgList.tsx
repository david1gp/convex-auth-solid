import { api } from "#convex/_generated/api.js"
import type { Result } from "#result"
import { userTokenGet } from "#src/auth/ui/signals/userSessionSignal.js"
import type { OrgModel } from "#src/org/org_model/OrgModel.js"
import { orgSchema } from "#src/org/org_model/orgSchema.js"
import { createQueryCached } from "#src/utils/cache/createQueryCached.js"
import { createQuery } from "#src/utils/convex_client/createQuery.js"
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
