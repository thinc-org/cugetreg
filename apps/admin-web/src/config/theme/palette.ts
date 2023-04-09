import { PaletteOptions } from '@mui/material/styles'

export type PaletteRange = 10 | 30 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type HighlightColor =
  | 'pink'
  | 'red'
  | 'orange'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'yellow'
  | 'indigo'
  | 'deepGray'

export type PaletteRangeOptions = Record<PaletteRange, string>

export type HighlightColorRange = Pick<PaletteRangeOptions, 300 | 500 | 700>

declare module '@mui/material/styles' {
  interface Palette {
    white?: string
    primaryRange?: PaletteRangeOptions
    secondaryRange?: Omit<PaletteRangeOptions, 10 | 30>
  }
  interface PaletteOptions {
    white?: string
    primaryRange?: PaletteRangeOptions
    secondaryRange?: Omit<PaletteRangeOptions, 10 | 30>
  }
}

const paletteBaseOptions: PaletteOptions = {
  primary: {
    light: '#E3E5F8',
    main: '#2A2D48',
    dark: '#0C0E1D',
    contrastText: '#FAFAFF',
  },
  secondary: {
    light: '#E3E5F8',
    main: '#FED239',
    dark: '#FCDF7D',
    contrastText: '#2A2D48',
  },
  error: {
    light: '#B10C0C',
    main: '#B10C0C',
    dark: '#B10C0C',
  },
  text: {
    primary: '#2A2D48', // primary main
  },
  primaryRange: {
    10: '#FAFAFF',
    30: '#E3E5F8',
    50: '#C9CCE4',
    100: '#9C9FBA',
    200: '#7C7F9B',
    300: '#555872',
    400: '#393C55',
    500: '#2A2D48',
    600: '#191D36',
    700: '#0C0E1D',
    800: '#050611',
    900: '#02030A',
  },
  secondaryRange: {
    50: '#FFFAE7',
    100: '#FFF2C4',
    200: '#FFE99C',
    300: '#FCDF7D',
    400: '#FED957',
    500: '#FED239',
    600: '#FEC614',
    700: '#FDBC06',
    800: '#F8AA14',
    900: '#EB9C03',
  },
  white: '#FFFFFF',
}

export const lightPaletteOptions: PaletteOptions = {
  ...paletteBaseOptions,
  mode: 'light',
}
