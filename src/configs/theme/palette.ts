import { PaletteOptions } from '@material-ui/core/styles/createPalette'

export type PaletteRange = 10 | 30 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type HighlightColor = 'pink' | 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'yellow'

export type PaletteRangeOptions = Record<PaletteRange, string>

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    primaryRange: PaletteRangeOptions
    secondaryRange: Omit<PaletteRangeOptions, 10 | 30>
    highlight: Record<HighlightColor, Pick<PaletteRangeOptions, 300 | 500 | 700>>
  }
  interface PaletteOptions {
    primaryRange: PaletteRangeOptions
    secondaryRange: Omit<PaletteRangeOptions, 10 | 30>
    highlight: Record<HighlightColor, Pick<PaletteRangeOptions, 300 | 500 | 700>>
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
  highlight: {
    pink: {
      300: '#FDD8EE',
      500: '#F339A8',
      700: '#C7117F',
    },
    red: {
      300: '#FDDBDB',
      500: '#F96666',
      700: '#B10C0C',
    },
    orange: {
      300: '#FEE5CD',
      500: '#FEA339',
      700: '#D67F19',
    },
    green: {
      300: '#D1FEB6',
      500: '#85E14D',
      700: '#4B991C',
    },
    blue: {
      300: '#DAEFFE',
      500: '#35A1EF',
      700: '#0C5A93',
    },
    purple: {
      300: '#F3D6FD',
      500: '#BF35EF',
      700: '#681A83',
    },
    yellow: {
      300: '#FCDF7D',
      500: '#FED239',
      700: '#FDBC06',
    },
  },
}

export const lightPaletteOptions: PaletteOptions = {
  ...paletteBaseOptions,
  type: 'light',
}

export const darkPaletteOptions: PaletteOptions = {
  ...paletteBaseOptions,
  type: 'dark',
}
