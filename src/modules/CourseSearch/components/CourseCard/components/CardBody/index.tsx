import { CardContent, Collapse, Stack } from '@material-ui/core'

import { CardDescription } from '@/modules/CourseSearch/components/CourseCard/components/CardBody/components/CardDescription'
import { CardHiddenDescription } from '@/modules/CourseSearch/components/CourseCard/components/CardBody/components/CardHiddenDescription'
import { CardSideActions } from '@/modules/CourseSearch/components/CourseCard/components/CardBody/components/CardSideActions'
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
