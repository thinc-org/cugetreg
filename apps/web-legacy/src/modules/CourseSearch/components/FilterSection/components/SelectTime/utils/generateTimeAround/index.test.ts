import { describe, expect, it } from 'vitest'

import { generateTimeAround } from '.'

describe('generateTimeAround', () => {
  it.each`
    startTime  | endTime    | expectedResult
    ${'09:00'} | ${'11:00'} | ${['09:00', '09:30', '10:00', '10:30', '11:00']}
    ${'10:30'} | ${'12:30'} | ${['10:30', '11:00', '11:30', '12:00', '12:30']}
    ${'10:30'} | ${'10:30'} | ${['10:30']}
    ${'08:00'} | ${'08:00'} | ${['08:00']}
    ${'23:00'} | ${'01:00'} | ${['23:00', '23:30', '00:00', '00:30', '01:00']}
  `(
    'should generate result correctly when startTime: $startTime, endTime: $endTime',
    ({ startTime, endTime, expectedResult }) => {
      const result = generateTimeAround(startTime, endTime)
      expect(result).toEqual(expectedResult)
    }
  )
})
