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
    function HelloDragonBones(game) {
        var _this = _super.call(this, game) || this;
        _this._resources.push(
        // "resource/assets/dragon_boy_ske.json",
        "resource/assets/dragon_boy_ske.dbbin", "resource/assets/dragon_boy_tex.json", "resource/assets/dragon_boy_tex.png");
        return _this;
    }
    HelloDragonBones.prototype._onStart = function () {
        var factory = dragonBones.PhaserFactory.factory;
        // factory.parseDragonBonesData(this.game.cache.getItem("resource/assets/dragon_boy_ske.json", Phaser.Cache.JSON).data);
        factory.parseDragonBonesData(this.game.cache.getItem("resource/assets/dragon_boy_ske.dbbin", Phaser.Cache.BINARY));
        factory.parseTextureAtlasData(this.game.cache.getItem("resource/assets/dragon_boy_tex.json", Phaser.Cache.JSON).data, this.game.cache.getImage("resource/assets/dragon_boy_tex.png", true).base);
        var armatureDisplay = factory.buildArmatureDisplay("DragonBoy");
        armatureDisplay.animation.play("walk");
        armatureDisplay.x = this.stageWidth * 0.5;
        armatureDisplay.y = this.stageHeight * 0.5 + 100;
        this.addChild(armatureDisplay);
    };
    return HelloDragonBones;
}(BaseTest));
