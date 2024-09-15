"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var fragment = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`;
exports.default = fragment;
//# sourceMappingURL=particles.frag.js.map
