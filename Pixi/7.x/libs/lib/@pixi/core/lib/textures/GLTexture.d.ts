/**
 * Internal texture for WebGL context.
 * @memberof PIXI
 */
export declare class GLTexture {
    /** The WebGL texture. */
    texture: WebGLTexture;
    /** Width of texture that was used in texImage2D. */
    width: number;
    /** Height of texture that was used in texImage2D. */
    height: number;
    /** Whether mip levels has to be generated. */
    mipmap: boolean;
    /** WrapMode copied from baseTexture. */
    wrapMode: number;
    /** Type copied from baseTexture. */
    type: number;
    /** Type copied from baseTexture. */
    internalFormat: number;
    /** Type of sampler corresponding to this texture. See {@link PIXI.SAMPLER_TYPES} */
    samplerType: number;
    /** Texture contents dirty flag. */
    dirtyId: number;
    /** Texture style dirty flag. */
    dirtyStyleId: number;
    constructor(texture: WebGLTexture);
}
