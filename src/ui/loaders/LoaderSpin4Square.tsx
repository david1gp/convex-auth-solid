import type { MayHaveClass } from "~ui/utils/MayHaveClass"
import { classMerge } from "~ui/utils/classMerge"
import styles from "./LoaderSpin4Square.module.css"

/**
 * https://dev.to/afif/i-made-100-css-loaders-for-your-next-project-4eje
 */
export function LoaderSpin4Square(p: MayHaveClass) {
  return <div class={classMerge(p.class, styles.LoaderSpin4Square)} />
}
