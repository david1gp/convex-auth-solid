import { numRound2 } from "~utils/num/numRound"

export type ServerTimingValues = {
  name: string
  amount: number
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing
 */
export function setServerTimingHeader(r: Response, values: ServerTimingValues[]): Response {
  const headerValue = values.map((v) => v.name + ";dur=" + numRound2(v.amount)).join(", ")
  r.headers.set("Server-Timing", headerValue)
  return r
}

export function setServerTimingHeaderSingleValue(
  r: Response,
  op: string,
  startedAt: number,
  endetAt: number = Date.now(),
): Response {
  const values: ServerTimingValues[] = [{ name: op, amount: numRound2(endetAt - startedAt) }]
  setServerTimingHeader(r, values)
  return r
}
