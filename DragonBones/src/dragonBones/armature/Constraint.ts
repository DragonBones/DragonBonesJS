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
     * @internal
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

            global.rotation += Transform.normalizeRadian(radian - global.rotation) * this._weight;
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
                const parentParent = parent.parent;
                if (parentParent !== null) {
                    const parentParentMatrix = parentParent.globalTransformMatrix;
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
     */
    export class PathConstraint extends Constraint {

        public dirty: boolean;
        public pathOffset: number;
        public position: number;
        public spacing: number;
        public rotateOffset: number;
        public rotateMix: number;
        public translateMix: number;

        private _pathSlot: Slot;
        private _bones: Array<Bone> = [];

        private _spaces: Array<number> = [];
        private _positions: Array<number> = [];
        private _curves: Array<number> = [];
        private _boneLengths: Array<number> = [];

        private _pathGlobalVertices: Array<number> = [];
        private _segments: Array<number> = [10];

        public static toString(): string {
            return "[class dragonBones.PathConstraint]";
        }

        protected _onClear(): void {
            super._onClear();

            this.dirty = false;
            this.pathOffset = 0;

            this.position = 0.0;
            this.spacing = 0.0;
            this.rotateOffset = 0.0;
            this.rotateMix = 1.0;
            this.translateMix = 1.0;

            this._pathSlot = null as any;
            this._bones.length = 0;

            this._spaces.length = 0;
            this._positions.length = 0;
            this._curves.length = 0;
            this._boneLengths.length = 0;

            this._pathGlobalVertices.length = 0;
        }

        protected _updatePathVertices(verticesData: VerticesData): void {
            //计算曲线的节点数据
            const armature = this._armature;
            const dragonBonesData = armature.armatureData.parent;
            const scale = armature.armatureData.scale;
            const intArray = dragonBonesData.intArray;
            const floatArray = dragonBonesData.floatArray;

            const pathOffset = verticesData.offset;
            const pathVertexCount = intArray[pathOffset + BinaryOffset.PathVertexCount];
            const pathVertexOffset = intArray[pathOffset + BinaryOffset.PathFloatOffset];

            this._pathGlobalVertices.length = pathVertexCount * 2;

            const weightData = verticesData.weight;
            //没有骨骼约束我,那节点只受自己的Bone控制
            if (weightData === null) {
                const parentBone = this._pathSlot.parent;
                parentBone.updateByConstraint();

                const matrix = parentBone.globalTransformMatrix;

                for (let i = 0, iV = pathVertexOffset; i < pathVertexCount; i += 2) {
                    const vx = floatArray[iV++] * scale;
                    const vy = floatArray[iV++] * scale;

                    const x = matrix.a * vx + matrix.c * vy + matrix.tx;
                    const y = matrix.b * vx + matrix.d * vy + matrix.ty;

                    //
                    this._pathGlobalVertices[i] = x;
                    this._pathGlobalVertices[i + 1] = y;
                }
                return;
            }

            //有骨骼约束我,那我的节点受骨骼权重控制
            const bones = (this._pathSlot._deformVertices as DeformVertices).bones;
            const weightBoneCount = weightData.bones.length;

            const weightOffset = weightData.offset;
            const floatOffset = intArray[weightOffset + BinaryOffset.WeigthFloatOffset];

            let iV = floatOffset;
            let iB = weightOffset + BinaryOffset.WeigthBoneIndices + weightBoneCount;

            for (let i = 0, iW = 0; i < pathVertexCount; i++) {
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

                this._pathGlobalVertices[iW++] = xG;
                this._pathGlobalVertices[iW++] = yG;
            }
        }

        protected _computeVertices(start: number, count: number, offset: number, out: Array<number>): void {
            //TODO优化
            for (let i = offset, iW = start; i < count; i += 2) {
                out[i] = this._pathGlobalVertices[iW++];
                out[i + 1] = this._pathGlobalVertices[iW++];
            }
        }

        protected _computeBezierCurve(pathDisplayDta: PathDisplayData, spaceCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): void {
            //计算当前的骨骼在曲线上的位置
            const armature = this._armature;
            const intArray = armature.armatureData.parent.intArray;
            const vertexCount = intArray[pathDisplayDta.vertices.offset + BinaryOffset.PathVertexCount];

            const positions = this._positions;
            const spaces = this._spaces;
            const isClosed = pathDisplayDta.closed;
            const curveVertices = Array<number>();
            let verticesLength = vertexCount * 2;
            let curveCount = verticesLength / 6;
            let preCurve = -1;
            let position = this.position;

            positions.length = spaceCount * 3 + 2;

            let pathLength = 0.0;
            //不需要匀速运动，效率高些
            if (!pathDisplayDta.constantSpeed) {
                const lenghts = pathDisplayDta.curveLengths;
                curveCount -= isClosed ? 1 : 2;
                pathLength = lenghts[curveCount];

                if (percentPosition) {
                    position *= pathLength;
                }

                if (percentSpacing) {
                    for (let i = 0; i < spaceCount; i++) {
                        spaces[i] *= pathLength;
                    }
                }

                curveVertices.length = 8;
                for (let i = 0, o = 0, curve = 0; i < spaceCount; i++ , o += 3) {
                    const space = spaces[i];
                    position += space;

                    if (isClosed) {
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
                        if (isClosed && curve === curveCount) {
                            //计算曲线
                            this._computeVertices(verticesLength - 4, 4, 0, curveVertices);
                            this._computeVertices(0, 4, 4, curveVertices);
                        }
                        else {
                            this._computeVertices(curve * 6 + 2, 8, 0, curveVertices);
                        }
                    }

                    //
                    this.addCurvePosition(percent, curveVertices[0], curveVertices[1], curveVertices[2], curveVertices[3], curveVertices[4], curveVertices[5], curveVertices[6], curveVertices[7], positions, o, tangents);
                }

                return;
            }

            //匀速的
            if (isClosed) {
                verticesLength += 2;
                curveVertices.length = vertexCount;
                this._computeVertices(2, verticesLength - 4, 0, curveVertices);
                this._computeVertices(0, 2, verticesLength - 4, curveVertices);

                curveVertices[verticesLength - 2] = curveVertices[0];
                curveVertices[verticesLength - 1] = curveVertices[1];
            }
            else {
                curveCount--;
                verticesLength -= 4;
                curveVertices.length = verticesLength;
                this._computeVertices(2, verticesLength, 0, curveVertices);
            }
            //
            let curves: Array<number> = new Array<number>(curveCount);
            pathLength = 0;
            let x1 = curveVertices[0], y1 = curveVertices[1], cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0, x2 = 0, y2 = 0;
            let tmpx, tmpy, dddfx, dddfy, ddfx, ddfy, dfx, dfy;

            for (let i = 0, w = 2; i < curveCount; i++ , w += 6) {
                cx1 = curveVertices[w];
                cy1 = curveVertices[w + 1];
                cx2 = curveVertices[w + 2];
                cy2 = curveVertices[w + 3];
                x2 = curveVertices[w + 4];
                y2 = curveVertices[w + 5];
                tmpx = (x1 - cx1 * 2 + cx2) * 0.1875;
                tmpy = (y1 - cy1 * 2 + cy2) * 0.1875;
                dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.09375;
                dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.09375;
                ddfx = tmpx * 2 + dddfx;
                ddfy = tmpy * 2 + dddfy;
                dfx = (cx1 - x1) * 0.75 + tmpx + dddfx * 0.16666667;
                dfy = (cy1 - y1) * 0.75 + tmpy + dddfy * 0.16666667;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx;
                dfy += ddfy;
                ddfx += dddfx;
                ddfy += dddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx;
                dfy += ddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx + dddfx;
                dfy += ddfy + dddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                curves[i] = pathLength;
                x1 = x2;
                y1 = y2;
            }

            if (percentPosition) {
                position *= pathLength;
            }
            if (percentSpacing) {
                for (let i = 0; i < spaceCount; i++) {
                    spaces[i] *= pathLength;
                }
            }

            let segments = this._segments;
            let curveLength: number = 0;
            for (let i = 0, o = 0, curve = 0, segment = 0; i < spaceCount; i++ , o += 3) {
                const space = spaces[i];
                position += space;
                let p = position;

                if (isClosed) {
                    p %= pathLength;
                    if (p < 0) p += pathLength;
                    curve = 0;
                } else if (p < 0) {
                    continue;
                } else if (p > pathLength) {
                    continue;
                }

                // Determine curve containing position.
                for (; ; curve++) {
                    const length = curves[curve];
                    if (p > length) continue;
                    if (curve === 0)
                        p /= length;
                    else {
                        const prev = curves[curve - 1];
                        p = (p - prev) / (length - prev);
                    }
                    break;
                }

                if (curve !== preCurve) {
                    preCurve = curve;
                    let ii = curve * 6;
                    x1 = curveVertices[ii];
                    y1 = curveVertices[ii + 1];
                    cx1 = curveVertices[ii + 2];
                    cy1 = curveVertices[ii + 3];
                    cx2 = curveVertices[ii + 4];
                    cy2 = curveVertices[ii + 5];
                    x2 = curveVertices[ii + 6];
                    y2 = curveVertices[ii + 7];
                    tmpx = (x1 - cx1 * 2 + cx2) * 0.03;
                    tmpy = (y1 - cy1 * 2 + cy2) * 0.03;
                    dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.006;
                    dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.006;
                    ddfx = tmpx * 2 + dddfx;
                    ddfy = tmpy * 2 + dddfy;
                    dfx = (cx1 - x1) * 0.3 + tmpx + dddfx * 0.16666667;
                    dfy = (cy1 - y1) * 0.3 + tmpy + dddfy * 0.16666667;
                    curveLength = Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[0] = curveLength;
                    for (ii = 1; ii < 8; ii++) {
                        dfx += ddfx;
                        dfy += ddfy;
                        ddfx += dddfx;
                        ddfy += dddfy;
                        curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                        segments[ii] = curveLength;
                    }
                    dfx += ddfx;
                    dfy += ddfy;
                    curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[8] = curveLength;
                    dfx += ddfx + dddfx;
                    dfy += ddfy + dddfy;
                    curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[9] = curveLength;
                    segment = 0;
                }

                // Weight by segment length.
                p *= curveLength;
                for (; ; segment++) {
                    const length = segments[segment];
                    if (p > length) continue;
                    if (segment === 0)
                        p /= length;
                    else {
                        const prev = segments[segment - 1];
                        p = segment + (p - prev) / (length - prev);
                    }
                    break;
                }

                this.addCurvePosition(p * 0.1, x1, y1, cx1, cy1, cx2, cy2, x2, y2, positions, o, tangents);
            }
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
            const c = mt * t2 * 3;
            const d = t * t2;

            const x = a * x1 + b * cx1 + c * cx2 + d * x2;
            const y = a * y1 + b * cy1 + c * cy2 + d * y2;

            out[offset] = x;
            out[offset + 1] = y;
            if (tangents) {
                //Calculates the curve tangent at the specified t value
                out[offset + 2] = Math.atan2(y - (a * y1 + b * cy1 + c * cy2), x - (a * x1 + b * cx1 + c * cx2));
            }
            else {
                out[offset + 2] = 0;
            }
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            this._constraintData = constraintData;
            this._armature = armature;

            let data = constraintData as PathConstraintData;

            this.pathOffset = data.pathDisplayData.vertices.offset;

            //
            this.position = data.position;
            this.spacing = data.spacing;
            this.rotateOffset = data.rotateOffset;
            this.rotateMix = data.rotateMix;
            this.translateMix = data.translateMix;

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

            if (data.rotateMode === RotateMode.ChainScale) {
                this._boneLengths.length = this._bones.length;
            }

            this._root._hasConstraint = true;
        }

        public update(): void {
            const pathSlot = this._pathSlot;

            if (
                pathSlot._deformVertices === null ||
                pathSlot._deformVertices.verticesData === null ||
                pathSlot._deformVertices.verticesData.offset !== this.pathOffset
            ) {
                return;
            }

            const constraintData = this._constraintData as PathConstraintData;
            const pathDisplayData = pathSlot._displayData as PathDisplayData; // TODO

            //

            //曲线节点数据改变:父亲bone改变，权重bones改变，变形顶点改变
            let isPathVerticeDirty = false;
            let deformVertices = pathSlot._deformVertices;
            if (this._root._childrenTransformDirty) {
                this._updatePathVertices(pathDisplayData.vertices);
                isPathVerticeDirty = true;
            }
            else if (deformVertices !== null && (deformVertices.verticesDirty || deformVertices.isBonesUpdate())) {
                this._updatePathVertices(pathDisplayData.vertices);
                deformVertices.verticesDirty = false;
                isPathVerticeDirty = true;
            }

            if (!isPathVerticeDirty && !this.dirty) {
                return;
            }

            //
            const positionMode = constraintData.positionMode;
            const spacingMode = constraintData.spacingMode;
            const rotateMode = constraintData.rotateMode;

            const bones = this._bones;

            const isLengthMode = spacingMode === SpacingMode.Length;
            const isChainScaleMode = rotateMode === RotateMode.ChainScale;
            const isTangentMode = rotateMode === RotateMode.Tangent;
            const boneCount = bones.length;
            const spacesCount = isTangentMode ? boneCount : boneCount + 1;

            const spacing = this.spacing;
            let spaces = this._spaces;
            spaces.length = spacesCount;

            //计曲线间隔和长度
            if (isChainScaleMode || isLengthMode) {
                //Bone改变和spacing改变触发
                spaces[0] = 0;
                for (let i = 0, l = spacesCount - 1; i < l; i++) {
                    const bone = bones[i];
                    bone.updateByConstraint();
                    const boneLength = bone._boneData.length;
                    const matrix = bone.globalTransformMatrix;
                    const x = boneLength * matrix.a;
                    const y = boneLength * matrix.b;

                    const len = Math.sqrt(x * x + y * y);
                    if (isChainScaleMode) {
                        this._boneLengths[i] = len;
                    }
                    spaces[i + 1] = (boneLength + spacing) * len / boneLength;
                }
            }
            else {
                for (let i = 0; i < spacesCount; i++) {
                    spaces[i] = spacing;
                }
            }
            //
            this._computeBezierCurve(pathDisplayData, spacesCount, isTangentMode, positionMode === PositionMode.Percent, spacingMode === SpacingMode.Percent);

            //根据新的节点数据重新采样
            const positions = this._positions;
            let rotateOffset = this.rotateOffset;
            let boneX = positions[0], boneY = positions[1];
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

            //
            const rotateMix = this.rotateMix;
            const translateMix = this.translateMix;
            for (let i = 0, p = 3; i < boneCount; i++ , p += 3) {
                let bone = bones[i];
                bone.updateByConstraint();
                let matrix = bone.globalTransformMatrix;
                matrix.tx += (boneX - matrix.tx) * translateMix;
                matrix.ty += (boneY - matrix.ty) * translateMix;

                const x = positions[p], y = positions[p + 1];
                const dx = x - boneX, dy = y - boneY;
                if (isChainScaleMode) {
                    const lenght = this._boneLengths[i];

                    const s = (Math.sqrt(dx * dx + dy * dy) / lenght - 1) * rotateMix + 1;
                    matrix.a *= s;
                    matrix.b *= s;
                }

                boneX = x;
                boneY = y;
                if (rotateMix > 0) {
                    let a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, r, cos, sin;
                    if (isTangentMode) {
                        r = positions[p - 1];
                    }
                    else {
                        r = Math.atan2(dy, dx);
                    }

                    r -= Math.atan2(b, a);

                    if (tip) {
                        cos = Math.cos(r);
                        sin = Math.sin(r);

                        const length = bone._boneData.length;
                        boneX += (length * (cos * a - sin * b) - dx) * rotateMix;
                        boneY += (length * (sin * a + cos * b) - dy) * rotateMix;
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

                    matrix.a = cos * a - sin * b;
                    matrix.b = sin * a + cos * b;
                    matrix.c = cos * c - sin * d;
                    matrix.d = sin * c + cos * d;
                }

                bone.global.fromMatrix(matrix);
            }

            this.dirty = false;
        }

        public invalidUpdate(): void {

        }
    }
}