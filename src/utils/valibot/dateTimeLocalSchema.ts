import { cantBeEmpty } from "#src/utils/valibot/cantBeEmpty.js"
import * as a from "valibot"

export const dateTimeLocalSchema = a.pipe(a.string(), a.nonEmpty(cantBeEmpty), a.isoDateTime())
