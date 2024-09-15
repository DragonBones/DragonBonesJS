"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var defaultFragment = `varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;
uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    gl_FragColor = color * vColor;
}
`;
exports.default = defaultFragment;
//# sourceMappingURL=texture.frag.js.map
