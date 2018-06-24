export default class DragHelper {
    private static _instance: DragHelper = new DragHelper();
    public static getInstance(): DragHelper {
        return DragHelper._instance;
    }

    private readonly _dragOffset: cc.Vec2 = cc.v2();
    private _dragDisplayObject: cc.Node | null = null;

    public enableDrag(displayObject: cc.Node): void {
        displayObject.on(cc.Node.EventType.TOUCH_START, this._dragHandler, this);
        displayObject.on(cc.Node.EventType.TOUCH_END, this._dragHandler, this);
    }

    public disableDrag(displayObject: cc.Node): void {
        displayObject.off(cc.Node.EventType.TOUCH_START, this._dragHandler, this);
        displayObject.off(cc.Node.EventType.TOUCH_END, this._dragHandler, this);
    }

    private _dragHandler(event: cc.Event.EventTouch): void {
        switch (event.type) {
            case cc.Node.EventType.TOUCH_START:
                if (this._dragDisplayObject) {
                    return;
                }

                this._dragDisplayObject = event.target as cc.Node;

                const armatureComponent = this._dragDisplayObject.parent.getComponent(dragonBones.CocosArmatureComponent);
                const bone = armatureComponent.armature.getBoneByDisplay(this._dragDisplayObject);

                if (bone) {
                    const matrix = armatureComponent.node.getWorldToNodeTransform();
                    const point = (cc as any).pointApplyAffineTransform(event.touch.getLocation(), matrix); // creator.d.ts error.

                    if (bone.offsetMode !== 2 /* dragonBones.OffsetMode.Override */) { // creator can not support const enum.
                        bone.offsetMode = 2 /* dragonBones.OffsetMode.Override */;
                        bone.offset.x = bone.global.x;
                        bone.offset.y = bone.global.y;
                    }

                    this._dragOffset.x = bone.offset.x - point.x;
                    this._dragOffset.y = bone.offset.y + point.y;

                    this._dragDisplayObject.on(cc.Node.EventType.TOUCH_MOVE, this._dragHandler, this);
                }
                break;

            case cc.Node.EventType.TOUCH_END:
                if (this._dragDisplayObject) {
                    this._dragDisplayObject.off(cc.Node.EventType.TOUCH_MOVE, this._dragHandler, this);
                    this._dragDisplayObject = null;
                }
                break;

            case cc.Node.EventType.TOUCH_MOVE:
                if (this._dragDisplayObject) {
                    const armatureComponent = this._dragDisplayObject.parent.getComponent(dragonBones.CocosArmatureComponent);
                    const bone = armatureComponent.armature.getBoneByDisplay(this._dragDisplayObject);

                    if (bone) {
                        const matrix = armatureComponent.node.getWorldToNodeTransform();
                        const point = (cc as any).pointApplyAffineTransform(event.touch.getLocation(), matrix); // creator.d.ts error.
                        bone.offset.x = point.x + this._dragOffset.x;
                        bone.offset.y = -point.y + this._dragOffset.y;
                        bone.invalidUpdate();
                    }
                }
                break;
        }
    }
}