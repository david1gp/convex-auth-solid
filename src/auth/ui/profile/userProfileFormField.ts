export type UserProfileFormField = keyof typeof userProfileFormField

export const userProfileFormField = {
  // id
  userId: "userId",
  // data
  name: "name",
  username: "username",
  image: "image",
  email: "email",
  role: "role",
  orgHandle: "orgHandle",
  orgRole: "orgRole",
  createdAt: "createdAt",
} as const