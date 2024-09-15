import { ExtensionType } from '@pixi/core';
import type { CacheParser } from './cache';
import type { FormatDetectionParser } from './detections';
import type { LoaderParser } from './loader';
import type { ResolveURLParser } from './resolver';
/**
 * This developer convenience object allows developers to group
 * together the various asset parsers into a single object.
 * @memberof PIXI
 */
interface AssetExtension<ASSET = any, META_DATA = any> {
    extension: ExtensionType.Asset;
    loader?: Partial<LoaderParser<ASSET, META_DATA>>;
    resolver?: Partial<ResolveURLParser>;
    cache?: Partial<CacheParser<ASSET>>;
    detection?: Partial<FormatDetectionParser>;
}
export type { AssetExtension };
