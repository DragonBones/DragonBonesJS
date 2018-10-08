"use strict";
var DragHelper = /** @class */ (function () {
    function DragHelper() {
        this._helpPoint = new Phaser.Math.Vector2();
        this._dragOffset = new Phaser.Math.Vector2();
        this._dragDisplayObject = null;
    }
    DragHelper.getInstance = function () {
        return DragHelper._instance;
    };
    DragHelper.prototype.enableDrag = function (scene, displayObject) {
        var _this = this;
        scene.input.enable(displayObject);
        scene.input.setDraggable(displayObject, true);
        displayObject.on("dragstart", function (a, b, c) { _this._dragStartHandler(displayObject, a, b, c); }, this);
        displayObject.on("dragend", this._dragStopHandler, this);
    };
    DragHelper.prototype.disableDrag = function (scene, displayObject) {
        scene.input.setDraggable(displayObject, false);
        scene.input.disable(displayObject);
        displayObject.off("dragstart", this._dragStartHandler, this);
        displayObject.off("dragend", this._dragStopHandler, this);
    };
    DragHelper.prototype._dragStartHandler = function (displayObject, pointer, dragX, dragY) {
        if (this._dragDisplayObject) {
            return;
        }
        this._dragDisplayObject = displayObject;
        var armatureDisplay = this._dragDisplayObject.parentContainer;
        var bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);
        if (bone) {
            this._helpPoint.x = pointer.x;
            this._helpPoint.y = pointer.y;
            if (bone.offsetMode !== 2 /* Override */) {
                bone.offsetMode = 2 /* Override */;
                bone.offset.x = bone.global.x;
                bone.offset.y = bone.global.y;
            }
            this._dragOffset.x = bone.offset.x - this._helpPoint.x;
            this._dragOffset.y = bone.offset.y - this._helpPoint.y;
            displayObject.on("pointermove", this._dragHandler, this);
        }
    };
    DragHelper.prototype._dragStopHandler = function (pointer, dragX, dragY, dropped) {
        if (!this._dragDisplayObject) {
            return;
        }
        this._dragDisplayObject.off("pointermove", this._dragHandler, this);
        this._dragDisplayObject = null;
    };
    DragHelper.prototype._dragHandler = function (pointer, localX, localY) {
        if (!this._dragDisplayObject) {
            return;
        }
        var armatureDisplay = this._dragDisplayObject.parentContainer;
        var bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);
        if (bone) {
            this._helpPoint.x = pointer.x;
            this._helpPoint.y = pointer.y;
            bone.offset.x = this._helpPoint.x + this._dragOffset.x;
            bone.offset.y = this._helpPoint.y + this._dragOffset.y;
            bone.invalidUpdate();
        }
    };
    DragHelper._instance = new DragHelper();
    return DragHelper;
}());
