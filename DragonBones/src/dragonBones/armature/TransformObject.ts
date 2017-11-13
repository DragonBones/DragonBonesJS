namespace dragonBones {
    /**
     * The base class of the transform object.
     * @see dragonBones.Transform
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * 变换对象的基类。
     * @see dragonBones.Transform
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export abstract class TransformObject extends BaseObject {
        /**
         * @private
         */
        protected static readonly _helpMatrix: Matrix = new Matrix();
        /**
         * @private
         */
        protected static readonly _helpTransform: Transform = new Transform();
        /**
         * @private
         */
        protected static readonly _helpPoint: Point = new Point();
        /**
         * A matrix relative to the armature coordinate system.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 相对于骨架坐标系的矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly globalTransformMatrix: Matrix = new Matrix();
        /**
         * A transform relative to the armature coordinate system.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 相对于骨架坐标系的变换。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly global: Transform = new Transform();
        /**
         * The offset transform relative to the armature or the parent bone coordinate system.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly offset: Transform = new Transform();
        /**
         * @private
         */
        public origin: Transform;
        /**
         * @private
         */
        public userData: any;
        /**
         * @private
         */
        protected _globalDirty: boolean;
        /**
         * @internal
         * @private
         */
        public _armature: Armature;
        /**
         * @internal
         * @private
         */
        public _parent: Bone;
        /**
         * @private
         */
        protected _onClear(): void {
            this.globalTransformMatrix.identity();
            this.global.identity();
            this.offset.identity();
            this.origin = null as any; //
            this.userData = null;

            this._globalDirty = false;
            this._armature = null as any; //
            this._parent = null as any; //
        }
        /**
         * @internal
         * @private
         */
        public _setArmature(value: Armature | null): void {
            this._armature = value as any;
        }
        /**
         * @internal
         * @private
         */
        public _setParent(value: Bone | null): void {
            this._parent = value as any;
        }
        /**
         * @private
         */
        public updateGlobalTransform(): void {
            if (this._globalDirty) {
                this._globalDirty = false;
                this.global.fromMatrix(this.globalTransformMatrix);
            }
        }
        /**
         * The armature to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 所属的骨架。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * The parent bone to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 所属的父骨骼。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get parent(): Bone {
            return this._parent;
        }
    }
}