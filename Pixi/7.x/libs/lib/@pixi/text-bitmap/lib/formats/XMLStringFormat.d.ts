import type { BitmapFontData } from '../BitmapFontData';
/**
 * BitmapFont format that's XML-based.
 * @private
 */
export declare class XMLStringFormat {
    /**
     * Check if resource refers to text xml font data.
     * @param data
     * @returns - True if resource could be treated as font data, false otherwise.
     */
    static test(data: string | XMLDocument | BitmapFontData): boolean;
    /**
     * Convert the text XML into BitmapFontData that we can use.
     * @param xmlTxt
     * @returns - Data to use for BitmapFont
     */
    static parse(xmlTxt: string): BitmapFontData;
}
