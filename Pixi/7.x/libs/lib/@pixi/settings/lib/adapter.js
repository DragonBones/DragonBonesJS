"use strict";
const BrowserAdapter = {
  /**
   * Creates a canvas element of the given size.
   * This canvas is created using the browser's native canvas element.
   * @param width - width of the canvas
   * @param height - height of the canvas
   */
  createCanvas: (width, height) => {
    const canvas = document.createElement("canvas");
    return canvas.width = width, canvas.height = height, canvas;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (url, options) => fetch(url, options),
  parseXML: (xml) => new DOMParser().parseFromString(xml, "text/xml")
};
exports.BrowserAdapter = BrowserAdapter;
//# sourceMappingURL=adapter.js.map
