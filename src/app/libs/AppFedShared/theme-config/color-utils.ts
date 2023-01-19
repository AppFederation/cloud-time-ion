/**
 * @param color Hex value format: #ffffff or ffffff
 * @param decimal lighten or darken decimal value, example 0.5 to lighten by 50% or 1.5 to darken by 50%.
 */
export function shadeColor(color: string, decimal: number): string {
  const base = color.startsWith('#') ? 1 : 0;

  let r = parseInt(color.substring(base, 3), 16);
  let g = parseInt(color.substring(base + 2, 5), 16);
  let b = parseInt(color.substring(base + 4, 7), 16);

  r = Math.round(r / decimal);
  g = Math.round(g / decimal);
  b = Math.round(b / decimal);

  r = (r < 255)? r : 255;
  g = (g < 255)? g : 255;
  b = (b < 255)? b : 255;

  const rr = ((r.toString(16).length === 1)? `0${r.toString(16)}` : r.toString(16));
  const gg = ((g.toString(16).length === 1)? `0${g.toString(16)}` : g.toString(16));
  const bb = ((b.toString(16).length === 1)? `0${b.toString(16)}` : b.toString(16));

  return `#${rr}${gg}${bb}`;
}

export type RGB = [number, number, number];

export function getRgbColorFromHex(hex: string) {
  hex = hex.slice(1);
  const value = parseInt(hex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return [r, g, b] as RGB;
};

export function luminance(rgb: RGB) {
  // https://blog.cristiana.tech/calculating-color-contrast-in-typescript-using-web-content-accessibility-guidelines-wcag
  const [r, g, b] = rgb.map((v: any) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
};
