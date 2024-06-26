interface TermOption {
  academicYear: string
  semester: string
  label: string
}

export const termOptions: TermOption[] = [
  { academicYear: '2567', semester: '3', label: '2567/ฤดูร้อน' },
  { academicYear: '2567', semester: '2', label: '2567/2' },
  { academicYear: '2567', semester: '1', label: '2567/1' },
  { academicYear: '2566', semester: '3', label: '2566/ฤดูร้อน' },
  { academicYear: '2566', semester: '2', label: '2566/2' },
  { academicYear: '2566', semester: '1', label: '2566/1' },
  { academicYear: '2565', semester: '3', label: '2565/ฤดูร้อน' },
  { academicYear: '2565', semester: '2', label: '2565/2' },
  { academicYear: '2565', semester: '1', label: '2565/1' },
  { academicYear: '2564', semester: '3', label: '2564/ฤดูร้อน' },
  { academicYear: '2564', semester: '2', label: '2564/2' },
  { academicYear: '2564', semester: '1', label: '2564/1' },
]

export const tempHardCodedCurrentTerm = termOptions[2]
