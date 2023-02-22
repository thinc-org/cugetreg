import { Typography, styled } from '@mui/material'

import { getExamDate } from '@web/common/utils/getExamDate'
import { getExamPeriod } from '@web/common/utils/getExamPeriod'
import { ExamClass } from '@web/common/utils/types'
import { useColor } from '@web/modules/Schedule/components/ColorPicker/hooks/useColor'

interface ClassCardProps {
  scheduleClass: ExamClass
  order: number
  isFinal: boolean
  className?: string
  isHidden: boolean
}

const ClassCardLayout = styled('div')`
  display: flex;
  justify-content: left;
  align-items: center;
  border-radius: 0.5em;
  padding: ${({ theme }) => theme.spacing(2, 4.5)};
  text-align: center;
`

const TextContainer = styled('div')`
  display: flex;
  margin-left: ${({ theme }) => theme.spacing(3.5)};
  flex-direction: column;
`

const CourseName = styled(Typography)`
  text-align: left;
  font-weight: bold;
`

const ExamTime = styled(Typography)`
  display: flex;
`

const ExamDate = styled('div')`
  text-transform: uppercase;
  margin-right: ${({ theme }) => theme.spacing(4)};
`

export function ExamCard({ scheduleClass, order, isFinal, className, isHidden }: ClassCardProps) {
  const { courseNo, abbrName, hasOverlap, color } = scheduleClass
  const colorScheme = useColor(color, hasOverlap)

  const examDate = getExamDate(scheduleClass, isFinal)
  const examPeriod = getExamPeriod(scheduleClass, isFinal)

  return (
    <ClassCardLayout
      className={className}
      style={{
        opacity: isHidden ? 0.3 : 1,
        border: `1px solid ${colorScheme.border}`,
        color: hasOverlap ? colorScheme.text : undefined,
        backgroundColor: hasOverlap ? colorScheme.background : undefined,
      }}
    >
      <Typography
        variant="h6"
        style={{
          color: colorScheme.border,
        }}
      >
        {order}
      </Typography>
      <TextContainer>
        <CourseName variant="h6">
          {courseNo} {abbrName}
        </CourseName>
        <ExamTime variant="subtitle2">
          <ExamDate>{examDate}</ExamDate>
          <div>{examPeriod}</div>
        </ExamTime>
      </TextContainer>
    </ClassCardLayout>
  )
}
