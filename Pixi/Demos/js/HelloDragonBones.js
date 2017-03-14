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
var demosPixi;
(function (demosPixi) {
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
            PIXI.loader
                .add("dragonBonesData", "./resource/assets/DragonBoy/DragonBoy.json")
                .add("textureDataA", "./resource/assets/DragonBoy/DragonBoy_texture_1.json")
                .add("textureA", "./resource/assets/DragonBoy/DragonBoy_texture_1.png");
            PIXI.loader.once("complete", this._loadComplateHandler, this);
            PIXI.loader.load();
        };
        HelloDragonBones.prototype._loadComplateHandler = function (loader, resources) {
            dragonBones.PixiFactory.factory.parseDragonBonesData(resources["dragonBonesData"].data);
            dragonBones.PixiFactory.factory.parseTextureAtlasData(resources["textureDataA"].data, resources["textureA"].texture);
            var armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("DragonBoy");
            armatureDisplay.animation.play("walk");
            this._stage.addChild(armatureDisplay);
            armatureDisplay.x = this._renderer.width * 0.5;
            armatureDisplay.y = this._renderer.height * 0.5 + 100;
        };
        return HelloDragonBones;
    }(demosPixi.BaseTest));
    demosPixi.HelloDragonBones = HelloDragonBones;
})(demosPixi || (demosPixi = {}));
