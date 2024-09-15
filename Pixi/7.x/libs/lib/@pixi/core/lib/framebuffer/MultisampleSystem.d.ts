import { MSAA_QUALITY } from '@pixi/constants';
import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderingContext } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
/**
 * System that manages the multisample property on the WebGL renderer
 * @memberof PIXI
 */
export declare class MultisampleSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * The number of msaa samples of the canvas.
     * @readonly
     */
    multisample: MSAA_QUALITY;
    private renderer;
    constructor(renderer: Renderer);
    protected contextChange(gl: IRenderingContext): void;
    destroy(): void;
}
