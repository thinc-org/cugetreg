import { ChangeEventHandler } from 'react'

import { Stack, Typography } from '@mui/material'

import { Switch } from '@web/common/components/Switch'

interface SettingBlockProps {
  title: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  checked?: boolean
  children?: React.ReactNode
}

export const SettingBlock: React.FC<SettingBlockProps> = ({
  title,
  children,
  onChange,
  checked,
}) => {
  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{title}</Typography>
        {!onChange ? (
          <Typography variant="subtitle1" color="secondaryRange.700">
            เปิดใช้งานตลอดเวลา
          </Typography>
        ) : (
          <Switch onChange={onChange} checked={checked} />
        )}
      </Stack>
      <Stack direction="row" mb={3} mt={1}>
        {children}
      </Stack>
    </div>
  )
}
