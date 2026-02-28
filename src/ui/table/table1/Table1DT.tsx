import { ttl } from "@/app/i18n/ttl"
import { tbNoEntries } from "@/ui/table/table1/i18n/tbNoEntries"
import { Table1D, type Table1aDProps } from "~ui/table/table1/Table1D"
import type { Table1DTexts } from "~ui/table/table1/Table1DTexts"

export function Table1DT<T>(p: Omit<Table1aDProps<T>, "translate">) {
  const texts: Table1DTexts = {
    noEntries: ttl(tbNoEntries),
  }
  return <Table1D texts={texts} {...p} />
}
