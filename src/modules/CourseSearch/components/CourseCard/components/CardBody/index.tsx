import { CardContent, Collapse, Stack } from '@mui/material'

import { CardDescription } from '@/modules/CourseSearch/components/CourseCard/components/CardDescription'
import { CardHiddenDescription } from '@/modules/CourseSearch/components/CourseCard/components/CardHiddenDescription'
import { CardSideActions } from '@/modules/CourseSearch/components/CourseCard/components/CardSideActions'
import { useCourseCard } from '@/modules/CourseSearch/components/CourseCard/context'

export function CardBody() {
  const { isExpanded } = useCourseCard()
  return (
    <CardContent sx={{ px: 4, py: 2 }}>
      <Stack direction={['column', 'row']} justifyContent="space-between">
        <Stack>
          <CardDescription />
          <Collapse in={isExpanded}>
            <CardHiddenDescription />
          </Collapse>
        </Stack>
        <CardSideActions />
      </Stack>
    </CardContent>
  )
}
