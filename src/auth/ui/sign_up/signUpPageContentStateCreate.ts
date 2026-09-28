import { userSessionsSignal } from "#src/auth/ui/signals/userSessionsSignal.ts"

export function signUpPageContentStateCreate(
  props: () => {
    demo?: boolean
    confirmHref?: string
    message?: string
  },
) {
  return {
    sessionsCount: () => (props().demo ? 0 : userSessionsSignal.get().length),
    confirmHref: () => (props().demo && props().message ? props().confirmHref : undefined),
  }
}
