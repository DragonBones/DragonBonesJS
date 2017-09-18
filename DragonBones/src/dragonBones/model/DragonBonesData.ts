namespace dragonBones {
    /**
     * 龙骨数据。
     * 一个龙骨数据包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class DragonBonesData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.DragonBonesData]";
        }
        /**
         * 是否开启共享搜索。
         * @default false
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public autoSearch: boolean;
        /**
         * 动画帧频。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public frameRate: number;
        /**
         * 数据版本。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public version: string;
        /**
         * 数据名称。(该名称与龙骨项目名保持一致)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public readonly frameIndices: Array<number> = [];
        /**
         * @private
         */
        public readonly cachedFrames: Array<number> = [];
        /**
         * 所有骨架数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly armatureNames: Array<string> = [];
        /**
         * 所有骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public readonly armatures: Map<ArmatureData> = {};
        /**
         * @private
         */
        public binary: ArrayBuffer;
        /**
         * @private
         */
        public intArray: Int16Array;
        /**
         * @private
         */
        public floatArray: Float32Array;
        /**
         * @private
         */
        public frameIntArray: Int16Array;
        /**
         * @private
         */
        public frameFloatArray: Float32Array;
        /**
         * @private
         */
        public frameArray: Int16Array;
        /**
         * @private
         */
        public timelineArray: Uint16Array;
        /**
         * @private
         */
        public userData: UserData | null = null; // Initial value.
        /**
         * @private
         */
        protected _onClear(): void {
            for (let k in this.armatures) {
                this.armatures[k].returnToPool();
                delete this.armatures[k];
            }

            if (this.userData !== null) {
                this.userData.returnToPool();
            }

            this.autoSearch = false;
            this.frameRate = 0;
            this.version = "";
            this.name = "";
            this.frameIndices.length = 0;
            this.cachedFrames.length = 0;
            this.armatureNames.length = 0;
            //this.armatures.clear();
            this.binary = null as any; //
            this.intArray = null as any; //
            this.floatArray = null as any; //
            this.frameIntArray = null as any; //
            this.frameFloatArray = null as any; //
            this.frameArray = null as any; //
            this.timelineArray = null as any; //
            this.userData = null;
        }
        /**
         * @private
         */
        public addArmature(value: ArmatureData): void {
            if (value.name in this.armatures) {
                console.warn("Replace armature: " + value.name);
                this.armatures[value.name].returnToPool();
            }

            value.parent = this;
            this.armatures[value.name] = value;
            this.armatureNames.push(value.name);
        }
        /**
         * 获取骨架数据。
         * @param name 骨架数据名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getArmature(name: string): ArmatureData | null {
            return name in this.armatures ? this.armatures[name] : null;
        }

        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        public dispose(): void {
            console.warn("已废弃，请参考 @see");
            this.returnToPool();
        }
    }
}