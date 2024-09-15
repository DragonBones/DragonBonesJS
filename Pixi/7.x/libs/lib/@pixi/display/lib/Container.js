"use strict";
var core = require("@pixi/core"), DisplayObject = require("./DisplayObject.js");
const tempMatrix = new core.Matrix();
function sortChildren(a, b) {
  return a.zIndex === b.zIndex ? a._lastSortedIndex - b._lastSortedIndex : a.zIndex - b.zIndex;
}
const _Container = class _Container2 extends DisplayObject.DisplayObject {
  constructor() {
    super(), this.children = [], this.sortableChildren = _Container2.defaultSortableChildren, this.sortDirty = !1;
  }
  /**
   * Overridable method that can be used by Container subclasses whenever the children array is modified.
   * @param _length
   */
  onChildrenChange(_length) {
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to add to the container
   * @returns {PIXI.DisplayObject} - The first child that was added.
   */
  addChild(...children) {
    if (children.length > 1)
      for (let i = 0; i < children.length; i++)
        this.addChild(children[i]);
    else {
      const child = children[0];
      child.parent && child.parent.removeChild(child), child.parent = this, this.sortDirty = !0, child.transform._parentID = -1, this.children.push(child), this._boundsID++, this.onChildrenChange(this.children.length - 1), this.emit("childAdded", child, this, this.children.length - 1), child.emit("added", this);
    }
    return children[0];
  }
  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown.
   * If the child is already in this container, it will be moved to the specified index.
   * @param {PIXI.DisplayObject} child - The child to add.
   * @param {number} index - The absolute index where the child will be positioned at the end of the operation.
   * @returns {PIXI.DisplayObject} The child that was added.
   */
  addChildAt(child, index) {
    if (index < 0 || index > this.children.length)
      throw new Error(`${child}addChildAt: The index ${index} supplied is out of bounds ${this.children.length}`);
    return child.parent && child.parent.removeChild(child), child.parent = this, this.sortDirty = !0, child.transform._parentID = -1, this.children.splice(index, 0, child), this._boundsID++, this.onChildrenChange(index), child.emit("added", this), this.emit("childAdded", child, this, index), child;
  }
  /**
   * Swaps the position of 2 Display Objects within this container.
   * @param child - First display object to swap
   * @param child2 - Second display object to swap
   */
  swapChildren(child, child2) {
    if (child === child2)
      return;
    const index1 = this.getChildIndex(child), index2 = this.getChildIndex(child2);
    this.children[index1] = child2, this.children[index2] = child, this.onChildrenChange(index1 < index2 ? index1 : index2);
  }
  /**
   * Returns the index position of a child DisplayObject instance
   * @param child - The DisplayObject instance to identify
   * @returns - The index position of the child display object to identify
   */
  getChildIndex(child) {
    const index = this.children.indexOf(child);
    if (index === -1)
      throw new Error("The supplied DisplayObject must be a child of the caller");
    return index;
  }
  /**
   * Changes the position of an existing child in the display object container
   * @param child - The child DisplayObject instance for which you want to change the index number
   * @param index - The resulting index number for the child display object
   */
  setChildIndex(child, index) {
    if (index < 0 || index >= this.children.length)
      throw new Error(`The index ${index} supplied is out of bounds ${this.children.length}`);
    const currentIndex = this.getChildIndex(child);
    core.utils.removeItems(this.children, currentIndex, 1), this.children.splice(index, 0, child), this.onChildrenChange(index);
  }
  /**
   * Returns the child at the specified index
   * @param index - The index to get the child at
   * @returns - The child at the given index, if any.
   */
  getChildAt(index) {
    if (index < 0 || index >= this.children.length)
      throw new Error(`getChildAt: Index (${index}) does not exist.`);
    return this.children[index];
  }
  /**
   * Removes one or more children from the container.
   * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to remove
   * @returns {PIXI.DisplayObject} The first child that was removed.
   */
  removeChild(...children) {
    if (children.length > 1)
      for (let i = 0; i < children.length; i++)
        this.removeChild(children[i]);
    else {
      const child = children[0], index = this.children.indexOf(child);
      if (index === -1)
        return null;
      child.parent = null, child.transform._parentID = -1, core.utils.removeItems(this.children, index, 1), this._boundsID++, this.onChildrenChange(index), child.emit("removed", this), this.emit("childRemoved", child, this, index);
    }
    return children[0];
  }
  /**
   * Removes a child from the specified index position.
   * @param index - The index to get the child from
   * @returns The child that was removed.
   */
  removeChildAt(index) {
    const child = this.getChildAt(index);
    return child.parent = null, child.transform._parentID = -1, core.utils.removeItems(this.children, index, 1), this._boundsID++, this.onChildrenChange(index), child.emit("removed", this), this.emit("childRemoved", child, this, index), child;
  }
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   */
  removeChildren(beginIndex = 0, endIndex = this.children.length) {
    const begin = beginIndex, end = endIndex, range = end - begin;
    let removed;
    if (range > 0 && range <= end) {
      removed = this.children.splice(begin, range);
      for (let i = 0; i < removed.length; ++i)
        removed[i].parent = null, removed[i].transform && (removed[i].transform._parentID = -1);
      this._boundsID++, this.onChildrenChange(beginIndex);
      for (let i = 0; i < removed.length; ++i)
        removed[i].emit("removed", this), this.emit("childRemoved", removed[i], this, i);
      return removed;
    } else if (range === 0 && this.children.length === 0)
      return [];
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  }
  /** Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex. */
  sortChildren() {
    let sortRequired = !1;
    for (let i = 0, j = this.children.length; i < j; ++i) {
      const child = this.children[i];
      child._lastSortedIndex = i, !sortRequired && child.zIndex !== 0 && (sortRequired = !0);
    }
    sortRequired && this.children.length > 1 && this.children.sort(sortChildren), this.sortDirty = !1;
  }
  /** Updates the transform on all children of this container for rendering. */
  updateTransform() {
    this.sortableChildren && this.sortDirty && this.sortChildren(), this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
    for (let i = 0, j = this.children.length; i < j; ++i) {
      const child = this.children[i];
      child.visible && child.updateTransform();
    }
  }
  /**
   * Recalculates the bounds of the container.
   *
   * This implementation will automatically fit the children's bounds into the calculation. Each child's bounds
   * is limited to its mask's bounds or filterArea, if any is applied.
   */
  calculateBounds() {
    this._bounds.clear(), this._calculateBounds();
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (!(!child.visible || !child.renderable))
        if (child.calculateBounds(), child._mask) {
          const maskObject = child._mask.isMaskData ? child._mask.maskObject : child._mask;
          maskObject ? (maskObject.calculateBounds(), this._bounds.addBoundsMask(child._bounds, maskObject._bounds)) : this._bounds.addBounds(child._bounds);
        } else
          child.filterArea ? this._bounds.addBoundsArea(child._bounds, child.filterArea) : this._bounds.addBounds(child._bounds);
    }
    this._bounds.updateID = this._boundsID;
  }
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
  getLocalBounds(rect, skipChildrenUpdate = !1) {
    const result = super.getLocalBounds(rect);
    if (!skipChildrenUpdate)
      for (let i = 0, j = this.children.length; i < j; ++i) {
        const child = this.children[i];
        child.visible && child.updateTransform();
      }
    return result;
  }
  /**
   * Recalculates the content bounds of this object. This should be overriden to
   * calculate the bounds of this specific object (not including children).
   * @protected
   */
  _calculateBounds() {
  }
  /**
   * Renders this object and its children with culling.
   * @protected
   * @param {PIXI.Renderer} renderer - The renderer
   */
  _renderWithCulling(renderer) {
    const sourceFrame = renderer.renderTexture.sourceFrame;
    if (!(sourceFrame.width > 0 && sourceFrame.height > 0))
      return;
    let bounds, transform;
    this.cullArea ? (bounds = this.cullArea, transform = this.worldTransform) : this._render !== _Container2.prototype._render && (bounds = this.getBounds(!0));
    const projectionTransform = renderer.projection.transform;
    if (projectionTransform && (transform ? (transform = tempMatrix.copyFrom(transform), transform.prepend(projectionTransform)) : transform = projectionTransform), bounds && sourceFrame.intersects(bounds, transform))
      this._render(renderer);
    else if (this.cullArea)
      return;
    for (let i = 0, j = this.children.length; i < j; ++i) {
      const child = this.children[i], childCullable = child.cullable;
      child.cullable = childCullable || !this.cullArea, child.render(renderer), child.cullable = childCullable;
    }
  }
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
  render(renderer) {
    if (!(!this.visible || this.worldAlpha <= 0 || !this.renderable))
      if (this._mask || this.filters?.length)
        this.renderAdvanced(renderer);
      else if (this.cullable)
        this._renderWithCulling(renderer);
      else {
        this._render(renderer);
        for (let i = 0, j = this.children.length; i < j; ++i)
          this.children[i].render(renderer);
      }
  }
  /**
   * Render the object using the WebGL renderer and advanced features.
   * @param renderer - The renderer
   */
  renderAdvanced(renderer) {
    const filters = this.filters, mask = this._mask;
    if (filters) {
      this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0;
      for (let i = 0; i < filters.length; i++)
        filters[i].enabled && this._enabledFilters.push(filters[i]);
    }
    const flush = filters && this._enabledFilters?.length || mask && (!mask.isMaskData || mask.enabled && (mask.autoDetect || mask.type !== core.MASK_TYPES.NONE));
    if (flush && renderer.batch.flush(), filters && this._enabledFilters?.length && renderer.filter.push(this, this._enabledFilters), mask && renderer.mask.push(this, this._mask), this.cullable)
      this._renderWithCulling(renderer);
    else {
      this._render(renderer);
      for (let i = 0, j = this.children.length; i < j; ++i)
        this.children[i].render(renderer);
    }
    flush && renderer.batch.flush(), mask && renderer.mask.pop(this), filters && this._enabledFilters?.length && renderer.filter.pop();
  }
  /**
   * To be overridden by the subclasses.
   * @param _renderer - The renderer
   */
  _render(_renderer) {
  }
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
  destroy(options) {
    super.destroy(), this.sortDirty = !1;
    const destroyChildren = typeof options == "boolean" ? options : options?.children, oldChildren = this.removeChildren(0, this.children.length);
    if (destroyChildren)
      for (let i = 0; i < oldChildren.length; ++i)
        oldChildren[i].destroy(options);
  }
  /** The width of the Container, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return this.scale.x * this.getLocalBounds().width;
  }
  set width(value) {
    const width = this.getLocalBounds().width;
    width !== 0 ? this.scale.x = value / width : this.scale.x = 1, this._width = value;
  }
  /** The height of the Container, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return this.scale.y * this.getLocalBounds().height;
  }
  set height(value) {
    const height = this.getLocalBounds().height;
    height !== 0 ? this.scale.y = value / height : this.scale.y = 1, this._height = value;
  }
};
_Container.defaultSortableChildren = !1;
let Container = _Container;
Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;
exports.Container = Container;
//# sourceMappingURL=Container.js.map
