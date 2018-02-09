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
     * @internal
     */
    export const enum TweenState {
        None,
        Once,
        Always
    }
    /**
     * @internal
     */
    export abstract class TimelineState extends BaseObject {
        public playState: number; // -1: start, 0: play, 1: complete;
        public currentPlayTimes: number;
        public currentTime: number;

        protected _tweenState: TweenState;
        protected _frameRate: number;
        protected _frameValueOffset: number;
        protected _frameCount: number;
        protected _frameOffset: number;
        protected _frameIndex: number;
        protected _frameRateR: number;
        protected _position: number;
        protected _duration: number;
        protected _timeScale: number;
        protected _timeOffset: number;
        protected _dragonBonesData: DragonBonesData;
        protected _animationData: AnimationData;
        protected _timelineData: TimelineData | null;
        protected _armature: Armature;
        protected _animationState: AnimationState;
        protected _actionTimeline: TimelineState;
        protected _frameArray: Array<number> | Int16Array;
        protected _frameIntArray: Array<number> | Int16Array;
        protected _frameFloatArray: Array<number> | Int16Array;
        protected _timelineArray: Array<number> | Uint16Array;
        protected _frameIndices: Array<number>;

        protected _onClear(): void {
            this.playState = -1;
            this.currentPlayTimes = -1;
            this.currentTime = -1.0;

            this._tweenState = TweenState.None;
            this._frameRate = 0;
            this._frameValueOffset = 0;
            this._frameCount = 0;
            this._frameOffset = 0;
            this._frameIndex = -1;
            this._frameRateR = 0.0;
            this._position = 0.0;
            this._duration = 0.0;
            this._timeScale = 1.0;
            this._timeOffset = 0.0;
            this._dragonBonesData = null as any; //
            this._animationData = null as any; //
            this._timelineData = null as any; //
            this._armature = null as any; //
            this._animationState = null as any; //
            this._actionTimeline = null as any; //
            this._frameArray = null as any; //
            this._frameIntArray = null as any; //
            this._frameFloatArray = null as any; //
            this._timelineArray = null as any; //
            this._frameIndices = null as any; //
        }

        protected abstract _onArriveAtFrame(): void;
        protected abstract _onUpdateFrame(): void;

        protected _setCurrentTime(passedTime: number): boolean {
            const prevState = this.playState;
            const prevPlayTimes = this.currentPlayTimes;
            const prevTime = this.currentTime;

            if (this._actionTimeline !== null && this._frameCount <= 1) { // No frame or only one frame.
                this.playState = this._actionTimeline.playState >= 0 ? 1 : -1;
                this.currentPlayTimes = 1;
                this.currentTime = this._actionTimeline.currentTime;
            }
            else if (this._actionTimeline === null || this._timeScale !== 1.0 || this._timeOffset !== 0.0) { // Action timeline or has scale and offset.
                const playTimes = this._animationState.playTimes;
                const totalTime = playTimes * this._duration;

                passedTime *= this._timeScale;
                if (this._timeOffset !== 0.0) {
                    passedTime += this._timeOffset * this._animationData.duration;
                }

                if (playTimes > 0 && (passedTime >= totalTime || passedTime <= -totalTime)) {
                    if (this.playState <= 0 && this._animationState._playheadState === 3) {
                        this.playState = 1;
                    }

                    this.currentPlayTimes = playTimes;
                    if (passedTime < 0.0) {
                        this.currentTime = 0.0;
                    }
                    else {
                        this.currentTime = this._duration + 0.000001; // Precision problem
                    }
                }
                else {
                    if (this.playState !== 0 && this._animationState._playheadState === 3) {
                        this.playState = 0;
                    }

                    if (passedTime < 0.0) {
                        passedTime = -passedTime;
                        this.currentPlayTimes = Math.floor(passedTime / this._duration);
                        this.currentTime = this._duration - (passedTime % this._duration);
                    }
                    else {
                        this.currentPlayTimes = Math.floor(passedTime / this._duration);
                        this.currentTime = passedTime % this._duration;
                    }
                }

                this.currentTime += this._position;
            }
            else { // Multi frames.
                this.playState = this._actionTimeline.playState;
                this.currentPlayTimes = this._actionTimeline.currentPlayTimes;
                this.currentTime = this._actionTimeline.currentTime;
            }

            if (this.currentPlayTimes === prevPlayTimes && this.currentTime === prevTime) {
                return false;
            }

            // Clear frame flag when timeline start or loopComplete.
            if (
                (prevState < 0 && this.playState !== prevState) ||
                (this.playState <= 0 && this.currentPlayTimes !== prevPlayTimes)
            ) {
                this._frameIndex = -1;
            }

            return true;
        }

        public init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void {
            this._armature = armature;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this._actionTimeline = this._animationState._actionTimeline;

            if (this === this._actionTimeline) {
                this._actionTimeline = null as any; //
            }

            this._animationData = this._animationState._animationData;

            this._frameRate = this._animationData.parent.frameRate;
            this._frameRateR = 1.0 / this._frameRate;
            this._position = this._animationState._position;
            this._duration = this._animationState._duration;
            this._dragonBonesData = this._animationData.parent.parent; // May by the animation data is not belone to this armature data.

            if (this._timelineData !== null) {
                this._frameIntArray = this._dragonBonesData.frameIntArray;
                this._frameFloatArray = this._dragonBonesData.frameFloatArray;
                this._frameArray = this._dragonBonesData.frameArray;
                this._timelineArray = this._dragonBonesData.timelineArray;
                this._frameIndices = this._dragonBonesData.frameIndices;

                this._frameCount = this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineKeyFrameCount];
                this._frameValueOffset = this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineFrameValueOffset];
                this._timeScale = 100.0 / this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineScale];
                this._timeOffset = this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineOffset] * 0.01;
            }
        }

        public fadeOut(): void { }

        public update(passedTime: number): void {
            if (this._setCurrentTime(passedTime)) {
                if (this._frameCount > 1) {
                    const timelineFrameIndex = Math.floor(this.currentTime * this._frameRate); // uint
                    const frameIndex = this._frameIndices[(this._timelineData as TimelineData).frameIndicesOffset + timelineFrameIndex];
                    if (this._frameIndex !== frameIndex) {
                        this._frameIndex = frameIndex;
                        this._frameOffset = this._animationData.frameOffset + this._timelineArray[(this._timelineData as TimelineData).offset + BinaryOffset.TimelineFrameOffset + this._frameIndex];

                        this._onArriveAtFrame();
                    }
                }
                else if (this._frameIndex < 0) {
                    this._frameIndex = 0;
                    if (this._timelineData !== null) { // May be pose timeline.
                        this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineFrameOffset];
                    }

                    this._onArriveAtFrame();
                }

                if (this._tweenState !== TweenState.None) {
                    this._onUpdateFrame();
                }
            }
        }
    }
    /**
     * @internal
     */
    export abstract class TweenTimelineState extends TimelineState {
        private static _getEasingValue(tweenType: TweenType, progress: number, easing: number): number {
            let value = progress;

            switch (tweenType) {
                case TweenType.QuadIn:
                    value = Math.pow(progress, 2.0);
                    break;

                case TweenType.QuadOut:
                    value = 1.0 - Math.pow(1.0 - progress, 2.0);
                    break;

                case TweenType.QuadInOut:
                    value = 0.5 * (1.0 - Math.cos(progress * Math.PI));
                    break;
            }

            return (value - progress) * easing + progress;
        }

        private static _getEasingCurveValue(progress: number, samples: Array<number> | Int16Array, count: number, offset: number): number {
            if (progress <= 0.0) {
                return 0.0;
            }
            else if (progress >= 1.0) {
                return 1.0;
            }

            const segmentCount = count + 1; // + 2 - 1
            const valueIndex = Math.floor(progress * segmentCount);
            const fromValue = valueIndex === 0 ? 0.0 : samples[offset + valueIndex - 1];
            const toValue = (valueIndex === segmentCount - 1) ? 10000.0 : samples[offset + valueIndex];

            return (fromValue + (toValue - fromValue) * (progress * segmentCount - valueIndex)) * 0.0001;
        }

        protected _tweenType: TweenType;
        protected _curveCount: number;
        protected _framePosition: number;
        protected _frameDurationR: number;
        protected _tweenProgress: number;
        protected _tweenEasing: number;

        protected _onClear(): void {
            super._onClear();

            this._tweenType = TweenType.None;
            this._curveCount = 0;
            this._framePosition = 0.0;
            this._frameDurationR = 0.0;
            this._tweenProgress = 0.0;
            this._tweenEasing = 0.0;
        }

        protected _onArriveAtFrame(): void {
            if (
                this._frameCount > 1 &&
                (
                    this._frameIndex !== this._frameCount - 1 ||
                    this._animationState.playTimes === 0 ||
                    this._animationState.currentPlayTimes < this._animationState.playTimes - 1
                )
            ) {
                this._tweenType = this._frameArray[this._frameOffset + BinaryOffset.FrameTweenType]; // TODO recode ture tween type.
                this._tweenState = this._tweenType === TweenType.None ? TweenState.Once : TweenState.Always;
                if (this._tweenType === TweenType.Curve) {
                    this._curveCount = this._frameArray[this._frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount];
                }
                else if (this._tweenType !== TweenType.None && this._tweenType !== TweenType.Line) {
                    this._tweenEasing = this._frameArray[this._frameOffset + BinaryOffset.FrameTweenEasingOrCurveSampleCount] * 0.01;
                }

                this._framePosition = this._frameArray[this._frameOffset] * this._frameRateR;
                if (this._frameIndex === this._frameCount - 1) {
                    this._frameDurationR = 1.0 / (this._animationData.duration - this._framePosition);
                }
                else {
                    const nextFrameOffset = this._animationData.frameOffset + this._timelineArray[(this._timelineData as TimelineData).offset + BinaryOffset.TimelineFrameOffset + this._frameIndex + 1];
                    const frameDuration = this._frameArray[nextFrameOffset] * this._frameRateR - this._framePosition;

                    if (frameDuration > 0) {
                        this._frameDurationR = 1.0 / frameDuration;
                    }
                    else {
                        this._frameDurationR = 0.0;
                    }
                }
            }
            else {
                this._tweenState = TweenState.Once;
            }
        }

        protected _onUpdateFrame(): void {
            if (this._tweenState === TweenState.Always) {
                this._tweenProgress = (this.currentTime - this._framePosition) * this._frameDurationR;
                if (this._tweenType === TweenType.Curve) {
                    this._tweenProgress = TweenTimelineState._getEasingCurveValue(this._tweenProgress, this._frameArray, this._curveCount, this._frameOffset + BinaryOffset.FrameCurveSamples);
                }
                else if (this._tweenType !== TweenType.Line) {
                    this._tweenProgress = TweenTimelineState._getEasingValue(this._tweenType, this._tweenProgress, this._tweenEasing);
                }
            }
            else {
                this._tweenProgress = 0.0;
            }
        }
    }
    /**
     * @internal
     */
    export abstract class BoneTimelineState extends TweenTimelineState {
        public bone: Bone;
        public bonePose: BonePose;

        protected _onClear(): void {
            super._onClear();

            this.bone = null as any; //
            this.bonePose = null as any; //
        }

        public blend(state: number): void {
            const blendWeight = this.bone._blendState.blendWeight;
            const animationPose = this.bone.animationPose;
            const result = this.bonePose.result;

            if (state === 2) {
                animationPose.x += result.x * blendWeight;
                animationPose.y += result.y * blendWeight;
                animationPose.rotation += result.rotation * blendWeight;
                animationPose.skew += result.skew * blendWeight;
                animationPose.scaleX += (result.scaleX - 1.0) * blendWeight;
                animationPose.scaleY += (result.scaleY - 1.0) * blendWeight;
            }
            else if (blendWeight !== 1.0) {
                animationPose.x = result.x * blendWeight;
                animationPose.y = result.y * blendWeight;
                animationPose.rotation = result.rotation * blendWeight;
                animationPose.skew = result.skew * blendWeight;
                animationPose.scaleX = (result.scaleX - 1.0) * blendWeight + 1.0;
                animationPose.scaleY = (result.scaleY - 1.0) * blendWeight + 1.0;
            }
            else {
                animationPose.x = result.x;
                animationPose.y = result.y;
                animationPose.rotation = result.rotation;
                animationPose.skew = result.skew;
                animationPose.scaleX = result.scaleX;
                animationPose.scaleY = result.scaleY;
            }

            if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                this.bone._transformDirty = true;
            }
        }
    }
    /**
     * @internal
     */
    export abstract class SlotTimelineState extends TweenTimelineState {
        public slot: Slot;

        protected _onClear(): void {
            super._onClear();

            this.slot = null as any; //
        }
    }
    /**
     * @internal
     */
    export abstract class ConstraintTimelineState extends TweenTimelineState {
        public constraint: Constraint;

        protected _onClear(): void {
            super._onClear();

            this.constraint = null as any; //
        }
    }
}