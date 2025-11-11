import { mdiCheckboxMarkedOutline, mdiContentCopy } from "@mdi/js"
import { ttt } from "~ui/i18n/ttt"
import { ButtonIcon } from "~ui/interactive/button/ButtonIcon"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveButtonVariant } from "~ui/utils/MayHaveButtonVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveDisabled } from "~ui/utils/MayHaveDisabled"
import { createSignalObject } from "~ui/utils/createSignalObject"

export interface ClipboardCopyButtonIconProps extends MayHaveButtonVariant, MayHaveClass, MayHaveDisabled {
  data: string
  copyText?: string
  toastText?: string
}

export function ClipboardCopyButtonIcon(p: ClipboardCopyButtonIconProps) {
  const copied = createSignalObject(false)
  const copyText = p.copyText ?? ttt("Copy to clipboard")
  const toastText = p.toastText ?? ttt("Copied to clipboard")

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
        const errorTitle = ttt("Copy failed")
        toastAdd({
          title: errorTitle,
          variant: toastVariant.error,
          description: err.message || ttt("Unable to copy to clipboard"),
        })
      },
    )
  }

  return (
    <ButtonIcon
      icon={copied.get() ? mdiCheckboxMarkedOutline : mdiContentCopy}
      onClick={copyData}
      title={copied.get() ? ttt("Copied") : copyText}
      disabled={p.disabled || copied.get()}
      variant={p.variant ?? buttonVariant.outline}
      class={p.class}
    >
      {/* {copied.get() ? ttt("Copied") : ttt("Copy")} */}
    </ButtonIcon>
  )
}
