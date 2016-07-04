namespace dragonBones {
    /**
     * 
     */
    export abstract class TransformObject extends BaseObject {
        /**
         * An object that can contain any user extra data.
         */
        public userData: any;
        /**
         * 
         */
        public name: string;
        /**
         * Global matrix.
         */
        public globalTransformMatrix: Matrix;
        /**
         * Global pose.
         */
        public global: Transform = new Transform();
        /**
         * Bind pose.
         */
        public origin: Transform = new Transform();
        /**
         * Offset pose.
         */
        public offset: Transform = new Transform();
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
        protected _globalTransformMatrix: Matrix = new Matrix();
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            this.userData = null;
            this.name = null;
            this.globalTransformMatrix = this._globalTransformMatrix;
            this.global.identity();
            this.origin.identity();
            this.offset.identity();

            this._armature = null;
            this._parent = null;
            this._globalTransformMatrix.identity();
        }
        /**
         * @private
         */
        public _setArmature(value: Armature): void {
            this._armature = value;
        }
        /**
         * @private
         */
        public _setParent(value: Bone): void {
            this._parent = value;
        }
        /**
         * 
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * 
         */
        public get parent(): Bone {
            return this._parent;
        }
    }
}