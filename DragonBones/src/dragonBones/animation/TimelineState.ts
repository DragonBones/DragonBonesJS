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
    export class ActionTimelineState extends TimelineState {
        public static toString(): string {
            return "[class dragonBones.ActionTimelineState]";
        }

        private _onCrossFrame(frameIndex: number): void {
            const eventDispatcher = this._armature.eventDispatcher;
            if (this._animationState.actionEnabled) {
                const frameOffset = this._animationData.frameOffset + this._timelineArray[(this._timelineData as TimelineData).offset + BinaryOffset.TimelineFrameOffset + frameIndex];
                const actionCount = this._frameArray[frameOffset + 1];
                const actions = this._animationData.parent.actions; // May be the animaton data not belong to this armature data.

                for (let i = 0; i < actionCount; ++i) {
                    const actionIndex = this._frameArray[frameOffset + 2 + i];
                    const action = actions[actionIndex];

                    if (action.type === ActionType.Play) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        // eventObject.time = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                        eventObject.time = this._frameArray[frameOffset] / this._frameRate;
                        eventObject.animationState = this._animationState;
                        EventObject.actionDataToInstance(action, eventObject, this._armature);
                        this._armature._bufferAction(eventObject, true);
                    }
                    else {
                        const eventType = action.type === ActionType.Frame ? EventObject.FRAME_EVENT : EventObject.SOUND_EVENT;
                        if (action.type === ActionType.Sound || eventDispatcher.hasDBEventListener(eventType)) {
                            const eventObject = BaseObject.borrowObject(EventObject);
                            // eventObject.time = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                            eventObject.time = this._frameArray[frameOffset] / this._frameRate;
                            eventObject.animationState = this._animationState;
                            EventObject.actionDataToInstance(action, eventObject, this._armature);
                            this._armature._dragonBones.bufferEvent(eventObject);
                        }
                    }
                }
            }
        }

        protected _onArriveAtFrame(): void { }
        protected _onUpdateFrame(): void { }

        public update(passedTime: number): void {
            const prevState = this.playState;
            let prevPlayTimes = this.currentPlayTimes;
            let prevTime = this.currentTime;

            if (this._setCurrentTime(passedTime)) {
                const eventDispatcher = this._armature.eventDispatcher;
                if (prevState < 0) {
                    if (this.playState !== prevState) {
                        if (this._animationState.displayControl && this._animationState.resetToPose) { // Reset zorder to pose.
                            this._armature._sortZOrder(null, 0);
                        }

                        prevPlayTimes = this.currentPlayTimes;

                        if (eventDispatcher.hasDBEventListener(EventObject.START)) {
                            const eventObject = BaseObject.borrowObject(EventObject);
                            eventObject.type = EventObject.START;
                            eventObject.armature = this._armature;
                            eventObject.animationState = this._animationState;
                            this._armature._dragonBones.bufferEvent(eventObject);
                        }
                    }
                    else {
                        return;
                    }
                }

                const isReverse = this._animationState.timeScale < 0.0;
                let loopCompleteEvent: EventObject | null = null;
                let completeEvent: EventObject | null = null;

                if (this.currentPlayTimes !== prevPlayTimes) {
                    if (eventDispatcher.hasDBEventListener(EventObject.LOOP_COMPLETE)) {
                        loopCompleteEvent = BaseObject.borrowObject(EventObject);
                        loopCompleteEvent.type = EventObject.LOOP_COMPLETE;
                        loopCompleteEvent.armature = this._armature;
                        loopCompleteEvent.animationState = this._animationState;
                    }

                    if (this.playState > 0) {
                        if (eventDispatcher.hasDBEventListener(EventObject.COMPLETE)) {
                            completeEvent = BaseObject.borrowObject(EventObject);
                            completeEvent.type = EventObject.COMPLETE;
                            completeEvent.armature = this._armature;
                            completeEvent.animationState = this._animationState;
                        }
                    }
                }

                if (this._frameCount > 1) {
                    const timelineData = this._timelineData as TimelineData;
                    const timelineFrameIndex = Math.floor(this.currentTime * this._frameRate); // uint
                    const frameIndex = this._frameIndices[timelineData.frameIndicesOffset + timelineFrameIndex];

                    if (this._frameIndex !== frameIndex) { // Arrive at frame.                   
                        let crossedFrameIndex = this._frameIndex;
                        this._frameIndex = frameIndex;

                        if (this._timelineArray !== null) {
                            this._frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + BinaryOffset.TimelineFrameOffset + this._frameIndex];

                            if (isReverse) {
                                if (crossedFrameIndex < 0) {
                                    const prevFrameIndex = Math.floor(prevTime * this._frameRate);
                                    crossedFrameIndex = this._frameIndices[timelineData.frameIndicesOffset + prevFrameIndex];

                                    if (this.currentPlayTimes === prevPlayTimes) { // Start.
                                        if (crossedFrameIndex === frameIndex) { // Uncrossed.
                                            crossedFrameIndex = -1;
                                        }
                                    }
                                }

                                while (crossedFrameIndex >= 0) {
                                    const frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + BinaryOffset.TimelineFrameOffset + crossedFrameIndex];
                                    // const framePosition = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                                    const framePosition = this._frameArray[frameOffset] / this._frameRate;

                                    if (
                                        this._position <= framePosition &&
                                        framePosition <= this._position + this._duration
                                    ) { // Support interval play.
                                        this._onCrossFrame(crossedFrameIndex);
                                    }

                                    if (loopCompleteEvent !== null && crossedFrameIndex === 0) { // Add loop complete event after first frame.
                                        this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                                        loopCompleteEvent = null;
                                    }

                                    if (crossedFrameIndex > 0) {
                                        crossedFrameIndex--;
                                    }
                                    else {
                                        crossedFrameIndex = this._frameCount - 1;
                                    }

                                    if (crossedFrameIndex === frameIndex) {
                                        break;
                                    }
                                }
                            }
                            else {
                                if (crossedFrameIndex < 0) {
                                    const prevFrameIndex = Math.floor(prevTime * this._frameRate);
                                    crossedFrameIndex = this._frameIndices[timelineData.frameIndicesOffset + prevFrameIndex];
                                    const frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + BinaryOffset.TimelineFrameOffset + crossedFrameIndex];
                                    // const framePosition = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                                    const framePosition = this._frameArray[frameOffset] / this._frameRate;

                                    if (this.currentPlayTimes === prevPlayTimes) { // Start.
                                        if (prevTime <= framePosition) { // Crossed.
                                            if (crossedFrameIndex > 0) {
                                                crossedFrameIndex--;
                                            }
                                            else {
                                                crossedFrameIndex = this._frameCount - 1;
                                            }
                                        }
                                        else if (crossedFrameIndex === frameIndex) { // Uncrossed.
                                            crossedFrameIndex = -1;
                                        }
                                    }
                                }

                                while (crossedFrameIndex >= 0) {
                                    if (crossedFrameIndex < this._frameCount - 1) {
                                        crossedFrameIndex++;
                                    }
                                    else {
                                        crossedFrameIndex = 0;
                                    }

                                    const frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + BinaryOffset.TimelineFrameOffset + crossedFrameIndex];
                                    // const framePosition = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                                    const framePosition = this._frameArray[frameOffset] / this._frameRate;

                                    if (
                                        this._position <= framePosition &&
                                        framePosition <= this._position + this._duration
                                    ) { // Support interval play.
                                        this._onCrossFrame(crossedFrameIndex);
                                    }

                                    if (loopCompleteEvent !== null && crossedFrameIndex === 0) { // Add loop complete event before first frame.
                                        this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                                        loopCompleteEvent = null;
                                    }

                                    if (crossedFrameIndex === frameIndex) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (this._frameIndex < 0) {
                    this._frameIndex = 0;
                    if (this._timelineData !== null) {
                        this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineFrameOffset];
                        // Arrive at frame.
                        const framePosition = this._frameArray[this._frameOffset] / this._frameRate;

                        if (this.currentPlayTimes === prevPlayTimes) { // Start.
                            if (prevTime <= framePosition) {
                                this._onCrossFrame(this._frameIndex);
                            }
                        }
                        else if (this._position <= framePosition) { // Loop complete.
                            if (!isReverse && loopCompleteEvent !== null) { // Add loop complete event before first frame.
                                this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                                loopCompleteEvent = null;
                            }

                            this._onCrossFrame(this._frameIndex);
                        }
                    }
                }

                if (loopCompleteEvent !== null) {
                    this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                }

                if (completeEvent !== null) {
                    this._armature._dragonBones.bufferEvent(completeEvent);
                }
            }
        }

        public setCurrentTime(value: number): void {
            this._setCurrentTime(value);
            this._frameIndex = -1;
        }
    }
    /**
     * @internal
     */
    export class ZOrderTimelineState extends TimelineState {
        public static toString(): string {
            return "[class dragonBones.ZOrderTimelineState]";
        }

        protected _onArriveAtFrame(): void {
            if (this.playState >= 0) {
                const count = this._frameArray[this._frameOffset + 1];
                if (count > 0) {
                    this._armature._sortZOrder(this._frameArray, this._frameOffset + 2);
                }
                else {
                    this._armature._sortZOrder(null, 0);
                }
            }
        }

        protected _onUpdateFrame(): void { }
    }
    /**
     * @internal
     */
    export class BoneAllTimelineState extends BoneTimelineState {
        public static toString(): string {
            return "[class dragonBones.BoneAllTimelineState]";
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            if (this._timelineData !== null) {
                let valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset + this._frameIndex * 6; // ...(timeline value offset)|xxxxxx|xxxxxx|(Value offset)xxxxx|(Next offset)xxxxx|xxxxxx|xxxxxx|...
                const scale = this._armature._armatureData.scale;
                const frameFloatArray = this._frameFloatArray;
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.x = frameFloatArray[valueOffset++] * scale;
                current.y = frameFloatArray[valueOffset++] * scale;
                current.rotation = frameFloatArray[valueOffset++];
                current.skew = frameFloatArray[valueOffset++];
                current.scaleX = frameFloatArray[valueOffset++];
                current.scaleY = frameFloatArray[valueOffset++];

                if (this._tweenState === TweenState.Always) {
                    if (this._frameIndex === this._frameCount - 1) {
                        valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset; // + 0 * 6
                    }

                    delta.x = frameFloatArray[valueOffset++] * scale - current.x;
                    delta.y = frameFloatArray[valueOffset++] * scale - current.y;
                    delta.rotation = frameFloatArray[valueOffset++] - current.rotation;
                    delta.skew = frameFloatArray[valueOffset++] - current.skew;
                    delta.scaleX = frameFloatArray[valueOffset++] - current.scaleX;
                    delta.scaleY = frameFloatArray[valueOffset++] - current.scaleY;
                }
                else {
                    delta.x = 0.0;
                    delta.y = 0.0;
                    delta.rotation = 0.0;
                    delta.skew = 0.0;
                    delta.scaleX = 0.0;
                    delta.scaleY = 0.0;
                }
            }
            else { // Pose.
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.x = 0.0;
                current.y = 0.0;
                current.rotation = 0.0;
                current.skew = 0.0;
                current.scaleX = 1.0;
                current.scaleY = 1.0;
                delta.x = 0.0;
                delta.y = 0.0;
                delta.rotation = 0.0;
                delta.skew = 0.0;
                delta.scaleX = 0.0;
                delta.scaleY = 0.0;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const bone = this.target as Bone;
            const current = this.bonePose.current;
            const delta = this.bonePose.delta;
            const result = this.bonePose.result;

            if (this._tweenState !== TweenState.Always) {
                this._tweenState = TweenState.None;
            }

            result.x = current.x + delta.x * this._tweenProgress;
            result.y = current.y + delta.y * this._tweenProgress;
            result.rotation = current.rotation + delta.rotation * this._tweenProgress;
            result.skew = current.skew + delta.skew * this._tweenProgress;
            result.scaleX = current.scaleX + delta.scaleX * this._tweenProgress;
            result.scaleY = current.scaleY + delta.scaleY * this._tweenProgress;
            bone._transformDirty = true;
        }

        public fadeOut(): void {
            const result = this.bonePose.result;
            result.rotation = Transform.normalizeRadian(result.rotation);
            result.skew = Transform.normalizeRadian(result.skew);
        }
    }
    /**
     * @internal
     */
    export class BoneTranslateTimelineState extends BoneTimelineState {
        public static toString(): string {
            return "[class dragonBones.BoneTranslateTimelineState]";
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            if (this._timelineData !== null) {
                let valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset + this._frameIndex * 2;
                const scale = this._armature._armatureData.scale;
                const frameFloatArray = this._frameFloatArray;
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.x = frameFloatArray[valueOffset++] * scale;
                current.y = frameFloatArray[valueOffset++] * scale;

                if (this._tweenState === TweenState.Always) {
                    if (this._frameIndex === this._frameCount - 1) {
                        valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset; // + 0 * 2
                    }

                    delta.x = frameFloatArray[valueOffset++] * scale - current.x;
                    delta.y = frameFloatArray[valueOffset++] * scale - current.y;
                }
                else {
                    delta.x = 0.0;
                    delta.y = 0.0;
                }
            }
            else { // Pose.
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.x = 0.0;
                current.y = 0.0;
                delta.x = 0.0;
                delta.y = 0.0;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const bone = this.target as Bone;
            const current = this.bonePose.current;
            const delta = this.bonePose.delta;
            const result = this.bonePose.result;

            if (this._tweenState !== TweenState.Always) {
                this._tweenState = TweenState.None;
            }

            result.x = (current.x + delta.x * this._tweenProgress);
            result.y = (current.y + delta.y * this._tweenProgress);
            bone._transformDirty = true;
        }
    }
    /**
     * @internal
     */
    export class BoneRotateTimelineState extends BoneTimelineState {
        public static toString(): string {
            return "[class dragonBones.BoneRotateTimelineState]";
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            if (this._timelineData !== null) {
                let valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset + this._frameIndex * 2;
                const frameFloatArray = this._frameFloatArray;
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.rotation = frameFloatArray[valueOffset++];
                current.skew = frameFloatArray[valueOffset++];

                if (this._tweenState === TweenState.Always) {
                    if (this._frameIndex === this._frameCount - 1) {
                        valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset; // + 0 * 2
                        delta.rotation = Transform.normalizeRadian(frameFloatArray[valueOffset++] - current.rotation);
                    }
                    else {
                        delta.rotation = frameFloatArray[valueOffset++] - current.rotation;
                    }

                    delta.skew = frameFloatArray[valueOffset++] - current.skew;
                }
                else {
                    delta.rotation = 0.0;
                    delta.skew = 0.0;
                }
            }
            else { // Pose.
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.rotation = 0.0;
                current.skew = 0.0;
                delta.rotation = 0.0;
                delta.skew = 0.0;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const bone = this.target as Bone;
            const current = this.bonePose.current;
            const delta = this.bonePose.delta;
            const result = this.bonePose.result;

            if (this._tweenState !== TweenState.Always) {
                this._tweenState = TweenState.None;
            }

            result.rotation = current.rotation + delta.rotation * this._tweenProgress;
            result.skew = current.skew + delta.skew * this._tweenProgress;
            bone._transformDirty = true;
        }

        public fadeOut(): void {
            const result = this.bonePose.result;
            result.rotation = Transform.normalizeRadian(result.rotation);
            result.skew = Transform.normalizeRadian(result.skew);
        }
    }
    /**
     * @internal
     */
    export class BoneScaleTimelineState extends BoneTimelineState {
        public static toString(): string {
            return "[class dragonBones.BoneScaleTimelineState]";
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            if (this._timelineData !== null) {
                let valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset + this._frameIndex * 2;
                const frameFloatArray = this._frameFloatArray;
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.scaleX = frameFloatArray[valueOffset++];
                current.scaleY = frameFloatArray[valueOffset++];

                if (this._tweenState === TweenState.Always) {
                    if (this._frameIndex === this._frameCount - 1) {
                        valueOffset = this._animationData.frameFloatOffset + this._frameValueOffset; // + 0 * 2
                    }

                    delta.scaleX = frameFloatArray[valueOffset++] - current.scaleX;
                    delta.scaleY = frameFloatArray[valueOffset++] - current.scaleY;
                }
                else {
                    delta.scaleX = 0.0;
                    delta.scaleY = 0.0;
                }
            }
            else { // Pose.
                const current = this.bonePose.current;
                const delta = this.bonePose.delta;
                current.scaleX = 1.0;
                current.scaleY = 1.0;
                delta.scaleX = 0.0;
                delta.scaleY = 0.0;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const bone = this.target as Bone;
            const current = this.bonePose.current;
            const delta = this.bonePose.delta;
            const result = this.bonePose.result;

            if (this._tweenState !== TweenState.Always) {
                this._tweenState = TweenState.None;
            }

            result.scaleX = current.scaleX + delta.scaleX * this._tweenProgress;
            result.scaleY = current.scaleY + delta.scaleY * this._tweenProgress;
            bone._transformDirty = true;
        }
    }/**
     * @internal
     */
    export class SurfaceTimelineState extends FloatValueTimelineState {
        public static toString(): string {
            return "[class dragonBones.SurfaceTimelineState]";
        }

        private _deformCount: number;
        private _deformOffset: number;
        private _sameValueOffset: number;

        protected _onClear(): void {
            super._onClear();

            this._deformCount = 0;
            this._deformOffset = 0;
            this._sameValueOffset = 0;
        }

        public init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void {
            super.init(armature, animationState, timelineData);

            const surface = this.target as Surface;

            if (this._timelineData !== null) {
                const frameIntOffset = this._animationData.frameIntOffset + this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineFrameValueCount];
                this.valueCount = this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueCount];
                this.valueScale = this._armature.armatureData.scale;
                this._deformCount = this._frameIntArray[frameIntOffset + BinaryOffset.DeformCount];
                this._deformOffset = this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueOffset];
                this._sameValueOffset = this._frameIntArray[frameIntOffset + BinaryOffset.DeformFloatOffset] + this._animationData.frameFloatOffset;
                this._cdr.length = this.valueCount * 2;
            }
            else {
                this._deformCount = surface._deformVertices.length;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const surface = this.target as Surface;
            surface._transformDirty = true;
        }

        public blend(state: number): void {
            const surface = this.target as Surface;
            const blendWeight = surface._blendState.blendWeight;
            const result = surface._deformVertices;

            if (this._timelineData !== null) {
                for (let i = 0; i < this._deformCount; ++i) {
                    let value = 0.0;

                    if (i < this._deformOffset) {
                        value = this._frameFloatArray[this._sameValueOffset + i];
                    }
                    else if (i < this._deformOffset + this.valueCount) {
                        value = this._cdr[this.valueCount + i - this._deformOffset];
                    }
                    else {
                        value = this._frameFloatArray[this._sameValueOffset + i - this.valueCount];
                    }

                    if (state === 2) {
                        result[i] += value * blendWeight;
                    }
                    else if (blendWeight !== 1.0) {
                        result[i] = value * blendWeight;
                    }
                    else {
                        result[i] = value;
                    }
                }
            }
            else if (state !== 2) {
                for (let i = 0; i < this._deformCount; ++i) {
                    result[i] = 0.0;
                }
            }

            if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                surface._transformDirty = true;
            }
        }
    }
    /**
     * @internal
     */
    export class SlotDislayTimelineState extends TimelineState {
        public static toString(): string {
            return "[class dragonBones.SlotDislayTimelineState]";
        }

        protected _onArriveAtFrame(): void {
            if (this.playState >= 0) {
                const slot = this.target as Slot;
                const displayIndex = this._timelineData !== null ? this._frameArray[this._frameOffset + 1] : slot._slotData.displayIndex;
                if (slot.displayIndex !== displayIndex) {
                    slot._setDisplayIndex(displayIndex, true);
                }
            }
        }

        protected _onUpdateFrame(): void {
        }
    }
    /**
     * @internal
     */
    export class SlotColorTimelineState extends TweenTimelineState {
        public static toString(): string {
            return "[class dragonBones.SlotColorTimelineState]";
        }

        private _dirty: boolean;
        private readonly _current: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0];
        private readonly _delta: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0];
        private readonly _result: Array<number> = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

        protected _onClear(): void {
            super._onClear();

            this._dirty = false;
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            if (this._timelineData !== null) {
                const intArray = this._dragonBonesData.intArray;
                const frameIntArray = this._frameIntArray;
                const valueOffset = this._animationData.frameIntOffset + this._frameValueOffset + this._frameIndex * 1; // ...(timeline value offset)|x|x|(Value offset)|(Next offset)|x|x|...
                let colorOffset = frameIntArray[valueOffset];

                if (colorOffset < 0) {
                    colorOffset += 65536; // Fixed out of bounds bug. 
                }

                this._current[0] = intArray[colorOffset++];
                this._current[1] = intArray[colorOffset++];
                this._current[2] = intArray[colorOffset++];
                this._current[3] = intArray[colorOffset++];
                this._current[4] = intArray[colorOffset++];
                this._current[5] = intArray[colorOffset++];
                this._current[6] = intArray[colorOffset++];
                this._current[7] = intArray[colorOffset++];

                if (this._tweenState === TweenState.Always) {
                    if (this._frameIndex === this._frameCount - 1) {
                        colorOffset = frameIntArray[this._animationData.frameIntOffset + this._frameValueOffset];
                    }
                    else {
                        colorOffset = frameIntArray[valueOffset + 1 * 1];
                    }

                    if (colorOffset < 0) {
                        colorOffset += 65536; // Fixed out of bounds bug. 
                    }

                    this._delta[0] = intArray[colorOffset++] - this._current[0];
                    this._delta[1] = intArray[colorOffset++] - this._current[1];
                    this._delta[2] = intArray[colorOffset++] - this._current[2];
                    this._delta[3] = intArray[colorOffset++] - this._current[3];
                    this._delta[4] = intArray[colorOffset++] - this._current[4];
                    this._delta[5] = intArray[colorOffset++] - this._current[5];
                    this._delta[6] = intArray[colorOffset++] - this._current[6];
                    this._delta[7] = intArray[colorOffset++] - this._current[7];
                }
            }
            else { // Pose.
                const slot = this.target as Slot;
                const color = slot._slotData.color;
                this._current[0] = color.alphaMultiplier * 100.0;
                this._current[1] = color.redMultiplier * 100.0;
                this._current[2] = color.greenMultiplier * 100.0;
                this._current[3] = color.blueMultiplier * 100.0;
                this._current[4] = color.alphaOffset;
                this._current[5] = color.redOffset;
                this._current[6] = color.greenOffset;
                this._current[7] = color.blueOffset;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            this._dirty = true;

            if (this._tweenState !== TweenState.Always) {
                this._tweenState = TweenState.None;
            }

            this._result[0] = (this._current[0] + this._delta[0] * this._tweenProgress) * 0.01;
            this._result[1] = (this._current[1] + this._delta[1] * this._tweenProgress) * 0.01;
            this._result[2] = (this._current[2] + this._delta[2] * this._tweenProgress) * 0.01;
            this._result[3] = (this._current[3] + this._delta[3] * this._tweenProgress) * 0.01;
            this._result[4] = this._current[4] + this._delta[4] * this._tweenProgress;
            this._result[5] = this._current[5] + this._delta[5] * this._tweenProgress;
            this._result[6] = this._current[6] + this._delta[6] * this._tweenProgress;
            this._result[7] = this._current[7] + this._delta[7] * this._tweenProgress;
        }

        public fadeOut(): void {
            this._tweenState = TweenState.None;
            this._dirty = false;
        }

        public update(passedTime: number): void {
            super.update(passedTime);
            // Fade animation.
            if (this._tweenState !== TweenState.None || this._dirty) {
                const slot = this.target as Slot;
                const result = slot._colorTransform;

                if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    if (
                        result.alphaMultiplier !== this._result[0] ||
                        result.redMultiplier !== this._result[1] ||
                        result.greenMultiplier !== this._result[2] ||
                        result.blueMultiplier !== this._result[3] ||
                        result.alphaOffset !== this._result[4] ||
                        result.redOffset !== this._result[5] ||
                        result.greenOffset !== this._result[6] ||
                        result.blueOffset !== this._result[7]
                    ) {
                        const fadeProgress = Math.pow(this._animationState._fadeProgress, 4);
                        result.alphaMultiplier += (this._result[0] - result.alphaMultiplier) * fadeProgress;
                        result.redMultiplier += (this._result[1] - result.redMultiplier) * fadeProgress;
                        result.greenMultiplier += (this._result[2] - result.greenMultiplier) * fadeProgress;
                        result.blueMultiplier += (this._result[3] - result.blueMultiplier) * fadeProgress;
                        result.alphaOffset += (this._result[4] - result.alphaOffset) * fadeProgress;
                        result.redOffset += (this._result[5] - result.redOffset) * fadeProgress;
                        result.greenOffset += (this._result[6] - result.greenOffset) * fadeProgress;
                        result.blueOffset += (this._result[7] - result.blueOffset) * fadeProgress;
                        slot._colorDirty = true;
                    }
                }
                else if (this._dirty) {
                    if (
                        result.alphaMultiplier !== this._result[0] ||
                        result.redMultiplier !== this._result[1] ||
                        result.greenMultiplier !== this._result[2] ||
                        result.blueMultiplier !== this._result[3] ||
                        result.alphaOffset !== this._result[4] ||
                        result.redOffset !== this._result[5] ||
                        result.greenOffset !== this._result[6] ||
                        result.blueOffset !== this._result[7]
                    ) {
                        result.alphaMultiplier = this._result[0];
                        result.redMultiplier = this._result[1];
                        result.greenMultiplier = this._result[2];
                        result.blueMultiplier = this._result[3];
                        result.alphaOffset = this._result[4];
                        result.redOffset = this._result[5];
                        result.greenOffset = this._result[6];
                        result.blueOffset = this._result[7];
                        slot._colorDirty = true;
                    }

                    this._dirty = false;
                }
            }
        }
    }
    /**
     * @internal
     */
    export class DeformTimelineState extends FloatValueTimelineState {
        public static toString(): string {
            return "[class dragonBones.DeformTimelineState]";
        }

        public geometryOffset: number;
        public displayFrame: DisplayFrame;

        private _deformCount: number;
        private _deformOffset: number;
        private _sameValueOffset: number;

        protected _onClear(): void {
            super._onClear();

            this.geometryOffset = 0;
            this.displayFrame = null as any;

            this._deformCount = 0;
            this._deformOffset = 0;
            this._sameValueOffset = 0;
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const slot = this.target as Slot;
            if (slot._geometryData === this.displayFrame.getGeometryData()) {
                slot._verticesDirty = true;
            }
        }

        public init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void {
            super.init(armature, animationState, timelineData);

            if (this._timelineData !== null) {
                const slot = this.target as Slot;
                const frameIntOffset = this._animationData.frameIntOffset + this._timelineArray[this._timelineData.offset + BinaryOffset.TimelineFrameValueCount];
                this.geometryOffset = this._frameIntArray[frameIntOffset + BinaryOffset.DeformVertexOffset];

                if (this.geometryOffset < 0) {
                    this.geometryOffset += 65536; // Fixed out of bounds bug. 
                }

                for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                    const displayFrame = slot.getDisplayFrameAt(i);
                    const geometryData = displayFrame.getGeometryData();
                    if (geometryData === null) {
                        continue;
                    }

                    if (geometryData.offset === this.geometryOffset) {
                        this.displayFrame = displayFrame;
                        this.displayFrame.updateDeformVertices();
                        break;
                    }
                }

                if (this.displayFrame === null) {
                    this.returnToPool(); //
                    return;
                }

                this.valueCount = this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueCount];
                this.valueScale = this._armature.armatureData.scale;
                this._deformCount = this._frameIntArray[frameIntOffset + BinaryOffset.DeformCount];
                this._deformOffset = this._frameIntArray[frameIntOffset + BinaryOffset.DeformValueOffset];
                this._sameValueOffset = this._frameIntArray[frameIntOffset + BinaryOffset.DeformFloatOffset] + this._animationData.frameFloatOffset;
                this._cdr.length = this.valueCount * 2;
            }
            else {
                this._deformCount = this.displayFrame.deformVertices.length;
            }
        }

        public blend(state: number): void {
            const slot = this.target as Slot;
            const blendWeight = slot._blendState.blendWeight;
            const result = this.displayFrame.deformVertices;

            if (this._timelineData !== null) {
                for (let i = 0; i < this._deformCount; ++i) {
                    let value = 0.0;

                    if (i < this._deformOffset) {
                        value = this._frameFloatArray[this._sameValueOffset + i];
                    }
                    else if (i < this._deformOffset + this.valueCount) {
                        value = this._cdr[this.valueCount + i - this._deformOffset];
                    }
                    else {
                        value = this._frameFloatArray[this._sameValueOffset + i - this.valueCount];
                    }

                    if (state === 2) {
                        result[i] += value * blendWeight;
                    }
                    else if (blendWeight !== 1.0) {
                        result[i] = value * blendWeight;
                    }
                    else {
                        result[i] = value;
                    }
                }
            }
            else if (state !== 2) {
                for (let i = 0; i < this._deformCount; ++i) {
                    result[i] = 0.0;
                }
            }

            if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                slot._verticesDirty = true;
            }
        }
    }
    /**
     * @internal
     */
    export class IKConstraintTimelineState extends TweenTimelineState {
        public static toString(): string {
            return "[class dragonBones.IKConstraintTimelineState]";
        }

        private _current: number;
        private _delta: number;

        protected _onClear(): void {
            super._onClear();

            this._current = 0.0;
            this._delta = 0.0;
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            const ikConstraint = this.target as IKConstraint;

            if (this._timelineData !== null) {
                let valueOffset = this._animationData.frameIntOffset + this._frameValueOffset + this._frameIndex * 2;
                const frameIntArray = this._frameIntArray;
                const bendPositive = frameIntArray[valueOffset++] !== 0;
                this._current = frameIntArray[valueOffset++] * 0.01;

                if (this._tweenState === TweenState.Always) {
                    if (this._frameIndex === this._frameCount - 1) {
                        valueOffset = this._animationData.frameIntOffset + this._frameValueOffset; // + 0 * 2
                    }

                    this._delta = frameIntArray[valueOffset + 1] * 0.01 - this._current;
                }
                else {
                    this._delta = 0.0;
                }

                ikConstraint._bendPositive = bendPositive;
            }
            else {
                const ikConstraintData = ikConstraint._constraintData as IKConstraintData;
                this._current = ikConstraintData.weight;
                this._delta = 0.0;
                ikConstraint._bendPositive = ikConstraintData.bendPositive;
            }

            ikConstraint.invalidUpdate();
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            if (this._tweenState !== TweenState.Always) {
                this._tweenState = TweenState.None;
            }

            const ikConstraint = this.target as IKConstraint;
            ikConstraint._weight = this._current + this._delta * this._tweenProgress;
            ikConstraint.invalidUpdate();

            // TODO fade update.
        }
    }
    /**
     * @internal
     */
    export class AnimationProgressTimelineState extends IntValueTimelineState {
        public static toString(): string {
            return "[class dragonBones.AnimationProgressTimelineState]";
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const animationState = this.target as AnimationState;
            animationState.currentTime = this._cdr[this.valueCount] * animationState.totalTime;
        }

        public init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void {
            super.init(armature, animationState, timelineData);

            this.valueCount = 1;
            this.valueScale = 0.01;
            this._cdr.length = this.valueCount * 2;
        }
    }
    /**
     * @internal
     */
    export class AnimationWeightTimelineState extends IntValueTimelineState {
        public static toString(): string {
            return "[class dragonBones.AnimationWeightTimelineState]";
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const animationState = this.target as AnimationState;
            animationState.weight = this._cdr[this.valueCount];
        }

        public init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void {
            super.init(armature, animationState, timelineData);

            this.valueCount = 1;
            this.valueScale = 0.01;
            this._cdr.length = this.valueCount * 2;
        }
    }
    /**
     * @internal
     */
    export class AnimationParametersTimelineState extends IntValueTimelineState {
        public static toString(): string {
            return "[class dragonBones.AnimationParametersTimelineState]";
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            const animationState = this.target as AnimationState;
            animationState.parameterX = this._cdr[this.valueCount];
            animationState.parameterY = this._cdr[this.valueCount + 1];
        }

        public init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void {
            super.init(armature, animationState, timelineData);

            this.valueCount = 2;
            this.valueScale = 0.01;
            this._cdr.length = this.valueCount * 2;
        }
    }
}