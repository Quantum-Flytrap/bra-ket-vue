export const range = (n: number): number[] => [...Array(n).keys()];

export const coordPrettyMap = new Map<string, string>();
const pairs: [string, string][] = [
  ['>', '→'], ['^', '↑'], ['<', '←'], ['v', '↓'],
  ['u', '↑z'], ['d', '↓z'], ['ux', '↑x'], ['dx', '↓x'], ['uy', '↑y'], ['dy', '↓y'],
];
pairs.forEach(([k, v]) => coordPrettyMap.set(k, v));

export function coordPrettier(coord: string): string {
  return coordPrettyMap.get(coord) || coord;
}

export function dimensionNameToColor(dimName: string, darkStyle = false): string {
  if (darkStyle) {
    switch (dimName) {
      case 'direction':
        return '#ff0055';
      case 'polarization':
        return '#ff9100';
      case 'spin':
        return '#0091ff';
      default:
        return '#ffffff';
    }
  } else {
    switch (dimName) {
      case 'direction':
        return '#ff0055';
      case 'polarization':
        return '#ff9100';
      case 'spin':
        return '#0091ff';
      default:
        return '#242424';
    }
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}
