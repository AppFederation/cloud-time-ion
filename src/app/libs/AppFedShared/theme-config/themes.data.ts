type Theme = {
  comment?: string;
  background?: string;
  experimental?: boolean;
  primary: string;
  secondary: string;
}

export const themes: { [key: string]: Theme } = {
  'Bright': {
    // background: '#2c2c2c',
    background: '#cbcbcb',
    // background: '#6a2c2c',
    experimental: true,
    // primary: '#000000',
    primary: '#101010',
    secondary: '#674400',
  },
  'Gray bg with black buttons': {
    // background: '#2c2c2c',
    background: '#202020',
    // background: '#6a2c2c',
    experimental: true,
    // primary: '#000000',
    primary: '#101010',
    secondary: '#674400',
  },
  'Porzeczki Agrest': {
    comment: 'Jellies',
    experimental: true,
    background: '#6a2c2c',
    primary: '#c72323',
    secondary: '#b68001',
  },
  'Dark Green Bg, Agrest': {
    comment: 'Jellies',
    experimental: true,
    background: '#244d20',
    primary: '#326a2c',
    secondary: '#b68001',
  },
  'Gray Green': {
    comment: 'Jellies',
    primary: '#6e6e6e',
    secondary: '#007e00',
  },
  'Blue Orange': {
    comment: 'Blueberries and orange',
    primary: '#004cb7',
    secondary: '#007e00',
  },
  // 'Grays': {
  //   comment: 'Darker and ligter grays',
  //   primary: '#939393',
  //   secondary: '#484848',
  // }, // too sad

  'Dark Gray and yellow': {
    comment: '',
    primary: '#2f2f2f',
    secondary: '#65b600',
  },
  'Dark Gray and purplish': {
    comment: 'Beetroot',
    primary: '#2f2f2f',
    secondary: '#940059',
  },
  // https://www.w3schools.com/colors/color_tryit.asp?hex=BC8F8F
  'Purple-Blue': {
    primary: '#663399',
    secondary: '#004cb7',
  },
  'Salmon-Green': {
    primary: '#FA8072',
    secondary: '#007e00',
  },
  'RosyBrown-Green': {
    primary: '#BC8F8F' /* is this somehow wrong? Coz so bright. */,
    secondary: '#007e00',
  },
  'SaddleBrown-Green': {
    primary: '#8B4513',
    secondary: '#007e00',
  },
  'Fire': {
    primary: '#800000',
    secondary: '#e1b74d',
  },
  // TODO: brown and green like forest
}
