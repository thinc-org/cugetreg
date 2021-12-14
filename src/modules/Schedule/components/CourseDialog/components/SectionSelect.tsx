import { MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SECTION_CHANGE } from '@/common/context/Analytics/constants'
import { useCourseDialog } from '@/modules/Schedule/components/CourseDialog/context'
import { courseCartStore } from '@/store'

export function SectionSelect() {
  const { item } = useCourseDialog()
  const { courseNo, selectedSectionNo } = item
  const { t } = useTranslation('courseDialog')
  return (
    <Analytics elementName={SECTION_CHANGE} elementId={courseNo}>
      {({ log }) => (
        <Select
          value={selectedSectionNo}
          onChange={(e) => {
            const sectionNumber = e.target.value as string
            log(null, sectionNumber)
            courseCartStore.addItem(item, sectionNumber)
          }}
        >
          {item.sections.map((sec) => (
            <MenuItem key={sec.sectionNo} value={sec.sectionNo}>
              {t('sectionLabel', { section: sec.sectionNo })}
            </MenuItem>
          ))}
        </Select>
      )}
    </Analytics>
  )
}
