declare const Module: any; // TODO need remove.

namespace dragonBones {
    /**
     * @private
     */
    export const enum BinaryOffset {
        WeigthBoneCount = 0,
        WeigthFloatOffset = 1,
        WeigthBoneIndices = 2,

        MeshVertexCount = 0,
        MeshTriangleCount = 1,
        MeshFloatOffset = 2,
        MeshWeightOffset = 3,
        MeshVertexIndices = 4,

        TimelineScale = 0,
        TimelineOffset = 1,
        TimelineKeyFrameCount = 2,
        TimelineFrameValueCount = 3,
        TimelineFrameValueOffset = 4,
        TimelineFrameOffset = 5,

        FramePosition = 0,
        FrameTweenType = 1,
        FrameTweenEasingOrCurveSampleCount = 2,
        FrameCurveSamples = 3,

        FFDTimelineMeshOffset = 0,
        FFDTimelineFFDCount = 1,
        FFDTimelineValueCount = 2,
        FFDTimelineValueOffset = 3,
        FFDTimelineFloatOffset = 4
    }
    /**
     * @private
     */
    export const enum ArmatureType {
        Armature = 0,
        MovieClip = 1,
        Stage = 2
    }
    /**
     * @private
     */
    export const enum DisplayType {
        Image = 0,
        Armature = 1,
        Mesh = 2,
        BoundingBox = 3
    }
    /**
     * @language zh_CN
     * 包围盒类型。
     * @version DragonBones 5.0
     */
    export const enum BoundingBoxType {
        Rectangle = 0,
        Ellipse = 1,
        Polygon = 2
    }
    /**
     * @private
     */
    export const enum ActionType {
        Play = 0,
        Frame = 10,
        Sound = 11
    }
    /**
     * @private
     */
    export const enum BlendMode {
        Normal = 0,
        Add = 1,
        Alpha = 2,
        Darken = 3,
        Difference = 4,
        Erase = 5,
        HardLight = 6,
        Invert = 7,
        Layer = 8,
        Lighten = 9,
        Multiply = 10,
        Overlay = 11,
        Screen = 12,
        Subtract = 13
    }
    /**
     * @private
     */
    export const enum TweenType {
        None = 0,
        Line = 1,
        Curve = 2,
        QuadIn = 3,
        QuadOut = 4,
        QuadInOut = 5
    }
    /**
     * @private
     */
    export const enum TimelineType {
        Action = 0,
        ZOrder = 1,

        BoneAll = 10,

        BoneT = 11,
        BoneR = 12,
        BoneS = 13,

        BoneX = 14,
        BoneY = 15,
        BoneRotation = 16,
        BoneSkew = 17,
        BoneScaleX = 18,
        BoneScaleY = 19,

        SlotDisplayIndex = 20,
        SlotColor = 21,
        SlotFFD = 22,

        AnimationTime = 40,
        AnimationWeight = 41
    }
    /**
     * @private
     */
    export const enum OffsetMode {
        None,
        Additive,
        Override
    }
    /**
     * @language zh_CN
     * 动画混合的淡出方式。
     * @version DragonBones 4.5
     */
    export const enum AnimationFadeOutMode {
        /**
         * 不淡出动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        None = 0,
        /**
         * 淡出同层的动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        SameLayer = 1,
        /**
         * 淡出同组的动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        SameGroup = 2,
        /**
         * 淡出同层并且同组的动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        SameLayerAndGroup = 3,
        /**
         * 淡出所有动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        All = 4,
        /**
         * 不替换同名动画。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        Single = 5
    }
    /**
     * @private
     */
    export interface Map<T> {
        [key: string]: T;
    }
    /**
     * @private
     */
    export class DragonBones {
        public static yDown: boolean = true;
        public static debug: boolean = false;
        public static debugDraw: boolean = false;
        public static webAssembly: boolean = false;
        public static readonly VERSION: string = "5.1.0";


        private readonly _events: Array<EventObject> = [];
        private readonly _objects: Array<BaseObject> = [];
        private _clock: WorldClock = null as any;
        private _eventManager: IEventDispatcher = null as any;

        public constructor(eventManager: IEventDispatcher) {
            this._eventManager = eventManager;
        }

        public advanceTime(passedTime: number): void {
            if (this._objects.length > 0) {
                for (const object of this._objects) {
                    object.returnToPool();
                }

                this._objects.length = 0;
            }

            this._clock.advanceTime(passedTime);

            if (this._events.length > 0) {
                for (let i = 0; i < this._events.length; ++i) {
                    const eventObject = this._events[i];
                    const armature = eventObject.armature;

                    armature.eventDispatcher._dispatchEvent(eventObject.type, eventObject);
                    if (eventObject.type === EventObject.SOUND_EVENT) {
                        this._eventManager._dispatchEvent(eventObject.type, eventObject);
                    }

                    this.bufferObject(eventObject);
                }

                this._events.length = 0;
            }
        }

        public bufferEvent(value: EventObject): void {
            this._events.push(value);
        }

        public bufferObject(object: BaseObject): void {
            this._objects.push(object);
        }

        public get clock(): WorldClock {
            if (this._clock === null) {
                this._clock = new WorldClock();
            }

            return this._clock;
        }

        public get eventManager(): IEventDispatcher {
            return this._eventManager;
        }
    }

    if (!console.warn) {
        console.warn = function () { };
    }

    if (!console.assert) {
        console.assert = function () { };
    }
}