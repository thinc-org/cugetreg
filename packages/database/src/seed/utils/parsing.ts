export function parsePeriod(str: string) {
  if (!str) {
    return {
      start: null,
      end: null,
    }
  }

  type Expected = {
    period: {
      start: string
      end: string
    }
    date: string
  }

  const {
    period: { start, end },
    date,
  } = JSON.parse(str) as Expected

  const [sH, sM] = start.split(':').map(Number)
  const [eH, eM] = end.split(':').map(Number)

  const realDate = new Date(date)

  const realStart = new Date(realDate)
  realStart.setFullYear(realDate.getFullYear() - 543)
  realStart.setHours(sH)
  realStart.setMinutes(sM)

  const realEnd = new Date(realDate)
  realEnd.setFullYear(realDate.getFullYear() - 543)
  realEnd.setHours(eH)
  realEnd.setMinutes(eM)

  return {
    start: realStart,
    end: realEnd,
  }
}

// console.log(
//   parsePeriod(
//     '{"period":{"start":"13:30","end":"15:30"},"date":"2563-10-07T00:00:00.000Z"}',
//   ),
// )
// console.log(
//   parsePeriod(
//     '{"period":{"end":"15:30","start":"13:30"},"date":"2563-12-02T00:00:00.000Z"}',
//   ),
// )
