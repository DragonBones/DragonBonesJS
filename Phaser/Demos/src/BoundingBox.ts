class BoundingBox extends BaseDemo {
    private readonly _helpPointA: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private readonly _helpPointB: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private readonly _helpPointC: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private _helperMatrix: Phaser.GameObjects.Components.TransformMatrix = new Phaser.GameObjects.Components.TransformMatrix();

    private _armatureDisplay: dragonBones.phaser.display.ArmatureDisplay;
    private _boundingBoxTester: dragonBones.phaser.display.ArmatureDisplay;
    private _targetA: dragonBones.phaser.display.ArmatureDisplay;
    private _targetB: dragonBones.phaser.display.ArmatureDisplay;
    private _line: dragonBones.Bone;
    private _pointA: dragonBones.Bone;
    private _pointB: dragonBones.Bone;

    public constructor() {
        super("BoundingBox");
    }

    preload(): void {
        super.preload();
        this.load.dragonbone(
            "mecha_2903d",
            "resource/mecha_2903/mecha_2903_tex.png",
            "resource/mecha_2903/mecha_2903_tex.json",
            "resource/mecha_2903/mecha_2903_ske.json"
        );
        this.load.dragonbone(
            "tester",
            "resource/bounding_box_tester/bounding_box_tester_tex.png",
            "resource/bounding_box_tester/bounding_box_tester_tex.json",
            "resource/bounding_box_tester/bounding_box_tester_ske.json"
        );
    }

    create(): void {
        super.create();

        this._armatureDisplay = this.add.armature("mecha_2903d", "mecha_2903d");
        this._boundingBoxTester = this.add.armature("tester", "tester");
        this._targetA = this._boundingBoxTester.armature.getSlot("target_a").display;
        this._targetB = this._boundingBoxTester.armature.getSlot("target_b").display;
        this._line = this._boundingBoxTester.armature.getBone("line");
        this._pointA = this._boundingBoxTester.armature.getBone("point_a");
        this._pointB = this._boundingBoxTester.armature.getBone("point_b");

        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this._armatureDisplay.debugDraw = true;
        this._armatureDisplay.x = cx;
        this._armatureDisplay.y = cy + 100.0;
        this._boundingBoxTester.x = cx;
        this._boundingBoxTester.y = cy + 200.0;
        this._targetA.armature.inheritAnimation = false;
        this._targetB.armature.inheritAnimation = false;
        this._line.offsetMode = dragonBones.OffsetMode.Override;
        this._pointA.offsetMode = dragonBones.OffsetMode.Override;
        this._pointB.offsetMode = dragonBones.OffsetMode.Override;
        this._armatureDisplay.animation.play("walk");
        this._boundingBoxTester.animation.play("0");

        const bA = this._targetA.getAt(0) as Phaser.GameObjects.Image;
        const bB = this._targetB.getAt(0) as Phaser.GameObjects.Image;
        this._targetA.setSize(bA.displayWidth, bA.displayHeight);
        DragHelper.getInstance().enableDrag(this, this._targetA);
        this._targetB.setSize(bB.displayWidth, bB.displayHeight);
        DragHelper.getInstance().enableDrag(this, this._targetB);

        this.createText("Touch to drag bounding box tester.");
    }

    update(time: number, delta: number): void {
        if (!this._armatureDisplay)
            return;

        this._boundingBoxTester.getWorldTransformMatrix(this._helperMatrix);
        this._helperMatrix.transformPoint(this._targetA.x, this._targetA.y, this._helpPointA);
        this._helperMatrix.transformPoint(this._targetB.x, this._targetB.y, this._helpPointB);
        this._armatureDisplay.localTransform.transformPoint(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
        this._armatureDisplay.localTransform.transformPoint(this._helpPointB.x, this._helpPointB.y, this._helpPointB);

        const containsSlotA = this._armatureDisplay.armature.containsPoint(this._helpPointA.x, this._helpPointA.y);
        const containsSlotB = this._armatureDisplay.armature.containsPoint(this._helpPointB.x, this._helpPointB.y);
        const intersectsSlots = this._armatureDisplay.armature.intersectsSegment(this._helpPointA.x, this._helpPointA.y, this._helpPointB.x, this._helpPointB.y, this._helpPointA, this._helpPointB, this._helpPointC);

        {
            const animationName = containsSlotA ? "1" : "0";
            if (this._targetA.animation.lastAnimationName !== animationName) {
                this._targetA.animation.fadeIn(animationName, 0.2).resetToPose = false;
            }
        }

        {
            const animationName = containsSlotB ? "1" : "0";
            if (this._targetB.animation.lastAnimationName !== animationName) {
                this._targetB.animation.fadeIn(animationName, 0.2).resetToPose = false;
            }
        }

        {
            const targetA = this._targetA.armature.parent.parent;
            const targetB = this._targetB.armature.parent.parent;
            const dX = targetB.global.x - targetA.global.x;
            const dY = targetB.global.y - targetA.global.y;
            this._line.offset.x = targetA.global.x;
            this._line.offset.y = targetA.global.y;
            this._line.offset.scaleX = Math.sqrt(dX * dX + dY * dY) / 100.0;
            this._line.offset.rotation = Math.atan2(dY, dX);
            this._line.invalidUpdate();

            const animationName = intersectsSlots ? "1" : "0";
            if (this._boundingBoxTester.animation.lastAnimationName !== animationName) {
                this._boundingBoxTester.animation.fadeIn(animationName, 0.2).resetToPose = false;
            }

            if (intersectsSlots) {
                console.log("INSECT");
                this._armatureDisplay.getWorldTransformMatrix(this._helperMatrix);
                this._helperMatrix.transformPoint(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
                this._helperMatrix.transformPoint(this._helpPointB.x, this._helpPointB.y, this._helpPointB);
                this._boundingBoxTester.localTransform.transformPoint(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
                this._boundingBoxTester.localTransform.transformPoint(this._helpPointB.x, this._helpPointB.y, this._helpPointB);

                this._pointA.visible = true;
                this._pointB.visible = true;
                this._pointA.offset.x = this._helpPointA.x;
                this._pointA.offset.y = this._helpPointA.y;
                this._pointB.offset.x = this._helpPointB.x;
                this._pointB.offset.y = this._helpPointB.y;
                this._pointA.offset.rotation = this._helpPointC.x;
                this._pointB.offset.rotation = this._helpPointC.y;
                this._pointA.invalidUpdate();
                this._pointB.invalidUpdate();
            }
            else {
                this._pointA.visible = false;
                this._pointB.visible = false;
            }
        }
    }
}
