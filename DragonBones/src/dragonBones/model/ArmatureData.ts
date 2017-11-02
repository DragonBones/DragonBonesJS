namespace dragonBones {
    /**
     * @private 
     */
    export class CanvasData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.CanvasData]";
        }

        public hasBackground: boolean;
        public color: number;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        /**
         * @private
         */
        protected _onClear(): void {
            this.hasBackground = false;
            this.color = 0x000000;
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
    }
    /**
     * 骨架数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class ArmatureData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.ArmatureData]";
        }
        /**
         * @private
         */
        public type: ArmatureType;
        /**
         * 动画帧率。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public frameRate: number;
        /**
         * @private
         */
        public cacheFrameRate: number;
        /**
         * @private
         */
        public scale: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public readonly aabb: Rectangle = new Rectangle();
        /**
         * 所有动画数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly animationNames: Array<string> = [];
        /**
         * @private
         */
        public readonly sortedBones: Array<BoneData> = [];
        /**
         * @private
         */
        public readonly sortedSlots: Array<SlotData> = [];
        /**
         * @private
         */
        public readonly defaultActions: Array<ActionData> = [];
        /**
         * @private
         */
        public readonly actions: Array<ActionData> = [];
        /**
         * 所有骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly bones: Map<BoneData> = {};
        /**
         * 所有插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly slots: Map<SlotData> = {};
        /**
         * @private
         */
        public readonly constraints: Map<ConstraintData> = {};
        /**
         * 所有皮肤数据。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly skins: Map<SkinData> = {};
        /**
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly animations: Map<AnimationData> = {};
        /**
         * 获取默认皮肤数据。
         * @see dragonBones.SkinData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public defaultSkin: SkinData | null;
        /**
         * 获取默认动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public defaultAnimation: AnimationData | null;
        /**
         * @private
         */
        public canvas: CanvasData | null = null; // Initial value.
        /**
         * @private
         */
        public userData: UserData | null = null; // Initial value.
        /**
         * 所属的龙骨数据。
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public parent: DragonBonesData;
        /**
         * @private
         */
        protected _onClear(): void {
            for (const action of this.defaultActions) {
                action.returnToPool();
            }

            for (const action of this.actions) {
                action.returnToPool();
            }

            for (let k in this.bones) {
                this.bones[k].returnToPool();
                delete this.bones[k];
            }

            for (let k in this.slots) {
                this.slots[k].returnToPool();
                delete this.slots[k];
            }

            for (let k in this.constraints) {
                this.constraints[k].returnToPool();
                delete this.constraints[k];
            }

            for (let k in this.skins) {
                this.skins[k].returnToPool();
                delete this.skins[k];
            }

            for (let k in this.animations) {
                this.animations[k].returnToPool();
                delete this.animations[k];
            }

            if (this.canvas !== null) {
                this.canvas.returnToPool();
            }

            if (this.userData !== null) {
                this.userData.returnToPool();
            }

            this.type = ArmatureType.Armature;
            this.frameRate = 0;
            this.cacheFrameRate = 0;
            this.scale = 1.0;
            this.name = "";
            this.aabb.clear();
            this.animationNames.length = 0;
            this.sortedBones.length = 0;
            this.sortedSlots.length = 0;
            this.defaultActions.length = 0;
            this.actions.length = 0;
            // this.bones.clear();
            // this.slots.clear();
            // this.constraints.clear();
            // this.skins.clear();
            // this.animations.clear();
            this.defaultSkin = null;
            this.defaultAnimation = null;
            this.canvas = null;
            this.userData = null;
            this.parent = null as any; //
        }
        /**
         * @private
         */
        public sortBones(): void {
            const total = this.sortedBones.length;
            if (total <= 0) {
                return;
            }

            const sortHelper = this.sortedBones.concat();
            let index = 0;
            let count = 0;
            this.sortedBones.length = 0;
            while (count < total) {
                const bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }

                if (this.sortedBones.indexOf(bone) >= 0) {
                    continue;
                }

                let flag = false;
                for (let k in this.constraints) { // Wait constraint.
                    const constraint = this.constraints[k];
                    if (constraint.bone === bone && this.sortedBones.indexOf(constraint.target) < 0) {
                        flag = true;
                        break;
                    }
                }

                if (flag) {
                    continue;
                }

                if (bone.parent !== null && this.sortedBones.indexOf(bone.parent) < 0) { // Wait parent.
                    continue;
                }

                this.sortedBones.push(bone);
                count++;
            }
        }
        /**
         * @private
         */
        public cacheFrames(frameRate: number): void {
            if (this.cacheFrameRate > 0) { // TODO clear cache.
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
        public setCacheFrame(globalTransformMatrix: Matrix, transform: Transform): number {
            const dataArray = this.parent.cachedFrames;
            let arrayOffset = dataArray.length;

            dataArray.length += 10;
            dataArray[arrayOffset] = globalTransformMatrix.a;
            dataArray[arrayOffset + 1] = globalTransformMatrix.b;
            dataArray[arrayOffset + 2] = globalTransformMatrix.c;
            dataArray[arrayOffset + 3] = globalTransformMatrix.d;
            dataArray[arrayOffset + 4] = globalTransformMatrix.tx;
            dataArray[arrayOffset + 5] = globalTransformMatrix.ty;
            dataArray[arrayOffset + 6] = transform.rotation;
            dataArray[arrayOffset + 7] = transform.skew;
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
            transform.rotation = dataArray[arrayOffset + 6];
            transform.skew = dataArray[arrayOffset + 7];
            transform.scaleX = dataArray[arrayOffset + 8];
            transform.scaleY = dataArray[arrayOffset + 9];
            transform.x = globalTransformMatrix.tx;
            transform.y = globalTransformMatrix.ty;
        }
        /**
         * @private
         */
        public addBone(value: BoneData): void {
            if (value.name in this.bones) {
                console.warn("Replace bone: " + value.name);
                this.bones[value.name].returnToPool();
            }

            this.bones[value.name] = value;
            this.sortedBones.push(value);
        }
        /**
         * @private
         */
        public addSlot(value: SlotData): void {
            if (value.name in this.slots) {
                console.warn("Replace slot: " + value.name);
                this.slots[value.name].returnToPool();
            }

            this.slots[value.name] = value;
            this.sortedSlots.push(value);
        }
        /**
         * @private
         */
        public addConstraint(value: ConstraintData): void {
            if (value.name in this.constraints) {
                console.warn("Replace constraint: " + value.name);
                this.constraints[value.name].returnToPool();
            }

            this.constraints[value.name] = value;
        }
        /**
         * @private
         */
        public addSkin(value: SkinData): void {
            if (value.name in this.skins) {
                console.warn("Replace skin: " + value.name);
                this.skins[value.name].returnToPool();
            }

            value.parent = this;
            this.skins[value.name] = value;
            if (this.defaultSkin === null) {
                this.defaultSkin = value;
            }
        }
        /**
         * @private
         */
        public addAnimation(value: AnimationData): void {
            if (value.name in this.animations) {
                console.warn("Replace animation: " + value.name);
                this.animations[value.name].returnToPool();
            }

            value.parent = this;
            this.animations[value.name] = value;
            this.animationNames.push(value.name);
            if (this.defaultAnimation === null) {
                this.defaultAnimation = value;
            }
        }
        /**
         * @private
         */
        public addAction(value: ActionData, isDefault: boolean): void {
            if (isDefault) {
                this.defaultActions.push(value);
            }
            else {
                this.actions.push(value);
            }
        }
        /**
         * 获取骨骼数据。
         * @param name 数据名称。
         * @version DragonBones 3.0
         * @see dragonBones.BoneData
         * @language zh_CN
         */
        public getBone(name: string): BoneData | null {
            return name in this.bones ? this.bones[name] : null;
        }
        /**
         * 获取插槽数据。
         * @param name 数据名称。
         * @version DragonBones 3.0
         * @see dragonBones.SlotData
         * @language zh_CN
         */
        public getSlot(name: string): SlotData | null {
            return name in this.slots ? this.slots[name] : null;
        }
        /**
         * @private
         */
        public getConstraint(name: string): ConstraintData | null {
            return name in this.constraints ? this.constraints[name] : null;
        }
        /**
         * 获取皮肤数据。
         * @param name 数据名称。
         * @version DragonBones 3.0
         * @see dragonBones.SkinData
         * @language zh_CN
         */
        public getSkin(name: string): SkinData | null {
            return name in this.skins ? this.skins[name] : null;
        }
        /**
         * 获取动画数据。
         * @param name 数据名称。
         * @version DragonBones 3.0
         * @see dragonBones.AnimationData
         * @language zh_CN
         */
        public getAnimation(name: string): AnimationData | null {
            return name in this.animations ? this.animations[name] : null;
        }
    }
    /**
     * 骨骼数据。
     * @version DragonBones 3.0
     * @language zh_CN
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
        public length: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public readonly transform: Transform = new Transform();
        /**
         * @private
         */
        public userData: UserData | null = null; // Initial value.
        /**
         * 所属的父骨骼数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public parent: BoneData | null;
        /**
         * @private
         */
        protected _onClear(): void {

            if (this.userData !== null) {
                this.userData.returnToPool();
            }

            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.inheritReflection = false;
            this.length = 0.0;
            this.name = "";
            this.transform.identity();
            this.userData = null;
            this.parent = null;
        }
    }
    /**
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class SlotData extends BaseObject {
        /**
         * @private
         */
        public static readonly DEFAULT_COLOR: ColorTransform = new ColorTransform();
        /**
         * @private
         */
        public static createColor(): ColorTransform {
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
        public blendMode: BlendMode;
        /**
         * @private
         */
        public displayIndex: number;
        /**
         * @private
         */
        public zOrder: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public color: ColorTransform = null as any; // Initial value.
        /**
         * @private
         */
        public userData: UserData | null = null; // Initial value.
        /**
         * 所属的父骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public parent: BoneData;
        /**
         * @private
         */
        protected _onClear(): void {
            if (this.userData !== null) {
                this.userData.returnToPool();
            }

            this.blendMode = BlendMode.Normal;
            this.displayIndex = 0;
            this.zOrder = 0;
            this.name = "";
            this.color = null as any; //
            this.userData = null;
            this.parent = null as any; //
        }
    }
    /**
     * 皮肤数据。（通常一个骨架数据至少包含一个皮肤数据）
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class SkinData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.SkinData]";
        }
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public readonly displays: Map<Array<DisplayData | null>> = {};
        /**
         * @private
         */
        public parent: ArmatureData;
        /**
         * @private
         */
        protected _onClear(): void {
            for (let k in this.displays) {
                const slotDisplays = this.displays[k];
                for (const display of slotDisplays) {
                    if (display !== null) {
                        display.returnToPool();
                    }
                }

                delete this.displays[k];
            }

            this.name = "";
            // this.displays.clear();
            this.parent = null as any; //
        }
        /**
         * @private
         */
        public addDisplay(slotName: string, value: DisplayData | null): void {
            if (!(slotName in this.displays)) {
                this.displays[slotName] = [];
            }

            if (value !== null) {
                value.parent = this;
            }

            const slotDisplays = this.displays[slotName]; // TODO clear prev
            slotDisplays.push(value);
        }
        /**
         * @private
         */
        public getDisplay(slotName: string, displayName: string): DisplayData | null {
            const slotDisplays = this.getDisplays(slotName);
            if (slotDisplays !== null) {
                for (const display of slotDisplays) {
                    if (display !== null && display.name === displayName) {
                        return display;
                    }
                }
            }

            return null;
        }
        /**
         * @private
         */
        public getDisplays(slotName: string): Array<DisplayData | null> | null {
            if (!(slotName in this.displays)) {
                return null;
            }

            return this.displays[slotName];
        }
    }
}