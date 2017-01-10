namespace dragonBones {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    export abstract class TransformObject extends BaseObject {
        /**
         * @language zh_CN
         * 对象的名称。
         * @readOnly
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的矩阵。
         * @readOnly
         * @version DragonBones 3.0
         */
        public globalTransformMatrix: Matrix = new Matrix();
        /**
         * @language zh_CN
         * 相对于骨架坐标系的变换。
         * @see dragonBones.Transform
         * @readOnly
         * @version DragonBones 3.0
         */
        public global: Transform = new Transform();
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        public offset: Transform = new Transform();
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的绑定变换。
         * @readOnly
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        public origin: Transform;
        /**
         * @language zh_CN
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         */
        public userData: any;
        /**
         * @private
         */
        public _armature: Armature;
        /**
         * @private
         */
        public _parent: Bone;
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _onClear(): void {
            this.name = null;
            this.global.identity();
            this.offset.identity();
            this.globalTransformMatrix.identity();
            this.origin = null;
            this.userData = null;

            this._armature = null;
            this._parent = null;
        }
        /**
         * @internal
         * @private
         */
        public _setArmature(value: Armature): void {
            this._armature = value;
        }
        /**
         * @internal
         * @private
         */
        public _setParent(value: Bone): void {
            this._parent = value;
        }
        /**
         * @language zh_CN
         * 所属的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * @language zh_CN
         * 所属的父骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        public get parent(): Bone {
            return this._parent;
        }
    }
}