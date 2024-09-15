import type { LoaderParser } from './LoaderParser';
/**
 * Loader plugin for handling web fonts
 * @memberof PIXI
 */
export type LoadFontData = {
    family: string;
    display: string;
    featureSettings: string;
    stretch: string;
    style: string;
    unicodeRange: string;
    variant: string;
    weights: string[];
};
/**
 * Return font face name from a file name
 * Ex.: 'fonts/tital-one.woff' turns into 'Titan One'
 * @param url - File url
 */
export declare function getFontFamilyName(url: string): string;
/** Web font loader plugin */
export declare const loadWebFont: LoaderParser<FontFace | FontFace[], any, Record<string, any>>;
