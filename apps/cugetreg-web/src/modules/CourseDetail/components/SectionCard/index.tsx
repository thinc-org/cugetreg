import { useTranslation } from 'react-i18next'

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material'

import { Course, Section } from '@cugetreg/codegen'

import { Caption } from '@web/common/components/Caption'
import { GenEdChip } from '@web/common/components/Chips/catagories/GenEdChip'
import { SelectButton } from '@web/common/components/SelectButton'
import { UnstyledTable } from '@web/common/components/UnstyledTable'
import { dayOfWeekMapper } from '@web/common/constants/dayOfWeek'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { SUBJECT_SELECT_BUTTON_WITH_SECTION } from '@web/common/context/Analytics/constants'
import { getClassPeriod } from '@web/common/utils/getClassPeriod'

import { SectionStatus } from '../SectionStatus'

const SectionTitle = styled(Typography)`
  margin-right: ${({ theme }) => theme.spacing(2)};
`

interface SectionCardProps {
  section: Section
  course: Course
  className?: string
}

export const SectionCard = (props: SectionCardProps) => {
  const { section, course, className } = props
  const { t } = useTranslation('sectionCard')

  return (
    <Card variant="outlined" className={className}>
      <CardHeader
        sx={{ p: { xs: 2, sm: 4 }, pb: { xs: 0, sm: 0 }, pt: { xs: 2, sm: 3 } }}
        title={
          <Stack direction="row" justifyContent="space-between">
            <Grid container spacing={1}>
              <Grid item>
                <SectionTitle variant="h5">
                  {t('section', { sectionNo: section.sectionNo })}
                </SectionTitle>
              </Grid>
              {section.genEdType !== 'NO' && (
                <Grid item>
                  <GenEdChip type={section.genEdType} />
                </Grid>
              )}
            </Grid>
            <SectionStatus capacity={section.capacity} closed={section.closed} />
          </Stack>
        }
      />
      <CardContent sx={{ px: { xs: 2, sm: 4 }, py: 2, pt: { xs: 2, sm: 1 } }}>
        <Stack direction={['column', 'row']} justifyContent="space-between">
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
              {section.classes.map((sectionClass, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body1" sx={{ maxWidth: '15ch' }}>
                      {sectionClass.teachers.join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" key={index}>
                      {sectionClass.dayOfWeek && dayOfWeekMapper[sectionClass.dayOfWeek]}{' '}
                      {getClassPeriod(sectionClass)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" key={index}>
                      {sectionClass.building} {sectionClass.room}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" key={index}>
                      {sectionClass.type}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </UnstyledTable>
          <Stack
            sx={{
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'flex-end',
              flexBasis: 'auto',
              ml: 2,
            }}
          >
            <Analytics
              elementName={SUBJECT_SELECT_BUTTON_WITH_SECTION}
              pathId={course.courseNo}
              elementId={section.sectionNo}
            >
              {({ log }) => (
                <SelectButton log={log} course={course} selectedSectionNumber={section.sectionNo} />
              )}
            </Analytics>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ p: { xs: 2, sm: 4 }, pt: { xs: 0, sm: 0 }, display: { sm: 'none' } }}>
        <Analytics
          elementName={SUBJECT_SELECT_BUTTON_WITH_SECTION}
          pathId={course.courseNo}
          elementId={section.sectionNo}
        >
          {({ log }) => (
            <SelectButton log={log} course={course} selectedSectionNumber={section.sectionNo} />
          )}
        </Analytics>
      </CardActions>
    </Card>
  )
}
