/**
 * format of input and output will be in `HH:MM` string. MM can only be `30` or `00`, HH is not padded by `0`, for example, `9:00`
 * @param startTime start hour And minute format
 * @param endTime end hour And minute
 * @returns Array of time around start time and end time for example startTime: `10:00`, endTime: `11:30` result will be `[10:00, 10:30, 11:00, 11:30]`
 */
export function generateTimeAround(startTime: string, endTime: string) {
  let currentTime = startTime
  const availableTime = [currentTime]
  while (currentTime !== endTime) {
    if (currentTime === '23:30') {
      currentTime = '00:00'
    } else {
      const currentTimeArray = currentTime.split(':')
      const currentHour = currentTimeArray[0]
      const currentMinute = currentTimeArray[1]
      if (currentMinute === '00') {
        currentTime = `${currentHour}:30`
      } else {
        currentTime = `${String(Number(currentHour) + 1).padStart(2, '0')}:00`
      }
    }
    availableTime.push(currentTime)
  }

  return availableTime
}
