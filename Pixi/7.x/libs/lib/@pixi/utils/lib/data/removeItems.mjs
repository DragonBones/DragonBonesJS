function removeItems(arr, startIdx, removeCount) {
  const length = arr.length;
  let i;
  if (startIdx >= length || removeCount === 0)
    return;
  removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;
  const len = length - removeCount;
  for (i = startIdx; i < len; ++i)
    arr[i] = arr[i + removeCount];
  arr.length = len;
}
export {
  removeItems
};
//# sourceMappingURL=removeItems.mjs.map
