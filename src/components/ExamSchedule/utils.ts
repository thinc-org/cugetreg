import { ExamClass } from './components/ExamCard'

export function sortExamSchedule(classes: ExamClass[], isMidterm: boolean) {
  const hasExamClasses: ExamClass[] = []
  const notHasExamClasses: ExamClass[] = []
  classes.forEach((class_) => {
    if (isMidterm) {
      if (class_.midterm) {
        hasExamClasses.push(class_)
      } else {
        notHasExamClasses.push(class_)
      }
    } else {
      if (class_.final) {
        hasExamClasses.push(class_)
      } else {
        notHasExamClasses.push(class_)
      }
    }
  })

  console.log(hasExamClasses, notHasExamClasses, isMidterm)

  const hasExamClassesSorted = hasExamClasses.sort((a, b) => {
    const bExam = isMidterm ? b.midterm : b.final
    const aExam = isMidterm ? a.midterm : a.final
    const dateCompare = aExam!.date.getTime() - bExam!.date.getTime()
    const hourCompare = Number(aExam!.period.start.split(':')[0]) - Number(bExam!.period.start.split(':')[0])
    const minuteCompare = Number(aExam!.period.start.split(':')[1]) - Number(bExam!.period.start.split(':')[1])
    return dateCompare || hourCompare || minuteCompare
  })

  return hasExamClassesSorted.concat(notHasExamClasses)
}
