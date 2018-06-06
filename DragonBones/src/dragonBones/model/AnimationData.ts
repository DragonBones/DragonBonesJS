/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
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
         */
        public frameIntOffset: number;
        /**
         * - FrameFloatArray.
         * @internal
         */
        public frameFloatOffset: number;
        /**
         * - FrameArray.
         * @internal
         */
        public frameOffset: number;
        /**
         * @private
         */
        public blendType: AnimationBlendType;
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
        public readonly animationTimelines: Map<Array<TimelineData>> = {};
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

            for (let k in this.animationTimelines) {
                for (const timeline of this.animationTimelines[k]) {
                    timeline.returnToPool();
                }

                delete this.animationTimelines[k];
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
            this.blendType = AnimationBlendType.None;
            this.frameCount = 0;
            this.playTimes = 0;
            this.duration = 0.0;
            this.scale = 1.0;
            this.fadeInTime = 0.0;
            this.cacheFrameRate = 0.0;
            this.name = "";
            this.cachedFrames.length = 0;
            // this.boneTimelines.clear();
            // this.slotTimelines.clear();
            // this.constraintTimelines.clear();
            // this.animationTimelines.clear();
            // this.boneCachedFrameIndices.clear();
            // this.slotCachedFrameIndices.clear();
            this.actionTimeline = null;
            this.zOrderTimeline = null;
            this.parent = null as any; //
        }
        /**
         * @internal
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
        public addBoneTimeline(timelineName: string, timeline: TimelineData): void {
            const timelines = timelineName in this.boneTimelines ? this.boneTimelines[timelineName] : (this.boneTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        public addSlotTimeline(timelineName: string, timeline: TimelineData): void {
            const timelines = timelineName in this.slotTimelines ? this.slotTimelines[timelineName] : (this.slotTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        public addConstraintTimeline(timelineName: string, timeline: TimelineData): void {
            const timelines = timelineName in this.constraintTimelines ? this.constraintTimelines[timelineName] : (this.constraintTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        public addAnimationTimeline(timelineName: string, timeline: TimelineData): void {
            const timelines = timelineName in this.animationTimelines ? this.animationTimelines[timelineName] : (this.animationTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        public getBoneTimelines(timelineName: string): Array<TimelineData> | null {
            return timelineName in this.boneTimelines ? this.boneTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        public getSlotTimelines(timelineName: string): Array<TimelineData> | null {
            return timelineName in this.slotTimelines ? this.slotTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        public getConstraintTimelines(timelineName: string): Array<TimelineData> | null {
            return timelineName in this.constraintTimelines ? this.constraintTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        public getAnimationTimelines(timelineName: string): Array<TimelineData> | null {
            return timelineName in this.animationTimelines ? this.animationTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        public getBoneCachedFrameIndices(boneName: string): Array<number> | null {
            return boneName in this.boneCachedFrameIndices ? this.boneCachedFrameIndices[boneName] : null;
        }
        /**
         * @private
         */
        public getSlotCachedFrameIndices(slotName: string): Array<number> | null {
            return slotName in this.slotCachedFrameIndices ? this.slotCachedFrameIndices[slotName] : null;
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
    /**
     * @internal
     */
    export class AnimationTimelineData extends TimelineData {
        public static toString(): string {
            return "[class dragonBones.AnimationTimelineData]";
        }

        public x: number;
        public y: number;

        protected _onClear(): void {
            super._onClear();

            this.x = 0.0;
            this.y = 0.0;
        }
    }
}