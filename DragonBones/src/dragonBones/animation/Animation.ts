namespace dragonBones {
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    export class Animation extends BaseObject {
        private static _sortAnimationState(a: AnimationState, b: AnimationState): number {
            return a.layer > b.layer ? -1 : 1;
        }
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.Animation]";
        }
        /**
         * @language zh_CN
         * 动画播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        public timeScale: number;

        private _isPlaying: boolean;
        private _animationStateDirty: boolean; // Update bones and slots cachedFrameIndices.
        /**
         * @internal
         * @private
         */
        public _timelineStateDirty: boolean; // Updata animationStates timelineStates.
        /**
         * @private
         */
        public _cacheFrameIndex: number;
        private _animationNames: Array<string> = [];
        private _animations: Map<AnimationData> = {};
        private _animationStates: Array<AnimationState> = [];
        private _armature: Armature;
        private _lastAnimationState: AnimationState;
        private _animationConfig: AnimationConfig;
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
            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }

            if (this._animationConfig) {
                this._animationConfig.returnToPool();
            }

            for (let k in this._animations) {
                delete this._animations[k];
            }

            this.timeScale = 1.0;

            this._isPlaying = false;
            this._animationStateDirty = false;
            this._timelineStateDirty = false;
            this._cacheFrameIndex = -1;
            this._animationNames.length = 0;
            //this._animations.clear();
            this._animationStates.length = 0;
            this._armature = null;
            this._lastAnimationState = null;
            this._animationConfig = null;
        }

        private _fadeOut(animationConfig: AnimationConfig): void {
            let i = 0, l = this._animationStates.length;
            let animationState: AnimationState = null;

            switch (animationConfig.fadeOutMode) {
                case AnimationFadeOutMode.SameLayer:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer === animationConfig.layer) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.SameGroup:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.group === animationConfig.group) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.SameLayerAndGroup:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (
                            animationState.layer === animationConfig.layer &&
                            animationState.group === animationConfig.group
                        ) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.All:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                    }
                    break;

                case AnimationFadeOutMode.None:
                default:
                    break;
            }
        }
        /**
         * @internal
         * @private
         */
        public _init(armature: Armature): void {
            if (this._armature) {
                return;
            }

            this._armature = armature;
            this._animationConfig = BaseObject.borrowObject(AnimationConfig);
        }
        /**
         * @internal
         * @private
         */
        public _advanceTime(passedTime: number): void {
            if (!this._isPlaying) {
                return;
            }

            if (passedTime < 0.0) {
                passedTime = -passedTime;
            }

            if (this._armature.inheritAnimation && this._armature._parent) { // Inherit parent animation timeScale.
                passedTime *= this._armature._parent._armature.animation.timeScale;
            }

            if (this.timeScale !== 1.0) {
                passedTime *= this.timeScale;
            }

            const animationStateCount = this._animationStates.length;
            if (animationStateCount === 1) {
                const animationState = this._animationStates[0];
                if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                    animationState.returnToPool();
                    this._animationStates.length = 0;
                    this._animationStateDirty = true;
                    this._lastAnimationState = null;
                }
                else {
                    const animationData = animationState.animationData;
                    const cacheFrameRate = animationData.cacheFrameRate;

                    if (this._animationStateDirty && cacheFrameRate > 0.0) { // Update cachedFrameIndices.
                        this._animationStateDirty = false;

                        const bones = this._armature.getBones();
                        for (let i = 0, l = bones.length; i < l; ++i) {
                            const bone = bones[i];
                            bone._cachedFrameIndices = animationData.getBoneCachedFrameIndices(bone.name);
                        }

                        const slots = this._armature.getSlots();
                        for (let i = 0, l = slots.length; i < l; ++i) {
                            const slot = slots[i];
                            slot._cachedFrameIndices = animationData.getSlotCachedFrameIndices(slot.name);
                        }
                    }

                    if (this._timelineStateDirty) {
                        animationState._updateTimelineStates();
                    }

                    animationState._advanceTime(passedTime, cacheFrameRate);
                }
            }
            else if (animationStateCount > 1) {
                for (let i = 0, r = 0; i < animationStateCount; ++i) {
                    const animationState = this._animationStates[i];
                    if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                        r++;
                        animationState.returnToPool();
                        this._animationStateDirty = true;

                        if (this._lastAnimationState === animationState) { // Update last animation state.
                            this._lastAnimationState = null;
                        }
                    }
                    else {
                        if (r > 0) {
                            this._animationStates[i - r] = animationState;
                        }

                        if (this._timelineStateDirty) {
                            animationState._updateTimelineStates();
                        }

                        animationState._advanceTime(passedTime, 0.0);
                    }

                    if (i === animationStateCount - 1 && r > 0) { // Modify animation states size.
                        this._animationStates.length -= r;

                        if (!this._lastAnimationState && this._animationStates.length > 0) {
                            this._lastAnimationState = this._animationStates[this._animationStates.length - 1];
                        }
                    }
                }

                this._cacheFrameIndex = -1;
            }
            else {
                this._cacheFrameIndex = -1;
            }

            this._timelineStateDirty = false;
        }
        /**
         * @language zh_CN
         * 清除所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public reset(): void {
            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }

            this._isPlaying = false;
            this._animationStateDirty = false;
            this._timelineStateDirty = false;
            this._cacheFrameIndex = -1;
            this._animationConfig.clear();
            this._animationStates.length = 0;
            this._lastAnimationState = null;
        }
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public stop(animationName: string = null): void {
            if (animationName) {
                const animationState = this.getState(animationName);
                if (animationState) {
                    animationState.stop();
                }
            }
            else {
                this._isPlaying = false;
            }
        }
        /**
         * @language zh_CN
         * @beta
         * 通过动画配置来播放动画。
         * @param animationConfig 动画配置。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationConfig
         * @see dragonBones.AnimationState
         * @version DragonBones 5.0
         */
        public playConfig(animationConfig: AnimationConfig): AnimationState {
            if (!animationConfig) {
                throw new Error(DragonBones.ARGUMENT_ERROR);
                //return null;
            }

            const animationName = animationConfig.animationName ? animationConfig.animationName : animationConfig.name;
            const animationData = this._animations[animationName];
            if (!animationData) {
                console.warn(
                    "Non-existent animation.\n",
                    "DragonBones name: " + this._armature.armatureData.parent.name,
                    "Armature name: " + this._armature.name,
                    "Animation name: " + animationName
                );

                return null;
            }

            this._isPlaying = true;

            if (animationConfig.playTimes < 0) {
                animationConfig.playTimes = animationData.playTimes;
            }

            if (animationConfig.fadeInTime < 0.0 || animationConfig.fadeInTime !== animationConfig.fadeInTime) {
                if (this._lastAnimationState) {
                    animationConfig.fadeInTime = animationData.fadeInTime;
                }
                else {
                    animationConfig.fadeInTime = 0.0;
                }
            }

            if (animationConfig.fadeOutTime < 0.0 || animationConfig.fadeOutTime !== animationConfig.fadeOutTime) {
                animationConfig.fadeOutTime = animationConfig.fadeInTime;
            }

            if (animationConfig.timeScale <= -100.0 || animationConfig.timeScale !== animationConfig.timeScale) { //
                animationConfig.timeScale = 1.0 / animationData.scale;
            }

            if (animationData.duration > 0.0) {
                if (animationConfig.position !== animationConfig.position) {
                    animationConfig.position = 0.0;
                }
                else if (animationConfig.position < 0.0) {
                    animationConfig.position %= animationData.duration;
                    animationConfig.position = animationData.duration - animationConfig.position;
                }
                else if (animationConfig.position === animationData.duration) {
                    animationConfig.position -= 0.001;
                }
                else if (animationConfig.position > animationData.duration) {
                    animationConfig.position %= animationData.duration;
                }

                if (animationConfig.position + animationConfig.duration > animationData.duration) {
                    animationConfig.duration = animationData.duration - animationConfig.position;
                }
            }
            else {
                animationConfig.position = 0.0;
                animationConfig.duration = -1.0;
            }

            const isStop = animationConfig.duration === 0.0;
            if (isStop) {
                animationConfig.playTimes = 1;
                animationConfig.duration = -1.0;
                animationConfig.fadeInTime = 0.0;
            }

            this._fadeOut(animationConfig);

            this._lastAnimationState = BaseObject.borrowObject(AnimationState);
            this._lastAnimationState._init(this._armature, animationData, animationConfig);
            this._animationStates.push(this._lastAnimationState);
            this._animationStateDirty = true;
            this._cacheFrameIndex = -1;

            if (this._animationStates.length > 1) {
                this._animationStates.sort(Animation._sortAnimationState);
            }

            // Child armature play same name animation.
            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const childArmature = slots[i].childArmature;
                if (
                    childArmature && childArmature.inheritAnimation &&
                    childArmature.animation.hasAnimation(animationName) &&
                    !childArmature.animation.getState(animationName)
                ) {
                    childArmature.animation.fadeIn(animationName); //
                }
            }

            if (animationConfig.fadeInTime <= 0.0) { // Blend animation state, update armature.
                this._armature.advanceTime(0.0);
            }

            if (isStop) {
                this._lastAnimationState.stop();
            }

            return this._lastAnimationState;
        }
        /**
         * @language zh_CN
         * 淡入播放动画。
         * @param animationName 动画数据名称。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @param layer 混合图层，图层高会优先获取混合权重。
         * @param group 混合组，用于动画状态编组，方便控制淡出。
         * @param fadeOutMode 淡出模式。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public fadeIn(
            animationName: string, fadeInTime: number = -1.0, playTimes: number = -1,
            layer: number = 0, group: string = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup
        ): AnimationState {
            this._animationConfig.clear();
            this._animationConfig.fadeOutMode = fadeOutMode;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.layer = layer;
            this._animationConfig.fadeInTime = fadeInTime;
            this._animationConfig.animationName = animationName;
            this._animationConfig.group = group;

            return this.playConfig(this._animationConfig);
        }
        /**
         * @language zh_CN
         * 播放动画。
         * @param animationName 动画数据名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。 
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public play(animationName: string = null, playTimes: number = -1): AnimationState {
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;

            if (animationName) {
                this.playConfig(this._animationConfig);
            }
            else if (!this._lastAnimationState) {
                const defaultAnimation = this._armature.armatureData.defaultAnimation;
                if (defaultAnimation) {
                    this._animationConfig.animationName = defaultAnimation.name;
                    this.playConfig(this._animationConfig);
                }
            }
            else if (!this._isPlaying || (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted)) {
                this._isPlaying = true;
                this._lastAnimationState.play();
            }
            else {
                this._animationConfig.animationName = this._lastAnimationState.name;
                this.playConfig(this._animationConfig);
            }

            return this._lastAnimationState;
        }
        /**
         * @language zh_CN
         * 从指定时间开始播放动画。
         * @param animationName 动画数据的名称。
         * @param time 开始时间。 (以秒为单位)
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByTime(animationName: string, time: number = 0.0, playTimes: number = -1): AnimationState {
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.position = time;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;

            return this.playConfig(this._animationConfig);
        }
        /**
         * @language zh_CN
         * 从指定帧开始播放动画。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByFrame(animationName: string, frame: number = 0, playTimes: number = -1): AnimationState {
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;

            const animationData = this._animations[animationName];
            if (animationData) {
                this._animationConfig.position = animationData.duration * frame / animationData.frameCount;
            }

            return this.playConfig(this._animationConfig);
        }
        /**
         * @language zh_CN
         * 从指定进度开始播放动画。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByProgress(animationName: string, progress: number = 0.0, playTimes: number = -1): AnimationState {
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;

            const animationData = this._animations[animationName];
            if (animationData) {
                this._animationConfig.position = animationData.duration * (progress > 0.0 ? progress : 0.0);
            }

            return this.playConfig(this._animationConfig);
        }
        /**
         * @language zh_CN
         * 将动画停止到指定的时间。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByTime(animationName: string, time: number = 0.0): AnimationState {
            const animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 将动画停止到指定的帧。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByFrame(animationName: string, frame: number = 0): AnimationState {
            const animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
            if (animationState) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 将动画停止到指定的进度。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0 ~ 1]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByProgress(animationName: string, progress: number = 0.0): AnimationState {
            const animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 获取动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public getState(animationName: string): AnimationState {
            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                const animationState = this._animationStates[i];
                if (animationState.name === animationName) {
                    return animationState;
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 是否包含动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public hasAnimation(animationName: string): boolean {
            return this._animations[animationName] != null;
        }
        /**
         * @language zh_CN
         * 动画是否处于播放状态。
         * @version DragonBones 3.0
         */
        public get isPlaying(): boolean {
            if (this._animationStates.length > 1) {
                return this._isPlaying && !this.isCompleted;
            }
            else if (this._lastAnimationState) {
                return this._isPlaying && this._lastAnimationState.isPlaying;
            }

            return this._isPlaying;
        }
        /**
         * @language zh_CN
         * 所有动画状态是否均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public get isCompleted(): boolean {
            if (this._lastAnimationState) {
                if (!this._lastAnimationState.isCompleted) {
                    return false;
                }

                for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                    if (!this._animationStates[i].isCompleted) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态名称。
         * @see #lastAnimationState
         * @version DragonBones 3.0
         */
        public get lastAnimationName(): string {
            return this._lastAnimationState ? this._lastAnimationState.name : null;
        }
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public get lastAnimationState(): AnimationState {
            return this._lastAnimationState;
        }
        /**
         * @language zh_CN
         * 一个可以快速使用的动画配置实例。
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         */
        public get animationConfig(): AnimationConfig {
            return this._animationConfig;
        }
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #animations
         * @version DragonBones 4.5
         */
        public get animationNames(): Array<string> {
            return this._animationNames;
        }
        /**
         * @language zh_CN
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        public get animations(): Map<AnimationData> {
            return this._animations;
        }
        public set animations(value: Map<AnimationData>) {
            if (this._animations === value) {
                return;
            }

            this._animationNames.length = 0;

            for (let k in this._animations) {
                delete this._animations[k];
            }

            if (value) {
                for (let k in value) {
                    this._animations[k] = value[k];
                    this._animationNames.push(k);
                }
            }
        }

        /**
         * @deprecated
         * @see #play()
         * @see #fadeIn()
         * @see #gotoAndPlayByTime()
         * @see #gotoAndPlayByFrame()
         * @see #gotoAndPlayByProgress()
         */
        public gotoAndPlay(
            animationName: string, fadeInTime: number = -1, duration: number = -1, playTimes: number = -1,
            layer: number = 0, group: string = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup,
            pauseFadeOut: boolean = true, pauseFadeIn: boolean = true
        ): AnimationState {
            this._animationConfig.clear();
            this._animationConfig.fadeOutMode = fadeOutMode;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.layer = layer;
            this._animationConfig.fadeInTime = fadeInTime;
            this._animationConfig.animationName = animationName;
            this._animationConfig.group = group;

            const animationData = this._animations[animationName];
            if (animationData && duration > 0) {
                this._animationConfig.timeScale = animationData.duration / duration;
            }

            return this.playConfig(this._animationConfig);
        }
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        public gotoAndStop(animationName: string, time: number = 0): AnimationState {
            return this.gotoAndStopByTime(animationName, time);
        }
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        public get animationList(): Array<string> {
            return this._animationNames;
        }
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        public get animationDataList(): Array<AnimationData> {
            const list: AnimationData[] = [];
            for (let i = 0, l = this._animationNames.length; i < l; ++i) {
                list.push(this._animations[this._animationNames[i]]);
            }

            return list;
        }
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.None
         */
        public static None = AnimationFadeOutMode.None;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.SameLayer
         */
        public static SameLayer = AnimationFadeOutMode.SameLayer;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.SameGroup
         */
        public static SameGroup = AnimationFadeOutMode.SameGroup;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.SameLayerAndGroup
         */
        public static SameLayerAndGroup = AnimationFadeOutMode.SameLayerAndGroup;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.All
         */
        public static All = AnimationFadeOutMode.All;
    }
}