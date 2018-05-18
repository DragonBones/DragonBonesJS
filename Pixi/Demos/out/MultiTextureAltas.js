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
var MultiTextureAltas = /** @class */ (function (_super) {
    __extends(MultiTextureAltas, _super);
    function MultiTextureAltas() {
        var _this = _super.call(this) || this;
        _this._resources.push("resource/effect/effect_ske.json", "resource/effect/effect_tex.json", "resource/effect/effect_tex.png", "resource/effect/effect_sd_tex.json", "resource/effect/effect_sd_tex.png");
        return _this;
    }
    MultiTextureAltas.prototype._onStart = function () {
        var _this = this;
        var factory = dragonBones.PixiFactory.factory;
        factory.parseDragonBonesData(this._pixiResources["resource/effect/effect_ske.json"].data, "hd", 1.0);
        factory.parseDragonBonesData(this._pixiResources["resource/effect/effect_ske.json"].data, "sd", 0.5);
        factory.parseTextureAtlasData(this._pixiResources["resource/effect/effect_tex.json"].data, this._pixiResources["resource/effect/effect_tex.png"].texture, "hd", 1.0);
        factory.parseTextureAtlasData(this._pixiResources["resource/effect/effect_sd_tex.json"].data, this._pixiResources["resource/effect/effect_sd_tex.png"].texture, "sd", 2.0);
        this._armatureDisplayA = factory.buildArmatureDisplay("flower", "hd", null, "hd"); // HD Armature and HD TextureAtlas.
        this._armatureDisplayB = factory.buildArmatureDisplay("flower", "hd", null, "sd"); // HD Armature and SD TextureAtlas.
        this._armatureDisplayC = factory.buildArmatureDisplay("flower", "sd", null, "hd"); // SD Armature and HD TextureAtlas.
        this._armatureDisplayD = factory.buildArmatureDisplay("flower", "sd", null, "sd"); // SD Armature and SD TextureAtlas.
        this._armatureDisplayA.x = -250.0;
        this._armatureDisplayA.y = 0.0;
        this._armatureDisplayB.x = 250.0;
        this._armatureDisplayB.y = 0.0;
        this._armatureDisplayC.x = -250.0;
        this._armatureDisplayC.y = 200.0;
        this._armatureDisplayD.x = 250.0;
        this._armatureDisplayD.y = 200.0;
        this.addChild(this._armatureDisplayA);
        this.addChild(this._armatureDisplayB);
        this.addChild(this._armatureDisplayC);
        this.addChild(this._armatureDisplayD);
        //
        this.interactive = true;
        var touchHandler = function (event) {
            _this._changeAnimation();
        };
        this.addListener("touchstart", touchHandler, this);
        this.addListener("mousedown", touchHandler, this);
        //
        this._changeAnimation();
    };
    MultiTextureAltas.prototype._changeAnimation = function () {
        var animationName = this._armatureDisplayA.animation.lastAnimationName;
        if (animationName) {
            var animationNames = this._armatureDisplayA.animation.animationNames;
            var animationIndex = (animationNames.indexOf(animationName) + 1) % animationNames.length;
            this._armatureDisplayA.animation.play(animationNames[animationIndex]).playTimes = 0;
        }
        else {
            this._armatureDisplayA.animation.play().playTimes = 0;
        }
        animationName = this._armatureDisplayA.animation.lastAnimationName;
        this._armatureDisplayB.animation.play(animationName).playTimes = 0;
        this._armatureDisplayC.animation.play(animationName).playTimes = 0;
        this._armatureDisplayD.animation.play(animationName).playTimes = 0;
    };
    return MultiTextureAltas;
}(BaseDemo));
