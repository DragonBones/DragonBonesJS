namespace dragonBones {
    /**
     * @private
     */
    export abstract class TimelineData<T extends FrameData<T>> extends BaseObject {
        public scale: number;
        /**
         * @private
         */
        public offset: number;
        /**
         * @private
         */
        public frames: Array<T> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            let prevFrame: T = null;
            for (let i = 0, l = this.frames.length; i < l; ++i) { // Find key frame data.
                const frame: T = this.frames[i];
                if (prevFrame && frame != prevFrame) {
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
    export class BoneTimelineData extends TimelineData<BoneFrameData> {
        public static cacheFrame(cacheFrames: Array<Matrix>, cacheFrameIndex: number, globalTransformMatrix: Matrix): Matrix {
            const cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);

            return cacheMatrix;
        }
        public static toString(): string {
            return "[class dragonBones.BoneTimelineData]";
        }


        public bone: BoneData;
        public originTransform: Transform = new Transform();
        public cachedFrames: Array<Matrix> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.bone = null;
            this.originTransform.identity();
            this.cachedFrames.length = 0;
        }

        public cacheFrames(cacheFrameCount: number): void {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        }
    }
    /**
     * @private
     */
    export class SlotTimelineData extends TimelineData<SlotFrameData> {
        public static cacheFrame(cacheFrames: Array<Matrix>, cacheFrameIndex: number, globalTransformMatrix: Matrix): Matrix {
            const cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);

            return cacheMatrix;
        }
        public static toString(): string {
            return "[class dragonBones.SlotTimelineData]";
        }

        public slot: SlotData;
        public cachedFrames: Array<Matrix> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.slot = null;
            this.cachedFrames.length = 0;
        }

        public cacheFrames(cacheFrameCount: number): void {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        }
    }
    /**
     * @private
     */
    export class FFDTimelineData extends TimelineData<ExtensionFrameData> {
        public static toString(): string {
            return "[class dragonBones.FFDTimelineData]";
        }

        public displayIndex: number;
        public skin: SkinData;
        public slot: SlotDisplayDataSet;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.displayIndex = 0;
            this.skin = null;
            this.slot = null;
        }
    }
}