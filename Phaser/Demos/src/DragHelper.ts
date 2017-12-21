class DragHelper {
    private static _instance: DragHelper = new DragHelper();
    public static getInstance(): DragHelper {
        return DragHelper._instance;
    }

    private readonly _helpPoint: Phaser.Point = new Phaser.Point();
    private readonly _dragOffset: Phaser.Point = new Phaser.Point();
    private _dragDisplayObject: Phaser.Sprite | null = null;

    public enableDrag(displayObject: Phaser.Sprite): void {
        displayObject.inputEnabled = true;
        displayObject.input.enableDrag();
        displayObject.events.onDragStart.add(this._dragStartHandler, this);
        displayObject.events.onDragStop.add(this._dragStopHandler, this);
    }

    public disableDrag(displayObject: Phaser.Sprite): void {
        displayObject.events.onDragStart.remove(this._dragStartHandler, this);
        displayObject.events.onDragStop.remove(this._dragStopHandler, this);
    }

    private _dragStartHandler(displayObject: Phaser.Sprite, pointer: Phaser.Pointer): void {
        if (this._dragDisplayObject) {
            return;
        }

        this._dragDisplayObject = displayObject;

        const armatureDisplay = this._dragDisplayObject.parent as dragonBones.PhaserArmatureDisplay;
        const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);

        if (bone) {
            this._helpPoint.x = pointer.clientX;
            this._helpPoint.y = pointer.clientY;

            if (bone.offsetMode !== dragonBones.OffsetMode.Override) {
                bone.offsetMode = dragonBones.OffsetMode.Override;
                bone.offset.x = bone.global.x;
                bone.offset.y = bone.global.y;
            }

            this._dragOffset.x = bone.offset.x - this._helpPoint.x;
            this._dragOffset.y = bone.offset.y - this._helpPoint.y;

            displayObject.events.onDragUpdate.add(this._dragHandler, this);
        }
    }

    private _dragStopHandler(displayObject: Phaser.Sprite, pointer: Phaser.Pointer): void {
        if (!this._dragDisplayObject) {
            return;
        }

        displayObject.events.onDragUpdate.remove(this._dragHandler, this);
        this._dragDisplayObject = null;
    }

    private _dragHandler(displayObject: Phaser.Sprite, pointer: Phaser.Pointer): void {
        if (!this._dragDisplayObject) {
            return;
        }

        const armatureDisplay = this._dragDisplayObject.parent as dragonBones.PhaserArmatureDisplay;
        const bone = armatureDisplay.armature.getBoneByDisplay(this._dragDisplayObject);

        if (bone) {
            this._helpPoint.x = pointer.clientX;
            this._helpPoint.y = pointer.clientY;
            bone.offset.x = this._helpPoint.x + this._dragOffset.x;
            bone.offset.y = this._helpPoint.y + this._dragOffset.y;
            bone.invalidUpdate();
        }
    }
}