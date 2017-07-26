namespace dragonBones {
    /**
     * @private
     * @internal
     */
    export abstract class Constraint extends BaseObject {
        protected static readonly _helpMatrix: Matrix = new Matrix();
        protected static readonly _helpTransform: Transform = new Transform();
        protected static readonly _helpPoint: Point = new Point();

        public target: Bone;
        public bone: Bone;
        public root: Bone | null;

        protected _onClear(): void {
            this.target = null as any; //
            this.bone = null as any; //
            this.root = null; //
        }

        public abstract update(): void;
    }
    /**
     * @private
     * @internal
     */
    export class IKConstraint extends Constraint {
        public static toString(): string {
            return "[class dragonBones.IKConstraint]";
        }

        public bendPositive: boolean;
        public scaleEnabled: boolean; // TODO
        public weight: number;

        protected _onClear(): void {
            super._onClear();

            this.bendPositive = false;
            this.scaleEnabled = false;
            this.weight = 1.0;
        }

        private _computeA(): void {
            const ikGlobal = this.target.global;
            const global = this.bone.global;
            const globalTransformMatrix = this.bone.globalTransformMatrix;
            // const boneLength = this.bone.boneData.length;
            // const x = globalTransformMatrix.a * boneLength; 

            let ikRadian = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                ikRadian += Math.PI;
            }

            global.rotation += (ikRadian - global.rotation) * this.weight;
            global.toMatrix(globalTransformMatrix);
        }

        private _computeB(): void {
            const boneLength = this.bone.boneData.length;
            const parent = this.root as Bone;
            const ikGlobal = this.target.global;
            const parentGlobal = parent.global;
            const global = this.bone.global;
            const globalTransformMatrix = this.bone.globalTransformMatrix;

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

                if (isPPR !== this.bendPositive) {
                    global.x = hX - rX;
                    global.y = hY - rY;
                }
                else {
                    global.x = hX + rX;
                    global.y = hY + rY;
                }

                ikRadianA = Math.atan2(global.y - parentGlobal.y, global.x - parentGlobal.x);
            }

            let dR = (ikRadianA - rawRadianA) * this.weight;
            parentGlobal.rotation += dR;
            parentGlobal.toMatrix(parent.globalTransformMatrix);

            const parentRadian = rawRadianA + dR;
            global.x = parentGlobal.x + Math.cos(parentRadian) * lP;
            global.y = parentGlobal.y + Math.sin(parentRadian) * lP;

            let ikRadianB = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                ikRadianB += Math.PI;
            }

            dR = (ikRadianB - global.rotation) * this.weight;
            global.rotation += dR;
            global.toMatrix(globalTransformMatrix);
        }

        public update(): void {
            if (this.root === null) {
                this.bone.updateByConstraint();
                this._computeA();
            }
            else {
                this.root.updateByConstraint();
                this.bone.updateByConstraint();
                this._computeB();
            }
        }
    }
}