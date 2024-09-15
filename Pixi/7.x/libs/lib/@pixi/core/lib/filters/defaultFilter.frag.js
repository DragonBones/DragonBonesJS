"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var defaultFragment = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;
exports.default = defaultFragment;
//# sourceMappingURL=defaultFilter.frag.js.map
