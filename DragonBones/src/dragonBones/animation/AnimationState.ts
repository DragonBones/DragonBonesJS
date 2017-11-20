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
     * - The animation state is generated when the animation data is played.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画状态由播放动画数据时产生。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class AnimationState extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.AnimationState]";
        }
        /**
         * @private
         */
        public actionEnabled: boolean;
        /**
         * @private
         */
        public additiveBlending: boolean;
        /**
         * - Whether the animation state has control over the display object properties of the slots.
         * Sometimes blend a animation state does not want it to control the display object properties of the slots,
         * especially if other animation state are controlling the display object properties of the slots.
         * @default true
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态是否对插槽的显示对象属性有控制权。
         * 有时混合一个动画状态并不希望其控制插槽的显示对象属性，
         * 尤其是其他动画状态正在控制这些插槽的显示对象属性时。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public displayControl: boolean;
        /**
         * - Whether to reset the objects without animation to the armature pose when the animation state is start to play.
         * This property should usually be set to false when blend multiple animation states.
         * @default true
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 开始播放动画状态时是否将没有动画的对象重置为骨架初始值。
         * 通常在混合多个动画状态时应该将该属性设置为 false。
         * @default true
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public resetToPose: boolean;
        /**
         * - The play times. [0: Loop play, [1~N]: Play N times]
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public playTimes: number;
        /**
         * - The blend layer.
         * High layer animation state will get the blend weight first.
         * When the blend weight is assigned more than 1, the remaining animation states will no longer get the weight assigned.
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合图层。
         * 图层高的动画状态会优先获取混合权重。
         * 当混合权重分配超过 1 时，剩余的动画状态将不再获得权重分配。
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public layer: number;
        /**
         * - The play speed.
         * The value is an overlay relationship with {@link dragonBones.Animation#timeScale}.
         * [(-N~0): Reverse play, 0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放速度。
         * 该值与 {@link dragonBones.Animation#timeScale} 是叠加关系。
         * [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public timeScale: number;
        /**
         * - The blend weight.
         * @default 1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合权重。
         * @default 1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public weight: number;
        /**
         * - The auto fade out time when the animation state play completed.
         * [-1: Do not fade out automatically, [0~N]: The fade out time] (In seconds)
         * @default -1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态播放完成后的自动淡出时间。
         * [-1: 不自动淡出, [0~N]: 淡出时间] （以秒为单位）
         * @default -1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public autoFadeOutTime: number;
        /**
         * @private
         */
        public fadeTotalTime: number;
        /**
         * - The name of the animation state. (Can be different from the name of the animation data)
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 动画状态名称。 （可以不同于动画数据）
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public name: string;
        /**
         * - The blend group name of the animation state.
         * This property is typically used to specify the substitution of multiple animation states blend.
         * @readonly
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合组名称。
         * 该属性通常用来指定多个动画状态混合时的相互替换关系。
         * @readonly
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public group: string;
        /**
         * @internal
         * @private
         */
        public _timelineDirty: boolean;
        /**
         * - xx: Play Enabled, Fade Play Enabled
         * @internal
         * @private
         */
        public _playheadState: number;
        /**
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         * @internal
         * @private
         */
        public _fadeState: number;
        /**
         * -1: Fade start, 0: Fading, 1: Fade complete;
         * @internal
         * @private
         */
        public _subFadeState: number;
        /**
         * @internal
         * @private
         */
        public _position: number;
        /**
         * @internal
         * @private
         */
        public _duration: number;
        private _fadeTime: number;
        private _time: number;
        /**
         * @internal
         * @private
         */
        public _fadeProgress: number;
        private _weightResult: number;
        private readonly _boneMask: Array<string> = [];
        private readonly _boneTimelines: Array<BoneTimelineState> = [];
        private readonly _slotTimelines: Array<SlotTimelineState> = [];
        private readonly _constraintTimelines: Array<ConstraintTimelineState> = [];
        private readonly _poseTimelines: Array<TimelineState> = [];
        private readonly _bonePoses: Map<BonePose> = {};
        /**
         * @internal
         * @private
         */
        public _animationData: AnimationData;
        private _armature: Armature;
        /**
         * @internal
         * @private
         */
        public _actionTimeline: ActionTimelineState = null as any; // Initial value.
        private _zOrderTimeline: ZOrderTimelineState | null = null; // Initial value.
        /**
         * @private
         */
        protected _onClear(): void {
            for (const timeline of this._boneTimelines) {
                timeline.returnToPool();
            }

            for (const timeline of this._slotTimelines) {
                timeline.returnToPool();
            }

            for (const timeline of this._constraintTimelines) {
                timeline.returnToPool();
            }

            for (let k in this._bonePoses) {
                this._bonePoses[k].returnToPool();
                delete this._bonePoses[k];
            }

            if (this._actionTimeline !== null) {
                this._actionTimeline.returnToPool();
            }

            if (this._zOrderTimeline !== null) {
                this._zOrderTimeline.returnToPool();
            }

            this.actionEnabled = false;
            this.additiveBlending = false;
            this.displayControl = false;
            this.resetToPose = false;
            this.playTimes = 1;
            this.layer = 0;
            this.timeScale = 1.0;
            this.weight = 1.0;
            this.autoFadeOutTime = 0.0;
            this.fadeTotalTime = 0.0;
            this.name = "";
            this.group = "";

            this._timelineDirty = true;
            this._playheadState = 0;
            this._fadeState = -1;
            this._subFadeState = -1;
            this._position = 0.0;
            this._duration = 0.0;
            this._fadeTime = 0.0;
            this._time = 0.0;
            this._fadeProgress = 0.0;
            this._weightResult = 0.0;
            this._boneMask.length = 0;
            this._boneTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._constraintTimelines.length = 0;
            this._poseTimelines.length = 0;
            // this._bonePoses.clear();
            this._animationData = null as any; //
            this._armature = null as any; //
            this._actionTimeline = null as any; //
            this._zOrderTimeline = null;
        }

        private _updateTimelines(): void {
            { // Update bone timelines.
                const boneTimelines: Map<Array<BoneTimelineState>> = {};
                for (const timeline of this._boneTimelines) { // Create bone timelines map.
                    const timelineName = timeline.bone.name;
                    if (!(timelineName in boneTimelines)) {
                        boneTimelines[timelineName] = [];
                    }

                    boneTimelines[timelineName].push(timeline);
                }

                for (const bone of this._armature.getBones()) {
                    const timelineName = bone.name;
                    if (!this.containsBoneMask(timelineName)) {
                        continue;
                    }

                    const timelineDatas = this._animationData.getBoneTimelines(timelineName);
                    if (timelineName in boneTimelines) { // Remove bone timeline from map.
                        delete boneTimelines[timelineName];
                    }
                    else { // Create new bone timeline.
                        const bonePose = timelineName in this._bonePoses ? this._bonePoses[timelineName] : (this._bonePoses[timelineName] = BaseObject.borrowObject(BonePose));

                        if (timelineDatas !== null) {
                            for (const timelineData of timelineDatas) {
                                switch (timelineData.type) {
                                    case TimelineType.BoneAll: {
                                        const timeline = BaseObject.borrowObject(BoneAllTimelineState);
                                        timeline.bone = bone;
                                        timeline.bonePose = bonePose;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.BoneTranslate: {
                                        const timeline = BaseObject.borrowObject(BoneTranslateTimelineState);
                                        timeline.bone = bone;
                                        timeline.bonePose = bonePose;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.BoneRotate: {
                                        const timeline = BaseObject.borrowObject(BoneRotateTimelineState);
                                        timeline.bone = bone;
                                        timeline.bonePose = bonePose;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.BoneScale: {
                                        const timeline = BaseObject.borrowObject(BoneScaleTimelineState);
                                        timeline.bone = bone;
                                        timeline.bonePose = bonePose;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    default:
                                        break;
                                }
                            }
                        }
                        else if (this.resetToPose) { // Pose timeline.
                            const timeline = BaseObject.borrowObject(BoneAllTimelineState);
                            timeline.bone = bone;
                            timeline.bonePose = bonePose;
                            timeline.init(this._armature, this, null);
                            this._boneTimelines.push(timeline);
                            this._poseTimelines.push(timeline);
                        }
                    }
                }

                for (let k in boneTimelines) { // Remove bone timelines.
                    for (const timeline of boneTimelines[k]) {
                        this._boneTimelines.splice(this._boneTimelines.indexOf(timeline), 1);
                        timeline.returnToPool();
                    }
                }
            }

            { // Update slot timelines.
                const slotTimelines: Map<Array<SlotTimelineState>> = {};
                const ffdFlags: Array<number> = [];

                for (const timeline of this._slotTimelines) { // Create slot timelines map.
                    const timelineName = timeline.slot.name;
                    if (!(timelineName in slotTimelines)) {
                        slotTimelines[timelineName] = [];
                    }

                    slotTimelines[timelineName].push(timeline);
                }

                for (const slot of this._armature.getSlots()) {
                    const boneName = slot.parent.name;
                    if (!this.containsBoneMask(boneName)) {
                        continue;
                    }

                    const timelineName = slot.name;
                    const timelineDatas = this._animationData.getSlotTimelines(timelineName);

                    if (timelineName in slotTimelines) { // Remove slot timeline from map.
                        delete slotTimelines[timelineName];
                    }
                    else { // Create new slot timeline.
                        let displayIndexFlag = false;
                        let colorFlag = false;
                        ffdFlags.length = 0;

                        if (timelineDatas !== null) {
                            for (const timelineData of timelineDatas) {
                                switch (timelineData.type) {
                                    case TimelineType.SlotDisplay: {
                                        const timeline = BaseObject.borrowObject(SlotDislayTimelineState);
                                        timeline.slot = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        displayIndexFlag = true;
                                        break;
                                    }

                                    case TimelineType.SlotColor: {
                                        const timeline = BaseObject.borrowObject(SlotColorTimelineState);
                                        timeline.slot = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        colorFlag = true;
                                        break;
                                    }

                                    case TimelineType.SlotFFD: {
                                        const timeline = BaseObject.borrowObject(SlotFFDTimelineState);
                                        timeline.slot = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        ffdFlags.push(timeline.meshOffset);
                                        break;
                                    }

                                    default:
                                        break;
                                }
                            }
                        }

                        if (this.resetToPose) { // Pose timeline.
                            if (!displayIndexFlag) {
                                const timeline = BaseObject.borrowObject(SlotDislayTimelineState);
                                timeline.slot = slot;
                                timeline.init(this._armature, this, null);
                                this._slotTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }

                            if (!colorFlag) {
                                const timeline = BaseObject.borrowObject(SlotColorTimelineState);
                                timeline.slot = slot;
                                timeline.init(this._armature, this, null);
                                this._slotTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }

                            if (slot.rawDisplayDatas !== null) {
                                for (const displayData of slot.rawDisplayDatas) {
                                    if (displayData !== null && displayData.type === DisplayType.Mesh) {
                                        const meshOffset = (displayData as MeshDisplayData).offset;
                                        if (ffdFlags.indexOf(meshOffset) < 0) {
                                            const timeline = BaseObject.borrowObject(SlotFFDTimelineState);
                                            timeline.meshOffset = meshOffset; //
                                            timeline.slot = slot;
                                            timeline.init(this._armature, this, null);
                                            this._slotTimelines.push(timeline);
                                            this._poseTimelines.push(timeline);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (let k in slotTimelines) { // Remove slot timelines.
                    for (const timeline of slotTimelines[k]) {
                        this._slotTimelines.splice(this._slotTimelines.indexOf(timeline), 1);
                        timeline.returnToPool();
                    }
                }
            }

            { // Update constraint timelines.
                const constraintTimelines: Map<Array<ConstraintTimelineState>> = {};
                for (const timeline of this._constraintTimelines) { // Create constraint timelines map.
                    const timelineName = timeline.constraint.name;
                    if (!(timelineName in constraintTimelines)) {
                        constraintTimelines[timelineName] = [];
                    }

                    constraintTimelines[timelineName].push(timeline);
                }

                for (const constraint of this._armature._constraints) {
                    const timelineName = constraint.name;
                    const timelineDatas = this._animationData.getConstraintTimelines(timelineName);

                    if (timelineName in constraintTimelines) { // Remove constraint timeline from map.
                        delete constraintTimelines[timelineName];
                    }
                    else { // Create new constraint timeline.
                        if (timelineDatas !== null) {
                            for (const timelineData of timelineDatas) {
                                switch (timelineData.type) {
                                    case TimelineType.IKConstraint: {
                                        const timeline = BaseObject.borrowObject(IKConstraintTimelineState);
                                        timeline.constraint = constraint;
                                        timeline.init(this._armature, this, timelineData);
                                        this._constraintTimelines.push(timeline);
                                        break;
                                    }

                                    default:
                                        break;
                                }
                            }
                        }
                        else if (this.resetToPose) { // Pose timeline.
                            const timeline = BaseObject.borrowObject(IKConstraintTimelineState);
                            timeline.constraint = constraint;
                            timeline.init(this._armature, this, null);
                            this._constraintTimelines.push(timeline);
                            this._poseTimelines.push(timeline);
                        }
                    }
                }

                for (let k in constraintTimelines) { // Remove constraint timelines.
                    for (const timeline of constraintTimelines[k]) {
                        this._constraintTimelines.splice(this._constraintTimelines.indexOf(timeline), 1);
                        timeline.returnToPool();
                    }
                }
            }
        }

        private _advanceFadeTime(passedTime: number): void {
            const isFadeOut = this._fadeState > 0;

            if (this._subFadeState < 0) { // Fade start event.
                this._subFadeState = 0;

                const eventType = isFadeOut ? EventObject.FADE_OUT : EventObject.FADE_IN;
                if (this._armature.eventDispatcher.hasDBEventListener(eventType)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.type = eventType;
                    eventObject.armature = this._armature;
                    eventObject.animationState = this;
                    this._armature._dragonBones.bufferEvent(eventObject);
                }
            }

            if (passedTime < 0.0) {
                passedTime = -passedTime;
            }

            this._fadeTime += passedTime;

            if (this._fadeTime >= this.fadeTotalTime) { // Fade complete.
                this._subFadeState = 1;
                this._fadeProgress = isFadeOut ? 0.0 : 1.0;
            }
            else if (this._fadeTime > 0.0) { // Fading.
                this._fadeProgress = isFadeOut ? (1.0 - this._fadeTime / this.fadeTotalTime) : (this._fadeTime / this.fadeTotalTime);
            }
            else { // Before fade.
                this._fadeProgress = isFadeOut ? 1.0 : 0.0;
            }

            if (this._subFadeState > 0) { // Fade complete event.
                if (!isFadeOut) {
                    this._playheadState |= 1; // x1
                    this._fadeState = 0;
                }

                const eventType = isFadeOut ? EventObject.FADE_OUT_COMPLETE : EventObject.FADE_IN_COMPLETE;
                if (this._armature.eventDispatcher.hasDBEventListener(eventType)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.type = eventType;
                    eventObject.armature = this._armature;
                    eventObject.animationState = this;
                    this._armature._dragonBones.bufferEvent(eventObject);
                }
            }
        }

        private _blendBoneTimline(timeline: BoneTimelineState): void {
            let boneWeight = this._weightResult > 0.0 ? this._weightResult : -this._weightResult;
            const bone = timeline.bone;
            const bonePose = timeline.bonePose.result;
            const animationPose = bone.animationPose;

            if (!bone._blendDirty) {
                bone._blendDirty = true;
                bone._blendLayer = this.layer;
                bone._blendLayerWeight = boneWeight;
                bone._blendLeftWeight = 1.0;
                //
                animationPose.x = bonePose.x * boneWeight;
                animationPose.y = bonePose.y * boneWeight;
                animationPose.rotation = bonePose.rotation * boneWeight;
                animationPose.skew = bonePose.skew * boneWeight;
                animationPose.scaleX = (bonePose.scaleX - 1.0) * boneWeight + 1.0;
                animationPose.scaleY = (bonePose.scaleY - 1.0) * boneWeight + 1.0;
            }
            else {
                boneWeight *= bone._blendLeftWeight;
                bone._blendLayerWeight += boneWeight;
                //
                animationPose.x += bonePose.x * boneWeight;
                animationPose.y += bonePose.y * boneWeight;
                animationPose.rotation += bonePose.rotation * boneWeight;
                animationPose.skew += bonePose.skew * boneWeight;
                animationPose.scaleX += (bonePose.scaleX - 1.0) * boneWeight;
                animationPose.scaleY += (bonePose.scaleY - 1.0) * boneWeight;
            }

            if (this._fadeState !== 0 || this._subFadeState !== 0) {
                bone._transformDirty = true;
            }
        }
        /**
         * @internal
         * @private
         */
        public init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void {
            if (this._armature !== null) {
                return;
            }

            this._armature = armature;
            this._animationData = animationData;
            //
            this.resetToPose = animationConfig.resetToPose;
            this.additiveBlending = animationConfig.additiveBlending;
            this.displayControl = animationConfig.displayControl;
            this.actionEnabled = animationConfig.actionEnabled;
            this.layer = animationConfig.layer;
            this.playTimes = animationConfig.playTimes;
            this.timeScale = animationConfig.timeScale;
            this.fadeTotalTime = animationConfig.fadeInTime;
            this.autoFadeOutTime = animationConfig.autoFadeOutTime;
            this.weight = animationConfig.weight;
            this.name = animationConfig.name.length > 0 ? animationConfig.name : animationConfig.animation;
            this.group = animationConfig.group;

            if (animationConfig.pauseFadeIn) {
                this._playheadState = 2; // 10
            }
            else {
                this._playheadState = 3; // 11
            }

            if (animationConfig.duration < 0.0) {
                this._position = 0.0;
                this._duration = this._animationData.duration;

                if (animationConfig.position !== 0.0) {
                    if (this.timeScale >= 0.0) {
                        this._time = animationConfig.position;
                    }
                    else {
                        this._time = animationConfig.position - this._duration;
                    }
                }
                else {
                    this._time = 0.0;
                }
            }
            else {
                this._position = animationConfig.position;
                this._duration = animationConfig.duration;
                this._time = 0.0;
            }

            if (this.timeScale < 0.0 && this._time === 0.0) {
                this._time = -0.000001; // Turn to end.
            }

            if (this.fadeTotalTime <= 0.0) {
                this._fadeProgress = 0.999999; // Make different.
            }

            if (animationConfig.boneMask.length > 0) {
                this._boneMask.length = animationConfig.boneMask.length;
                for (let i = 0, l = this._boneMask.length; i < l; ++i) {
                    this._boneMask[i] = animationConfig.boneMask[i];
                }
            }

            this._actionTimeline = BaseObject.borrowObject(ActionTimelineState);
            this._actionTimeline.init(this._armature, this, this._animationData.actionTimeline);
            this._actionTimeline.currentTime = this._time;
            if (this._actionTimeline.currentTime < 0.0) {
                this._actionTimeline.currentTime = this._duration - this._actionTimeline.currentTime;
            }

            if (this._animationData.zOrderTimeline !== null) {
                this._zOrderTimeline = BaseObject.borrowObject(ZOrderTimelineState);
                this._zOrderTimeline.init(this._armature, this, this._animationData.zOrderTimeline);
            }
        }
        /**
         * @internal
         * @private
         */
        public advanceTime(passedTime: number, cacheFrameRate: number): void {
            // Update fade time.
            if (this._fadeState !== 0 || this._subFadeState !== 0) {
                this._advanceFadeTime(passedTime);
            }

            // Update time.
            if (this._playheadState === 3) { // 11
                if (this.timeScale !== 1.0) {
                    passedTime *= this.timeScale;
                }

                this._time += passedTime;
            }

            if (this._timelineDirty) {
                this._timelineDirty = false;
                this._updateTimelines();
            }

            if (this.weight === 0.0) {
                return;
            }

            const isCacheEnabled = this._fadeState === 0 && cacheFrameRate > 0.0;
            let isUpdateTimeline = true;
            let isUpdateBoneTimeline = true;
            let time = this._time;
            this._weightResult = this.weight * this._fadeProgress;

            if (this._actionTimeline.playState <= 0) {
                this._actionTimeline.update(time); // Update main timeline.
            }

            if (isCacheEnabled) { // Cache time internval.
                const internval = cacheFrameRate * 2.0;
                this._actionTimeline.currentTime = Math.floor(this._actionTimeline.currentTime * internval) / internval;
            }

            if (this._zOrderTimeline !== null && this._zOrderTimeline.playState <= 0) { // Update zOrder timeline.
                this._zOrderTimeline.update(time);
            }

            if (isCacheEnabled) { // Update cache.
                const cacheFrameIndex = Math.floor(this._actionTimeline.currentTime * cacheFrameRate); // uint
                if (this._armature._cacheFrameIndex === cacheFrameIndex) { // Same cache.
                    isUpdateTimeline = false;
                    isUpdateBoneTimeline = false;
                }
                else {
                    this._armature._cacheFrameIndex = cacheFrameIndex;
                    if (this._animationData.cachedFrames[cacheFrameIndex]) { // Cached.
                        isUpdateBoneTimeline = false;
                    }
                    else { // Cache.
                        this._animationData.cachedFrames[cacheFrameIndex] = true;
                    }
                }
            }

            if (isUpdateTimeline) {
                if (isUpdateBoneTimeline) { // Update bone timelines.
                    let bone: Bone | null = null;
                    let prevTimeline: BoneTimelineState = null as any; //

                    for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                        const timeline = this._boneTimelines[i];
                        if (bone !== timeline.bone) { // Blend bone pose.
                            if (bone !== null) {
                                this._blendBoneTimline(prevTimeline);

                                if (bone._blendDirty) {
                                    if (bone._blendLeftWeight > 0.0) {
                                        if (bone._blendLayer !== this.layer) {
                                            if (bone._blendLayerWeight >= bone._blendLeftWeight) {
                                                bone._blendLeftWeight = 0.0;
                                                bone = null;
                                            }
                                            else {
                                                bone._blendLayer = this.layer;
                                                bone._blendLeftWeight -= bone._blendLayerWeight;
                                                bone._blendLayerWeight = 0.0;
                                            }
                                        }
                                    }
                                    else {
                                        bone = null;
                                    }
                                }
                            }

                            bone = timeline.bone;
                        }

                        if (bone !== null) {
                            if (timeline.playState <= 0) {
                                timeline.update(time);
                            }

                            if (i === l - 1) {
                                this._blendBoneTimline(timeline);
                            }
                            else {
                                prevTimeline = timeline;
                            }
                        }
                    }
                }

                if (this.displayControl) {
                    for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                        const timeline = this._slotTimelines[i];
                        const displayController = timeline.slot.displayController;

                        if (
                            displayController === null ||
                            displayController === this.name ||
                            displayController === this.group
                        ) {
                            if (timeline.playState <= 0) {
                                timeline.update(time);
                            }
                        }
                    }
                }

                for (let i = 0, l = this._constraintTimelines.length; i < l; ++i) {
                    const timeline = this._constraintTimelines[i];
                    if (timeline.playState <= 0) {
                        timeline.update(time);
                    }
                }
            }

            if (this._fadeState === 0) {
                if (this._subFadeState > 0) {
                    this._subFadeState = 0;

                    if (this._poseTimelines.length > 0) {
                        for (const timeline of this._poseTimelines) {
                            if (timeline instanceof BoneTimelineState) {
                                const index = this._boneTimelines.indexOf(timeline);
                                this._boneTimelines.splice(index, 1);
                            }
                            else if (timeline instanceof SlotTimelineState) {
                                const index = this._slotTimelines.indexOf(timeline);
                                this._slotTimelines.splice(index, 1);
                            }
                            else if (timeline instanceof ConstraintTimelineState) {
                                const index = this._constraintTimelines.indexOf(timeline);
                                this._constraintTimelines.splice(index, 1);
                            }

                            timeline.returnToPool();
                        }

                        this._poseTimelines.length = 0;
                    }
                }

                if (this._actionTimeline.playState > 0) {
                    if (this.autoFadeOutTime >= 0.0) { // Auto fade out.
                        this.fadeOut(this.autoFadeOutTime);
                    }
                }
            }
        }
        /**
         * - Continue play.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 继续播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public play(): void {
            this._playheadState = 3; // 11
        }
        /**
         * - Stop play.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public stop(): void {
            this._playheadState &= 1; // 0x
        }
        /**
         * - Fade out the animation state.
         * @param fadeOutTime - The fade out time. (In seconds)
         * @param pausePlayhead - Whether to pause the animation playing when fade out.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 淡出动画状态。
         * @param fadeOutTime - 淡出时间。 （以秒为单位）
         * @param pausePlayhead - 淡出时是否暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public fadeOut(fadeOutTime: number, pausePlayhead: boolean = true): void {
            if (fadeOutTime < 0.0) {
                fadeOutTime = 0.0;
            }

            if (pausePlayhead) {
                this._playheadState &= 2; // x0
            }

            if (this._fadeState > 0) {
                if (fadeOutTime > this.fadeTotalTime - this._fadeTime) { // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._fadeState = 1;
                this._subFadeState = -1;

                if (fadeOutTime <= 0.0 || this._fadeProgress <= 0.0) {
                    this._fadeProgress = 0.000001; // Modify fade progress to different value.
                }

                for (const timeline of this._boneTimelines) {
                    timeline.fadeOut();
                }

                for (const timeline of this._slotTimelines) {
                    timeline.fadeOut();
                }
            }

            this.displayControl = false; //
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0.0;
            this._fadeTime = this.fadeTotalTime * (1.0 - this._fadeProgress);
        }
        /**
         * - Check if a specific bone mask is included.
         * @param name - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含特定骨骼遮罩。
         * @param name - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public containsBoneMask(name: string): boolean {
            return this._boneMask.length === 0 || this._boneMask.indexOf(name) >= 0;
        }
        /**
         * - Add a specific bone mask.
         * @param name - The bone name.
         * @param recursive - Whether or not to add a mask to the bone's sub-bone.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 添加特定的骨骼遮罩。
         * @param name - 骨骼名称。
         * @param recursive - 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public addBoneMask(name: string, recursive: boolean = true): void {
            const currentBone = this._armature.getBone(name);
            if (currentBone === null) {
                return;
            }

            if (this._boneMask.indexOf(name) < 0) { // Add mixing
                this._boneMask.push(name);
            }

            if (recursive) { // Add recursive mixing.
                for (const bone of this._armature.getBones()) {
                    if (this._boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                        this._boneMask.push(bone.name);
                    }
                }
            }

            this._timelineDirty = true;
        }
        /**
         * - Remove the mask of a specific bone.
         * @param name - The bone name.
         * @param recursive - Whether to remove the bone's sub-bone mask.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 删除特定骨骼的遮罩。
         * @param name - 骨骼名称。
         * @param recursive - 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public removeBoneMask(name: string, recursive: boolean = true): void {
            const index = this._boneMask.indexOf(name);
            if (index >= 0) { // Remove mixing.
                this._boneMask.splice(index, 1);
            }

            if (recursive) {
                const currentBone = this._armature.getBone(name);
                if (currentBone !== null) {
                    const bones = this._armature.getBones();
                    if (this._boneMask.length > 0) { // Remove recursive mixing.
                        for (const bone of bones) {
                            const index = this._boneMask.indexOf(bone.name);
                            if (index >= 0 && currentBone.contains(bone)) {
                                this._boneMask.splice(index, 1);
                            }
                        }
                    }
                    else { // Add unrecursive mixing.
                        for (const bone of bones) {
                            if (bone === currentBone) {
                                continue;
                            }

                            if (!currentBone.contains(bone)) {
                                this._boneMask.push(bone.name);
                            }
                        }
                    }
                }
            }

            this._timelineDirty = true;
        }
        /**
         * - Remove all bone masks.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public removeAllBoneMask(): void {
            this._boneMask.length = 0;
            this._timelineDirty = true;
        }
        /**
         * - Whether the animation state is fading in.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否正在淡入。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public get isFadeIn(): boolean {
            return this._fadeState < 0;
        }
        /**
         * - Whether the animation state is fading out.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否正在淡出。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public get isFadeOut(): boolean {
            return this._fadeState > 0;
        }
        /**
         * - Whether the animation state is fade completed.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否淡入或淡出完毕。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public get isFadeComplete(): boolean {
            return this._fadeState === 0;
        }
        /**
         * - Whether the animation state is playing.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 是否正在播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get isPlaying(): boolean {
            return (this._playheadState & 2) !== 0 && this._actionTimeline.playState <= 0;
        }
        /**
         * - Whether the animation state is play completed.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 是否播放完毕。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get isCompleted(): boolean {
            return this._actionTimeline.playState > 0;
        }
        /**
         * - The times has been played.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 已经循环播放的次数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get currentPlayTimes(): number {
            return this._actionTimeline.currentPlayTimes;
        }
        /**
         * - The total time. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 总播放时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get totalTime(): number {
            return this._duration;
        }
        /**
         * - The time is currently playing. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 当前播放的时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get currentTime(): number {
            return this._actionTimeline.currentTime;
        }
        public set currentTime(value: number) {
            const currentPlayTimes = this._actionTimeline.currentPlayTimes - (this._actionTimeline.playState > 0 ? 1 : 0);
            if (value < 0 || this._duration < value) {
                value = (value % this._duration) + currentPlayTimes * this._duration;
                if (value < 0) {
                    value += this._duration;
                }
            }

            if (this.playTimes > 0 && currentPlayTimes === this.playTimes - 1 && value === this._duration) {
                value = this._duration - 0.000001;
            }

            if (this._time === value) {
                return;
            }

            this._time = value;
            this._actionTimeline.setCurrentTime(this._time);

            if (this._zOrderTimeline !== null) {
                this._zOrderTimeline.playState = -1;
            }

            for (const timeline of this._boneTimelines) {
                timeline.playState = -1;
            }

            for (const timeline of this._slotTimelines) {
                timeline.playState = -1;
            }
        }
        /**
         * - The animation data.
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get animationData(): AnimationData {
            return this._animationData;
        }
    }
    /**
     * @internal
     * @private
     */
    export class BonePose extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.BonePose]";
        }

        public readonly current: Transform = new Transform();
        public readonly delta: Transform = new Transform();
        public readonly result: Transform = new Transform();

        protected _onClear(): void {
            this.current.identity();
            this.delta.identity();
            this.result.identity();
        }
    }
}