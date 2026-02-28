export interface FilterFieldConfig {
  field: string
  label: () => string
  options: Record<string, string>
  optionLabels: (key: string) => string
  isDateFilter?: boolean
}
