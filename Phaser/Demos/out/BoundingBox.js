"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BoundingBox = /** @class */ (function (_super) {
    __extends(BoundingBox, _super);
    function BoundingBox() {
        var _this = _super.call(this, "BoundingBox") || this;
        _this._helpPointA = new Phaser.Math.Vector2();
        _this._helpPointB = new Phaser.Math.Vector2();
        _this._helpPointC = new Phaser.Math.Vector2();
        _this._helperMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        return _this;
    }
    BoundingBox.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.dragonbone("mecha_2903d", "resource/mecha_2903/mecha_2903_tex.png", "resource/mecha_2903/mecha_2903_tex.json", "resource/mecha_2903/mecha_2903_ske.json");
        this.load.dragonbone("tester", "resource/bounding_box_tester/bounding_box_tester_tex.png", "resource/bounding_box_tester/bounding_box_tester_tex.json", "resource/bounding_box_tester/bounding_box_tester_ske.json");
    };
    BoundingBox.prototype.create = function () {
        _super.prototype.create.call(this);
        this._armatureDisplay = this.add.armature("mecha_2903d", "mecha_2903d");
        this._boundingBoxTester = this.add.armature("tester", "tester");
        this._targetA = this._boundingBoxTester.armature.getSlot("target_a").display;
        this._targetB = this._boundingBoxTester.armature.getSlot("target_b").display;
        this._line = this._boundingBoxTester.armature.getBone("line");
        this._pointA = this._boundingBoxTester.armature.getBone("point_a");
        this._pointB = this._boundingBoxTester.armature.getBone("point_b");
        var cx = this.cameras.main.centerX;
        var cy = this.cameras.main.centerY;
        this._armatureDisplay.debugDraw = true;
        this._armatureDisplay.x = cx;
        this._armatureDisplay.y = cy + 100.0;
        this._boundingBoxTester.x = cx;
        this._boundingBoxTester.y = cy + 200.0;
        this._targetA.armature.inheritAnimation = false;
        this._targetB.armature.inheritAnimation = false;
        this._line.offsetMode = 2 /* Override */;
        this._pointA.offsetMode = 2 /* Override */;
        this._pointB.offsetMode = 2 /* Override */;
        this._armatureDisplay.animation.play("walk");
        this._boundingBoxTester.animation.play("0");
        var bA = this._targetA.getAt(0);
        var bB = this._targetB.getAt(0);
        this._targetA.setSize(bA.displayWidth, bA.displayHeight);
        DragHelper.getInstance().enableDrag(this, this._targetA);
        this._targetB.setSize(bB.displayWidth, bB.displayHeight);
        DragHelper.getInstance().enableDrag(this, this._targetB);
        this.createText("Touch to drag bounding box tester.");
    };
    BoundingBox.prototype.update = function (time, delta) {
        if (!this._armatureDisplay)
            return;
        this._boundingBoxTester.getWorldTransformMatrix(this._helperMatrix);
        this._helperMatrix.transformPoint(this._targetA.x, this._targetA.y, this._helpPointA);
        this._helperMatrix.transformPoint(this._targetB.x, this._targetB.y, this._helpPointB);
        this._armatureDisplay.localTransform.transformPoint(this._helpPointA.x, this._helpPointA.y, this._helpPointA);
        this._armatureDisplay.localTransform.transformPoint(this._helpPointB.x, this._helpPointB.y, this._helpPointB);
        var containsSlotA = this._armatureDisplay.armature.containsPoint(this._helpPointA.x, this._helpPointA.y);
        var containsSlotB = this._armatureDisplay.armature.containsPoint(this._helpPointB.x, this._helpPointB.y);
        var intersectsSlots = this._armatureDisplay.armature.intersectsSegment(this._helpPointA.x, this._helpPointA.y, this._helpPointB.x, this._helpPointB.y, this._helpPointA, this._helpPointB, this._helpPointC);
        {
            var animationName = containsSlotA ? "1" : "0";
            if (this._targetA.animation.lastAnimationName !== animationName) {
                this._targetA.animation.fadeIn(animationName, 0.2).resetToPose = false;
            }
        }
        {
            var animationName = containsSlotB ? "1" : "0";
            if (this._targetB.animation.lastAnimationName !== animationName) {
                this._targetB.animation.fadeIn(animationName, 0.2).resetToPose = false;
            }
        }
        {
            var targetA = this._targetA.armature.parent.parent;
            var targetB = this._targetB.armature.parent.parent;
            var dX = targetB.global.x - targetA.global.x;
            var dY = targetB.global.y - targetA.global.y;
            this._line.offset.x = targetA.global.x;
            this._line.offset.y = targetA.global.y;
            this._line.offset.scaleX = Math.sqrt(dX * dX + dY * dY) / 100.0;
            this._line.offset.rotation = Math.atan2(dY, dX);
            this._line.invalidUpdate();
            var animationName = intersectsSlots ? "1" : "0";
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
    };
    return BoundingBox;
}(BaseDemo));
