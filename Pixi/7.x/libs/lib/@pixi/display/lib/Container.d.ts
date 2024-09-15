import { DisplayObject } from './DisplayObject';
import type { Rectangle, Renderer } from '@pixi/core';
import type { IDestroyOptions } from './DisplayObject';
export interface Container extends GlobalMixins.Container, DisplayObject {
}
/**
 * Container is a general-purpose display object that holds children. It also adds built-in support for advanced
 * rendering features like masking and filtering.
 *
 * It is the base class of all display objects that act as a container for other objects, including Graphics
 * and Sprite.
 * @example
 * import { BlurFilter, Container, Graphics, Sprite } from 'pixi.js';
 *
 * const container = new Container();
 * const sprite = Sprite.from('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png');
 *
 * sprite.width = 512;
 * sprite.height = 512;
 *
 * // Adds a sprite as a child to this container. As a result, the sprite will be rendered whenever the container
 * // is rendered.
 * container.addChild(sprite);
 *
 * // Blurs whatever is rendered by the container
 * container.filters = [new BlurFilter()];
 *
 * // Only the contents within a circle at the center should be rendered onto the screen.
 * container.mask = new Graphics()
 *     .beginFill(0xffffff)
 *     .drawCircle(sprite.width / 2, sprite.height / 2, Math.min(sprite.width, sprite.height) / 2)
 *     .endFill();
 * @memberof PIXI
 */
