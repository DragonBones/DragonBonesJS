/**
 * Normalized parsed data from .fnt files.
 * @memberof PIXI
 */
export declare class BitmapFontData {
    /** @readonly */
    info: IBitmapFontDataInfo[];
    /** @readonly */
    common: IBitmapFontDataCommon[];
    /** @readonly */
    page: IBitmapFontDataPage[];
    /** @readonly */
    char: IBitmapFontDataChar[];
    /** @readonly */
    kerning: IBitmapFontDataKerning[];
    /** @readonly */
    distanceField: IBitmapFontDataDistanceField[];
    constructor();
}
/** @memberof PIXI */
export interface IBitmapFontDataInfo {
    /** Font face */
    face: string;
    /** Font size */
    size: number;
}
/** @memberof PIXI */
export interface IBitmapFontDataCommon {
    /** Line height, in pixels. */
    lineHeight: number;
}
/** @memberof PIXI */
export interface IBitmapFontDataPage {
    /** Unique id for bitmap texture */
    id: number;
    /** File name */
    file: string;
}
/** @memberof PIXI */
export interface IBitmapFontDataChar {
    /** Unique id of character */
    id: number;
    /** {@link PIXI.IBitmapFontDataPage} id */
    page: number;
    /** x-position of character in page. */
    x: number;
    /** y-position of character in page. */
    y: number;
    /** Width of character in page. */
    width: number;
    /** Height of character in page. */
    height: number;
    /** x-offset to apply when rendering character */
    xoffset: number;
    /** y-offset to apply when rendering character. */
    yoffset: number;
    /** Advancement to apply to next character. */
    xadvance: number;
}
/** @memberof PIXI */
export interface IBitmapFontDataKerning {
    /** First character of pair */
    first: number;
    /** Second character of pair */
    second: number;
    /** x-offset to apply between first & second characters when they are next to each other. */
    amount: number;
}
/** @memberof PIXI */
export interface IBitmapFontDataDistanceField {
    /** Type of distance field */
    fieldType: string;
    /** Range of distance */
    distanceRange: number;
}
