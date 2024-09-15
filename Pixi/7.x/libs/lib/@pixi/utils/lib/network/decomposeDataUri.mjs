import { DATA_URI } from "../const.mjs";
function decomposeDataUri(dataUri) {
  const dataUriMatch = DATA_URI.exec(dataUri);
  if (dataUriMatch)
    return {
      mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : void 0,
      subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : void 0,
      charset: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : void 0,
      encoding: dataUriMatch[4] ? dataUriMatch[4].toLowerCase() : void 0,
      data: dataUriMatch[5]
    };
}
export {
  decomposeDataUri
};
//# sourceMappingURL=decomposeDataUri.mjs.map
