import { tx } from "~ui/i18n/t1"
import { RandomLoader } from "~ui/static/loaders/RandomLoader"
import { t4loading } from "./t4loading"

export interface LoadingPageProps {
  loadingX?: string
  loadingText?: string
}

export function LoadingPage(p: LoadingPageProps) {
  return (
    <div class={"flex w-full items-center justify-center"}>
      <div class={"flex flex-col items-center m-10"}>
        <h1 class={"text-3xl"}>{p.loadingX ? tx(t4loading.Loading_X, p.loadingX) : p.loadingText}</h1>
        <RandomLoader class={"m-4"} />
      </div>
    </div>
  )
}
