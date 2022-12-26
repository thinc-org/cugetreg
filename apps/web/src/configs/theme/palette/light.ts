import { PaletteOptions } from '@mui/material/styles'

import { Highlight } from '.'
import { makeChipFilledHighlight, makeChipOutlinedHighlight } from '../overrides/chip'

const highlight: Highlight = {
  pink: {
    300: '#FDD8EE',
    500: '#F57FC6',
    700: '#C7117F',
  },
  red: {
    300: '#FDDBDB',
    500: '#F96666',
    700: '#B10C0C',
  },
  orange: {
    300: '#FFE2BF',
    500: '#FEA339',
    700: '#D67F19',
  },
  green: {
    300: '#D1FEB6',
    500: '#6CD62B',
    700: '#4B991C',
  },
  teal: {
    300: '#D9FFF6',
    500: '#2BD6AD',
    700: '#349A82',
  },
  blue: {
    300: '#DAEFFE',
    500: '#35A1EF',
    700: '#0C5A93',
  },
  indigo: {
    300: '#DCD7FF',
    500: '#8170F1',
    700: '#211090',
  },
  purple: {
    300: '#F3D6FD',
    500: '#C865EA',
    700: '#681A83',
  },
  yellow: {
    300: '#FFF2C4',
    500: '#FED239',
    700: '#EB9C03',
  },
  deepGray: {
    300: '#E3E5F8',
    500: '#7C7F9B',
    700: '#2A2D48',
  },
}

export const paletteLightBaseOptions: PaletteOptions = {
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
  highlight,
  ...makeChipFilledHighlight(highlight),
  ...makeChipOutlinedHighlight(highlight),
  white: '#FFFFFF',
}
