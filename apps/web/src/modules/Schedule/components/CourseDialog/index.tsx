import { Stack } from '@mui/material'
import { ResponsiveDialog, ResposiveDialogProps } from '@web/common/components/ResponsiveDialog'
import { CourseDialogActions } from '@web/modules/Schedule/components/CourseDialog/components/CourseDialogActions'
import { CourseDialogColorPicker } from '@web/modules/Schedule/components/CourseDialog/components/CourseDialogColorPicker'
import { CourseDialogDetail } from '@web/modules/Schedule/components/CourseDialog/components/CourseDialogDetail'
import { CourseDialogHeader } from '@web/modules/Schedule/components/CourseDialog/components/CourseDialogHeader'
import { CourseDialogContext } from '@web/modules/Schedule/components/CourseDialog/context'
import { CourseDialogContextValue } from '@web/modules/Schedule/components/CourseDialog/context/types'

export type CourseDialogProps = ResposiveDialogProps & CourseDialogContextValue

export function CourseDialog(props: CourseDialogProps) {
  const { item, overlaps, onClose, open, onRemove } = props
  return (
    <CourseDialogContext.Provider value={{ item, overlaps, onClose, onRemove }}>
      <ResponsiveDialog onClose={onClose} open={open}>
        <Stack spacing={[2, 4]} p={[3.5, 4]}>
          <CourseDialogHeader />
          <CourseDialogDetail />
          <CourseDialogColorPicker />
          <CourseDialogActions />
        </Stack>
      </ResponsiveDialog>
    </CourseDialogContext.Provider>
  )
}
