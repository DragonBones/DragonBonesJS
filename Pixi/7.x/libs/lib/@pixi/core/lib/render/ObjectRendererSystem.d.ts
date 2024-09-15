import type { ExtensionMetadata } from '@pixi/extensions';
import type { IRenderableObject, IRendererRenderOptions } from '../IRenderer';
import type { Renderer } from '../Renderer';
import type { ISystem } from '../system/ISystem';
/**
 * system that provides a render function that focussing on rendering Pixi Scene Graph objects
 * to either the main view or to a renderTexture.  Used for Canvas `WebGL` contexts
 * @memberof PIXI
 */
export declare class ObjectRendererSystem implements ISystem {
    /** @ignore */
    static extension: ExtensionMetadata;
    renderer: Renderer;
    /**
     * Flag if we are rendering to the screen vs renderTexture
     * @readonly
     * @default true
     */
    renderingToScreen: boolean;
    /**
     * the last object rendered by the renderer. Useful for other plugins like interaction managers
     * @readonly
     */
    lastObjectRendered: IRenderableObject;
    constructor(renderer: Renderer);
    /**
     * Renders the object to its WebGL view.
     * @param displayObject - The object to be rendered.
     * @param options - the options to be passed to the renderer
     */
    render(displayObject: IRenderableObject, options?: IRendererRenderOptions): void;
    destroy(): void;
}
