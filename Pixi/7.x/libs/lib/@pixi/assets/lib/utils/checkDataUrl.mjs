function checkDataUrl(url, mimes) {
  if (Array.isArray(mimes)) {
    for (const mime of mimes)
      if (url.startsWith(`data:${mime}`))
        return !0;
    return !1;
  }
  return url.startsWith(`data:${mimes}`);
}
export {
  checkDataUrl
};
//# sourceMappingURL=checkDataUrl.mjs.map
