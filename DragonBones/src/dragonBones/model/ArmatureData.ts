namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    export class ArmatureData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.ArmatureData]";
        }
        private static _onSortSlots(a: SlotData, b: SlotData): number {
            return a.zOrder > b.zOrder ? 1 : -1;
        }
        /**
         * @private
         */
        public isRightTransform: boolean;
        /**
         * @language zh_CN
         * 动画帧率。
         * @version DragonBones 3.0
         */
        public frameRate: number;
        /**
         * @private
         */
        public type: ArmatureType;
        /**
         * @private
         */
        public cacheFrameRate: number;
        /**
         * @private
         */
        public scale: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @private
         */
        public aabb: Rectangle = new Rectangle();
        /**
         * @language zh_CN
         * 所有骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        public bones: Map<BoneData> = {};
        /**
         * @language zh_CN
         * 所有插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        public slots: Map<SlotData> = {};
        /**
         * @private
         */
        public skins: Map<SkinData> = {};
        /**
         * @language zh_CN
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public animations: Map<AnimationData> = {};
        /**
         * @private
         */
        public actions: Array<ActionData> = [];
        /**
         * @language zh_CN
         * 所属的龙骨数据。
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        public parent: DragonBonesData;
        /**
         * @private
         */
        public userData: CustomData;

        private _boneDirty: boolean;
        private _slotDirty: boolean;
        private _animationNames: Array<string> = [];
        private _sortedBones: Array<BoneData> = [];
        private _sortedSlots: Array<SlotData> = [];
        private _bonesChildren: Map<Array<BoneData>> = {};
        private _defaultSkin: SkinData;
        private _defaultAnimation: AnimationData;
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
            for (let k in this.bones) {
                this.bones[k].returnToPool();
                delete this.bones[k];
            }

            for (let k in this.slots) {
                this.slots[k].returnToPool();
                delete this.slots[k];
            }

            for (let k in this.skins) {
                this.skins[k].returnToPool();
                delete this.skins[k];
            }

            for (let k in this.animations) {
                this.animations[k].returnToPool();
                delete this.animations[k];
            }

            for (let i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }

            for (let k in this._bonesChildren) {
                delete this._bonesChildren[k];
            }

            if (this.userData) {
                this.userData.returnToPool();
            }

            this.isRightTransform = false;
            this.frameRate = 0;
            this.type = ArmatureType.None;
            this.cacheFrameRate = 0;
            this.scale = 1.0;
            this.name = null;
            this.aabb.clear();
            //this.bones.clear();
            //this.slots.clear();
            //this.skins.clear();
            //this.animations.clear();
            this.actions.length = 0;
            this.parent = null;
            this.userData = null;

            this._boneDirty = false;
            this._slotDirty = false;
            this._animationNames.length = 0;
            this._sortedBones.length = 0;
            this._sortedSlots.length = 0;
            this._defaultSkin = null;
            this._defaultAnimation = null;
        }

        private _sortBones(): void {
            const total = this._sortedBones.length;
            if (total < 1) {
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

                if (bone.ik && bone.chain > 0 && bone.chainIndex === bone.chain) {
                    this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
                }
                else {
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
        public cacheFrames(frameRate: number): void {
            if (this.cacheFrameRate > 0) {
                return;
            }

            this.cacheFrameRate = frameRate;

            for (let k in this.animations) {
                this.animations[k].cacheFrames(this.cacheFrameRate);
            }
        }
        /**
         * @private
         */
        public setCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset: number = -1): number {
            const dataArray = this.parent.cachedFrames;
            if (arrayOffset < 0) {
                arrayOffset = dataArray.length;
            }

            dataArray.length += 10;
            dataArray[arrayOffset] = globalTransformMatrix.a;
            dataArray[arrayOffset + 1] = globalTransformMatrix.b;
            dataArray[arrayOffset + 2] = globalTransformMatrix.c;
            dataArray[arrayOffset + 3] = globalTransformMatrix.d;
            dataArray[arrayOffset + 4] = globalTransformMatrix.tx;
            dataArray[arrayOffset + 5] = globalTransformMatrix.ty;
            dataArray[arrayOffset + 6] = transform.skewX;
            dataArray[arrayOffset + 7] = transform.skewY;
            dataArray[arrayOffset + 8] = transform.scaleX;
            dataArray[arrayOffset + 9] = transform.scaleY;

            return arrayOffset;
        }
        /**
         * @private
         */
        public getCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset: number): void {
            const dataArray = this.parent.cachedFrames;

            globalTransformMatrix.a = dataArray[arrayOffset];
            globalTransformMatrix.b = dataArray[arrayOffset + 1];
            globalTransformMatrix.c = dataArray[arrayOffset + 2];
            globalTransformMatrix.d = dataArray[arrayOffset + 3];
            globalTransformMatrix.tx = dataArray[arrayOffset + 4];
            globalTransformMatrix.ty = dataArray[arrayOffset + 5];
            transform.skewX = dataArray[arrayOffset + 6];
            transform.skewY = dataArray[arrayOffset + 7];
            transform.scaleX = dataArray[arrayOffset + 8];
            transform.scaleY = dataArray[arrayOffset + 9];
            transform.x = globalTransformMatrix.tx;
            transform.y = globalTransformMatrix.ty;
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
                    }
                    else {
                        (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                    }
                }

                const children = this._bonesChildren[value.name];
                if (children) {
                    for (let i = 0, l = children.length; i < l; ++i) {
                        children[i].parent = value;
                    }

                    delete this._bonesChildren[value.name];
                }

                this.bones[value.name] = value;
                this._sortedBones.push(value);

                this._boneDirty = true;
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
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
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
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
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @private
         */
        public addAnimation(value: AnimationData): void {
            if (value && value.name && !this.animations[value.name]) {
                this.animations[value.name] = value;
                this._animationNames.push(value.name);

                if (!this._defaultAnimation) {
                    this._defaultAnimation = value;
                }
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @language zh_CN
         * 获取骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        public getBone(name: string): BoneData {
            return this.bones[name];
        }
        /**
         * @language zh_CN
         * 获取插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        public getSlot(name: string): SlotData {
            return this.slots[name];
        }
        /**
         * @private
         */
        public getSkin(name: string): SkinData {
            return name ? this.skins[name] : this._defaultSkin;
        }
        /**
         * @language zh_CN
         * 获取动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public getAnimation(name: string): AnimationData {
            return name ? this.animations[name] : this._defaultAnimation;
        }
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         */
        public get animationNames(): Array<string> {
            return this._animationNames;
        }
        /**
         * @private
         */
        public get sortedBones(): Array<BoneData> {
            if (this._boneDirty) {
                this._boneDirty = false;
                this._sortBones();
            }

            return this._sortedBones;
        }
        /**
         * @private
         */
        public get sortedSlots(): Array<SlotData> {
            if (this._slotDirty) {
                this._slotDirty = false;
                this._sortSlots();
            }

            return this._sortedSlots;
        }
        /**
         * @private
         */
        public get defaultSkin(): SkinData {
            return this._defaultSkin;
        }
        /**
         * @language zh_CN
         * 获取默认动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        public get defaultAnimation(): AnimationData {
            return this._defaultAnimation;
        }
    }
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    export class BoneData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.BoneData]";
        }
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
        public inheritReflection: boolean;
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
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @private
         */
        public transform: Transform = new Transform();
        /**
         * @language zh_CN
         * 所属的父骨骼数据。
         * @version DragonBones 3.0
         */
        public parent: BoneData;
        /**
         * @private
         */
        public ik: BoneData;
        /**
         * @private
         */
        public userData: CustomData;
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
            if (this.userData) {
                this.userData.returnToPool();
            }

            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.inheritReflection = false;
            this.bendPositive = false;
            this.chain = 0;
            this.chainIndex = 0;
            this.weight = 0.0;
            this.length = 0.0;
            this.name = null;
            this.transform.identity();
            this.parent = null;
            this.ik = null;
            this.userData = null;
        }
    }
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
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
        public static toString(): string {
            return "[class dragonBones.SlotData]";
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
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @private
         */
        public actions: Array<ActionData> = [];
        /**
         * @language zh_CN
         * 所属的父骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        public parent: BoneData;
        /**
         * @private
         */
        public color: ColorTransform;
        /**
         * @private
         */
        public userData: CustomData;
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
            for (let i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }

            if (this.userData) {
                this.userData.returnToPool();
            }

            this.displayIndex = -1;
            this.zOrder = 0;
            this.blendMode = BlendMode.None;
            this.name = null;
            this.actions.length = 0;
            this.parent = null;
            this.color = null;
            this.userData = null;
        }
    }
    /**
     * @private
     */
    export class SkinData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.SkinData]";
        }

        public name: string;
        public slots: Map<SkinSlotData> = {};

        public constructor() {
            super();
        }

        protected _onClear(): void {
            for (let k in this.slots) {
                this.slots[k].returnToPool();
                delete this.slots[k];
            }

            this.name = null;
            //this.slots.clear();
        }

        public addSlot(value: SkinSlotData): void {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }

        public getSlot(name: string): SkinSlotData {
            return this.slots[name];
        }
    }
    /**
     * @private
     */
    export class SkinSlotData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.SkinSlotData]";
        }

        public displays: Array<DisplayData> = [];
        public meshs: Map<MeshData> = {};
        public slot: SlotData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            for (let i = 0, l = this.displays.length; i < l; ++i) {
                this.displays[i].returnToPool();
            }

            for (let k in this.meshs) {
                this.meshs[k].returnToPool();
                delete this.meshs[k];
            }

            this.displays.length = 0;
            //this.meshs.clear();
            this.slot = null;
        }

        public getDisplay(name: string): DisplayData {
            for (let i = 0, l = this.displays.length; i < l; ++i) {
                const display = this.displays[i];
                if (display.name === name) {
                    return display;
                }
            }

            return null;
        }

        public addMesh(value: MeshData): void {
            if (value && value.name && !this.meshs[value.name]) {
                this.meshs[value.name] = value;
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }

        public getMesh(name: string): MeshData {
            return this.meshs[name];
        }
    }
    /**
     * @private
     */
    export class DisplayData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.DisplayData]";
        }

        public isRelativePivot: boolean;
        public type: DisplayType;
        public inheritAnimation: boolean;
        public name: string;
        public path: string;
        public share: string;
        public pivot: Point = new Point();
        public transform: Transform = new Transform();
        public texture: TextureData;
        public armature: ArmatureData;
        public mesh: MeshData;
        public boundingBox: BoundingBoxData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            if (this.boundingBox) {
                this.boundingBox.returnToPool();
            }

            this.isRelativePivot = false;
            this.type = DisplayType.None;
            this.inheritAnimation = true;
            this.name = null;
            this.path = null;
            this.share = null;
            this.pivot.clear();
            this.transform.identity();
            this.texture = null;
            this.armature = null;
            this.mesh = null;
            this.boundingBox = null;
        }
    }
    /**
     * @private
     */
    export class MeshData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.MeshData]";
        }

        public skinned: boolean;
        public name: string;
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

        protected _onClear(): void {
            this.skinned = false;
            this.name = null;
            this.slotPose.identity();
            this.uvs.length = 0;
            this.vertices.length = 0;
            this.vertexIndices.length = 0;
            this.boneIndices.length = 0;
            this.weights.length = 0;
            this.boneVertices.length = 0;
            this.bones.length = 0;
            this.inverseBindPose.length = 0;
        }
    }
    /**
     * Cohen–Sutherland algorithm https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
     * ----------------------
     * | 0101 | 0100 | 0110 |
     * ----------------------
     * | 0001 | 0000 | 0010 |
     * ----------------------
     * | 1001 | 1000 | 1010 |
     * ----------------------
     */
    const enum OutCode {
        InSide = 0, // 0000
        Left = 1,   // 0001
        Right = 2,  // 0010
        Top = 4,    // 0100
        Bottom = 8  // 1000
    }
    /**
     * @language zh_CN
     * 自定义包围盒数据。
     * @version DragonBones 5.0
     */
    export class BoundingBoxData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.BoundingBoxData]";
        }
        /**
         * Compute the bit code for a point (x, y) using the clip rectangle
         */
        private static _computeOutCode(x: number, y: number, xMin: number, yMin: number, xMax: number, yMax: number): number {
            let code = OutCode.InSide;  // initialised as being inside of [[clip window]]

            if (x < xMin) {             // to the left of clip window
                code |= OutCode.Left;
            }
            else if (x > xMax) {        // to the right of clip window
                code |= OutCode.Right;
            }

            if (y < yMin) {             // below the clip window
                code |= OutCode.Top;
            }
            else if (y > yMax) {        // above the clip window
                code |= OutCode.Bottom;
            }

            return code;
        }
        /**
         * @private
         */
        public static segmentIntersectsRectangle(
            xA: number, yA: number, xB: number, yB: number,
            xMin: number, yMin: number, xMax: number, yMax: number,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): number {
            const inSideA = xA > xMin && xA < xMax && yA > yMin && yA < yMax;
            const inSideB = xB > xMin && xB < xMax && yB > yMin && yB < yMax;

            if (inSideA && inSideB) {
                return -1;
            }

            let intersectionCount = 0;
            let outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
            let outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);

            while (true) {
                if (!(outcode0 | outcode1)) {   // Bitwise OR is 0. Trivially accept and get out of loop
                    intersectionCount = 2;
                    break;
                }
                else if (outcode0 & outcode1) { // Bitwise AND is not 0. Trivially reject and get out of loop
                    break;
                }

                // failed both tests, so calculate the line segment to clip
                // from an outside point to an intersection with clip edge
                let x = 0.0;
                let y = 0.0;
                let normalRadian = 0.0;

                // At least one endpoint is outside the clip rectangle; pick it.
                const outcodeOut = outcode0 ? outcode0 : outcode1;

                // Now find the intersection point;
                if (outcodeOut & OutCode.Top) {             // point is above the clip rectangle
                    x = xA + (xB - xA) * (yMin - yA) / (yB - yA);
                    y = yMin;

                    if (normalRadians) {
                        normalRadian = -Math.PI * 0.5;
                    }
                }
                else if (outcodeOut & OutCode.Bottom) {     // point is below the clip rectangle
                    x = xA + (xB - xA) * (yMax - yA) / (yB - yA);
                    y = yMax;

                    if (normalRadians) {
                        normalRadian = Math.PI * 0.5;
                    }
                }
                else if (outcodeOut & OutCode.Right) {      // point is to the right of clip rectangle
                    y = yA + (yB - yA) * (xMax - xA) / (xB - xA);
                    x = xMax;

                    if (normalRadians) {
                        normalRadian = 0;
                    }
                }
                else if (outcodeOut & OutCode.Left) {       // point is to the left of clip rectangle
                    y = yA + (yB - yA) * (xMin - xA) / (xB - xA);
                    x = xMin;

                    if (normalRadians) {
                        normalRadian = Math.PI;
                    }
                }

                // Now we move outside point to intersection point to clip
                // and get ready for next pass.
                if (outcodeOut === outcode0) {
                    xA = x;
                    yA = y;
                    outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);

                    if (normalRadians) {
                        normalRadians.x = normalRadian;
                    }
                }
                else {
                    xB = x;
                    yB = y;
                    outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);

                    if (normalRadians) {
                        normalRadians.y = normalRadian;
                    }
                }
            }

            if (intersectionCount) {
                if (inSideA) {
                    intersectionCount = 2; // 10

                    if (intersectionPointA) {
                        intersectionPointA.x = xB;
                        intersectionPointA.y = yB;
                    }

                    if (intersectionPointB) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = xB;
                    }

                    if (normalRadians) {
                        normalRadians.x = normalRadians.y + Math.PI;
                    }
                }
                else if (inSideB) {
                    intersectionCount = 1; // 01

                    if (intersectionPointA) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }

                    if (intersectionPointB) {
                        intersectionPointB.x = xA;
                        intersectionPointB.y = yA;
                    }

                    if (normalRadians) {
                        normalRadians.y = normalRadians.x + Math.PI;
                    }
                }
                else {
                    intersectionCount = 3; // 11
                    if (intersectionPointA) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }

                    if (intersectionPointB) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = yB;
                    }
                }
            }

            return intersectionCount;
        }
        /**
         * @private
         */
        public static segmentIntersectsEllipse(
            xA: number, yA: number, xB: number, yB: number,
            xC: number, yC: number, widthH: number, heightH: number,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): number {
            const d = widthH / heightH;
            const dd = d * d;

            yA *= d;
            yB *= d;

            const dX = xB - xA;
            const dY = yB - yA;
            const lAB = Math.sqrt(dX * dX + dY * dY);
            const xD = dX / lAB;
            const yD = dY / lAB;
            const a = (xC - xA) * xD + (yC - yA) * yD;
            const aa = a * a;
            const ee = xA * xA + yA * yA;
            const rr = widthH * widthH;
            const dR = rr - ee + aa;
            let intersectionCount = 0;

            if (dR >= 0) {
                const dT = Math.sqrt(dR);
                const sA = a - dT;
                const sB = a + dT;
                const inSideA = sA < 0.0 ? -1 : (sA <= lAB ? 0 : 1);
                const inSideB = sB < 0.0 ? -1 : (sB <= lAB ? 0 : 1);
                const sideAB = inSideA * inSideB;

                if (sideAB < 0) {
                    return -1;
                }
                else if (sideAB === 0) {
                    if (inSideA === -1) {
                        intersectionCount = 2; // 10
                        xB = xA + sB * xD;
                        yB = (yA + sB * yD) / d;

                        if (intersectionPointA) {
                            intersectionPointA.x = xB;
                            intersectionPointA.y = yB;
                        }

                        if (intersectionPointB) {
                            intersectionPointB.x = xB;
                            intersectionPointB.y = yB;
                        }

                        if (normalRadians) {
                            normalRadians.x = Math.atan2(yB / rr * dd, xB / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else if (inSideB === 1) {
                        intersectionCount = 1; // 01
                        xA = xA + sA * xD;
                        yA = (yA + sA * yD) / d;

                        if (intersectionPointA) {
                            intersectionPointA.x = xA;
                            intersectionPointA.y = yA;
                        }

                        if (intersectionPointB) {
                            intersectionPointB.x = xA;
                            intersectionPointB.y = yA;
                        }

                        if (normalRadians) {
                            normalRadians.x = Math.atan2(yA / rr * dd, xA / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else {
                        intersectionCount = 3; // 11

                        if (intersectionPointA) {
                            intersectionPointA.x = xA + sA * xD;
                            intersectionPointA.y = (yA + sA * yD) / d;

                            if (normalRadians) {
                                normalRadians.x = Math.atan2(intersectionPointA.y / rr * dd, intersectionPointA.x / rr);
                            }
                        }

                        if (intersectionPointB) {
                            intersectionPointB.x = xA + sB * xD;
                            intersectionPointB.y = (yA + sB * yD) / d;

                            if (normalRadians) {
                                normalRadians.y = Math.atan2(intersectionPointB.y / rr * dd, intersectionPointB.x / rr);
                            }
                        }
                    }
                }
            }

            return intersectionCount;
        }
        /**
         * @private
         */
        public static segmentIntersectsPolygon(
            xA: number, yA: number, xB: number, yB: number,
            vertices: Array<number>,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): number {
            if (xA === xB) {
                xA = xB + 0.01;
            }

            if (yA === yB) {
                yA = yB + 0.01;
            }

            const l = vertices.length;
            const dXAB = xA - xB
            const dYAB = yA - yB;
            const llAB = xA * yB - yA * xB;
            let intersectionCount = 0;
            let xC = vertices[l - 2];
            let yC = vertices[l - 1];
            let dMin = 0.0;
            let dMax = 0.0;
            let xMin = 0.0;
            let yMin = 0.0;
            let xMax = 0.0;
            let yMax = 0.0;

            for (let i = 0; i < l; i += 2) {
                const xD = vertices[i];
                const yD = vertices[i + 1];

                if (xC === xD) {
                    xC = xD + 0.01;
                }

                if (yC === yD) {
                    yC = yD + 0.01;
                }

                const dXCD = xC - xD;
                const dYCD = yC - yD;
                const llCD = xC * yD - yC * xD;
                const ll = dXAB * dYCD - dYAB * dXCD;
                const x = (llAB * dXCD - dXAB * llCD) / ll;

                if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB === 0 || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
                    const y = (llAB * dYCD - dYAB * llCD) / ll;
                    if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB === 0 || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                        if (intersectionPointB) {
                            let d = x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }

                            if (intersectionCount === 0) {
                                dMin = d;
                                dMax = d;
                                xMin = x;
                                yMin = y;
                                xMax = x;
                                yMax = y;

                                if (normalRadians) {
                                    normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    normalRadians.y = normalRadians.x;
                                }
                            }
                            else {
                                if (d < dMin) {
                                    dMin = d;
                                    xMin = x;
                                    yMin = y;

                                    if (normalRadians) {
                                        normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }

                                if (d > dMax) {
                                    dMax = d;
                                    xMax = x;
                                    yMax = y;

                                    if (normalRadians) {
                                        normalRadians.y = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                            }

                            intersectionCount++;
                        }
                        else {
                            xMin = x;
                            yMin = y;
                            xMax = x;
                            yMax = y;
                            intersectionCount++;

                            if (normalRadians) {
                                normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                normalRadians.y = normalRadians.x;
                            }
                            break;
                        }
                    }
                }

                xC = xD;
                yC = yD;
            }

            if (intersectionCount === 1) {
                if (intersectionPointA) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }

                if (intersectionPointB) {
                    intersectionPointB.x = xMin;
                    intersectionPointB.y = yMin;
                }

                if (normalRadians) {
                    normalRadians.y = normalRadians.x + Math.PI;
                }
            }
            else if (intersectionCount > 1) {
                intersectionCount++;

                if (intersectionPointA) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }

                if (intersectionPointB) {
                    intersectionPointB.x = xMax;
                    intersectionPointB.y = yMax;
                }
            }

            return intersectionCount;
        }
        /**
         * @language zh_CN
         * 包围盒类型。
         * @see dragonBones.BoundingBoxType
         * @version DragonBones 5.0
         */
        public type: BoundingBoxType;
        /**
         * @language zh_CN
         * 包围盒颜色。
         * @version DragonBones 5.0
         */
        public color: number;

        public x: number; // Polygon min x.
        public y: number; // Polygon min y.
        public width: number; // Polygon max x.
        public height: number; // Polygon max y.
        /**
         * @language zh_CN
         * 自定义多边形顶点。
         * @version DragonBones 5.0
         */
        public vertices: Array<number> = [];
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
            this.type = BoundingBoxType.None;
            this.color = 0x000000;
            this.x = 0.0;
            this.y = 0.0;
            this.width = 0.0;
            this.height = 0.0;
            this.vertices.length = 0;
        }
        /**
         * @language zh_CN
         * 是否包含点。
         * @version DragonBones 5.0
         */
        public containsPoint(pX: number, pY: number): boolean {
            let isInSide = false;

            if (this.type === BoundingBoxType.Polygon) {
                if (pX >= this.x && pX <= this.width && pY >= this.y && pY <= this.height) {
                    for (let i = 0, l = this.vertices.length, iP = l - 2; i < l; i += 2) {
                        const yA = this.vertices[iP + 1];
                        const yB = this.vertices[i + 1];
                        if ((yB < pY && yA >= pY) || (yA < pY && yB >= pY)) {
                            const xA = this.vertices[iP];
                            const xB = this.vertices[i];
                            if ((pY - yB) * (xA - xB) / (yA - yB) + xB < pX) {
                                isInSide = !isInSide;
                            }
                        }

                        iP = i;
                    }
                }
            }
            else {
                const widthH = this.width * 0.5;
                if (pX >= -widthH && pX <= widthH) {
                    const heightH = this.height * 0.5;
                    if (pY >= -heightH && pY <= heightH) {
                        if (this.type === BoundingBoxType.Ellipse) {
                            pY *= widthH / heightH;
                            isInSide = Math.sqrt(pX * pX + pY * pY) <= widthH;
                        }
                        else {
                            isInSide = true;
                        }
                    }
                }
            }

            return isInSide;
        }
        /**
         * @language zh_CN
         * 是否与线段相交。
         * @version DragonBones 5.0
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): number {
            let intersectionCount = 0;

            switch (this.type) {
                case BoundingBoxType.Rectangle:
                    const widthH = this.width * 0.5;
                    const heightH = this.height * 0.5;
                    intersectionCount = BoundingBoxData.segmentIntersectsRectangle(
                        xA, yA, xB, yB,
                        -widthH, -heightH, widthH, heightH,
                        intersectionPointA, intersectionPointB, normalRadians
                    );
                    break;

                case BoundingBoxType.Ellipse:
                    intersectionCount = BoundingBoxData.segmentIntersectsEllipse(
                        xA, yA, xB, yB,
                        0.0, 0.0, this.width * 0.5, this.height * 0.5,
                        intersectionPointA, intersectionPointB, normalRadians
                    );
                    break;

                case BoundingBoxType.Polygon:
                    if (BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, this.x, this.y, this.width, this.height, null, null) !== 0) {
                        intersectionCount = BoundingBoxData.segmentIntersectsPolygon(
                            xA, yA, xB, yB,
                            this.vertices,
                            intersectionPointA, intersectionPointB, normalRadians
                        );
                    }
                    break;

                default:
                    break;
            }

            return intersectionCount;
        }
    }
}