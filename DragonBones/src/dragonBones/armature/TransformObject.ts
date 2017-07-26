namespace dragonBones {
    /**
     * 基础变换对象。
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
         * 对象的名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * 相对于骨架坐标系的矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly globalTransformMatrix: Matrix = new Matrix();
        /**
         * 相对于骨架坐标系的变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly global: Transform = new Transform();
        /**
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly offset: Transform = new Transform();
        /**
         * 相对于骨架或父骨骼坐标系的绑定变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         * @readOnly
         * @language zh_CN
         */
        public origin: Transform;
        /**
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public userData: any;
        /**
         * @private
         */
        protected _globalDirty: boolean;
        /**
         * @private
         */
        public _armature: Armature;
        /**
         * @private
         */
        public _parent: Bone;
        /**
         * @private
         */
        protected _onClear(): void {
            this.name = "";
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
         * 所属的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * 所属的父骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get parent(): Bone {
            return this._parent;
        }
    }
}