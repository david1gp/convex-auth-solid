export type OrgFormField = keyof typeof orgFormField

export const orgFormField = {
  // id
  orgHandle: "orgHandle",
  // data
  name: "name",
  description: "description",
  url: "url",
  image: "image",
} as const
