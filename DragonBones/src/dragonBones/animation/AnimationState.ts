namespace dragonBones {
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
    /**
     * 动画状态，播放动画时产生，可以对每个播放的动画进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class AnimationState extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.AnimationState]";
        }
        /**
         * 是否将骨架的骨骼和插槽重置为绑定姿势（如果骨骼和插槽在这个动画状态中没有动画）。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public resetToPose: boolean;
        /**
         * 是否以增加的方式混合。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public additiveBlending: boolean;
        /**
         * 是否对插槽的显示对象有控制权。
         * @see dragonBones.Slot#displayController
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public displayControl: boolean;
        /**
         * 是否能触发行为。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public actionEnabled: boolean;
        /**
         * 混合图层。
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        public layer: number;
        /**
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public playTimes: number;
        /**
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public timeScale: number;
        /**
         * 混合权重。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public weight: number;
        /**
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * 当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public autoFadeOutTime: number;
        /**
         * @private
         */
        public fadeTotalTime: number;
        /**
         * 动画名称。
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        public name: string;
        /**
         * 混合组。
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        public group: string;
        /**
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        public animationData: AnimationData;

        private _timelineDirty: boolean;
        /**
         * @internal
         * @private
         * xx: Play Enabled, Fade Play Enabled
         */
        public _playheadState: number;
        /**
         * @internal
         * @private
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         */
        public _fadeState: number;
        /**
         * @internal
         * @private
         * -1: Fade start, 0: Fading, 1: Fade complete;
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
        private readonly _bonePoses: Map<BonePose> = {};
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

            this.resetToPose = false;
            this.additiveBlending = false;
            this.displayControl = false;
            this.actionEnabled = false;
            this.layer = 0;
            this.playTimes = 1;
            this.timeScale = 1.0;
            this.weight = 1.0;
            this.autoFadeOutTime = 0.0;
            this.fadeTotalTime = 0.0;
            this.name = "";
            this.group = "";
            this.animationData = null as any; //

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
            // this._bonePoses.clear();
            this._armature = null as any; //
            this._actionTimeline = null as any; //
            this._zOrderTimeline = null;
        }

        private _isDisabled(slot: Slot): boolean {
            if (this.displayControl) {
                const displayController = slot.displayController;
                if (
                    displayController === null ||
                    displayController === this.name ||
                    displayController === this.group
                ) {
                    return false;
                }
            }

            return true;
        }

        private _advanceFadeTime(passedTime: number): void {
            const isFadeOut = this._fadeState > 0;

            if (this._subFadeState < 0) { // Fade start event.
                this._subFadeState = 0;

                const eventType = isFadeOut ? EventObject.FADE_OUT : EventObject.FADE_IN;
                if (this._armature.eventDispatcher.hasEvent(eventType)) {
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
                if (this._armature.eventDispatcher.hasEvent(eventType)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.type = eventType;
                    eventObject.armature = this._armature;
                    eventObject.animationState = this;
                    this._armature._dragonBones.bufferEvent(eventObject);
                }
            }
        }

        private _blendBoneTimline(timeline: BoneTimelineState): void {
            const bone = timeline.bone;
            const bonePose = timeline.bonePose.result;
            const animationPose = bone.animationPose;
            let boneWeight = this._weightResult > 0.0 ? this._weightResult : -this._weightResult;

            if (!bone._blendDirty) {
                bone._blendDirty = true;
                bone._blendLayer = this.layer;
                bone._blendLayerWeight = boneWeight;
                bone._blendLeftWeight = 1.0;

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
         * @private
         * @internal
         */
        public init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void {
            if (this._armature !== null) {
                return;
            }

            this._armature = armature;

            this.animationData = animationData;
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
                this._duration = this.animationData.duration;
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
            this._actionTimeline.init(this._armature, this, this.animationData.actionTimeline);
            this._actionTimeline.currentTime = this._time;
            if (this._actionTimeline.currentTime < 0.0) {
                this._actionTimeline.currentTime = this._duration - this._actionTimeline.currentTime;
            }

            if (this.animationData.zOrderTimeline !== null) {
                this._zOrderTimeline = BaseObject.borrowObject(ZOrderTimelineState);
                this._zOrderTimeline.init(this._armature, this, this.animationData.zOrderTimeline);
            }
        }
        /**
         * @private
         * @internal
         */
        public updateTimelines(): void {
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

                const timelineDatas = this.animationData.getBoneTimelines(timelineName);
                if (timelineName in boneTimelines) { // Remove bone timeline from map.
                    delete boneTimelines[timelineName];
                }
                else { // Create new bone timeline.
                    const bonePose = timelineName in this._bonePoses ? this._bonePoses[timelineName] : (this._bonePoses[timelineName] = BaseObject.borrowObject(BonePose));
                    if (timelineDatas !== null) {
                        for (const timelineData of timelineDatas) {
                            switch (timelineData.type) {
                                case TimelineType.BoneAll:
                                    {
                                        const timeline = BaseObject.borrowObject(BoneAllTimelineState);
                                        timeline.bone = bone;
                                        timeline.bonePose = bonePose;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                case TimelineType.BoneTranslate:
                                    {
                                        const timeline = BaseObject.borrowObject(BoneTranslateTimelineState);
                                        timeline.bone = bone;
                                        timeline.bonePose = bonePose;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                case TimelineType.BoneRotate:
                                    {
                                        const timeline = BaseObject.borrowObject(BoneRotateTimelineState);
                                        timeline.bone = bone;
                                        timeline.bonePose = bonePose;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }

                                case TimelineType.BoneScale:
                                    {
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
                    }
                }
            }

            for (let k in boneTimelines) { // Remove bone timelines.
                for (const timeline of boneTimelines[k]) {
                    this._boneTimelines.splice(this._boneTimelines.indexOf(timeline), 1);
                    timeline.returnToPool();
                }
            }

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
                const timelineDatas = this.animationData.getSlotTimeline(timelineName);
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
                                case TimelineType.SlotDisplay:
                                    {
                                        const timeline = BaseObject.borrowObject(SlotDislayIndexTimelineState);
                                        timeline.slot = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        displayIndexFlag = true;
                                        break;
                                    }

                                case TimelineType.SlotColor:
                                    {
                                        const timeline = BaseObject.borrowObject(SlotColorTimelineState);
                                        timeline.slot = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        colorFlag = true;
                                        break;
                                    }

                                case TimelineType.SlotFFD:
                                    {
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
                            const timeline = BaseObject.borrowObject(SlotDislayIndexTimelineState);
                            timeline.slot = slot;
                            timeline.init(this._armature, this, null);
                            this._slotTimelines.push(timeline);
                        }

                        if (!colorFlag) {
                            const timeline = BaseObject.borrowObject(SlotColorTimelineState);
                            timeline.slot = slot;
                            timeline.init(this._armature, this, null);
                            this._slotTimelines.push(timeline);
                        }

                        for (const displayData of slot._rawDisplayDatas) {
                            if (displayData !== null && displayData.type === DisplayType.Mesh && ffdFlags.indexOf((displayData as MeshDisplayData).offset) < 0) {
                                const timeline = BaseObject.borrowObject(SlotFFDTimelineState);
                                timeline.slot = slot;
                                timeline.init(this._armature, this, null);
                                this._slotTimelines.push(timeline);
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
        /**
         * @private
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

            if (this._timelineDirty) {
                this._timelineDirty = false;
                this.updateTimelines();
            }

            if (this.weight === 0.0) {
                return;
            }

            const isCacheEnabled = this._fadeState === 0 && cacheFrameRate > 0.0;
            let isUpdateTimeline = true;
            let isUpdateBoneTimeline = true;
            let time = this._time;
            this._weightResult = this.weight * this._fadeProgress;

            this._actionTimeline.update(time); // Update main timeline.

            if (isCacheEnabled) { // Cache time internval.
                const internval = cacheFrameRate * 2.0;
                this._actionTimeline.currentTime = Math.floor(this._actionTimeline.currentTime * internval) / internval;
            }

            if (this._zOrderTimeline !== null) { // Update zOrder timeline.
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
                    if (this.animationData.cachedFrames[cacheFrameIndex]) { // Cached.
                        isUpdateBoneTimeline = false;
                    }
                    else { // Cache.
                        this.animationData.cachedFrames[cacheFrameIndex] = true;
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
                            timeline.update(time);
                            if (i === l - 1) {
                                this._blendBoneTimline(timeline);
                            }
                            else {
                                prevTimeline = timeline;
                            }
                        }
                    }
                }

                for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    const timeline = this._slotTimelines[i];
                    if (this._isDisabled(timeline.slot)) {
                        continue;
                    }

                    timeline.update(time);
                }
            }

            if (this._fadeState === 0) {
                if (this._subFadeState > 0) {
                    this._subFadeState = 0;
                }

                if (this._actionTimeline.playState > 0) {
                    if (this.autoFadeOutTime >= 0.0) { // Auto fade out.
                        this.fadeOut(this.autoFadeOutTime);
                    }
                }
            }
        }
        /**
         * 继续播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public play(): void {
            this._playheadState = 3; // 11
        }
        /**
         * 暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public stop(): void {
            this._playheadState &= 1; // 0x
        }
        /**
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。
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
         * 是否包含骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public containsBoneMask(name: string): boolean {
            return this._boneMask.length === 0 || this._boneMask.indexOf(name) >= 0;
        }
        /**
         * 添加骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
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
         * 删除骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
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
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public removeAllBoneMask(): void {
            this._boneMask.length = 0;
            this._timelineDirty = true;
        }
        /**
         * 是否正在淡入。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public get isFadeIn(): boolean {
            return this._fadeState < 0;
        }
        /**
         * 是否正在淡出。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public get isFadeOut(): boolean {
            return this._fadeState > 0;
        }
        /**
         * 是否淡入完毕。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public get isFadeComplete(): boolean {
            return this._fadeState === 0;
        }
        /**
         * 是否正在播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get isPlaying(): boolean {
            return (this._playheadState & 2) !== 0 && this._actionTimeline.playState <= 0;
        }
        /**
         * 是否播放完毕。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get isCompleted(): boolean {
            return this._actionTimeline.playState > 0;
        }
        /**
         * 当前播放次数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get currentPlayTimes(): number {
            return this._actionTimeline.currentPlayTimes;
        }
        /**
         * 总时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get totalTime(): number {
            return this._duration;
        }
        /**
         * 当前播放的时间。 (以秒为单位)
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
         * @deprecated
         * 已废弃，请参考 @see
         * @see #animationData
         */
        public get clip(): AnimationData {
            return this.animationData;
        }
    }
}