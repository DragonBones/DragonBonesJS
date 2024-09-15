const copySearchParams = (targetUrl, sourceUrl) => {
  const searchParams = sourceUrl.split("?")[1];
  return searchParams && (targetUrl += `?${searchParams}`), targetUrl;
};
export {
  copySearchParams
};
//# sourceMappingURL=copySearchParams.mjs.map
