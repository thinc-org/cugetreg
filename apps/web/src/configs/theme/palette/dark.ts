import { PaletteOptions } from '@mui/material/styles'

import { Highlight } from '.'
import { makeChipFilledHighlight, makeChipOutlinedHighlight } from '../overrides/chip'

const highlight: Highlight = {
  pink: {
    300: '#C7117F',
    500: '#F57FC6',
    700: '#FDD8EE',
  },
  red: {
    300: '#B10C0C',
    500: '#F96666',
    700: '#FDDBDB',
  },
  orange: {
    300: '#D67F19',
    500: '#FEA339',
    700: '#FFE2BF',
  },
  green: {
    300: '#4B991C',
    500: '#6CD62B',
    700: '#D1FEB6',
  },
  teal: {
    300: '#349A82',
    500: '#2BD6AD',
    700: '#D9FFF6',
  },
  blue: {
    300: '#0C5A93',
    500: '#35A1EF',
    700: '#DAEFFE',
  },
  indigo: {
    300: '#211090',
    500: '#8170F1',
    700: '#8170F1',
  },
  purple: {
    300: '#C865EA',
    500: '#C865EA',
    700: '#F3D6FD',
  },
  yellow: {
    300: '#EB9C03',
    500: '#FED239',
    700: '#FFF2C4',
  },
  deepGray: {
    300: '#2A2D48',
    500: '#7C7F9B',
    700: '#E3E5F8',
  },
}

export const paletteDarkBaseOptions: PaletteOptions = {
  primary: {
    light: '#555872',
    main: '#C9CCE4',
    dark: '#E3E5F8',
    contrastText: '#393C55',
  },
  secondary: {
    light: '#555872',
    main: '#FED957',
    dark: '#FEC614',
    contrastText: '#C9CCE4',
  },
  error: {
    light: '#F96666',
    main: '#F96666',
    dark: '#F96666',
  },
  text: {
    primary: '#C9CCE4', // primary main
  },
  primaryRange: {
    10: '#393C55',
    30: '#555872',
    50: '#7C7F9B',
    100: '#7C7F9B',
    200: '#9C9FBA',
    300: '#9C9FBA',
    400: '#9C9FBA',
    500: '#C9CCE4',
    600: '#E3E5F8',
    700: '#E3E5F8',
    800: '#E3E5F8',
    900: '#FAFAFF',
  },
  secondaryRange: {
    50: '#EB9C03',
    100: '#F8AA14',
    200: '#FDBC06',
    300: '#FEC614',
    400: '#FED239',
    500: '#FED957',
    600: '#FCDF7D',
    700: '#FFE99C',
    800: '#FFF2C4',
    900: '#FFF2C4',
  },
  highlight,
  ...makeChipFilledHighlight(highlight),
  ...makeChipOutlinedHighlight(highlight),
  white: '#191D36',
  background: { default: '#191D36', paper: '#191D36' },
}
