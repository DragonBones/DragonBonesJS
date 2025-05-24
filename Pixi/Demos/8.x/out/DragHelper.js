"use strict";
class DragHelper {
    constructor() {
        this._helpPoint = new PIXI.Point();
        this._dragOffset = new PIXI.Point();
        this._dragDisplayObject = null;
    }
    static getInstance() {
        return DragHelper._instance;
    }
    enableDrag(displayObject) {
        displayObject.interactive = true;
        displayObject.addListener("touchstart", this._dragHandler, this);
        displayObject.addListener("touchend", this._dragHandler, this);
        displayObject.addListener("mousedown", this._dragHandler, this);
        displayObject.addListener("mouseup", this._dragHandler, this);
    }
    disableDrag(displayObject) {
        displayObject.removeListener("touchstart", this._dragHandler, this);
        displayObject.removeListener("touchend", this._dragHandler, this);
        displayObject.removeListener("mousedown", this._dragHandler, this);
        displayObject.removeListener("mouseup", this._dragHandler, this);
    }
    _dragHandler(event) {
        switch (event.type) {
            case "touchstart":
            case "mousedown":
            case "pointerdown":
                if (this._dragDisplayObject) {
                    return;
                }
                this._dragDisplayObject = event.target;
                const armatureDisplay = this._dragDisplayObject.parent;
                const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);
                if (bone) {
                    this._helpPoint.x = event.global.x;
                    this._helpPoint.y = event.global.y;
                    armatureDisplay.toLocal(this._helpPoint, this.stage, this._helpPoint);
                    if (bone.offsetMode !== 2) {
                        bone.offsetMode = 2;
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
            case "pointerup":
                if (this._dragDisplayObject) {
                    this.stage.removeListener("touchmove", this._dragHandler, this);
                    this.stage.removeListener("mousemove", this._dragHandler, this);
                    this._dragDisplayObject = null;
                }
                break;
            case "touchmove":
            case "mousemove":
            case "pointermove":
                if (this._dragDisplayObject) {
                    const armatureDisplay = this._dragDisplayObject.parent;
                    const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);
                    if (bone) {
                        this._helpPoint.x = event.global.x;
                        this._helpPoint.y = event.global.y;
                        armatureDisplay.toLocal(this._helpPoint, this.stage, this._helpPoint);
                        bone.offset.x = this._helpPoint.x + this._dragOffset.x;
                        bone.offset.y = this._helpPoint.y + this._dragOffset.y;
                        bone.invalidUpdate();
                    }
                }
                break;
        }
    }
}
DragHelper._instance = new DragHelper();
