"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var fragment = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
exports.default = fragment;
//# sourceMappingURL=alpha.frag.js.map
