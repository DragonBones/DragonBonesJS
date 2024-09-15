import { BitmapFontData } from '../BitmapFontData';
/**
 * BitmapFont format that's XML-based.
 * @private
 */
export declare class XMLFormat {
    /**
     * Check if resource refers to xml font data.
     * @param data
     * @returns - True if resource could be treated as font data, false otherwise.
     */
    static test(data: string | XMLDocument | BitmapFontData): boolean;
    /**
     * Convert the XML into BitmapFontData that we can use.
     * @param xml
     * @returns - Data to use for BitmapFont
     */
    static parse(xml: Document): BitmapFontData;
}
