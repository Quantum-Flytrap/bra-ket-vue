export const TAU = 2 * Math.PI;

/**
 * Converts a number to its hex string. Adds '0' at the start if the hex representation is a single digit.
 * @param x number
 * @returns hex string
 */
function toHex(x: number): string {
  const hex = Math.round(x * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * Stolen from https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
 * Alternatively: d3.hsl
 */
export function hslToHex(hParam: number, sParam: number, lParam: number): string {
  let h = hParam;
  let s = sParam;
  let l = lParam;
  h /= 360;
  s /= 100;
  l /= 100;
  let r;
  let g;
  let b;
  if (s === 0) {
    r = l;
    g = l;
    b = l; // achromatic
  } else {
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
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function cubeHelix(h: number, s: number, l: number) {
  const A = -0.14861;
  const B = +1.78277;
  const C = -0.29227;
  const D = -0.90649;
  const E = +1.97294;
  const hRad = (h + 120) * (Math.PI / 180);
  const a = s * l * (1 - l);
  const cosh = Math.cos(hRad);
  const sinh = Math.sin(hRad);

  const r = (l + a * (A * cosh + B * sinh));
  const g = (l + a * (C * cosh + D * sinh));
  const b = (l + a * (E * cosh));

  return [r, g, b];
}

/**
 * Generate HSL color from complex number
 * https://github.com/stared/quantum-game/blob/master/js/transition_heatmap.js
 */
export function colorComplex(re: number, im: number): string {
  const angleInDegrees = ((Math.atan2(im, re) * 360) / TAU + 360) % 360;
  const radius = Math.sqrt(re * re + im * im); // for pure color it should be always 1
  const [r, g, b] = cubeHelix(angleInDegrees, 1, 1 - 0.5 * radius);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function colorComplexPhaseToHue(re: number, im: number, saturation = 100, lightness = 50): string {
  const angleInDegrees = ((Math.atan2(im, re) * 360) / TAU + 360) % 360;
  const [r, g, b] = cubeHelix(angleInDegrees, saturation / 100, lightness / 100);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
/**
 * Convert angles to unicode arrow symbols
 * https://en.wikipedia.org/wiki/Template:Unicode_chart_Arrows
 * @param angle included in [0, 45, 90, 135, 180, 225, 270, 315]
 */
