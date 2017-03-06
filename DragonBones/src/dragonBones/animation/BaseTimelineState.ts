namespace dragonBones {
    /**
     * @internal
     * @private
     */
    export const enum TweenType {
        None = 0,
        Once = 1,
        Always = 2
    }
    /**
     * @internal
     * @private
     */
    export abstract class TimelineState<T extends FrameData<T>, M extends TimelineData<T>> extends BaseObject {
        public _playState: number; // -1 start 0 play 1 complete
        public _currentPlayTimes: number;
        public _currentTime: number;
        public _timelineData: M;

        protected _frameRate: number;
        protected _frameCount: number;
        protected _position: number;
        protected _duration: number;
        protected _animationDutation: number;
        protected _timeScale: number;
        protected _timeOffset: number;
        protected _currentFrame: T;
        protected _armature: Armature;
        protected _animationState: AnimationState;
        protected _mainTimeline: AnimationTimelineState;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            this._playState = -1;
            this._currentPlayTimes = 0;
            this._currentTime = -1.0;
            this._timelineData = null;

            this._frameRate = 0;
            this._frameCount = 0;
            this._position = 0.0;
            this._duration = 0.0;
            this._animationDutation = 0.0;
            this._timeScale = 1.0;
            this._timeOffset = 0.0;
            this._currentFrame = null;
            this._armature = null;
            this._animationState = null;
            this._mainTimeline = null;
        }

        protected _onUpdateFrame(): void { }
        protected _onArriveAtFrame(): void { }

        protected _setCurrentTime(passedTime: number): boolean {
            const prevState = this._playState;
            let currentPlayTimes = 0;
            let currentTime = 0.0;

            if (this._mainTimeline && this._frameCount === 1) {
                this._playState = this._mainTimeline._playState >= 0 ? 1 : -1;
                currentPlayTimes = 1;
                currentTime = this._mainTimeline._currentTime;
            }
            else if (!this._mainTimeline || this._timeScale !== 1.0 || this._timeOffset !== 0.0) { // Scale and offset.
                const playTimes = this._animationState.playTimes;
                const totalTime = playTimes * this._duration;

                passedTime *= this._timeScale;
                if (this._timeOffset !== 0.0) {
                    passedTime += this._timeOffset * this._animationDutation;
                }

                if (playTimes > 0 && (passedTime >= totalTime || passedTime <= -totalTime)) {
                    if (this._playState <= 0 && this._animationState._playheadState === 3) {
                        this._playState = 1;
                    }

                    currentPlayTimes = playTimes;

                    if (passedTime < 0.0) {
                        currentTime = 0.0;
                    }
                    else {
                        currentTime = this._duration;
                    }
                }
                else {
                    if (this._playState !== 0 && this._animationState._playheadState === 3) {
                        this._playState = 0;
                    }

                    if (passedTime < 0.0) {
                        passedTime = -passedTime;
                        currentPlayTimes = Math.floor(passedTime / this._duration);
                        currentTime = this._duration - (passedTime % this._duration);
                    }
                    else {
                        currentPlayTimes = Math.floor(passedTime / this._duration);
                        currentTime = passedTime % this._duration;
                    }
                }

                currentTime += this._position;
            }
            else {
                this._playState = this._mainTimeline._playState;
                currentPlayTimes = this._mainTimeline._currentPlayTimes;
                currentTime = this._mainTimeline._currentTime;
            }

            if (this._currentPlayTimes === currentPlayTimes && this._currentTime === currentTime) {
                return false;
            }

            // Clear frame flag when timeline start or loopComplete.
            if (
                (prevState < 0 && this._playState !== prevState) ||
                (this._playState <= 0 && this._currentPlayTimes !== currentPlayTimes)
            ) {
                this._currentFrame = null;
            }

            this._currentPlayTimes = currentPlayTimes;
            this._currentTime = currentTime;

            return true;
        }

        public _init(armature: Armature, animationState: AnimationState, timelineData: M): void {
            this._armature = armature;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this._mainTimeline = this._animationState._timeline;

            if (this as any === this._mainTimeline) {
                this._mainTimeline = null;
            }

            this._frameRate = this._armature.armatureData.frameRate;
            this._frameCount = this._timelineData.frames.length;
            this._position = this._animationState._position;
            this._duration = this._animationState._duration;
            this._animationDutation = this._animationState.animationData.duration;
            this._timeScale = !this._mainTimeline ? 1.0 : (1.0 / this._timelineData.scale);
            this._timeOffset = !this._mainTimeline ? 0.0 : this._timelineData.offset;
        }

        public fadeOut(): void { }

        public update(passedTime: number): void {
            if (this._playState <= 0 && this._setCurrentTime(passedTime)) {
                const currentFrameIndex = this._frameCount > 1 ? Math.floor(this._currentTime * this._frameRate) : 0; // uint
                const currentFrame = this._timelineData.frames[currentFrameIndex];

                if (this._currentFrame !== currentFrame) {
                    this._currentFrame = currentFrame;
                    this._onArriveAtFrame();
                }

                this._onUpdateFrame();
            }
        }
    }
    /**
     * @internal
     * @private
     */
    export abstract class TweenTimelineState<T extends TweenFrameData<T>, M extends TimelineData<T>> extends TimelineState<T, M> {
        public static _getEasingValue(progress: number, easing: number): number {
            if (progress <= 0.0) {
                return 0.0;
            }
            else if (progress >= 1.0) {
                return 1.0;
            }

            let value = 1.0;
            if (easing > 2.0) {
                return progress;
            }
            else if (easing > 1.0) { // Ease in out.
                value = 0.5 * (1.0 - Math.cos(progress * Math.PI));
                easing -= 1.0;
            }
            else if (easing > 0.0) { // Ease out.
                value = 1.0 - Math.pow(1.0 - progress, 2.0);
            }
            else if (easing >= -1.0) { // Ease in.
                easing *= -1.0;
                value = Math.pow(progress, 2.0);
            }
            else if (easing >= -2.0) { // Ease out in.
                easing *= -1.0;
                value = Math.acos(1.0 - progress * 2.0) / Math.PI;
                easing -= 1.0;
            }
            else {
                return progress;
            }

            return (value - progress) * easing + progress;
        }

        public static _getEasingCurveValue(progress: number, samples: Array<number>): number {
            if (progress <= 0.0) {
                return 0.0;
            }
            else if (progress >= 1.0) {
                return 1.0;
            }

            const segmentCount = samples.length + 1; // + 2 - 1
            const valueIndex = Math.floor(progress * segmentCount);
            const fromValue = valueIndex === 0 ? 0.0 : samples[valueIndex - 1];
            const toValue = (valueIndex === segmentCount - 1) ? 1.0 : samples[valueIndex];

            return fromValue + (toValue - fromValue) * (progress * segmentCount - valueIndex);
        }

        protected _tweenProgress: number;
        protected _tweenEasing: number;
        protected _curve: Array<number>;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this._tweenProgress = 0.0;
            this._tweenEasing = DragonBones.NO_TWEEN;
            this._curve = null;
        }

        protected _onArriveAtFrame(): void {
            if (
                this._frameCount > 1 &&
                (
                    this._currentFrame.next !== this._timelineData.frames[0] ||
                    this._animationState.playTimes === 0 ||
                    this._animationState.currentPlayTimes < this._animationState.playTimes - 1
                )
            ) {
                this._tweenEasing = this._currentFrame.tweenEasing;
                this._curve = this._currentFrame.curve;
            }
            else {
                this._tweenEasing = DragonBones.NO_TWEEN;
                this._curve = null;
            }
        }

        protected _onUpdateFrame(): void {
            if (this._tweenEasing !== DragonBones.NO_TWEEN) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position) / this._currentFrame.duration;
                if (this._tweenEasing !== 0.0) {
                    this._tweenProgress = TweenTimelineState._getEasingValue(this._tweenProgress, this._tweenEasing);
                }
            }
            else if (this._curve) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position) / this._currentFrame.duration;
                this._tweenProgress = TweenTimelineState._getEasingCurveValue(this._tweenProgress, this._curve);
            }
            else {
                this._tweenProgress = 0.0;
            }
        }
    }
}