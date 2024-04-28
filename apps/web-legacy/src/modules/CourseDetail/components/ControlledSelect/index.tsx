import { Controller, FieldValues, UseControllerProps } from 'react-hook-form'

import { BaseSelectProps, Select } from '@mui/material'

type ControlledSelectProps<TFieldValues extends FieldValues = FieldValues> =
  UseControllerProps<TFieldValues> & BaseSelectProps

export function ControlledSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  ...selectProps
}: ControlledSelectProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Select {...selectProps} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    />
  )
}
