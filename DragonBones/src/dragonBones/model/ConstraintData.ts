/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
namespace dragonBones {
    /**
     * @private
     */
    export abstract class ConstraintData extends BaseObject {
        public order: number;
        public name: string;
        public type: ConstraintType;
        public target: BoneData;
        public root: BoneData;
        public bone: BoneData | null;

        protected _onClear(): void {
            this.order = 0;
            this.name = "";
            this.type = ConstraintType.IK;
            this.target = null as any; //
            this.root = null as any; //
            this.bone = null;
        }
    }
    /**
     * @internal
     */
    export class IKConstraintData extends ConstraintData {
        public static toString(): string {
            return "[class dragonBones.IKConstraintData]";
        }

        public scaleEnabled: boolean;
        public bendPositive: boolean;
        public weight: number;

        protected _onClear(): void {
            super._onClear();

            this.scaleEnabled = false;
            this.bendPositive = false;
            this.weight = 1.0;
        }
    }

    /**
     * @internal
     */
    export class TransformConstraintData extends ConstraintData {
        public static toString(): string {
            return "[class dragonBones.TransformConstraintData]";
        }
        public targetBone: BoneData;
        public bones: BoneData[];
        public offsetX: number;
        public offsetY: number;
        public offsetRotation: number;
        public offsetScaleX: number;
        public offsetScaleY: number;

        public rotateWeight : number;
        public scaleWeight : number;
        public translateWeight : number;

        public local: boolean;
        public relative: boolean;

        protected _onClear(): void {
            super._onClear();

            this.targetBone = null as any; //
            this.bones = [];
            this.offsetX = 0;
            this.offsetY= 0;
            this.offsetRotation = 0;
            this.offsetScaleX = 0;
            this.offsetScaleY = 0;
            this.rotateWeight = 0;
            this.scaleWeight = 0;
            this.translateWeight = 0;
            this.local = false;
            this.relative = false;
            this.type = ConstraintType.Transform;
        }
    }

    /**
     * @internal
     */
    export class PhysicsConstraintData extends ConstraintData {
        public static toString(): string {
            return "[class dragonBones.PhysicsConstraintData]";
        }
        public x: number; 
        public y: number;
        public rotate: number; 
        public scaleX: number; 
        public shearX: number; 
        public limit: number; 
        public fps: number; 
        public inertia: number; 
        public strength: number; 
        public damping: number;
        public mass: number; 
        public wind: number;
        public windDisturbance: number;
        public gravity: number;
        public weight: number;

        protected _onClear(): void {
            super._onClear();

            this.x = 0;
            this.y = 0;
            this.rotate = 0;
            this.scaleX = 0;
            this.shearX = 0;
            this.limit = 0;
            this.fps = 0;
            this.inertia = 0;
            this.strength = 0;
            this.damping = 0;
            this.mass = 0;
            this.wind = 0;
            this.windDisturbance = 0;
            this.gravity = 0;
            this.weight = 0;
            this.type = ConstraintType.Physics;
        }
    }
    /**
     * @internal
     */
    export class PathConstraintData extends ConstraintData {
        public static toString(): string {
            return "[class dragonBones.PathConstraintData]";
        }

        public pathSlot : SlotData;
        public pathDisplayData : PathDisplayData;
        public bones : Array<BoneData> = [];

        public positionMode : PositionMode;
        public spacingMode : SpacingMode;
        public rotateMode : RotateMode;

        public position : number;
        public spacing : number;
        public rotateOffset : number;
        public rotateWeight : number;
        public xWeight : number;
        public yWeight : number;

        protected _onClear() : void {
            super._onClear();

            this.pathSlot = null as any;
            this.pathDisplayData = null as any;
            this.bones.length = 0;

            this.positionMode = PositionMode.Fixed;
            this.spacingMode = SpacingMode.Fixed;
            this.rotateMode = RotateMode.Chain;

            this.position = 0.0;
            this.spacing = 0.0;
            this.rotateOffset = 0.0;
            this.rotateWeight = 0.0;
            this.xWeight = 0.0;
            this.yWeight = 0.0;
            this.type = ConstraintType.Path;
        }

        public AddBone(value : BoneData) : void {
            this.bones.push(value);
        }
    }
}