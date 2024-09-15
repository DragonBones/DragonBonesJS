"use strict";
var mapSize = require("./mapSize.js"), mapType = require("./mapType.js");
function getAttributeData(program, gl) {
  const attributes = {}, totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < totalAttributes; i++) {
    const attribData = gl.getActiveAttrib(program, i);
    if (attribData.name.startsWith("gl_"))
      continue;
    const type = mapType.mapType(gl, attribData.type), data = {
      type,
      name: attribData.name,
      size: mapSize.mapSize(type),
      location: gl.getAttribLocation(program, attribData.name)
    };
    attributes[attribData.name] = data;
  }
  return attributes;
}
exports.getAttributeData = getAttributeData;
//# sourceMappingURL=getAttributeData.js.map
