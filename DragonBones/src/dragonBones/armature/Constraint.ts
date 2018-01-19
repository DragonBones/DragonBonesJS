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

    /**
     * @internal
     * @private
     */
    export class PathConstraint extends Constraint {

        public _position: number;
        public _spacing: number;
        public _rotateOffset: number;
        public _rotateMix: number;
        public _translateMix: number;

        private _pathSlot: Slot;
        private _bones: Array<Bone> = [];

        private _spaces: Array<number> = [];
        private _positions: Array<number> = [];
        private _curves: Array<number> = [];
        private _lengths: Array<number> = [];

        public static toString(): string {
            return "[class dragonBones.PathConstraint]";
        }

        protected _onClear(): void {
            super._onClear();

            this._position = 0.0;
            this._spacing = 0.0;
            this._rotateOffset = 0.0;
            this._rotateMix = 1.0;
            this._translateMix = 1.0;

            this._pathSlot = null as any;
            this._bones.length = 0;

            this._spaces.length = 0;
            this._positions.length = 0;
            this._curves.length = 0;
            this._lengths.length = 0;
        }

        protected _computeBezierCurve(pathDisplayDta: PathDisplayData, spaceCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): void {

            const positions = this._positions;
            const spaces = this._spaces;
            const closed = pathDisplayDta.closed;
            const verticesLength = pathDisplayDta.vertices.length;
            const curves = Array<number>(8);
            let curveCount = verticesLength / 6;
            let preCurve = -1;
            let position = this._position;

            positions.length = spaceCount * 3 + 2;

            let pathLength = 0.0;
            //不需要匀速运动，效率高些
            if (!pathDisplayDta.constantSpeed) {
                const lenghts = pathDisplayDta.lengths;
                curveCount -= closed ? 1 : 2;
                pathLength = lenghts[curveCount];

                if (percentPosition) {
                    position *= pathLength;
                }

                if (percentSpacing) {
                    for (let i = 0; i < spaceCount; i++) {
                        spaces[i] *= pathLength;
                    }
                }

                for (let i = 0, o = 0, curve = 0; i < spaceCount; i++ , o += 3) {
                    const space = spaces[i];
                    position += space;

                    if (closed) {
                        position %= pathLength;
                        if (position < 0) {
                            position += pathLength;
                        }
                        curve = 0;
                    }
                    else if (position < 0) {
                        //TODO
                        continue;
                    }
                    else if (position > pathLength) {
                        //TODO
                        continue;
                    }

                    let percent = 0.0;
                    for (; ; curve++) {
                        const len = lenghts[curve];
                        if (position > len) {
                            continue;
                        }
                        if (curve === 0) {
                            percent = position / len;
                        }
                        else {
                            const preLen = lenghts[curve - 1];
                            percent = (position - preLen) / (len - preLen);
                        }
                        break;
                    }

                    if (curve !== preCurve) {
                        preCurve = curve;
                        if (closed && curve === curveCount) {
                            //计算曲线
                        }
                        else {

                        }
                    }

                    //
                    //AddCurvePosition
                }

                return;
            }
            //计算曲线的节点数据

            //没有骨骼约束我

            //有骨骼约束我

            //节点k帧
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            this._constraintData = constraintData;
            this._armature = armature;

            const data = constraintData as PathConstraintData;

            //
            this._position = data.position;
            this._spacing = data.spacing;
            this._rotateOffset = data.rotateOffset;
            this._rotateMix = data.rotateMix;
            this._translateMix = data.translateMix;

            //
            this._pathSlot = this._armature.getSlot(data.pathSlot.name) as Slot;

            for (let i = 0, l = data.bones.length; i < l; i++) {
                const bone = this._armature.getBone(data.bones[i].name);
                if (bone !== null) {
                    this._bones.push(bone);
                }
            }

        }

        public update(): void {
            //
            const constraintData = this._constraintData as PathConstraintData;
            const pathDisplayData = constraintData.pathSlot;
            const pathSlot = this._pathSlot;

            //
            const positionMode = constraintData.positionMode;
            const spacingMode = constraintData.spacingMode;
            const rotateMode = constraintData.rotateMode;

            const position = this._position;
            const spacing = this._spacing;
            const rotateOffset = this._rotateOffset;
            const rotateMix = this._rotateMix;
            const translateMix = this._translateMix;

            const bones = this._bones;

            const lengthSpacing = spacingMode === SpacingMode.Length;
            const scale = rotateMode === RotateMode.ChainScale;
            const tangents = rotateMode === RotateMode.Tangent;
            const boneCount = bones.length;
            const spacesCount = tangents ? boneCount : boneCount + 1;

            this._spaces.length = spacesCount;

            //计曲线间隔和长度
            if (scale || lengthSpacing) {
                if (scale) {
                    this._lengths.length = bones.length;
                }

                for (let i = 0, l = spacesCount; i < l; i++) {
                    const bone = bones[i];
                    const boneLength = bone._boneData.length;
                    const globalTransformMatrix = bone.globalTransformMatrix;
                    const x = boneLength * globalTransformMatrix.a;
                    const y = boneLength * globalTransformMatrix.c;

                    const len = Math.sqrt(x * x + y * y);
                    if (scale) {
                        this._lengths[i] = len;
                    }
                    this._spaces[i] = (boneLength + spacing) * len / boneLength;
                }
            }
            else {

                for (let i = 0; i < spacesCount; i++) {
                    this._spaces[i] = spacing;
                }
            }

            //重新计算曲线的节点数据

            //根据新的节点数据重新采样
        }

        public invalidUpdate(): void {

        }
    }
}