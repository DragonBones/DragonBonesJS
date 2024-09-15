import { ObjectRenderer, QuadUv, Shader, State } from '@pixi/core';
import type { ExtensionMetadata, Renderer } from '@pixi/core';
import type { TilingSprite } from './TilingSprite';
/**
 * WebGL renderer plugin for tiling sprites
 * @class
 * @memberof PIXI
 * @extends PIXI.ObjectRenderer
 */
export declare class TilingSpriteRenderer extends ObjectRenderer {
    /** @ignore */
    static extension: ExtensionMetadata;
    shader: Shader;
    simpleShader: Shader;
    quad: QuadUv;
    readonly state: State;
    /**
     * constructor for renderer
     * @param {PIXI.Renderer} renderer - The renderer this tiling awesomeness works for.
     */
    constructor(renderer: Renderer);
    /** Creates shaders when context is initialized. */
    contextChange(): void;
    /**
     * @param {PIXI.TilingSprite} ts - tilingSprite to be rendered
     */
    render(ts: TilingSprite): void;
}
