namespace dragonBones {
    /**
     * @private
     */
    export const enum ArmatureType {
        None = -1,
        Armature = 0,
        MovieClip = 1,
        Stage = 2
    }
    /**
     * @private
     */
    export const enum DisplayType {
        None = -1,
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
        None = -1,
        Rectangle = 0,
        Ellipse = 1,
        Polygon = 2
    }
    /**
     * @private
     */
    export const enum EventType {
        None = -1,
        Frame = 10,
        Sound = 11
    }
    /**
     * @private
     */
    export const enum ActionType {
        None = -1,
        Play = 0,
        Fade = 4,
    }
    /**
     * @private
     */
    export const enum BlendMode {
        None = -1,
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
     * @language zh_CN
     * 动画混合的淡出方式。
     * @version DragonBones 4.5
     */
    export const enum AnimationFadeOutMode {
        /**
         * @language zh_CN
         * 不淡出动画。
         * @version DragonBones 4.5
         */
        None = 0,
        /**
        * @language zh_CN
         * 淡出同层的动画。
         * @version DragonBones 4.5
         */
        SameLayer = 1,
        /**
         * @language zh_CN
         * 淡出同组的动画。
         * @version DragonBones 4.5
         */
        SameGroup = 2,
        /**
         * @language zh_CN
         * 淡出同层并且同组的动画。
         * @version DragonBones 4.5
         */
        SameLayerAndGroup = 3,
        /**
         * @language zh_CN
         * 淡出所有动画。
         * @version DragonBones 4.5
         */
        All = 4
    }
    /**
     * @private
     */
    export interface Map<T> {
        [key: string]: T
    }
    /**
     * DragonBones
     */
    export class DragonBones {
        /**
         * @private
         */
        public static PI_D: number = Math.PI * 2.0;
        /**
         * @private
         */
        public static PI_H: number = Math.PI / 2.0;
        /**
         * @private
         */
        public static PI_Q: number = Math.PI / 4.0;
        /**
         * @private
         */
        public static ANGLE_TO_RADIAN: number = Math.PI / 180.0;
        /**
         * @private
         */
        public static RADIAN_TO_ANGLE: number = 180.0 / Math.PI;
        /**
         * @private
         */
        public static SECOND_TO_MILLISECOND: number = 1000.0;
        /**
         * @internal
         * @private
         */
        public static NO_TWEEN: number = 100;

        public static VERSION: string = "5.0.0";
        /**
         * @internal
         * @private
         */
        public static ARGUMENT_ERROR: string = "Argument error.";
        /**
         * @private
         */
        public static yDown: boolean = true;
        /**
         * @private
         */
        public static debug: boolean = false;
        /**
         * @private
         */
        public static debugDraw: boolean = false;
        
        /**
         * @internal
         * @private
         */
        public static _armatures: Array<Armature> = [];
        /**
         * @internal
         * @private
         */
        public static hasArmature(value: Armature): boolean {
            return DragonBones._armatures.indexOf(value) >= 0;
        }
        /**
         * @internal
         * @private
         */
        public static addArmature(value: Armature): void {
            if (value && DragonBones._armatures.indexOf(value) < 0) {
                DragonBones._armatures.push(value);
            }
        }
        /**
         * @internal
         * @private
         */
        public static removeArmature(value: Armature): void {
            if (value) {
                const index = DragonBones._armatures.indexOf(value);
                if (index >= 0) {
                    DragonBones._armatures.splice(index, 1);
                }
            }
        }
    }
}