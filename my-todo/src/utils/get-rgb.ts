export function getRGB(color: Uint8ClampedArray) {
  if (!color) return;
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}
