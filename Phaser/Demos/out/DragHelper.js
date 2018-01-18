"use strict";
var DragHelper = /** @class */ (function () {
    function DragHelper() {
        this._helpPoint = new Phaser.Point();
        this._dragOffset = new Phaser.Point();
        this._dragDisplayObject = null;
    }
    DragHelper.getInstance = function () {
        return DragHelper._instance;
    };
    DragHelper.prototype.enableDrag = function (displayObject) {
        displayObject.inputEnabled = true;
        displayObject.input.enableDrag();
        displayObject.events.onDragStart.add(this._dragStartHandler, this);
        displayObject.events.onDragStop.add(this._dragStopHandler, this);
    };
    DragHelper.prototype.disableDrag = function (displayObject) {
        displayObject.events.onDragStart.remove(this._dragStartHandler, this);
        displayObject.events.onDragStop.remove(this._dragStopHandler, this);
    };
    DragHelper.prototype._dragStartHandler = function (displayObject, pointer) {
        if (this._dragDisplayObject) {
            return;
        }
        this._dragDisplayObject = displayObject;
        var armatureDisplay = this._dragDisplayObject.parent;
        var bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);
        if (bone) {
            this._helpPoint.x = pointer.clientX;
            this._helpPoint.y = pointer.clientY;
            if (bone.offsetMode !== 2 /* Override */) {
                bone.offsetMode = 2 /* Override */;
                bone.offset.x = bone.global.x;
                bone.offset.y = bone.global.y;
            }
            this._dragOffset.x = bone.offset.x - this._helpPoint.x;
            this._dragOffset.y = bone.offset.y - this._helpPoint.y;
            displayObject.events.onDragUpdate.add(this._dragHandler, this);
        }
    };
    DragHelper.prototype._dragStopHandler = function (displayObject, pointer) {
        if (!this._dragDisplayObject) {
            return;
        }
        displayObject.events.onDragUpdate.remove(this._dragHandler, this);
        this._dragDisplayObject = null;
    };
    DragHelper.prototype._dragHandler = function (displayObject, pointer) {
        if (!this._dragDisplayObject) {
            return;
        }
        var armatureDisplay = this._dragDisplayObject.parent;
        var bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);
        if (bone) {
            this._helpPoint.x = pointer.clientX;
            this._helpPoint.y = pointer.clientY;
            bone.offset.x = this._helpPoint.x + this._dragOffset.x;
            bone.offset.y = this._helpPoint.y + this._dragOffset.y;
            bone.invalidUpdate();
        }
    };
    DragHelper._instance = new DragHelper();
    return DragHelper;
}());
