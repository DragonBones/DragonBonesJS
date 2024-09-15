"use strict";
class BackgroundLoader {
  /**
   * @param loader
   * @param verbose - should the loader log to the console
   */
  constructor(loader, verbose = !1) {
    this._loader = loader, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = verbose;
  }
  /**
   * Adds an array of assets to load.
   * @param assetUrls - assets to load
   */
  add(assetUrls) {
    assetUrls.forEach((a) => {
      this._assetList.push(a);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  /**
   * Loads the next set of assets. Will try to load as many assets as it can at the same time.
   *
   * The max assets it will try to load at one time will be 4.
   */
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = !0;
      const toLoad = [], toLoadAmount = Math.min(this._assetList.length, this._maxConcurrent);
      for (let i = 0; i < toLoadAmount; i++)
        toLoad.push(this._assetList.pop());
      await this._loader.load(toLoad), this._isLoading = !1, this._next();
    }
  }
  /**
   * Activate/Deactivate the loading. If set to true then it will immediately continue to load the next asset.
   * @returns whether the class is active
   */
  get active() {
    return this._isActive;
  }
  set active(value) {
    this._isActive !== value && (this._isActive = value, value && !this._isLoading && this._next());
  }
}
exports.BackgroundLoader = BackgroundLoader;
//# sourceMappingURL=BackgroundLoader.js.map
