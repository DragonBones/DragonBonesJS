function determineCrossOrigin(url, loc = globalThis.location) {
  if (url.startsWith("data:"))
    return "";
  loc = loc || globalThis.location;
  const parsedUrl = new URL(url, document.baseURI);
  return parsedUrl.hostname !== loc.hostname || parsedUrl.port !== loc.port || parsedUrl.protocol !== loc.protocol ? "anonymous" : "";
}
export {
  determineCrossOrigin
};
//# sourceMappingURL=determineCrossOrigin.mjs.map
