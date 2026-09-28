export function signInErrorPageStateCreate() {
  return { errorMessage: new URLSearchParams(document.location.search).get("errorMessage") }
}
