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
var ReplaceSlotDisplay = (function (_super) {
    __extends(ReplaceSlotDisplay, _super);
    function ReplaceSlotDisplay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._displayIndex = 0;
        _this._replaceDisplays = [
            // Replace normal display.
            "display0002", "display0003", "display0004", "display0005", "display0006", "display0007", "display0008", "display0009", "display0010",
            // Replace mesh display.
            "meshA", "meshB", "meshC",
        ];
        _this._factory = dragonBones.PixiFactory.factory;
        return _this;
    }
    ReplaceSlotDisplay.prototype._onStart = function () {
        var _this = this;
        PIXI.loader
            .add("dragonBonesDataA", "./resource/assets/replace_slot_display/main_ske.json")
            .add("textureDataA", "./resource/assets/replace_slot_display/main_tex.json")
            .add("textureA", "./resource/assets/replace_slot_display/main_tex.png")
            .add("dragonBonesDataB", "./resource/assets/replace_slot_display/replace_ske.json")
            .add("textureDataB", "./resource/assets/replace_slot_display/replace_tex.json")
            .add("textureB", "./resource/assets/replace_slot_display/replace_tex.png");
        PIXI.loader.once("complete", function (loader, resources) {
            _this._factory.parseDragonBonesData(resources["dragonBonesDataA"].data);
            _this._factory.parseTextureAtlasData(resources["textureDataA"].data, resources["textureA"].texture);
            _this._factory.parseDragonBonesData(resources["dragonBonesDataB"].data);
            _this._factory.parseTextureAtlasData(resources["textureDataB"].data, resources["textureB"].texture);
            _this._armatureDisplay = _this._factory.buildArmatureDisplay("MyArmature");
            _this._armatureDisplay.animation.timeScale = 0.1;
            _this._armatureDisplay.animation.play();
            _this._armatureDisplay.x = _this.stage.width * 0.5;
            _this._armatureDisplay.y = _this.stage.height * 0.5;
            _this.stage.addChild(_this._armatureDisplay);
            var touchHandler = function (event) {
                _this._replaceDisplay();
            };
            _this.stage.interactive = true;
            _this.stage.addListener("touchstart", touchHandler, _this);
            _this.stage.addListener("mousedown", touchHandler, _this);
            //
            _this._startRenderTick();
        });
        PIXI.loader.load();
    };
    ReplaceSlotDisplay.prototype._replaceDisplay = function () {
        this._displayIndex = (this._displayIndex + 1) % this._replaceDisplays.length;
        var replaceDisplayName = this._replaceDisplays[this._displayIndex];
        if (replaceDisplayName.indexOf("mesh") >= 0) {
            switch (replaceDisplayName) {
                case "meshA":
                    // Normal to mesh.
                    this._factory.replaceSlotDisplay("replace", "MyMesh", "meshA", "weapon_1004_1", this._armatureDisplay.armature.getSlot("weapon"));
                    // Replace mesh texture. 
                    this._factory.replaceSlotDisplay("replace", "MyDisplay", "ball", "display0002", this._armatureDisplay.armature.getSlot("mesh"));
                    break;
                case "meshB":
                    // Normal to mesh.
                    this._factory.replaceSlotDisplay("replace", "MyMesh", "meshB", "weapon_1004_1", this._armatureDisplay.armature.getSlot("weapon"));
                    // Replace mesh texture. 
                    this._factory.replaceSlotDisplay("replace", "MyDisplay", "ball", "display0003", this._armatureDisplay.armature.getSlot("mesh"));
                    break;
                case "meshC":
                    // Back to normal.
                    this._factory.replaceSlotDisplay("replace", "MyMesh", "mesh", "weapon_1004_1", this._armatureDisplay.armature.getSlot("weapon"));
                    // Replace mesh texture. 
                    this._factory.replaceSlotDisplay("replace", "MyDisplay", "ball", "display0005", this._armatureDisplay.armature.getSlot("mesh"));
                    break;
            }
        }
        else {
            this._factory.replaceSlotDisplay("replace", "MyDisplay", "ball", replaceDisplayName, this._armatureDisplay.armature.getSlot("ball"));
        }
    };
    return ReplaceSlotDisplay;
}(BaseTest));
