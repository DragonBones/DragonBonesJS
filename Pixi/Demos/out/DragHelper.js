"use strict";
var DragHelper = /** @class */ (function () {
    function DragHelper() {
        this._helpPoint = new PIXI.Point();
        this._dragOffset = new PIXI.Point();
        this._dragDisplayObject = null;
    }
    DragHelper.getInstance = function () {
        return DragHelper._instance;
    };
    DragHelper.prototype.enableDrag = function (displayObject) {
        displayObject.interactive = true;
        displayObject.addListener("touchstart", this._dragHandler, this);
        displayObject.addListener("touchend", this._dragHandler, this);
        displayObject.addListener("mousedown", this._dragHandler, this);
        displayObject.addListener("mouseup", this._dragHandler, this);
    };
    DragHelper.prototype.disableDrag = function (displayObject) {
        displayObject.removeListener("touchstart", this._dragHandler, this);
        displayObject.removeListener("touchend", this._dragHandler, this);
        displayObject.removeListener("mousedown", this._dragHandler, this);
        displayObject.removeListener("mouseup", this._dragHandler, this);
    };
    DragHelper.prototype._dragHandler = function (event) {
        switch (event.type) {
            case "touchstart":
            case "mousedown":
                if (this._dragDisplayObject) {
                    return;
                }
                this._dragDisplayObject = event.target;
                var armatureDisplay = this._dragDisplayObject.parent;
                var bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);
                if (bone) {
                    this._helpPoint.x = event.data.global.x;
                    this._helpPoint.y = event.data.global.y;
                    armatureDisplay.toLocal(this._helpPoint, this.stage, this._helpPoint);
                    if (bone.offsetMode !== 2 /* Override */) {
                        bone.offsetMode = 2 /* Override */;
                        bone.offset.x = bone.global.x;
                        bone.offset.y = bone.global.y;
                    }
                    this._dragOffset.x = bone.offset.x - this._helpPoint.x;
                    this._dragOffset.y = bone.offset.y - this._helpPoint.y;
                    this.stage.addListener("touchmove", this._dragHandler, this);
                    this.stage.addListener("mousemove", this._dragHandler, this);
                }
                break;
            case "touchend":
            case "mouseup":
                if (this._dragDisplayObject) {
                    this.stage.removeListener("touchmove", this._dragHandler, this);
                    this.stage.removeListener("mousemove", this._dragHandler, this);
                    this._dragDisplayObject = null;
                }
                break;
            case "touchmove":
            case "mousemove":
                if (this._dragDisplayObject) {
                    var armatureDisplay_1 = this._dragDisplayObject.parent;
                    var bone_1 = armatureDisplay_1.armature.getBoneByDisplay(this._dragDisplayObject);
                    if (bone_1) {
                        this._helpPoint.x = event.data.global.x;
                        this._helpPoint.y = event.data.global.y;
                        armatureDisplay_1.toLocal(this._helpPoint, this.stage, this._helpPoint);
                        bone_1.offset.x = this._helpPoint.x + this._dragOffset.x;
                        bone_1.offset.y = this._helpPoint.y + this._dragOffset.y;
                        bone_1.invalidUpdate();
                    }
                }
                break;
        }
    };
    DragHelper._instance = new DragHelper();
    return DragHelper;
}());
