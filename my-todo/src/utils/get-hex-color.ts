export function getHexColor(color: Uint8ClampedArray) {
  if (!color) return;

  const red = color[0].toString(16);
  const green = color[1].toString(16);
  const blue = color[2].toString(16);
  return `#${red}${green}${blue}`;
}
