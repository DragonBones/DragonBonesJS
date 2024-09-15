async function testImageFormat(imageData) {
  if ("Image" in globalThis)
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve(!0);
      }, image.onerror = () => {
        resolve(!1);
      }, image.src = imageData;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const blob = await (await fetch(imageData)).blob();
      await createImageBitmap(blob);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
export {
  testImageFormat
};
//# sourceMappingURL=testImageFormat.mjs.map
