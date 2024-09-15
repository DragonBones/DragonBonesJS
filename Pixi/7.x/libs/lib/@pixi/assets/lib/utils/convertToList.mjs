const convertToList = (input, transform, forceTransform = !1) => (Array.isArray(input) || (input = [input]), transform ? input.map((item) => typeof item == "string" || forceTransform ? transform(item) : item) : input);
export {
  convertToList
};
//# sourceMappingURL=convertToList.mjs.map
