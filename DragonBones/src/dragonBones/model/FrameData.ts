namespace dragonBones {
    /**
     * @private
     */
    export class ActionData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.ActionData]";
        }

        public type: ActionType;
        public bone: BoneData;
        public slot: SlotData;
        public data: Array<any> = [];

        public constructor() {
            super();
        }

        protected _onClear(): void {
            this.type = ActionType.Play;
            this.bone = null;
            this.slot = null;
            this.data.length = 0;
        }
    }
    /**
     * @private
     */
    export class EventData extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.EventData]";
        }

        public type: EventType;
        public name: string;
        public data: any;
        public bone: BoneData;
        public slot: SlotData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            this.type = EventType.Frame;
            this.name = null;
            this.data = null;
            this.bone = null;
            this.slot = null;
        }
    }
    /**
     * @private
     */
    export abstract class FrameData<T> extends BaseObject {
        public position: number;
        public duration: number;
        public prev: T;
        public next: T;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            this.position = 0;
            this.duration = 0;
            this.prev = null;
            this.next = null;
        }
    }
    /**
     * @private
     */
    export abstract class TweenFrameData<T> extends FrameData<T> {
        public static samplingCurve(curve: Array<number>, frameCount: number): Array<number> {
            const curveCount = curve.length;
            if (curveCount == 0 || frameCount == 0) {
                return null;
            }

            const samplingTimes = frameCount + 1;
            const samplingStep = 1 / (samplingTimes + 1);
            const sampling = new Array<number>(samplingTimes * 2);
            let stepIndex = -2;

            for (let i = 0; i < samplingTimes; ++i) {
                const stepValue = samplingStep * (i + 1);
                while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < stepValue) { // stepIndex + 3 * 2
                    stepIndex += 6;
                }

                const isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
                const x1 = isInCurve ? curve[stepIndex] : 0;
                const y1 = isInCurve ? curve[stepIndex + 1] : 0;
                const x4 = isInCurve ? curve[stepIndex + 6] : 1;
                const y4 = isInCurve ? curve[stepIndex + 7] : 1;

                const t = (stepValue - x1) / (x4 - x1);
                const l_t = 1 - t;

                const powA = l_t * l_t;
                const powB = t * t;

                const kA = l_t * powA;
                const kB = 3 * t * powA;
                const kC = 3 * l_t * powB;
                const kD = t * powB;

                sampling[i * 2] = kA * x1 + kB * curve[stepIndex + 2] + kC * curve[stepIndex + 4] + kD * x4;
                sampling[i * 2 + 1] = kA * y1 + kB * curve[stepIndex + 3] + kC * curve[stepIndex + 5] + kD * y4;
            }

            return sampling;
        }

        public tweenEasing: number;
        public curve: Array<number>;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.tweenEasing = 0;
            this.curve = null;
        }
    }
    /**
     * @private
     */
    export class AnimationFrameData extends FrameData<AnimationFrameData> {
        public static toString(): string {
            return "[class dragonBones.AnimationFrameData]";
        }

        public actions: Array<ActionData> = [];
        public events: Array<EventData> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            for (let i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }

            for (let i = 0, l = this.events.length; i < l; ++i) {
                this.events[i].returnToPool();
            }

            this.actions.length = 0;
            this.events.length = 0;
        }
    }
    /**
     * @private
     */
    export class ZOrderFrameData extends FrameData<ZOrderFrameData> {
        public zOrder: Array<number> = [];
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.zOrder.length = 0;
        }
    }
    /**
     * @private
     */
    export class BoneFrameData extends TweenFrameData<BoneFrameData> {
        public static toString(): string {
            return "[class dragonBones.BoneFrameData]";
        }

        public tweenScale: boolean;
        public tweenRotate: number;
        public guideCurve: Array<number>;
        public transform: Transform = new Transform();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.tweenScale = false;
            this.tweenRotate = 0;
            this.guideCurve = null;
            this.transform.identity();
        }
    }
    /**
     * @private
     */
    export class SlotFrameData extends TweenFrameData<SlotFrameData> {
        public static DEFAULT_COLOR: ColorTransform = new ColorTransform();
        public static generateColor(): ColorTransform {
            return new ColorTransform();
        }
        public static toString(): string {
            return "[class dragonBones.SlotFrameData]";
        }

        public displayIndex: number;
        public color: ColorTransform;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.displayIndex = 0;
            this.color = null;
        }
    }
    /**
     * @private
     */
    export class ExtensionFrameData extends TweenFrameData<ExtensionFrameData> {
        public static toString(): string {
            return "[class dragonBones.ExtensionFrameData]";
        }

        public type: ExtensionType;
        public tweens: Array<number> = [];
        public keys: Array<number> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.type = ExtensionType.FFD;
            this.tweens.length = 0;
            this.keys.length = 0;
        }
    }
}