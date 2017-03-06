namespace dragonBones {
    /**
     * @language zh_CN
     * 自定义数据。
     * @version DragonBones 5.0
     */
    export class CustomData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.CustomData]";
        }
        /**
         * @language zh_CN
         * 自定义整数。
         * @version DragonBones 5.0
         */
        public ints: Array<number> = [];
        /**
         * @language zh_CN
         * 自定义浮点数。
         * @version DragonBones 5.0
         */
        public floats: Array<number> = [];
        /**
         * @language zh_CN
         * 自定义字符串。
         * @version DragonBones 5.0
         */
        public strings: Array<string> = [];
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
            this.ints.length = 0;
            this.floats.length = 0;
            this.strings.length = 0;
        }
        /**
         * @language zh_CN
         * 获取自定义整数。
         * @version DragonBones 5.0
         */
        public getInt(index: number = 0): number {
            return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
        }
        /**
         * @language zh_CN
         * 获取自定义浮点数。
         * @version DragonBones 5.0
         */
        public getFloat(index: number = 0): number {
            return index >= 0 && index < this.floats.length ? this.floats[index] : 0;
        }
        /**
         * @language zh_CN
         * 获取自定义字符串。
         * @version DragonBones 5.0
         */
        public getString(index: number = 0): string {
            return index >= 0 && index < this.strings.length ? this.strings[index] : null;
        }
    }
    /**
     * @private
     */
    export class EventData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.EventData]";
        }

        public type: EventType;
        public name: string;
        public bone: BoneData;
        public slot: SlotData;
        public data: CustomData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            if (this.data) {
                this.data.returnToPool();
            }

            this.type = EventType.None;
            this.name = null;
            this.bone = null;
            this.slot = null;
            this.data = null;
        }
    }
    /**
     * @private
     */
    export class ActionData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.ActionData]";
        }

        public type: ActionType;
        public bone: BoneData;
        public slot: SlotData;
        public animationConfig: AnimationConfig;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            if (this.animationConfig) {
                this.animationConfig.returnToPool();
            }

            this.type = ActionType.None;
            this.bone = null;
            this.slot = null;
            this.animationConfig = null;
        }
    }
    /**
     * @language zh_CN
     * 龙骨数据。
     * 一个龙骨数据包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    export class DragonBonesData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.DragonBonesData]";
        }
        /**
         * @language zh_CN
         * 是否开启共享搜索。
         * @default false
         * @version DragonBones 4.5
         */
        public autoSearch: boolean;
        /**
         * @language zh_CN
         * 动画帧频。
         * @version DragonBones 3.0
         */
        public frameRate: number;
        /**
         * @private
         */
        public version: string;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @language zh_CN
         * 所有骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        public armatures: Map<ArmatureData> = {};
        /**
         * @private
         */
        public cachedFrames: Array<number> = [];
        /**
         * @private
         */
        public userData: CustomData;

        private _armatureNames: Array<string> = [];
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
            if (DragonBones.debug) {
                for (let i = 0, l = DragonBones._armatures.length; i < l; ++i) {
                    const armature = DragonBones._armatures[i];
                    if (armature.armatureData.parent === this) {
                        throw new Error("The DragonBonesData is being used, please make sure all armature references to the data have been deleted.");
                    }
                }
            }

            for (let k in this.armatures) {
                this.armatures[k].returnToPool();
                delete this.armatures[k];
            }

            if (this.userData) {
                this.userData.returnToPool();
            }

            this.autoSearch = false;
            this.frameRate = 0;
            this.version = null;
            this.name = null;
            //this.armatures.clear();
            this.cachedFrames.length = 0;
            this.userData = null;

            this._armatureNames.length = 0;
        }
        /**
         * @private
         */
        public addArmature(value: ArmatureData): void {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);

                value.parent = this;
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @language zh_CN
         * 获取骨架。
         * @param name 骨架数据名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        public getArmature(name: string): ArmatureData {
            return this.armatures[name];
        }
        /**
         * @language zh_CN
         * 所有骨架数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         */
        public get armatureNames(): Array<string> {
            return this._armatureNames;
        }

        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        public dispose(): void {
            this.returnToPool();
        }
    }
}