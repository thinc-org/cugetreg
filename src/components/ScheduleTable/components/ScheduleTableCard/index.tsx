import { CourseCartItem, courseCartStore } from '@/store'
import { FormControl, IconButton, MenuItem, Select, Typography, useTheme } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { CardLayout, HeaderLayout, RightPane, Spacer, VisibilityToggle } from './styled'

export interface ScheduleTableCardProps {
  item: CourseCartItem
}

export const ScheduleTableCard = observer(({ item }: ScheduleTableCardProps) => {
  const { courseNo } = item
  const toggleVisibility = useCallback(() => {
    courseCartStore.toggleHiddenItem(courseNo)
  }, [courseNo])
  return (
    <CardLayout>
      <VisibilityToggle checked={!item.isHidden} onClick={toggleVisibility}>
        {item.isHidden ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </VisibilityToggle>
      <RightPane>
        <CardHeader item={item} />
      </RightPane>
    </CardLayout>
  )
})

function CardHeader({ item }: ScheduleTableCardProps) {
  const { t } = useTranslation('scheduleTableCard')
  const theme = useTheme()
  return (
    <HeaderLayout>
      <Typography variant="h5" style={{ marginRight: 16 }}>
        {item.courseNo} {item.abbrName}
      </Typography>
      <Typography variant="h6" color={theme.palette.primaryRange[100]} style={{ marginRight: 32 }}>
        {t('credits', { credits: item.credit })}
      </Typography>
      <FormControl size="small">
        <Select
          value={item.selectedSectionNo}
          onChange={(e) => courseCartStore.addItem(item, e.target.value as string)}
        >
          {item.sections.map((sec) => (
            <MenuItem key={sec.sectionNo} value={sec.sectionNo}>
              {t('sectionLabel', { section: sec.sectionNo })}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Spacer />
      <IconButton aria-label={t('delete')} onClick={() => courseCartStore.removeCourse(item)}>
        <MdDelete />
      </IconButton>
    </HeaderLayout>
  )
}
