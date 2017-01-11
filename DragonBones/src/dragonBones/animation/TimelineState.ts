namespace dragonBones {
    /**
     * @internal
     * @private
     */
    export class AnimationTimelineState extends TimelineState<AnimationFrameData, AnimationData> {
        public static toString(): string {
            return "[class dragonBones.AnimationTimelineState]";
        }

        public constructor() {
            super();
        }

        protected _onCrossFrame(frame: AnimationFrameData): void {
            if (this._animationState.actionEnabled) {
                const actions = frame.actions;
                for (let i = 0, l = actions.length; i < l; ++i) {
                    this._armature._bufferAction(actions[i]);
                }
            }

            const eventDispatcher = this._armature.eventDispatcher;
            const events = frame.events;
            for (let i = 0, l = events.length; i < l; ++i) {
                const eventData = events[i];

                let eventType: string = null;
                switch (eventData.type) {
                    case EventType.Frame:
                        eventType = EventObject.FRAME_EVENT;
                        break;

                    case EventType.Sound:
                        eventType = EventObject.SOUND_EVENT;
                        break;
                }

                if (eventDispatcher.hasEvent(eventType) || eventData.type === EventType.Sound) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.name = eventData.name;
                    eventObject.frame = frame;
                    eventObject.data = eventData.data;
                    eventObject.animationState = this._animationState;

                    if (eventData.bone) {
                        eventObject.bone = this._armature.getBone(eventData.bone.name);
                    }

                    if (eventData.slot) {
                        eventObject.slot = this._armature.getSlot(eventData.slot.name);
                    }

                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        }

        public update(passedTime: number, normalizedTime: number): void {
            const prevState = this._playState;
            const prevPlayTimes = this._currentPlayTimes;
            const prevTime = this._currentTime;

            if (this._playState <= 0 && this._setCurrentTime(passedTime, normalizedTime)) {
                const eventDispatcher = this._armature.eventDispatcher;

                if (prevState < 0 && this._playState !== prevState) {

                    if (this._animationState.displayControl) {
                        this._armature._sortZOrder(null);
                    }

                    if (eventDispatcher.hasEvent(EventObject.START)) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        eventObject.animationState = this._animationState;
                        this._armature._bufferEvent(eventObject, EventObject.START);
                    }
                }

                if (prevTime < 0.0) {
                    return;
                }

                if (this._keyFrameCount > 1) {
                    const currentFrameIndex = Math.floor(this._currentTime * this._frameRate); // uint
                    const currentFrame = this._timelineData.frames[currentFrameIndex];
                    if (this._currentFrame !== currentFrame) {
                        const isReverse = this._currentPlayTimes === prevPlayTimes && prevTime > this._currentTime;
                        let crossedFrame = this._currentFrame;
                        this._currentFrame = currentFrame;

                        if (!crossedFrame) {
                            const prevFrameIndex = Math.floor(prevTime * this._frameRate);
                            crossedFrame = this._timelineData.frames[prevFrameIndex];

                            if (isReverse) {
                            }
                            else {
                                if (
                                    prevTime <= crossedFrame.position ||
                                    prevPlayTimes !== this._currentPlayTimes
                                ) {
                                    crossedFrame = crossedFrame.prev;
                                }
                            }
                        }

                        // TODO 1 2 3 key frame loop, first key frame after loop complete.
                        if (isReverse) {
                            while (crossedFrame !== currentFrame) {
                                this._onCrossFrame(crossedFrame);
                                crossedFrame = crossedFrame.prev;
                            }
                        }
                        else {
                            while (crossedFrame !== currentFrame) {
                                crossedFrame = crossedFrame.next;
                                this._onCrossFrame(crossedFrame);
                            }
                        }
                    }
                }
                else if (this._keyFrameCount > 0 && !this._currentFrame) {
                    this._currentFrame = this._timelineData.frames[0];
                    this._onCrossFrame(this._currentFrame);
                }

                if (this._currentPlayTimes !== prevPlayTimes) {
                    if (eventDispatcher.hasEvent(EventObject.LOOP_COMPLETE)) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        eventObject.animationState = this._animationState;
                        this._armature._bufferEvent(eventObject, EventObject.LOOP_COMPLETE);
                    }

                    if (this._playState > 0 && eventDispatcher.hasEvent(EventObject.COMPLETE)) {
                        const eventObject = BaseObject.borrowObject(EventObject);
                        eventObject.animationState = this._animationState;
                        this._armature._bufferEvent(eventObject, EventObject.COMPLETE);
                    }
                }
            }
        }

        public setCurrentTime(value: number): void {
            this._setCurrentTime(value, -1.0);
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

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            this._armature._sortZOrder(this._currentFrame.zOrder);
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

        private _tweenTransform: TweenType;
        private _tweenRotate: TweenType;
        private _tweenScale: TweenType;
        private _transform: Transform = new Transform();
        private _durationTransform: Transform = new Transform();
        private _boneTransform: Transform;
        private _originalTransform: Transform;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.bone = null;

            this._tweenTransform = TweenType.None;
            this._tweenRotate = TweenType.None;
            this._tweenScale = TweenType.None;
            this._transform.identity();
            this._durationTransform.identity();
            this._boneTransform = null;
            this._originalTransform = null;
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            this._tweenTransform = TweenType.Once;
            this._tweenRotate = TweenType.Once;
            this._tweenScale = TweenType.Once;

            if (this._keyFrameCount > 1 && (this._tweenEasing !== DragonBones.NO_TWEEN || this._curve)) {
                const currentTransform = this._currentFrame.transform;
                const nextFrame = this._currentFrame.next;
                const nextTransform = nextFrame.transform;

                // Transform.
                this._durationTransform.x = nextTransform.x - currentTransform.x;
                this._durationTransform.y = nextTransform.y - currentTransform.y;
                if (this._durationTransform.x !== 0.0 || this._durationTransform.y !== 0.0) {
                    this._tweenTransform = TweenType.Always;
                }

                // Rotate.
                let tweenRotate = this._currentFrame.tweenRotate;
                if (tweenRotate !== DragonBones.NO_TWEEN) {
                    if (tweenRotate) {
                        if (tweenRotate > 0.0 ? nextTransform.skewY >= currentTransform.skewY : nextTransform.skewY <= currentTransform.skewY) {
                            tweenRotate = tweenRotate > 0.0 ? tweenRotate - 1.0 : tweenRotate + 1.0;
                        }

                        this._durationTransform.skewX = nextTransform.skewX - currentTransform.skewX + DragonBones.PI_D * tweenRotate;
                        this._durationTransform.skewY = nextTransform.skewY - currentTransform.skewY + DragonBones.PI_D * tweenRotate;
                    }
                    else {
                        this._durationTransform.skewX = Transform.normalizeRadian(nextTransform.skewX - currentTransform.skewX);
                        this._durationTransform.skewY = Transform.normalizeRadian(nextTransform.skewY - currentTransform.skewY);
                    }

                    if (this._durationTransform.skewX !== 0.0 || this._durationTransform.skewY !== 0.0) {
                        this._tweenRotate = TweenType.Always;
                    }
                }
                else {
                    this._durationTransform.skewX = 0.0;
                    this._durationTransform.skewY = 0.0;
                }

                // Scale.
                if (this._currentFrame.tweenScale) {
                    this._durationTransform.scaleX = nextTransform.scaleX - currentTransform.scaleX;
                    this._durationTransform.scaleY = nextTransform.scaleY - currentTransform.scaleY;
                    if (this._durationTransform.scaleX !== 0.0 || this._durationTransform.scaleY !== 0.0) {
                        this._tweenScale = TweenType.Always;
                    }
                }
                else {
                    this._durationTransform.scaleX = 0.0;
                    this._durationTransform.scaleY = 0.0;
                }
            }
            else {
                this._durationTransform.x = 0.0;
                this._durationTransform.y = 0.0;
                this._durationTransform.skewX = 0.0;
                this._durationTransform.skewY = 0.0;
                this._durationTransform.scaleX = 0.0;
                this._durationTransform.scaleY = 0.0;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            let tweenProgress = 0.0;
            const currentTransform = this._currentFrame.transform;

            if (this._tweenTransform !== TweenType.None) {
                if (this._tweenTransform === TweenType.Once) {
                    this._tweenTransform = TweenType.None;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }

                if (this._animationState.additiveBlending) { // Additive blending.
                    this._transform.x = currentTransform.x + this._durationTransform.x * tweenProgress;
                    this._transform.y = currentTransform.y + this._durationTransform.y * tweenProgress;
                }
                else { // Normal blending.
                    this._transform.x = this._originalTransform.x + currentTransform.x + this._durationTransform.x * tweenProgress;
                    this._transform.y = this._originalTransform.y + currentTransform.y + this._durationTransform.y * tweenProgress;
                }
            }

            if (this._tweenRotate !== TweenType.None) {
                if (this._tweenRotate === TweenType.Once) {
                    this._tweenRotate = TweenType.None;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }

                if (this._animationState.additiveBlending) { // Additive blending.
                    this._transform.skewX = currentTransform.skewX + this._durationTransform.skewX * tweenProgress;
                    this._transform.skewY = currentTransform.skewY + this._durationTransform.skewY * tweenProgress;
                }
                else { // Normal blending.
                    this._transform.skewX = this._originalTransform.skewX + currentTransform.skewX + this._durationTransform.skewX * tweenProgress;
                    this._transform.skewY = this._originalTransform.skewY + currentTransform.skewY + this._durationTransform.skewY * tweenProgress;
                }
            }

            if (this._tweenScale !== TweenType.None) {
                if (this._tweenScale === TweenType.Once) {
                    this._tweenScale = TweenType.None;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }

                if (this._animationState.additiveBlending) { // Additive blending.
                    this._transform.scaleX = currentTransform.scaleX + this._durationTransform.scaleX * tweenProgress;
                    this._transform.scaleY = currentTransform.scaleY + this._durationTransform.scaleY * tweenProgress;
                }
                else { // Normal blending.
                    this._transform.scaleX = this._originalTransform.scaleX * (currentTransform.scaleX + this._durationTransform.scaleX * tweenProgress);
                    this._transform.scaleY = this._originalTransform.scaleY * (currentTransform.scaleY + this._durationTransform.scaleY * tweenProgress);
                }
            }

            this.bone.invalidUpdate();
        }

        public _init(armature: Armature, animationState: AnimationState, timelineData: BoneTimelineData): void {
            super._init(armature, animationState, timelineData);

            this._originalTransform = this._timelineData.originalTransform;
            this._boneTransform = this.bone._animationPose;
        }

        public fadeOut(): void {
            this._transform.skewX = Transform.normalizeRadian(this._transform.skewX);
            this._transform.skewY = Transform.normalizeRadian(this._transform.skewY);
        }

        public update(passedTime: number, normalizedTime: number): void {
            // Blend animation state.
            const animationLayer = this._animationState._layer;
            let weight = this._animationState._weightResult;

            if (this.bone._updateState <= 0) {
                super.update(passedTime, normalizedTime);

                this.bone._blendLayer = animationLayer;
                this.bone._blendLeftWeight = 1.0;
                this.bone._blendTotalWeight = weight;

                this._boneTransform.x = this._transform.x * weight;
                this._boneTransform.y = this._transform.y * weight;
                this._boneTransform.skewX = this._transform.skewX * weight;
                this._boneTransform.skewY = this._transform.skewY * weight;
                this._boneTransform.scaleX = (this._transform.scaleX - 1.0) * weight + 1.0;
                this._boneTransform.scaleY = (this._transform.scaleY - 1.0) * weight + 1.0;

                this.bone._updateState = 1;
            }
            else if (this.bone._blendLeftWeight > 0.0) {
                if (this.bone._blendLayer !== animationLayer) {
                    if (this.bone._blendTotalWeight >= this.bone._blendLeftWeight) {
                        this.bone._blendLeftWeight = 0.0;
                    }
                    else {
                        this.bone._blendLayer = animationLayer;
                        this.bone._blendLeftWeight -= this.bone._blendTotalWeight;
                        this.bone._blendTotalWeight = 0.0;
                    }
                }

                weight *= this.bone._blendLeftWeight;
                if (weight >= 0.0) {
                    super.update(passedTime, normalizedTime);

                    this.bone._blendTotalWeight += weight;

                    this._boneTransform.x += this._transform.x * weight;
                    this._boneTransform.y += this._transform.y * weight;
                    this._boneTransform.skewX += this._transform.skewX * weight;
                    this._boneTransform.skewY += this._transform.skewY * weight;
                    this._boneTransform.scaleX += (this._transform.scaleX - 1) * weight;
                    this._boneTransform.scaleY += (this._transform.scaleY - 1) * weight;

                    this.bone._updateState++;
                }
            }

            if (this.bone._updateState > 0) {
                if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    this.bone.invalidUpdate();
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
        private _tweenColor: TweenType;
        private _color: ColorTransform = new ColorTransform();
        private _durationColor: ColorTransform = new ColorTransform();
        private _slotColor: ColorTransform;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.slot = null;

            this._colorDirty = false;
            this._tweenColor = TweenType.None;
            this._color.identity();
            this._durationColor.identity();
            this._slotColor = null;
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            if (this._animationState._isDisabled(this.slot)) {
                this._tweenEasing = DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = TweenType.None;
                return;
            }

            const displayIndex = this._currentFrame.displayIndex;
            if (this._playState >= 0 && this.slot.displayIndex !== displayIndex) {
                this.slot._setDisplayIndex(displayIndex);
            }

            if (displayIndex >= 0) {
                this._tweenColor = TweenType.None;

                const currentColor = this._currentFrame.color;

                if (this._tweenEasing !== DragonBones.NO_TWEEN || this._curve) {
                    const nextFrame = this._currentFrame.next;
                    const nextColor = nextFrame.color;
                    if (currentColor !== nextColor) {
                        this._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                        this._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                        this._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                        this._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                        this._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                        this._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                        this._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                        this._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;

                        if (
                            this._durationColor.alphaMultiplier !== 0.0 ||
                            this._durationColor.redMultiplier !== 0.0 ||
                            this._durationColor.greenMultiplier !== 0.0 ||
                            this._durationColor.blueMultiplier !== 0.0 ||
                            this._durationColor.alphaOffset !== 0 ||
                            this._durationColor.redOffset !== 0 ||
                            this._durationColor.greenOffset !== 0 ||
                            this._durationColor.blueOffset !== 0
                        ) {
                            this._tweenColor = TweenType.Always;
                        }
                    }
                }

                if (this._tweenColor === TweenType.None) {
                    if (
                        this._slotColor.alphaMultiplier !== currentColor.alphaMultiplier ||
                        this._slotColor.redMultiplier !== currentColor.redMultiplier ||
                        this._slotColor.greenMultiplier !== currentColor.greenMultiplier ||
                        this._slotColor.blueMultiplier !== currentColor.blueMultiplier ||
                        this._slotColor.alphaOffset !== currentColor.alphaOffset ||
                        this._slotColor.redOffset !== currentColor.redOffset ||
                        this._slotColor.greenOffset !== currentColor.greenOffset ||
                        this._slotColor.blueOffset !== currentColor.blueOffset
                    ) {
                        this._tweenColor = TweenType.Once;
                    }
                }
            }
            else {
                this._tweenEasing = DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = TweenType.None;
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            let tweenProgress = 0.0;

            if (this._tweenColor !== TweenType.None && this.slot.parent._blendLayer >= this._animationState._layer) {
                if (this._tweenColor === TweenType.Once) {
                    this._tweenColor = TweenType.None;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }

                const currentColor = this._currentFrame.color;
                this._color.alphaMultiplier = currentColor.alphaMultiplier + this._durationColor.alphaMultiplier * tweenProgress;
                this._color.redMultiplier = currentColor.redMultiplier + this._durationColor.redMultiplier * tweenProgress;
                this._color.greenMultiplier = currentColor.greenMultiplier + this._durationColor.greenMultiplier * tweenProgress;
                this._color.blueMultiplier = currentColor.blueMultiplier + this._durationColor.blueMultiplier * tweenProgress;
                this._color.alphaOffset = currentColor.alphaOffset + this._durationColor.alphaOffset * tweenProgress;
                this._color.redOffset = currentColor.redOffset + this._durationColor.redOffset * tweenProgress;
                this._color.greenOffset = currentColor.greenOffset + this._durationColor.greenOffset * tweenProgress;
                this._color.blueOffset = currentColor.blueOffset + this._durationColor.blueOffset * tweenProgress;

                this._colorDirty = true;
            }
        }

        public _init(armature: Armature, animationState: AnimationState, timelineData: SlotTimelineData): void {
            super._init(armature, animationState, timelineData);

            this._slotColor = this.slot._colorTransform;
        }

        public fadeOut(): void {
            this._tweenColor = TweenType.None;
        }

        public update(passedTime: number, normalizedTime: number): void {
            super.update(passedTime, normalizedTime);

            // Fade animation.
            if (this._tweenColor !== TweenType.None || this._colorDirty) {
                if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    const fadeProgress = Math.pow(this._animationState._fadeProgress, 4);

                    this._slotColor.alphaMultiplier += (this._color.alphaMultiplier - this._slotColor.alphaMultiplier) * fadeProgress;
                    this._slotColor.redMultiplier += (this._color.redMultiplier - this._slotColor.redMultiplier) * fadeProgress;
                    this._slotColor.greenMultiplier += (this._color.greenMultiplier - this._slotColor.greenMultiplier) * fadeProgress;
                    this._slotColor.blueMultiplier += (this._color.blueMultiplier - this._slotColor.blueMultiplier) * fadeProgress;
                    this._slotColor.alphaOffset += (this._color.alphaOffset - this._slotColor.alphaOffset) * fadeProgress;
                    this._slotColor.redOffset += (this._color.redOffset - this._slotColor.redOffset) * fadeProgress;
                    this._slotColor.greenOffset += (this._color.greenOffset - this._slotColor.greenOffset) * fadeProgress;
                    this._slotColor.blueOffset += (this._color.blueOffset - this._slotColor.blueOffset) * fadeProgress;

                    this.slot._colorDirty = true;
                }
                else if (this._colorDirty) {
                    this._colorDirty = false;

                    this._slotColor.alphaMultiplier = this._color.alphaMultiplier;
                    this._slotColor.redMultiplier = this._color.redMultiplier;
                    this._slotColor.greenMultiplier = this._color.greenMultiplier;
                    this._slotColor.blueMultiplier = this._color.blueMultiplier;
                    this._slotColor.alphaOffset = this._color.alphaOffset;
                    this._slotColor.redOffset = this._color.redOffset;
                    this._slotColor.greenOffset = this._color.greenOffset;
                    this._slotColor.blueOffset = this._color.blueOffset;

                    this.slot._colorDirty = true;
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

        private _ffdDirty: boolean;
        private _tweenFFD: TweenType;
        private _ffdVertices: Array<number> = [];
        private _durationFFDVertices: Array<number> = [];
        private _slotFFDVertices: Array<number>;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.slot = null;

            this._ffdDirty = false;
            this._tweenFFD = TweenType.None;
            this._ffdVertices.length = 0;
            this._durationFFDVertices.length = 0;
            this._slotFFDVertices = null;
        }

        protected _onArriveAtFrame(): void {
            super._onArriveAtFrame();

            if (this.slot.displayIndex >= 0 && this._animationState._isDisabled(this.slot)) {
                this._tweenEasing = DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenFFD = TweenType.None;
                return;
            }

            this._tweenFFD = TweenType.None;

            if (this._tweenEasing !== DragonBones.NO_TWEEN || this._curve) {
                const currentFFDVertices = this._currentFrame.tweens;
                const nextFFDVertices = this._currentFrame.next.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    const duration = nextFFDVertices[i] - currentFFDVertices[i];
                    this._durationFFDVertices[i] = duration;
                    if (duration !== 0.0) {
                        this._tweenFFD = TweenType.Always;
                    }
                }
            }

            //
            if (this._tweenFFD === TweenType.None) {
                this._tweenFFD = TweenType.Once;

                for (let i = 0, l = this._durationFFDVertices.length; i < l; ++i) {
                    this._durationFFDVertices[i] = 0;
                }
            }
        }

        protected _onUpdateFrame(): void {
            super._onUpdateFrame();

            let tweenProgress = 0.0;

            if (this._tweenFFD !== TweenType.None && this.slot.parent._blendLayer >= this._animationState._layer) {
                if (this._tweenFFD === TweenType.Once) {
                    this._tweenFFD = TweenType.None;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }

                const currentFFDVertices = this._currentFrame.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    this._ffdVertices[i] = currentFFDVertices[i] + this._durationFFDVertices[i] * tweenProgress;
                }

                this._ffdDirty = true;
            }
        }

        public _init(armature: Armature, animationState: AnimationState, timelineData: FFDTimelineData): void {
            super._init(armature, animationState, timelineData);

            this._slotFFDVertices = this.slot._ffdVertices;
            this._ffdVertices.length = this._timelineData.frames[0].tweens.length;
            this._durationFFDVertices.length = this._ffdVertices.length;

            for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                this._ffdVertices[i] = 0.0;
            }

            for (let i = 0, l = this._durationFFDVertices.length; i < l; ++i) {
                this._durationFFDVertices[i] = 0.0;
            }
        }

        public fadeOut(): void {
            this._tweenFFD = TweenType.None;
        }

        public update(passedTime: number, normalizedTime: number): void {
            super.update(passedTime, normalizedTime);

            if (this.slot._meshData !== this._timelineData.display.mesh) {
                return;
            }

            // Fade animation.
            if (this._tweenFFD !== TweenType.None || this._ffdDirty) {
                if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    const fadeProgress = Math.pow(this._animationState._fadeProgress, 4.0);

                    for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] += (this._ffdVertices[i] - this._slotFFDVertices[i]) * fadeProgress;
                    }

                    this.slot._meshDirty = true;
                }
                else if (this._ffdDirty) {
                    this._ffdDirty = false;

                    for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] = this._ffdVertices[i];
                    }

                    this.slot._meshDirty = true;
                }
            }
        }
    }
}