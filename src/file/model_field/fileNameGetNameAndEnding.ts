export function fileNameGetNameAndEnding(name: string): [string, string] {
  const split = name.split(".")
  // console.log("getEnding", name, split.length, "->", split)
  if (split.length <= 1) return [name, ""]
  const last = split.pop()
  if (!last) return [name, ""]

  const ending = last
    .toLocaleLowerCase()
    .trim()
    .replace(/[^A-Za-z0-9]/g, "")

  if (ending === "jpeg") {
    return [split.join("-"), ".jpg"]
  }

  if (!ending) return [split.join("."), ""] // Return name without the empty ending part

  // Limit ending to max 5 characters
  const limitedEnding = ending.substring(0, 5)

  return [split.join("-"), "." + limitedEnding]
}
