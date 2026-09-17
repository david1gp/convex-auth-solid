import type { SignalObject } from "#ui/utils/createSignalObject.ts"
import type { MayHaveChildren } from "#ui/utils/MayHaveChildren.ts"
import type { MayHaveClass } from "#ui/utils/MayHaveClass.ts"
import type { MayHaveId } from "#ui/utils/MayHaveId.ts"

export interface SearchInputProps extends MayHaveId, MayHaveClass, MayHaveChildren {
  searchSignal: SignalObject<string>
  searchState?: object
  debounceMs?: number
  placeholder?: string
}
