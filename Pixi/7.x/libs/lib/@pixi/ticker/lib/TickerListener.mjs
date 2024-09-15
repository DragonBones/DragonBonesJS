class TickerListener {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(fn, context = null, priority = 0, once = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this.fn = fn, this.context = context, this.priority = priority, this.once = once;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(fn, context = null) {
    return this.fn === fn && this.context === context;
  }
  /**
   * Emit by calling the current function.
   * @private
   * @param deltaTime - time since the last emit.
   * @returns Next ticker
   */
  emit(deltaTime) {
    this.fn && (this.context ? this.fn.call(this.context, deltaTime) : this.fn(deltaTime));
    const redirect = this.next;
    return this.once && this.destroy(!0), this._destroyed && (this.next = null), redirect;
  }
  /**
   * Connect to the list.
   * @private
   * @param previous - Input node, previous listener
   */
  connect(previous) {
    this.previous = previous, previous.next && (previous.next.previous = this), this.next = previous.next, previous.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @private
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(hard = !1) {
    this._destroyed = !0, this.fn = null, this.context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const redirect = this.next;
    return this.next = hard ? null : redirect, this.previous = null, redirect;
  }
}
export {
  TickerListener
};
//# sourceMappingURL=TickerListener.mjs.map
