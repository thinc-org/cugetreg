import { withContentRect } from 'react-measure'
import { styled } from '@material-ui/core'
import { Header } from './components/Header'
import { DimensionsProvider, useDimensions } from './dimensions'
import { Gutters } from './components/Gutters'

const ScheduleTable = styled('div')(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.paper,
  fontSize: 16,
}))

function Schedule() {
  const { width, height, cellWidth } = useDimensions()
  const fontSize = (16 * cellWidth) / 77
  return (
    <ScheduleTable style={{ width, height, fontSize }}>
      <Header />
      <Gutters />
    </ScheduleTable>
  )
}

const AutoScaleSchedule = withContentRect('bounds')(({ measureRef, contentRect }) => (
  <>
    <div ref={measureRef} style={{ width: '100%' }} />
    {contentRect.bounds?.width ? (
      <DimensionsProvider width={contentRect.bounds.width}>
        <Schedule />
      </DimensionsProvider>
    ) : null}
  </>
))

export { AutoScaleSchedule as Schedule }
