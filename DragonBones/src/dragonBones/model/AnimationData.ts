namespace dragonBones {
    /**
     * 动画数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class AnimationData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.AnimationData]";
        }
        /**
         * @private
         */
        public frameIntOffset: number; // FrameIntArray.
        /**
         * @private
         */
        public frameFloatOffset: number; // FrameFloatArray.
        /**
         * @private
         */
        public frameOffset: number; // FrameArray.
        /**
         * 持续的帧数。 ([1~N])
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public frameCount: number;
        /**
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public playTimes: number;
        /**
         * 持续时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public duration: number;
        /**
         * @private
         */
        public scale: number;
        /**
         * 淡入时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public fadeInTime: number;
        /**
         * @private
         */
        public cacheFrameRate: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public name: string;
        /**
         * @private
         */
        public readonly cachedFrames: Array<boolean> = [];
        /**
         * @private
         */
        public readonly boneTimelines: Map<Array<TimelineData>> = {};
        /**
         * @private
         */
        public readonly slotTimelines: Map<Array<TimelineData>> = {};
        /**
         * @private
         */
        public readonly boneCachedFrameIndices: Map<Array<number>> = {};
        /**
         * @private
         */
        public readonly slotCachedFrameIndices: Map<Array<number>> = {};
        /**
         * @private
         */
        public actionTimeline: TimelineData | null = null; // Initial value.
        /**
         * @private
         */
        public zOrderTimeline: TimelineData | null = null; // Initial value.
        /**
         * @private
         */
        public parent: ArmatureData;
        /**
         * @private
         */
        protected _onClear(): void {
            for (let k in this.boneTimelines) {
                for (let kA in this.boneTimelines[k]) {
                    this.boneTimelines[k][kA].returnToPool();
                }

                delete this.boneTimelines[k];
            }

            for (let k in this.slotTimelines) {
                for (let kA in this.slotTimelines[k]) {
                    this.slotTimelines[k][kA].returnToPool();
                }

                delete this.slotTimelines[k];
            }

            for (let k in this.boneCachedFrameIndices) {
                delete this.boneCachedFrameIndices[k];
            }

            for (let k in this.slotCachedFrameIndices) {
                delete this.slotCachedFrameIndices[k];
            }

            if (this.actionTimeline !== null) {
                this.actionTimeline.returnToPool();
            }

            if (this.zOrderTimeline !== null) {
                this.zOrderTimeline.returnToPool();
            }

            this.frameIntOffset = 0;
            this.frameFloatOffset = 0;
            this.frameOffset = 0;
            this.frameCount = 0;
            this.playTimes = 0;
            this.duration = 0.0;
            this.scale = 1.0;
            this.fadeInTime = 0.0;
            this.cacheFrameRate = 0.0;
            this.name = "";
            this.cachedFrames.length = 0;
            //this.boneTimelines.clear();
            //this.slotTimelines.clear();
            //this.boneCachedFrameIndices.clear();
            //this.slotCachedFrameIndices.clear();
            this.actionTimeline = null;
            this.zOrderTimeline = null;
            this.parent = null as any; //
        }
        /**
         * @private
         */
        public cacheFrames(frameRate: number): void {
            if (this.cacheFrameRate > 0.0) { // TODO clear cache.
                return;
            }

            this.cacheFrameRate = Math.max(Math.ceil(frameRate * this.scale), 1.0);
            const cacheFrameCount = Math.ceil(this.cacheFrameRate * this.duration) + 1; // Cache one more frame.

            this.cachedFrames.length = cacheFrameCount;
            for (let i = 0, l = this.cacheFrames.length; i < l; ++i) {
                this.cachedFrames[i] = false;
            }

            for (const bone of this.parent.sortedBones) {
                const indices = new Array<number>(cacheFrameCount);
                for (let i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }

                this.boneCachedFrameIndices[bone.name] = indices;
            }

            for (const slot of this.parent.sortedSlots) {
                const indices = new Array<number>(cacheFrameCount);
                for (let i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }

                this.slotCachedFrameIndices[slot.name] = indices;
            }
        }
        /**
         * @private
         */
        public addBoneTimeline(bone: BoneData, timeline: TimelineData): void {
            const timelines = bone.name in this.boneTimelines ? this.boneTimelines[bone.name] : (this.boneTimelines[bone.name] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        public addSlotTimeline(slot: SlotData, timeline: TimelineData): void {
            const timelines = slot.name in this.slotTimelines ? this.slotTimelines[slot.name] : (this.slotTimelines[slot.name] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        public getBoneTimelines(name: string): Array<TimelineData> | null {
            return name in this.boneTimelines ? this.boneTimelines[name] : null;
        }
        /**
         * @private
         */
        public getSlotTimeline(name: string): Array<TimelineData> | null {
            return name in this.slotTimelines ? this.slotTimelines[name] : null;
        }
        /**
         * @private
         */
        public getBoneCachedFrameIndices(name: string): Array<number> | null {
            return name in this.boneCachedFrameIndices ? this.boneCachedFrameIndices[name] : null;
        }
        /**
         * @private
         */
        public getSlotCachedFrameIndices(name: string): Array<number> | null {
            return name in this.slotCachedFrameIndices ? this.slotCachedFrameIndices[name] : null;
        }
    }
    /**
     * @private
     */
    export class TimelineData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.TimelineData]";
        }

        public type: TimelineType;
        public offset: number; // TimelineArray.
        public frameIndicesOffset: number; // FrameIndices.

        protected _onClear(): void {
            this.type = TimelineType.BoneAll;
            this.offset = 0;
            this.frameIndicesOffset = -1;
        }
    }
}