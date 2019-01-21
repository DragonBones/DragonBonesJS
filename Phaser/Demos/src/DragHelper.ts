class DragHelper {
    private static _instance: DragHelper = new DragHelper();
    public static getInstance(): DragHelper {
        return DragHelper._instance;
    }

    private readonly _helpPoint: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private readonly _dragOffset: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private _dragDisplayObject: Phaser.GameObjects.GameObject = null;

    public enableDrag(scene: Phaser.Scene, displayObject: Phaser.GameObjects.GameObject): void {
        scene.input.enable(displayObject);
        scene.input.setDraggable(displayObject, true);
        displayObject.on("dragstart", (a, b, c) => { this._dragStartHandler(displayObject, a, b, c); }, this);
        displayObject.on("dragend", this._dragStopHandler, this);
    }

    public disableDrag(scene: Phaser.Scene, displayObject: Phaser.GameObjects.Sprite): void {
        scene.input.setDraggable(displayObject, false);
        scene.input.disable(displayObject);
        displayObject.off("dragstart", this._dragStartHandler, this);
        displayObject.off("dragend", this._dragStopHandler, this);
    }

    private _dragStartHandler(displayObject: Phaser.GameObjects.GameObject, pointer: Phaser.Input.Pointer, dragX: number, dragY: number): void {
        if (this._dragDisplayObject) {
            return;
        }

        this._dragDisplayObject = displayObject;

        const armatureDisplay = this._dragDisplayObject.parentContainer as dragonBones.phaser.display.ArmatureDisplay;
        const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);

        if (bone) {
            this._helpPoint.x = pointer.x;
            this._helpPoint.y = pointer.y;

            if (bone.offsetMode !== dragonBones.OffsetMode.Override) {
                bone.offsetMode = dragonBones.OffsetMode.Override;
                bone.offset.x = bone.global.x;
                bone.offset.y = bone.global.y;
            }

            this._dragOffset.x = bone.offset.x - this._helpPoint.x;
            this._dragOffset.y = bone.offset.y - this._helpPoint.y;

            displayObject.on("pointermove", this._dragHandler, this);
        }
    }

    private _dragStopHandler(pointer: Phaser.Input.Pointer, dragX: number, dragY: number, dropped: boolean): void {
        if (!this._dragDisplayObject) {
            return;
        }

        this._dragDisplayObject.off("pointermove", this._dragHandler, this);
        this._dragDisplayObject = null;
    }

    private _dragHandler(pointer: Phaser.Input.Pointer, localX: number, localY: number): void {
        if (!this._dragDisplayObject) {
            return;
        }

        const armatureDisplay = this._dragDisplayObject.parentContainer as dragonBones.phaser.display.ArmatureDisplay;
        const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);

        if (bone) {
            this._helpPoint.x = pointer.x;
            this._helpPoint.y = pointer.y;
            bone.offset.x = this._helpPoint.x + this._dragOffset.x;
            bone.offset.y = this._helpPoint.y + this._dragOffset.y;
            bone.invalidUpdate();
        }
    }
}
