var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var demosPixi;
(function (demosPixi) {
    var PerformanceTest = (function (_super) {
        __extends(PerformanceTest, _super);
        function PerformanceTest() {
            _super.apply(this, arguments);
            this._addingArmature = false;
            this._removingArmature = false;
            this._dragonBonesData = null;
            this._text = null;
            this._armatures = [];
        }
        PerformanceTest.prototype._onStart = function () {
            document.body.appendChild(this._renderer.view);
            PIXI.ticker.shared.add(this._renderHandler, this);
            // Load data.
            PIXI.loader
                .add("dragonBonesData", "./resource/assets/DragonBoy/DragonBoy.json")
                .add("textureDataA", "./resource/assets/DragonBoy/DragonBoy_texture_1.json")
                .add("textureA", "./resource/assets/DragonBoy/DragonBoy_texture_1.png");
            PIXI.loader.once("complete", this._loadComplateHandler, this);
            PIXI.loader.load();
        };
        PerformanceTest.prototype._loadComplateHandler = function (loader, object) {
            // Parse data.
            this._dragonBonesData = dragonBones.PixiFactory.factory.parseDragonBonesData(object["dragonBonesData"].data);
            dragonBones.PixiFactory.factory.parseTextureAtlasData(object["textureDataA"].data, object["textureA"].texture);
            if (this._dragonBonesData) {
                // Add infomation.            
                this._text = new PIXI.Text("", { align: "center" });
                this._text.scale.x = 0.6;
                this._text.scale.y = 0.6;
                this._text.y = this._renderer.height - 60;
                this._stage.addChild(this._text);
                // Add event listeners.
                this._stage.interactive = true;
                this._stage.on("touchstart", this._touchHandler, this);
                this._stage.on("touchend", this._touchHandler, this);
                this._stage.on("mousedown", this._touchHandler, this);
                this._stage.on("mouseup", this._touchHandler, this);
                this._stage.addChild(this._backgroud);
                this._backgroud.width = this._renderer.width;
                this._backgroud.height = this._renderer.height;
                for (var i = 0; i < 100; ++i) {
                    this._addArmature();
                }
                this._resetPosition();
                this._updateText();
            }
            else {
                throw new Error();
            }
        };
        PerformanceTest.prototype._touchHandler = function (event) {
            switch (event.type) {
                case "touchstart":
                case "mousedown":
                    var touchRight = event.data.global.x > this._renderer.width * 0.5;
                    this._addingArmature = touchRight;
                    this._removingArmature = !touchRight;
                    break;
                case "touchend":
                case "mouseup":
                    this._addingArmature = false;
                    this._removingArmature = false;
                    break;
            }
        };
        PerformanceTest.prototype._renderHandler = function (deltaTime) {
            if (this._addingArmature) {
                for (var i = 0; i < 5; ++i) {
                    this._addArmature();
                }
                this._resetPosition();
                this._updateText();
            }
            if (this._removingArmature) {
                for (var i = 0; i < 5; ++i) {
                    this._removeArmature();
                }
                this._resetPosition();
                this._updateText();
            }
            dragonBones.WorldClock.clock.advanceTime(-1);
            _super.prototype._renderHandler.call(this, deltaTime);
        };
        PerformanceTest.prototype._addArmature = function () {
            var armature = dragonBones.PixiFactory.factory.buildArmature("DragonBoy");
            var armatureDisplay = armature.display;
            armatureDisplay.scale.x = armatureDisplay.scale.y = 0.7;
            this._stage.addChild(armatureDisplay);
            //armature.cacheFrameRate = 24;
            armature.animation.play("walk", 0);
            dragonBones.WorldClock.clock.add(armature);
            this._armatures.push(armature);
        };
        PerformanceTest.prototype._removeArmature = function () {
            if (this._armatures.length == 0) {
                return;
            }
            var armature = this._armatures.pop();
            var armatureDisplay = armature.display;
            this._stage.removeChild(armatureDisplay);
            dragonBones.WorldClock.clock.remove(armature);
            armature.dispose();
        };
        PerformanceTest.prototype._resetPosition = function () {
            var count = this._armatures.length;
            if (!count) {
                return;
            }
            var paddingH = 50;
            var paddingV = 150;
            var gapping = 100;
            var stageWidth = this._renderer.width - paddingH * 2;
            var columnCount = Math.floor(stageWidth / gapping);
            var paddingHModify = (this._renderer.width - columnCount * gapping) * 0.5;
            var dX = stageWidth / columnCount;
            var dY = (this._renderer.height - paddingV * 2) / Math.ceil(count / columnCount);
            for (var i = 0, l = this._armatures.length; i < l; ++i) {
                var armature = this._armatures[i];
                var armatureDisplay = armature.display;
                var lineY = Math.floor(i / columnCount);
                armatureDisplay.x = (i % columnCount) * dX + paddingHModify;
                armatureDisplay.y = lineY * dY + paddingV;
            }
        };
        PerformanceTest.prototype._updateText = function () {
            this._text.text = "Count: " + this._armatures.length + " \nTouch screen left / right to decrease / increase count.";
            this._text.x = (this._renderer.width - this._text.width) * 0.5;
        };
        return PerformanceTest;
    }(demosPixi.BaseTest));
    demosPixi.PerformanceTest = PerformanceTest;
})(demosPixi || (demosPixi = {}));
