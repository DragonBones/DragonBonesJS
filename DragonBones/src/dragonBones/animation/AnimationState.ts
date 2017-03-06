namespace dragonBones {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对每个播放的动画进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    export class AnimationState extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.AnimationState]";
        }
        /**
         * @language zh_CN
         * 是否对插槽的显示对象有控制权。
         * @see dragonBones.Slot#displayController
         * @version DragonBones 3.0
         */
        public displayControl: boolean;
        /**
         * @language zh_CN
         * 是否以增加的方式混合。
         * @version DragonBones 3.0
         */
        public additiveBlending: boolean;
        /**
         * @language zh_CN
         * 是否能触发行为。
         * @version DragonBones 5.0
         */
        public actionEnabled: boolean;
        /**
         * @language zh_CN
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        public playTimes: number;
        /**
         * @language zh_CN
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @version DragonBones 3.0
         */
        public timeScale: number;
        /**
         * @language zh_CN
         * 混合权重。
         * @version DragonBones 3.0
         */
        public weight: number;
        /**
         * @language zh_CN
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * 当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。
         * @version DragonBones 3.0
         */
        public autoFadeOutTime: number;
        /**
         * @private
         */
        public fadeTotalTime: number;
        /**
         * @internal
         * @private
         */
        public _playheadState: number;
        /**
         * @internal
         * @private
         */
        public _fadeState: number;
        /**
         * @internal
         * @private
         */
        public _subFadeState: number;
        /**
         * @internal
         * @private
         */
        public _layer: number;
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
        /**
         * @private
         */
        private _fadeTime: number;
        /**
         * @private
         */
        private _time: number;
        /**
         * @internal
         * @private
         */
        public _fadeProgress: number;
        /**
         * @internal
         * @private
         */
        public _weightResult: number;
        /**
         * @private
         */
        private _name: string;
        /**
         * @private
         */
        private _group: string;
        /**
         * @private
         */
        private _boneMask: Array<string> = [];
        /**
         * @private
         */
        private _animationNames: Array<string> = [];
        /**
         * @private
         */
        private _boneTimelines: Array<BoneTimelineState> = [];
        /**
         * @private
         */
        private _slotTimelines: Array<SlotTimelineState> = [];
        /**
         * @private
         */
        private _ffdTimelines: Array<FFDTimelineState> = [];
        /**
         * @private
         */
        private _animationData: AnimationData;
        /**
         * @private
         */
        private _armature: Armature;
        /**
         * @internal
         * @private
         */
        public _timeline: AnimationTimelineState;
        /**
         * @private
         */
        private _zOrderTimeline: ZOrderTimelineState;
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
            for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i].returnToPool();
            }

            for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i].returnToPool();
            }

            for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i].returnToPool();
            }

            if (this._timeline) {
                this._timeline.returnToPool();
            }

            if (this._zOrderTimeline) {
                this._zOrderTimeline.returnToPool();
            }

            this.displayControl = true;
            this.additiveBlending = false;
            this.actionEnabled = false;
            this.playTimes = 1;
            this.timeScale = 1.0;
            this.weight = 1.0;
            this.autoFadeOutTime = -1.0;
            this.fadeTotalTime = 0.0;

            this._playheadState = 0;
            this._fadeState = -1;
            this._subFadeState = -1;
            this._layer = 0;
            this._position = 0.0;
            this._duration = 0.0;
            this._fadeTime = 0.0;
            this._time = 0.0;
            this._fadeProgress = 0.0;
            this._weightResult = 0.0;
            this._name = null;
            this._group = null;
            this._boneMask.length = 0;
            this._animationNames.length = 0;
            this._boneTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._ffdTimelines.length = 0;
            this._animationData = null;
            this._armature = null;
            this._timeline = null;
            this._zOrderTimeline = null;
        }

        private _advanceFadeTime(passedTime: number): void {
            const isFadeOut = this._fadeState > 0;

            if (this._subFadeState < 0) { // Fade start event.
                this._subFadeState = 0;

                const eventType = isFadeOut ? EventObject.FADE_OUT : EventObject.FADE_IN;
                if (this._armature.eventDispatcher.hasEvent(eventType)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = this;
                    this._armature._bufferEvent(eventObject, eventType);
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
                    eventObject.animationState = this;
                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        }
        /**
         * @internal
         * @private
         */
        public _init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void {
            this._armature = armature;
            this._animationData = animationData;
            this._name = animationConfig.name ? animationConfig.name : animationConfig.animationName;

            this.actionEnabled = animationConfig.actionEnabled;
            this.additiveBlending = animationConfig.additiveBlending;
            this.displayControl = animationConfig.displayControl;
            this.playTimes = animationConfig.playTimes;
            this.timeScale = animationConfig.timeScale;
            this.fadeTotalTime = animationConfig.fadeInTime;
            this.autoFadeOutTime = animationConfig.autoFadeOutTime;
            this.weight = animationConfig.weight;

            if (animationConfig.pauseFadeIn) {
                this._playheadState = 2; // 10
            }
            else {
                this._playheadState = 3; // 11
            }

            this._fadeState = -1;
            this._subFadeState = -1;
            this._layer = animationConfig.layer;
            this._group = animationConfig.group;

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
                this._time = -0.000001; // Can not cross last frame event.
            }

            if (this.fadeTotalTime <= 0.0) {
                this._fadeProgress = 0.999999;
            }

            if (animationConfig.boneMask.length > 0) {
                this._boneMask.length = animationConfig.boneMask.length;
                for (let i = 0, l = this._boneMask.length; i < l; ++i) {
                    this._boneMask[i] = animationConfig.boneMask[i];
                }
            }

            if (animationConfig.animationNames.length > 0) {
                this._animationNames.length = animationConfig.animationNames.length;
                for (let i = 0, l = this._animationNames.length; i < l; ++i) {
                    this._animationNames[i] = animationConfig.animationNames[i];
                }
            }

            this._timeline = BaseObject.borrowObject(AnimationTimelineState);
            this._timeline._init(this._armature, this, this._animationData);

            if (this._animationData.zOrderTimeline) {
                this._zOrderTimeline = BaseObject.borrowObject(ZOrderTimelineState);
                this._zOrderTimeline._init(this._armature, this, this._animationData.zOrderTimeline);
            }

            this._updateTimelineStates();
        }
        /**
         * @internal
         * @private
         */
        public _updateTimelineStates(): void {
            const boneTimelineStates: Map<BoneTimelineState> = {};
            const slotTimelineStates: Map<SlotTimelineState> = {};
            const ffdTimelineStates: Map<FFDTimelineState> = {};

            for (let i = 0, l = this._boneTimelines.length; i < l; ++i) { // Creat bone timelines map.
                const boneTimelineState = this._boneTimelines[i];
                boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
            }

            const bones = this._armature.getBones();
            for (let i = 0, l = bones.length; i < l; ++i) {
                const bone = bones[i];
                const boneTimelineName = bone.name;
                if (this.containsBoneMask(boneTimelineName)) {
                    const boneTimelineData = this._animationData.getBoneTimeline(boneTimelineName);
                    if (boneTimelineData) {
                        if (boneTimelineStates[boneTimelineName]) { // Remove bone timeline from map.
                            delete boneTimelineStates[boneTimelineName];
                        }
                        else { // Create new bone timeline.
                            const boneTimelineState = BaseObject.borrowObject(BoneTimelineState);
                            boneTimelineState.bone = bone;
                            boneTimelineState._init(this._armature, this, boneTimelineData);
                            this._boneTimelines.push(boneTimelineState);
                        }
                    }
                }
            }

            for (let k in boneTimelineStates) { // Remove bone timelines.
                const boneTimelineState = boneTimelineStates[k];
                boneTimelineState.bone.invalidUpdate(); //
                this._boneTimelines.splice(this._boneTimelines.indexOf(boneTimelineState), 1);
                boneTimelineState.returnToPool();
            }

            for (let i = 0, l = this._slotTimelines.length; i < l; ++i) { // Create slot timelines map.
                const slotTimelineState = this._slotTimelines[i];
                slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
            }

            for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) { // Create ffd timelines map.
                const ffdTimelineState = this._ffdTimelines[i];
                const display = ffdTimelineState._timelineData.display;
                const meshName = display.inheritAnimation ? display.mesh.name : display.name;
                ffdTimelineStates[meshName] = ffdTimelineState;
            }

            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                const slotTimelineName = slot.name;
                const parentTimelineName = slot.parent.name;
                let resetFFDVertices = false;

                if (this.containsBoneMask(parentTimelineName)) {
                    const slotTimelineData = this._animationData.getSlotTimeline(slotTimelineName);
                    if (slotTimelineData) {
                        if (slotTimelineStates[slotTimelineName]) { // Remove slot timeline from map.
                            delete slotTimelineStates[slotTimelineName];
                        }
                        else { // Create new slot timeline.
                            const slotTimelineState = BaseObject.borrowObject(SlotTimelineState);
                            slotTimelineState.slot = slot;
                            slotTimelineState._init(this._armature, this, slotTimelineData);
                            this._slotTimelines.push(slotTimelineState);
                        }
                    }

                    const ffdTimelineDatas = this._animationData.getFFDTimeline(this._armature._skinData.name, slotTimelineName);
                    if (ffdTimelineDatas) {
                        for (let k in ffdTimelineDatas) {
                            if (ffdTimelineStates[k]) { // Remove ffd timeline from map.
                                delete ffdTimelineStates[k];
                            }
                            else { // Create new ffd timeline.
                                const ffdTimelineState = BaseObject.borrowObject(FFDTimelineState);
                                ffdTimelineState.slot = slot;
                                ffdTimelineState._init(this._armature, this, ffdTimelineDatas[k]);
                                this._ffdTimelines.push(ffdTimelineState);
                            }
                        }
                    }
                    else {
                        resetFFDVertices = true;
                    }
                }
                else {
                    resetFFDVertices = true;
                }

                if (resetFFDVertices) {
                    for (let iA = 0, lA = slot._ffdVertices.length; iA < lA; ++iA) {
                        slot._ffdVertices[iA] = 0.0;
                    }

                    slot._meshDirty = true;
                }
            }

            for (let k in slotTimelineStates) { // Remove slot timelines.
                const slotTimelineState = slotTimelineStates[k];
                this._slotTimelines.splice(this._slotTimelines.indexOf(slotTimelineState), 1);
                slotTimelineState.returnToPool();
            }

            for (let k in ffdTimelineStates) { // Remove ffd timelines.
                const ffdTimelineState = ffdTimelineStates[k];
                this._ffdTimelines.splice(this._ffdTimelines.indexOf(ffdTimelineState), 1);
                ffdTimelineState.returnToPool();
            }
        }
        /**
         * @internal
         * @private
         */
        public _advanceTime(passedTime: number, cacheFrameRate: number): void {
            // Update fade time.
            if (this._fadeState !== 0 || this._subFadeState !== 0) {
                this._advanceFadeTime(passedTime);
            }

            // Update time.
            if (this.timeScale !== 1.0) {
                passedTime *= this.timeScale;
            }

            if (passedTime !== 0.0 && this._playheadState === 3) { // 11
                this._time += passedTime;
            }

            // Weight.
            this._weightResult = this.weight * this._fadeProgress;
            if (this._weightResult !== 0.0) {
                const isCacheEnabled = this._fadeState === 0 && cacheFrameRate > 0.0;
                let isUpdatesTimeline = true;
                let isUpdatesBoneTimeline = true;
                let time = this._time;

                // Update main timeline.
                this._timeline.update(time);

                // Cache time internval.
                if (isCacheEnabled) {
                    const internval = cacheFrameRate * 2.0;
                    this._timeline._currentTime = Math.floor(this._timeline._currentTime * internval) / internval;
                }

                // Update zOrder timeline.
                if (this._zOrderTimeline) {
                    this._zOrderTimeline.update(time);
                }

                // Update cache.
                if (isCacheEnabled) {
                    const cacheFrameIndex = Math.floor(this._timeline._currentTime * cacheFrameRate); // uint
                    if (this._armature.animation._cacheFrameIndex === cacheFrameIndex) { // Same cache.
                        isUpdatesTimeline = false;
                        isUpdatesBoneTimeline = false;
                    }
                    else {
                        this._armature.animation._cacheFrameIndex = cacheFrameIndex;

                        if (this._animationData.cachedFrames[cacheFrameIndex]) { // Cached.
                            isUpdatesBoneTimeline = false;
                        }
                        else { // Cache.
                            this._animationData.cachedFrames[cacheFrameIndex] = true;
                        }
                    }
                }

                // Update timelines.
                if (isUpdatesTimeline) {
                    if (isUpdatesBoneTimeline) {
                        for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                            this._boneTimelines[i].update(time);
                        }
                    }

                    for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                        this._slotTimelines[i].update(time);
                    }

                    for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                        this._ffdTimelines[i].update(time);
                    }
                }
            }

            if (this._fadeState === 0) {
                if (this._subFadeState > 0) {
                    this._subFadeState = 0;
                }

                if (this._timeline._playState > 0) {
                    // Auto fade out.
                    if (this.autoFadeOutTime >= 0.0) {
                        this.fadeOut(this.autoFadeOutTime);
                    }

                    if (this._animationNames.length > 0) {
                        // TODO
                    }
                }
            }
        }
        /**
         * @internal
         * @private
         */
        public _isDisabled(slot: Slot): boolean {
            if (
                this.displayControl &&
                (
                    !slot.displayController ||
                    slot.displayController === this._name ||
                    slot.displayController === this._group
                )
            ) {
                return false;
            }

            return true;
        }
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        public play(): void {
            this._playheadState = 3; // 11
        }
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        public stop(): void {
            this._playheadState &= 1; // 0x
        }
        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。
         * @version DragonBones 3.0
         */
        public fadeOut(fadeOutTime: number, pausePlayhead: boolean = true): void {
            if (fadeOutTime < 0.0 || fadeOutTime !== fadeOutTime) {
                fadeOutTime = 0.0;
            }

            if (pausePlayhead) {
                this._playheadState &= 2; // x0
            }

            if (this._fadeState > 0) {
                if (fadeOutTime > fadeOutTime - this._fadeTime) {
                    // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._fadeState = 1;
                this._subFadeState = -1;

                if (fadeOutTime <= 0.0 || this._fadeProgress <= 0.0) {
                    this._fadeProgress = 0.000001; // Modify _fadeProgress to different value.
                }

                for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i].fadeOut();
                }

                for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i].fadeOut();
                }

                for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                    this._ffdTimelines[i].fadeOut();
                }
            }

            this.displayControl = false; //
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0.0;
            this._fadeTime = this.fadeTotalTime * (1.0 - this._fadeProgress);
        }
        /**
         * @language zh_CN
         * 是否包含骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        public containsBoneMask(name: string): boolean {
            return this._boneMask.length === 0 || this._boneMask.indexOf(name) >= 0;
        }
        /**
         * @language zh_CN
         * 添加骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        public addBoneMask(name: string, recursive: boolean = true): void {
            const currentBone = this._armature.getBone(name);
            if (!currentBone) {
                return;
            }

            if (this._boneMask.indexOf(name) < 0) { // Add mixing
                this._boneMask.push(name);
            }

            if (recursive) { // Add recursive mixing.
                const bones = this._armature.getBones();
                for (let i = 0, l = bones.length; i < l; ++i) {
                    const bone = bones[i];
                    if (this._boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                        this._boneMask.push(bone.name);
                    }
                }
            }

            this._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 删除骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        public removeBoneMask(name: string, recursive: boolean = true): void {
            const index = this._boneMask.indexOf(name);
            if (index >= 0) { // Remove mixing.
                this._boneMask.splice(index, 1);
            }

            if (recursive) {
                const currentBone = this._armature.getBone(name);
                if (currentBone) {
                    const bones = this._armature.getBones();
                    if (this._boneMask.length > 0) {
                        for (let i = 0, l = bones.length; i < l; ++i) {
                            const bone = bones[i];
                            const index = this._boneMask.indexOf(bone.name);
                            if (index >= 0 && currentBone.contains(bone)) { // Remove recursive mixing.
                                this._boneMask.splice(index, 1);
                            }
                        }
                    }
                    else {
                        for (let i = 0, l = bones.length; i < l; ++i) {
                            const bone = bones[i];
                            if (!currentBone.contains(bone)) { // Add unrecursive mixing.
                                this._boneMask.push(bone.name);
                            }
                        }
                    }
                }
            }

            this._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        public removeAllBoneMask(): void {
            this._boneMask.length = 0;

            this._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 混合图层。
         * @version DragonBones 3.0
         */
        public get layer(): number {
            return this._layer;
        }
        /**
         * @language zh_CN
         * 混合组。
         * @version DragonBones 3.0
         */
        public get group(): string {
            return this._group;
        }
        /**
         * @language zh_CN
         * 动画名称。
         * @version DragonBones 3.0
         */
        public get name(): string {
            return this._name;
        }
        /**
         * @language zh_CN
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public get animationData(): AnimationData {
            return this._animationData;
        }
        /**
         * @language zh_CN
         * 是否播放完毕。
         * @version DragonBones 3.0
         */
        public get isCompleted(): boolean {
            return this._timeline._playState > 0;
        }
        /**
         * @language zh_CN
         * 是否正在播放。
         * @version DragonBones 3.0
         */
        public get isPlaying(): boolean {
            return (this._playheadState & 2) && this._timeline._playState <= 0;
        }
        /**
         * @language zh_CN
         * 当前播放次数。
         * @version DragonBones 3.0
         */
        public get currentPlayTimes(): number {
            return this._timeline._currentPlayTimes;
        }
        /**
         * @language zh_CN
         * 动画的总时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public get totalTime(): number {
            return this._duration;
        }
        /**
         * @language zh_CN
         * 动画播放的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public get currentTime(): number {
            return this._timeline._currentTime;
        }
        public set currentTime(value: number) {
            if (value < 0.0 || value !== value) {
                value = 0.0;
            }

            const currentPlayTimes = this._timeline._currentPlayTimes - (this._timeline._playState > 0 ? 1 : 0);
            value = (value % this._duration) + currentPlayTimes * this._duration;
            if (this._time === value) {
                return;
            }

            this._time = value;
            this._timeline.setCurrentTime(this._time);

            if (this._zOrderTimeline) {
                this._zOrderTimeline._playState = -1;
            }

            for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i]._playState = -1;
            }

            for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i]._playState = -1;
            }

            for (let i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i]._playState = -1;
            }
        }

        /**
         * @deprecated
         */
        public autoTween: boolean = false;
        /**
         * @deprecated
         * @see #animationData
         */
        public get clip(): AnimationData {
            return this._animationData;
        }
    }
}