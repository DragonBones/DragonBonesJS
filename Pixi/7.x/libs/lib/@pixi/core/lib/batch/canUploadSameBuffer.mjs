import { isMobile } from "@pixi/settings";
function canUploadSameBuffer() {
  return !isMobile.apple.device;
}
export {
  canUploadSameBuffer
};
//# sourceMappingURL=canUploadSameBuffer.mjs.map
