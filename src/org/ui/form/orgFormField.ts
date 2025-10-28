export type OrgFormField = keyof typeof orgFormField

export const orgFormField = {
  name: "name",
  handle: "handle",
  description: "description",
  url: "url",
  image: "image",
} as const
