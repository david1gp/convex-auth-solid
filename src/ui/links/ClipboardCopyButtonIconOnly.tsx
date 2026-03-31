import { ttc } from "#src/app/i18n/ttc.ts"
import { ButtonIconOnly } from "#ui/interactive/button/ButtonIconOnly.jsx"
import { buttonVariant } from "#ui/interactive/button/buttonCva.ts"
import { toastAdd } from "#ui/interactive/toast/toastAdd.ts"
import { toastVariant } from "#ui/interactive/toast/toastVariant.ts"
import type { MayHaveButtonVariant } from "#ui/utils/MayHaveButtonVariant.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveDisabled } from "#ui/utils/MayHaveDisabled.ts"
import { createSignalObject } from "#ui/utils/createSignalObject.ts"
import { mdiCheckboxMarkedOutline, mdiContentCopy } from "@mdi/js"

export interface ClipboardCopyButtonIconOnlyProps extends MayHaveButtonVariant, MayHaveClass, MayHaveDisabled {
  data: string
  copyText?: string
  toastText?: string
}

export function ClipboardCopyButtonIconOnly(p: ClipboardCopyButtonIconOnlyProps) {
  const copied = createSignalObject(false)
  const copyText = p.copyText ?? ttc("Copy to clipboard")
  const toastText = p.toastText ?? ttc("Copied to clipboard")

  function copyData() {
    navigator.clipboard.writeText(p.data).then(
      () => {
        copied.set(true)
        toastAdd({
          title: toastText,
          variant: toastVariant.success,
        })
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          copied.set(false)
        }, 2000)
      },
      (err) => {
        console.error("clipboard: could not copy text: ", err)
        const errorTitle = ttc("Copy failed")
        toastAdd({
          title: errorTitle,
          variant: toastVariant.error,
          description: err.message || ttc("Unable to copy to clipboard"),
        })
      },
    )
  }

  return (
    <ButtonIconOnly
      icon={copied.get() ? mdiCheckboxMarkedOutline : mdiContentCopy}
      iconClass="size-5"
      onClick={copyData}
      title={copied.get() ? ttc("Copied") : copyText}
      disabled={p.disabled || copied.get()}
      variant={p.variant ?? buttonVariant.outline}
      class={p.class}
    >
      {/* {copied.get() ? ttt("Copied") : ttt("Copy")} */}
    </ButtonIconOnly>
  )
}
