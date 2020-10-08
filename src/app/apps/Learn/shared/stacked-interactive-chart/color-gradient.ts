// Original source code:
// https://codepen.io/BangEqual/pen/VLNowO


// constants for switch/case checking representation type
const HEX = 1;
const RGB = 2;
const RGBA = 3;

// get the string representation
// type and set it on the element (HEX/RGB/RGBA)
function getType(val: string) {
  if (val.indexOf('#') > -1) return HEX;
  if (val.indexOf('rgb(') > -1) return RGB;
  if (val.indexOf('rgba(') > -1) return RGBA;
}

// process the value irrespective of representation type
function processValue(value: string): number[] {
  switch (getType(value)) {
    case HEX:
      {
        return processHEX(value);
      }
    case RGB:{
      return processRGB(value);
    }
    case RGBA:{
      return processRGB(value);
    }
  }
  throw Error(`Invalid color code ${value}`);
}

//return a workable RGB int array [r,g,b] from rgb/rgba representation
function processRGB(val: string){
  let rgb = val.split('(')[1].split(')')[0].split(',');
  alert(rgb.toString());
  return [
      parseInt(rgb[0],10),
      parseInt(rgb[1],10),
      parseInt(rgb[2],10)
  ];
}

//return a workable RGB int array [r,g,b] from hex representation
function processHEX(val: string) {
  //does the hex contain extra char?
  let hex = (val.length >6)?val.substr(1, val.length - 1):val;
  let r, g, b: string;
  // is it a six character hex?
  if (hex.length > 3) {

    //scrape out the numerics
    r = hex.substr(0, 2);
    g = hex.substr(2, 2);
    b = hex.substr(4, 2);

    // if not six character hex,
    // then work as if its a three character hex
  } else {

    // just concat the pieces with themselves
    r = hex.substr(0, 1) + hex.substr(0, 1);
    g = hex.substr(1, 1) + hex.substr(1, 1);
    b = hex.substr(2, 1) + hex.substr(2, 1);

  }
  // return our clean values
    return [
      parseInt(r, 16),
      parseInt(g, 16),
      parseInt(b, 16)
    ]
}

export function updateSpitter(color1: string, color2: string, steps: number): string[] {
  let val1RGB = processValue(color1);
  let val2RGB = processValue(color2);
  let colors = [
    // somewhere to dump gradient
  ];

  //the percentage representation of the step
  let stepsPerc = 100 / (steps + 1);

  // diffs between two values
  let valClampRGB = [
    val2RGB[0] - val1RGB[0],
    val2RGB[1] - val1RGB[1],
    val2RGB[2] - val1RGB[2]
  ];

  // build the color array out with color steps
  for (let i = 0; i < steps; i++) {
    let clampedR = (valClampRGB[0] > 0)
      ? pad((Math.round(valClampRGB[0] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((val1RGB[0] + (valClampRGB[0]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

    let clampedG = (valClampRGB[1] > 0)
      ? pad((Math.round(valClampRGB[1] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((val1RGB[1] + (valClampRGB[1]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

    let clampedB = (valClampRGB[2] > 0)
      ? pad((Math.round(valClampRGB[2] / 100 * (stepsPerc * (i + 1)))).toString(16), 2)
      : pad((Math.round((val1RGB[2] + (valClampRGB[2]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);
    colors[i] = [
      '#',
      clampedR,
      clampedG,
      clampedB
    ].join('');
  }
  return colors;
}

function pad(n: string, width: number, z: string = '0') {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
