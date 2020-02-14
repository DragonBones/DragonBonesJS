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
        public additive: boolean;
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
         * @private
         */
        public blendType: AnimationBlendType;
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
         * @private
         */
        public parameterX: number;
        /**
         * @private
         */
        public parameterY: number;
        /**
         * @private
         */
        public positionX: number;
        /**
         * @private
         */
        public positionY: number;
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
        private _timelineDirty: number;
        /**
         * - xx: Play Enabled, Fade Play Enabled
         * @internal
         */
        public _playheadState: number;
        /**
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         * @internal
         */
        public _fadeState: number;
        /**
         * -1: Fade start, 0: Fading, 1: Fade complete;
         * @internal
         */
        public _subFadeState: number;
        /**
         * @internal
         */
        public _position: number;
        /**
         * @internal
         */
        public _duration: number;
        private _weight: number;
        private _fadeTime: number;
        private _time: number;
        /**
         * @internal
         */
        public _fadeProgress: number;
        /**
         * @internal
         */
        public _weightResult: number;
        private readonly _boneMask: Array<string> = [];
        private readonly _boneTimelines: Array<TimelineState> = [];
        private readonly _boneBlendTimelines: Array<TimelineState> = [];
        private readonly _slotTimelines: Array<TimelineState> = [];
        private readonly _slotBlendTimelines: Array<TimelineState> = [];
        private readonly _constraintTimelines: Array<TimelineState> = [];
        private readonly _animationTimelines: Array<TimelineState> = [];
        private readonly _poseTimelines: Array<TimelineState> = [];
        private _animationData: AnimationData;
        private _armature: Armature;
        /**
         * @internal
         */
        public _actionTimeline: ActionTimelineState = null as any; // Initial value.
        private _zOrderTimeline: ZOrderTimelineState | null = null; // Initial value.
        private _activeChildA: AnimationState | null;
        private _activeChildB: AnimationState | null;
        /**
         * @internal
         */
        public _parent: AnimationState | null;

        protected _onClear(): void {
            for (const timeline of this._boneTimelines) {
                timeline.returnToPool();
            }

            for (const timeline of this._boneBlendTimelines) {
                timeline.returnToPool();
            }

            for (const timeline of this._slotTimelines) {
                timeline.returnToPool();
            }

            for (const timeline of this._slotBlendTimelines) {
                timeline.returnToPool();
            }

            for (const timeline of this._constraintTimelines) {
                timeline.returnToPool();
            }

            for (const timeline of this._animationTimelines) {
                const animationState = timeline.target as AnimationState;
                if (animationState._parent === this) {
                    animationState._fadeState = 1;
                    animationState._subFadeState = 1;
                    animationState._parent = null;
                }

                timeline.returnToPool();
            }

            if (this._actionTimeline !== null) {
                this._actionTimeline.returnToPool();
            }

            if (this._zOrderTimeline !== null) {
                this._zOrderTimeline.returnToPool();
            }

            this.actionEnabled = false;
            this.additive = false;
            this.displayControl = false;
            this.resetToPose = false;
            this.blendType = AnimationBlendType.None;
            this.playTimes = 1;
            this.layer = 0;
            this.timeScale = 1.0;
            this._weight = 1.0;
            this.parameterX = 0.0;
            this.parameterY = 0.0;
            this.positionX = 0.0;
            this.positionY = 0.0;
            this.autoFadeOutTime = 0.0;
            this.fadeTotalTime = 0.0;
            this.name = "";
            this.group = "";

            this._timelineDirty = 2;
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
            this._boneBlendTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._slotBlendTimelines.length = 0;
            this._constraintTimelines.length = 0;
            this._animationTimelines.length = 0;
            this._poseTimelines.length = 0;
            // this._bonePoses.clear();
            this._animationData = null as any; //
            this._armature = null as any; //
            this._actionTimeline = null as any; //
            this._zOrderTimeline = null;
            this._activeChildA = null;
            this._activeChildB = null;
            this._parent = null;
        }

        private _updateTimelines(): void {
            { // Update constraint timelines.
                for (const constraint of this._armature._constraints) {
                    const timelineDatas = this._animationData.getConstraintTimelines(constraint.name);

                    if (timelineDatas !== null) {
                        for (const timelineData of timelineDatas) {
                            switch (timelineData.type) {
                                case TimelineType.IKConstraint: {
                                    const timeline = BaseObject.borrowObject(IKConstraintTimelineState);
                                    timeline.target = constraint;
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
                        timeline.target = constraint;
                        timeline.init(this._armature, this, null);
                        this._constraintTimelines.push(timeline);
                        this._poseTimelines.push(timeline);
                    }
                }
            }
        }

        private _updateBoneAndSlotTimelines(): void {
            { // Update bone and surface timelines.
                const boneTimelines: Map<Array<TimelineState>> = {};
                // Create bone timelines map.
                for (const timeline of this._boneTimelines) {
                    const timelineName = ((timeline.target as BlendState).target as Bone).name;
                    if (!(timelineName in boneTimelines)) {
                        boneTimelines[timelineName] = [];
                    }

                    boneTimelines[timelineName].push(timeline);
                }

                for (const timeline of this._boneBlendTimelines) {
                    const timelineName = ((timeline.target as BlendState).target as Bone).name;
                    if (!(timelineName in boneTimelines)) {
                        boneTimelines[timelineName] = [];
                    }

                    boneTimelines[timelineName].push(timeline);
                }
                //
                for (const bone of this._armature.getBones()) {
                    const timelineName = bone.name;
                    if (!this.containsBoneMask(timelineName)) {
                        continue;
                    }

                    if (timelineName in boneTimelines) { // Remove bone timeline from map.
                        delete boneTimelines[timelineName];
                    }
                    else { // Create new bone timeline.
                        const timelineDatas = this._animationData.getBoneTimelines(timelineName);
                        const blendState = this._armature.animation.getBlendState(BlendState.BONE_TRANSFORM, bone.name, bone);

                        if (timelineDatas !== null) {
                            for (const timelineData of timelineDatas) {
                                switch (timelineData.type) {
                                    case TimelineType.BoneAll: {
                                        const timeline = BaseObject.borrowObject(BoneAllTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.BoneTranslate: {
                                        const timeline = BaseObject.borrowObject(BoneTranslateTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.BoneRotate: {
                                        const timeline = BaseObject.borrowObject(BoneRotateTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.BoneScale: {
                                        const timeline = BaseObject.borrowObject(BoneScaleTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.BoneAlpha: {
                                        const timeline = BaseObject.borrowObject(AlphaTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.BONE_ALPHA, bone.name, bone);
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneBlendTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.Surface: {
                                        const timeline = BaseObject.borrowObject(SurfaceTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.SURFACE, bone.name, bone);
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneBlendTimelines.push(timeline);
                                        break;
                                    }

                                    default:
                                        break;
                                }
                            }
                        }
                        else if (this.resetToPose) { // Pose timeline.
                            if (bone._boneData.type === BoneType.Bone) {
                                const timeline = BaseObject.borrowObject(BoneAllTimelineState);
                                timeline.target = blendState;
                                timeline.init(this._armature, this, null);
                                this._boneTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }
                            else {
                                const timeline = BaseObject.borrowObject(SurfaceTimelineState);
                                timeline.target = this._armature.animation.getBlendState(BlendState.SURFACE, bone.name, bone);
                                timeline.init(this._armature, this, null);
                                this._boneBlendTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }
                        }
                    }
                }

                for (let k in boneTimelines) { // Remove bone timelines.
                    for (const timeline of boneTimelines[k]) {
                        let index = this._boneTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._boneTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }

                        index = this._boneBlendTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._boneBlendTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }
                    }
                }
            }

            { // Update slot timelines.
                const slotTimelines: Map<Array<TimelineState>> = {};
                const ffdFlags: Array<number> = [];
                // Create slot timelines map.
                for (const timeline of this._slotTimelines) {
                    const timelineName = (timeline.target as Slot).name;
                    if (!(timelineName in slotTimelines)) {
                        slotTimelines[timelineName] = [];
                    }

                    slotTimelines[timelineName].push(timeline);
                }

                for (const timeline of this._slotBlendTimelines) {
                    const timelineName = ((timeline.target as BlendState).target as Slot).name;
                    if (!(timelineName in slotTimelines)) {
                        slotTimelines[timelineName] = [];
                    }

                    slotTimelines[timelineName].push(timeline);
                }
                //
                for (const slot of this._armature.getSlots()) {
                    const boneName = slot.parent.name;
                    if (!this.containsBoneMask(boneName)) {
                        continue;
                    }

                    const timelineName = slot.name;
                    if (timelineName in slotTimelines) { // Remove slot timeline from map.
                        delete slotTimelines[timelineName];
                    }
                    else { // Create new slot timeline.
                        let displayIndexFlag = false;
                        let colorFlag = false;
                        ffdFlags.length = 0;

                        const timelineDatas = this._animationData.getSlotTimelines(timelineName);
                        if (timelineDatas !== null) {
                            for (const timelineData of timelineDatas) {
                                switch (timelineData.type) {
                                    case TimelineType.SlotDisplay: {
                                        const timeline = BaseObject.borrowObject(SlotDisplayTimelineState);
                                        timeline.target = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        displayIndexFlag = true;
                                        break;
                                    }

                                    case TimelineType.SlotZIndex: {
                                        const timeline = BaseObject.borrowObject(SlotZIndexTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_Z_INDEX, slot.name, slot);
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotBlendTimelines.push(timeline);
                                        break;
                                    }

                                    case TimelineType.SlotColor: {
                                        const timeline = BaseObject.borrowObject(SlotColorTimelineState);
                                        timeline.target = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        colorFlag = true;
                                        break;
                                    }

                                    case TimelineType.SlotDeform: {
                                        const dragonBonesData = this._animationData.parent.parent;
                                        const timelineArray = dragonBonesData.timelineArray;

                                        const frameIntOffset = this._animationData.frameIntOffset + timelineArray[timelineData.offset + BinaryOffset.TimelineFrameValueCount];
                                        const frameIntArray = dragonBonesData.frameIntArray;
                                        let geometryOffset = frameIntArray[frameIntOffset + BinaryOffset.DeformVertexOffset];

                                        if (geometryOffset < 0) {
                                            geometryOffset += 65536; // Fixed out of bounds bug. 
                                        }

                                        for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                                            const displayFrame = slot.getDisplayFrameAt(i);
                                            const geometryData = displayFrame.getGeometryData();

                                            if (geometryData === null) {
                                                continue;
                                            }

                                            if (geometryData.offset === geometryOffset) {
                                                const timeline = BaseObject.borrowObject(DeformTimelineState);
                                                timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_DEFORM, displayFrame.rawDisplayData!.name, slot);
                                                timeline.displayFrame = displayFrame;
                                                timeline.init(this._armature, this, timelineData);
                                                this._slotBlendTimelines.push(timeline);

                                                displayFrame.updateDeformVertices();
                                                ffdFlags.push(geometryOffset);
                                                break;
                                            }
                                        }
                                        break;
                                    }

                                    case TimelineType.SlotAlpha: {
                                        const timeline = BaseObject.borrowObject(AlphaTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_ALPHA, slot.name, slot);
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotBlendTimelines.push(timeline);
                                        break;
                                    }

                                    default:
                                        break;
                                }
                            }
                        }

                        if (this.resetToPose) { // Pose timeline.
                            if (!displayIndexFlag) {
                                const timeline = BaseObject.borrowObject(SlotDisplayTimelineState);
                                timeline.target = slot;
                                timeline.init(this._armature, this, null);
                                this._slotTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }

                            if (!colorFlag) {
                                const timeline = BaseObject.borrowObject(SlotColorTimelineState);
                                timeline.target = slot;
                                timeline.init(this._armature, this, null);
                                this._slotTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }

                            for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                                const displayFrame = slot.getDisplayFrameAt(i);
                                if (displayFrame.deformVertices.length === 0) {
                                    continue;
                                }

                                const geometryData = displayFrame.getGeometryData();
                                if (geometryData !== null && ffdFlags.indexOf(geometryData.offset) < 0) {
                                    const timeline = BaseObject.borrowObject(DeformTimelineState);
                                    timeline.displayFrame = displayFrame; //
                                    timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_DEFORM, slot.name, slot);
                                    timeline.init(this._armature, this, null);
                                    this._slotBlendTimelines.push(timeline);
                                    this._poseTimelines.push(timeline);
                                }
                            }
                        }
                    }
                }

                for (let k in slotTimelines) { // Remove slot timelines.
                    for (const timeline of slotTimelines[k]) {
                        let index = this._slotTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._slotTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }

                        index = this._slotBlendTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._slotBlendTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }
                    }
                }
            }
        }

        private _advanceFadeTime(passedTime: number): void {
            const isFadeOut = this._fadeState > 0;

            if (this._subFadeState < 0) { // Fade start event.
                this._subFadeState = 0;

                const eventActive = this._parent === null && this.actionEnabled;
                if (eventActive) {
                    const eventType = isFadeOut ? EventObject.FADE_OUT : EventObject.FADE_IN;
                    if (this._armature.eventDispatcher.hasDBEventListener(eventType)) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        eventObject.type = eventType;
                        eventObject.armature = this._armature;
                        eventObject.animationState = this;
                        this._armature._dragonBones.bufferEvent(eventObject);
                    }
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

                const eventActive = this._parent === null && this.actionEnabled;
                if (eventActive) {
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
        }
        /**
         * @internal
         */
        public init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void {
            if (this._armature !== null) {
                return;
            }

            this._armature = armature;
            this._animationData = animationData;
            //
            this.resetToPose = animationConfig.resetToPose;
            this.additive = animationConfig.additive;
            this.displayControl = animationConfig.displayControl;
            this.actionEnabled = animationConfig.actionEnabled;
            this.blendType = animationData.blendType;
            this.layer = animationConfig.layer;
            this.playTimes = animationConfig.playTimes;
            this.timeScale = animationConfig.timeScale;
            this.fadeTotalTime = animationConfig.fadeInTime;
            this.autoFadeOutTime = animationConfig.autoFadeOutTime;
            this.name = animationConfig.name.length > 0 ? animationConfig.name : animationConfig.animation;
            this.group = animationConfig.group;
            //
            this._weight = animationConfig.weight;

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
            // Update timeline.
            if (this._timelineDirty !== 0) {
                if (this._timelineDirty === 2) {
                    this._updateTimelines();
                }

                this._timelineDirty = 0;
                this._updateBoneAndSlotTimelines();
            }

            const isBlendDirty = this._fadeState !== 0 || this._subFadeState === 0;
            const isCacheEnabled = this._fadeState === 0 && cacheFrameRate > 0.0;
            let isUpdateTimeline = true;
            let isUpdateBoneTimeline = true;
            let time = this._time;
            this._weightResult = this._weight * this._fadeProgress;

            if (this._parent !== null) {
                this._weightResult *= this._parent._weightResult;
            }

            if (this._actionTimeline.playState <= 0) { // Update main timeline.
                this._actionTimeline.update(time);
            }

            if (this._weight === 0.0) {
                return;
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
                let isBlend = false;
                let prevTarget: BlendState | null = null as any; //

                if (isUpdateBoneTimeline) {
                    for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                        const timeline = this._boneTimelines[i];

                        if (timeline.playState <= 0) {
                            timeline.update(time);
                        }

                        if (timeline.target !== prevTarget) {
                            const blendState = timeline.target as BlendState;
                            isBlend = blendState.update(this);
                            prevTarget = blendState;

                            if (blendState.dirty === 1) {
                                const pose = (blendState.target as Bone).animationPose;
                                pose.x = 0.0;
                                pose.y = 0.0;
                                pose.rotation = 0.0;
                                pose.skew = 0.0;
                                pose.scaleX = 1.0;
                                pose.scaleY = 1.0;
                            }
                        }

                        if (isBlend) {
                            timeline.blend(isBlendDirty);
                        }
                    }
                }

                for (let i = 0, l = this._boneBlendTimelines.length; i < l; ++i) {
                    const timeline = this._boneBlendTimelines[i];

                    if (timeline.playState <= 0) {
                        timeline.update(time);
                    }

                    if ((timeline.target as BlendState).update(this)) {
                        timeline.blend(isBlendDirty);
                    }
                }

                if (this.displayControl) {
                    for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                        const timeline = this._slotTimelines[i];
                        if (timeline.playState <= 0) {
                            const slot = timeline.target as Slot;
                            const displayController = slot.displayController;

                            if (
                                displayController === null ||
                                displayController === this.name ||
                                displayController === this.group
                            ) {
                                timeline.update(time);
                            }
                        }
                    }
                }

                for (let i = 0, l = this._slotBlendTimelines.length; i < l; ++i) {
                    const timeline = this._slotBlendTimelines[i];
                    if (timeline.playState <= 0) {
                        const blendState = timeline.target as BlendState;
                        timeline.update(time);

                        if (blendState.update(this)) {
                            timeline.blend(isBlendDirty);
                        }
                    }
                }

                for (let i = 0, l = this._constraintTimelines.length; i < l; ++i) {
                    const timeline = this._constraintTimelines[i];
                    if (timeline.playState <= 0) {
                        timeline.update(time);
                    }
                }

                if (this._animationTimelines.length > 0) {
                    let dL = 100.0;
                    let dR = 100.0;
                    let leftState: AnimationState | null = null;
                    let rightState: AnimationState | null = null;

                    for (let i = 0, l = this._animationTimelines.length; i < l; ++i) {
                        const timeline = this._animationTimelines[i];
                        if (timeline.playState <= 0) {
                            timeline.update(time);
                        }

                        if (this.blendType === AnimationBlendType.E1D) { // TODO
                            const animationState = timeline.target as AnimationState;
                            const d = this.parameterX - animationState.positionX;

                            if (d >= 0.0) {
                                if (d < dL) {
                                    dL = d;
                                    leftState = animationState;
                                }
                            }
                            else {
                                if (-d < dR) {
                                    dR = -d;
                                    rightState = animationState;
                                }
                            }
                        }
                    }

                    if (leftState !== null) {
                        if (this._activeChildA !== leftState) {
                            if (this._activeChildA !== null) {
                                this._activeChildA.weight = 0.0;
                            }

                            this._activeChildA = leftState;
                            this._activeChildA.activeTimeline();
                        }

                        if (this._activeChildB !== rightState) {
                            if (this._activeChildB !== null) {
                                this._activeChildB.weight = 0.0;
                            }

                            this._activeChildB = rightState;
                        }

                        leftState.weight = dR / (dL + dR);

                        if (rightState) {
                            rightState.weight = 1.0 - leftState.weight;
                        }
                    }
                }
            }

            if (this._fadeState === 0) {
                if (this._subFadeState > 0) {
                    this._subFadeState = 0;

                    if (this._poseTimelines.length > 0) { // Remove pose timelines.
                        for (const timeline of this._poseTimelines) {
                            let index = this._boneTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._boneTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }

                            index = this._boneBlendTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._boneBlendTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }

                            index = this._slotTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._slotTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }

                            index = this._slotBlendTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._slotBlendTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }

                            index = this._constraintTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._constraintTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }
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

                for (const timeline of this._boneBlendTimelines) {
                    timeline.fadeOut();
                }

                for (const timeline of this._slotTimelines) {
                    timeline.fadeOut();
                }

                for (const timeline of this._slotBlendTimelines) {
                    timeline.fadeOut();
                }

                for (const timeline of this._constraintTimelines) {
                    timeline.fadeOut();
                }

                for (const timeline of this._animationTimelines) {
                    timeline.fadeOut();
                    //
                    const animaitonState = timeline.target as AnimationState;
                    animaitonState.fadeOut(999999.0, true);
                }
            }

            this.displayControl = false; //
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0.0;
            this._fadeTime = this.fadeTotalTime * (1.0 - this._fadeProgress);
        }
        /**
         * - Check if a specific bone mask is included.
         * @param boneName - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含特定骨骼遮罩。
         * @param boneName - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public containsBoneMask(boneName: string): boolean {
            return this._boneMask.length === 0 || this._boneMask.indexOf(boneName) >= 0;
        }
        /**
         * - Add a specific bone mask.
         * @param boneName - The bone name.
         * @param recursive - Whether or not to add a mask to the bone's sub-bone.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 添加特定的骨骼遮罩。
         * @param boneName - 骨骼名称。
         * @param recursive - 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public addBoneMask(boneName: string, recursive: boolean = true): void {
            const currentBone = this._armature.getBone(boneName);
            if (currentBone === null) {
                return;
            }

            if (this._boneMask.indexOf(boneName) < 0) { // Add mixing
                this._boneMask.push(boneName);
            }

            if (recursive) { // Add recursive mixing.
                for (const bone of this._armature.getBones()) {
                    if (this._boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                        this._boneMask.push(bone.name);
                    }
                }
            }

            this._timelineDirty = 1;
        }
        /**
         * - Remove the mask of a specific bone.
         * @param boneName - The bone name.
         * @param recursive - Whether to remove the bone's sub-bone mask.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 删除特定骨骼的遮罩。
         * @param boneName - 骨骼名称。
         * @param recursive - 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public removeBoneMask(boneName: string, recursive: boolean = true): void {
            const index = this._boneMask.indexOf(boneName);
            if (index >= 0) { // Remove mixing.
                this._boneMask.splice(index, 1);
            }

            if (recursive) {
                const currentBone = this._armature.getBone(boneName);
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

            this._timelineDirty = 1;
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
            this._timelineDirty = 1;
        }
        /**
         * @private
         */
        public addState(animationState: AnimationState, timelineDatas: TimelineData[] | null = null) {
            if (timelineDatas !== null) {
                for (const timelineData of timelineDatas) {
                    switch (timelineData.type) {
                        case TimelineType.AnimationProgress: {
                            const timeline = BaseObject.borrowObject(AnimationProgressTimelineState);
                            timeline.target = animationState;
                            timeline.init(this._armature, this, timelineData);
                            this._animationTimelines.push(timeline);

                            if (this.blendType !== AnimationBlendType.None) {
                                const animaitonTimelineData = timelineData as AnimationTimelineData;
                                animationState.positionX = animaitonTimelineData.x;
                                animationState.positionY = animaitonTimelineData.y;
                                animationState.weight = 0.0;
                            }

                            animationState._parent = this;
                            this.resetToPose = false;
                            break;
                        }

                        case TimelineType.AnimationWeight: {
                            const timeline = BaseObject.borrowObject(AnimationWeightTimelineState);
                            timeline.target = animationState;
                            timeline.init(this._armature, this, timelineData);
                            this._animationTimelines.push(timeline);
                            break;
                        }

                        case TimelineType.AnimationParameter: {
                            const timeline = BaseObject.borrowObject(AnimationParametersTimelineState);
                            timeline.target = animationState;
                            timeline.init(this._armature, this, timelineData);
                            this._animationTimelines.push(timeline);
                            break;
                        }

                        default:
                            break;
                    }
                }
            }

            if (animationState._parent === null) {
                animationState._parent = this;
            }
        }
        /**
         * @internal
         */
        public activeTimeline(): void {
            for (const timeline of this._slotTimelines) {
                timeline.dirty = true;
                timeline.currentTime = -1.0;
            }
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

            if (
                this.playTimes > 0 && currentPlayTimes === this.playTimes - 1 &&
                value === this._duration && this._parent === null
            ) {
                value = this._duration - 0.000001; // 
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
        /**
         * - The animation data.
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language en_US
         */
        public get weight(): number {
            return this._weight;
        }
        public set weight(value: number) {
            if (this._weight === value) {
                return;
            }

            this._weight = value;

            for (const timeline of this._boneTimelines) {
                timeline.dirty = true;
            }

            for (const timeline of this._boneBlendTimelines) {
                timeline.dirty = true;
            }

            for (const timeline of this._slotBlendTimelines) {
                timeline.dirty = true;
            }
        }
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
     */
    export class BlendState extends BaseObject {
        public static readonly BONE_TRANSFORM: string = "boneTransform";
        public static readonly BONE_ALPHA: string = "boneAlpha";
        public static readonly SURFACE: string = "surface";
        public static readonly SLOT_DEFORM: string = "slotDeform";
        public static readonly SLOT_ALPHA: string = "slotAlpha";
        public static readonly SLOT_Z_INDEX: string = "slotZIndex";

        public static toString(): string {
            return "[class dragonBones.BlendState]";
        }

        public dirty: number;
        public layer: number;
        public leftWeight: number;
        public layerWeight: number;
        public blendWeight: number;
        public target: BaseObject;

        protected _onClear(): void {
            this.reset();

            this.target = null as any;
        }

        public update(animationState: AnimationState): boolean {
            const animationLayer = animationState.layer;
            let animationWeight = animationState._weightResult;

            if (this.dirty > 0) {
                if (this.leftWeight > 0.0) {
                    if (this.layer !== animationLayer) {
                        if (this.layerWeight >= this.leftWeight) {
                            this.dirty++;
                            this.layer = animationLayer;
                            this.leftWeight = 0.0;
                            this.blendWeight = 0.0;

                            return false;
                        }

                        this.layer = animationLayer;
                        this.leftWeight -= this.layerWeight;
                        this.layerWeight = 0.0;
                    }

                    animationWeight *= this.leftWeight;
                    this.dirty++;
                    this.blendWeight = animationWeight;
                    this.layerWeight += this.blendWeight;

                    return true;
                }

                return false;
            }

            this.dirty++;
            this.layer = animationLayer;
            this.leftWeight = 1.0;
            this.blendWeight = animationWeight;
            this.layerWeight = animationWeight;

            return true;
        }

        public reset(): void {
            this.dirty = 0;
            this.layer = 0;
            this.leftWeight = 0.0;
            this.layerWeight = 0.0;
            this.blendWeight = 0.0;
        }
    }
}
