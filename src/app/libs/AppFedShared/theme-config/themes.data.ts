import {getDictionaryValuesAsArray, mapEntriesToArray, setIdsFromKeys} from '../utils/dictionary-utils'

export type ThemeId = string

// type HexColor = `#${string & { length: 6 }}`
type HexColor = string

// type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
// type HexColor = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;
// type HexColor = string & { length: 7 } & { [0]: '#' } & { [K in 1 | 2 | 3 | 4 | 5 | 6]: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' };

export type Theme = {
  id?: string
  comment?: string;
  background?: HexColor;
  experimental?: boolean;
  primary: HexColor;
  secondary: HexColor;
}

function theme(theme: Theme): Theme {
  return theme
}

export const themesMapById: { [key: string]: Theme } = setIdsFromKeys({
  // 'Bright': {
  //   // background: '#2c2c2c',
  //   background: '#cbcbcb',
  //   // background: '#6a2c2c',
  //   experimental: true,
  //   // primary: '#000000',
  //   primary: '#101010',
  //   secondary: '#674400',
  // }, wrong text color
  'Gray bg with black buttons': theme({
    // background: '#2c2c2c',
    background: '#202020',
    // background: '#6a2c2c',
    experimental: true,
    // primary: '#000000',
    primary: '#101010',
    secondary: '#674400',
  }),
  'Porzeczki Agrest (Gooseberry & Currant)': theme({
    comment: 'Jellies',
    background: '#6a2c2czz',
    primary: '#c72323',
    secondary: '#b68001',
  }),
  // 'Forest': theme({
  //   comment: 'Greens and browns',
  //   background: '#2a1e0e',
  //   primary: '#6c6900',
  //   secondary: '#00a001',
  // primary and secondary too similar
  // }),
  'Forest and black': theme({
    comment: 'Greens and browns',
    background: '#543c1c',
    primary: '#000000', /* The black icons look kinda like a bug? Prolly too extreme contrast between primary and secondary color (some icons darker and some lighter than bg) */
    secondary: '#00a001',
    experimental: true,
  }),
  'Black and Dark Brown': theme({
    comment: '',
    background: '#382613',
    primary: '#000000',
    secondary: '#8d0000',
    experimental: true,
  }),
  // 'Dark Gray and Dark Brown & Red': theme({
  //   comment: '',
  //   background: '#1a1a1a',
  //   primary: '#ff0000',
  //   secondary: '#8d0000',
  //   experimental: true,
  // primary secondary too similar
  // }),
  'Forest and river': theme({
    comment: 'Greens and browns and blue',
    background: '#2a1e0e',
    primary: '#6c6900',
    secondary: '#008dfd',
  }),
  // 'Yellow Blue': theme({
  //   comment: 'Blue Yellow',
  //   background: '#000000',
  //   primary: '#ffb307',
  //   secondary: '#413cff',
  // }),
  'Dark Blue Bg, Agrest': theme({
    comment: 'Jellies',
    background: '#000080',
    primary: '#326a2c',
    secondary: '#b68001',
  }),
  'Dark Green Bg, Agrest': theme({
    comment: 'Jellies',
    background: '#244d20',
    primary: '#326a2c',
    secondary: '#b680ff',
  }),
  'Dark purple and yellow': theme({
    comment: 'Jellies',
    experimental: true,
    // background: 'darkblue',
    primary: 'yellow',
    secondary: 'orange',
  }),
  'Gray Green': theme({
    comment: 'Jellies',
    primary: '#6e6e6e',
    secondary: '#007e00',
  }),
  // 'Blue Orange': theme({
  //   comment: 'Blueberries and orange',
  //   primary: '#004cb7',
  //   secondary: '#007e00',
  // }),
  // 'Grays': {
  //   comment: 'Darker and ligter grays',
  //   primary: '#939393',
  //   secondary: '#484848',
  // }, // too sad

  'Dark Gray and yellow': theme({
    comment: '',
    primary: '#2f2f2f',
    secondary: '#65b600',
  }),
  'Dark Gray and purplish': theme({
    comment: 'Beetroot',
    primary: '#2f2f2f',
    secondary: '#940059',
  }),
  // https://www.w3schools.com/colors/color_tryit.asp?hex=BC8F8F
  // 'Purple-Blue': theme({
  //   primary: '#663399',
  //   secondary: '#004cb7',
  // primary secondary too similar
  // }),
  'Salmon-Green': theme({
    primary: '#FA8072',
    secondary: '#007e00',
  }),
  'RosyBrown-Green': theme({
    primary: '#BC8F8F' /* is this somehow wrong? Coz so bright. */,
    secondary: '#007e00',
  }),
  // 'SaddleBrown-Green': theme({
  //   primary: '#8B4513',
  //   secondary: '#007e00',
  //  primary secondary too similar
  // }),
  'Fire': theme({
    primary: '#800000',
    secondary: '#e1b74d',
  }),
  // TODO: brown and green like forest
})

export const themesArray = getDictionaryValuesAsArray(themesMapById)
