"use strict";
class PerformanceTest extends BaseDemo {
    constructor() {
        super();
        this._addingArmature = false;
        this._removingArmature = false;
        this._armatures = [];
        this._resources.push("resource/mecha_1406/mecha_1406_ske.dbbin", "resource/mecha_1406/mecha_1406_tex.json", "resource/mecha_1406/mecha_1406_tex.png");
    }
    _onStart() {
        this.interactive = true;
        this.addListener("touchstart", this._touchHandler, this);
        this.addListener("touchend", this._touchHandler, this);
        this.addListener("mousedown", this._touchHandler, this);
        this.addListener("mouseup", this._touchHandler, this);
        PIXI.Ticker.shared.add(this._enterFrameHandler, this);
        //
        this._text = this.createText("");
        for (let i = 0; i < 300; ++i) {
            this._addArmature();
        }
        this._resetPosition();
        this._updateText();
    }
    _enterFrameHandler(deltaTime) {
        if (this._addingArmature) {
            for (let i = 0; i < 10; ++i) {
                this._addArmature();
            }
            this._resetPosition();
            this._updateText();
        }
        if (this._removingArmature) {
            for (let i = 0; i < 10; ++i) {
                this._removeArmature();
            }
            this._resetPosition();
            this._updateText();
        }
    }
    _touchHandler(event) {
        switch (event.type) {
            case "touchstart":
            case "mousedown":
            case 'pointerdown':
                const touchRight = event.data.global.x > this.stageWidth * 0.5;
                this._addingArmature = touchRight;
                this._removingArmature = !touchRight;
                break;
            case "touchend":
            case "mouseup":
            case 'pointerup':
                this._addingArmature = false;
                this._removingArmature = false;
                break;
        }
    }
    _addArmature() {
        const factory = dragonBones.PixiFactory.factory;
        if (this._armatures.length === 0) {
            factory.parseDragonBonesData(this._pixiResources["resource/mecha_1406/mecha_1406_ske.dbbin"]);
            factory.parseTextureAtlasData(this._pixiResources["resource/mecha_1406/mecha_1406_tex.json"], this._pixiResources["resource/mecha_1406/mecha_1406_tex.png"]);
        }
        const armatureDisplay = dragonBones.PixiFactory.factory.buildArmatureDisplay("mecha_1406");
        armatureDisplay.armature.cacheFrameRate = 24;
        armatureDisplay.animation.play("walk", 0);
        armatureDisplay.scale.x = armatureDisplay.scale.y = 0.5;
        this.addChild(armatureDisplay);
        this._armatures.push(armatureDisplay);
    }
    _removeArmature() {
        if (this._armatures.length === 0) {
            return;
        }
        const armatureDisplay = this._armatures.pop();
        this.removeChild(armatureDisplay);
        armatureDisplay.dispose();
        if (this._armatures.length === 0) {
            dragonBones.PixiFactory.factory.clear(true);
            dragonBones.BaseObject.clearPool();
        }
    }
    _resetPosition() {
        const armatureCount = this._armatures.length;
        if (armatureCount === 0) {
            return;
        }
        const paddingH = 100;
        const paddingT = 200;
        const paddingB = 100;
        const gapping = 90;
        const stageWidth = this.stageWidth - paddingH * 2;
        const columnCount = Math.floor(stageWidth / gapping);
        const paddingHModify = (this.stageWidth - columnCount * gapping) * 0.5;
        const dX = stageWidth / columnCount;
        const dY = (this.stageHeight - paddingT - paddingB) / Math.ceil(armatureCount / columnCount);
        for (let i = 0, l = armatureCount; i < l; ++i) {
            const armatureDisplay = this._armatures[i];
            const lineY = Math.floor(i / columnCount);
            armatureDisplay.x = (i % columnCount) * dX + paddingHModify - this.stageWidth * 0.5;
            armatureDisplay.y = lineY * dY + paddingT - this.stageHeight * 0.5;
        }
    }
    _updateText() {
        this._text.text = "Count: " + this._armatures.length + ". Touch screen left to decrease count / right to increase count.";
        this._text.x = -this._text.width * 0.5;
        this._text.y = this.stageHeight * 0.5 - 100.0;
        this.addChild(this._text);
    }
}
