namespace dragonBones {
    /**
     * The animation player is used to play the animation data and manage the animation states.
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * 动画播放器用来播放动画数据和管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class Animation extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.Animation]";
        }
        /**
         * The play speed of all animations. [0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
         * @default 1.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 所有动画的播放速度。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public timeScale: number;

        private _animationDirty: boolean; // Update bones and slots cachedFrameIndices.
        private _inheritTimeScale: number;
        private readonly _animationNames: Array<string> = [];
        private readonly _animationStates: Array<AnimationState> = [];
        private readonly _animations: Map<AnimationData> = {};
        private _armature: Armature;
        private _animationConfig: AnimationConfig = null as any; // Initial value.
        private _lastAnimationState: AnimationState | null;
        /**
         * @private
         */
        protected _onClear(): void {
            for (const animationState of this._animationStates) {
                animationState.returnToPool();
            }

            for (let k in this._animations) {
                delete this._animations[k];
            }

            if (this._animationConfig !== null) {
                this._animationConfig.returnToPool();
            }

            this.timeScale = 1.0;

            this._animationDirty = false;
            this._inheritTimeScale = 1.0;
            this._animationNames.length = 0;
            this._animationStates.length = 0;
            //this._animations.clear();
            this._armature = null as any; //
            this._animationConfig = null as any; //
            this._lastAnimationState = null;
        }

