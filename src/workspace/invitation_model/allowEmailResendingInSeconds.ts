export function allowEmailResendingInSeconds(previousDate: string, attemptAmount: number): number {
  const baseTime = new Date(previousDate).getTime()
  const waitMs = attemptAmount * 60 * 1000
  const canSendAfter = baseTime + waitMs
  const now = Date.now()
  const diff = canSendAfter - now
  if (diff < 0) return 0
  return Math.round(diff / 1000)
}
