import { addKeyboardListenerAlt } from "#src/auth/ui/sign_up/form/addKeyboardListenerAlt.ts"
import { isDevEnv } from "#src/utils/env/isDevEnv.ts"
import { type SignUpUiStateManagement, signUpCreateStateManagement } from "./signUpCreateFormState.ts"

export function signUpEmailPasswordFormStateCreate(props: () => { stateFactory?: () => SignUpUiStateManagement }) {
  const sm = (props().stateFactory ?? signUpCreateStateManagement)()
  if (!props().stateFactory && isDevEnv()) addKeyboardListenerAlt("t", sm.fillTestData)
  return sm
}
