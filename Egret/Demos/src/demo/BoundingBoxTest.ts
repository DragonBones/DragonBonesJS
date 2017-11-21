class BoundingBoxTest extends BaseTest {
    private readonly _helpPointA: egret.Point = new egret.Point();
    private readonly _helpPointB: egret.Point = new egret.Point();
    private readonly _helpPointC: egret.Point = new egret.Point();

    private _armatureDisplay: dragonBones.EgretArmatureDisplay;
    private _boundingBoxTester: dragonBones.EgretArmatureDisplay;
    private _targetA: dragonBones.EgretArmatureDisplay;
    private _targetB: dragonBones.EgretArmatureDisplay;
    private _line: egret.Bitmap;
    private _pointA: egret.Bitmap;
    private _pointB: egret.Bitmap;

    public constructor() {
        super();

        this._resources.push(
            "resource/assets/core_element/mecha_2903_ske.json",
            "resource/assets/core_element/mecha_2903_tex.json",
            "resource/assets/core_element/mecha_2903_tex.png",
            "resource/assets/bounding_box_test_ske.json",
            "resource/assets/bounding_box_test_tex.json",
            "resource/assets/bounding_box_test_tex.png"
        );
    }

    protected _onStart(): void {
        const factory = dragonBones.EgretFactory.factory;
        factory.parseDragonBonesData(RES.getRes("resource/assets/core_element/mecha_2903_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/assets/core_element/mecha_2903_tex.json"), RES.getRes("resource/assets/core_element/mecha_2903_tex.png"));
        factory.parseDragonBonesData(RES.getRes("resource/assets/bounding_box_test_ske.json"));
        factory.parseTextureAtlasData(RES.getRes("resource/assets/bounding_box_test_tex.json"), RES.getRes("resource/assets/bounding_box_test_tex.png"));
        //
        this._armatureDisplay = factory.buildArmatureDisplay("mecha_2903d");
        this._boundingBoxTester = factory.buildArmatureDisplay("tester");
        this._targetA = this._boundingBoxTester.armature.getSlot("target_a").display;
        this._targetB = this._boundingBoxTester.armature.getSlot("target_b").display;
        this._line = this._boundingBoxTester.armature.getSlot("line").display;
        this._pointA = this._boundingBoxTester.armature.getSlot("point_a").display;
        this._pointB = this._boundingBoxTester.armature.getSlot("point_b").display;
        //
        this._armatureDisplay.debugDraw = true;
        this._armatureDisplay.x = this.stageWidth * 0.5;
        this._armatureDisplay.y = this.stageHeight * 0.5;
        this._boundingBoxTester.x = this.stageWidth * 0.5;
        this._boundingBoxTester.y = this.stageHeight * 0.5 + 100.0;
        this._targetA.armature.inheritAnimation = false;
        this._targetB.armature.inheritAnimation = false;
        this._armatureDisplay.animation.play("walk");
        this._boundingBoxTester.animation.play("0");
        //
        this._line.anchorOffsetX = 0;
        // this._line.anchorOffsetY = 0;
        //
        this.addChild(this._armatureDisplay);
        this.addChild(this._boundingBoxTester);
        this.addEventListener(egret.Event.ENTER_FRAME, this._enterFrameHandler, this);
        //
        enableDrag(this._targetA);
        enableDrag(this._targetB);
        enableDrag(this._boundingBoxTester);
        //
        this.createText("Drag to move bounding box tester.");
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
            const dX = this._targetB.x - this._targetA.x;
            const dY = this._targetB.y - this._targetA.y;
            this._line.x = this._targetA.x;
            this._line.y = this._targetA.y;
            this._line.scaleX = Math.sqrt(dX * dX + dY * dY) / 400.0;
            this._line.rotation = Math.atan2(dY, dX) * dragonBones.Transform.RAD_DEG;

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
                this._pointA.x = this._helpPointA.x;
                this._pointA.y = this._helpPointA.y;
                this._pointB.x = this._helpPointB.x;
                this._pointB.y = this._helpPointB.y;
                this._pointA.rotation = this._helpPointC.x * dragonBones.Transform.RAD_DEG;
                this._pointB.rotation = this._helpPointC.y * dragonBones.Transform.RAD_DEG;
                //
                this._pointA.scaleX = this._pointA.scaleY = 0.6;
                this._pointB.scaleX = this._pointB.scaleY = 0.6;
            }
            else {
                this._pointA.visible = false;
                this._pointB.visible = false;
            }
        }
    }
}