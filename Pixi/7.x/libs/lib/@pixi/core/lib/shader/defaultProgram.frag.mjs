var defaultFragment = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor *= texture2D(uSampler, vTextureCoord);
}`;
export {
  defaultFragment as default
};
//# sourceMappingURL=defaultProgram.frag.mjs.map
