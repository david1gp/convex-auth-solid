import { ttc } from "@/app/i18n/ttc"
import { mdiCheckboxMarkedOutline, mdiContentCopy } from "@mdi/js"
import { ButtonIconOnly } from "~ui/interactive/button/ButtonIconOnly"
import { buttonVariant } from "~ui/interactive/button/buttonCva"
import { toastAdd } from "~ui/interactive/toast/toastAdd"
import { toastVariant } from "~ui/interactive/toast/toastVariant"
import type { MayHaveButtonVariant } from "~ui/utils/MayHaveButtonVariant"
import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import type { MayHaveDisabled } from "~ui/utils/MayHaveDisabled"
import { createSignalObject } from "~ui/utils/createSignalObject"

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
