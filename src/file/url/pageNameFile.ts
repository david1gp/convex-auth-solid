export type PageNameFile = keyof typeof pageNameFile

export const pageNameFile = {
  resourceFileAdd: "resourceFileAdd",
  resourceFileEdit: "resourceFileEdit",
  resourceFileRemove: "resourceFileRemove",
} as const