export declare class Container<T extends DisplayObject = DisplayObject> extends DisplayObject {
    /**
     * Sets the default value for the container property `sortableChildren`.
     * If set to true, the container will sort its children by zIndex value
     * when `updateTransform()` is called, or manually if `sortChildren()` is called.
     *
     * This actually changes the order of elements in the array, so should be treated
     * as a basic solution that is not performant compared to other solutions,
     * such as {@link https://github.com/pixijs/layers PixiJS Layers}.
     *
     * Also be aware of that this may not work nicely with the `addChildAt()` function,
     * as the `zIndex` sorting may cause the child to automatically sorted to another position.
     * @static
     */
    static defaultSortableChildren: boolean;
    /**
     * The array of children of this container.
     * @readonly
     */
    readonly children: T[];
    /**
     * If set to true, the container will sort its children by `zIndex` value
     * when `updateTransform()` is called, or manually if `sortChildren()` is called.
     *
     * This actually changes the order of elements in the array, so should be treated
     * as a basic solution that is not performant compared to other solutions,
     * such as {@link https://github.com/pixijs/layers PixiJS Layers}
     *
     * Also be aware of that this may not work nicely with the `addChildAt()` function,
     * as the `zIndex` sorting may cause the child to automatically sorted to another position.
     * @see PIXI.Container.defaultSortableChildren
     */
    sortableChildren: boolean;
    /**
     * Should children be sorted by zIndex at the next updateTransform call.
     *
     * Will get automatically set to true if a new child is added, or if a child's zIndex changes.
     */
    sortDirty: boolean;
    parent: Container;
    containerUpdateTransform: () => void;
    protected _width: number;
    protected _height: number;
    constructor();
    /**
     * Overridable method that can be used by Container subclasses whenever the children array is modified.
     * @param _length
     */
    protected onChildrenChange(_length?: number): void;
    /**
     * Adds one or more children to the container.
     *
     * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
     * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to add to the container
     * @returns {PIXI.DisplayObject} - The first child that was added.
     */
    addChild<U extends T[]>(...children: U): U[0];
    /**
     * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown.
     * If the child is already in this container, it will be moved to the specified index.
     * @param {PIXI.DisplayObject} child - The child to add.
     * @param {number} index - The absolute index where the child will be positioned at the end of the operation.
     * @returns {PIXI.DisplayObject} The child that was added.
     */
    addChildAt<U extends T>(child: U, index: number): U;
    /**
     * Swaps the position of 2 Display Objects within this container.
     * @param child - First display object to swap
     * @param child2 - Second display object to swap
     */
    swapChildren(child: T, child2: T): void;
    /**
     * Returns the index position of a child DisplayObject instance
     * @param child - The DisplayObject instance to identify
     * @returns - The index position of the child display object to identify
     */
    getChildIndex(child: T): number;
    /**
     * Changes the position of an existing child in the display object container
     * @param child - The child DisplayObject instance for which you want to change the index number
     * @param index - The resulting index number for the child display object
     */
    setChildIndex(child: T, index: number): void;
    /**
     * Returns the child at the specified index
     * @param index - The index to get the child at
     * @returns - The child at the given index, if any.
     */
    getChildAt(index: number): T;
    /**
     * Removes one or more children from the container.
     * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to remove
     * @returns {PIXI.DisplayObject} The first child that was removed.
     */
    removeChild<U extends T[]>(...children: U): U[0];
    /**
     * Removes a child from the specified index position.
     * @param index - The index to get the child from
     * @returns The child that was removed.
     */
    removeChildAt(index: number): T;
    /**
     * Removes all children from this container that are within the begin and end indexes.
     * @param beginIndex - The beginning position.
     * @param endIndex - The ending position. Default value is size of the container.
     * @returns - List of removed children
     */
    removeChildren(beginIndex?: number, endIndex?: number): T[];
    /** Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex. */
    sortChildren(): void;
    /** Updates the transform on all children of this container for rendering. */
    updateTransform(): void;
    /**
     * Recalculates the bounds of the container.
     *
     * This implementation will automatically fit the children's bounds into the calculation. Each child's bounds
     * is limited to its mask's bounds or filterArea, if any is applied.
     */
    calculateBounds(): void;
    /**
     * Retrieves the local bounds of the displayObject as a rectangle object.
     *
     * Calling `getLocalBounds` may invalidate the `_bounds` of the whole subtree below. If using it inside a render()
     * call, it is advised to call `getBounds()` immediately after to recalculate the world bounds of the subtree.
     * @param rect - Optional rectangle to store the result of the bounds calculation.
     * @param skipChildrenUpdate - Setting to `true` will stop re-calculation of children transforms,
     *  it was default behaviour of pixi 4.0-5.2 and caused many problems to users.
     * @returns - The rectangular bounding area.
     */
    getLocalBounds(rect?: Rectangle, skipChildrenUpdate?: boolean): Rectangle;
    /**
     * Recalculates the content bounds of this object. This should be overriden to
     * calculate the bounds of this specific object (not including children).
     * @protected
     */
    protected _calculateBounds(): void;
    /**
     * Renders this object and its children with culling.
     * @protected
     * @param {PIXI.Renderer} renderer - The renderer
     */
    protected _renderWithCulling(renderer: Renderer): void;
    /**
     * Renders the object using the WebGL renderer.
     *
     * The [_render]{@link PIXI.Container#_render} method is be overriden for rendering the contents of the
     * container itself. This `render` method will invoke it, and also invoke the `render` methods of all
     * children afterward.
     *
     * If `renderable` or `visible` is false or if `worldAlpha` is not positive or if `cullable` is true and
     * the bounds of this object are out of frame, this implementation will entirely skip rendering.
     * See {@link PIXI.DisplayObject} for choosing between `renderable` or `visible`. Generally,
     * setting alpha to zero is not recommended for purely skipping rendering.
     *
     * When your scene becomes large (especially when it is larger than can be viewed in a single screen), it is
     * advised to employ **culling** to automatically skip rendering objects outside of the current screen.
     * See [cullable]{@link PIXI.DisplayObject#cullable} and [cullArea]{@link PIXI.DisplayObject#cullArea}.
     * Other culling methods might be better suited for a large number static objects; see
     * [@pixi-essentials/cull]{@link https://www.npmjs.com/package/@pixi-essentials/cull} and
     * [pixi-cull]{@link https://www.npmjs.com/package/pixi-cull}.
     *
     * The [renderAdvanced]{@link PIXI.Container#renderAdvanced} method is internally used when when masking or
     * filtering is applied on a container. This does, however, break batching and can affect performance when
     * masking and filtering is applied extensively throughout the scene graph.
     * @param renderer - The renderer
     */
    render(renderer: Renderer): void;
    /**
     * Render the object using the WebGL renderer and advanced features.
     * @param renderer - The renderer
     */
    protected renderAdvanced(renderer: Renderer): void;
    /**
     * To be overridden by the subclasses.
     * @param _renderer - The renderer
     */
    protected _render(_renderer: Renderer): void;
    /**
     * Removes all internal references and listeners as well as removes children from the display list.
     * Do not use a Container after calling `destroy`.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
     *  method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the texture of the child sprite
     * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the base texture of the child sprite
     */
    destroy(options?: IDestroyOptions | boolean): void;
    /** The width of the Container, setting this will actually modify the scale to achieve the value set. */
    get width(): number;
    set width(value: number);
    /** The height of the Container, setting this will actually modify the scale to achieve the value set. */
    get height(): number;
    set height(value: number);
}
