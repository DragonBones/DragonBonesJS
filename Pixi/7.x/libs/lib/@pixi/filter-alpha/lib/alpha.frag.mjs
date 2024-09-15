var fragment = `varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;
export {
  fragment as default
};
//# sourceMappingURL=alpha.frag.mjs.map
