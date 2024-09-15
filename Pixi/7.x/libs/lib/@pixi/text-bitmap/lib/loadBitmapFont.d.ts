import { BitmapFont } from './BitmapFont';
import type { LoaderParser } from '@pixi/assets';
/** simple loader plugin for loading in bitmap fonts! */
export declare const loadBitmapFont: LoaderParser<string | BitmapFont, any, Record<string, any>>;
