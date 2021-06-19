import { useState } from 'react'
import { EnhancedCheckBoxProps } from '@/components/FilterBar/components/CheckboxGroup'

interface State {
  [key: string]: boolean
}

export interface CreateCheckbox {
  label: string
  value: string
}

export function useFilterBar(initCheckboxes: CreateCheckbox[]) {
  const [state, setState] = useState<State>({})

  const onCheckboxClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = event.target as HTMLInputElement
    setState((state) => ({ ...state, [target.name]: target.checked }))
  }

  const checkboxes: EnhancedCheckBoxProps[] = initCheckboxes.map((value) => ({
    ...value,
    name: value.label,
    onClick: onCheckboxClick,
  }))

  return { state, checkboxes }
}
