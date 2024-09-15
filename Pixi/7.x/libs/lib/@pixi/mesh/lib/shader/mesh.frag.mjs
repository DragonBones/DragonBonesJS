var fragment = `varying vec2 vTextureCoord;
uniform vec4 uColor;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;
}
`;
export {
  fragment as default
};
//# sourceMappingURL=mesh.frag.mjs.map
