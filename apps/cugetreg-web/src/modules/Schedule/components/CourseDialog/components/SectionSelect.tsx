import { useTranslation } from 'react-i18next'

import { MenuItem, Select } from '@mui/material'

import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { SECTION_CHANGE } from '@web/common/context/Analytics/constants'
import { useCourseDialog } from '@web/modules/Schedule/components/CourseDialog/context'
import { courseCartStore } from '@web/store'

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
