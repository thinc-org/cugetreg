import { styledWithTheme } from '@/common/utils/styledWithTheme'

import { useDimensions } from '../dimensions'

interface GutterProps {
  x?: number
  y?: number
}

const GutterElement = styledWithTheme('span')((theme) => ({
  position: 'absolute',
  backgroundColor: theme.palette.primaryRange[30],
}))

function Gutter({ x, y }: GutterProps) {
  const { width: tableWidth, height: tableHeight, getPosition } = useDimensions()
  const { left, top } = getPosition(y ?? 0, x ?? 0)
  const width = typeof y === 'number' ? tableWidth + 1 : 1
  const height = typeof x === 'number' ? tableHeight + 1 : 1
  return <GutterElement style={{ left: left - 0.5, top: top - 0.5, width, height }} />
}

export function Gutters() {
  const { daysCount, colsCount } = useDimensions()
  const gutters = []
  for (let x = 0; x <= colsCount; x++) {
    gutters.push(<Gutter key={`x${x}`} x={x} />)
  }
  for (let y = 0; y <= daysCount + 1; y++) {
    gutters.push(<Gutter key={`y${y}`} y={y} />)
  }
  return <>{gutters}</>
}
