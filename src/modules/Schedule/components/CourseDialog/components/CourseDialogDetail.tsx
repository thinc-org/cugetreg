import { Stack, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Caption } from '@/common/components/Caption'
import { GenEdChip } from '@/common/components/Chips/catagories/GenEdChip'
import { UnstyledTable } from '@/common/components/UnstyledTable'
import { dayOfWeekMapper } from '@/common/constants/dayOfWeek'
import { getExamDate } from '@/common/utils/getExamData'
import { getExamPeriod } from '@/common/utils/getExamPeriod'
import { SectionStatus } from '@/modules/CourseDetail/components/SectionCard/components/SectionStatus'
import { useOverlapWarning } from '@/modules/Schedule/components/ScheduleTable/components/ScheduleTableCard/utils'
import { courseCartStore } from '@/store'

import { useCourseDialog } from '../context'
import { SectionSelect } from './SectionSelect'

export function CourseDialogDetail() {
  const { item, overlaps } = useCourseDialog()
  const section = courseCartStore.item(item)!.sections.find((section) => section.sectionNo === item.selectedSectionNo)!
  const warning = useOverlapWarning(overlaps)
  const { t } = useTranslation('courseDialog')

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <SectionSelect />
          {item.genEdType !== 'NO' && <GenEdChip type={item.genEdType} size="small" />}
        </Stack>
        <SectionStatus
          capacity={section.capacity}
          status={section.closed ? 'closed' : section.capacity.current >= section.capacity.max ? 'full' : 'avialable'}
        />
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
                  {sectionClass.period && [`${sectionClass.period.start}`, `${sectionClass.period.end}`].join('-')}
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
            {getExamPeriod(item, false)} {getExamDate(item, false)}
          </Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Caption>{t('finalExam')}</Caption>
          <Typography variant="subtitle1">
            {getExamPeriod(item, true)} {getExamDate(item, true)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
