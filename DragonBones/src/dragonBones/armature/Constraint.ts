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

        // private _scaleEnabled: boolean; // TODO
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

            // this._scaleEnabled = false;
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
                // this._scaleEnabled = ikConstraintData.scaleEnabled;
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
    export class TransformConstraint extends Constraint {
        public static toString(): string {
            return "[class dragonBones.TransformConstraint]";
        }

        private _helpMatrix1: Matrix = new Matrix();
        private _helpMatrix2: Matrix = new Matrix();
        private _helpTransform: Transform = new Transform();
        public _dirty: boolean = true;

        public index: number = -1;

        /**
         * - For timeline state.
         * @internal
         */
        public _rotateWeight : number;
        /**
         * - For timeline state.
         * @internal
         */
        public _scaleWeight : number;
        /**
         * - For timeline state.
         * @internal
         */
        public _translateWeight : number;

        protected _onClear(): void {
            super._onClear();

            this._constraintData = null as any;
            this.index = -1;
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            if (this._constraintData !== null) {
                return;
            }

            if (this.index < 0) {
                return;
            }
            this._constraintData = constraintData;
            this._armature = armature;
            this._target = this._armature.getBone(this._constraintData.target.name) as any;
            const transformConstraintData = this._constraintData as TransformConstraintData;
            const boneName = transformConstraintData.bones[this.index].name;
            this._bone = this._armature.getBone(boneName);
            if (!this._bone) {
                return;
            }
            this._rotateWeight = transformConstraintData.rotateWeight;
            this._scaleWeight = transformConstraintData.scaleWeight;
            this._translateWeight = transformConstraintData.translateWeight;

            this._root = this._bone;
            this._root._transformConstraint = this;
            this._target._targetTransformConstraint = this;
        }

        public update(): void {
            if (!this._dirty) {
                return;
            }
            if (!this._root || !this._target || !this._bone) {
                return;
            }

            if (this._bone !== null) {
                
                this._compute();
            }
            this._dirty = false;
        }

        private _compute(): void {
            if (this._target && this._root) {
                const transformConstraintData = this._constraintData as TransformConstraintData;
                const {offsetX, offsetY, offsetRotation, offsetScaleX, offsetScaleY, local} = transformConstraintData;
                
                const globalTransformMatrix = this._root.globalTransformMatrix;
                if(local) {
                    const parentMatrix = this._target.globalTransformMatrix;
                    const localMatrix = this._helpMatrix1.copyFrom(parentMatrix);
                    if(this._target.parent) {
                        const grandMatrix = this._helpMatrix2.copyFrom(this._target.parent.globalTransformMatrix);
                        const p = grandMatrix.invert();
                        localMatrix.concat(p);
                    }
                    const localTransform = this._helpTransform.fromMatrix(localMatrix);
                    this._root.global.x = this._root.global.x * (1 - this._translateWeight) + localTransform.x * this._translateWeight + offsetX;
                    this._root.global.y = this._root.global.y * (1 - this._translateWeight) + localTransform.y * this._translateWeight + offsetY;
                    this._root.global.rotation = this._root.global.rotation * (1 - this._rotateWeight) + localTransform.rotation * this._rotateWeight + offsetRotation;
                    this._root.global.scaleX = this._root.global.scaleX * (1 - this._scaleWeight) + localTransform.scaleX * this._scaleWeight + offsetScaleX;
                    this._root.global.scaleY = this._root.global.scaleY * (1 - this._scaleWeight) + localTransform.scaleY * this._scaleWeight + offsetScaleY;
                    this._root.global.toMatrix(globalTransformMatrix);
                }
                else {
                    this._root.global.x = this._root.global.x * (1 - this._translateWeight) + this._target.global.x * this._translateWeight + offsetX;
                    this._root.global.y = this._root.global.y * (1 - this._translateWeight) + this._target.global.y * this._translateWeight + offsetY;
                    this._root.global.rotation = this._root.global.rotation * (1 - this._rotateWeight) + this._target.global.rotation * this._rotateWeight + offsetRotation;
                    this._root.global.scaleX = this._root.global.scaleX * (1 - this._scaleWeight) + this._target.global.scaleX * this._scaleWeight + offsetScaleX;
                    this._root.global.scaleY = this._root.global.scaleY * (1 - this._scaleWeight) + this._target.global.scaleY * this._scaleWeight + offsetScaleY;
                    this._root.global.toMatrix(globalTransformMatrix);
                }
            }
        }

        public invalidUpdate(): void {
            if (this._root) {
                this._root.invalidUpdate();
            }
        }
    }

    /**
     * @internal
     */
    export class PhysicsConstraint extends Constraint {
        public static toString(): string {
            return "[class dragonBones.PhysicsConstraint]";
        }

        /**
         * - For timeline state.
         * @internal
         */
        public _inertia: number;
        /**
         * - For timeline state.
         * @internal
         */
        public _strength: number;
        /**
         * - For timeline state.
         * @internal
         */
        public _damping: number;
        /**
         * - For timeline state.
         * @internal
         */
        public _mass: number; 
        /**
         * - For timeline state.
         * @internal
         */
        public _wind: number;
        /**
         * - For timeline state.
         * @internal
         */
        public _gravity: number;
        /**
         * - For timeline state.
         * @internal
         */
        public _weight: number;
        /**
         * - For timeline state.
         * @internal
         */
        public _reset: boolean;

        public _sleeping: boolean = false;

        private _massInverse: number = 0;
        private _fpsTime: number = 0;
        private _dump : number = 0;

        private _remaining: number = 0;
        private _lastTime: number = 0;
        private _xOffset: number = 0;
        private _xVelocity: number = 0;
        private _yOffset: number = 0;
        private _yVelocity: number = 0;
        private _rotateOffset: number = 0;
        private _rotateVelocity: number = 0;
        private _scaleOffset: number = 0;
        private _scaleVelocity: number = 0;
        private _lastReset: boolean = false;
        private _by: number = 0;
        private _bx: number = 0;
        private _cx: number = 0;
        private _cy: number = 0;
        private _tx: number = 0;
        private _ty: number = 0;
        private PI2 = Transform.PI_D;
        private PI1_2 = 1 / this.PI2;
        protected _onClear(): void {
            super._onClear();

            this._constraintData = null as any;
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            if (this._constraintData !== null) {
                return;
            }
            this._constraintData = constraintData;
            this._armature = armature;
            this._target = this._armature.getBone(this._constraintData.target.name) as any;
            if(this._target) {
                this._target._physicsConstraint = this;
            }
            const physicsData = this._constraintData as PhysicsConstraintData;

            this._inertia = physicsData.inertia;
            this._strength = physicsData.strength;
            this._damping = physicsData.damping;
            this._mass = physicsData.mass;
            this._wind = physicsData.wind;
            this._gravity = physicsData.gravity;
            this._weight = physicsData.weight;

            this._fpsTime = 1 / physicsData.fps;
            this._massInverse = 1 / this._mass;
            this._dump = 1 - this._damping;
            this._reset = true;
        }

        private isNumberEqual(a: number, b: number, acc: number = 0.001): boolean {
            if (a + acc >= b && a - acc <= b) {
                return true;
            }
            return false;
        }

        public update(): void {
            if (this._sleeping) {
                return;
            }
            const physicsData = this._constraintData as PhysicsConstraintData;
            if(this._armature.clock) {
                const bone = this._target;
                const hasX = physicsData.x > 0;
                const hasY = physicsData.y > 0;
                const hasRotate = physicsData.rotate > 0 || physicsData.shearX > 0;
                const hasScaleX = physicsData.scaleX > 0;
                const boneLength = bone.boneData.length;
                if(this._reset) {
                    this.reset();
                    this._reset = false;
                    this._lastReset = true;
                }
                else {
                    
                    this._sleeping = true;
                    // 过去的时间，单位是秒
                    
                    const globalTime = this._armature.clock.time;
                    const delta = Math.max(globalTime - this._lastTime, 0);
                   
                    // 参与计算的时间，单位是秒
                    this._remaining += delta;
                    this._lastTime = globalTime;
                    // console.log('start bone.globalTransform.x', bone.globalTransform.x)
                    const bx = bone.global.x;
                    const by = bone.global.y;

                    if (this._lastReset) {
                        this._lastReset = false;
                        this._bx = bx;
                        this._by = by;
                    } else {
                        // console.log('physics update', delta, this._sleeping)
                        const armatureReferenceScale = 100;
                        const armatureScaleX = 1;
                        const armatureScaleY = 1;
                        const armatureYDown = DragonBones.yDown;
                        let remaining = this._remaining;
                        let armatureScale = armatureReferenceScale;
                        let damping = -1;
                        let qx = physicsData.limit * delta;
                        let qy = qx * Math.abs(armatureScaleX);
                        qx *= Math.abs(armatureScaleY);
                        if (hasX || hasY) {
                            if (hasX) {
                                // 在惯性下，偏移会继续增加一点，这个增加的值是上一帧的偏移和这一帧的偏移的差值
                                const u = (this._bx - bx) * this._inertia;
                                // 惯性有个最大值
                                this._xOffset += u > qx ? qx : u < -qx ? -qx : u;
                                // 每次迭代只和上一帧的偏移有关
                                this._bx = bx;
                            }
                            if (hasY) {
                                const u = (this._by - by) * this._inertia;
                                this._yOffset += u > qy ? qy : u < -qy ? -qy : u;
                                this._by = by;
                            }
                            if (remaining >= this._fpsTime) {
                                damping = this._dump;
                                const w = this._wind * armatureScale * armatureScaleX;
                                const g = this._gravity * armatureScale * armatureScaleY;
                                do {
                                    //物理fps
                                    if (hasX) {
                                        // 力 = 弹簧力 + 风力
                                        const deltaV = (w - this._xOffset * this._strength) * this._massInverse * this._fpsTime;
                                        this._xVelocity += deltaV;
                                        const deltaOffset = this._xVelocity * this._fpsTime;
                                        this._xOffset += deltaOffset;
                                        this._xVelocity *= damping;
                                    }
                                    if (hasY) {
                                        this._yVelocity += (g + this._yOffset * this._strength) * this._massInverse * this._fpsTime;
                                        this._yOffset += this._yVelocity * this._fpsTime;
                                        this._yVelocity *= damping;
                                    }
                                    remaining -= this._fpsTime;
                                } while (remaining >= this._fpsTime);
                            }
                            if (hasX) {
                                // 偏移要乘以物理的权重，再乘以x的权重
                                let offsetX = this._xOffset * this._weight * physicsData.x;
                                if( Math.abs(offsetX) > physicsData.limit) {
                                    // 防止过大
                                    offsetX = offsetX > 0 ? physicsData.limit : -physicsData.limit;
                                }
                                bone.global.x += offsetX;
                                if(!this.isNumberEqual(offsetX, 0)) {
                                    this._sleeping = false;
                                }
                            }
                            if (hasY) {
                               
                                let offsetY = this._yOffset * this._weight * physicsData.y;
                                if( Math.abs(offsetY) > physicsData.limit) {
                                    // 防止过大
                                    offsetY = offsetY > 0 ? physicsData.limit : -physicsData.limit;
                                }
                                bone.global.y += offsetY;
                                if(!this.isNumberEqual(offsetY, 0)) {
                                    this._sleeping = false;
                                }
                            }
                        }
                        if (hasRotate || hasScaleX) {
                            const globalMatrix = bone.globalTransformMatrix;
                            let ca = Math.atan2(globalMatrix.c, globalMatrix.a);
                            let c = 0;
                            let s = 0;
                            let mr = 0;
                            let dx = this._cx - bone.global.x;
                            let dy = this._cy - bone.global.y;
                            if (dx > qx)
                                dx = qx;
                            else if (dx < -qx) //
                                dx = -qx;
                            if (dy > qy)
                                dy = qy;
                            else if (dy < -qy) //
                                dy = -qy;
                            if (hasRotate) {
                                mr = (physicsData.rotate + physicsData.shearX) * this._weight;
                                let r = Math.atan2(dy + this._ty, dx + this._tx) - ca - this._rotateOffset * mr;
                                // r 限制在 -pi到pi之间；
                                r = (r - Math.ceil(r * this.PI1_2 - 0.5) * this.PI2); 
                                const inertiaRotateOffset = r * this._inertia;
                                if(!this.isNumberEqual(inertiaRotateOffset, 0, 0.0001)) {
                                    this._sleeping = false;
                                }
                                // 旋转的偏移收到惯性的影响
                                this._rotateOffset += inertiaRotateOffset;
                                r = this._rotateOffset * mr + ca;
                                c = Math.cos(r);
                                s = Math.sin(r);
                                if (hasScaleX) {
                                    r = boneLength * bone.global.scaleX;
                                    if (r > 0) {
                                        this._scaleOffset += (dx * c + dy * s) * this._inertia / r;
                                    }
                                }
                            } else {
                                c = Math.cos(ca);
                                s = Math.sin(ca);
                                const r = boneLength * bone.global.scaleX;
                                if (r > 0) {
                                    this._scaleOffset += (dx * c + dy * s) * this._inertia / r;
                                }
                            }
                            remaining = this._remaining;
                            if (remaining >= this._fpsTime) {
                                if (damping == -1)  {
                                    damping = this._dump;
                                }
                                const mass = this._massInverse * this._fpsTime;
                                const strength = this._strength;
                                const wind = this._wind;
                                const gravity = (armatureYDown ? this._gravity : -this._gravity);
                                const boneLen = boneLength / armatureScale;
                                while (true) {
                                    remaining -= this._fpsTime;
                                    if (hasScaleX) {
                                        this._scaleVelocity += (wind * c - gravity * s - this._scaleOffset * strength) * mass;
                                        this._scaleOffset += this._scaleVelocity * this._fpsTime;
                                        this._scaleVelocity *= damping;
                                    }
                                    if (hasRotate) {
                                        this._rotateVelocity -= ((wind * s + gravity * c) * boneLen + this._rotateOffset * strength) * mass;
                                        // 旋转的偏移受到力作用
                                        this._rotateOffset += this._rotateVelocity * this._fpsTime;
                                        if(Math.abs(this._rotateOffset) > this.PI2) {
                                            // 旋转的偏移限制在 -2pi到2pi之间；
                                            this._rotateOffset = this._rotateOffset > 0 ? this.PI2 : -this.PI2;
                                        }
                                        if(!this.isNumberEqual(this._rotateVelocity, 0, 0.0001)) {
                                            this._sleeping = false;
                                        }
                                        this._rotateVelocity *= damping;
                                        if (remaining < this._fpsTime) {
                                            break;
                                        }
                                        const r = this._rotateOffset * mr + ca;
                                        c = Math.cos(r);
                                        s = Math.sin(r);
                                    } else if (remaining < this._fpsTime) //
                                        break;
                                }
                            }
                        }
                        this._remaining = remaining;
                    }
                    this._cx = bone.global.x;
                    this._cy = bone.global.y;
                }

                const globalMatrix = this._target.globalTransformMatrix;
                if (hasRotate) {
                    let o = this._rotateOffset * this._weight, s = 0, c = 0, a = 0;
                    if (physicsData.shearX > 0) {
                        let r = 0;
                        if (physicsData.rotate > 0) {
                            r = o * physicsData.rotate;
                            s = Math.sin(r);
                            c = Math.cos(r);
                            a = globalMatrix.b;
                            globalMatrix.b = c * a - s * globalMatrix.d;
                            globalMatrix.d = s * a + c * globalMatrix.d;
                        }
                        r += o * physicsData.shearX;
                        s = Math.sin(r);
                        c = Math.cos(r);
                        a = globalMatrix.a;
                        globalMatrix.a = c * a - s * globalMatrix.c;
                        globalMatrix.c = s * a + c * globalMatrix.c;
                    } else {
                        o *= physicsData.rotate;
                        s = Math.sin(o);
                        c = Math.cos(o);
                        a = globalMatrix.a;
                        globalMatrix.a = c * a - s * globalMatrix.c;
                        globalMatrix.c = s * a + c * globalMatrix.c;
                        a = globalMatrix.b;
                        globalMatrix.b = c * a - s * globalMatrix.d;
                        globalMatrix.d = s * a + c * globalMatrix.d;
                    }
                }
                if (hasScaleX) {
                    const s = 1 + this._scaleOffset * this._weight * physicsData.scaleX;
                    globalMatrix.a *= s;
                    globalMatrix.c *= s;
                }
                this._tx = boneLength * globalMatrix.a;
                this._ty = boneLength * globalMatrix.c;
                globalMatrix.tx = bone.global.x;
                globalMatrix.ty = bone.global.y;

                const oldRotation = bone.global.rotation;
                const oldSkew = bone.global.skew;

                bone.global.fromMatrix(globalMatrix);
                if(!this.isNumberEqual(oldRotation, bone.global.rotation) 
                || (!this.isNumberEqual(oldSkew, bone.global.skew))) {
                    this._sleeping = false;
                }
            }
        }
        private reset() {
            this._remaining = 0;
            this._lastTime = this._armature.clock ? this._armature.clock.time: 0;
            this._xOffset = 0;
            this._xVelocity = 0;
            this._yOffset = 0;
            this._yVelocity = 0;
            this._rotateOffset = 0;
            this._rotateVelocity = 0;
            this._scaleOffset = 0;
            this._scaleVelocity = 0;
        }

        public invalidUpdate(): void {
            if (this._root) {
                this._root.invalidUpdate();
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
        public rotateWeight: number;
        public xWeight: number;
        public yWeight: number;

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
            this.rotateWeight = 1.0;
            this.xWeight = 1.0;
            this.yWeight = 1.0;

            this._pathSlot = null as any;
            this._bones.length = 0;

            this._spaces.length = 0;
            this._positions.length = 0;
            this._curves.length = 0;
            this._boneLengths.length = 0;

            this._pathGlobalVertices.length = 0;
        }

        protected _updatePathVertices(verticesData: GeometryData, displayFrame: DisplayFrame | null): void {
            //计算曲线的节点数据
            const armature = this._armature;
            const dragonBonesData = armature.armatureData.parent;
            const scale = armature.armatureData.scale;
            const intArray = dragonBonesData.intArray;
            const floatArray = dragonBonesData.floatArray;

            const pathOffset = verticesData.offset;
            const pathVertexCount = intArray[pathOffset + BinaryOffset.GeometryVertexCount];
            const pathVertexOffset = intArray[pathOffset + BinaryOffset.GeometryFloatOffset];

            this._pathGlobalVertices.length = pathVertexCount * 2;

            const weightData = verticesData.weight;
            //没有骨骼约束我,那节点只受自己的Bone控制
            if (weightData === null) {
                const parentBone = this._pathSlot.parent;
                parentBone.updateByConstraint();

                const matrix = parentBone.globalTransformMatrix;
                if (displayFrame && displayFrame.deformVertices && displayFrame.deformVertices.length === pathVertexCount * 2) {
                    // 有path形变动画
                    const deformVertices = (displayFrame).deformVertices;
                    for (let i = 0, iV = pathVertexOffset; i < pathVertexCount * 2; i += 2) {
                        const vx = (floatArray[iV++] + deformVertices[i]) * scale;
                        const vy = (floatArray[iV++] + deformVertices[i+1]) * scale;
    
                        const x = matrix.a * vx + matrix.c * vy + matrix.tx;
                        const y = matrix.b * vx + matrix.d * vy + matrix.ty;
    
                        //
                        this._pathGlobalVertices[i] = x;
                        this._pathGlobalVertices[i + 1] = y;
                    }
                }
                else {
                    for (let i = 0, iV = pathVertexOffset; i < pathVertexCount * 2; i += 2) {
                        const vx = floatArray[iV++] * scale;
                        const vy = floatArray[iV++] * scale;
    
                        const x = matrix.a * vx + matrix.c * vy + matrix.tx;
                        const y = matrix.b * vx + matrix.d * vy + matrix.ty;
    
                        //
                        this._pathGlobalVertices[i] = x;
                        this._pathGlobalVertices[i + 1] = y;
                    }
                }
                
                return;
            }

            // TODO: path 可以被骨骼绑定。有骨骼约束我,那我的节点受骨骼权重控制
            const bones = this._pathSlot._geometryBones;
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
            const vertexCount = intArray[pathDisplayDta.geometry.offset + BinaryOffset.GeometryVertexCount];

            const positions = this._positions;
            const spaces = this._spaces;
            const isClosed = pathDisplayDta.closed;
            const curveVertices = Array<number>();
            let verticesLength = vertexCount * 2;
            let curveCount = verticesLength / 6;
            let preCurve = -1;
            let position = this.position;

            positions.length = spaceCount * 3 + 2;
            // 最后一个就是整个曲线的长度
            let pathLength = pathDisplayDta.curveLengths[pathDisplayDta.curveLengths.length - 1]
            //不需要匀速运动，效率高些
            if (!pathDisplayDta.constantSpeed) {
                const lengths = pathDisplayDta.curveLengths;
                curveCount -= isClosed ? 1 : 1;

                if (percentPosition) {
                    position *= pathLength;
                }

                if (percentSpacing) {
                    for (let i = 0; i < spaceCount; i++) {
                        spaces[i] *= pathLength;
                    }
                }

                curveVertices.length = 10;
                for (let i = 0, o = 0, curve = 0; i < spaceCount; i++, o += 3) {
                    const space = spaces[i];
                    position += space;
                    let percent = 0.0;

                    if (isClosed) {
                        position %= pathLength;
                        if (position < 0) {
                            position += pathLength;
                        }
                        curve = 0;
                    }
                    if (position < 0) {
                        percent = position / pathLength;
                        curve = 0;
                    }
                    else if (position > pathLength) {
                        percent = (position) / pathLength;
                        curve = curveCount - 1;
                    }
                    else {
                        for (; ; curve++) {
                            const len = lengths[curve];
                            if (position > len) {
                                continue;
                            }
                            if (curve === 0) {
                                percent = position / len;
                            }
                            else {
                                const preLen = lengths[curve - 1];
                                percent = (position - preLen) / (len - preLen);
                            }
                            break;
                        }
                    }
                    if (curve !== preCurve) {
                        preCurve = curve;
                        if (isClosed && curve === curveCount) {
                            //计算是哪段曲线
                            this._computeVertices(verticesLength - 4, 4, 0, curveVertices);
                            this._computeVertices(0, 10, 4, curveVertices);
                        }
                        else {
                            this._computeVertices(curve * 6 + 2, 10, 0, curveVertices);
                        }
                    }
                    // 计算曲线上点的位置和斜率
                    
                    this.addCurvePosition2(percent, curveVertices, positions, o, tangents, pathLength);
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

            for (let i = 0, w = 2; i < curveCount; i++, w += 6) {
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
            for (let i = 0, o = 0, curve = 0, segment = 0; i < spaceCount; i++, o += 3) {
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

        private addCurvePosition2(t: number, vertices: number[], out: Array<number>, offset: number, tangents: boolean, totalLength: number) {
            if(vertices.length !== 10) {
                out[offset] = 0;
                out[offset + 1] = 0;
                out[offset + 2] = 0;
                return;
            }
            const x1 =  vertices[0];
            const y1 =  vertices[1];
            const cx1 = vertices[2];
            const cy1 = vertices[3];
            const cx2 = vertices[4];
            const cy2 = vertices[5];
            const  x2 = vertices[6];
            const  y2 = vertices[7];
            const cx3 = vertices[8];
            const cy3 = vertices[9];

            if (t < 0) {
                const dydt = cy1 - y1;
                const dxdt = cx1 - x1;
                const angle = Math.atan2(dydt, dxdt);
                const length = totalLength * t;
                out[offset] = x1 + length * Math.cos(angle);
                out[offset + 1] = y1 + length * Math.sin(angle);
                out[offset + 2] = angle;
                return;
            }
            if (t > 1) {
                const dydt = cy3 - y2;
                const dxdt = cx3 - x2;
                const angle = Math.atan2(dydt, dxdt);
                const length = totalLength * (1 - t);
                out[offset] = x2 + length * Math.cos(angle);
                out[offset + 1] = y2 + length * Math.sin(angle);
                out[offset + 2] = angle;
            }
            if (t === 0) {
                out[offset] = x1;
                out[offset + 1] = y1;
                const dydt = cy1 - y1;
                const dxdt = cx1 - x1;
                out[offset + 2] = Math.atan2(dydt, dxdt);
                return;
            }

            if (t === 1) {
                out[offset] = x2;
                out[offset + 1] = y2;
                const dydt = cy3 - y2;
                const dxdt = cx3 - x2;
                out[offset + 2] = Math.atan2(dydt, dxdt);
                return;
            }
            const t1 = 1 - t;
            const t1Sq = t1 * t1;
            const t1Cu = t1Sq * t1;
            const tSq = t * t;
            const tCu = tSq * t;
        
            // 计算坐标
            const x = t1Cu * x1 + 3 * t1Sq * t * cx1 + 3 * t1 * tSq * cx2 + tCu * x2;
            const y = t1Cu * y1 + 3 * t1Sq * t *cy1 + 3 * t1 * tSq * cy2 + tCu * y2;
        
            out[offset] = x;
            out[offset + 1] = y;
            if (tangents) {
                // 计算导数（切线方向）
                const dxdt = 3 * (
                    (cx1 - x1) * t1Sq +
                    2 * (cx2 - cx1) * t1 * t +
                    (x2 - cx2) * tSq
                );

                const dydt = 3 * (
                    (cy1 - y1) * t1Sq +
                    2 * (cy2 -cy1) * t1 * t +
                    (y2 - cy2) * tSq
                );

                // 处理斜率计算
                out[offset + 2] = Math.atan2(dydt, dxdt);
            }
            else {
                out[offset + 2] = 0;
            }
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            this._constraintData = constraintData;
            this._armature = armature;

            let data = constraintData as PathConstraintData;

            this.pathOffset = data.pathDisplayData.geometry.offset;

            //
            this.position = data.position;
            this.spacing = data.spacing;
            this.rotateOffset = data.rotateOffset;
            this.rotateWeight = data.rotateWeight;
            this.xWeight = data.xWeight;
            this.yWeight = data.yWeight;

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
                pathSlot._geometryData === null ||
                pathSlot._geometryData.offset !== this.pathOffset
            ) {
                return;
            }

            const constraintData = this._constraintData as PathConstraintData;

            //

            //曲线节点数据改变:父亲bone改变，权重bones改变，变形顶点改变
            let isPathVerticeDirty = false;
            if (this._root._childrenTransformDirty) {
                this._updatePathVertices(pathSlot._geometryData, pathSlot._displayFrame);
                isPathVerticeDirty = true;
            }
            else if (pathSlot._verticesDirty || pathSlot._isBonesUpdate()) {
                this._updatePathVertices(pathSlot._geometryData, pathSlot._displayFrame);
                pathSlot._verticesDirty = false;
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
            this._computeBezierCurve(((pathSlot._displayFrame as DisplayFrame).rawDisplayData as PathDisplayData), spacesCount, isTangentMode, positionMode === PositionMode.Percent, spacingMode === SpacingMode.Percent);

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
            const rotateWeight = this.rotateWeight;
            const xWeight = this.xWeight;
            const yWeight = this.yWeight;
            for (let i = 0, p = 3; i < boneCount; i++, p += 3) {
                let bone = bones[i];
                // TODO: 优化,这里可能会计算多遍
                bone.forceUpdateTransform();
                bone.updateByConstraint();
                let matrix = bone.globalTransformMatrix;
                matrix.tx += (boneX - matrix.tx) * xWeight;
                matrix.ty += (boneY - matrix.ty) * yWeight;

                const x = positions[p], y = positions[p + 1];
                const dx = x - boneX, dy = y - boneY;
                if (isChainScaleMode) {
                    const lenght = this._boneLengths[i];

                    const s = (Math.sqrt(dx * dx + dy * dy) / lenght - 1) * rotateWeight + 1;
                    matrix.a *= s;
                    matrix.b *= s;
                }

                boneX = x;
                boneY = y;
                if (rotateWeight > 0) {
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
                        boneX += (length * (cos * a - sin * b) - dx) * rotateWeight;
                        boneY += (length * (sin * a + cos * b) - dy) * rotateWeight;
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

                    r *= rotateWeight;

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