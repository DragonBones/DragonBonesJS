namespace dragonBones {
    /**
     * @internal
     * @private
     */
    export class AnimationTimelineState extends TimelineState<AnimationFrameData, AnimationData> {
        public static toString(): string {
            return "[class dragonBones.AnimationTimelineState]";
        }

        private _isStarted: boolean;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this._isStarted = false;
        }

        protected _onCrossFrame(frame: AnimationFrameData): void {
            const self = this;

            if (self._animationState._fadeState < 0) { //
                return;
            }

            if (self._animationState.actionEnabled) {
                const actions = frame.actions;
                for (let i = 0, l = actions.length; i < l; ++i) {
                    self._armature._bufferAction(actions[i]);
                }
            }

            const eventDispatcher = self._armature._display;
            const events = frame.events;
            for (let i = 0, l = events.length; i < l; ++i) {
                const eventData = events[i];

                let eventType = "";
                switch (eventData.type) {
                    case EventType.Frame:
                        eventType = EventObject.FRAME_EVENT;
                        break;

                    case EventType.Sound:
                        eventType = EventObject.SOUND_EVENT;
                        break;
                }

                if (
                    (eventData.type == EventType.Sound ?
                        self._armature._eventManager : eventDispatcher
                    ).hasEvent(eventType)
                ) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.name = eventData.name;
                    eventObject.animationState = self._animationState;
                    eventObject.frame = frame;
                    eventObject.data = eventData;

                    if (eventData.bone) {
                        eventObject.bone = self._armature.getBone(eventData.bone.name);
                    }

                    if (eventData.slot) {
                        eventObject.slot = self._armature.getSlot(eventData.slot.name);
                    }

                    self._armature._bufferEvent(eventObject, eventType);
                }
            }
        }

        public fadeIn(armature: Armature, animationState: AnimationState, timelineData: AnimationData, time: number): void {
            super.fadeIn(armature, animationState, timelineData, time);

            this._currentTime = time; // Pass first update. (armature.advanceTime(0))
        }

        public update(time: number): void {
            const self = this;

            const prevTime = self._currentTime;
            const prevPlayTimes = self._currentPlayTimes;

            if (!self._isCompleted && self._setCurrentTime(time)) {
                const eventDispatcher = self._armature._display;

                if (!self._isStarted) {
                    self._isStarted = true;

                    if (eventDispatcher.hasEvent(EventObject.START)) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        eventObject.animationState = self._animationState;
                        self._armature._bufferEvent(eventObject, EventObject.START);
                    }
                }

                if (self._keyFrameCount > 0) {
                    const currentFrameIndex = self._keyFrameCount > 1 ? Math.floor(self._currentTime * self._frameRate) : 0;
                    const currentFrame = self._timeline.frames[currentFrameIndex];
                    if (self._currentFrame != currentFrame) {
                        if (self._keyFrameCount > 1) {
                            let crossedFrame = self._currentFrame;
                            self._currentFrame = currentFrame;

                            if (!crossedFrame) {
                                const prevFrameIndex = Math.floor(prevTime * self._frameRate);
                                crossedFrame = self._timeline.frames[prevFrameIndex];

                                if (self._isReverse) {
                                }
                                else {
                                    if (
                                        prevTime <= crossedFrame.position ||
                                        prevPlayTimes != self._currentPlayTimes
                                    ) {
                                        crossedFrame = crossedFrame.prev;
                                    }
                                }
                            }

                            // TODO 1 2 3 key frame loop, first key frame after loop complete.
                            if (self._isReverse) {
                                while (crossedFrame != currentFrame) {
                                    self._onCrossFrame(crossedFrame);
                                    crossedFrame = crossedFrame.prev;
                                }
                            }
                            else {
                                while (crossedFrame != currentFrame) {
                                    crossedFrame = crossedFrame.next;
                                    self._onCrossFrame(crossedFrame);
                                }
                            }
                        }
                        else {
                            self._currentFrame = currentFrame;
                            self._onCrossFrame(self._currentFrame);
                        }
                    }
                }

                if (prevPlayTimes != self._currentPlayTimes) {
                    if (eventDispatcher.hasEvent(EventObject.LOOP_COMPLETE)) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        eventObject.animationState = self._animationState;
                        self._armature._bufferEvent(eventObject, EventObject.LOOP_COMPLETE);
                    }

                    if (self._isCompleted && eventDispatcher.hasEvent(EventObject.COMPLETE)) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        eventObject.animationState = self._animationState;
                        self._armature._bufferEvent(eventObject, EventObject.COMPLETE);
                    }

                    self._currentFrame = null;
                }
            }
        }

        public setCurrentTime(value: number): void {
            this._setCurrentTime(value);
            this._currentFrame = null;
        }
    }
    /**
     * @internal
     * @private
     */
    export class ZOrderTimelineState extends TimelineState<ZOrderFrameData, ZOrderTimelineData> {
        public static toString(): string {
            return "[class dragonBones.ZOrderTimelineState]";
        }

        public constructor() {
            super();
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;

            super._onArriveAtFrame(isUpdate);

            self._armature._sortZOrder(self._currentFrame.zOrder);
        }
    }
    /**
     * @internal
     * @private
     */
    export class BoneTimelineState extends TweenTimelineState<BoneFrameData, BoneTimelineData> {
        public static toString(): string {
            return "[class dragonBones.BoneTimelineState]";
        }

        public bone: Bone;

        private _tweenTransform: number;
        private _tweenRotate: number;
        private _tweenScale: number;
        private _boneTransform: Transform;
        private _originalTransform: Transform;
        private _transform: Transform = new Transform();
        private _currentTransform: Transform = new Transform();
        private _durationTransform: Transform = new Transform();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.bone = null;

            this._tweenTransform = TweenType.None;
            this._tweenRotate = TweenType.None;
            this._tweenScale = TweenType.None;
            this._boneTransform = null;
            this._originalTransform = null;
            this._transform.identity();
            this._currentTransform.identity();
            this._durationTransform.identity();
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;

            super._onArriveAtFrame(isUpdate);

            self._currentTransform.copyFrom(self._currentFrame.transform);

            self._tweenTransform = TweenType.Once;
            self._tweenRotate = TweenType.Once;
            self._tweenScale = TweenType.Once;

            if (self._keyFrameCount > 1 && (self._tweenEasing != DragonBones.NO_TWEEN || self._curve)) {
                const nextFrame = self._currentFrame.next;
                const nextTransform = nextFrame.transform;

                // Transform.
                self._durationTransform.x = nextTransform.x - self._currentTransform.x;
                self._durationTransform.y = nextTransform.y - self._currentTransform.y;
                if (self._durationTransform.x != 0 || self._durationTransform.y != 0) {
                    self._tweenTransform = TweenType.Always;
                }

                // Rotate.
                const tweenRotate = self._currentFrame.tweenRotate;
                if (tweenRotate == tweenRotate) {
                    if (tweenRotate) {
                        if (tweenRotate > 0 ? nextTransform.skewY >= self._currentTransform.skewY : nextTransform.skewY <= self._currentTransform.skewY) {
                            const rotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + DragonBones.PI_D * rotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + DragonBones.PI_D * rotate;
                        }
                        else {
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + DragonBones.PI_D * tweenRotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + DragonBones.PI_D * tweenRotate;
                        }
                    }
                    else {
                        self._durationTransform.skewX = Transform.normalizeRadian(nextTransform.skewX - self._currentTransform.skewX);
                        self._durationTransform.skewY = Transform.normalizeRadian(nextTransform.skewY - self._currentTransform.skewY);
                    }

                    if (self._durationTransform.skewX != 0 || self._durationTransform.skewY != 0) {
                        self._tweenRotate = TweenType.Always;
                    }
                }
                else {
                    self._durationTransform.skewX = 0;
                    self._durationTransform.skewY = 0;
                }

                // Scale.
                if (self._currentFrame.tweenScale) {
                    self._durationTransform.scaleX = nextTransform.scaleX - self._currentTransform.scaleX;
                    self._durationTransform.scaleY = nextTransform.scaleY - self._currentTransform.scaleY;
                    if (self._durationTransform.scaleX != 0 || self._durationTransform.scaleY != 0) {
                        self._tweenScale = TweenType.Always;
                    }
                }
                else {
                    self._durationTransform.scaleX = 0;
                    self._durationTransform.scaleY = 0;
                }
            }
            else {
                self._durationTransform.x = 0;
                self._durationTransform.y = 0;
                self._durationTransform.skewX = 0;
                self._durationTransform.skewY = 0;
                self._durationTransform.scaleX = 0;
                self._durationTransform.scaleY = 0;
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            const self = this;

            if (self._tweenTransform || self._tweenRotate || self._tweenScale) {
                super._onUpdateFrame(isUpdate);

                let tweenProgress = 0;

                if (self._tweenTransform) {
                    if (self._tweenTransform == TweenType.Once) {
                        self._tweenTransform = TweenType.None;
                        tweenProgress = 0;
                    }
                    else {
                        tweenProgress = self._tweenProgress;
                    }

                    if (self._animationState.additiveBlending) { // Additive blending.
                        self._transform.x = self._currentTransform.x + self._durationTransform.x * tweenProgress;
                        self._transform.y = self._currentTransform.y + self._durationTransform.y * tweenProgress;
                    }
                    else { // Normal blending.
                        self._transform.x = self._originalTransform.x + self._currentTransform.x + self._durationTransform.x * tweenProgress;
                        self._transform.y = self._originalTransform.y + self._currentTransform.y + self._durationTransform.y * tweenProgress;
                    }
                }

                if (self._tweenRotate) {
                    if (self._tweenRotate == TweenType.Once) {
                        self._tweenRotate = TweenType.None;
                        tweenProgress = 0;
                    }
                    else {
                        tweenProgress = self._tweenProgress;
                    }

                    if (self._animationState.additiveBlending) { // Additive blending.
                        self._transform.skewX = self._currentTransform.skewX + self._durationTransform.skewX * tweenProgress;
                        self._transform.skewY = self._currentTransform.skewY + self._durationTransform.skewY * tweenProgress;
                    }
                    else { // Normal blending.
                        self._transform.skewX = self._originalTransform.skewX + self._currentTransform.skewX + self._durationTransform.skewX * tweenProgress;
                        self._transform.skewY = self._originalTransform.skewY + self._currentTransform.skewY + self._durationTransform.skewY * tweenProgress;
                    }
                }

                if (self._tweenScale) {
                    if (self._tweenScale == TweenType.Once) {
                        self._tweenScale = TweenType.None;
                        tweenProgress = 0;
                    }
                    else {
                        tweenProgress = self._tweenProgress;
                    }

                    if (self._animationState.additiveBlending) { // Additive blending.
                        self._transform.scaleX = self._currentTransform.scaleX + self._durationTransform.scaleX * tweenProgress;
                        self._transform.scaleY = self._currentTransform.scaleY + self._durationTransform.scaleY * tweenProgress;
                    }
                    else { // Normal blending.
                        self._transform.scaleX = self._originalTransform.scaleX * (self._currentTransform.scaleX + self._durationTransform.scaleX * tweenProgress);
                        self._transform.scaleY = self._originalTransform.scaleY * (self._currentTransform.scaleY + self._durationTransform.scaleY * tweenProgress);
                    }
                }

                self.bone.invalidUpdate();
            }
        }

        public fadeIn(armature: Armature, animationState: AnimationState, timelineData: BoneTimelineData, time: number): void {
            super.fadeIn(armature, animationState, timelineData, time);

            this._originalTransform = this._timeline.originalTransform;
            this._boneTransform = this.bone._animationPose;
        }

        public fadeOut(): void {
            this._transform.skewX = Transform.normalizeRadian(this._transform.skewX);
            this._transform.skewY = Transform.normalizeRadian(this._transform.skewY);
        }

        public update(time: number): void {
            const self = this;

            super.update(time);

            // Blend animation state.
            const weight = self._animationState._weightResult;

            if (weight > 0) {
                if (self.bone._blendIndex == 0) {
                    self._boneTransform.x = self._transform.x * weight;
                    self._boneTransform.y = self._transform.y * weight;
                    self._boneTransform.skewX = self._transform.skewX * weight;
                    self._boneTransform.skewY = self._transform.skewY * weight;
                    self._boneTransform.scaleX = (self._transform.scaleX - 1) * weight + 1;
                    self._boneTransform.scaleY = (self._transform.scaleY - 1) * weight + 1;
                }
                else {
                    self._boneTransform.x += self._transform.x * weight;
                    self._boneTransform.y += self._transform.y * weight;
                    self._boneTransform.skewX += self._transform.skewX * weight;
                    self._boneTransform.skewY += self._transform.skewY * weight;
                    self._boneTransform.scaleX += (self._transform.scaleX - 1) * weight;
                    self._boneTransform.scaleY += (self._transform.scaleY - 1) * weight;
                }

                self.bone._blendIndex++;

                if (self._animationState._fadeState != 0) {
                    self.bone.invalidUpdate();
                }
            }
        }
    }
    /**
     * @internal
     * @private
     */
    export class SlotTimelineState extends TweenTimelineState<SlotFrameData, SlotTimelineData> {
        public static toString(): string {
            return "[class dragonBones.SlotTimelineState]";
        }

        public slot: Slot;

        private _colorDirty: boolean;
        private _tweenColor: number;
        private _slotColor: ColorTransform;
        private _color: ColorTransform = new ColorTransform();
        private _durationColor: ColorTransform = new ColorTransform();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.slot = null;

            this._colorDirty = false;
            this._tweenColor = TweenType.None;
            this._slotColor = null;
            this._color.identity();
            this._durationColor.identity();
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;

            super._onArriveAtFrame(isUpdate);

            if (self._animationState._isDisabled(self.slot)) {
                self._tweenEasing = DragonBones.NO_TWEEN;
                self._curve = null;
                self._tweenColor = TweenType.None;
                return;
            }

            if (self._animationState._fadeState >= 0) { //
                self.slot._setDisplayIndex(self._currentFrame.displayIndex);
                self.slot._updateMeshData(true);
            }

            self._tweenColor = TweenType.None;

            const currentColor = self._currentFrame.color;

            if (self._keyFrameCount > 1 && (self._tweenEasing != DragonBones.NO_TWEEN || self._curve)) {
                const nextFrame = self._currentFrame.next;
                const nextColor = nextFrame.color;
                if (currentColor != nextColor && nextFrame.displayIndex >= 0) {
                    self._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                    self._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                    self._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                    self._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                    self._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                    self._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                    self._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                    self._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;

                    if (
                        self._durationColor.alphaMultiplier != 0 ||
                        self._durationColor.redMultiplier != 0 ||
                        self._durationColor.greenMultiplier != 0 ||
                        self._durationColor.blueMultiplier != 0 ||
                        self._durationColor.alphaOffset != 0 ||
                        self._durationColor.redOffset != 0 ||
                        self._durationColor.greenOffset != 0 ||
                        self._durationColor.blueOffset != 0
                    ) {
                        self._tweenColor = TweenType.Always;
                    }
                }
            }

            if (self._tweenColor == TweenType.None) {
                if (
                    self._slotColor.alphaMultiplier != currentColor.alphaMultiplier ||
                    self._slotColor.redMultiplier != currentColor.redMultiplier ||
                    self._slotColor.greenMultiplier != currentColor.greenMultiplier ||
                    self._slotColor.blueMultiplier != currentColor.blueMultiplier ||
                    self._slotColor.alphaOffset != currentColor.alphaOffset ||
                    self._slotColor.redOffset != currentColor.redOffset ||
                    self._slotColor.greenOffset != currentColor.greenOffset ||
                    self._slotColor.blueOffset != currentColor.blueOffset
                ) {
                    self._tweenColor = TweenType.Once;
                }
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            const self = this;

            super._onUpdateFrame(isUpdate);

            let tweenProgress = 0;

            if (self._tweenColor) {
                if (self._tweenColor == TweenType.Once) {
                    self._tweenColor = TweenType.None;
                    tweenProgress = 0;
                }
                else {
                    tweenProgress = self._tweenProgress;
                }

                const currentColor = self._currentFrame.color;
                self._color.alphaMultiplier = currentColor.alphaMultiplier + self._durationColor.alphaMultiplier * tweenProgress;
                self._color.redMultiplier = currentColor.redMultiplier + self._durationColor.redMultiplier * tweenProgress;
                self._color.greenMultiplier = currentColor.greenMultiplier + self._durationColor.greenMultiplier * tweenProgress;
                self._color.blueMultiplier = currentColor.blueMultiplier + self._durationColor.blueMultiplier * tweenProgress;
                self._color.alphaOffset = currentColor.alphaOffset + self._durationColor.alphaOffset * tweenProgress;
                self._color.redOffset = currentColor.redOffset + self._durationColor.redOffset * tweenProgress;
                self._color.greenOffset = currentColor.greenOffset + self._durationColor.greenOffset * tweenProgress;
                self._color.blueOffset = currentColor.blueOffset + self._durationColor.blueOffset * tweenProgress;

                self._colorDirty = true;
            }
        }

        public fadeIn(armature: Armature, animationState: AnimationState, timelineData: SlotTimelineData, time: number): void {
            super.fadeIn(armature, animationState, timelineData, time);

            this._slotColor = this.slot._colorTransform;
        }

        public fadeOut(): void {
            this._tweenColor = TweenType.None;
        }

        public update(time: number): void {
            const self = this;

            super.update(time);

            // Fade animation.
            if (self._tweenColor != TweenType.None || self._colorDirty) {
                const weight = self._animationState._weightResult;
                if (weight > 0) {
                    if (self._animationState._fadeState != 0) {
                        const fadeProgress = Math.pow(self._animationState._fadeProgress, 4);
                        self._slotColor.alphaMultiplier += (self._color.alphaMultiplier - self._slotColor.alphaMultiplier) * fadeProgress;
                        self._slotColor.redMultiplier += (self._color.redMultiplier - self._slotColor.redMultiplier) * fadeProgress;
                        self._slotColor.greenMultiplier += (self._color.greenMultiplier - self._slotColor.greenMultiplier) * fadeProgress;
                        self._slotColor.blueMultiplier += (self._color.blueMultiplier - self._slotColor.blueMultiplier) * fadeProgress;
                        self._slotColor.alphaOffset += (self._color.alphaOffset - self._slotColor.alphaOffset) * fadeProgress;
                        self._slotColor.redOffset += (self._color.redOffset - self._slotColor.redOffset) * fadeProgress;
                        self._slotColor.greenOffset += (self._color.greenOffset - self._slotColor.greenOffset) * fadeProgress;
                        self._slotColor.blueOffset += (self._color.blueOffset - self._slotColor.blueOffset) * fadeProgress;

                        self.slot._colorDirty = true;
                    }
                    else if (self._colorDirty) {
                        self._colorDirty = false;
                        self._slotColor.alphaMultiplier = self._color.alphaMultiplier;
                        self._slotColor.redMultiplier = self._color.redMultiplier;
                        self._slotColor.greenMultiplier = self._color.greenMultiplier;
                        self._slotColor.blueMultiplier = self._color.blueMultiplier;
                        self._slotColor.alphaOffset = self._color.alphaOffset;
                        self._slotColor.redOffset = self._color.redOffset;
                        self._slotColor.greenOffset = self._color.greenOffset;
                        self._slotColor.blueOffset = self._color.blueOffset;

                        self.slot._colorDirty = true;
                    }
                }
            }
        }
    }
    /**
     * @internal
     * @private
     */
    export class FFDTimelineState extends TweenTimelineState<ExtensionFrameData, FFDTimelineData> {
        public static toString(): string {
            return "[class dragonBones.FFDTimelineState]";
        }

        public slot: Slot;

        private _tweenFFD: number;
        private _slotFFDVertices: Array<number>;
        private _durationFFDFrame: ExtensionFrameData;
        private _ffdVertices: Array<number> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.slot = null;

            this._tweenFFD = TweenType.None;
            this._slotFFDVertices = null;

            if (this._durationFFDFrame) {
                this._durationFFDFrame.returnToPool();
                this._durationFFDFrame = null;
            }

            this._ffdVertices.length = 0;
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;

            super._onArriveAtFrame(isUpdate);

            self._tweenFFD = TweenType.None;

            if (self._tweenEasing != DragonBones.NO_TWEEN || self._curve) {
                self._tweenFFD = self._updateExtensionKeyFrame(self._currentFrame, self._currentFrame.next, self._durationFFDFrame);
            }

            if (self._tweenFFD == TweenType.None) {
                const currentFFDVertices = self._currentFrame.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    if (self._slotFFDVertices[i] != currentFFDVertices[i]) {
                        self._tweenFFD = TweenType.Once;
                        break;
                    }
                }
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            const self = this;

            super._onUpdateFrame(isUpdate);

            let tweenProgress = 0;

            if (self._tweenFFD != TweenType.None) {
                if (self._tweenFFD == TweenType.Once) {
                    self._tweenFFD = TweenType.None;
                    tweenProgress = 0;
                }
                else {
                    tweenProgress = self._tweenProgress;
                }

                const currentFFDVertices = self._currentFrame.tweens;
                const nextFFDVertices = self._durationFFDFrame.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    self._ffdVertices[i] = currentFFDVertices[i] + nextFFDVertices[i] * tweenProgress;
                }

                self.slot._ffdDirty = true;
            }
        }

        public fadeIn(armature: Armature, animationState: AnimationState, timelineData: FFDTimelineData, time: number): void {
            super.fadeIn(armature, animationState, timelineData, time);

            this._slotFFDVertices = this.slot._ffdVertices;
            this._durationFFDFrame = BaseObject.borrowObject(ExtensionFrameData);
            this._durationFFDFrame.tweens.length = this._slotFFDVertices.length;
            this._ffdVertices.length = this._slotFFDVertices.length;

            for (let i = 0, l = this._durationFFDFrame.tweens.length; i < l; ++i) {
                this._durationFFDFrame.tweens[i] = 0;
            }

            for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                this._ffdVertices[i] = 0;
            }
        }

        public update(time: number): void {
            const self = this;

            super.update(time);

            // Blend animation.
            const weight = self._animationState._weightResult;
            if (weight > 0) {
                if (self.slot._blendIndex == 0) {
                    for (let i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] = self._ffdVertices[i] * weight;
                    }
                }
                else {
                    for (let i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] += self._ffdVertices[i] * weight;
                    }
                }

                self.slot._blendIndex++;

                if (self._animationState._fadeState != 0) {
                    self.slot._ffdDirty = true;
                }
            }
        }
    }
}