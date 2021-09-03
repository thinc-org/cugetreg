import styled from '@emotion/styled'
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { Course, Section } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'

import { GenEdChip } from '@/common/components/Chips/catagories/GenEdChip'
import { SelectButton } from '@/common/components/SelectButton'
import { dayOfWeekMapper } from '@/common/constants/dayOfWeek'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SUBJECT_SELECT_BUTTON_WITH_SECTION } from '@/common/context/Analytics/constants'
import { Flex } from '@/components/Flex'
import { SectionStatus } from '@/modules/CourseDetail/components/SectionCard/components/SectionStatus'
import { Caption } from '@/modules/CourseSearch/components/CourseCard/components/Caption'

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
          <Flex direction="row" justify="space-between">
            <Grid container spacing={1}>
              <Grid item>
                <SectionTitle variant="h5">{t('section', { sectionNo: section.sectionNo })}</SectionTitle>
              </Grid>
              {course.genEdType !== 'NO' && (
                <Grid item>
                  <GenEdChip type={course.genEdType} />
                </Grid>
              )}
            </Grid>
            <SectionStatus
              capacity={section.capacity}
              status={
                section.closed ? 'closed' : section.capacity.current >= section.capacity.max ? 'full' : 'avialable'
              }
            />
          </Flex>
        }
      />
      <CardContent sx={{ px: { xs: 2, sm: 4 }, py: 2, pt: { xs: 2, sm: 1 } }}>
        <Flex direction={['column', 'row']} justify="space-between">
          <Table
            sx={{
              width: { xs: '100%', sm: 'auto' },
              'td, th': { border: 0, p: 0 },
              'td ~ td, th ~ th': {
                pl: { xs: 2, sm: 5 },
              },
            }}
          >
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
                      {sectionClass.dayOfWeek && dayOfWeekMapper[sectionClass.dayOfWeek]} {sectionClass.period?.start}-
                      {sectionClass.period?.end}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" key={index}>
                      {sectionClass.building} {sectionClass.room}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              {({ log }) => <SelectButton log={log} course={course} selectedSectionNumber={section.sectionNo} />}
            </Analytics>
          </Stack>
        </Flex>
      </CardContent>
      <CardActions sx={{ p: { xs: 2, sm: 4 }, pt: { xs: 0, sm: 0 }, display: { sm: 'none' } }}>
        <Analytics
          elementName={SUBJECT_SELECT_BUTTON_WITH_SECTION}
          pathId={course.courseNo}
          elementId={section.sectionNo}
        >
          {({ log }) => <SelectButton log={log} course={course} selectedSectionNumber={section.sectionNo} />}
        </Analytics>
      </CardActions>
    </Card>
  )
}
