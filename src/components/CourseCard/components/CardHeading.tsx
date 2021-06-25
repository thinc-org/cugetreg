import { Box, CardHeader, Grid, IconButton, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import GenEdChip from '@/components/Chips/catagories/GenEdChip'
import { useCourseCardContext } from '../useCourseCard'
import { useTranslation } from 'react-i18next'

interface CardHeadingProps {
  isExpanded: boolean
  onToggle: () => void
}

export function CardHeading({ isExpanded, onToggle }: CardHeadingProps) {
  const { t } = useTranslation('courseCard')
  const { course, isGenEd } = useCourseCardContext()
  return (
    <CardHeader
      sx={{ p: 4, pb: 0, pt: 3 }}
      title={
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Grid container spacing={1}>
            <Grid item>
              <Typography variant="h5">
                {course.courseNo} {course.abbrName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" color="primaryRange.100">
                {t('credit', { credit: course.credit })}
              </Typography>
            </Grid>
            {isGenEd && (
              <Grid item>
                <GenEdChip sx={{ display: { xs: 'none', sm: 'inline-flex' } }} type={course.genEdType} />
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
        </Box>
      }
      action={
        <IconButton onClick={onToggle} color="primary">
          {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      }
    />
  )
}
