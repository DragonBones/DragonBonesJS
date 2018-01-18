class DragHelper {
    private static _instance: DragHelper = new DragHelper();
    public static getInstance(): DragHelper {
        return DragHelper._instance;
    }

    private readonly _helpPoint: egret.Point = new egret.Point();
    private readonly _dragOffset: egret.Point = new egret.Point();
    private _dragDisplayObject: egret.DisplayObject | null = null;

    public enableDrag(displayObject: egret.DisplayObject): void {
        displayObject.touchEnabled = true;
        displayObject.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._dragHandler, this);
        displayObject.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._dragHandler, this);
        displayObject.addEventListener(egret.TouchEvent.TOUCH_END, this._dragHandler, this);
    }

    public disableDrag(displayObject: egret.DisplayObject): void {
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._dragHandler, this);
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._dragHandler, this);
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_END, this._dragHandler, this);
    }

    private _dragHandler(event: egret.TouchEvent): void {
        switch (event.type) {
            case egret.TouchEvent.TOUCH_BEGIN:
                if (this._dragDisplayObject) {
                    return;
                }

                this._dragDisplayObject = event.target as egret.DisplayObject;

                const armatureDisplay = this._dragDisplayObject.parent as dragonBones.EgretArmatureDisplay;
                const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);

                if (bone) {
                    armatureDisplay.globalToLocal(event.stageX, event.stageY, this._helpPoint);
                    if (bone.offsetMode !== dragonBones.OffsetMode.Override) {
                        bone.offsetMode = dragonBones.OffsetMode.Override;
                        bone.offset.x = bone.global.x;
                        bone.offset.y = bone.global.y;
                    }

                    this._dragOffset.x = bone.offset.x - this._helpPoint.x;
                    this._dragOffset.y = bone.offset.y - this._helpPoint.y;

                    this._dragDisplayObject.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._dragHandler, this);
                }
                break;

            case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
            case egret.TouchEvent.TOUCH_END:
                if (this._dragDisplayObject) {
                    this._dragDisplayObject.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._dragHandler, this);
                    this._dragDisplayObject = null;
                }
                break;

            case egret.TouchEvent.TOUCH_MOVE:
                if (this._dragDisplayObject) {
                    const armatureDisplay = this._dragDisplayObject.parent as dragonBones.EgretArmatureDisplay;
                    const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);

                    if (bone) {
                        armatureDisplay.globalToLocal(event.stageX, event.stageY, this._helpPoint);
                        bone.offset.x = this._helpPoint.x + this._dragOffset.x;
                        bone.offset.y = this._helpPoint.y + this._dragOffset.y;
                        bone.invalidUpdate();
                    }
                }
                break;
        }
    }
}