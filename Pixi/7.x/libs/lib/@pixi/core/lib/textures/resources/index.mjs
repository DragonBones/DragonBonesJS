import { ArrayResource } from "./ArrayResource.mjs";
import { INSTALLED } from "./autoDetectResource.mjs";
import { autoDetectResource } from "./autoDetectResource.mjs";
import { BufferResource } from "./BufferResource.mjs";
import { CanvasResource } from "./CanvasResource.mjs";
import { CubeResource } from "./CubeResource.mjs";
import { ImageBitmapResource } from "./ImageBitmapResource.mjs";
import { ImageResource } from "./ImageResource.mjs";
import { SVGResource } from "./SVGResource.mjs";
import { VideoFrameResource } from "./VideoFrameResource.mjs";
import { VideoResource } from "./VideoResource.mjs";
import { BaseImageResource } from "./BaseImageResource.mjs";
import { Resource } from "./Resource.mjs";
import { AbstractMultiResource } from "./AbstractMultiResource.mjs";
INSTALLED.push(
  ImageBitmapResource,
  ImageResource,
  CanvasResource,
  VideoResource,
  VideoFrameResource,
  SVGResource,
  BufferResource,
  CubeResource,
  ArrayResource
);
export {
  AbstractMultiResource,
  ArrayResource,
  BaseImageResource,
  BufferResource,
  CanvasResource,
  CubeResource,
  INSTALLED,
  ImageBitmapResource,
  ImageResource,
  Resource,
  SVGResource,
  VideoResource,
  autoDetectResource
};
//# sourceMappingURL=index.mjs.map
