import { cantBeEmpty } from "@/utils/valibot/cantBeEmpty"
import * as a from "valibot"

export const dateTimeLocalSchema = a.pipe(a.string(), a.nonEmpty(cantBeEmpty), a.isoDateTime())
