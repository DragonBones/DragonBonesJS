namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    export class ArmatureData extends BaseObject {
        private static _onSortSlots(a: SlotData, b: SlotData): number {
            return a.zOrder > b.zOrder ? 1 : -1;
        }
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.ArmatureData]";
        }

        /**
         * @language zh_CN
         * 动画帧率。
         * @version DragonBones 3.0
         */
        public frameRate: number;
        /**
         * @language zh_CN
         * 骨架类型。
         * @see dragonBones.ArmatureType
         * @version DragonBones 3.0
         */
        public type: ArmatureType;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @private
         */
        public parent: DragonBonesData;
        /**
         * @private
         */
        public userData: any;
        /**
         * @private
         */
        public aabb: Rectangle = new Rectangle();
        /**
         * @language zh_CN
         * 所有的骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        public bones: Map<BoneData> = {};
        /**
         * @language zh_CN
         * 所有的插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        public slots: Map<SlotData> = {};
        /**
         * @language zh_CN
         * 所有的皮肤数据。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        public skins: Map<SkinData> = {};
        /**
         * @language zh_CN
         * 所有的动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public animations: Map<AnimationData> = {};
        /**
         * @private
         */
        public actions: Array<ActionData> = [];

        /**
         * @private
         */
        public cacheFrameRate: number;
        /**
         * @private
         */
        public scale: number;

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
                delete this.skins[i];
            }

            for (let i in this.animations) {
                this.animations[i].returnToPool();
                delete this.animations[i];
            }

            for (let i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }

            this.frameRate = 0;
            this.type = ArmatureType.None;
            this.name = null;
            this.parent = null;
            this.userData = null;
            this.aabb.clear();
            this.actions.length = 0;

            this.cacheFrameRate = 0;
            this.scale = 1;

            for (let i in this._bonesChildren) {
                delete this._bonesChildren[i];
            }

            this._boneDirty = false;
            this._slotDirty = false;
            this._defaultSkin = null;
            this._defaultAnimation = null;
            this._sortedBones.length = 0;
            this._sortedSlots.length = 0;
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

                if (bone.ik && bone.chain > 0 && bone.chainIndex == bone.chain) {
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
        public cacheFrames(value: number): void {
            if (this.cacheFrameRate == value) {
                return;
            }

            this.cacheFrameRate = value;

            for (let i in this.animations) {
                this.animations[i].cacheFrames(this.cacheFrameRate);
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
            }
            else {
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
            }
            else {
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
            }
            else {
                throw new Error();
            }
        }

        /**
         * @language zh_CN
         * 获取指定名称的骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        public getBone(name: string): BoneData {
            return this.bones[name];
        }
        /**
         * @language zh_CN
         * 获取指定名称的插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        public getSlot(name: string): SlotData {
            return this.slots[name];
        }
        /**
         * @language zh_CN
         * 获取指定名称的皮肤数据。
         * @param name 皮肤数据名称。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        public getSkin(name: string): SkinData {
            return name ? this.skins[name] : this._defaultSkin;
        }
        /**
         * @language zh_CN
         * 获取指定名称的动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public getAnimation(name: string): AnimationData {
            return name ? this.animations[name] : this._defaultAnimation;
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
         * @language zh_CN
         * 获取默认的皮肤数据。
         * @see dragonBones.SkinData
         * @version DragonBones 4.5
         */
        public get defaultSkin(): SkinData {
            return this._defaultSkin;
        }
        /**
         * @language zh_CN
         * 获取默认的动画数据。
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
        public actions: Array<ActionData> = [];
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
            for (let i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }

            this.displayIndex = 0;
            this.zOrder = 0;
            this.blendMode = BlendMode.Normal;
            this.name = null;
            this.parent = null;
            this.color = null;
            this.actions.length = 0;
        }
    }
    /**
     * @language zh_CN
     * 皮肤数据。
     * @version DragonBones 3.0
     */
    export class SkinData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.SkinData]";
        }
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
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
            for (let i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }

            this.name = null;
        }
        /**
         * @private
         */
        public addSlot(value: SlotDisplayDataSet): void {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            }
            else {
                throw new Error();
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
        public static toString(): string {
            return "[class dragonBones.SlotDisplayDataSet]";
        }

        public slot: SlotData;
        public displays: Array<DisplayData> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            for (let i = 0, l = this.displays.length; i < l; ++i) {
                this.displays[i].returnToPool();
            }

            this.slot = null;
            this.displays.length = 0;
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
        public color: number;
        public name: string;
        public path: string;
        public texture: TextureData;
        public armature: ArmatureData;
        public mesh: MeshData;
        public share: DisplayData;
        public boundingBox: BoundingBoxData;
        public pivot: Point = new Point();
        public transform: Transform = new Transform();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            if (this.mesh && !this.share) {
                this.mesh.returnToPool();
            }

            if (this.boundingBox) {
                this.boundingBox.returnToPool();
            }

            this.isRelativePivot = false;
            this.type = DisplayType.None;
            this.inheritAnimation = true;
            this.color = 0;
            this.name = null;
            this.path = null;
            this.texture = null;
            this.armature = null;
            this.mesh = null;
            this.share = null;
            this.boundingBox = null;
            this.pivot.clear();
            this.transform.identity();
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
     * @private
     */
    export class BoundingBoxData extends BaseObject {
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
                let x = 0
                let y = 0;
                let normalRadian = 0;

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
                if (outcodeOut == outcode0) {
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
                const inSideA = sA < 0 ? -1 : (sA <= lAB ? 0 : 1);
                const inSideB = sB < 0 ? -1 : (sB <= lAB ? 0 : 1);
                const sideAB = inSideA * inSideB;

                if (sideAB < 0) {
                    return -1;
                }
                else if (sideAB == 0) {
                    if (inSideA == -1) {
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
                    else if (inSideB == 1) {
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

        public static segmentIntersectsPolygon(
            xA: number, yA: number, xB: number, yB: number,
            vertices: Array<number>,
            intersectionPointA: { x: number, y: number } = null,
            intersectionPointB: { x: number, y: number } = null,
            normalRadians: { x: number, y: number } = null
        ): number {
            if (xA == xB) {
                xA = xB + 0.01;
            }

            if (yA == yB) {
                yA = yB + 0.01;
            }

            const l = vertices.length;
            const dXAB = xA - xB
            const dYAB = yA - yB;
            const llAB = xA * yB - yA * xB;
            let intersectionCount = 0;
            let xC = vertices[l - 2];
            let yC = vertices[l - 1];
            let dMin = 0;
            let dMax = 0;
            let xMin = 0;
            let yMin = 0;
            let xMax = 0;
            let yMax = 0;

            for (let i = 0; i < l; i += 2) {
                const xD = vertices[i];
                const yD = vertices[i + 1];

                if (xC == xD) {
                    xC = xD + 0.01;
                }

                if (yC == yD) {
                    yC = yD + 0.01;
                }

                const dXCD = xC - xD
                const dYCD = yC - yD;
                const llCD = xC * yD - yC * xD;
                const ll = dXAB * dYCD - dYAB * dXCD;
                const x = (llAB * dXCD - dXAB * llCD) / ll;

                if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB == 0 || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
                    const y = (llAB * dYCD - dYAB * llCD) / ll;
                    if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB == 0 || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                        if (intersectionPointB) {
                            let d = x - xA;
                            if (d < 0) {
                                d = -d;
                            }

                            if (intersectionCount == 0) {
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

            if (intersectionCount == 1) {
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

        public type: BoundingBoxType;
        public x: number = 0; // Polygon min x.
        public y: number = 0; // Polygon min y.
        public width: number = 0;
        public height: number = 0;
        public vertices: Array<number> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            this.type = BoundingBoxType.None;
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.vertices.length = 0;
        }

        public containsPoint(x: number, y: number): boolean {
            let isInSide = false;

            if (this.type == BoundingBoxType.Polygon) {
                if (x >= this.x && x <= this.width && y >= this.y && y <= this.height) {
                    for (let i = 0, l = this.vertices.length, prevIndex = l - 2; i < l; i += 2) {
                        const yA = this.vertices[prevIndex + 1];
                        const yB = this.vertices[i + 1];
                        if ((yB < y && yA >= y) || (yA < y && yB >= y)) {
                            const xA = this.vertices[prevIndex];
                            const xB = this.vertices[i];
                            if ((y - yB) * (xA - xB) / (yA - yB) + xB < x) {
                                isInSide = !isInSide;
                            }
                        }

                        prevIndex = i;
                    }
                }
            }
            else {
                const widthH = this.width * 0.5;
                if (x >= -widthH && x <= widthH) {
                    const heightH = this.height * 0.5;
                    if (y >= -heightH && y <= heightH) {
                        if (this.type == BoundingBoxType.Ellipse) {
                            y *= widthH / heightH;
                            isInSide = Math.sqrt(x * x + y * y) <= widthH;
                        }
                        else {
                            isInSide = true;
                        }
                    }
                }
            }

            return isInSide;
        }

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
                        intersectionPointA, intersectionPointB, normalRadians);
                    break;

                case BoundingBoxType.Ellipse:
                    intersectionCount = BoundingBoxData.segmentIntersectsEllipse(
                        xA, yA, xB, yB,
                        0, 0, this.width * 0.5, this.height * 0.5,
                        intersectionPointA, intersectionPointB, normalRadians);
                    break;

                case BoundingBoxType.Polygon:
                    if (BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, this.x, this.y, this.width, this.height, null, null) != 0) {
                        intersectionCount = BoundingBoxData.segmentIntersectsPolygon(
                            xA, yA, xB, yB,
                            this.vertices,
                            intersectionPointA, intersectionPointB, normalRadians);
                    }
                    break;

                default:
                    break;
            }

            return intersectionCount;
        }
    }
}