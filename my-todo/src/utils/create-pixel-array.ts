/**
 * @param pixels
 * @param pixelCount
 * @param quality quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster the palette generation but the greater the likelihood that colors will be missed.
 */
export function createPixelArray(pixels: Uint8ClampedArray, pixelCount: number, quality: number) {
  const pixelArray = [];

  for (let i = 0; i < pixelCount; i = i + quality) {
    const offset = i * 4;
    // rgba
    const red = pixels[offset + 0];
    const green = pixels[offset + 1];
    const blue = pixels[offset + 2];
    const alpha = pixels[offset + 3];

    // If pixel is mostly opaque and not white
    if (typeof alpha === 'undefined' || alpha >= 125) {
      if (!(red > 250 && green > 250 && blue > 250)) {
        pixelArray.push([red, green, blue]);
      }
    }
  }
  return pixelArray;
}
