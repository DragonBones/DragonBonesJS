namespace dragonBones {
    /**
     * @private
     */
    export abstract class TimelineData<T extends FrameData<T>> extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.TimelineData]";
        }

        public scale: number;
        /**
         * @private
         */
        public offset: number;
        /**
         * @private
         */
        public frames: Array<T> = [];
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _onClear(): void {
            let prevFrame: T = null;
            for (let i = 0, l = this.frames.length; i < l; ++i) { // Find key frame data.
                const frame: T = this.frames[i];
                if (prevFrame && frame !== prevFrame) {
                    prevFrame.returnToPool();
                }
                
                prevFrame = frame;
            }

            this.scale = 1;
            this.offset = 0;
            this.frames.length = 0;
        }
    }
    /**
     * @private
     */
    export class ZOrderTimelineData extends TimelineData<ZOrderFrameData> {
        public static toString(): string {
            return "[class dragonBones.ZOrderTimelineData]";
        }
    }
    /**
     * @private
     */
    export class BoneTimelineData extends TimelineData<BoneFrameData> {
        public static toString(): string {
            return "[class dragonBones.BoneTimelineData]";
        }

        public originalTransform: Transform = new Transform();
        public bone: BoneData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.originalTransform.identity();
            this.bone = null;
        }
    }
    /**
     * @private
     */
    export class SlotTimelineData extends TimelineData<SlotFrameData> {
        public static toString(): string {
            return "[class dragonBones.SlotTimelineData]";
        }

        public slot: SlotData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.slot = null;
        }
    }
    /**
     * @private
     */
    export class FFDTimelineData extends TimelineData<ExtensionFrameData> {
        public static toString(): string {
            return "[class dragonBones.FFDTimelineData]";
        }

        public skin: SkinData;
        public slot: SkinSlotData;
        public display: DisplayData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            super._onClear();

            this.skin = null;
            this.slot = null;
            this.display = null;
        }
    }
}