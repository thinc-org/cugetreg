import { useTranslation } from 'react-i18next'

import { ChevronRight } from '@mui/icons-material'
import { IconButton, Link, Stack, Typography } from '@mui/material'
import { LinkWithAnalytics } from '@web/common/context/Analytics/components/LinkWithAnalytics'
import { COURSE_DIALOG_CHEVRON, COURSE_DIALOG_TITLE } from '@web/common/context/Analytics/constants'
import { useLinkBuilder } from '@web/common/hooks/useLinkBuilder'
import { useCourseDialog } from '@web/modules/Schedule/components/CourseDialog/context'

export function CourseDialogHeader() {
  const { item } = useCourseDialog()
  const { t } = useTranslation('courseDialog')
  const { courseNo, abbrName, credit: credits, courseNameTh, courseNameEn } = item
  const { buildLink } = useLinkBuilder()
  return (
    <Stack spacing={[0.5, 1]}>
      <Stack justifyContent="space-between" direction="row" flex={1} alignItems="flex-start">
        <Stack flexWrap="wrap" direction="row" alignItems="center" columnGap={2}>
          <LinkWithAnalytics
            href={buildLink(`/courses/${courseNo}`)}
            passHref
            elementName={COURSE_DIALOG_TITLE}
            elementId={courseNo}
          >
            <Typography variant="h4" component={Link}>
              {courseNo} {abbrName}
            </Typography>
          </LinkWithAnalytics>
          <Typography variant="h6" color="primaryRange.100">
            {t('credits', { credits })}
          </Typography>
        </Stack>

        <LinkWithAnalytics
          href={buildLink(`/courses/${courseNo}`)}
          passHref
          elementName={COURSE_DIALOG_CHEVRON}
          elementId={courseNo}
        >
          <IconButton aria-label="delete" size="large" sx={{ color: 'primary.500' }}>
            <ChevronRight fontSize="inherit" />
          </IconButton>
        </LinkWithAnalytics>
      </Stack>
      <Stack>
        <Typography variant="h6">{courseNameTh}</Typography>
        <Typography variant="h6">{courseNameEn}</Typography>
      </Stack>
    </Stack>
  )
}
