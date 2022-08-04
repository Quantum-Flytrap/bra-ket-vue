import { clamp } from '@/lib-components/utils';

type Rgb = [number, number, number]
type Lab = { L: number, a: number, b: number }

type ComplexColor = (re: number, im: number) => Rgb
const paletteCubeHelix: ComplexColor = (re: number, im: number) => cubeHelix(complexArg(re, im), 1.1, 0.5);
const paletteOklab: ComplexColor = (re: number, im: number) => linearToGammaRgb(oklabToLinearSrgb(
  hlcToLab(complexArg(re, im), 0.7, 0.25),
));
const paletteHsl: ComplexColor = (re: number, im: number) => hslToRgb(complexArg(re, im) * (RAD_TO_DEG / 360), 1, 0.5);

const complexPalettes = {
  cubehelix: paletteCubeHelix,
  hsl: paletteHsl,
  oklab: paletteOklab,
};

export type ComplexPalette = (keyof typeof complexPalettes) | ComplexColor

/**
 * Generate HSL color from complex number
 * https://github.com/stared/quantum-game/blob/master/js/transition_heatmap.js
 */
export function colorComplex(re: number, im: number, palette: ComplexPalette = 'oklab'): string {
  const paletteFn = typeof palette === 'string' ? complexPalettes[palette] : palette;
  return rgbToHex(paletteFn(re, im));
}

/**
 * Get complex number argument argument (angle from +x axis) in radians, range [0,TAU).
 * @param re
 * @param im
 * @returns
 */
function complexArg(re: number, im: number): number {
  let arg = Math.atan2(im, re);
  if (arg < 0) arg += 2 * Math.PI;
  return arg;
}

/**
 * Converts a number to its hex string. Adds '0' at the start if the hex representation is a single digit.
 * @param x number
 * @returns hex string
 */
function toHex(x: number): string {
  const hex = Math.round(clamp(x * 255, 0, 255)).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(rgb: Rgb): string {
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hslHue2rgb(p, q, h + 1 / 3);
  const g = hslHue2rgb(p, q, h);
  const b = hslHue2rgb(p, q, h - 1 / 3);
  return [r, g, b];
}

function hslHue2rgb(pParam: number, qParam: number, tParam: number): number {
  const p = pParam;
  const q = qParam;
  let t = tParam;
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}


function cubeHelix(h: number, s: number, l: number): Rgb {
  const hRad = h + Math.PI * (2 / 3);
  const a = s * l * ((1 - l));
  const cosHue = Math.cos(hRad);
  const sinHue = Math.sin(hRad);

  const r = (l + a * (-0.14861 * cosHue + +1.78277 * sinHue));
  const g = (l + a * (-0.29227 * cosHue + -0.90649 * sinHue));
  const b = (l + a * (+1.97294 * cosHue));

  return [r, g, b];
}

function hlcToLab(h: number, L: number, C: number): Lab {
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  return { L, a, b };
}

function oklabToLinearSrgb(c: Lab): Rgb {
  const l = (c.L + 0.3963377774 * c.a + 0.2158037573 * c.b) ** 3;
  const m = (c.L - 0.1055613458 * c.a - 0.0638541728 * c.b) ** 3;
  const s = (c.L - 0.0894841775 * c.a - 1.2914855480 * c.b) ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

export const linearToGamma = (c: number) => (
  c > 0.0031308
    ? 1.055 * (c ** (1 / 2.4)) - 0.055
    : 12.92 * c
);
export const linearToGammaRgb = (c: Rgb): Rgb => [linearToGamma(c[0]), linearToGamma(c[1]), linearToGamma(c[2])];

const RAD_TO_DEG = 180 / Math.PI;
