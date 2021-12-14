import { styled } from '@mui/system'

import { ScheduleColor } from '@/modules/Schedule/components/ColorPicker/constants'
import { ColorScheme, useColor } from '@/modules/Schedule/components/ColorPicker/hooks/useColor'

export interface ColorCircleProps {
  color: ScheduleColor
  size?: number
}

interface CircleProps {
  size: number
  scheme: ColorScheme
}

const Circle = styled('div')<CircleProps>((props) => ({
  width: props.size,
  height: props.size,
  minWidth: props.size,
  minHeight: props.size,
  background: props.scheme.background,
  border: `1px solid ${props.scheme.border}`,
  borderRadius: 100,
}))

export const ColorCircle = ({ color, size = 40 }: ColorCircleProps) => {
  const scheme = useColor(color)
  return <Circle size={size} scheme={scheme} />
}
