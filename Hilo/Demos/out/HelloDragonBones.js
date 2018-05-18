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
var HelloDragonBones = /** @class */ (function (_super) {
    __extends(HelloDragonBones, _super);
    function HelloDragonBones() {
        var _this = _super.call(this) || this;
        _this._resources.push(
        // "resource/assets/dragon_boy_ske.json",
        "resource/assets/dragon_boy_ske.dbbin", "resource/assets/dragon_boy_tex.json", "resource/assets/dragon_boy_tex.png");
        return _this;
    }
    HelloDragonBones.prototype._onStart = function () {
        var factory = dragonBones.HiloFactory.factory;
        // factory.parseDragonBonesData(this._hiloResources["resource/assets/dragon_boy_ske.json"]);
        factory.parseDragonBonesData(this._hiloResources["resource/assets/dragon_boy_ske.dbbin"]);
        factory.parseTextureAtlasData(this._hiloResources["resource/assets/dragon_boy_tex.json"], this._hiloResources["resource/assets/dragon_boy_tex.png"]);
        var armatureDisplay = factory.buildArmatureDisplay("DragonBoy");
        armatureDisplay.animation.play("walk");
        armatureDisplay.x = this.stageWidth * 0.5;
        armatureDisplay.y = this.stageHeight * 0.5 + 100;
        this.addChild(armatureDisplay);
    };
    return HelloDragonBones;
}(BaseTest));
