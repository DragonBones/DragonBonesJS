import { mapSize } from "./mapSize.mjs";
import { mapType } from "./mapType.mjs";
function getAttributeData(program, gl) {
  const attributes = {}, totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < totalAttributes; i++) {
    const attribData = gl.getActiveAttrib(program, i);
    if (attribData.name.startsWith("gl_"))
      continue;
    const type = mapType(gl, attribData.type), data = {
      type,
      name: attribData.name,
      size: mapSize(type),
      location: gl.getAttribLocation(program, attribData.name)
    };
    attributes[attribData.name] = data;
  }
  return attributes;
}
export {
  getAttributeData
};
//# sourceMappingURL=getAttributeData.mjs.map
