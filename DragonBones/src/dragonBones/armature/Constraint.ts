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
         * For timeline state.
         * @internal
         */
        public _constraintData: ConstraintData;
        protected _armature: Armature;
        /**
         * For sort bones.
         * @internal
         */
        public _target: Bone;
        /**
         * For sort bones.
         * @internal
         */
        public _bone: Bone;
        protected _root: Bone | null;

        protected _onClear(): void {
            this._armature = null as any; //
            this._target = null as any; //
            this._bone = null as any; //
            this._root = null;
        }

        public abstract init(data: ConstraintData, armature: Armature): void;
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
         * For timeline state.
         * @internal
         */
        public _bendPositive: boolean;
        /**
         * For timeline state.
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
            const global = this._bone.global;
            const globalTransformMatrix = this._bone.globalTransformMatrix;
            // const boneLength = this.bone.boneData.length;
            // const x = globalTransformMatrix.a * boneLength; 

            let ikRadian = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                ikRadian += Math.PI;
            }

            global.rotation += (ikRadian - global.rotation) * this._weight;
            global.toMatrix(globalTransformMatrix);
        }

        private _computeB(): void {
            // const boneLength = this._bone._boneData.length;
            // const parent = this._root as Bone;
            // const ikGlobal = this._target.global;
            // const parentGlobal = parent.global;
            // const global = this._bone.global;
            // const globalTransformMatrix = this._bone.globalTransformMatrix;

            // const x = globalTransformMatrix.a * boneLength;
            // const y = globalTransformMatrix.b * boneLength;

            // const lLL = x * x + y * y;
            // const lL = Math.sqrt(lLL);

            // let dX = global.x - parentGlobal.x;
            // let dY = global.y - parentGlobal.y;
            // const lPP = dX * dX + dY * dY;
            // const lP = Math.sqrt(lPP);
            // const rawRadian = global.rotation;
            // const rawParentRadian = parentGlobal.rotation;
            // const rawRadianA = Math.atan2(dY, dX);

            // dX = ikGlobal.x - parentGlobal.x;
            // dY = ikGlobal.y - parentGlobal.y;
            // const lTT = dX * dX + dY * dY;
            // const lT = Math.sqrt(lTT);

            // let radianA = 0.0;
            // if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
            //     radianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x);
            //     if (lL + lP <= lT) {
            //     }
            //     else if (lP < lL) {
            //         radianA += Math.PI;
            //     }
            // }
            // else {
            //     const h = (lPP - lLL + lTT) / (2.0 * lTT);
            //     const r = Math.sqrt(lPP - h * h * lTT) / lT;
            //     const hX = parentGlobal.x + (dX * h);
            //     const hY = parentGlobal.y + (dY * h);
            //     const rX = -dY * r;
            //     const rY = dX * r;

            //     let isPPR = false;
            //     if (parent._parent !== null) {
            //         const parentParentMatrix = parent._parent.globalTransformMatrix;
            //         isPPR = parentParentMatrix.a * parentParentMatrix.d - parentParentMatrix.b * parentParentMatrix.c < 0.0;
            //     }

            //     if (isPPR !== this._bendPositive) {
            //         global.x = hX - rX;
            //         global.y = hY - rY;
            //     }
            //     else {
            //         global.x = hX + rX;
            //         global.y = hY + rY;
            //     }

            //     radianA = Math.atan2(global.y - parentGlobal.y, global.x - parentGlobal.x);
            // }

            // const dR = Transform.normalizeRadian(radianA - rawRadianA);
            // parentGlobal.rotation = rawParentRadian + dR * this._weight;
            // parentGlobal.toMatrix(parent.globalTransformMatrix);
            // //
            // const currentRadianA = rawRadianA + dR * this._weight;
            // global.x = parentGlobal.x + Math.cos(currentRadianA) * lP;
            // global.y = parentGlobal.y + Math.sin(currentRadianA) * lP;
            // //
            // let radianB = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            // if (global.scaleX < 0.0) {
            //     radianB += Math.PI;
            // }

            // global.rotation = parentGlobal.rotation + Transform.normalizeRadian(radianB - parentGlobal.rotation - rawRadian + rawParentRadian) * this._weight;
            // global.toMatrix(globalTransformMatrix);

            const boneLength = this._bone.boneData.length;
            const parent = this._root as Bone;
            const ikGlobal = this._target.global;
            const parentGlobal = parent.global;
            const global = this._bone.global;
            const globalTransformMatrix = this._bone.globalTransformMatrix;

            const x = globalTransformMatrix.a * boneLength;
            const y = globalTransformMatrix.b * boneLength;

            const lLL = x * x + y * y;
            const lL = Math.sqrt(lLL);

            let dX = global.x - parentGlobal.x;
            let dY = global.y - parentGlobal.y;
            const lPP = dX * dX + dY * dY;
            const lP = Math.sqrt(lPP);
            const rawRadianA = Math.atan2(dY, dX);

            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            const lTT = dX * dX + dY * dY;
            const lT = Math.sqrt(lTT);

            let ikRadianA = 0.0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x);
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    ikRadianA += Math.PI;
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

                ikRadianA = Math.atan2(global.y - parentGlobal.y, global.x - parentGlobal.x);
            }

            let dR = (ikRadianA - rawRadianA) * this._weight;
            parentGlobal.rotation += dR;
            parentGlobal.toMatrix(parent.globalTransformMatrix);

            const parentRadian = rawRadianA + dR;
            global.x = parentGlobal.x + Math.cos(parentRadian) * lP;
            global.y = parentGlobal.y + Math.sin(parentRadian) * lP;

            let ikRadianB = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                ikRadianB += Math.PI;
            }

            dR = (ikRadianB - global.rotation) * this._weight;
            global.rotation += dR;
            global.toMatrix(globalTransformMatrix);
        }

        public init(constraintData: ConstraintData, armature: Armature): void {
            if (this._constraintData !== null) {
                return;
            }

            this._constraintData = constraintData;
            this._armature = armature;
            this._target = armature.getBone(this._constraintData.target.name) as any;
            this._bone = armature.getBone(this._constraintData.bone.name) as any;
            this._root = this._constraintData.root !== null ? armature.getBone(this._constraintData.root.name) : null;

            {
                const ikConstraintData = this._constraintData as IKConstraintData;
                //
                this._scaleEnabled = ikConstraintData.scaleEnabled;
                this._bendPositive = ikConstraintData.bendPositive;
                this._weight = ikConstraintData.weight;
            }

            this._bone._hasConstraint = true;
        }

        public update(): void {
            if (this._root === null) {
                this._bone.updateByConstraint();
                this._computeA();
            }
            else {
                this._root.updateByConstraint();
                this._bone.updateByConstraint();
                this._computeB();
            }
        }

        public invalidUpdate(): void {
            if (this._root === null) {
                this._bone.invalidUpdate();
            }
            else {
                this._root.invalidUpdate();
                this._bone.invalidUpdate();
            }
        }
    }
}