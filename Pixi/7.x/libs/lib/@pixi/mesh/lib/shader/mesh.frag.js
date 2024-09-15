"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var fragment = `varying vec2 vTextureCoord;
uniform vec4 uColor;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
`;
exports.default = fragment;
//# sourceMappingURL=mesh.frag.js.map
