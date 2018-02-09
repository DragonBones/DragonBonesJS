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
     * - 2D Transform.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 2D 变换。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class Transform {
        /**
         * @private
         */
        public static readonly PI: number = Math.PI;
        /**
         * @private
         */
        public static readonly PI_D: number = Math.PI * 2.0;
        /**
         * @private
         */
        public static readonly PI_H: number = Math.PI / 2.0;
        /**
         * @private
         */
        public static readonly PI_Q: number = Math.PI / 4.0;
        /**
         * @private
         */
        public static readonly RAD_DEG: number = 180.0 / Math.PI;
        /**
         * @private
         */
        public static readonly DEG_RAD: number = Math.PI / 180.0;
        /**
         * @private
         */
        public static normalizeRadian(value: number): number {
            value = (value + Math.PI) % (Math.PI * 2.0);
            value += value > 0.0 ? -Math.PI : Math.PI;

            return value;
        }
        /**
         * - Horizontal translate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 水平位移。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public x: number;
        /**
         * - Vertical translate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 垂直位移。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public y: number;
        /**
         * - Skew. (In radians)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 倾斜。 （以弧度为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public skew: number;
        /**
         * - rotation. (In radians)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 旋转。 （以弧度为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public rotation: number;
        /**
         * - Horizontal Scaling.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 水平缩放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public scaleX: number;
        /**
         * - Vertical scaling.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 垂直缩放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public scaleY: number;
        /**
         * @private
         */
        public constructor(x: number = 0.0, y: number = 0.0, skew: number = 0.0, rotation: number = 0.0, scaleX: number = 1.0, scaleY: number = 1.0) {
            this.x = x;
            this.y = y;
            this.skew = skew;
            this.rotation = rotation;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }

        public toString(): string {
            return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skew * 180.0 / Math.PI + " skewY:" + this.rotation * 180.0 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
        }
        /**
         * @private
         */
        public copyFrom(value: Transform): Transform {
            this.x = value.x;
            this.y = value.y;
            this.skew = value.skew;
            this.rotation = value.rotation;
            this.scaleX = value.scaleX;
            this.scaleY = value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public identity(): Transform {
            this.x = this.y = 0.0;
            this.skew = this.rotation = 0.0;
            this.scaleX = this.scaleY = 1.0;

            return this;
        }
        /**
         * @private
         */
        public add(value: Transform): Transform {
            this.x += value.x;
            this.y += value.y;
            this.skew += value.skew;
            this.rotation += value.rotation;
            this.scaleX *= value.scaleX;
            this.scaleY *= value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public minus(value: Transform): Transform {
            this.x -= value.x;
            this.y -= value.y;
            this.skew -= value.skew;
            this.rotation -= value.rotation;
            this.scaleX /= value.scaleX;
            this.scaleY /= value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public fromMatrix(matrix: Matrix): Transform {
            const backupScaleX = this.scaleX, backupScaleY = this.scaleY;
            const PI_Q = Transform.PI_Q;

            this.x = matrix.tx;
            this.y = matrix.ty;
            this.rotation = Math.atan(matrix.b / matrix.a);
            let skewX = Math.atan(-matrix.c / matrix.d);

            this.scaleX = (this.rotation > -PI_Q && this.rotation < PI_Q) ? matrix.a / Math.cos(this.rotation) : matrix.b / Math.sin(this.rotation);
            this.scaleY = (skewX > -PI_Q && skewX < PI_Q) ? matrix.d / Math.cos(skewX) : -matrix.c / Math.sin(skewX);

            if (backupScaleX >= 0.0 && this.scaleX < 0.0) {
                this.scaleX = -this.scaleX;
                this.rotation = this.rotation - Math.PI;
            }

            if (backupScaleY >= 0.0 && this.scaleY < 0.0) {
                this.scaleY = -this.scaleY;
                skewX = skewX - Math.PI;
            }

            this.skew = skewX - this.rotation;

            return this;
        }
        /**
         * @private
         */
        public toMatrix(matrix: Matrix): Transform {
            if (this.rotation === 0.0) {
                matrix.a = 1.0;
                matrix.b = 0.0;
            }
            else {
                matrix.a = Math.cos(this.rotation);
                matrix.b = Math.sin(this.rotation);
            }

            if (this.skew === 0.0) {
                matrix.c = -matrix.b;
                matrix.d = matrix.a;
            }
            else {
                matrix.c = -Math.sin(this.skew + this.rotation);
                matrix.d = Math.cos(this.skew + this.rotation);
            }

            if (this.scaleX !== 1.0) {
                matrix.a *= this.scaleX;
                matrix.b *= this.scaleX;
            }

            if (this.scaleY !== 1.0) {
                matrix.c *= this.scaleY;
                matrix.d *= this.scaleY;
            }

            matrix.tx = this.x;
            matrix.ty = this.y;

            return this;
        }
    }
}