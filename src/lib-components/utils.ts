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
