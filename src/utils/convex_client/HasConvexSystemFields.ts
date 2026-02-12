export type HasConvexSystemFields<T extends string> = {
  _id: T
  _creationTime: number
}

export function convexSystemFieldsCreateEmpty<T extends string>(): HasConvexSystemFields<T> {
  return { _id: "" as T, _creationTime: 0 }
}
