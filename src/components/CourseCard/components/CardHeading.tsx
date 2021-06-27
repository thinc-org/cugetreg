import { Box, CardHeader, Grid, IconButton, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import GenEdChip from '@/components/Chips/catagories/GenEdChip'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Analytics } from '@/components/Analytics'
import { COURSE_TITLE, EXPAND_BUTTON } from '@/components/Analytics/const'

import { useCourseCardContext } from '../useCourseCard'
import styled from '@emotion/styled'

const StyledLink = styled.a`
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: 0.2s ease-in-out;
  :hover {
    text-decoration-color: ${({ theme }) => theme.palette.primary.main};
  }
`

interface CardHeadingProps {
  isExpanded: boolean
  onToggle: () => void
}

export function CardHeading({ isExpanded, onToggle }: CardHeadingProps) {
  const { t } = useTranslation('courseCard')
  const { course, isGenEd } = useCourseCardContext()
  const { studyProgram } = useCourseGroup()

  return (
    <CardHeader
      sx={{ p: 4, pb: 0, pt: 3 }}
      title={
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Grid container spacing={1}>
            <Grid item>
              <Analytics elementName={COURSE_TITLE} elementId={course.courseNo}>
                {({ log }) => (
                  <Link href={`/${studyProgram}/courses/${course.courseNo}`} passHref>
                    <StyledLink>
                      <Typography onClick={log} variant="h5" color="primaryRange.500">
                        {course.courseNo} {course.abbrName}
                      </Typography>
                    </StyledLink>
                  </Link>
                )}
              </Analytics>
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
        <Analytics elementName={EXPAND_BUTTON} elementId={course.courseNo}>
          {({ log }) => (
            <IconButton
              onClick={() => {
                onToggle()
                log()
              }}
              color="primary"
            >
              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </Analytics>
      }
    />
  )
}
