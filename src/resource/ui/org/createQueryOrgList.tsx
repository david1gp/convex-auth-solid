import { userTokenGet } from "@/auth/ui/signals/userSessionSignal"
import type { OrgModel } from "@/org/org_model/OrgModel"
import { orgSchema } from "@/org/org_model/orgSchema"
import { createQueryCached } from "@/utils/cache/createQueryCached"
import { createQuery } from "@/utils/convex_client/createQuery"
import { api } from "@convex/_generated/api"
import * as a from "valibot"
import type { Result } from "~utils/result/Result"

export function createQueryOrgList(): () => Result<OrgModel[]> | undefined {
  return createQueryCached<OrgModel[]>(
    createQuery(api.org.orgListQuery, {
      token: userTokenGet(),
    }),
    "orgListQuery",
    a.array(orgSchema),
  )
}
