export type AuthImage = (typeof authIllustration)[number]

export const authIllustration = [
  "sign_in_1.svg",
  "sign_in_2.svg",
  "sign_in_3.svg",
  "sign_in_4.svg",
  "sign_in_5.svg",
  "sign_in_6.svg",
  "sign_in_7.svg",
  "sign_in_8.svg",
  "sign_in_9.svg",
] as const

export function selectAuthIllustration(): AuthImage {
  const day = new Date().getDate()
  const index = (day - 1) % authIllustration.length
  return authIllustration[index]!
}
