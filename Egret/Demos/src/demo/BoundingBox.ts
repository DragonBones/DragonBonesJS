class BoundingBox extends BaseDemo {
    private readonly _helpPointA: egret.Point = new egret.Point();
    private readonly _helpPointB: egret.Point = new egret.Point();
    private readonly _helpPointC: egret.Point = new egret.Point();

    private _armatureDisplay: dragonBones.EgretArmatureDisplay;
    private _boundingBoxTester: dragonBones.EgretArmatureDisplay;
    private _targetA: dragonBones.EgretArmatureDisplay;
    private _targetB: dragonBones.EgretArmatureDisplay;
    private _line: dragonBones.Bone;
    private _pointA: dragonBones.Bone;
    private _pointB: dragonBones.Bone;

    public constructor() {
        super();

        this._resources.push(
            "resource/mecha_2903/mecha_2903_ske.json",
            "resource/mecha_2903/mecha_2903_tex.json",
            "resource/mecha_2903/mecha_2903_tex.png",
            "resource/bounding_box_tester/bounding_box_tester_ske.json",
            "resource/bounding_box_tester/bounding_box_tester_tex.json",
            "resource/bounding_box_tester/bounding_box_tester_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/mecha_2903/mecha_2903_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/mecha_2903/mecha_2903_tex.json"), RES.getRes("resource/mecha_2903/mecha_2903_tex.png"));
        factory.parseDragonBonesData(RES.getRes("resource/bounding_box_tester/bounding_box_tester_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/bounding_box_tester/bounding_box_tester_tex.json"), RES.getRes("resource/bounding_box_tester/bounding_box_tester_tex.png"));
        //
        this._armatureDisplay = factory.buildArmatureDisplay("mecha_2903d");
        this._boundingBoxTester = factory.buildArmatureDisplay("tester");
        this._targetA = this._boundingBoxTester.armature.getSlot("target_a").display;
        this._targetB = this._boundingBoxTester.armature.getSlot("target_b").display;
        this._line = this._boundingBoxTester.armature.getBone("line");
        this._pointA = this._boundingBoxTester.armature.getBone("point_a");
        this._pointB = this._boundingBoxTester.armature.getBone("point_b");
        //
        this._armatureDisplay.debugDraw = true;
        this._armatureDisplay.x = 0.0;
        this._armatureDisplay.y = 100.0;
        this._boundingBoxTester.x = 0.0;
        this._boundingBoxTester.y = 200.0;
        this._targetA.armature.inheritAnimation = false;
        this._targetB.armature.inheritAnimation = false;
        this._line.offsetMode = dragonBones.OffsetMode.Override;
        this._pointA.offsetMode = dragonBones.OffsetMode.Override;
        this._pointB.offsetMode = dragonBones.OffsetMode.Override;
        this._armatureDisplay.animation.play("walk");
        this._boundingBoxTester.animation.play("0");
        //
        this.addChild(this._armatureDisplay);
        this.addChild(this._boundingBoxTester);
        this.addEventListener(egret.Event.ENTER_FRAME, this._enterFrameHandler, this);
        //
        DragHelper.getInstance().enableDrag(this._targetA);
        DragHelper.getInstance().enableDrag(this._targetB);
        //
        this.createText("Touch to drag bounding box tester.");
    }

    private _enterFrameHandler(event: egret.Event): void {
        this._boundingBoxTester.localToGlobal(this._targetA.x, this._targetA.y, this._helpPointA);
        this._boundingBoxTester.localToGlobal(this._targetB.x, this._targetB.y, this._helpPointB);
        this._armatureDisplay.globalToLocal(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
        this._armatureDisplay.globalToLocal(this._helpPointB.x, this._helpPointB.y, this._helpPointB);

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
                this._armatureDisplay.localToGlobal(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
                this._armatureDisplay.localToGlobal(this._helpPointB.x, this._helpPointB.y, this._helpPointB);
                this._boundingBoxTester.globalToLocal(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
                this._boundingBoxTester.globalToLocal(this._helpPointB.x, this._helpPointB.y, this._helpPointB);

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