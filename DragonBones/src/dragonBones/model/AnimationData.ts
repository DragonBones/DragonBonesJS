namespace dragonBones {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    export class AnimationData extends TimelineData<AnimationFrameData> {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.AnimationData]";
        }
        /**
         * @language zh_CN
         * 持续的帧数。
         * @version DragonBones 3.0
         */
        public frameCount: number;
        /**
         * @language zh_CN
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        public playTimes: number;
        /**
         * @language zh_CN
         * 持续时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public duration: number;
        /**
         * @language zh_CN
         * 淡入时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public fadeInTime: number;
        /**
         * @private
         */
        public cacheFrameRate: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @private
         */
        public zOrderTimeline: TimelineData<ZOrderFrameData>;
        /**
         * @private
         */
        public boneTimelines: Map<BoneTimelineData> = {};
        /**
         * @private
         */
        public slotTimelines: Map<SlotTimelineData> = {};
        /**
         * @private
         */
        public ffdTimelines: Map<Map<Map<FFDTimelineData>>> = {}; // skin slot mesh
        /**
         * @private
         */
        public cachedFrames: Array<boolean> = [];
        /**
         * @private
         */
        public boneCachedFrameIndices: Map<Array<number>> = {};
        /**
         * @private
         */
        public slotCachedFrameIndices: Map<Array<number>> = {};
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
            super._onClear();

            for (let k in this.boneTimelines) {
                this.boneTimelines[k].returnToPool();
                delete this.boneTimelines[k];
            }

            for (let k in this.slotTimelines) {
                this.slotTimelines[k].returnToPool();
                delete this.slotTimelines[k];
            }

            for (let k in this.ffdTimelines) {
                for (let kA in this.ffdTimelines[k]) {
                    for (let kB in this.ffdTimelines[k][kA]) {
                        this.ffdTimelines[k][kA][kB].returnToPool();
                    }
                }

                delete this.ffdTimelines[k];
            }

            for (let k in this.boneCachedFrameIndices) {
                // this.boneCachedFrameIndices[i].length = 0;
                delete this.boneCachedFrameIndices[k];
            }

            for (let k in this.slotCachedFrameIndices) {
                // this.slotCachedFrameIndices[i].length = 0;
                delete this.slotCachedFrameIndices[k];
            }

            if (this.zOrderTimeline) {
                this.zOrderTimeline.returnToPool();
            }

            this.frameCount = 0;
            this.playTimes = 0;
            this.duration = 0.0;
            this.fadeInTime = 0.0;
            this.cacheFrameRate = 0.0;
            this.name = null;
            //this.boneTimelines.clear();
            //this.slotTimelines.clear();
            //this.ffdTimelines.clear();
            this.cachedFrames.length = 0;
            //this.boneCachedFrameIndices.clear();
            //this.boneCachedFrameIndices.clear();
            this.zOrderTimeline = null;
        }
        /**
         * @private
         */
        public cacheFrames(frameRate: number): void {
            if (this.cacheFrameRate > 0.0) {
                return;
            }

            this.cacheFrameRate = Math.max(Math.ceil(frameRate * this.scale), 1.0);
            const cacheFrameCount = Math.ceil(this.cacheFrameRate * this.duration) + 1; // uint
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;

            for (let k in this.boneTimelines) {
                const indices: Array<number> = new Array(cacheFrameCount);
                for (let i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }

                this.boneCachedFrameIndices[k] = indices;
            }

            for (let k in this.slotTimelines) {
                const indices: Array<number> = new Array(cacheFrameCount);
                for (let i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }

                this.slotCachedFrameIndices[k] = indices;
            }
        }
        /**
         * @private
         */
        public addBoneTimeline(value: BoneTimelineData): void {
            if (value && value.bone && !this.boneTimelines[value.bone.name]) {
                this.boneTimelines[value.bone.name] = value;
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @private
         */
        public addSlotTimeline(value: SlotTimelineData): void {
            if (value && value.slot && !this.slotTimelines[value.slot.name]) {
                this.slotTimelines[value.slot.name] = value;
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @private
         */
        public addFFDTimeline(value: FFDTimelineData): void {
            if (value && value.skin && value.slot && value.display) {
                const skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
                const slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};
                if (!slot[value.display.name]) {
                    slot[value.display.name] = value;
                }
                else {
                    throw new Error(DragonBones.ARGUMENT_ERROR);
                }
            }
            else {
                throw new Error(DragonBones.ARGUMENT_ERROR);
            }
        }
        /**
         * @private
         */
        public getBoneTimeline(name: string): BoneTimelineData {
            return this.boneTimelines[name];
        }
        /**
         * @private
         */
        public getSlotTimeline(name: string): SlotTimelineData {
            return this.slotTimelines[name];
        }
        /**
         * @private
         */
        public getFFDTimeline(skinName: string, slotName: string): Map<FFDTimelineData> {
            const skin = this.ffdTimelines[skinName];
            if (skin) {
                return skin[slotName];
            }

            return null;
        }
        /**
         * @private
         */
        public getBoneCachedFrameIndices(name: string): Array<number> {
            return this.boneCachedFrameIndices[name];
        }
        /**
         * @private
         */
        public getSlotCachedFrameIndices(name: string): Array<number> {
            return this.slotCachedFrameIndices[name];
        }
    }
}