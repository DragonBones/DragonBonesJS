namespace dragonBones {
	/**
	 * 
	 */
    export class ArmatureData extends BaseObject {
        private static _onSortSlots(a: SlotData, b: SlotData): number {
            return a.zOrder > b.zOrder ? 1 : -1;
        }
        public frameRate: number;
		/**
		 * @private
		 */
        public cacheFrameRate: number;
        public type: ArmatureType;
        public name: string;

        public bones: Map<BoneData> = {};
        public slots: Map<SlotData> = {};
        public skins: Map<SkinData> = {};
        public animations: Map<AnimationData> = {};

        private _boneDirty: boolean;
        private _slotDirty: boolean;
        private _defaultSkin: SkinData;
        private _defaultAnimation: AnimationData;
        private _sortedBones: Array<BoneData> = [];
        private _sortedSlots: Array<SlotData> = [];
        private _bonesChildren: Map<Array<BoneData>> = {};
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
            this.frameRate = 0;
            this.cacheFrameRate = 0;
            this.type = ArmatureType.Armature;
            this.name = null;

            for (let i in this.bones) {
                this.bones[i].returnToPool();
                delete this.bones[i];
            }

            for (let i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }

            for (let i in this.skins) {
                this.skins[i].returnToPool();
            }

            for (let i in this.animations) {
                this.animations[i].returnToPool();
            }

            this._boneDirty = false;
            this._slotDirty = false;
            this._defaultSkin = null;
            this._defaultAnimation = null;

            if (this._sortedBones.length) {
                this._sortedBones.length = 0;
            }

            if (this._sortedSlots.length) {
                this._sortedSlots.length = 0;
            }

            for (let i in this._bonesChildren) {
                delete this._bonesChildren[i];
            }
        }

        private _sortBones(): void {
            const total = this._sortedBones.length;
            if (!total) {
                return;
            }

            const sortHelper = this._sortedBones.concat();
            let index = 0;
            let count = 0;

            this._sortedBones.length = 0;

            while (count < total) {
                const bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }

                if (this._sortedBones.indexOf(bone) >= 0) {
                    continue;
                }

                if (bone.parent && this._sortedBones.indexOf(bone.parent) < 0) {
                    continue;
                }

                if (bone.ik && this._sortedBones.indexOf(bone.ik) < 0) {
                    continue;
                }

                if (bone.ik && bone.chain > 0 && bone.chainIndex == bone.chain) {
                    this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
                } else {
                    this._sortedBones.push(bone);
                }
                
                count++;
            }
        }

        private _sortSlots(): void {
            this._sortedSlots.sort(ArmatureData._onSortSlots);
        }
		/**
		 * @private
		 */
        public cacheFrames(value: number): void {
            if (this.cacheFrameRate == value) {
                return;
            }

            this.cacheFrameRate = value;

            const frameScale = this.cacheFrameRate / this.frameRate;
            for (let i in this.animations) {
                this.animations[i].cacheFrames(frameScale);
            }
        }
        /**
         * @private
         */
        public addBone(value: BoneData, parentName: string): void {
            if (value && value.name && !this.bones[value.name]) {
                if (parentName) {
                    const parent = this.getBone(parentName);
                    if (parent) {
                        value.parent = parent;
                    } else {
                        (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                    }
                }

                const children = this._bonesChildren[value.name];
                if (children) {
                    for (let i in children) {
                        children[i].parent = value;
                    }

                    delete this._bonesChildren[value.name];
                }

                this.bones[value.name] = value;
                this._sortedBones.push(value);
                this._boneDirty = true;
            } else {
                throw new Error();
            }
        }
        /**
         * @private
         */
        public addSlot(value: SlotData): void {
            if (value && value.name && !this.slots[value.name]) {
                this.slots[value.name] = value;
                this._sortedSlots.push(value);
                this._slotDirty = true;
            } else {
                throw new Error();
            }
        }
        /**
         * @private
         */
        public addSkin(value: SkinData): void {
            if (value && value.name && !this.skins[value.name]) {
                this.skins[value.name] = value;
                if (!this._defaultSkin) {
                    this._defaultSkin = value;
                }
            } else {
                throw new Error();
            }
        }
        /**
         * @private
         */
        public addAnimation(value: AnimationData): void {
            if (value && value.name && !this.animations[value.name]) {
                this.animations[value.name] = value;
                if (!this._defaultAnimation) {
                    this._defaultAnimation = value;
                }
            } else {
                throw new Error();
            }
        }

        public getBone(name: string): BoneData {
            return this.bones[name];
        }

        public getSlot(name: string): SlotData {
            return this.slots[name];
        }

        public getSkin(name: string): SkinData {
            return name ? this.skins[name] : this._defaultSkin;
        }

        public getAnimation(name: string): AnimationData {
            return name ? this.animations[name] : this._defaultAnimation;
        }

        public get sortedBones(): Array<BoneData> {
            if (this._boneDirty) {
                this._boneDirty = false;
                this._sortBones();
            }

            return this._sortedBones;
        }

        public get sortedSlots(): Array<SlotData> {
            if (this._slotDirty) {
                this._slotDirty = false;
                this._sortSlots();
            }

            return this._sortedSlots;
        }

        public get defaultSkin(): SkinData {
            return this._defaultSkin;
        }

        public get defaultAnimation(): AnimationData {
            return this._defaultAnimation;
        }
    }
	/**
	 * 
	 */
    export class BoneData extends BaseObject {
        /**
         * @private
         */
        public inheritTranslation: boolean;
        /**
         * @private
         */
        public inheritRotation: boolean;
        /**
         * @private
         */
        public inheritScale: boolean;
        /**
         * @private
         */
        public bendPositive: boolean;
        /**
         * @private
         */
        public chain: number;
        /**
         * @private
         */
        public chainIndex: number;
        /**
         * @private
         */
        public weight: number;
        /**
         * @private
         */
        public length: number;
        public name: string;
        public parent: BoneData;
        /**
         * @private
         */
        public ik: BoneData;
        /**
         * @private
         */
        public transform: Transform = new Transform();
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
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.bendPositive = false;
            this.chain = 0;
            this.chainIndex = 0;
            this.weight = 0;
            this.length = 0;
            this.name = null;
            this.parent = null;
            this.ik = null;
            this.transform.identity();
        }
    }
	/**
	 * 
	 */
    export class SlotData extends BaseObject {
		/**
		 * @private
		 */
        public static DEFAULT_COLOR: ColorTransform = new ColorTransform();
		/**
		 * @private
		 */
        public static generateColor(): ColorTransform {
            return new ColorTransform();
        }

        /**
         * @private
         */
        public displayIndex: number;
        /**
         * @private
         */
        public zOrder: number;
        /**
         * @private
         */
        public blendMode: BlendMode;
        public name: string;
        public parent: BoneData;
        /**
         * @private
         */
        public color: ColorTransform;
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
            this.displayIndex = 0;
            this.zOrder = 0;
            this.blendMode = BlendMode.Normal;
            this.name = null;
            this.parent = null;
            this.color = null;
        }
    }
	/**
	 * 
	 */
    export class SkinData extends BaseObject {
        public name: string = null;
        /**
         * @private
         */
        public slots: Map<SlotDisplayDataSet> = {};
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
            this.name = null;

            for (let i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }
        }
		/**
		 * @private
		 */
        public addSlot(value: SlotDisplayDataSet): void {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            } else {
                //throw new Error();
            }
        }
		/**
		 * @private
		 */
        public getSlot(name: string): SlotDisplayDataSet {
            return this.slots[name];
        }
    }
	/**
	 * @private
	 */
    export class SlotDisplayDataSet extends BaseObject {
        public slot: SlotData;
        public displays: Array<DisplayData> = [];

        public constructor() {
            super();
        }
		/**
		 * @inheritDoc
		 */
        protected _onClear(): void {
            this.slot = null;

            if (this.displays.length) {
                for (let i in this.displays) {
                    this.displays[i].returnToPool();
                }

                this.displays.length = 0;
            }
        }
    }
	/**
	 * @private
	 */
    export class DisplayData extends BaseObject {
        public isRelativePivot: boolean;
        public type: DisplayType;
        public name: string;
        public textureData: TextureData;
        public armatureData: ArmatureData;
        public meshData: MeshData;
        public pivot: Point = new Point();
        public transform: Transform = new Transform();

        public constructor() {
            super();
        }
		/**
		 * @inheritDoc
		 */
        protected _onClear(): void {
            this.isRelativePivot = false;
            this.type = DisplayType.Image;
            this.name = null;
            this.textureData = null;
            this.armatureData = null;

            if (this.meshData) {
                this.meshData.returnToPool();
                this.meshData = null;
            }

            this.pivot.clear();
            this.transform.identity();
        }
    }
	/**
	 * @private
	 */
    export class MeshData extends BaseObject {
        public skinned: boolean;
        public slotPose: Matrix = new Matrix();

        public uvs: Array<number> = []; // vertices * 2
        public vertices: Array<number> = []; // vertices * 2
        public vertexIndices: Array<number> = []; // triangles * 3

        public boneIndices: Array<Array<number>> = []; // vertices bones
        public weights: Array<Array<number>> = []; // vertices bones
        public boneVertices: Array<Array<number>> = []; // vertices bones * 2

        public bones: Array<BoneData> = []; // bones
        public inverseBindPose: Array<Matrix> = []; // bones

        public constructor() {
            super();
        }
		/**
		 * @inheritDoc
		 */
        protected _onClear(): void {
            this.skinned = false;
            this.slotPose.identity();

            if (this.uvs.length) {
                this.uvs.length = 0;
            }

            if (this.vertices.length) {
                this.vertices.length = 0;
            }

            if (this.vertexIndices.length) {
                this.vertexIndices.length = 0;
            }

            if (this.boneIndices.length) {
                this.boneIndices.length = 0;
            }

            if (this.weights.length) {
                this.weights.length = 0;
            }

            if (this.boneVertices.length) {
                this.boneVertices.length = 0;
            }

            if (this.bones.length) {
                this.bones.length = 0;
            }

            if (this.inverseBindPose.length) {
                this.inverseBindPose.length = 0;
            }
        }
    }
}