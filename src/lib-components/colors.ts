import { clamp } from './utils';

type ComplexColor = (re: number, im: number) => [number, number, number]

export const TAU = 2 * Math.PI;

/**
 * Converts a number to its hex string. Adds '0' at the start if the hex representation is a single digit.
 * @param x number
 * @returns hex string
 */
function toHex(x: number): string {
  const hex = Math.round(clamp(x * 255, 0, 255)).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * Stolen from https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
 * Alternatively: d3.hsl
 */
export const linear: ComplexColor = (re: number, im: number) => {
  const angleInDegrees = ((Math.atan2(im, re) * 360) / TAU + 360) % 360;
  const h = angleInDegrees / 360;
  const s = 1;
  const l = 0.5;

  const hue2rgb = (pParam: number, qParam: number, tParam: number): number => {
    const p = pParam;
    const q = qParam;
    let t = tParam;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return [r, g, b];
};

export const cubeHelix: ComplexColor = (re: number, im: number) => {
  const h = ((Math.atan2(im, re) * 360) / TAU + 360) % 360;
  const s = 1;
  const l = 0.5;

  const hRad = (h + 120) * (Math.PI / 180);
  const a = s * l * ((1 - l));
  const cosHue = Math.cos(hRad);
  const sinHue = Math.sin(hRad);

  const r = (l + a * (-0.14861 * cosHue + +1.78277 * sinHue));
  const g = (l + a * (-0.29227 * cosHue + -0.90649 * sinHue));
  const b = (l + a * (+1.97294 * cosHue));

  return [r, g, b];
};

export const oklab: ComplexColor = (re: number, im: number) => {
  const L = 0.5;
  const C = 1;
  const angle = Math.atan2(im, re);
  const a = C * Math.cos(angle);
  const b = C * Math.sin(angle);

  const linearToGamma = (c: number) => (c >= 0.0031308 ? 1.055 * (c ** (1 / 2.4)) - 0.055 : 12.92 * c);
  const l = (L + a * +0.3963377774 + b * +0.2158037573) ** 3;
  const m = (L + a * -0.1055613458 + b * -0.0638541728) ** 3;
  const s = (L + a * -0.0894841775 + b * -1.2914855480) ** 3;

  let R = l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292;
  let G = l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965;
  let B = l * -0.0041960863 + m * -0.7034186147 + s * +1.7076147010;
  // Convert linear RGB values returned from oklab math to sRGB for our use before returning them:
  R = linearToGamma(R);
  G = linearToGamma(G);
  B = linearToGamma(B);

  return [R, G, B];
};


/**
 * Generate HSL color from complex number
 * https://github.com/stared/quantum-game/blob/master/js/transition_heatmap.js
 */
export function colorComplex(re: number, im: number, interpolation: ComplexColor = oklab): string {
  const [r, g, b] = interpolation(re, im);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function colorComplexPhaseToHue(re: number, im: number, interpolation: ComplexColor = oklab): string {
  const [r, g, b] = interpolation(re, im);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
/**
 * Convert angles to unicode arrow symbols
 * https://en.wikipedia.org/wiki/Template:Unicode_chart_Arrows
 * @param angle included in [0, 45, 90, 135, 180, 225, 270, 315]
 */
