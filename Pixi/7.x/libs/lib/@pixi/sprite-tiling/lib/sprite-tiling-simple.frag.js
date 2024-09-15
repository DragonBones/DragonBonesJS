"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var fragmentSimpleSrc = `#version 100
#define SHADER_NAME Tiling-Sprite-Simple-100

precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 uColor;

void main(void)
{
    vec4 texSample = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texSample * uColor;
}
`;
exports.default = fragmentSimpleSrc;
//# sourceMappingURL=sprite-tiling-simple.frag.js.map
