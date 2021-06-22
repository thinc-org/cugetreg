import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { colsCount, rowsCount } from './constants'

interface CellPosition {
  top: number
  left: number
}

interface CellStyles extends CellPosition {
  width: number
  height: number
}

interface Dimensions {
  width: number
  height: number
  cellWidth: number
  cellHeight: number
  stubCellWidth: number
  headerCellHeight: number
  getPosition: (y: number, x: number) => CellPosition
  getCell: (y: number, x: number) => CellStyles
}

export const heightRatio = (6 / 7 / colsCount) * (rowsCount - 0.3)

function getDimensions(width: number): Dimensions {
  const availableWidth = width
  const cellWidth = Math.ceil(availableWidth / colsCount)
  const stubCellWidth = availableWidth - cellWidth * (colsCount - 1)

  const cellHeight = Math.ceil((cellWidth * 6) / 7)

  const height = availableWidth * heightRatio
  const headerCellHeight = height - (rowsCount - 1) * cellHeight

  function getPosition(y: number, x: number): CellPosition {
    let top = 0
    if (y > 0) {
      top += headerCellHeight + (y - 1) * cellHeight
    }
    let left = 0
    const xInt = Math.floor(x)
    const xFrac = x - xInt
    if (xInt > 0) {
      left += stubCellWidth + (xInt - 1) * cellWidth + xFrac * cellWidth
    }
    return { top, left }
  }

  function getCell(y: number, x: number): CellStyles {
    return {
      ...getPosition(y, x),
      width: x > 0 ? cellWidth : stubCellWidth,
      height: y > 0 ? cellHeight : headerCellHeight,
    }
  }

  return { width, height, cellWidth, cellHeight, stubCellWidth, headerCellHeight, getPosition, getCell }
}

const DimensionsContext = createContext({} as Dimensions)

export function useDimensions() {
  return useContext(DimensionsContext)
}

type DimensionsProviderProps = PropsWithChildren<{
  width: number
}>

export function DimensionsProvider({ width, children }: DimensionsProviderProps) {
  const dimensions = useMemo(() => getDimensions(width), [width])
  return <DimensionsContext.Provider value={dimensions}>{children}</DimensionsContext.Provider>
}
