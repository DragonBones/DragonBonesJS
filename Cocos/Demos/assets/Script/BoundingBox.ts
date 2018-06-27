import DragHelper from "./DragHelper";
@cc._decorator.ccclass
export default class BoundingBox extends cc.Component {
    private readonly _helpPointA: cc.Vec2 = cc.v2();
    private readonly _helpPointB: cc.Vec2 = cc.v2();
    private readonly _helpPointC: cc.Vec2 = cc.v2();

    private _armatureComponent: dragonBones.CocosArmatureComponent;
    private _boundingBoxTester: dragonBones.CocosArmatureComponent;
    private _targetA: dragonBones.CocosArmatureComponent;
    private _targetB: dragonBones.CocosArmatureComponent;
    private _line: dragonBones.Bone;
    private _pointA: dragonBones.Bone;
    private _pointB: dragonBones.Bone;

    start() {
        const resources = [
            cc.url.raw("resources/mecha_2903/mecha_2903_ske.json"),
            cc.url.raw("resources/mecha_2903/mecha_2903_tex.json"),
            cc.url.raw("resources/mecha_2903/mecha_2903_tex.png"),
            cc.url.raw("resources/bounding_box_tester/bounding_box_tester_ske.json"),
            cc.url.raw("resources/bounding_box_tester/bounding_box_tester_tex.json"),
            cc.url.raw("resources/bounding_box_tester/bounding_box_tester_tex.png"),
        ];
        cc.loader.load(resources, (err, assets) => {
            const factory = dragonBones.CocosFactory.factory;
            factory.parseDragonBonesData(cc.loader.getRes(resources[0]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[1]), cc.loader.getRes(resources[2]));
            factory.parseDragonBonesData(cc.loader.getRes(resources[3]));
            factory.parseTextureAtlasData(cc.loader.getRes(resources[4]), cc.loader.getRes(resources[5]));
            //
            this._armatureComponent = factory.buildArmatureComponent("mecha_2903d");
            this._boundingBoxTester = factory.buildArmatureComponent("tester");
            this._targetA = this._boundingBoxTester.armature.getSlot("target_a").childArmature.proxy as dragonBones.CocosArmatureComponent;
            this._targetB = this._boundingBoxTester.armature.getSlot("target_b").childArmature.proxy as dragonBones.CocosArmatureComponent;
            this._line = this._boundingBoxTester.armature.getBone("line");
            this._pointA = this._boundingBoxTester.armature.getBone("point_a");
            this._pointB = this._boundingBoxTester.armature.getBone("point_b");
            //
            this._armatureComponent.debugDraw = true;
            this._armatureComponent.node.x = 0.0;
            this._armatureComponent.node.y = -100.0;
            this._boundingBoxTester.node.x = 0.0;
            this._boundingBoxTester.node.y = -200.0;
            this._targetA.armature.inheritAnimation = false;
            this._targetB.armature.inheritAnimation = false;
            this._line.offsetMode = 2 /* dragonBones.OffsetMode.Override */; // creator can not support const enum.
            this._pointA.offsetMode = 2 /* dragonBones.OffsetMode.Override */; // creator can not support const enum.
            this._pointB.offsetMode = 2 /* dragonBones.OffsetMode.Override */; // creator can not support const enum.
            this._armatureComponent.animation.play("walk");
            this._boundingBoxTester.animation.play("0");
            //
            this.node.addChild(this._armatureComponent.node);
            this.node.addChild(this._boundingBoxTester.node);
            //
            DragHelper.getInstance().enableDrag(this._targetA.node);
            DragHelper.getInstance().enableDrag(this._targetB.node);
        });
    }

    update() {
        if (!this._armatureComponent) {
            return;
        }

        const localToGlobal = this._armatureComponent.node.getWorldToNodeTransform();
        const globalToLocal = this._boundingBoxTester.node.getNodeToWorldTransform();
        let globalA = (cc as any).pointApplyAffineTransform(cc.v2(this._targetA.node.x, this._targetA.node.y), localToGlobal); // creator.d.ts error.
        let globalB = (cc as any).pointApplyAffineTransform(cc.v2(this._targetB.node.x, this._targetB.node.y), localToGlobal); // creator.d.ts error.
        let localA = (cc as any).pointApplyAffineTransform(globalA, globalToLocal); // creator.d.ts error.
        let localB = (cc as any).pointApplyAffineTransform(globalB, globalToLocal); // creator.d.ts error.

        const containsSlotA = this._armatureComponent.armature.containsPoint(localA.x, localA.y);
        const containsSlotB = this._armatureComponent.armature.containsPoint(localB.x, localB.y);
        const intersectsSlots = this._armatureComponent.armature.intersectsSegment(localA.x, localA.y, localB.x, localB.y, localA, localB, this._helpPointC);

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
                const globalToLocal = this._armatureComponent.node.getNodeToWorldTransform();
                const localToGlobal = this._boundingBoxTester.node.getWorldToNodeTransform();
                globalA = (cc as any).pointApplyAffineTransform(localA, localToGlobal); // creator.d.ts error.
                globalB = (cc as any).pointApplyAffineTransform(localB, localToGlobal); // creator.d.ts error.
                localA = (cc as any).pointApplyAffineTransform(globalA, globalToLocal); // creator.d.ts error.
                localB = (cc as any).pointApplyAffineTransform(globalB, globalToLocal); // creator.d.ts error.

                this._pointA.visible = true;
                this._pointB.visible = true;
                this._pointA.offset.x = localA.x;
                this._pointA.offset.y = localA.y;
                this._pointB.offset.x = localB.x;
                this._pointB.offset.y = localB.y;
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
