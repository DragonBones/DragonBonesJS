namespace dragonBones {
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

        protected _onClear(): void {
            this.position = 0.0;
            this.duration = 0.0;
            this.prev = null;
            this.next = null;
        }
    }
    /**
     * @private
     */
    export abstract class TweenFrameData<T> extends FrameData<T> {
        private static _getCurvePoint(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, t: number, result: Point): void {
            const l_t = 1 - t;
            const powA = l_t * l_t;
            const powB = t * t;
            const kA = l_t * powA;
            const kB = 3.0 * t * powA;
            const kC = 3.0 * l_t * powB;
            const kD = t * powB;

            result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
            result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
        }

        public static samplingEasingCurve(curve: Array<number>, samples: Array<number>): void {
            const curveCount = curve.length;
            const result = new Point();

            let stepIndex = -2;
            for (let i = 0, l = samples.length; i < l; ++i) {
                let t = (i + 1) / (l + 1);
                while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) { // stepIndex + 3 * 2
                    stepIndex += 6;
                }

                const isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
                const x1 = isInCurve ? curve[stepIndex] : 0.0;
                const y1 = isInCurve ? curve[stepIndex + 1] : 0.0;
                const x2 = curve[stepIndex + 2];
                const y2 = curve[stepIndex + 3];
                const x3 = curve[stepIndex + 4];
                const y3 = curve[stepIndex + 5];
                const x4 = isInCurve ? curve[stepIndex + 6] : 1.0;
                const y4 = isInCurve ? curve[stepIndex + 7] : 1.0;

                let lower = 0.0;
                let higher = 1.0;
                while (higher - lower > 0.01) {
                    const percentage = (higher + lower) / 2.0;
                    TweenFrameData._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, result);
                    if (t - result.x > 0.0) {
                        lower = percentage;
                    }
                    else {
                        higher = percentage;
                    }
                }

                samples[i] = result.y;
            }
        }

        public tweenEasing: number;
        public curve: Array<number>;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.tweenEasing = 0.0;
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
        public transform: Transform = new Transform();

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.tweenScale = false;
            this.tweenRotate = 0.0;
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

        public tweens: Array<number> = [];

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.tweens.length = 0;
        }
    }
}