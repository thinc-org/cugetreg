import { PaletteOptions } from '@material-ui/core/styles/createPalette'

export type PaletteRange = 10 | 30 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type PaletteRangeOptions = Record<PaletteRange, string>

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    primaryRange: PaletteRangeOptions
    secondaryRange: Omit<PaletteRangeOptions, 10 | 30>
  }
  interface PaletteOptions {
    primaryRange: PaletteRangeOptions
    secondaryRange: Omit<PaletteRangeOptions, 10 | 30>
  }
}

const palette: PaletteOptions = {
  primary: {
    light: '#E3E5F8',
    main: '#2A2D48',
    dark: '#0C0E1D',
  },
  secondary: {
    light: '#E3E5F8',
    main: '#FED239',
    dark: '#FCDF7D',
  },
  error: {
    light: '#B10C0C',
    main: '#B10C0C',
    dark: '#B10C0C',
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
  text: {
    primary: '#2A2D48', // primary main
  },
}

export default palette
