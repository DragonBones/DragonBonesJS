import { TYPES, FORMATS } from "@pixi/constants";
class GLTexture {
  constructor(texture) {
    this.texture = texture, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = TYPES.UNSIGNED_BYTE, this.internalFormat = FORMATS.RGBA, this.samplerType = 0;
  }
}
export {
  GLTexture
};
//# sourceMappingURL=GLTexture.mjs.map
