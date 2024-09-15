import { splitTextToCharacters } from "./splitTextToCharacters.mjs";
function resolveCharacters(chars) {
  typeof chars == "string" && (chars = [chars]);
  const result = [];
  for (let i = 0, j = chars.length; i < j; i++) {
    const item = chars[i];
    if (Array.isArray(item)) {
      if (item.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${item.length}.`);
      const startCode = item[0].charCodeAt(0), endCode = item[1].charCodeAt(0);
      if (endCode < startCode)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let i2 = startCode, j2 = endCode; i2 <= j2; i2++)
        result.push(String.fromCharCode(i2));
    } else
      result.push(...splitTextToCharacters(item));
  }
  if (result.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return result;
}
export {
  resolveCharacters
};
//# sourceMappingURL=resolveCharacters.mjs.map
