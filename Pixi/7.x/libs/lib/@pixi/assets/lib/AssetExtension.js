"use strict";
var core = require("@pixi/core");
const assetKeyMap = {
  loader: core.ExtensionType.LoadParser,
  resolver: core.ExtensionType.ResolveParser,
  cache: core.ExtensionType.CacheParser,
  detection: core.ExtensionType.DetectionParser
};
core.extensions.handle(core.ExtensionType.Asset, (extension) => {
  const ref = extension.ref;
  Object.entries(assetKeyMap).filter(([key]) => !!ref[key]).forEach(([key, type]) => core.extensions.add(Object.assign(
    ref[key],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: ref[key].extension ?? type }
  )));
}, (extension) => {
  const ref = extension.ref;
  Object.keys(assetKeyMap).filter((key) => !!ref[key]).forEach((key) => core.extensions.remove(ref[key]));
});
//# sourceMappingURL=AssetExtension.js.map
