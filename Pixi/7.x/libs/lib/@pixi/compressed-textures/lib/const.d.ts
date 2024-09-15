/**
 * WebGL internal formats, including compressed texture formats provided by extensions
 * @memberof PIXI
 * @static
 * @name INTERNAL_FORMATS
 * @enum {number}
 */
export declare enum INTERNAL_FORMATS {
    /**
     * @default 0x83F0
     */
    COMPRESSED_RGB_S3TC_DXT1_EXT = 33776,
    /**
     * @default 0x83F1
     */
    COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777,
    /**
     * @default 0x83F2
     */
    COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778,
    /**
     * @default 0x83F3
     */
    COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779,
    /**
     * @default 35917
     */
    COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917,
    /**
     * @default 35918
     */
    COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918,
    /**
     * @default 35919
     */
    COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919,
    /**
     * @default 35916
     */
    COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916,
    /**
     * @default 0x9270
     */
    COMPRESSED_R11_EAC = 37488,
    /**
     * @default 0x9271
     */
    COMPRESSED_SIGNED_R11_EAC = 37489,
    /**
     * @default 0x9272
     */
    COMPRESSED_RG11_EAC = 37490,
    /**
     * @default 0x9273
     */
    COMPRESSED_SIGNED_RG11_EAC = 37491,
    /**
     * @default 0x9274
     */
    COMPRESSED_RGB8_ETC2 = 37492,
    /**
     * @default 0x9278
     */
    COMPRESSED_RGBA8_ETC2_EAC = 37496,
    /**
     * @default 0x9275
     */
    COMPRESSED_SRGB8_ETC2 = 37493,
    /**
     * @default 0x9279
     */
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497,
    /**
     * @default 0x9276
     */
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494,
    /**
     * @default 0x9277
     */
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495,
    /**
     * @default 0x8C00
     */
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840,
    /**
     * @default 0x8C02
     */
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842,
    /**
     * @default 0x8C01
     */
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841,
    /**
     * @default 0x8C03
     */
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843,
    /**
     * @default 0x8D64
     */
    COMPRESSED_RGB_ETC1_WEBGL = 36196,
    /**
     * @default 0x8C92
     */
    COMPRESSED_RGB_ATC_WEBGL = 35986,
    /**
     * @default 0x8C93
     */
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35987,
    /**
     * @default 0x87EE
     */
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798,
    /**
     * @default 0x93B0
     */
    COMPRESSED_RGBA_ASTC_4x4_KHR = 37808,
    /**
     * @default 0x8E8C
     */
    COMPRESSED_RGBA_BPTC_UNORM_EXT = 36492,
    /**
     * @default 0x8E8D
     */
    COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = 36493,
    /**
     * @default 0x8E8E
     */
    COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = 36494,
    /**
     * @default 0x8E8F
     */
    COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = 36495
}
/**
 * Maps the compressed texture formats in {@link PIXI.INTERNAL_FORMATS} to the number of bytes taken by
 * each texel.
 * @memberof PIXI
 * @static
 * @ignore
 */
export declare const INTERNAL_FORMAT_TO_BYTES_PER_PIXEL: {
    [id: number]: number;
};
