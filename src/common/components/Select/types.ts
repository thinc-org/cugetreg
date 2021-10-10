export interface SelectProps {
  items: string[]
  value: string
  name: string
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void
}
