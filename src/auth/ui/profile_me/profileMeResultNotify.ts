import type { Result } from "#result"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"

/** Production feedback stays outside injected demo operations. */
export function profileMeResultNotify(result: Result<unknown>, successTitle: string, errorTitle: string) {
  if (!result.success) {
    toastAdd({ title: errorTitle, description: result.errorMessage, variant: toastVariant.error })
    return
  }
  toastAdd({ title: successTitle, variant: toastVariant.success })
}
