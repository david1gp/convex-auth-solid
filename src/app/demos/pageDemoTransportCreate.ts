import { createResultError } from "#result"

/** Fail-closed adapters for demos that have not implemented local behavior for these operations. */
export function pageDemoTransportCreate() {
  return {
    convexAction<TInput>(_input: TInput) {
      return Promise.resolve(createResultError("pageDemoConvexAction", "Backend actions are disabled in page demos"))
    },
    authenticate<TInput>(_input: TInput) {
      return Promise.resolve(createResultError("pageDemoAuthenticate", "Authentication is disabled in page demos"))
    },
    upload<TInput>(_input: TInput) {
      return Promise.resolve(createResultError("pageDemoUpload", "Uploads are disabled in page demos"))
    },
    useCredential<TInput>(_input: TInput) {
      return Promise.resolve(createResultError("pageDemoCredential", "Credentials are disabled in page demos"))
    },
  }
}
