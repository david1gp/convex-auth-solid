import type { HasClass } from "~ui/utils/HasClass"
import { classMerge } from "~ui/utils/classMerge"
import styles from "./LoaderShuffle9Squares.module.css"

/**
 * https://dev.to/afif/adding-100-css-loaders-to-the-collection-of-500-css-loaders-2a3p
 */
export function LoaderShuffle9Squares(p: HasClass) {
  return <div class={classMerge(p.class, styles.LoaderShuffle9Squares)} />
}
