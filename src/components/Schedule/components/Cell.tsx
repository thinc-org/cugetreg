import { styled } from '@material-ui/core'
import { PropsWithChildren } from 'react'
import { useDimensions } from '../dimensions'

type CellProps = PropsWithChildren<{
  x: number
  y: number
}>

const CellLayout = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.primaryRange[10],
  textAlign: 'center',
}))

export function Cell({ x, y, children }: CellProps) {
  const { getCell } = useDimensions()
  return <CellLayout style={{ ...getCell(y, x) }}>{children}</CellLayout>
}
