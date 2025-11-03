import styles from "@/ui/loaders/AnimateFadeIn.module.css"
import { classArr } from "~ui/utils/classArr"

export function DemoAnimateFadeIn() {
  return <h1 class={classArr("bg-gray-400 p-10 m-10 rounded-xl", styles.animateFadeIn2s)}>Demo Animate Fade In</h1>
}
