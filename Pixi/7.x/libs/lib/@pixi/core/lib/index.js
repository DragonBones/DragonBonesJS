"use strict";
require("./settings.js");
var color = require("@pixi/color"), constants = require("@pixi/constants"), extensions = require("@pixi/extensions"), math = require("@pixi/math"), runner = require("@pixi/runner"), settings = require("@pixi/settings"), ticker = require("@pixi/ticker"), utils$1 = require("@pixi/utils"), autoDetectRenderer = require("./autoDetectRenderer.js"), BackgroundSystem = require("./background/BackgroundSystem.js"), BatchDrawCall = require("./batch/BatchDrawCall.js"), BatchGeometry = require("./batch/BatchGeometry.js"), BatchRenderer = require("./batch/BatchRenderer.js"), BatchShaderGenerator = require("./batch/BatchShaderGenerator.js"), BatchSystem = require("./batch/BatchSystem.js"), BatchTextureArray = require("./batch/BatchTextureArray.js"), ObjectRenderer = require("./batch/ObjectRenderer.js"), ContextSystem = require("./context/ContextSystem.js"), Filter = require("./filters/Filter.js"), FilterState = require("./filters/FilterState.js"), FilterSystem = require("./filters/FilterSystem.js");
require("./filters/IFilterTarget.js");
var SpriteMaskFilter = require("./filters/spriteMask/SpriteMaskFilter.js"), index = require("./fragments/index.js"), Framebuffer = require("./framebuffer/Framebuffer.js"), FramebufferSystem = require("./framebuffer/FramebufferSystem.js"), GLFramebuffer = require("./framebuffer/GLFramebuffer.js"), MultisampleSystem = require("./framebuffer/MultisampleSystem.js"), Attribute = require("./geometry/Attribute.js"), Buffer = require("./geometry/Buffer.js"), BufferSystem = require("./geometry/BufferSystem.js"), Geometry = require("./geometry/Geometry.js"), GeometrySystem = require("./geometry/GeometrySystem.js"), ViewableBuffer = require("./geometry/ViewableBuffer.js");
require("./IRenderer.js");
var MaskData = require("./mask/MaskData.js"), MaskSystem = require("./mask/MaskSystem.js"), ScissorSystem = require("./mask/ScissorSystem.js"), StencilSystem = require("./mask/StencilSystem.js"), PluginSystem = require("./plugin/PluginSystem.js"), ProjectionSystem = require("./projection/ProjectionSystem.js"), ObjectRendererSystem = require("./render/ObjectRendererSystem.js"), Renderer = require("./Renderer.js"), BaseRenderTexture = require("./renderTexture/BaseRenderTexture.js"), GenerateTextureSystem = require("./renderTexture/GenerateTextureSystem.js"), RenderTexture = require("./renderTexture/RenderTexture.js"), RenderTexturePool = require("./renderTexture/RenderTexturePool.js"), RenderTextureSystem = require("./renderTexture/RenderTextureSystem.js"), GLProgram = require("./shader/GLProgram.js"), Program = require("./shader/Program.js"), Shader = require("./shader/Shader.js"), ShaderSystem = require("./shader/ShaderSystem.js"), UniformGroup = require("./shader/UniformGroup.js"), checkMaxIfStatementsInShader = require("./shader/utils/checkMaxIfStatementsInShader.js"), generateProgram = require("./shader/utils/generateProgram.js"), generateUniformBufferSync = require("./shader/utils/generateUniformBufferSync.js"), getTestContext = require("./shader/utils/getTestContext.js"), uniformParsers = require("./shader/utils/uniformParsers.js"), unsafeEvalSupported = require("./shader/utils/unsafeEvalSupported.js"), StartupSystem = require("./startup/StartupSystem.js"), State = require("./state/State.js"), StateSystem = require("./state/StateSystem.js");
require("./system/ISystem.js");
require("./systems.js");
var BaseTexture = require("./textures/BaseTexture.js"), GLTexture = require("./textures/GLTexture.js");
require("./textures/resources/index.js");
var Texture = require("./textures/Texture.js"), TextureGCSystem = require("./textures/TextureGCSystem.js"), TextureMatrix = require("./textures/TextureMatrix.js"), TextureSystem = require("./textures/TextureSystem.js"), TextureUvs = require("./textures/TextureUvs.js"), TransformFeedback = require("./transformFeedback/TransformFeedback.js"), TransformFeedbackSystem = require("./transformFeedback/TransformFeedbackSystem.js"), Quad = require("./utils/Quad.js"), QuadUv = require("./utils/QuadUv.js"), ViewSystem = require("./view/ViewSystem.js"), SystemManager = require("./system/SystemManager.js"), BaseImageResource = require("./textures/resources/BaseImageResource.js"), Resource = require("./textures/resources/Resource.js"), AbstractMultiResource = require("./textures/resources/AbstractMultiResource.js"), ArrayResource = require("./textures/resources/ArrayResource.js"), autoDetectResource = require("./textures/resources/autoDetectResource.js"), BufferResource = require("./textures/resources/BufferResource.js"), CanvasResource = require("./textures/resources/CanvasResource.js"), CubeResource = require("./textures/resources/CubeResource.js"), ImageBitmapResource = require("./textures/resources/ImageBitmapResource.js"), ImageResource = require("./textures/resources/ImageResource.js"), SVGResource = require("./textures/resources/SVGResource.js"), VideoResource = require("./textures/resources/VideoResource.js");
function _interopNamespaceDefault(e) {
  var n = /* @__PURE__ */ Object.create(null);
  return e && Object.keys(e).forEach(function(k) {
    if (k !== "default") {
      var d = Object.getOwnPropertyDescriptor(e, k);
      Object.defineProperty(n, k, d.get ? d : {
        enumerable: !0,
        get: function() {
          return e[k];
        }
      });
    }
  }), n.default = e, n;
}
var utils__namespace = /* @__PURE__ */ _interopNamespaceDefault(utils$1);
const VERSION = "7.4.2";
exports.utils = utils__namespace;
exports.autoDetectRenderer = autoDetectRenderer.autoDetectRenderer;
exports.BackgroundSystem = BackgroundSystem.BackgroundSystem;
exports.BatchDrawCall = BatchDrawCall.BatchDrawCall;
exports.BatchGeometry = BatchGeometry.BatchGeometry;
exports.BatchRenderer = BatchRenderer.BatchRenderer;
exports.BatchShaderGenerator = BatchShaderGenerator.BatchShaderGenerator;
exports.BatchSystem = BatchSystem.BatchSystem;
exports.BatchTextureArray = BatchTextureArray.BatchTextureArray;
exports.ObjectRenderer = ObjectRenderer.ObjectRenderer;
exports.ContextSystem = ContextSystem.ContextSystem;
exports.Filter = Filter.Filter;
exports.FilterState = FilterState.FilterState;
exports.FilterSystem = FilterSystem.FilterSystem;
exports.SpriteMaskFilter = SpriteMaskFilter.SpriteMaskFilter;
exports.defaultFilterVertex = index.defaultFilterVertex;
exports.defaultVertex = index.defaultVertex;
exports.Framebuffer = Framebuffer.Framebuffer;
exports.FramebufferSystem = FramebufferSystem.FramebufferSystem;
exports.GLFramebuffer = GLFramebuffer.GLFramebuffer;
exports.MultisampleSystem = MultisampleSystem.MultisampleSystem;
exports.Attribute = Attribute.Attribute;
exports.Buffer = Buffer.Buffer;
exports.BufferSystem = BufferSystem.BufferSystem;
exports.Geometry = Geometry.Geometry;
exports.GeometrySystem = GeometrySystem.GeometrySystem;
exports.ViewableBuffer = ViewableBuffer.ViewableBuffer;
exports.MaskData = MaskData.MaskData;
exports.MaskSystem = MaskSystem.MaskSystem;
exports.ScissorSystem = ScissorSystem.ScissorSystem;
exports.StencilSystem = StencilSystem.StencilSystem;
exports.PluginSystem = PluginSystem.PluginSystem;
exports.ProjectionSystem = ProjectionSystem.ProjectionSystem;
exports.ObjectRendererSystem = ObjectRendererSystem.ObjectRendererSystem;
exports.Renderer = Renderer.Renderer;
exports.BaseRenderTexture = BaseRenderTexture.BaseRenderTexture;
exports.GenerateTextureSystem = GenerateTextureSystem.GenerateTextureSystem;
exports.RenderTexture = RenderTexture.RenderTexture;
exports.RenderTexturePool = RenderTexturePool.RenderTexturePool;
exports.RenderTextureSystem = RenderTextureSystem.RenderTextureSystem;
exports.GLProgram = GLProgram.GLProgram;
exports.IGLUniformData = GLProgram.IGLUniformData;
exports.Program = Program.Program;
exports.Shader = Shader.Shader;
exports.ShaderSystem = ShaderSystem.ShaderSystem;
exports.UniformGroup = UniformGroup.UniformGroup;
exports.checkMaxIfStatementsInShader = checkMaxIfStatementsInShader.checkMaxIfStatementsInShader;
exports.generateProgram = generateProgram.generateProgram;
exports.createUBOElements = generateUniformBufferSync.createUBOElements;
exports.generateUniformBufferSync = generateUniformBufferSync.generateUniformBufferSync;
exports.getUBOData = generateUniformBufferSync.getUBOData;
exports.getTestContext = getTestContext.getTestContext;
exports.uniformParsers = uniformParsers.uniformParsers;
exports.unsafeEvalSupported = unsafeEvalSupported.unsafeEvalSupported;
exports.StartupSystem = StartupSystem.StartupSystem;
exports.State = State.State;
exports.StateSystem = StateSystem.StateSystem;
exports.BaseTexture = BaseTexture.BaseTexture;
exports.GLTexture = GLTexture.GLTexture;
exports.Texture = Texture.Texture;
exports.TextureGCSystem = TextureGCSystem.TextureGCSystem;
exports.TextureMatrix = TextureMatrix.TextureMatrix;
exports.TextureSystem = TextureSystem.TextureSystem;
exports.TextureUvs = TextureUvs.TextureUvs;
exports.TransformFeedback = TransformFeedback.TransformFeedback;
exports.TransformFeedbackSystem = TransformFeedbackSystem.TransformFeedbackSystem;
exports.Quad = Quad.Quad;
exports.QuadUv = QuadUv.QuadUv;
exports.ViewSystem = ViewSystem.ViewSystem;
exports.SystemManager = SystemManager.SystemManager;
exports.BaseImageResource = BaseImageResource.BaseImageResource;
exports.Resource = Resource.Resource;
exports.AbstractMultiResource = AbstractMultiResource.AbstractMultiResource;
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
exports.VERSION = VERSION;
Object.keys(color).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return color[k];
    }
  });
});
Object.keys(constants).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return constants[k];
    }
  });
});
Object.keys(extensions).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return extensions[k];
    }
  });
});
Object.keys(math).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return math[k];
    }
  });
});
Object.keys(runner).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return runner[k];
    }
  });
});
Object.keys(settings).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return settings[k];
    }
  });
});
Object.keys(ticker).forEach(function(k) {
  k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k) && Object.defineProperty(exports, k, {
    enumerable: !0,
    get: function() {
      return ticker[k];
    }
  });
});
//# sourceMappingURL=index.js.map
