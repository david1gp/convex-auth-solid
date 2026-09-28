import { userRoleIsAdmin } from "#src/auth/model_field/userRole.ts"
import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { userSessionGet } from "#src/auth/ui/signals/userSessionSignal.ts"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"

export function orgFormViewStateCreate(demo: () => boolean, fillTestData: () => () => void) {
  if (!demo() && isDevEnv()) addKeyboardListenerAlt("t", fillTestData())
  return { isAdmin: () => !demo() && userRoleIsAdmin(userSessionGet().profile.role) }
}
