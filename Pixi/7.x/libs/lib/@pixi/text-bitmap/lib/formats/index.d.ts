import { TextFormat } from './TextFormat';
import { XMLFormat } from './XMLFormat';
import { XMLStringFormat } from './XMLStringFormat';
import type { BitmapFontData } from '../BitmapFontData';
declare const formats: readonly [typeof TextFormat, typeof XMLFormat, typeof XMLStringFormat];
/**
 * Auto-detect BitmapFont parsing format based on data.
 * @private
 * @param {any} data - Data to detect format
 * @returns {any} Format or null
 */
export declare function autoDetectFormat(data: string | XMLDocument | BitmapFontData): typeof formats[number] | null;
export type { IBitmapFontRawData } from './TextFormat';
export { TextFormat, XMLFormat, XMLStringFormat };
