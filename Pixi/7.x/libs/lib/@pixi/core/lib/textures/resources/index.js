"use strict";
var ArrayResource = require("./ArrayResource.js"), autoDetectResource = require("./autoDetectResource.js"), BufferResource = require("./BufferResource.js"), CanvasResource = require("./CanvasResource.js"), CubeResource = require("./CubeResource.js"), ImageBitmapResource = require("./ImageBitmapResource.js"), ImageResource = require("./ImageResource.js"), SVGResource = require("./SVGResource.js"), VideoFrameResource = require("./VideoFrameResource.js"), VideoResource = require("./VideoResource.js"), BaseImageResource = require("./BaseImageResource.js"), Resource = require("./Resource.js"), AbstractMultiResource = require("./AbstractMultiResource.js");
autoDetectResource.INSTALLED.push(
  ImageBitmapResource.ImageBitmapResource,
  ImageResource.ImageResource,
  CanvasResource.CanvasResource,
  VideoResource.VideoResource,
  VideoFrameResource.VideoFrameResource,
  SVGResource.SVGResource,
  BufferResource.BufferResource,
  CubeResource.CubeResource,
  ArrayResource.ArrayResource
);
exports.ArrayResource = ArrayResource.ArrayResource;
exports.INSTALLED = autoDetectResource.INSTALLED;
exports.autoDetectResource = autoDetectResource.autoDetectResource;
exports.BufferResource = BufferResource.BufferResource;
exports.CanvasResource = CanvasResource.CanvasResource;
exports.CubeResource = CubeResource.CubeResource;
exports.ImageBitmapResource = ImageBitmapResource.ImageBitmapResource;
exports.ImageResource = ImageResource.ImageResource;
exports.SVGResource = SVGResource.SVGResource;
exports.VideoResource = VideoResource.VideoResource;
exports.BaseImageResource = BaseImageResource.BaseImageResource;
exports.Resource = Resource.Resource;
exports.AbstractMultiResource = AbstractMultiResource.AbstractMultiResource;
//# sourceMappingURL=index.js.map
