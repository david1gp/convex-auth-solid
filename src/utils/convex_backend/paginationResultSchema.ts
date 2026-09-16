import * as a from "valibot"

export function paginationResultSchema<TSchema extends a.GenericSchema>(itemSchema: TSchema) {
  return a.object({
    page: a.array(itemSchema),
    isDone: a.boolean(),
    continueCursor: a.string(),
  })
}
