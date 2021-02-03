import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { colsCount, rowsCount, strokeSize } from './constants'

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

function getDimensions(width: number): Dimensions {
  const availableWidth = width - (colsCount + 1) * strokeSize
  const cellWidth = Math.ceil(availableWidth / colsCount)
  const stubCellWidth = availableWidth - cellWidth * (colsCount - 1)

  const cellHeight = Math.ceil((cellWidth * 6) / 7)
  const headerCellHeight = Math.floor(cellHeight / 2)

  const height = (rowsCount + 1) * strokeSize + headerCellHeight + (rowsCount - 1) * cellHeight

  function getPosition(y: number, x: number): CellPosition {
    let top = strokeSize
    if (y > 0) {
      top += y * strokeSize + headerCellHeight + (y - 1) * cellHeight
    }
    let left = strokeSize
    const xInt = Math.floor(x)
    const xFrac = x - xInt
    if (xInt > 0) {
      left += xInt * strokeSize + stubCellWidth + (xInt - 1) * cellWidth + xFrac * cellWidth
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
