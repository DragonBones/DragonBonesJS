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
     * - The animation data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class AnimationData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.AnimationData]";
        }
        /**
         * - FrameIntArray.
         * @internal
         * @private
         */
        public frameIntOffset: number;
        /**
         * - FrameFloatArray.
         * @internal
         * @private
         */
        public frameFloatOffset: number;
        /**
         * - FrameArray.
         * @internal
         * @private
         */
        public frameOffset: number;
        /**
         * - The frame count of the animation.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的帧数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public frameCount: number;
        /**
         * - The play times of the animation. [0: Loop play, [1~N]: Play N times]
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public playTimes: number;
        /**
         * - The duration of the animation. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的持续时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public duration: number;
        /**
         * @private
         */
        public scale: number;
        /**
         * - The fade in time of the animation. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画的淡入时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public fadeInTime: number;
        /**
         * @private
         */
        public cacheFrameRate: number;
        /**
         * - The animation name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画名称。
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
        public readonly constraintTimelines: Map<Array<TimelineData>> = {};
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
         * @inheritDoc
         */
        protected _onClear(): void {
            for (let k in this.boneTimelines) {
                for (const timeline of this.boneTimelines[k]) {
                    timeline.returnToPool();
                }

                delete this.boneTimelines[k];
            }

            for (let k in this.slotTimelines) {
                for (const timeline of this.slotTimelines[k]) {
                    timeline.returnToPool();
                }

                delete this.slotTimelines[k];
            }

            for (let k in this.constraintTimelines) {
                for (const timeline of this.constraintTimelines[k]) {
                    timeline.returnToPool();
                }

                delete this.constraintTimelines[k];
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
            //this.constraintTimelines.clear();
            //this.boneCachedFrameIndices.clear();
            //this.slotCachedFrameIndices.clear();
            this.actionTimeline = null;
            this.zOrderTimeline = null;
            this.parent = null as any; //
        }
        /**
         * @internal
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
        public addConstraintTimeline(constraint: ConstraintData, timeline: TimelineData): void {
            const timelines = constraint.name in this.constraintTimelines ? this.constraintTimelines[constraint.name] : (this.constraintTimelines[constraint.name] = []);
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
        public getSlotTimelines(name: string): Array<TimelineData> | null {
            return name in this.slotTimelines ? this.slotTimelines[name] : null;
        }
        /**
         * @private
         */
        public getConstraintTimelines(name: string): Array<TimelineData> | null {
            return name in this.constraintTimelines ? this.constraintTimelines[name] : null;
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
     * @internal
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