/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
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
     * @internal
     * @private
     */
    export abstract class Constraint extends BaseObject {
        protected static readonly _helpMatrix: Matrix = new Matrix();
        protected static readonly _helpTransform: Transform = new Transform();
        protected static readonly _helpPoint: Point = new Point();
        /**
         * - For timeline state.
         * @internal
         */
        public _constraintData: ConstraintData;
        protected _armature: Armature;
        /**
         * - For sort bones.
         * @internal
         */
        public _target: Bone;
        /**
         * - For sort bones.
         * @internal
         */
        public _root: Bone;
        protected _bone: Bone | null;

        protected _onClear(): void {
            this._armature = null as any; //
            this._target = null as any; //
            this._root = null as any; //
            this._bone = null;
        }

        public abstract init(constraintData: ConstraintData, armature: Armature): void;
        public abstract update(): void;
        public abstract invalidUpdate(): void;

        public get name(): string {
            return this._constraintData.name;
        }
    }
    /**
     * @internal
     * @private
     */
    export class IKConstraint extends Constraint {
        public static toString(): string {
            return "[class dragonBones.IKConstraint]";
        }

        private _scaleEnabled: boolean; // TODO
        /**
         * - For timeline state.
         * @internal
         */
        public _bendPositive: boolean;
        /**
         * - For timeline state.
         * @internal
         */
        public _weight: number;

        protected _onClear(): void {
            super._onClear();

            this._scaleEnabled = false;
            this._bendPositive = false;
            this._weight = 1.0;
            this._constraintData = null as any;
        }

        private _computeA(): void {
            const ikGlobal = this._target.global;
            const global = this._root.global;
            const globalTransformMatrix = this._root.globalTransformMatrix;

            let radian = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                radian += Math.PI;
            }

            global.rotation += (radian - global.rotation) * this._weight;
            global.toMatrix(globalTransformMatrix);
        }

        private _computeB(): void {
            const boneLength = (this._bone as Bone)._boneData.length;
            const parent = this._root as Bone;
            const ikGlobal = this._target.global;
            const parentGlobal = parent.global;
            const global = (this._bone as Bone).global;
            const globalTransformMatrix = (this._bone as Bone).globalTransformMatrix;

            const x = globalTransformMatrix.a * boneLength;
            const y = globalTransformMatrix.b * boneLength;
            const lLL = x * x + y * y;
            const lL = Math.sqrt(lLL);
            let dX = global.x - parentGlobal.x;
            let dY = global.y - parentGlobal.y;
            const lPP = dX * dX + dY * dY;
            const lP = Math.sqrt(lPP);
            const rawRadian = global.rotation;
            const rawParentRadian = parentGlobal.rotation;
            const rawRadianA = Math.atan2(dY, dX);

            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            const lTT = dX * dX + dY * dY;
            const lT = Math.sqrt(lTT);

            let radianA = 0.0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                radianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x);
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    radianA += Math.PI;
                }
            }
            else {
                const h = (lPP - lLL + lTT) / (2.0 * lTT);
                const r = Math.sqrt(lPP - h * h * lTT) / lT;
                const hX = parentGlobal.x + (dX * h);
                const hY = parentGlobal.y + (dY * h);
                const rX = -dY * r;
                const rY = dX * r;

                let isPPR = false;
                if (parent._parent !== null) {
                    const parentParentMatrix = parent._parent.globalTransformMatrix;
                    isPPR = parentParentMatrix.a * parentParentMatrix.d - parentParentMatrix.b * parentParentMatrix.c < 0.0;
                }

                if (isPPR !== this._bendPositive) {
                    global.x = hX - rX;
                    global.y = hY - rY;
                }
                else {
                    global.x = hX + rX;
                    global.y = hY + rY;
                }

                radianA = Math.atan2(global.y - parentGlobal.y, global.x - parentGlobal.x);
            }

            const dR = Transform.normalizeRadian(radianA - rawRadianA);
            parentGlobal.rotation = rawParentRadian + dR * this._weight;
            parentGlobal.toMatrix(parent.globalTransformMatrix);
            //
            const currentRadianA = rawRadianA + dR * this._weight;
            global.x = parentGlobal.x + Math.cos(currentRadianA) * lP;
            global.y = parentGlobal.y + Math.sin(currentRadianA) * lP;
            //
            let radianB = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                radianB += Math.PI;
            }

            global.rotation = parentGlobal.rotation + rawRadian - rawParentRadian + Transform.normalizeRadian(radianB - dR - rawRadian) * this._weight;
            global.toMatrix(globalTransformMatrix);
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            if (this._constraintData !== null) {
                return;
            }

            this._constraintData = constraintData;
            this._armature = armature;
            this._target = this._armature.getBone(this._constraintData.target.name) as any;
            this._root = this._armature.getBone(this._constraintData.root.name) as any;
            this._bone = this._constraintData.bone !== null ? this._armature.getBone(this._constraintData.bone.name) : null;

            {
                const ikConstraintData = this._constraintData as IKConstraintData;
                this._scaleEnabled = ikConstraintData.scaleEnabled;
                this._scaleEnabled = this._scaleEnabled; // TODO
                this._bendPositive = ikConstraintData.bendPositive;
                this._weight = ikConstraintData.weight;
            }

            this._root._hasConstraint = true;
        }

        public update(): void {
            this._root.updateByConstraint();

            if (this._bone !== null) {
                this._bone.updateByConstraint();
                this._computeB();
            }
            else {
                this._computeA();
            }
        }

        public invalidUpdate(): void {
            this._root.invalidUpdate();

            if (this._bone !== null) {
                this._bone.invalidUpdate();
            }
        }
    }
}