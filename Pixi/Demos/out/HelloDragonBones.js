"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * How to use
 * 1. Load data.
 *
 * 2. Parse data.
 *    factory.parseDragonBonesData();
 *    factory.parseTextureAtlasData();
 *
 * 3. Build armature.
 *    armatureDisplay = factory.buildArmatureDisplay("armatureName");
 *
 * 4. Play animation.
 *    armatureDisplay.animation.play("animationName");
 *
 * 5. Add armature to stage.
 *    addChild(armatureDisplay);
 */
var HelloDragonBones = (function (_super) {
    __extends(HelloDragonBones, _super);
    function HelloDragonBones() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HelloDragonBones.prototype._onStart = function () {
        var _this = this;
        PIXI.loader
            .add("dragonBonesData", "./resource/assets/dragon_boy_ske.dbbin", { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })
            .add("textureData", "./resource/assets/dragon_boy_tex.json")
            .add("texture", "./resource/assets/dragon_boy_tex.png");
        PIXI.loader.once("complete", function (loader, resources) {
            var factory = dragonBones.PixiFactory.factory;
            factory.parseDragonBonesData(resources["dragonBonesData"].data);
            factory.parseTextureAtlasData(resources["textureData"].data, resources["texture"].texture);
            var armatureDisplay = factory.buildArmatureDisplay("DragonBoy");
            armatureDisplay.animation.play("walk");
            _this.stage.addChild(armatureDisplay);
            armatureDisplay.x = _this._renderer.width * 0.5;
            armatureDisplay.y = _this._renderer.height * 0.5 + 100;
            //
            _this._startRenderTick();
        });
        PIXI.loader.load();
    };
    return HelloDragonBones;
}(BaseTest));
