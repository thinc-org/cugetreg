import { useTranslation } from 'react-i18next'

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import { CardHeader, Grid, IconButton, Link, Stack, Typography } from '@mui/material'

import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@web/common/context/Analytics/components/LinkWithAnalytics'
import { COURSE_TITLE, EXPAND_BUTTON } from '@web/common/context/Analytics/constants'
import { useLinkBuilderWithCourseGroup } from '@web/common/hooks/useLinkBuilder'
import { useCourseCard } from '@web/modules/CourseSearch/components/CourseCard/context'

import { GenEdChip } from '@libs/react-ui'

export function CardHead() {
  const { t } = useTranslation('courseCard')
  const { course, isGenEd, isExpanded, onToggle } = useCourseCard()
  const { buildLink } = useLinkBuilderWithCourseGroup(course)

  return (
    <CardHeader
      sx={{ p: 4, pb: 0, pt: 3 }}
      title={
        <Stack direction="row" justifyContent="space-between">
          <Grid container spacing={1}>
            <Grid item>
              <LinkWithAnalytics
                href={buildLink(`/courses/${course.courseNo}`)}
                passHref
                elementName={COURSE_TITLE}
                elementId={course.courseNo}
              >
                <Typography variant="h5" color="primaryRange.500" component={Link}>
                  {course.courseNo} {course.abbrName}
                </Typography>
              </LinkWithAnalytics>
            </Grid>
            <Grid item>
              <Typography variant="h6" color="primaryRange.100">
                {t('credit', { credit: course.credit })}
              </Typography>
            </Grid>
            {isGenEd && (
              <Grid item>
                <GenEdChip
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  type={course.genEdType}
                />
              </Grid>
            )}
          </Grid>
          {/* rating is not implemented yet */}
          {/* {isGenEd && (
            <Stack direction="row" spacing={0.25} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Star />
              <Typography variant="h6">{rating}</Typography>
            </Stack>
          )} */}
        </Stack>
      }
      action={
        <Analytics elementName={EXPAND_BUTTON} elementId={course.courseNo}>
          <IconButton onClick={onToggle} color="primary">
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Analytics>
      }
    />
  )
}
