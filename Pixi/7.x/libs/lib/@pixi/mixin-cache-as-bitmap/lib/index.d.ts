/// <reference path="../global.d.ts" />
import { Rectangle } from '@pixi/core';
import { Sprite } from '@pixi/sprite';
import type { IPointData, IRenderer, MaskData, Renderer } from '@pixi/core';
import type { Container, IDestroyOptions } from '@pixi/display';
/**
 * @class
 * @ignore
 * @private
 */
export declare class CacheData {
    textureCacheId: string;
    originalRender: (renderer: Renderer) => void;
    originalRenderCanvas: (renderer: IRenderer) => void;
    originalCalculateBounds: () => void;
    originalGetLocalBounds: (rect?: Rectangle) => Rectangle;
    originalUpdateTransform: () => void;
    originalDestroy: (options?: IDestroyOptions | boolean) => void;
    originalMask: Container | MaskData;
    originalFilterArea: Rectangle;
    originalContainsPoint: (point: IPointData) => boolean;
    sprite: Sprite;
    constructor();
}
