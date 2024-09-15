"use strict";
const copySearchParams = (targetUrl, sourceUrl) => {
  const searchParams = sourceUrl.split("?")[1];
  return searchParams && (targetUrl += `?${searchParams}`), targetUrl;
};
exports.copySearchParams = copySearchParams;
//# sourceMappingURL=copySearchParams.js.map
