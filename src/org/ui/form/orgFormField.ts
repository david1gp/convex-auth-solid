export type OrgFormField = keyof typeof orgFormField

export const orgFormField = {
  name: "name",
  slug: "slug",
  description: "description",
  url: "url",
  image: "image",
} as const
