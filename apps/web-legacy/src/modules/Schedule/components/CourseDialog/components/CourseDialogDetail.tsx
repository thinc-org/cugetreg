import { useTranslation } from 'react-i18next'

import { Stack, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

import { Caption } from '@web/common/components/Caption'
import { GenEdChip } from '@web/common/components/Chips/catagories/GenEdChip'
import { UnstyledTable } from '@web/common/components/UnstyledTable'
import { dayOfWeekMapper } from '@web/common/constants/dayOfWeek'
import { getClassPeriod } from '@web/common/utils/getClassPeriod'
import { getExamDate } from '@web/common/utils/getExamDate'
import { getExamPeriod } from '@web/common/utils/getExamPeriod'
import { SectionStatus } from '@web/modules/CourseDetail/components/SectionStatus'
import { useOverlapWarning } from '@web/modules/Schedule/components/ScheduleTable/components/ScheduleTableCard/utils'
import { courseCartStore } from '@web/store'

import { GenEdType } from '@cgr/codegen'

import { useCourseDialog } from '../context'
import { SectionSelect } from './SectionSelect'

export function CourseDialogDetail() {
  const { item, overlaps } = useCourseDialog()
  const section = courseCartStore
    .item(item)
    ?.sections.find((section) => section.sectionNo === item.selectedSectionNo)
  const warning = useOverlapWarning(overlaps)
  const { t } = useTranslation('courseDialog')

  const { midtermDate, finalDate } = getExamDate(item)
  const { midtermPeriod, finalPeriod } = getExamPeriod(item)

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <SectionSelect />
          {section?.genEdType !== 'NO' && (
            <GenEdChip type={section?.genEdType ?? GenEdType.No} size="small" />
          )}
        </Stack>
        {section && <SectionStatus capacity={section.capacity} closed={section.closed} />}
      </Stack>

      <Typography variant="subtitle1" color="highlight.red.500">
        {warning}
      </Typography>

      <UnstyledTable>
        <TableHead>
          <TableRow>
            <TableCell>
              <Caption>{t('teacher')}</Caption>
            </TableCell>
            <TableCell>
              <Caption>{t('time')}</Caption>
            </TableCell>
            <TableCell>
              <Caption>{t('classRoom')}</Caption>
            </TableCell>
            <TableCell>
              <Caption>{t('classType')}</Caption>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {section?.classes.map((sectionClass, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="subtitle1" sx={{ maxWidth: '15ch' }}>
                  {sectionClass.teachers.join(', ')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  {sectionClass.dayOfWeek && dayOfWeekMapper[sectionClass.dayOfWeek]}{' '}
                  {getClassPeriod(sectionClass)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  {sectionClass.building} {sectionClass.room}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">{sectionClass.type}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </UnstyledTable>

      <Stack direction="row" flexWrap="wrap" rowGap={0.5} columnGap={4}>
        <Stack spacing={0.5}>
          <Caption>{t('midtermExam')}</Caption>
          <Typography variant="subtitle1">
            {item.midterm?.date ? `${midtermDate} ${midtermPeriod}` : 'TBA'}
          </Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Caption>{t('finalExam')}</Caption>
          <Typography variant="subtitle1">
            {item.final?.date ? `${finalDate} ${finalPeriod}` : 'TBA'}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
