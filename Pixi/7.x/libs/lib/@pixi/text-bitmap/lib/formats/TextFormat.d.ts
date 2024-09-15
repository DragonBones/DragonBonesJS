import { BitmapFontData } from '../BitmapFontData';
/**
 * Internal data format used to convert to BitmapFontData.
 * @private
 */
export interface IBitmapFontRawData {
    info: {
        face: string;
        size: string;
    }[];
    common: {
        lineHeight: string;
    }[];
    page: {
        id: string;
        file: string;
    }[];
    chars: {
        count: number;
    }[];
    char: {
        id: string;
        page: string;
        x: string;
        y: string;
        width: string;
        height: string;
        xoffset: string;
        yoffset: string;
        xadvance: string;
    }[];
    kernings?: {
        count: number;
    }[];
    kerning?: {
        first: string;
        second: string;
        amount: string;
    }[];
    distanceField?: {
        fieldType: string;
        distanceRange: string;
    }[];
}
/**
 * BitmapFont format that's Text-based.
 * @private
 */
export declare class TextFormat {
    /**
     * Check if resource refers to txt font data.
     * @param data
     * @returns - True if resource could be treated as font data, false otherwise.
     */
    static test(data: string | XMLDocument | BitmapFontData): boolean;
    /**
     * Convert text font data to a javascript object.
     * @param txt - Raw string data to be converted
     * @returns - Parsed font data
     */
    static parse(txt: string): BitmapFontData;
}
