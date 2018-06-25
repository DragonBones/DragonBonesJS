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
var ReplaceSkin = /** @class */ (function (_super) {
    __extends(ReplaceSkin, _super);
    function ReplaceSkin() {
        var _this = _super.call(this) || this;
        _this._replaceSuitIndex = 0;
        _this._factory = dragonBones.PixiFactory.factory;
        _this._suitConfigs = [];
        _this._replaceSuitParts = [];
        _this._suitConfigs.push([
            "2010600a",
            "2010600a_1",
            "20208003",
            "20208003_1",
            "20208003_2",
            "20208003_3",
            "20405006",
            "20509005",
            "20703016",
            "20703016_1",
            "2080100c",
            "2080100e",
            "2080100e_1",
            "20803005",
            "2080500b",
            "2080500b_1",
        ]);
        _this._suitConfigs.push([
            "20106010",
            "20106010_1",
            "20208006",
            "20208006_1",
            "20208006_2",
            "20208006_3",
            "2040600b",
            "2040600b_1",
            "20509007",
            "20703020",
            "20703020_1",
            "2080b003",
            "20801015",
        ]);
        _this._resources.push("resource/you_xin/body/body_ske.json", "resource/you_xin/body/body_tex.json", "resource/you_xin/body/body_tex.png");
        for (var i = 0, l = _this._suitConfigs.length; i < l; ++i) {
            for (var _i = 0, _a = _this._suitConfigs[i]; _i < _a.length; _i++) {
                var partArmatureName = _a[_i];
                // resource/you_xin/suit1/2010600a/xxxxxx
                var path = "resource/you_xin/" + "suit" + (i + 1) + "/" + partArmatureName + "/" + partArmatureName;
                var dragonBonesJSONPath = path + "_ske.json";
                var textureAtlasJSONPath = path + "_tex.json";
                var textureAtlasPath = path + "_tex.png";
                //
                _this._resources.push(dragonBonesJSONPath, textureAtlasJSONPath, textureAtlasPath);
            }
        }
        return _this;
    }
    ReplaceSkin.prototype._onStart = function () {
        var _this = this;
        this._factory.parseDragonBonesData(this._pixiResources["resource/you_xin/body/body_ske.json"].data);
        this._factory.parseTextureAtlasData(this._pixiResources["resource/you_xin/body/body_tex.json"].data, this._pixiResources["resource/you_xin/body/body_tex.png"].texture);
        for (var i = 0, l = this._suitConfigs.length; i < l; ++i) {
            for (var _i = 0, _a = this._suitConfigs[i]; _i < _a.length; _i++) {
                var partArmatureName = _a[_i];
                var path = "resource/you_xin/" + "suit" + (i + 1) + "/" + partArmatureName + "/" + partArmatureName;
                var dragonBonesJSONPath = path + "_ske.json";
                var textureAtlasJSONPath = path + "_tex.json";
                var textureAtlasPath = path + "_tex.png";
                //
                this._factory.parseDragonBonesData(this._pixiResources[dragonBonesJSONPath].data);
                this._factory.parseTextureAtlasData(this._pixiResources[textureAtlasJSONPath].data, this._pixiResources[textureAtlasPath].texture);
            }
        }
        //
        this._armatureDisplay = this._factory.buildArmatureDisplay("body");
        this._armatureDisplay.on(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);
        this._armatureDisplay.animation.play("idle", 0);
        //
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 200.0;
        this._armatureDisplay.scale.x = this._armatureDisplay.scale.y = 0.25;
        this.addChild(this._armatureDisplay);
        // Init the first suit.
        for (var _b = 0, _c = this._suitConfigs[0]; _b < _c.length; _b++) {
            var part = _c[_b];
            var partArmatureData = this._factory.getArmatureData(part);
            this._factory.replaceSkin(this._armatureDisplay.armature, partArmatureData.defaultSkin);
        }
        //
        this.interactive = true;
        var touchHandler = function () {
            _this._randomReplaceSkin();
        };
        this.addListener("touchstart", touchHandler, this);
        this.addListener("mousedown", touchHandler, this);
        //
        this.createText("Touch to replace armature skin.");
    };
    ReplaceSkin.prototype._animationEventHandler = function (event) {
        // Random animation index.
        var animationIndex = Math.floor(Math.random() * this._armatureDisplay.animation.animationNames.length);
        var animationName = this._armatureDisplay.animation.animationNames[animationIndex];
        // Play animation.
        this._armatureDisplay.animation.fadeIn(animationName, 0.3, 0);
    };
    ReplaceSkin.prototype._randomReplaceSkin = function () {
        // This suit has been replaced, next suit.
        if (this._replaceSuitParts.length === 0) {
            this._replaceSuitIndex++;
            if (this._replaceSuitIndex >= this._suitConfigs.length) {
                this._replaceSuitIndex = 0;
            }
            // Refill the unset parits.
            for (var _i = 0, _a = this._suitConfigs[this._replaceSuitIndex]; _i < _a.length; _i++) {
                var partArmatureName_1 = _a[_i];
                this._replaceSuitParts.push(partArmatureName_1);
            }
        }
        // Random one part in this suit.
        var partIndex = Math.floor(Math.random() * this._replaceSuitParts.length);
        var partArmatureName = this._replaceSuitParts[partIndex];
        var partArmatureData = this._factory.getArmatureData(partArmatureName);
        // Replace skin.
        this._factory.replaceSkin(this._armatureDisplay.armature, partArmatureData.defaultSkin);
        // Remove has been replaced
        this._replaceSuitParts.splice(partIndex, 1);
    };
    return ReplaceSkin;
}(BaseDemo));
