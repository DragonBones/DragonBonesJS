/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2016 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
namespace dragonBones {
    /**
     * - The armature data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨架数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class ArmatureData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.ArmatureData]";
        }
        /**
         * @private
         */
        public type: ArmatureType;
        /**
         * - The animation frame rate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画帧率。
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
         * - The armature name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨架名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public readonly aabb: Rectangle = new Rectangle();
        /**
         * - The names of all the animation data.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所有的动画数据名称。
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
         * @private
         */
        public readonly bones: Map<BoneData> = {};
        /**
         * @private
         */
        public readonly slots: Map<SlotData> = {};
        /**
         * @private
         */
        public readonly constraints: Map<ConstraintData> = {};
        /**
         * @private
         */
        public readonly skins: Map<SkinData> = {};
        /**
         * @private
         */
        public readonly animations: Map<AnimationData> = {};
        /**
         * - The default skin data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 默认插槽数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public defaultSkin: SkinData | null;
        /**
         * - The default animation data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 默认动画数据。
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
         * @private
         */
        public parent: DragonBonesData;
        /**
         * @inheritDoc
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
         * @internal
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
                    if (constraint.root === bone && this.sortedBones.indexOf(constraint.target) < 0) {
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
         * @internal
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
         * @internal
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
         * @internal
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
         * @internal
         * @private
         */
        public addBone(value: BoneData): void {
            if (value.name in this.bones) {
                console.warn("Same bone: " + value.name);
                return;
            }

            this.bones[value.name] = value;
            this.sortedBones.push(value);
        }
        /**
         * @internal
         * @private
         */
        public addSlot(value: SlotData): void {
            if (value.name in this.slots) {
                console.warn("Same slot: " + value.name);
                return;
            }

            this.slots[value.name] = value;
            this.sortedSlots.push(value);
        }
        /**
         * @internal
         * @private
         */
        public addConstraint(value: ConstraintData): void {
            if (value.name in this.constraints) {
                console.warn("Same constraint: " + value.name);
                return;
            }

            this.constraints[value.name] = value;
        }
        /**
         * @internal
         * @private
         */
        public addSkin(value: SkinData): void {
            if (value.name in this.skins) {
                console.warn("Same skin: " + value.name);
                return;
            }

            value.parent = this;
            this.skins[value.name] = value;
            if (this.defaultSkin === null) {
                this.defaultSkin = value;
            }

            if (value.name === "default") {
                this.defaultSkin = value;
            }
        }
        /**
         * @internal
         * @private
         */
        public addAnimation(value: AnimationData): void {
            if (value.name in this.animations) {
                console.warn("Same animation: " + value.name);
                return;
            }

            value.parent = this;
            this.animations[value.name] = value;
            this.animationNames.push(value.name);
            if (this.defaultAnimation === null) {
                this.defaultAnimation = value;
            }
        }
        /**
         * @internal
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
         * - Get a specific done data.
         * @param name - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的骨骼数据。
         * @param name - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getBone(name: string): BoneData | null {
            return name in this.bones ? this.bones[name] : null;
        }
        /**
         * - Get a specific slot data.
         * @param name - The slot name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的插槽数据。
         * @param name - 插槽名称。
         * @version DragonBones 3.0
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
         * - Get a specific skin data.
         * @param name - The skin name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定皮肤数据。
         * @param name - 皮肤名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getSkin(name: string): SkinData | null {
            return name in this.skins ? this.skins[name] : null;
        }
        /**
         * - Get a specific animation data.
         * @param name - The animation name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的动画数据。
         * @param name - 动画名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getAnimation(name: string): AnimationData | null {
            return name in this.animations ? this.animations[name] : null;
        }
    }
    /**
     * - The bone data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class BoneData extends BaseObject {
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
         * - The bone length.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨骼长度。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public length: number;
        /**
         * - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨骼名称。
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
         * - The parent bone data.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 父骨骼数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public parent: BoneData | null;
        /**
         * @inheritDoc
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
     * @internal
     * @private
     */
    export class SurfaceData extends BoneData {
        public static toString(): string {
            return "[class dragonBones.SurfaceData]";
        }
        public vertexCountX: number;
        public vertexCountY: number;
        public readonly vertices: Array<number> = [];
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.vertexCountX = 0;
            this.vertexCountY = 0;
            this.vertices.length = 0;
        }
    }
    /**
     * - The slot data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 插槽数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class SlotData extends BaseObject {
        /**
         * @internal
         * @private
         */
        public static readonly DEFAULT_COLOR: ColorTransform = new ColorTransform();
        /**
         * @internal
         * @private
         */
        public static createColor(): ColorTransform {
            return new ColorTransform();
        }

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
         * - The slot name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽名称。
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
         * - The parent bone data.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 父骨骼数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public parent: BoneData;
        /**
         * @inheritDoc
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
}