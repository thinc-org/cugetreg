import { CustomButton } from '@/components/common/CustomButton'
import { Add } from '@material-ui/icons'
import { Course } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'

interface SelectButtonProps {
  course: Course
}

export function SelectButton({}: SelectButtonProps) {
  const { t } = useTranslation('courseCard')
  return (
    <CustomButton loading={false} startIcon={<Add />} color="primary" variant="contained" fullWidth disableElevation>
      {t('select')}
    </CustomButton>
  )
}
