import { cantBeEmpty } from "#src/utils/valibot/cantBeEmpty.ts"
import * as a from "valibot"

export const dateTimeLocalSchema = a.pipe(a.string(), a.nonEmpty(cantBeEmpty), a.isoDateTime())
