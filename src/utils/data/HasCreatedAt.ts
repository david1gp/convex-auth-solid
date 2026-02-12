export interface HasCreatedAt {
  createdAt: string
}

export function createdAtCreate(date: string = ""): HasCreatedAt {
  return {
    createdAt: date || new Date().toISOString(),
  }
}