        private _fadeOut(animationConfig: AnimationConfig): void {
            switch (animationConfig.fadeOutMode) {
                case AnimationFadeOutMode.SameLayer:
                    for (const animationState of this._animationStates) {
                        if (animationState.layer === animationConfig.layer) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.SameGroup:
                    for (const animationState of this._animationStates) {
                        if (animationState.group === animationConfig.group) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.SameLayerAndGroup:
                    for (const animationState of this._animationStates) {
                        if (
                            animationState.layer === animationConfig.layer &&
                            animationState.group === animationConfig.group
                        ) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.All:
                    for (const animationState of this._animationStates) {
                        animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                    }
                    break;

                case AnimationFadeOutMode.None:
                case AnimationFadeOutMode.Single:
                default:
                    break;
            }
        }
        /**
         * @internal
         * @private
         */
        public init(armature: Armature): void {
            if (this._armature !== null) {
                return;
            }

            this._armature = armature;
            this._animationConfig = BaseObject.borrowObject(AnimationConfig);
        }
        /**
         * @internal
         * @private
         */
        public advanceTime(passedTime: number): void {
            if (passedTime < 0.0) { // Only animationState can reverse play.
                passedTime = -passedTime;
            }

            if (this._armature.inheritAnimation && this._armature._parent !== null) { // Inherit parent animation timeScale.
                this._inheritTimeScale = this._armature._parent._armature.animation._inheritTimeScale * this.timeScale;
            }
            else {
                this._inheritTimeScale = this.timeScale;
            }

            if (this._inheritTimeScale !== 1.0) {
                passedTime *= this._inheritTimeScale;
            }

            const animationStateCount = this._animationStates.length;
            if (animationStateCount === 1) {
                const animationState = this._animationStates[0];
                if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                    this._armature._dragonBones.bufferObject(animationState);
                    this._animationStates.length = 0;
                    this._lastAnimationState = null;
                }
                else {
                    const animationData = animationState._animationData;
                    const cacheFrameRate = animationData.cacheFrameRate;
                    if (this._animationDirty && cacheFrameRate > 0.0) { // Update cachedFrameIndices.
                        this._animationDirty = false;
                        for (const bone of this._armature.getBones()) {
                            bone._cachedFrameIndices = animationData.getBoneCachedFrameIndices(bone.name);
                        }

                        for (const slot of this._armature.getSlots()) {
                            slot._cachedFrameIndices = animationData.getSlotCachedFrameIndices(slot.name);
                        }
                    }

                    animationState.advanceTime(passedTime, cacheFrameRate);
                }
            }
            else if (animationStateCount > 1) {
                for (let i = 0, r = 0; i < animationStateCount; ++i) {
                    const animationState = this._animationStates[i];
                    if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                        r++;
                        this._armature._dragonBones.bufferObject(animationState);
                        this._animationDirty = true;
                        if (this._lastAnimationState === animationState) { // Update last animation state.
                            this._lastAnimationState = null;
                        }
                    }
                    else {
                        if (r > 0) {
                            this._animationStates[i - r] = animationState;
                        }

                        animationState.advanceTime(passedTime, 0.0);
                    }

                    if (i === animationStateCount - 1 && r > 0) { // Modify animation states size.
                        this._animationStates.length -= r;
                        if (this._lastAnimationState === null && this._animationStates.length > 0) {
                            this._lastAnimationState = this._animationStates[this._animationStates.length - 1];
                        }
                    }
                }

                this._armature._cacheFrameIndex = -1;
            }
            else {
                this._armature._cacheFrameIndex = -1;
            }
        }
        /**
         * Clear all animation states.
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 清除所有的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public reset(): void {
            for (const animationState of this._animationStates) {
                animationState.returnToPool();
            }

            this._animationDirty = false;
            this._animationConfig.clear();
            this._animationStates.length = 0;
            this._lastAnimationState = null;
        }
        /**
         * Stop the play of a specific animation state.
         * @param animationName The animation state name (If not set, will stop all animation states play)
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 暂停特定动画状态的播放。
         * @param animationName 动画状态名称 （如果未设置，则暂停所有动画状态的播放）
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public stop(animationName: string | null = null): void {
            if (animationName !== null) {
                const animationState = this.getState(animationName);
                if (animationState !== null) {
                    animationState.stop();
                }
            }
            else {
                for (const animationState of this._animationStates) {
                    animationState.stop();
                }
            }
        }
        /**
         * Play animation with a specific animation config.
         * @param animationConfig The animation config
         * @returns The played animation state
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @beta
         * @language en_US
         */
        /**
         * 通过特定的动画配置来播放动画。
         * @param animationConfig 动画配置
         * @returns 播放的动画状态
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @beta 
         * @language zh_CN
         */
        public playConfig(animationConfig: AnimationConfig): AnimationState | null {
            const animationName = animationConfig.animation;
            if (!(animationName in this._animations)) {
                console.warn(
                    "Non-existent animation.\n",
                    "DragonBones name: " + this._armature.armatureData.parent.name,
                    "Armature name: " + this._armature.name,
                    "Animation name: " + animationName
                );

                return null;
            }

            const animationData = this._animations[animationName];

            if (animationConfig.fadeOutMode === AnimationFadeOutMode.Single) {
                for (const animationState of this._animationStates) {
                    if (animationState._animationData === animationData) {
                        return animationState;
                    }
                }
            }

            if (this._animationStates.length === 0) {
                animationConfig.fadeInTime = 0.0;
            }
            else if (animationConfig.fadeInTime < 0.0) {
                animationConfig.fadeInTime = animationData.fadeInTime;
            }

            if (animationConfig.fadeOutTime < 0.0) {
                animationConfig.fadeOutTime = animationConfig.fadeInTime;
            }

            if (animationConfig.timeScale <= -100.0) {
                animationConfig.timeScale = 1.0 / animationData.scale;
            }

            if (animationData.frameCount > 1) {
                if (animationConfig.position < 0.0) {
                    animationConfig.position %= animationData.duration;
                    animationConfig.position = animationData.duration - animationConfig.position;
                }
                else if (animationConfig.position === animationData.duration) {
                    animationConfig.position -= 0.000001; // Play a little time before end.
                }
                else if (animationConfig.position > animationData.duration) {
                    animationConfig.position %= animationData.duration;
                }

                if (animationConfig.duration > 0.0 && animationConfig.position + animationConfig.duration > animationData.duration) {
                    animationConfig.duration = animationData.duration - animationConfig.position;
                }

                if (animationConfig.playTimes < 0) {
                    animationConfig.playTimes = animationData.playTimes;
                }
            }
            else {
                animationConfig.playTimes = 1;
                animationConfig.position = 0.0;
                if (animationConfig.duration > 0.0) {
                    animationConfig.duration = 0.0;
                }
            }

            if (animationConfig.duration === 0.0) {
                animationConfig.duration = -1.0;
            }

            this._fadeOut(animationConfig);

            const animationState = BaseObject.borrowObject(AnimationState);
            animationState.init(this._armature, animationData, animationConfig);
            this._animationDirty = true;
            this._armature._cacheFrameIndex = -1;

            if (this._animationStates.length > 0) {
                let added = false;
                for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                    if (animationState.layer >= this._animationStates[i].layer) {
                    }
                    else {
                        added = true;
                        this._animationStates.splice(i + 1, 0, animationState);
                        break;
                    }
                }

                if (!added) {
                    this._animationStates.push(animationState);
                }
            }
            else {
                this._animationStates.push(animationState);
            }

            // Child armature play same name animation.
            for (const slot of this._armature.getSlots()) {
                const childArmature = slot.childArmature;
                if (
                    childArmature !== null && childArmature.inheritAnimation &&
                    childArmature.animation.hasAnimation(animationName) &&
                    childArmature.animation.getState(animationName) === null
                ) {
                    childArmature.animation.fadeIn(animationName); //
                }
            }

            if (animationConfig.fadeInTime <= 0.0) { // Blend animation state, update armature.
                this._armature.advanceTime(0.0);
            }

            this._lastAnimationState = animationState;

            return animationState;
        }
        /**
         * Play a specific animation.
         * @param animationName The animation data name (If not set, play the default animation or switches the pause status to play or replay the last playing animation)
         * @param playTimes The play times [-1: Use default value of the animation data, 0: Loop play, [1~N]: Play N times]
         * @returns The played animation state
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 播放特定的动画。
         * @param animationName 动画数据名称 （如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画）
         * @param playTimes 播放次数 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 播放的动画状态
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public play(animationName: string | null = null, playTimes: number = -1): AnimationState | null {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName !== null ? animationName : "";

            if (animationName !== null && animationName.length > 0) {
                this.playConfig(this._animationConfig);
            }
            else if (this._lastAnimationState === null) {
                const defaultAnimation = this._armature.armatureData.defaultAnimation;
                if (defaultAnimation !== null) {
                    this._animationConfig.animation = defaultAnimation.name;
                    this.playConfig(this._animationConfig);
                }
            }
            else if (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted) {
                this._lastAnimationState.play();
            }
            else {
                this._animationConfig.animation = this._lastAnimationState.name;
                this.playConfig(this._animationConfig);
            }

            return this._lastAnimationState;
        }
        /**
         * Fade in a specific animation.
         * @param animationName The animation data name
         * @param playTimes The play times [-1: Use the animation data default value, 0: Loop play, [1~N]: Play N times]
         * @param fadeInTime The fade in time [-1: Use the animation data default value, [0~N]: The fade in time] (In seconds)
         * @param layer The blend layer, the animation states of the high layer will get the blend weight first, when the blend weight is allocated more than 1.0, the remaining animation states will no longer get the weight distribution
         * @param group The blend group name, This property is typically used to specify the substitution of multiple animation states blend.
         * @param fadeOutMode The fade out mode, which is typically used to specify alternate mode when multiple animation states are blend.
         * @returns The played animation state
         * @version DragonBones 4.5
         * @example
         * <pre>
         *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
         *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
         * </pre>
         * @language en_US
         */
        /**
         * 淡入播放特定的动画。
         * @param animationName 动画数据名称
         * @param playTimes 播放次数 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入时间 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @param layer 混合图层，图层高的动画状态会优先获取混合权重，当混合权重分配超过 1.0 时，剩余的动画状态将不再获得权重分配
         * @param group 混合组名称，该属性通常用来指定多个动画状态混合时的相互替换关系。
         * @param fadeOutMode 淡出模式，该属性通常用来指定多个动画状态混合时的相互替换模式。
         * @returns 播放的动画状态
         * @version DragonBones 4.5
         * @example
         * <pre>
         *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
         *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
         * </pre>
         * @language zh_CN
         */
        public fadeIn(
            animationName: string, fadeInTime: number = -1.0, playTimes: number = -1,
            layer: number = 0, group: string | null = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup
        ): AnimationState | null {
            this._animationConfig.clear();
            this._animationConfig.fadeOutMode = fadeOutMode;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.layer = layer;
            this._animationConfig.fadeInTime = fadeInTime;
            this._animationConfig.animation = animationName;
            this._animationConfig.group = group !== null ? group : "";

            return this.playConfig(this._animationConfig);
        }
        /**
         * Play a specific animation from the specified time.
         * @param animationName The animation data name
         * @param time The time (In seconds)
         * @param playTimes The play times [-1: Use the animation data default value, 0: Loop play, [1~N]: Play N times]
         * @returns The played animation state
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 从特定时间开始播放特定的动画。
         * @param animationName 动画数据名称
         * @param time 开始时间 (以秒为单位)
         * @param playTimes 播放次数 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 播放的动画状态
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public gotoAndPlayByTime(animationName: string, time: number = 0.0, playTimes: number = -1): AnimationState | null {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.position = time;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName;

            return this.playConfig(this._animationConfig);
        }
        /**
         * Play a specific animation from the specified frame.
         * @param animationName The animation data name
         * @param frame The frame
         * @param playTimes The play times [-1: Use the animation data default value, 0: Loop play, [1~N]: Play N times]
         * @returns The played animation state
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 从特定帧开始播放特定的动画。
         * @param animationName 动画数据名称
         * @param frame 帧
         * @param playTimes 播放次数 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 播放的动画状态
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public gotoAndPlayByFrame(animationName: string, frame: number = 0, playTimes: number = -1): AnimationState | null {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName;

            const animationData = animationName in this._animations ? this._animations[animationName] : null;
            if (animationData !== null) {
                this._animationConfig.position = animationData.duration * frame / animationData.frameCount;
            }

            return this.playConfig(this._animationConfig);
        }
        /**
         * Play a specific animation from the specified progress.
         * @param animationName The animation data name
         * @param progress The progress
         * @param playTimes The play times [-1: Use the animation data default value, 0: Loop play, [1~N]: Play N times]
         * @returns The played animation state
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 从特定进度开始播放特定的动画。
         * @param animationName 动画数据名称
         * @param progress 进度
         * @param playTimes 播放次数 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 播放的动画状态
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public gotoAndPlayByProgress(animationName: string, progress: number = 0.0, playTimes: number = -1): AnimationState | null {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName;

            const animationData = animationName in this._animations ? this._animations[animationName] : null;
            if (animationData !== null) {
                this._animationConfig.position = animationData.duration * (progress > 0.0 ? progress : 0.0);
            }

            return this.playConfig(this._animationConfig);
        }
        /**
         * Stop a specific animation to the specific time.
         * @param animationName The animation data name
         * @param time The time (In seconds)
         * @returns The played animation state
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 将特定动画停止到特定的时间。
         * @param animationName 动画数据名称
         * @param time 时间 (以秒为单位)
         * @returns 播放的动画状态
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public gotoAndStopByTime(animationName: string, time: number = 0.0): AnimationState | null {
            const animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState !== null) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * Stop a specific animation to the specific frame.
         * @param animationName The animation data name
         * @param frame The frame
         * @returns The played animation state
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 将特定动画停止到特定的帧。
         * @param animationName 动画数据名称
         * @param frame 帧
         * @returns 播放的动画状态
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public gotoAndStopByFrame(animationName: string, frame: number = 0): AnimationState | null {
            const animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
            if (animationState !== null) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * Stop a specific animation to the specific progress.
         * @param animationName The animation data name
         * @param progress The progress
         * @returns The played animation state
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 将特定动画停止到特定的进度。
         * @param animationName 动画数据名称
         * @param progress 进度
         * @returns 播放的动画状态
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public gotoAndStopByProgress(animationName: string, progress: number = 0.0): AnimationState | null {
            const animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState !== null) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * Get a specific animation state.
         * @param animationName The animation state name
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 获取特定的动画状态。
         * @param animationName 动画状态名称
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getState(animationName: string): AnimationState | null {
            let i = this._animationStates.length;
            while (i--) {
                const animationState = this._animationStates[i];
                if (animationState.name === animationName) {
                    return animationState;
                }
            }

            return null;
        }
        /**
         * Check if a specific animation data is included.
         * @param animationName The animation data name
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 检查是否包含特定的动画数据。
         * @param animationName 动画数据名称
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public hasAnimation(animationName: string): boolean {
            return animationName in this._animations;
        }
        /**
         * Get all the animation states.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * 获取所有的动画状态。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public getStates(): Array<AnimationState> {
            return this._animationStates;
        }
        /**
         * Check whether have an animation state is playing.
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 检查是否有动画状态正在播放。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get isPlaying(): boolean {
            for (const animationState of this._animationStates) {
                if (animationState.isPlaying) {
                    return true;
                }
            }

            return false;
        }
        /**
         * Check whether all the animation states has been play completed.
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 检查是否所有的动画状态均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get isCompleted(): boolean {
            for (const animationState of this._animationStates) {
                if (!animationState.isCompleted) {
                    return false;
                }
            }

            return this._animationStates.length > 0;
        }
        /**
         * The name of the prev playing animation state.
         * @see #lastAnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 上一个正在播放的动画状态名称。
         * @see #lastAnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get lastAnimationName(): string {
            return this._lastAnimationState !== null ? this._lastAnimationState.name : "";
        }
        /**
         * All animation data names.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 所有动画数据的名称。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get animationNames(): Array<string> {
            return this._animationNames;
        }
        /**
         * All animation data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * 所有的动画数据。
         * @version DragonBones 4.5
         * @language zh_CN
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

            for (let k in value) {
                this._animationNames.push(k);
                this._animations[k] = value[k];
            }
        }
        /**
         * An AnimationConfig instance that can be used quickly.
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * 一个可以快速使用的动画配置实例。
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public get animationConfig(): AnimationConfig {
            this._animationConfig.clear();
            return this._animationConfig;
        }
        /**
         * Prev played animation state.
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 上一个播放的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get lastAnimationState(): AnimationState | null {
            return this._lastAnimationState;
        }

        /**
         * Deprecated, please refer to {@link #play()} {@link #fadeIn()}.
         * @deprecated
         * @language en_US
         */
        /**
         * 已废弃，请参考 {@link #play()} {@link #fadeIn()}。
         * @deprecated
         * @language zh_CN
         */
        public gotoAndPlay(
            animationName: string, fadeInTime: number = -1, duration: number = -1, playTimes: number = -1,
            layer: number = 0, group: string | null = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup,
            pauseFadeOut: boolean = true, pauseFadeIn: boolean = true
        ): AnimationState | null {
            // tslint:disable-next-line:no-unused-expression
            pauseFadeOut;
            // tslint:disable-next-line:no-unused-expression
            pauseFadeIn;
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.fadeOutMode = fadeOutMode;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.layer = layer;
            this._animationConfig.fadeInTime = fadeInTime;
            this._animationConfig.animation = animationName;
            this._animationConfig.group = group !== null ? group : "";

            const animationData = this._animations[animationName];
            if (animationData && duration > 0.0) {
                this._animationConfig.timeScale = animationData.duration / duration;
            }

            return this.playConfig(this._animationConfig);
        }
        /**
         * Deprecated, please refer to {@link #gotoAndStopByTime()}.
         * @deprecated
         * @language en_US
         */
        /**
         * 已废弃，请参考 {@link #gotoAndStopByTime()}。
         * @deprecated
         * @language zh_CN
         */
        public gotoAndStop(animationName: string, time: number = 0): AnimationState | null {
            return this.gotoAndStopByTime(animationName, time);
        }
        /**
         * Deprecated, please refer to {@link #animationNames}.
         * @deprecated
         * @language en_US
         */
        /**
         * 已废弃，请参考 {@link #animationNames}。
         * @deprecated
         * @language zh_CN
         */
        public get animationList(): Array<string> {
            return this._animationNames;
        }
        /**
         * Deprecated, please refer to {@link #animationNames}.
         * @deprecated
         * @language en_US
         */
        /**
         * 已废弃，请参考 {@link #animationNames}。
         * @deprecated
         * @language zh_CN
         */
        public get animationDataList(): Array<AnimationData> {
            const list: AnimationData[] = [];
            for (let i = 0, l = this._animationNames.length; i < l; ++i) {
                list.push(this._animations[this._animationNames[i]]);
            }

            return list;
        }
    }
}