"use strict";
function processX(base, ids, depth, result, tags) {
  const id = ids[depth];
  for (let i = 0; i < id.length; i++) {
    const value = id[i];
    depth < ids.length - 1 ? processX(base.replace(result[depth], value), ids, depth + 1, result, tags) : tags.push(base.replace(result[depth], value));
  }
}
function createStringVariations(string) {
  const regex = /\{(.*?)\}/g, result = string.match(regex), tags = [];
  if (result) {
    const ids = [];
    result.forEach((vars) => {
      const split = vars.substring(1, vars.length - 1).split(",");
      ids.push(split);
    }), processX(string, ids, 0, result, tags);
  } else
    tags.push(string);
  return tags;
}
exports.createStringVariations = createStringVariations;
//# sourceMappingURL=createStringVariations.js.map
