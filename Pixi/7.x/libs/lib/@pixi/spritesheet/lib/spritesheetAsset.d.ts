import { Spritesheet } from './Spritesheet';
import type { AssetExtension } from '@pixi/assets';
import type { ISpritesheetData } from './Spritesheet';
export interface SpriteSheetJson extends ISpritesheetData {
    meta: {
        image: string;
        scale: string;
        related_multi_packs?: string[];
    };
}
/**
 * Asset extension for loading spritesheets.
 * @memberof PIXI
 * @type {PIXI.AssetExtension}
 */
export declare const spritesheetAsset: AssetExtension<Spritesheet<ISpritesheetData> | SpriteSheetJson, any>;
