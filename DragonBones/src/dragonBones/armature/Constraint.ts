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

        protected _computeVertices(pathDisplayDta: PathDisplayData, start: number, count: number, offset: number, out: Array<number>): void {
            offset;

            //计算曲线的节点数据
            out.length = count;


            const armature = this._armature;
            const dragonBonesData = armature.armatureData.parent;
            const scale = armature.armatureData.scale;
            const intArray = dragonBonesData.intArray;
            const floatArray = dragonBonesData.floatArray;

            const pathOffset = pathDisplayDta.offset;
            // const pathVertexCount = intArray[pathOffset + BinaryOffset.PathVertexCount];
            const pathVertexOffset = intArray[pathOffset + BinaryOffset.PathFloatOffset];

            const weightData = pathDisplayDta.weight;
            //没有骨骼约束我,那节点只受自己的Bone控制
            if (weightData === null) {
                const parentBone = this._pathSlot.parent;
                parentBone.updateByConstraint();

                const matrix = parentBone.globalTransformMatrix;

                for (let i = start, iW = 0, iV = pathVertexOffset, l = i + count; i < l; i += 2) {
                    const vx = floatArray[iV + i] * scale;
                    const vy = floatArray[iV + i + 1] * scale;

                    const x = matrix.a * vx + matrix.b * vy + matrix.tx;
                    const y = matrix.c * vx + matrix.d * vy + matrix.ty;

                    //
                    out[iW++] = x;
                    out[iW++] = y;
                }

                return;
            }

            //有骨骼约束我,那我的节点受骨骼权重控制
            const bones = this._bones;
            const weightBoneCount = weightData.bones.length;

            const weightOffset = weightData.offset;
            const floatOffset = intArray[weightOffset + BinaryOffset.WeigthFloatOffset];

            for (let i = start, iW = 0, iV = floatOffset, iB = weightOffset + BinaryOffset.WeigthBoneIndices + weightBoneCount, l = i + count; i < l; i += 2) {
                const vertexBoneCount = intArray[iB++]; //

                let xG = 0.0, yG = 0.0;
                for (let ii = 0, ll = vertexBoneCount; ii < ll; ii++) {
                    const boneIndex = intArray[iB++];
                    const bone = bones[boneIndex];
                    if (bone === null) {
                        continue;
                    }

                    bone.updateByConstraint();
                    const matrix = bone.globalTransformMatrix;
                    const weight = floatArray[iV++];
                    const vx = floatArray[iV++] * scale;
                    const vy = floatArray[iV++] * scale;
                    xG += (matrix.a * vx + matrix.c * vy + matrix.tx) * weight;
                    yG += (matrix.b * vx + matrix.d * vy + matrix.ty) * weight;
                }

                out[iW] = xG;
                out[iW + 1] = yG;
            }

            //节点k帧TODO
        }

        //计算当前的骨骼在曲线上的位置
        protected _computeBezierCurve(pathDisplayDta: PathDisplayData, spaceCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): void {
            const armature = this._armature;
            const dragonBonesData = armature.armatureData.parent;
            const intArray = dragonBonesData.intArray;
            const vertexCount = intArray[pathDisplayDta.offset + BinaryOffset.PathVertexCount];

            const positions = this._positions;
            const spaces = this._spaces;
            const closed = pathDisplayDta.closed;
            const verticesLength = vertexCount * 2;
            const curveVertices = Array<number>(8);
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
                            this._computeVertices(pathDisplayDta, curve * 6 + 2, 8, 0, curveVertices);
                        }
                    }

                    //
                    this.addCurvePosition(percent, curveVertices[0], curveVertices[1], curveVertices[2], curveVertices[3], curveVertices[4], curveVertices[5], curveVertices[6], curveVertices[7], positions, o, tangents);
                }

                return;
            }

            //匀速的TODO
        }

        //Calculates a point on the curve, for a given t value between 0 and 1.
        private addCurvePosition(t: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, out: Array<number>, offset: number, tangents: boolean) {
            if (t === 0) {
                out[offset] = x1;
                out[offset + 1] = y1;
                out[offset + 2] = 0;
                return;
            }

            if (t === 1) {
                out[offset] = x2;
                out[offset + 1] = y2;
                out[offset + 2] = 0;
                return;
            }

            const mt = 1 - t;
            const mt2 = mt * mt;
            const t2 = t * t;
            const a = mt2 * mt;
            const b = mt2 * t * 3;
            const c = mt2 * t2 * 3;
            const d = t * t2;

            const x = a * x1 + b * cx1 + c * cx2 + d * x2;
            const y = a * y1 + b * cy1 + c * cy2 + d * y2;

            out[offset] = x;
            out[offset + 1] = y;
            if (tangents) {
                //Calculates the curve tangent at the specified t value
                out[offset + 2] = Math.atan2(y - (a * y1 + b * cy1 + c * cy2), x - (a * x1 + b * cx1 + c * cx2));
            }
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            this._constraintData = constraintData;
            this._armature = armature;

            let data = constraintData as PathConstraintData;

            //
            this._position = data.position;
            this._spacing = data.spacing;
            this._rotateOffset = data.rotateOffset;
            this._rotateMix = data.rotateMix;
            this._translateMix = data.translateMix;

            //
            this._root = this._armature.getBone(data.root.name) as Bone;
            this._target = this._armature.getBone(data.target.name) as Bone;
            this._pathSlot = this._armature.getSlot(data.pathSlot.name) as Slot;

            for (let i = 0, l = data.bones.length; i < l; i++) {
                const bone = this._armature.getBone(data.bones[i].name);
                if (bone !== null) {
                    this._bones.push(bone);
                }
            }

            this._root._hasConstraint = true;

            //TODO
            (this._pathSlot._displayData as PathDisplayData).constantSpeed = false;
        }

        public update(): void {
            //
            const constraintData = this._constraintData as PathConstraintData;
            const pathSlot = this._pathSlot;
            const pathDisplayData = pathSlot._displayData as PathDisplayData;
            if (pathDisplayData === null) {
                return;
            }
            //
            const rotateMix = this._rotateMix;
            const translateMix = this._translateMix;

            const translate = translateMix > 0, rotate = rotateMix > 0;
            if (!translate && !rotate) {
                return;
            }

            //
            const positionMode = constraintData.positionMode;
            const spacingMode = constraintData.spacingMode;
            const rotateMode = constraintData.rotateMode;

            // const position = this._position;
            const spacing = this._spacing;

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

                for (let i = 0, l = spacesCount - 1; i < l; i++) {
                    const bone = bones[i];
                    bone.updateByConstraint();
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

            //计算当前被约束的骨骼在曲线上的位置
            this._computeBezierCurve(pathDisplayData, spacesCount, tangents, positionMode === PositionMode.Percent, spacingMode === SpacingMode.Percent)

            //根据新的节点数据重新采样
            let rotateOffset = this._rotateOffset;
            let boneX = this._positions[0], boneY = this._positions[1];
            let tip: boolean;
            if (rotateOffset === 0) {
                tip = rotateMode === RotateMode.Chain;
            }
            else {
                tip = false;
                const bone = pathSlot.parent;
                if (bone !== null) {
                    const matrix = bone.globalTransformMatrix;
                    rotateOffset *= matrix.a * matrix.d - matrix.b * matrix.c > 0 ? Transform.DEG_RAD : - Transform.DEG_RAD;
                }
            }

            for (let i = 0, p = 3; i < boneCount; i++ , p += 3) {
                let bone = bones[i];
                bone.updateByConstraint();
                let matrix = bone.globalTransformMatrix;
                matrix.tx += (boneX - matrix.tx) * translateMix;
                matrix.ty += (boneY - matrix.ty) * translateMix;

                const x = this._positions[p], y = this._positions[p + 1];
                const dx = x - boneX, dy = y - boneY;
                if (scale) {
                    const lenght = this._lengths[i];

                    const s = (Math.sqrt(dx * dx + dy * dy) / lenght - 1) * rotateMix + 1;
                    matrix.a *= s;
                    matrix.c *= s;
                }

                boneX = x;
                boneY = y;
                if (rotate) {
                    let a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, r, cos, sin;
                    if (tangents) {
                        r = this._positions[p - 1];
                    }
                    else {
                        r = Math.atan2(dy, dx);
                    }

                    r -= Math.atan2(c, a);

                    if (tip) {
                        cos = Math.cos(r);
                        sin = Math.sin(r);

                        const length = bone._boneData.length;
                        boneX += (length * (cos * a - sin * c) - dx) * rotateMix;
                        boneY += (length * (sin * a + cos * c) - dy) * rotateMix;
                    }
                    else {
                        r += rotateOffset;
                    }

                    if (r > Transform.PI) {
                        r -= Transform.PI_D;
                    }
                    else if (r < - Transform.PI) {
                        r += Transform.PI_D;
                    }

                    r *= rotateMix;

                    cos = Math.cos(r);
                    sin = Math.sin(r);

                    matrix.a = cos * a - sin * c;
                    matrix.b = cos * b - sin * d;
                    matrix.c = sin * a + cos * c;
                    matrix.d = sin * b + cos * d;
                }
            }
        }

        public invalidUpdate(): void {

        }
    }
}