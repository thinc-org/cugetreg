import { PaletteRange } from '@/configs/theme/palette'
import { CourseCart, CourseCartItem } from '@/store'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, Theme } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useCallback } from 'react'

export interface ScheduleTableCardProps {
  cart: CourseCart
  item: CourseCartItem
}

function primaryRange(lum: PaletteRange) {
  return ({ theme }: { theme: Theme }) => theme.palette.primaryRange[lum]
}

const CardLayout = styled.div`
  display: flex;
  margin-top: 24px;
`

const VisibilityToggle = styled(Button)<{ checked: boolean }>`
  width: 88px;
  border: 1px solid ${primaryRange(50)};
  border-right: none;
  border-radius: 4px 0 0 4px;

  ${({ theme, checked }) => {
    const { primaryRange } = theme.palette
    if (checked) {
      return css`
        background-color: ${primaryRange[50]};
        &:hover {
          background-color: ${primaryRange[100]};
        }
      `
    } else {
      return css`
        background-color: ${primaryRange[10]};
        &:hover {
          background-color: ${primaryRange[30]};
        }
      `
    }
  }}
`

const RightPane = styled.div`
  border: 1px solid ${primaryRange(50)};
  border-left: none;
  border-radius: 0 4px 4px 0;
`

export const ScheduleTableCard = observer(({ cart, item }: ScheduleTableCardProps) => {
  const { courseNo } = item
  const toggleVisibility = useCallback(() => {
    cart.toggleHiddenItem(courseNo)
  }, [cart, courseNo])
  return (
    <CardLayout>
      <VisibilityToggle checked={!item.isHidden} onClick={toggleVisibility} />
      <RightPane>
        {item.courseNo} {item.abbrName}
      </RightPane>
    </CardLayout>
  )
})
