import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import styles from "./LoaderShuffle4Dots.module.css"

/**
 * https://dev.to/afif/adding-100-css-loaders-to-the-collection-of-500-css-loaders-2a3p
 */
export function LoaderShuffle4Dots(p: MayHaveClass) {
  return <div class={classMerge(p.class, styles.LoaderShuffle4Dots)} />
}
