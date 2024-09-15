"use strict";
const convertToList = (input, transform, forceTransform = !1) => (Array.isArray(input) || (input = [input]), transform ? input.map((item) => typeof item == "string" || forceTransform ? transform(item) : item) : input);
exports.convertToList = convertToList;
//# sourceMappingURL=convertToList.js.map
