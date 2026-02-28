export type ResourceViewPageSections = keyof typeof resourceViewPageSections

export const resourceViewPageSections = {
  info: "info",
  files: "files",
} as const
