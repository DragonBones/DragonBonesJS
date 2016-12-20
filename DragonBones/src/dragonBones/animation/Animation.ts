namespace dragonBones {
    /**
     * @language zh_CN
     * 动画混合时，使用的淡出方式。
     * @see dragonBones.Animation#fadeIn()
     * @version DragonBones 4.5
     */
    export const enum AnimationFadeOutMode {
        /**
         * @language zh_CN
         * 不淡出动画。
         * @version DragonBones 4.5
         */
        None = 0,
        /**
        * @language zh_CN
         * 淡出同层的动画。
         * @version DragonBones 4.5
         */
        SameLayer = 1,
        /**
         * @language zh_CN
         * 淡出同组的动画。
         * @version DragonBones 4.5
         */
        SameGroup = 2,
        /**
         * @language zh_CN
         * 淡出同层并且同组的动画。
         * @version DragonBones 4.5
         */
        SameLayerAndGroup = 3,
        /**
         * @language zh_CN
         * 淡出所有动画。
         * @version DragonBones 4.5
         */
        All = 4
    }
    /**
     * @language zh_CN
     * 播放动画组件接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以加到 WorldClock 时钟中，由时钟统一控制动画的播放。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    export interface IAnimateble {
        /**
        * @language zh_CN
        * 更新一个指定的时间。
        * @param passedTime 前进的时间。 (以秒为单位)
        * @version DragonBones 3.0
        */
        advanceTime(passedTime: number): void;
    }
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    export class Animation extends BaseObject {
        /**
         * @private
         */
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
         * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        public timeScale: number;
        /**
         * @internal
         * @private
         */
        public _animationStateDirty: boolean;
        /**
         * @private
         */
        public _armature: Armature;

        private _isPlaying: boolean;
        private _time: number;
        private _duration: number;
        private _lastAnimationState: AnimationState;
        private _animations: Map<AnimationData> = {};
        private _animationNames: Array<string> = [];
        private _animationStates: Array<AnimationState> = [];
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            for (let i in this._animations) {
                delete this._animations[i];
            }

            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }

            this.timeScale = 1;

            this._animationStateDirty = false;
            this._armature = null;

            this._isPlaying = false;
            this._time = 0;
            this._duration = 0;
            this._lastAnimationState = null;
            this._animationNames.length = 0;
            this._animationStates.length = 0;
        }

        private _fadeOut(fadeOutTime: number, layer: number, group: string, fadeOutMode: AnimationFadeOutMode, pauseFadeOut: boolean): void {
            let i = 0, l = this._animationStates.length;
            let animationState = <AnimationState>null;
            switch (fadeOutMode) {
                case AnimationFadeOutMode.SameLayer:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer == layer) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.SameGroup:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.All:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (fadeOutTime == 0) {
                            animationState.returnToPool();
                        }
                        else {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }

                    if (fadeOutTime == 0) {
                        this._animationStates.length = 0;
                    }
                    break;

                case AnimationFadeOutMode.SameLayerAndGroup:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer == layer && animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
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
        public _updateFFDTimelineStates(): void {
            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i]._updateFFDTimelineStates();
            }
        }
        /**
         * @internal
         * @private
         */
        public _advanceTime(passedTime: number): void {
            const self = this;

            if (!self._isPlaying) {
                return;
            }

            if (passedTime < 0) {
                passedTime = -passedTime;
            }

            const animationStateCount = self._animationStates.length;
            if (animationStateCount == 1) {
                const animationState = self._animationStates[0];
                if (animationState._fadeState > 0 && animationState._fadeProgress <= 0) {
                    animationState.returnToPool();
                    self._animationStates.length = 0;
                    self._animationStateDirty = true;
                    self._lastAnimationState = null;
                }
                else {
                    animationState._advanceTime(passedTime, 1, 0);
                }
            }
            else if (animationStateCount > 1) {
                let prevLayer = self._animationStates[0]._layer;
                let weightLeft = 1;
                let layerTotalWeight = 0;
                let animationIndex = 1; // If has multiply animation state, first index is 1.

                for (let i = 0, r = 0; i < animationStateCount; ++i) {
                    const animationState = self._animationStates[i];
                    if (animationState._fadeState > 0 && animationState._fadeProgress <= 0) {
                        r++;
                        animationState.returnToPool();
                        self._animationStateDirty = true;

                        if (self._lastAnimationState == animationState) { // Update last animation state.
                            if (i - r >= 0) {
                                self._lastAnimationState = self._animationStates[i - r];
                            }
                            else {
                                self._lastAnimationState = null;
                            }
                        }
                    }
                    else {
                        if (r > 0) {
                            self._animationStates[i - r] = animationState;
                        }

                        if (prevLayer != animationState._layer) { // Update weight left.
                            prevLayer = animationState._layer;

                            if (layerTotalWeight >= weightLeft) {
                                weightLeft = 0;
                            }
                            else {
                                weightLeft -= layerTotalWeight;
                            }

                            layerTotalWeight = 0;
                        }

                        animationState._advanceTime(passedTime, weightLeft, animationIndex);

                        if (animationState._weightResult > 0) { // Update layer total weight.
                            layerTotalWeight += animationState._weightResult;
                            animationIndex++;
                        }
                    }

                    if (i == animationStateCount - 1 && r > 0) { // Modify animation states size.
                        self._animationStates.length -= r;
                    }
                }
            }
        }
        /**
         * @language zh_CN
         * 清除所有正在播放的动画状态。
         * @version DragonBones 4.5
         */
        public reset(): void {
            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }

            this._isPlaying = false;
            this._lastAnimationState = null;
            this._animationStates.length = 0;
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
         * 播放动画。
         * @param animationName 动画数据的名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。 
         * @param playTimes 动画需要播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public play(animationName: string = null, playTimes: number = -1): AnimationState {
            let animationState: AnimationState = null;
            if (animationName) {
                animationState = this.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
            }
            else if (!this._lastAnimationState) {
                const defaultAnimation = this._armature.armatureData.defaultAnimation;
                if (defaultAnimation) {
                    animationState = this.fadeIn(defaultAnimation.name, 0, playTimes, 0, null, AnimationFadeOutMode.All);
                }
            }
            else if (!this._isPlaying || (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted)) {
                this._isPlaying = true;
                this._lastAnimationState.play();
            }
            else {
                animationState = this.fadeIn(this._lastAnimationState.name, 0, playTimes, 0, null, AnimationFadeOutMode.All);
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 淡入播放指定名称的动画。
         * @param animationName 动画数据的名称。
         * @param playTimes 循环播放的次数。 [-1: 使用数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入的时间。 [-1: 使用数据默认值, [0~N]: N 秒淡入完毕] (以秒为单位)
         * @param layer 混合的图层，图层高会优先获取混合权重。
         * @param group 混合的组，用于给动画状态编组，方便混合淡出控制。
         * @param fadeOutMode 淡出的模式。
         * @param additiveBlending 以叠加的形式混合。
         * @param displayControl 是否对显示对象属性可控。
         * @param pauseFadeOut 暂停需要淡出的动画。
         * @param pauseFadeIn 暂停需要淡入的动画，直到淡入结束才开始播放。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public fadeIn(
            animationName: string, fadeInTime: number = -1, playTimes: number = -1,
            layer: number = 0, group: string = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup,
            additiveBlending: boolean = false, displayControl: boolean = true,
            pauseFadeOut: boolean = true, pauseFadeIn: boolean = true
        ): AnimationState {
            const animationData = this._animations[animationName];
            if (!animationData) {
                this._time = 0;
                this._duration = 0;

                console.warn(
                    "Non-existent animation.",
                    "DragonBones: " + this._armature.armatureData.parent.name,
                    "Armature: " + this._armature.name,
                    "Animation: " + animationName
                );

                return null;
            }

            this._isPlaying = true;

            if (this._time != this._time) {
                this._time = 0;
            }

            if (this._duration != this._duration) {
                this._duration = 0;
            }

            if (fadeInTime != fadeInTime || fadeInTime < 0) {
                if (this._lastAnimationState) {
                    fadeInTime = animationData.fadeInTime;
                }
                else {
                    fadeInTime = 0;
                }
            }

            if (playTimes < 0) {
                playTimes = animationData.playTimes;
            }

            this._fadeOut(fadeInTime, layer, group, fadeOutMode, pauseFadeOut);

            const time = this._duration > 0 ? 0 : this._time;
            const position = this._duration > 0 ? this._time : animationData.position;
            const duration = this._duration > 0 ? this._duration : animationData.duration;

            this._lastAnimationState = BaseObject.borrowObject(AnimationState);
            this._lastAnimationState._layer = layer;
            this._lastAnimationState._group = group;
            this._lastAnimationState.additiveBlending = additiveBlending;
            this._lastAnimationState.displayControl = displayControl;
            this._lastAnimationState._fadeIn(
                this._armature, animationData.animation || animationData, animationName,
                playTimes, position, duration, time, 1 / animationData.scale, fadeInTime,
                pauseFadeIn
            );
            this._animationStates.push(this._lastAnimationState);

            this._animationStateDirty = true;
            this._time = 0;
            this._duration = 0;
            this._armature._cacheFrameIndex = -1;

            if (this._animationStates.length > 1) {
                this._animationStates.sort(Animation._sortAnimationState);
            }

            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot.inheritAnimation) {
                    const childArmature = slot.childArmature;
                    if (
                        childArmature &&
                        childArmature.animation.hasAnimation(animationName) &&
                        !childArmature.animation.getState(animationName)
                    ) {
                        childArmature.animation.fadeIn(animationName);
                    }
                }
            }

            if (fadeInTime <= 0) {
                this._armature.advanceTime(0); // Blend animation state, update armature. (pass actions and events) 
            }

            return this._lastAnimationState;
        }
        /**
         * @language zh_CN
         * 指定名称的动画从指定时间开始播放。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @param playTimes 动画循环播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toTime 播放到指定的时间，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByTime(animationName: string, time: number = 0, playTimes: number = -1, toTime: number = 0): AnimationState {
            const animationData = this._animations[animationName];
            if (animationData) {
                this._time = time;
                this._duration = toTime - time;

                if (this._duration < 0) {
                    this._duration = 0;
                }
                else if (this._duration > animationData.duration - this._time) {
                    this._duration = animationData.duration - this._time;
                }
            }

            return this.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
        }
        /**
         * @language zh_CN
         * 指定名称的动画从指定帧开始播放。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toFrame 播放到指定的帧，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByFrame(animationName: string, frame: number = 0, playTimes: number = -1, toFrame: number = 0): AnimationState {
            const animationData = this._animations[animationName];
            if (animationData) {
                this._time = animationData.duration * frame / animationData.frameCount;

                if (this._duration < 0) {
                    this._duration = 0;
                }
                else if (this._duration > animationData.duration - this._time) {
                    this._duration = animationData.duration - this._time;
                }
            }

            return this.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
        }
        /**
         * @language zh_CN
         * 指定名称的动画从指定进度开始播放。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toProgress 播放到指定的进度，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByProgress(animationName: string, progress: number = 0, playTimes: number = -1, toProgress: number = 0): AnimationState {
            const animationData = this._animations[animationName];
            if (animationData) {
                this._time = animationData.duration * (progress > 0 ? progress : 0);

                if (this._duration < 0) {
                    this._duration = 0;
                }
                else if (this._duration > animationData.duration - this._time) {
                    this._duration = animationData.duration - this._time;
                }
            }

            return this.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
        }
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的时间并停止。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByTime(animationName: string, time: number = 0): AnimationState {
            const animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的帧并停止。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 返回控制这个动画数据的动画状态。
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
         * 播放指定名称的动画到指定的进度并停止。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByProgress(animationName: string, progress: number = 0): AnimationState {
            const animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState) {
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 获取指定名称的动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public getState(animationName: string): AnimationState {
            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                const animationState = this._animationStates[i];
                if (animationState.name == animationName) {
                    return animationState;
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 是否包含指定名称的动画数据。
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
         * 上一个正在播放的动画状态的名称。
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
         * 所有动画数据名称。
         * @see #animations
         * @version DragonBones 4.5
         */
        public get animationNames(): Array<string> {
            return this._animationNames;
        }
        /**
         * @language zh_CN
         * 所有的动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        public get animations(): Map<AnimationData> {
            return this._animations;
        }
        public set animations(value: Map<AnimationData>) {
            if (this._animations == value) {
                return;
            }

            for (let i in this._animations) {
                delete this._animations[i];
            }

            this._animationNames.length = 0;

            if (value) {
                for (let i in value) {
                    this._animations[i] = value[i];
                    this._animationNames.push(i);
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
            const animationState = this.fadeIn(animationName, fadeInTime, playTimes, layer, group, fadeOutMode, false, true, pauseFadeOut, pauseFadeIn);
            if (animationState && duration && duration > 0) {
                animationState.timeScale = animationState.totalTime / duration;
            }

            return animationState;
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
         * @language zh_CN
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
    }
}