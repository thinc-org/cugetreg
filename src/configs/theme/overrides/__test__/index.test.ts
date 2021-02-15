import { lightTheme } from '../..'
import { HighlightColor, HighlightColorRange } from '../../palette'
import { highlightMapper, highlightStyleGenerator } from '../utils'

describe('Test overrides util functions', () => {
  const theme = lightTheme
  const mockHighlightMapper = jest.fn(highlightMapper)
  const mockStyleProperties = jest.fn((highlight: HighlightColorRange) => ({
    color: highlight[300],
  }))
  const mockHighlightStyleGenerator = jest.fn(highlightStyleGenerator)

  it('Test highlightMapper function', () => {
    const highlightColor = Object.keys(theme.palette.highlight) as HighlightColor[]
    highlightColor.forEach((color) => {
      expect(mockHighlightMapper(color, theme)).toHaveProperty('300')
      expect(mockHighlightMapper(color, theme)).toHaveProperty('500')
      expect(mockHighlightMapper(color, theme)).toHaveProperty('700')
    })
  })

  it('Test highlightStyleGenerator function', () => {
    const highlightColor = Object.keys(theme.palette.highlight) as HighlightColor[]
    const expected = highlightColor.map((val) => `&.${val}`)
    highlightColor.forEach((color, index) => {
      expect(Object.keys(mockHighlightStyleGenerator(mockStyleProperties, theme))).toEqual(
        expect.arrayContaining(expected)
      )
      expect(mockStyleProperties).toHaveBeenCalledTimes((index + 1) * highlightColor.length)
    })
  })
})
