namespace dragonBones {
    /**
     * A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.<br/>
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。<br/>
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width
     * 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class Rectangle {
        /**
         * The x coordinate of the top-left corner of the rectangle.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 矩形左上角的 x 坐标。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public x: number;
        /**
         * The y coordinate of the top-left corner of the rectangle.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 矩形左上角的 y 坐标。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public y: number;
        /**
         * The width of the rectangle, in pixels.
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * 矩形的宽度（以像素为单位）。
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public width: number;
        /**
         * 矩形的高度（以像素为单位）。
         * @default 0.0
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * The height of the rectangle, in pixels.
         * @default 0.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public height: number;
        /**
         * @private
         */
        public constructor(
            x: number = 0.0, y: number = 0.0,
            width: number = 0.0, height: number = 0.0
        ) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        /**
         * @private
         */
        public copyFrom(value: Rectangle): void {
            this.x = value.x;
            this.y = value.y;
            this.width = value.width;
            this.height = value.height;
        }
        /**
         * @private
         */
        public clear(): void {
            this.x = this.y = 0.0;
            this.width = this.height = 0.0;
        }
    }
}