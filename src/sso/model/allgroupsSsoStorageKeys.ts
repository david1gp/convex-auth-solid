/** Storage keys for allgroups automatic sign-in preference and bounded attempt tracking. */
export const allgroupsSsoStorageKeys = {
  preference: "allgroups:ui:auth:auto-sign-in",
  attempts: "allgroups:ui:auth:auto-sign-in-attempts",
} as const
