var fragment = `varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void){
    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
    gl_FragColor = color;
}`;
export {
  fragment as default
};
//# sourceMappingURL=particles.frag.mjs.map
