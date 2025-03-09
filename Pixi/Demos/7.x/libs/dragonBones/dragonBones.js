"use strict";
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class DragonBones {
        constructor(eventManager) {
            this._clock = new dragonBones.WorldClock();
            this._events = [];
            this._objects = [];
            this._eventManager = null;
            this._eventManager = eventManager;
            console.info(`DragonBones: ${DragonBones.VERSION}\nWebsite: http://www.dragonbones.cn/\nSource and Demo: https://github.com/DragonBones/`);
        }
        advanceTime(passedTime) {
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
                    if (armature._armatureData !== null) { // May be armature disposed before advanceTime.
                        armature.eventDispatcher.dispatchDBEvent(eventObject.type, eventObject);
                        if (eventObject.type === dragonBones.EventObject.SOUND_EVENT) {
                            this._eventManager.dispatchDBEvent(eventObject.type, eventObject);
                        }
                    }
                    this.bufferObject(eventObject);
                }
                this._events.length = 0;
            }
        }
        bufferEvent(value) {
            if (this._events.indexOf(value) < 0) {
                this._events.push(value);
            }
        }
        bufferObject(object) {
            if (this._objects.indexOf(object) < 0) {
                this._objects.push(object);
            }
        }
        get clock() {
            return this._clock;
        }
        get eventManager() {
            return this._eventManager;
        }
    }
    DragonBones.VERSION = "6.0.001";
    DragonBones.yDown = true;
    DragonBones.debug = false;
    DragonBones.debugDraw = false;
    dragonBones.DragonBones = DragonBones;
})(dragonBones || (dragonBones = {}));
//
if (!console.warn) {
    console.warn = function () { };
}
if (!console.assert) {
    console.assert = function () { };
}
//
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
// Weixin can not support typescript extends.
var __extends = function (t, e) {
    function r() {
        this.constructor = t;
    }
    for (var i in e) {
        if (e.hasOwnProperty(i)) {
            t[i] = e[i];
        }
    }
    r.prototype = e.prototype, t.prototype = new r();
};
//
if (typeof global === "undefined" && typeof window !== "undefined") {
    var global = window;
}
if (typeof exports === "object" && typeof module === "object") {
    module.exports = dragonBones;
}
else if (typeof define === "function" && define["amd"]) {
    define(["dragonBones"], function () { return dragonBones; });
}
else if (typeof exports === "object") {
    exports = dragonBones;
}
else if (typeof global !== "undefined") {
    global.dragonBones = dragonBones;
}
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The BaseObject is the base class for all objects in the DragonBones framework.
     * All BaseObject instances are cached to the object pool to reduce the performance consumption of frequent requests for memory or memory recovery.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 基础对象，通常 DragonBones 的对象都继承自该类。
     * 所有基础对象的实例都会缓存到对象池，以减少频繁申请内存或内存回收的性能消耗。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    class BaseObject {
        constructor() {
            /**
             * - A unique identification number assigned to the object.
             * @version DragonBones 4.5
             * @language en_US
             */
            /**
             * - 分配给此实例的唯一标识号。
             * @version DragonBones 4.5
             * @language zh_CN
             */
            this.hashCode = BaseObject._hashCode++;
            this._isInPool = false;
        }
        static _returnObject(object) {
            const classType = String(object.constructor);
            const maxCount = classType in BaseObject._maxCountMap ? BaseObject._maxCountMap[classType] : BaseObject._defaultMaxCount;
            const pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];
            if (pool.length < maxCount) {
                if (!object._isInPool) {
                    object._isInPool = true;
                    pool.push(object);
                }
                else {
                    console.warn("The object is already in the pool.");
                }
            }
            else {
            }
        }
        static toString() {
            throw new Error();
        }
        /**
         * - Set the maximum cache count of the specify object pool.
         * @param objectConstructor - The specify class. (Set all object pools max cache count if not set)
         * @param maxCount - Max count.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 设置特定对象池的最大缓存数量。
         * @param objectConstructor - 特定的类。 (不设置则设置所有对象池的最大缓存数量)
         * @param maxCount - 最大缓存数量。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static setMaxCount(objectConstructor, maxCount) {
            if (maxCount < 0 || maxCount !== maxCount) { // isNaN
                maxCount = 0;
            }
            if (objectConstructor !== null) {
                const classType = String(objectConstructor);
                const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
                if (pool !== null && pool.length > maxCount) {
                    pool.length = maxCount;
                }
                BaseObject._maxCountMap[classType] = maxCount;
            }
            else {
                BaseObject._defaultMaxCount = maxCount;
                for (let classType in BaseObject._poolsMap) {
                    const pool = BaseObject._poolsMap[classType];
                    if (pool.length > maxCount) {
                        pool.length = maxCount;
                    }
                    if (classType in BaseObject._maxCountMap) {
                        BaseObject._maxCountMap[classType] = maxCount;
                    }
                }
            }
        }
        /**
         * - Clear the cached instances of a specify object pool.
         * @param objectConstructor - Specify class. (Clear all cached instances if not set)
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除特定对象池的缓存实例。
         * @param objectConstructor - 特定的类。 (不设置则清除所有缓存的实例)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static clearPool(objectConstructor = null) {
            if (objectConstructor !== null) {
                const classType = String(objectConstructor);
                const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
                if (pool !== null && pool.length > 0) {
                    pool.length = 0;
                }
            }
            else {
                for (let k in BaseObject._poolsMap) {
                    const pool = BaseObject._poolsMap[k];
                    pool.length = 0;
                }
            }
        }
        /**
         * - Get an instance of the specify class from object pool.
         * @param objectConstructor - The specify class.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从对象池中获取特定类的实例。
         * @param objectConstructor - 特定的类。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static borrowObject(objectConstructor) {
            const classType = String(objectConstructor);
            const pool = classType in BaseObject._poolsMap ? BaseObject._poolsMap[classType] : null;
            if (pool !== null && pool.length > 0) {
                const object = pool.pop();
                object._isInPool = false;
                return object;
            }
            const object = new objectConstructor();
            object._onClear();
            return object;
        }
        /**
         * - Clear the object and return it back to object pool。
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除该实例的所有数据并将其返还对象池。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        returnToPool() {
            this._onClear();
            BaseObject._returnObject(this);
        }
    }
    BaseObject._hashCode = 0;
    BaseObject._defaultMaxCount = 3000;
    BaseObject._maxCountMap = {};
    BaseObject._poolsMap = {};
    dragonBones.BaseObject = BaseObject;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - 2D Transform matrix.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 2D 转换矩阵。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Matrix {
        /**
         * @private
         */
        constructor(a = 1.0, b = 0.0, c = 0.0, d = 1.0, tx = 0.0, ty = 0.0) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        toString() {
            return "[object dragonBones.Matrix] a:" + this.a + " b:" + this.b + " c:" + this.c + " d:" + this.d + " tx:" + this.tx + " ty:" + this.ty;
        }
        /**
         * @private
         */
        copyFrom(value) {
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.d = value.d;
            this.tx = value.tx;
            this.ty = value.ty;
            return this;
        }
        /**
         * @private
         */
        copyFromArray(value, offset = 0) {
            this.a = value[offset];
            this.b = value[offset + 1];
            this.c = value[offset + 2];
            this.d = value[offset + 3];
            this.tx = value[offset + 4];
            this.ty = value[offset + 5];
            return this;
        }
        /**
         * - Convert to unit matrix.
         * The resulting matrix has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 转换为单位矩阵。
         * 该矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0、ty=0。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        identity() {
            this.a = this.d = 1.0;
            this.b = this.c = 0.0;
            this.tx = this.ty = 0.0;
            return this;
        }
        /**
         * - Multiplies the current matrix with another matrix.
         * @param value - The matrix that needs to be multiplied.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将当前矩阵与另一个矩阵相乘。
         * @param value - 需要相乘的矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        concat(value) {
            let aA = this.a * value.a;
            let bA = 0.0;
            let cA = 0.0;
            let dA = this.d * value.d;
            let txA = this.tx * value.a + value.tx;
            let tyA = this.ty * value.d + value.ty;
            if (this.b !== 0.0 || this.c !== 0.0) {
                aA += this.b * value.c;
                bA += this.b * value.d;
                cA += this.c * value.a;
                dA += this.c * value.b;
            }
            if (value.b !== 0.0 || value.c !== 0.0) {
                bA += this.a * value.b;
                cA += this.d * value.c;
                txA += this.ty * value.c;
                tyA += this.tx * value.b;
            }
            this.a = aA;
            this.b = bA;
            this.c = cA;
            this.d = dA;
            this.tx = txA;
            this.ty = tyA;
            return this;
        }
        /**
         * - Convert to inverse matrix.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 转换为逆矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invert() {
            let aA = this.a;
            let bA = this.b;
            let cA = this.c;
            let dA = this.d;
            const txA = this.tx;
            const tyA = this.ty;
            if (bA === 0.0 && cA === 0.0) {
                this.b = this.c = 0.0;
                if (aA === 0.0 || dA === 0.0) {
                    this.a = this.b = this.tx = this.ty = 0.0;
                }
                else {
                    aA = this.a = 1.0 / aA;
                    dA = this.d = 1.0 / dA;
                    this.tx = -aA * txA;
                    this.ty = -dA * tyA;
                }
                return this;
            }
            let determinant = aA * dA - bA * cA;
            if (determinant === 0.0) {
                this.a = this.d = 1.0;
                this.b = this.c = 0.0;
                this.tx = this.ty = 0.0;
                return this;
            }
            determinant = 1.0 / determinant;
            let k = this.a = dA * determinant;
            bA = this.b = -bA * determinant;
            cA = this.c = -cA * determinant;
            dA = this.d = aA * determinant;
            this.tx = -(k * txA + cA * tyA);
            this.ty = -(bA * txA + dA * tyA);
            return this;
        }
        /**
         * - Apply a matrix transformation to a specific point.
         * @param x - X coordinate.
         * @param y - Y coordinate.
         * @param result - The point after the transformation is applied.
         * @param delta - Whether to ignore tx, ty's conversion to point.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将矩阵转换应用于特定点。
         * @param x - 横坐标。
         * @param y - 纵坐标。
         * @param result - 应用转换之后的点。
         * @param delta - 是否忽略 tx，ty 对点的转换。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        transformPoint(x, y, result, delta = false) {
            result.x = this.a * x + this.c * y;
            result.y = this.b * x + this.d * y;
            if (!delta) {
                result.x += this.tx;
                result.y += this.ty;
            }
        }
        /**
         * @private
         */
        transformRectangle(rectangle, delta = false) {
            const a = this.a;
            const b = this.b;
            const c = this.c;
            const d = this.d;
            const tx = delta ? 0.0 : this.tx;
            const ty = delta ? 0.0 : this.ty;
            const x = rectangle.x;
            const y = rectangle.y;
            const xMax = x + rectangle.width;
            const yMax = y + rectangle.height;
            let x0 = a * x + c * y + tx;
            let y0 = b * x + d * y + ty;
            let x1 = a * xMax + c * y + tx;
            let y1 = b * xMax + d * y + ty;
            let x2 = a * xMax + c * yMax + tx;
            let y2 = b * xMax + d * yMax + ty;
            let x3 = a * x + c * yMax + tx;
            let y3 = b * x + d * yMax + ty;
            let tmp = 0.0;
            if (x0 > x1) {
                tmp = x0;
                x0 = x1;
                x1 = tmp;
            }
            if (x2 > x3) {
                tmp = x2;
                x2 = x3;
                x3 = tmp;
            }
            rectangle.x = Math.floor(x0 < x2 ? x0 : x2);
            rectangle.width = Math.ceil((x1 > x3 ? x1 : x3) - rectangle.x);
            if (y0 > y1) {
                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            if (y2 > y3) {
                tmp = y2;
                y2 = y3;
                y3 = tmp;
            }
            rectangle.y = Math.floor(y0 < y2 ? y0 : y2);
            rectangle.height = Math.ceil((y1 > y3 ? y1 : y3) - rectangle.y);
        }
    }
    dragonBones.Matrix = Matrix;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
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
    class Transform {
        /**
         * @private
         */
        constructor(x = 0.0, y = 0.0, skew = 0.0, rotation = 0.0, scaleX = 1.0, scaleY = 1.0) {
            this.x = x;
            this.y = y;
            this.skew = skew;
            this.rotation = rotation;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
        /**
         * @private
         */
        static normalizeRadian(value) {
            value = (value + Math.PI) % (Math.PI * 2.0);
            value += value > 0.0 ? -Math.PI : Math.PI;
            return value;
        }
        toString() {
            return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skew * 180.0 / Math.PI + " skewY:" + this.rotation * 180.0 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
        }
        /**
         * @private
         */
        copyFrom(value) {
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
        identity() {
            this.x = this.y = 0.0;
            this.skew = this.rotation = 0.0;
            this.scaleX = this.scaleY = 1.0;
            return this;
        }
        /**
         * @private
         */
        add(value) {
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
        minus(value) {
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
        fromMatrix(matrix) {
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
        toMatrix(matrix) {
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
    /**
     * @private
     */
    Transform.PI = Math.PI;
    /**
     * @private
     */
    Transform.PI_D = Math.PI * 2.0;
    /**
     * @private
     */
    Transform.PI_H = Math.PI / 2.0;
    /**
     * @private
     */
    Transform.PI_Q = Math.PI / 4.0;
    /**
     * @private
     */
    Transform.RAD_DEG = 180.0 / Math.PI;
    /**
     * @private
     */
    Transform.DEG_RAD = Math.PI / 180.0;
    dragonBones.Transform = Transform;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class ColorTransform {
        constructor(alphaMultiplier = 1.0, redMultiplier = 1.0, greenMultiplier = 1.0, blueMultiplier = 1.0, alphaOffset = 0, redOffset = 0, greenOffset = 0, blueOffset = 0) {
            this.alphaMultiplier = alphaMultiplier;
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaOffset = alphaOffset;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
        }
        copyFrom(value) {
            this.alphaMultiplier = value.alphaMultiplier;
            this.redMultiplier = value.redMultiplier;
            this.greenMultiplier = value.greenMultiplier;
            this.blueMultiplier = value.blueMultiplier;
            this.alphaOffset = value.alphaOffset;
            this.redOffset = value.redOffset;
            this.greenOffset = value.greenOffset;
            this.blueOffset = value.blueOffset;
        }
        identity() {
            this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1.0;
            this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
        }
    }
    dragonBones.ColorTransform = ColorTransform;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The Point object represents a location in a two-dimensional coordinate system.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Point 对象表示二维坐标系统中的某个位置。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Point {
        /**
         * - Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
         * @param x - The horizontal coordinate.
         * @param y - The vertical coordinate.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建一个 egret.Point 对象.若不传入任何参数，将会创建一个位于（0，0）位置的点。
         * @param x - 该对象的x属性值，默认为 0.0。
         * @param y - 该对象的y属性值，默认为 0.0。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(x = 0.0, y = 0.0) {
            this.x = x;
            this.y = y;
        }
        /**
         * @private
         */
        copyFrom(value) {
            this.x = value.x;
            this.y = value.y;
        }
        /**
         * @private
         */
        clear() {
            this.x = this.y = 0.0;
        }
    }
    dragonBones.Point = Point;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.<br/>
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。<br/>
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width
     * 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Rectangle {
        /**
         * @private
         */
        constructor(x = 0.0, y = 0.0, width = 0.0, height = 0.0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        /**
         * @private
         */
        copyFrom(value) {
            this.x = value.x;
            this.y = value.y;
            this.width = value.width;
            this.height = value.height;
        }
        /**
         * @private
         */
        clear() {
            this.x = this.y = 0.0;
            this.width = this.height = 0.0;
        }
    }
    dragonBones.Rectangle = Rectangle;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The user custom data.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 用户自定义数据。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    class UserData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * - The custom int numbers.
             * @version DragonBones 5.0
             * @language en_US
             */
            /**
             * - 自定义整数。
             * @version DragonBones 5.0
             * @language zh_CN
             */
            this.ints = [];
            /**
             * - The custom float numbers.
             * @version DragonBones 5.0
             * @language en_US
             */
            /**
             * - 自定义浮点数。
             * @version DragonBones 5.0
             * @language zh_CN
             */
            this.floats = [];
            /**
             * - The custom strings.
             * @version DragonBones 5.0
             * @language en_US
             */
            /**
             * - 自定义字符串。
             * @version DragonBones 5.0
             * @language zh_CN
             */
            this.strings = [];
        }
        static toString() {
            return "[class dragonBones.UserData]";
        }
        _onClear() {
            this.ints.length = 0;
            this.floats.length = 0;
            this.strings.length = 0;
        }
        /**
         * @internal
         */
        addInt(value) {
            this.ints.push(value);
        }
        /**
         * @internal
         */
        addFloat(value) {
            this.floats.push(value);
        }
        /**
         * @internal
         */
        addString(value) {
            this.strings.push(value);
        }
        /**
         * - Get the custom int number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getInt(index = 0) {
            return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
        }
        /**
         * - Get the custom float number.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getFloat(index = 0) {
            return index >= 0 && index < this.floats.length ? this.floats[index] : 0.0;
        }
        /**
         * - Get the custom string.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 获取自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getString(index = 0) {
            return index >= 0 && index < this.strings.length ? this.strings[index] : "";
        }
    }
    dragonBones.UserData = UserData;
    /**
     * @private
     */
    class ActionData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            this.data = null; //
        }
        static toString() {
            return "[class dragonBones.ActionData]";
        }
        _onClear() {
            if (this.data !== null) {
                this.data.returnToPool();
            }
            this.type = 0 /* Play */;
            this.name = "";
            this.bone = null;
            this.slot = null;
            this.data = null;
        }
    }
    dragonBones.ActionData = ActionData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The DragonBones data.
     * A DragonBones data contains multiple armature data.
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 龙骨数据。
     * 一个龙骨数据包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class DragonBonesData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @internal
             */
            this.frameIndices = [];
            /**
             * @internal
             */
            this.cachedFrames = [];
            /**
             * - All armature data names.
             * @version DragonBones 3.0
             * @language en_US
             */
            /**
             * - 所有的骨架数据名称。
             * @version DragonBones 3.0
             * @language zh_CN
             */
            this.armatureNames = [];
            /**
             * @private
             */
            this.armatures = {};
            /**
             * @private
             */
            this.userData = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.DragonBonesData]";
        }
        _onClear() {
            for (let k in this.armatures) {
                this.armatures[k].returnToPool();
                delete this.armatures[k];
            }
            if (this.userData !== null) {
                this.userData.returnToPool();
            }
            this.autoSearch = false;
            this.frameRate = 0;
            this.version = "";
            this.name = "";
            this.stage = null;
            this.frameIndices.length = 0;
            this.cachedFrames.length = 0;
            this.armatureNames.length = 0;
            //this.armatures.clear();
            this.binary = null; //
            this.intArray = null; //
            this.floatArray = null; //
            this.frameIntArray = null; //
            this.frameFloatArray = null; //
            this.frameArray = null; //
            this.timelineArray = null; //
            this.colorArray = null; //
            this.userData = null;
        }
        /**
         * @internal
         */
        addArmature(value) {
            if (value.name in this.armatures) {
                console.warn("Same armature: " + value.name);
                return;
            }
            value.parent = this;
            this.armatures[value.name] = value;
            this.armatureNames.push(value.name);
        }
        /**
         * - Get a specific armature data.
         * @param armatureName - The armature data name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的骨架数据。
         * @param armatureName - 骨架数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getArmature(armatureName) {
            return armatureName in this.armatures ? this.armatures[armatureName] : null;
        }
    }
    dragonBones.DragonBonesData = DragonBonesData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The armature data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨架数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class ArmatureData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.aabb = new dragonBones.Rectangle();
            /**
             * - The names of all the animation data.
             * @version DragonBones 3.0
             * @language en_US
             */
            /**
             * - 所有的动画数据名称。
             * @version DragonBones 3.0
             * @language zh_CN
             */
            this.animationNames = [];
            /**
             * @private
             */
            this.sortedBones = [];
            /**
             * @private
             */
            this.sortedSlots = [];
            /**
             * @private
             */
            this.defaultActions = [];
            /**
             * @private
             */
            this.actions = [];
            /**
             * @private
             */
            this.bones = {};
            /**
             * @private
             */
            this.slots = {};
            /**
             * @private
             */
            this.constraints = {};
            /**
             * @private
             */
            this.skins = {};
            /**
             * @private
             */
            this.animations = {};
            /**
             * @private
             */
            this.canvas = null; // Initial value.
            /**
             * @private
             */
            this.userData = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.ArmatureData]";
        }
        _onClear() {
            for (const action of this.defaultActions) {
                action.returnToPool();
            }
            for (const action of this.actions) {
                action.returnToPool();
            }
            for (let k in this.bones) {
                this.bones[k].returnToPool();
                delete this.bones[k];
            }
            for (let k in this.slots) {
                this.slots[k].returnToPool();
                delete this.slots[k];
            }
            for (let k in this.constraints) {
                this.constraints[k].returnToPool();
                delete this.constraints[k];
            }
            for (let k in this.skins) {
                this.skins[k].returnToPool();
                delete this.skins[k];
            }
            for (let k in this.animations) {
                this.animations[k].returnToPool();
                delete this.animations[k];
            }
            if (this.canvas !== null) {
                this.canvas.returnToPool();
            }
            if (this.userData !== null) {
                this.userData.returnToPool();
            }
            this.type = 0 /* Armature */;
            this.frameRate = 0;
            this.cacheFrameRate = 0;
            this.scale = 1.0;
            this.name = "";
            this.aabb.clear();
            this.animationNames.length = 0;
            this.sortedBones.length = 0;
            this.sortedSlots.length = 0;
            this.defaultActions.length = 0;
            this.actions.length = 0;
            // this.bones.clear();
            // this.slots.clear();
            // this.constraints.clear();
            // this.skins.clear();
            // this.animations.clear();
            this.defaultSkin = null;
            this.defaultAnimation = null;
            this.canvas = null;
            this.userData = null;
            this.parent = null; //
        }
        /**
         * @internal
         */
        sortBones() {
            const total = this.sortedBones.length;
            if (total <= 0) {
                return;
            }
            const sortHelper = this.sortedBones.concat();
            let index = 0;
            let count = 0;
            this.sortedBones.length = 0;
            while (count < total) {
                const bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this.sortedBones.indexOf(bone) >= 0) {
                    continue;
                }
                let flag = false;
                for (let k in this.constraints) {
                    const constraint = this.constraints[k];
                    if (constraint instanceof dragonBones.IKConstraintData && constraint.root === bone && this.sortedBones.indexOf(constraint.target) < 0) {
                        // Wait ik constraint.
                        flag = true;
                        break;
                    }
                    else if (constraint instanceof dragonBones.TransformConstraintData && constraint.bones.indexOf(bone) >= 0 && this.sortedBones.indexOf(constraint.target) < 0) {
                        // Wait transform constraint.
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    continue;
                }
                if (bone.parent !== null && this.sortedBones.indexOf(bone.parent) < 0) { // Wait parent.
                    continue;
                }
                this.sortedBones.push(bone);
                count++;
            }
        }
        /**
         * @internal
         */
        cacheFrames(frameRate) {
            if (this.cacheFrameRate > 0) { // TODO clear cache.
                return;
            }
            this.cacheFrameRate = frameRate;
            for (let k in this.animations) {
                this.animations[k].cacheFrames(this.cacheFrameRate);
            }
        }
        /**
         * @internal
         */
        setCacheFrame(globalTransformMatrix, transform) {
            const dataArray = this.parent.cachedFrames;
            let arrayOffset = dataArray.length;
            dataArray.length += 10;
            dataArray[arrayOffset] = globalTransformMatrix.a;
            dataArray[arrayOffset + 1] = globalTransformMatrix.b;
            dataArray[arrayOffset + 2] = globalTransformMatrix.c;
            dataArray[arrayOffset + 3] = globalTransformMatrix.d;
            dataArray[arrayOffset + 4] = globalTransformMatrix.tx;
            dataArray[arrayOffset + 5] = globalTransformMatrix.ty;
            dataArray[arrayOffset + 6] = transform.rotation;
            dataArray[arrayOffset + 7] = transform.skew;
            dataArray[arrayOffset + 8] = transform.scaleX;
            dataArray[arrayOffset + 9] = transform.scaleY;
            return arrayOffset;
        }
        /**
         * @internal
         */
        getCacheFrame(globalTransformMatrix, transform, arrayOffset) {
            const dataArray = this.parent.cachedFrames;
            globalTransformMatrix.a = dataArray[arrayOffset];
            globalTransformMatrix.b = dataArray[arrayOffset + 1];
            globalTransformMatrix.c = dataArray[arrayOffset + 2];
            globalTransformMatrix.d = dataArray[arrayOffset + 3];
            globalTransformMatrix.tx = dataArray[arrayOffset + 4];
            globalTransformMatrix.ty = dataArray[arrayOffset + 5];
            transform.rotation = dataArray[arrayOffset + 6];
            transform.skew = dataArray[arrayOffset + 7];
            transform.scaleX = dataArray[arrayOffset + 8];
            transform.scaleY = dataArray[arrayOffset + 9];
            transform.x = globalTransformMatrix.tx;
            transform.y = globalTransformMatrix.ty;
        }
        /**
         * @internal
         */
        addBone(value) {
            if (value.name in this.bones) {
                console.warn("Same bone: " + value.name);
                return;
            }
            this.bones[value.name] = value;
            this.sortedBones.push(value);
        }
        /**
         * @internal
         */
        addSlot(value) {
            if (value.name in this.slots) {
                console.warn("Same slot: " + value.name);
                return;
            }
            this.slots[value.name] = value;
            this.sortedSlots.push(value);
        }
        /**
         * @internal
         */
        addConstraint(value) {
            if (value.name in this.constraints) {
                console.warn("Same constraint: " + value.name);
                return;
            }
            this.constraints[value.name] = value;
        }
        /**
         * @internal
         */
        addSkin(value) {
            if (value.name in this.skins) {
                console.warn("Same skin: " + value.name);
                return;
            }
            value.parent = this;
            this.skins[value.name] = value;
            if (this.defaultSkin === null) {
                this.defaultSkin = value;
            }
            if (value.name === "default") {
                this.defaultSkin = value;
            }
        }
        /**
         * @internal
         */
        addAnimation(value) {
            if (value.name in this.animations) {
                console.warn("Same animation: " + value.name);
                return;
            }
            value.parent = this;
            this.animations[value.name] = value;
            this.animationNames.push(value.name);
            if (this.defaultAnimation === null) {
                this.defaultAnimation = value;
            }
        }
        /**
         * @internal
         */
        addAction(value, isDefault) {
            if (isDefault) {
                this.defaultActions.push(value);
            }
            else {
                this.actions.push(value);
            }
        }
        /**
         * - Get a specific done data.
         * @param boneName - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的骨骼数据。
         * @param boneName - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBone(boneName) {
            return boneName in this.bones ? this.bones[boneName] : null;
        }
        /**
         * - Get a specific slot data.
         * @param slotName - The slot name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的插槽数据。
         * @param slotName - 插槽名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlot(slotName) {
            return slotName in this.slots ? this.slots[slotName] : null;
        }
        /**
         * @private
         */
        getConstraint(constraintName) {
            return constraintName in this.constraints ? this.constraints[constraintName] : null;
        }
        /**
         * - Get a specific skin data.
         * @param skinName - The skin name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定皮肤数据。
         * @param skinName - 皮肤名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSkin(skinName) {
            return skinName in this.skins ? this.skins[skinName] : null;
        }
        /**
         * @private
         */
        getMesh(skinName, slotName, meshName) {
            const skin = this.getSkin(skinName);
            if (skin === null) {
                return null;
            }
            return skin.getDisplay(slotName, meshName);
        }
        /**
        * @private
        */
        getShape(skinName, slotName, shapeName) {
            const skin = this.getSkin(skinName);
            if (skin === null) {
                return null;
            }
            return skin.getDisplay(slotName, shapeName);
        }
        /**
         * - Get a specific animation data.
         * @param animationName - The animation animationName.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的动画数据。
         * @param animationName - 动画名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getAnimation(animationName) {
            return animationName in this.animations ? this.animations[animationName] : null;
        }
    }
    dragonBones.ArmatureData = ArmatureData;
    /**
     * - The bone data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class BoneData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.transform = new dragonBones.Transform();
            /**
             * @private
             */
            this.userData = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.BoneData]";
        }
        _onClear() {
            if (this.userData !== null) {
                this.userData.returnToPool();
            }
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.inheritReflection = false;
            this.type = 0 /* Bone */;
            this.length = 0.0;
            this.alpha = 1.0;
            this.name = "";
            this.transform.identity();
            this.userData = null;
            this.parent = null;
        }
    }
    dragonBones.BoneData = BoneData;
    /**
     * @internal
     */
    class SurfaceData extends BoneData {
        constructor() {
            super(...arguments);
            this.geometry = new dragonBones.GeometryData();
        }
        static toString() {
            return "[class dragonBones.SurfaceData]";
        }
        _onClear() {
            super._onClear();
            this.type = 1 /* Surface */;
            this.segmentX = 0;
            this.segmentY = 0;
            this.geometry.clear();
        }
    }
    dragonBones.SurfaceData = SurfaceData;
    /**
     * - The slot data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 插槽数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class SlotData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.color = null; // Initial value.
            /**
             * @private
             */
            this.userData = null; // Initial value.
        }
        /**
         * @internal
         */
        static createColor() {
            return new dragonBones.ColorTransform();
        }
        static toString() {
            return "[class dragonBones.SlotData]";
        }
        _onClear() {
            if (this.userData !== null) {
                this.userData.returnToPool();
            }
            this.blendMode = 0 /* Normal */;
            this.displayIndex = 0;
            this.zOrder = 0;
            this.zIndex = 0;
            this.alpha = 1.0;
            this.name = "";
            this.color = null; //
            this.userData = null;
            this.parent = null; //
        }
    }
    /**
     * @internal
     */
    SlotData.DEFAULT_COLOR = new dragonBones.ColorTransform();
    dragonBones.SlotData = SlotData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class ConstraintData extends dragonBones.BaseObject {
        _onClear() {
            this.order = 0;
            this.name = "";
            this.type = 0 /* IK */;
            this.target = null; //
            this.root = null; //
            this.bone = null;
        }
    }
    dragonBones.ConstraintData = ConstraintData;
    /**
     * @internal
     */
    class IKConstraintData extends ConstraintData {
        static toString() {
            return "[class dragonBones.IKConstraintData]";
        }
        _onClear() {
            super._onClear();
            this.scaleEnabled = false;
            this.bendPositive = false;
            this.weight = 1.0;
        }
    }
    dragonBones.IKConstraintData = IKConstraintData;
    /**
     * @internal
     */
    class TransformConstraintData extends ConstraintData {
        static toString() {
            return "[class dragonBones.TransformConstraintData]";
        }
        _onClear() {
            super._onClear();
            this.targetBone = null; //
            this.bones = [];
            this.offsetX = 0;
            this.offsetY = 0;
            this.offsetRotation = 0;
            this.offsetScaleX = 0;
            this.offsetScaleY = 0;
            this.rotateWeight = 0;
            this.scaleWeight = 0;
            this.translateWeight = 0;
            this.local = false;
            this.relative = false;
            this.type = 2 /* Transform */;
        }
    }
    dragonBones.TransformConstraintData = TransformConstraintData;
    /**
     * @internal
     */
    class PhysicsConstraintData extends ConstraintData {
        static toString() {
            return "[class dragonBones.PhysicsConstraintData]";
        }
        _onClear() {
            super._onClear();
            this.x = 0;
            this.y = 0;
            this.rotate = 0;
            this.scaleX = 0;
            this.shearX = 0;
            this.limit = 0;
            this.fps = 0;
            this.inertia = 0;
            this.strength = 0;
            this.damping = 0;
            this.mass = 0;
            this.wind = 0;
            this.gravity = 0;
            this.weight = 0;
            this.type = 3 /* Physics */;
        }
    }
    dragonBones.PhysicsConstraintData = PhysicsConstraintData;
    /**
     * @internal
     */
    class PathConstraintData extends ConstraintData {
        constructor() {
            super(...arguments);
            this.bones = [];
        }
        static toString() {
            return "[class dragonBones.PathConstraintData]";
        }
        _onClear() {
            super._onClear();
            this.pathSlot = null;
            this.pathDisplayData = null;
            this.bones.length = 0;
            this.positionMode = 0 /* Fixed */;
            this.spacingMode = 1 /* Fixed */;
            this.rotateMode = 1 /* Chain */;
            this.position = 0.0;
            this.spacing = 0.0;
            this.rotateOffset = 0.0;
            this.rotateWeight = 0.0;
            this.xWeight = 0.0;
            this.yWeight = 0.0;
            this.type = 1 /* Path */;
        }
        AddBone(value) {
            this.bones.push(value);
        }
    }
    dragonBones.PathConstraintData = PathConstraintData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class CanvasData extends dragonBones.BaseObject {
        static toString() {
            return "[class dragonBones.CanvasData]";
        }
        _onClear() {
            this.hasBackground = false;
            this.color = 0x000000;
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
    }
    dragonBones.CanvasData = CanvasData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The skin data, typically a armature data instance contains at least one skinData.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 皮肤数据，通常一个骨架数据至少包含一个皮肤数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class SkinData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.displays = {};
        }
        static toString() {
            return "[class dragonBones.SkinData]";
        }
        _onClear() {
            for (let k in this.displays) {
                const slotDisplays = this.displays[k];
                for (const display of slotDisplays) {
                    if (display !== null) {
                        display.returnToPool();
                    }
                }
                delete this.displays[k];
            }
            this.name = "";
            // this.displays.clear();
            this.parent = null; //
        }
        /**
         * @internal
         */
        addDisplay(slotName, value) {
            if (!(slotName in this.displays)) {
                this.displays[slotName] = [];
            }
            if (value !== null) {
                value.parent = this;
            }
            const slotDisplays = this.displays[slotName]; // TODO clear prev
            slotDisplays.push(value);
        }
        /**
         * @private
         */
        getDisplay(slotName, displayName) {
            const slotDisplays = this.getDisplays(slotName);
            if (slotDisplays !== null) {
                for (const display of slotDisplays) {
                    if (display !== null && display.name === displayName) {
                        return display;
                    }
                }
            }
            return null;
        }
        /**
         * @private
         */
        getDisplays(slotName) {
            if (!(slotName in this.displays)) {
                return null;
            }
            return this.displays[slotName];
        }
    }
    dragonBones.SkinData = SkinData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class GeometryData {
        constructor() {
            this.weight = null; // Initial value.
        }
        clear() {
            if (!this.isShared && this.weight !== null) {
                this.weight.returnToPool();
            }
            this.isShared = false;
            this.inheritDeform = false;
            this.offset = 0;
            this.data = null;
            this.weight = null;
        }
        shareFrom(value) {
            this.isShared = true;
            this.offset = value.offset;
            this.weight = value.weight;
        }
        get vertexCount() {
            const intArray = this.data.intArray;
            return intArray[this.offset + 0 /* GeometryVertexCount */];
        }
        get triangleCount() {
            const intArray = this.data.intArray;
            return intArray[this.offset + 1 /* GeometryTriangleCount */];
        }
    }
    dragonBones.GeometryData = GeometryData;
    /**
     * @private
     */
    class DisplayData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            this.transform = new dragonBones.Transform();
        }
        _onClear() {
            this.name = "";
            this.path = "";
            this.transform.identity();
            this.parent = null; //
        }
    }
    dragonBones.DisplayData = DisplayData;
    /**
     * @private
     */
    class ImageDisplayData extends DisplayData {
        constructor() {
            super(...arguments);
            this.pivot = new dragonBones.Point();
        }
        static toString() {
            return "[class dragonBones.ImageDisplayData]";
        }
        _onClear() {
            super._onClear();
            this.type = 0 /* Image */;
            this.pivot.clear();
            this.texture = null;
        }
    }
    dragonBones.ImageDisplayData = ImageDisplayData;
    /**
     * @private
     */
    class ArmatureDisplayData extends DisplayData {
        constructor() {
            super(...arguments);
            this.actions = [];
        }
        static toString() {
            return "[class dragonBones.ArmatureDisplayData]";
        }
        _onClear() {
            super._onClear();
            for (const action of this.actions) {
                action.returnToPool();
            }
            this.type = 1 /* Armature */;
            this.inheritAnimation = false;
            this.actions.length = 0;
            this.armature = null;
        }
        /**
         * @private
         */
        addAction(value) {
            this.actions.push(value);
        }
    }
    dragonBones.ArmatureDisplayData = ArmatureDisplayData;
    /**
     * @private
     */
    class MeshDisplayData extends DisplayData {
        constructor() {
            super(...arguments);
            this.geometry = new GeometryData();
        }
        static toString() {
            return "[class dragonBones.MeshDisplayData]";
        }
        _onClear() {
            super._onClear();
            this.type = 2 /* Mesh */;
            this.geometry.clear();
            this.texture = null;
        }
    }
    dragonBones.MeshDisplayData = MeshDisplayData;
    /**
     * @private
     */
    class BoundingBoxDisplayData extends DisplayData {
        constructor() {
            super(...arguments);
            this.boundingBox = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.BoundingBoxDisplayData]";
        }
        _onClear() {
            super._onClear();
            if (this.boundingBox !== null) {
                this.boundingBox.returnToPool();
            }
            this.type = 3 /* BoundingBox */;
            this.boundingBox = null;
        }
    }
    dragonBones.BoundingBoxDisplayData = BoundingBoxDisplayData;
    /**
     * @private
     */
    class PathDisplayData extends DisplayData {
        constructor() {
            super(...arguments);
            this.geometry = new GeometryData();
            this.curveLengths = [];
        }
        static toString() {
            return "[class dragonBones.PathDisplayData]";
        }
        _onClear() {
            super._onClear();
            this.type = 4 /* Path */;
            this.closed = false;
            this.constantSpeed = false;
            this.geometry.clear();
            this.curveLengths.length = 0;
        }
    }
    dragonBones.PathDisplayData = PathDisplayData;
    /**
     * @private
     */
    class WeightData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            this.bones = [];
        }
        static toString() {
            return "[class dragonBones.WeightData]";
        }
        _onClear() {
            this.count = 0;
            this.offset = 0;
            this.bones.length = 0;
        }
        addBone(value) {
            this.bones.push(value);
        }
    }
    dragonBones.WeightData = WeightData;
    /**
    * @private
    */
    class ShapeDisplayData extends DisplayData {
        constructor() {
            super(...arguments);
            this.shape = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.ShapeDisplayData]";
        }
        _onClear() {
            super._onClear();
            if (this.shape !== null) {
                this.shape.returnToPool();
            }
            this.type = 5 /* Shape */;
            this.shape = null;
        }
    }
    dragonBones.ShapeDisplayData = ShapeDisplayData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The shape data.
     * @version DragonBones 6.0
     * @language en_US
     */
    /**
     * - 形状数据。
     * @version DragonBones 6.0
     * @language zh_CN
     */
    class ShapeData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * - The shape vertices.
             * @version DragonBones 5.1
             * @language en_US
             */
            /**
             * - 形状顶点。组成这个形状的贝塞尔的点。每个贝塞尔点包含3个顶点，1个线上的点和两个控制点。[p.x, p.y, c0.x, c0.y, c1.x, c1.y]
             * @version DragonBones 5.1
             * @language zh_CN
             */
            this.vertices = [];
            this.paths = [];
        }
        static toString() {
            return "[class dragonBones.ShapeData]";
        }
        _onClear() {
            this.x = 0.0;
            this.y = 0.0;
            this.offset = 0;
            this.vertices.length = 0;
            this.paths.length = 0;
        }
    }
    dragonBones.ShapeData = ShapeData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The base class of bounding box data.
     * @see dragonBones.RectangleData
     * @see dragonBones.EllipseData
     * @see dragonBones.PolygonData
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 边界框数据基类。
     * @see dragonBones.RectangleData
     * @see dragonBones.EllipseData
     * @see dragonBones.PolygonData
     * @version DragonBones 5.0
     * @language zh_CN
     */
    class BoundingBoxData extends dragonBones.BaseObject {
        _onClear() {
            this.color = 0x000000;
            this.width = 0.0;
            this.height = 0.0;
        }
    }
    dragonBones.BoundingBoxData = BoundingBoxData;
    /**
     * - The rectangle bounding box data.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 矩形边界框数据。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class RectangleBoundingBoxData extends BoundingBoxData {
        static toString() {
            return "[class dragonBones.RectangleBoundingBoxData]";
        }
        /**
         * - Compute the bit code for a point (x, y) using the clip rectangle
         */
        static _computeOutCode(x, y, xMin, yMin, xMax, yMax) {
            let code = 0 /* InSide */; // initialised as being inside of [[clip window]]
            if (x < xMin) { // to the left of clip window
                code |= 1 /* Left */;
            }
            else if (x > xMax) { // to the right of clip window
                code |= 2 /* Right */;
            }
            if (y < yMin) { // below the clip window
                code |= 4 /* Top */;
            }
            else if (y > yMax) { // above the clip window
                code |= 8 /* Bottom */;
            }
            return code;
        }
        /**
         * @private
         */
        static rectangleIntersectsSegment(xA, yA, xB, yB, xMin, yMin, xMax, yMax, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            const inSideA = xA > xMin && xA < xMax && yA > yMin && yA < yMax;
            const inSideB = xB > xMin && xB < xMax && yB > yMin && yB < yMax;
            if (inSideA && inSideB) {
                return -1;
            }
            let intersectionCount = 0;
            let outcode0 = RectangleBoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
            let outcode1 = RectangleBoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
            while (true) {
                if ((outcode0 | outcode1) === 0) { // Bitwise OR is 0. Trivially accept and get out of loop
                    intersectionCount = 2;
                    break;
                }
                else if ((outcode0 & outcode1) !== 0) { // Bitwise AND is not 0. Trivially reject and get out of loop
                    break;
                }
                // failed both tests, so calculate the line segment to clip
                // from an outside point to an intersection with clip edge
                let x = 0.0;
                let y = 0.0;
                let normalRadian = 0.0;
                // At least one endpoint is outside the clip rectangle; pick it.
                const outcodeOut = outcode0 !== 0 ? outcode0 : outcode1;
                // Now find the intersection point;
                if ((outcodeOut & 4 /* Top */) !== 0) { // point is above the clip rectangle
                    x = xA + (xB - xA) * (yMin - yA) / (yB - yA);
                    y = yMin;
                    if (normalRadians !== null) {
                        normalRadian = -Math.PI * 0.5;
                    }
                }
                else if ((outcodeOut & 8 /* Bottom */) !== 0) { // point is below the clip rectangle
                    x = xA + (xB - xA) * (yMax - yA) / (yB - yA);
                    y = yMax;
                    if (normalRadians !== null) {
                        normalRadian = Math.PI * 0.5;
                    }
                }
                else if ((outcodeOut & 2 /* Right */) !== 0) { // point is to the right of clip rectangle
                    y = yA + (yB - yA) * (xMax - xA) / (xB - xA);
                    x = xMax;
                    if (normalRadians !== null) {
                        normalRadian = 0;
                    }
                }
                else if ((outcodeOut & 1 /* Left */) !== 0) { // point is to the left of clip rectangle
                    y = yA + (yB - yA) * (xMin - xA) / (xB - xA);
                    x = xMin;
                    if (normalRadians !== null) {
                        normalRadian = Math.PI;
                    }
                }
                // Now we move outside point to intersection point to clip
                // and get ready for next pass.
                if (outcodeOut === outcode0) {
                    xA = x;
                    yA = y;
                    outcode0 = RectangleBoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
                    if (normalRadians !== null) {
                        normalRadians.x = normalRadian;
                    }
                }
                else {
                    xB = x;
                    yB = y;
                    outcode1 = RectangleBoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
                    if (normalRadians !== null) {
                        normalRadians.y = normalRadian;
                    }
                }
            }
            if (intersectionCount) {
                if (inSideA) {
                    intersectionCount = 2; // 10
                    if (intersectionPointA !== null) {
                        intersectionPointA.x = xB;
                        intersectionPointA.y = yB;
                    }
                    if (intersectionPointB !== null) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = xB;
                    }
                    if (normalRadians !== null) {
                        normalRadians.x = normalRadians.y + Math.PI;
                    }
                }
                else if (inSideB) {
                    intersectionCount = 1; // 01
                    if (intersectionPointA !== null) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }
                    if (intersectionPointB !== null) {
                        intersectionPointB.x = xA;
                        intersectionPointB.y = yA;
                    }
                    if (normalRadians !== null) {
                        normalRadians.y = normalRadians.x + Math.PI;
                    }
                }
                else {
                    intersectionCount = 3; // 11
                    if (intersectionPointA !== null) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }
                    if (intersectionPointB !== null) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = yB;
                    }
                }
            }
            return intersectionCount;
        }
        _onClear() {
            super._onClear();
            this.type = 0 /* Rectangle */;
        }
        /**
         * @inheritDoc
         */
        containsPoint(pX, pY) {
            const widthH = this.width * 0.5;
            if (pX >= -widthH && pX <= widthH) {
                const heightH = this.height * 0.5;
                if (pY >= -heightH && pY <= heightH) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @inheritDoc
         */
        intersectsSegment(xA, yA, xB, yB, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            const widthH = this.width * 0.5;
            const heightH = this.height * 0.5;
            const intersectionCount = RectangleBoundingBoxData.rectangleIntersectsSegment(xA, yA, xB, yB, -widthH, -heightH, widthH, heightH, intersectionPointA, intersectionPointB, normalRadians);
            return intersectionCount;
        }
    }
    dragonBones.RectangleBoundingBoxData = RectangleBoundingBoxData;
    /**
     * - The ellipse bounding box data.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 椭圆边界框数据。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class EllipseBoundingBoxData extends BoundingBoxData {
        static toString() {
            return "[class dragonBones.EllipseData]";
        }
        /**
         * @private
         */
        static ellipseIntersectsSegment(xA, yA, xB, yB, xC, yC, widthH, heightH, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            const d = widthH / heightH;
            const dd = d * d;
            yA *= d;
            yB *= d;
            const dX = xB - xA;
            const dY = yB - yA;
            const lAB = Math.sqrt(dX * dX + dY * dY);
            const xD = dX / lAB;
            const yD = dY / lAB;
            const a = (xC - xA) * xD + (yC - yA) * yD;
            const aa = a * a;
            const ee = xA * xA + yA * yA;
            const rr = widthH * widthH;
            const dR = rr - ee + aa;
            let intersectionCount = 0;
            if (dR >= 0.0) {
                const dT = Math.sqrt(dR);
                const sA = a - dT;
                const sB = a + dT;
                const inSideA = sA < 0.0 ? -1 : (sA <= lAB ? 0 : 1);
                const inSideB = sB < 0.0 ? -1 : (sB <= lAB ? 0 : 1);
                const sideAB = inSideA * inSideB;
                if (sideAB < 0) {
                    return -1;
                }
                else if (sideAB === 0) {
                    if (inSideA === -1) {
                        intersectionCount = 2; // 10
                        xB = xA + sB * xD;
                        yB = (yA + sB * yD) / d;
                        if (intersectionPointA !== null) {
                            intersectionPointA.x = xB;
                            intersectionPointA.y = yB;
                        }
                        if (intersectionPointB !== null) {
                            intersectionPointB.x = xB;
                            intersectionPointB.y = yB;
                        }
                        if (normalRadians !== null) {
                            normalRadians.x = Math.atan2(yB / rr * dd, xB / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else if (inSideB === 1) {
                        intersectionCount = 1; // 01
                        xA = xA + sA * xD;
                        yA = (yA + sA * yD) / d;
                        if (intersectionPointA !== null) {
                            intersectionPointA.x = xA;
                            intersectionPointA.y = yA;
                        }
                        if (intersectionPointB !== null) {
                            intersectionPointB.x = xA;
                            intersectionPointB.y = yA;
                        }
                        if (normalRadians !== null) {
                            normalRadians.x = Math.atan2(yA / rr * dd, xA / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else {
                        intersectionCount = 3; // 11
                        if (intersectionPointA !== null) {
                            intersectionPointA.x = xA + sA * xD;
                            intersectionPointA.y = (yA + sA * yD) / d;
                            if (normalRadians !== null) {
                                normalRadians.x = Math.atan2(intersectionPointA.y / rr * dd, intersectionPointA.x / rr);
                            }
                        }
                        if (intersectionPointB !== null) {
                            intersectionPointB.x = xA + sB * xD;
                            intersectionPointB.y = (yA + sB * yD) / d;
                            if (normalRadians !== null) {
                                normalRadians.y = Math.atan2(intersectionPointB.y / rr * dd, intersectionPointB.x / rr);
                            }
                        }
                    }
                }
            }
            return intersectionCount;
        }
        _onClear() {
            super._onClear();
            this.type = 1 /* Ellipse */;
        }
        /**
         * @inheritDoc
         */
        containsPoint(pX, pY) {
            const widthH = this.width * 0.5;
            if (pX >= -widthH && pX <= widthH) {
                const heightH = this.height * 0.5;
                if (pY >= -heightH && pY <= heightH) {
                    pY *= widthH / heightH;
                    return Math.sqrt(pX * pX + pY * pY) <= widthH;
                }
            }
            return false;
        }
        /**
         * @inheritDoc
         */
        intersectsSegment(xA, yA, xB, yB, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            const intersectionCount = EllipseBoundingBoxData.ellipseIntersectsSegment(xA, yA, xB, yB, 0.0, 0.0, this.width * 0.5, this.height * 0.5, intersectionPointA, intersectionPointB, normalRadians);
            return intersectionCount;
        }
    }
    dragonBones.EllipseBoundingBoxData = EllipseBoundingBoxData;
    /**
     * - The polygon bounding box data.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 多边形边界框数据。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class PolygonBoundingBoxData extends BoundingBoxData {
        constructor() {
            super(...arguments);
            /**
             * - The polygon vertices.
             * @version DragonBones 5.1
             * @language en_US
             */
            /**
             * - 多边形顶点。
             * @version DragonBones 5.1
             * @language zh_CN
             */
            this.vertices = [];
        }
        static toString() {
            return "[class dragonBones.PolygonBoundingBoxData]";
        }
        /**
         * @private
         */
        static polygonIntersectsSegment(xA, yA, xB, yB, vertices, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            if (xA === xB) {
                xA = xB + 0.000001;
            }
            if (yA === yB) {
                yA = yB + 0.000001;
            }
            const count = vertices.length;
            const dXAB = xA - xB;
            const dYAB = yA - yB;
            const llAB = xA * yB - yA * xB;
            let intersectionCount = 0;
            let xC = vertices[count - 2];
            let yC = vertices[count - 1];
            let dMin = 0.0;
            let dMax = 0.0;
            let xMin = 0.0;
            let yMin = 0.0;
            let xMax = 0.0;
            let yMax = 0.0;
            for (let i = 0; i < count; i += 2) {
                const xD = vertices[i];
                const yD = vertices[i + 1];
                if (xC === xD) {
                    xC = xD + 0.0001;
                }
                if (yC === yD) {
                    yC = yD + 0.0001;
                }
                const dXCD = xC - xD;
                const dYCD = yC - yD;
                const llCD = xC * yD - yC * xD;
                const ll = dXAB * dYCD - dYAB * dXCD;
                const x = (llAB * dXCD - dXAB * llCD) / ll;
                if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB === 0.0 || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
                    const y = (llAB * dYCD - dYAB * llCD) / ll;
                    if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB === 0.0 || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                        if (intersectionPointB !== null) {
                            let d = x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }
                            if (intersectionCount === 0) {
                                dMin = d;
                                dMax = d;
                                xMin = x;
                                yMin = y;
                                xMax = x;
                                yMax = y;
                                if (normalRadians !== null) {
                                    normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    normalRadians.y = normalRadians.x;
                                }
                            }
                            else {
                                if (d < dMin) {
                                    dMin = d;
                                    xMin = x;
                                    yMin = y;
                                    if (normalRadians !== null) {
                                        normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                                if (d > dMax) {
                                    dMax = d;
                                    xMax = x;
                                    yMax = y;
                                    if (normalRadians !== null) {
                                        normalRadians.y = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                            }
                            intersectionCount++;
                        }
                        else {
                            xMin = x;
                            yMin = y;
                            xMax = x;
                            yMax = y;
                            intersectionCount++;
                            if (normalRadians !== null) {
                                normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                normalRadians.y = normalRadians.x;
                            }
                            break;
                        }
                    }
                }
                xC = xD;
                yC = yD;
            }
            if (intersectionCount === 1) {
                if (intersectionPointA !== null) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }
                if (intersectionPointB !== null) {
                    intersectionPointB.x = xMin;
                    intersectionPointB.y = yMin;
                }
                if (normalRadians !== null) {
                    normalRadians.y = normalRadians.x + Math.PI;
                }
            }
            else if (intersectionCount > 1) {
                intersectionCount++;
                if (intersectionPointA !== null) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }
                if (intersectionPointB !== null) {
                    intersectionPointB.x = xMax;
                    intersectionPointB.y = yMax;
                }
            }
            return intersectionCount;
        }
        _onClear() {
            super._onClear();
            this.type = 2 /* Polygon */;
            this.x = 0.0;
            this.y = 0.0;
            this.vertices.length = 0;
        }
        /**
         * @inheritDoc
         */
        containsPoint(pX, pY) {
            let isInSide = false;
            if (pX >= this.x && pX <= this.width && pY >= this.y && pY <= this.height) {
                for (let i = 0, l = this.vertices.length, iP = l - 2; i < l; i += 2) {
                    const yA = this.vertices[iP + 1];
                    const yB = this.vertices[i + 1];
                    if ((yB < pY && yA >= pY) || (yA < pY && yB >= pY)) {
                        const xA = this.vertices[iP];
                        const xB = this.vertices[i];
                        if ((pY - yB) * (xA - xB) / (yA - yB) + xB < pX) {
                            isInSide = !isInSide;
                        }
                    }
                    iP = i;
                }
            }
            return isInSide;
        }
        /**
         * @inheritDoc
         */
        intersectsSegment(xA, yA, xB, yB, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            let intersectionCount = 0;
            if (RectangleBoundingBoxData.rectangleIntersectsSegment(xA, yA, xB, yB, this.x, this.y, this.x + this.width, this.y + this.height, null, null, null) !== 0) {
                intersectionCount = PolygonBoundingBoxData.polygonIntersectsSegment(xA, yA, xB, yB, this.vertices, intersectionPointA, intersectionPointB, normalRadians);
            }
            return intersectionCount;
        }
    }
    dragonBones.PolygonBoundingBoxData = PolygonBoundingBoxData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The animation data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class AnimationData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.cachedFrames = [];
            /**
             * @private
             */
            this.boneTimelines = {};
            /**
             * @private
             */
            this.slotTimelines = {};
            /**
             * @private
             */
            this.constraintTimelines = {};
            /**
             * @private
             */
            this.animationTimelines = {};
            /**
             * @private
             */
            this.boneCachedFrameIndices = {};
            /**
             * @private
             */
            this.slotCachedFrameIndices = {};
            /**
             * @private
             */
            this.actionTimeline = null; // Initial value.
            /**
             * @private
             */
            this.zOrderTimeline = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.AnimationData]";
        }
        _onClear() {
            for (let k in this.boneTimelines) {
                for (const timeline of this.boneTimelines[k]) {
                    timeline.returnToPool();
                }
                delete this.boneTimelines[k];
            }
            for (let k in this.slotTimelines) {
                for (const timeline of this.slotTimelines[k]) {
                    timeline.returnToPool();
                }
                delete this.slotTimelines[k];
            }
            for (let k in this.constraintTimelines) {
                for (const timeline of this.constraintTimelines[k]) {
                    timeline.returnToPool();
                }
                delete this.constraintTimelines[k];
            }
            for (let k in this.animationTimelines) {
                for (const timeline of this.animationTimelines[k]) {
                    timeline.returnToPool();
                }
                delete this.animationTimelines[k];
            }
            for (let k in this.boneCachedFrameIndices) {
                delete this.boneCachedFrameIndices[k];
            }
            for (let k in this.slotCachedFrameIndices) {
                delete this.slotCachedFrameIndices[k];
            }
            if (this.actionTimeline !== null) {
                this.actionTimeline.returnToPool();
            }
            if (this.zOrderTimeline !== null) {
                this.zOrderTimeline.returnToPool();
            }
            this.frameIntOffset = 0;
            this.frameFloatOffset = 0;
            this.frameOffset = 0;
            this.blendType = 0 /* None */;
            this.frameCount = 0;
            this.playTimes = 0;
            this.duration = 0.0;
            this.scale = 1.0;
            this.fadeInTime = 0.0;
            this.cacheFrameRate = 0.0;
            this.name = "";
            this.cachedFrames.length = 0;
            // this.boneTimelines.clear();
            // this.slotTimelines.clear();
            // this.constraintTimelines.clear();
            // this.animationTimelines.clear();
            // this.boneCachedFrameIndices.clear();
            // this.slotCachedFrameIndices.clear();
            this.actionTimeline = null;
            this.zOrderTimeline = null;
            this.parent = null; //
        }
        /**
         * @internal
         */
        cacheFrames(frameRate) {
            if (this.cacheFrameRate > 0.0) { // TODO clear cache.
                return;
            }
            this.cacheFrameRate = Math.max(Math.ceil(frameRate * this.scale), 1.0);
            const cacheFrameCount = Math.ceil(this.cacheFrameRate * this.duration) + 1; // Cache one more frame.
            this.cachedFrames.length = cacheFrameCount;
            for (let i = 0, l = this.cacheFrames.length; i < l; ++i) {
                this.cachedFrames[i] = false;
            }
            for (const bone of this.parent.sortedBones) {
                const indices = new Array(cacheFrameCount);
                for (let i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }
                this.boneCachedFrameIndices[bone.name] = indices;
            }
            for (const slot of this.parent.sortedSlots) {
                const indices = new Array(cacheFrameCount);
                for (let i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }
                this.slotCachedFrameIndices[slot.name] = indices;
            }
        }
        /**
         * @private
         */
        addBoneTimeline(timelineName, timeline) {
            const timelines = timelineName in this.boneTimelines ? this.boneTimelines[timelineName] : (this.boneTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        addSlotTimeline(timelineName, timeline) {
            const timelines = timelineName in this.slotTimelines ? this.slotTimelines[timelineName] : (this.slotTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        addConstraintTimeline(timelineName, timeline) {
            const timelines = timelineName in this.constraintTimelines ? this.constraintTimelines[timelineName] : (this.constraintTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        addAnimationTimeline(timelineName, timeline) {
            const timelines = timelineName in this.animationTimelines ? this.animationTimelines[timelineName] : (this.animationTimelines[timelineName] = []);
            if (timelines.indexOf(timeline) < 0) {
                timelines.push(timeline);
            }
        }
        /**
         * @private
         */
        getBoneTimelines(timelineName) {
            return timelineName in this.boneTimelines ? this.boneTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        getSlotTimelines(timelineName) {
            return timelineName in this.slotTimelines ? this.slotTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        getConstraintTimelines(timelineName) {
            return timelineName in this.constraintTimelines ? this.constraintTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        getAnimationTimelines(timelineName) {
            return timelineName in this.animationTimelines ? this.animationTimelines[timelineName] : null;
        }
        /**
         * @private
         */
        getBoneCachedFrameIndices(boneName) {
            return boneName in this.boneCachedFrameIndices ? this.boneCachedFrameIndices[boneName] : null;
        }
        /**
         * @private
         */
        getSlotCachedFrameIndices(slotName) {
            return slotName in this.slotCachedFrameIndices ? this.slotCachedFrameIndices[slotName] : null;
        }
    }
    dragonBones.AnimationData = AnimationData;
    /**
     * @private
     */
    class TimelineData extends dragonBones.BaseObject {
        static toString() {
            return "[class dragonBones.TimelineData]";
        }
        _onClear() {
            this.type = 10 /* BoneAll */;
            this.offset = 0;
            this.frameIndicesOffset = -1;
        }
    }
    dragonBones.TimelineData = TimelineData;
    /**
     * @internal
     */
    class AnimationTimelineData extends TimelineData {
        static toString() {
            return "[class dragonBones.AnimationTimelineData]";
        }
        _onClear() {
            super._onClear();
            this.x = 0.0;
            this.y = 0.0;
        }
    }
    dragonBones.AnimationTimelineData = AnimationTimelineData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The animation config is used to describe all the information needed to play an animation state.
     * The API is still in the experimental phase and may encounter bugs or stability or compatibility issues when used.
     * @see dragonBones.AnimationState
     * @beta
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 动画配置用来描述播放一个动画状态所需要的全部信息。
     * 该 API 仍在实验阶段，使用时可能遭遇 bug 或稳定性或兼容性问题。
     * @see dragonBones.AnimationState
     * @beta
     * @version DragonBones 5.0
     * @language zh_CN
     */
    class AnimationConfig extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.boneMask = [];
        }
        static toString() {
            return "[class dragonBones.AnimationConfig]";
        }
        _onClear() {
            this.pauseFadeOut = true;
            this.fadeOutMode = 4 /* All */;
            this.fadeOutTweenType = 1 /* Line */;
            this.fadeOutTime = -1.0;
            this.actionEnabled = true;
            this.additive = false;
            this.displayControl = true;
            this.pauseFadeIn = true;
            this.resetToPose = true;
            this.fadeInTweenType = 1 /* Line */;
            this.playTimes = -1;
            this.layer = 0;
            this.position = 0.0;
            this.duration = -1.0;
            this.timeScale = -100.0;
            this.weight = 1.0;
            this.fadeInTime = -1.0;
            this.autoFadeOutTime = -1.0;
            this.name = "";
            this.animation = "";
            this.group = "";
            this.boneMask.length = 0;
        }
        /**
         * @private
         */
        clear() {
            this._onClear();
        }
        /**
         * @private
         */
        copyFrom(value) {
            this.pauseFadeOut = value.pauseFadeOut;
            this.fadeOutMode = value.fadeOutMode;
            this.autoFadeOutTime = value.autoFadeOutTime;
            this.fadeOutTweenType = value.fadeOutTweenType;
            this.actionEnabled = value.actionEnabled;
            this.additive = value.additive;
            this.displayControl = value.displayControl;
            this.pauseFadeIn = value.pauseFadeIn;
            this.resetToPose = value.resetToPose;
            this.playTimes = value.playTimes;
            this.layer = value.layer;
            this.position = value.position;
            this.duration = value.duration;
            this.timeScale = value.timeScale;
            this.fadeInTime = value.fadeInTime;
            this.fadeOutTime = value.fadeOutTime;
            this.fadeInTweenType = value.fadeInTweenType;
            this.weight = value.weight;
            this.name = value.name;
            this.animation = value.animation;
            this.group = value.group;
            this.boneMask.length = value.boneMask.length;
            for (let i = 0, l = this.boneMask.length; i < l; ++i) {
                this.boneMask[i] = value.boneMask[i];
            }
        }
    }
    dragonBones.AnimationConfig = AnimationConfig;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class TextureAtlasData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.textures = {};
        }
        _onClear() {
            for (let k in this.textures) {
                this.textures[k].returnToPool();
                delete this.textures[k];
            }
            this.autoSearch = false;
            this.width = 0;
            this.height = 0;
            this.scale = 1.0;
            // this.textures.clear();
            this.name = "";
            this.imagePath = "";
        }
        /**
         * @private
         */
        copyFrom(value) {
            this.autoSearch = value.autoSearch;
            this.scale = value.scale;
            this.width = value.width;
            this.height = value.height;
            this.name = value.name;
            this.imagePath = value.imagePath;
            for (let k in this.textures) {
                this.textures[k].returnToPool();
                delete this.textures[k];
            }
            // this.textures.clear();
            for (let k in value.textures) {
                const texture = this.createTexture();
                texture.copyFrom(value.textures[k]);
                this.textures[k] = texture;
            }
        }
        /**
         * @internal
         */
        addTexture(value) {
            if (value.name in this.textures) {
                console.warn("Same texture: " + value.name);
                return;
            }
            value.parent = this;
            this.textures[value.name] = value;
        }
        /**
         * @private
         */
        getTexture(textureName) {
            return textureName in this.textures ? this.textures[textureName] : null;
        }
    }
    dragonBones.TextureAtlasData = TextureAtlasData;
    /**
     * @private
     */
    class TextureData extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            this.region = new dragonBones.Rectangle();
            this.frame = null; // Initial value.
        }
        static createRectangle() {
            return new dragonBones.Rectangle();
        }
        _onClear() {
            this.rotated = false;
            this.name = "";
            this.region.clear();
            this.parent = null; //
            this.frame = null;
        }
        copyFrom(value) {
            this.rotated = value.rotated;
            this.name = value.name;
            this.region.copyFrom(value.region);
            this.parent = value.parent;
            if (this.frame === null && value.frame !== null) {
                this.frame = TextureData.createRectangle();
            }
            else if (this.frame !== null && value.frame === null) {
                this.frame = null;
            }
            if (this.frame !== null && value.frame !== null) {
                this.frame.copyFrom(value.frame);
            }
        }
    }
    dragonBones.TextureData = TextureData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones_1) {
    /**
     * - Armature is the core of the skeleton animation system.
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨架是骨骼动画系统的核心。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Armature extends dragonBones_1.BaseObject {
        constructor() {
            super(...arguments);
            this._bones = [];
            this._slots = [];
            /**
             * @internal
             */
            this._constraints = [];
            this._actions = [];
            this._animation = null; // Initial value.
            this._proxy = null; // Initial value.
            /**
             * @internal
             */
            this._replaceTextureAtlasData = null; // Initial value.
            this._clock = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.Armature]";
        }
        static _onSortSlots(a, b) {
            return a._zIndex * 1000 + a._zOrder > b._zIndex * 1000 + b._zOrder ? 1 : -1;
        }
        _onClear() {
            if (this._clock !== null) { // Remove clock first.
                this._clock.remove(this);
            }
            for (const bone of this._bones) {
                bone.returnToPool();
            }
            for (const slot of this._slots) {
                slot.returnToPool();
            }
            for (const constraint of this._constraints) {
                constraint.returnToPool();
            }
            for (const action of this._actions) {
                action.returnToPool();
            }
            if (this._animation !== null) {
                this._animation.returnToPool();
            }
            if (this._proxy !== null) {
                this._proxy.dbClear();
            }
            if (this._replaceTextureAtlasData !== null) {
                this._replaceTextureAtlasData.returnToPool();
            }
            this.inheritAnimation = true;
            this.userData = null;
            this._lockUpdate = false;
            this._slotsDirty = true;
            this._zOrderDirty = false;
            this._zIndexDirty = false;
            this._alphaDirty = true;
            this._flipX = false;
            this._flipY = false;
            this._cacheFrameIndex = -1;
            this._alpha = 1.0;
            this._globalAlpha = 1.0;
            this._bones.length = 0;
            this._slots.length = 0;
            this._constraints.length = 0;
            this._actions.length = 0;
            this._armatureData = null; //
            this._animation = null; //
            this._proxy = null; //
            this._display = null;
            this._replaceTextureAtlasData = null;
            this._replacedTexture = null;
            this._dragonBones = null; //
            this._clock = null;
            this._parent = null;
        }
        /**
         * @internal
         */
        _sortZOrder(slotIndices, offset) {
            const slotDatas = this._armatureData.sortedSlots;
            const isOriginal = slotIndices === null;
            if (this._zOrderDirty || !isOriginal) {
                for (let i = 0, l = slotDatas.length; i < l; ++i) {
                    const slotIndex = isOriginal ? i : slotIndices[offset + i];
                    if (slotIndex < 0 || slotIndex >= l) {
                        continue;
                    }
                    const slotData = slotDatas[slotIndex];
                    const slot = this.getSlot(slotData.name);
                    if (slot !== null) {
                        slot._setZOrder(i);
                    }
                }
                this._slotsDirty = true;
                this._zOrderDirty = !isOriginal;
            }
        }
        /**
         * @internal
         */
        _addBone(value) {
            if (this._bones.indexOf(value) < 0) {
                this._bones.push(value);
            }
        }
        /**
         * @internal
         */
        _addSlot(value) {
            if (this._slots.indexOf(value) < 0) {
                this._slots.push(value);
            }
        }
        /**
         * @internal
         */
        _addConstraint(value) {
            if (this._constraints.indexOf(value) < 0) {
                this._constraints.push(value);
            }
        }
        /**
         * @internal
         */
        _bufferAction(action, append) {
            if (this._actions.indexOf(action) < 0) {
                if (append) {
                    this._actions.push(action);
                }
                else {
                    this._actions.unshift(action);
                }
            }
        }
        /**
         * - Dispose the armature. (Return to the object pool)
         * @example
         * <pre>
         *     removeChild(armature.display);
         *     armature.dispose();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 释放骨架。 （回收到对象池）
         * @example
         * <pre>
         *     removeChild(armature.display);
         *     armature.dispose();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        dispose() {
            if (this._armatureData !== null) {
                this._lockUpdate = true;
                this._dragonBones.bufferObject(this);
            }
        }
        /**
         * @internal
         */
        init(armatureData, proxy, display, dragonBones) {
            if (this._armatureData !== null) {
                return;
            }
            this._armatureData = armatureData;
            this._animation = dragonBones_1.BaseObject.borrowObject(dragonBones_1.Animation);
            this._proxy = proxy;
            this._display = display;
            this._dragonBones = dragonBones;
            this._proxy.dbInit(this);
            this._animation.init(this);
            this._animation.animations = this._armatureData.animations;
        }
        /**
         * @inheritDoc
         */
        advanceTime(passedTime) {
            if (this._lockUpdate) {
                return;
            }
            this._lockUpdate = true;
            if (this._armatureData === null) {
                console.warn("The armature has been disposed.");
                return;
            }
            else if (this._armatureData.parent === null) {
                console.warn("The armature data has been disposed.\nPlease make sure dispose armature before call factory.clear().");
                return;
            }
            const prevCacheFrameIndex = this._cacheFrameIndex;
            // Update animation.
            this._animation.advanceTime(passedTime);
            // Sort slots.
            if (this._slotsDirty || this._zIndexDirty) {
                this._slots.sort(Armature._onSortSlots);
                if (this._zIndexDirty) {
                    for (let i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i]._setZOrder(i); // 
                    }
                }
                this._slotsDirty = false;
                this._zIndexDirty = false;
            }
            // Update alpha.
            if (this._alphaDirty) {
                this._alphaDirty = false;
                this._globalAlpha = this._alpha * (this._parent !== null ? this._parent._globalAlpha : 1.0);
                for (const bone of this._bones) {
                    bone._updateAlpha();
                }
                for (const slot of this._slots) {
                    slot._updateAlpha();
                }
            }
            // Update bones and slots.
            if (this._cacheFrameIndex < 0 || this._cacheFrameIndex !== prevCacheFrameIndex) {
                let i = 0, l = 0;
                for (i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].update(this._cacheFrameIndex);
                }
                for (i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i].update(this._cacheFrameIndex);
                }
            }
            // Do actions.
            if (this._actions.length > 0) {
                for (const action of this._actions) {
                    const actionData = action.actionData;
                    if (actionData !== null) {
                        if (actionData.type === 0 /* Play */) {
                            if (action.slot !== null) {
                                const childArmature = action.slot.childArmature;
                                if (childArmature !== null) {
                                    childArmature.animation.fadeIn(actionData.name);
                                }
                            }
                            else if (action.bone !== null) {
                                for (const slot of this.getSlots()) {
                                    if (slot.parent === action.bone) {
                                        const childArmature = slot.childArmature;
                                        if (childArmature !== null) {
                                            childArmature.animation.fadeIn(actionData.name);
                                        }
                                    }
                                }
                            }
                            else {
                                this._animation.fadeIn(actionData.name);
                            }
                        }
                    }
                    action.returnToPool();
                }
                this._actions.length = 0;
            }
            this._lockUpdate = false;
            this._proxy.dbUpdate();
        }
        /**
         * - Forces a specific bone or its owning slot to update the transform or display property in the next frame.
         * @param boneName - The bone name. (If not set, all bones will be update)
         * @param updateSlot - Whether to update the bone's slots. (Default: false)
         * @see dragonBones.Bone#invalidUpdate()
         * @see dragonBones.Slot#invalidUpdate()
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 强制特定骨骼或其拥有的插槽在下一帧更新变换或显示属性。
         * @param boneName - 骨骼名称。 （如果未设置，将更新所有骨骼）
         * @param updateSlot - 是否更新骨骼的插槽。 （默认: false）
         * @see dragonBones.Bone#invalidUpdate()
         * @see dragonBones.Slot#invalidUpdate()
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invalidUpdate(boneName = null, updateSlot = false) {
            if (boneName !== null && boneName.length > 0) {
                const bone = this.getBone(boneName);
                if (bone !== null) {
                    bone.invalidUpdate();
                    if (updateSlot) {
                        for (const slot of this._slots) {
                            if (slot.parent === bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            }
            else {
                for (const bone of this._bones) {
                    bone.invalidUpdate();
                }
                if (updateSlot) {
                    for (const slot of this._slots) {
                        slot.invalidUpdate();
                    }
                }
            }
        }
        /**
         * - Check whether a specific point is inside a custom bounding box in a slot.
         * The coordinate system of the point is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param x - The horizontal coordinate of the point.
         * @param y - The vertical coordinate of the point.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定点是否在某个插槽的自定义边界框内。
         * 点的坐标系为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param x - 点的水平坐标。
         * @param y - 点的垂直坐标。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        containsPoint(x, y) {
            for (const slot of this._slots) {
                if (slot.containsPoint(x, y)) {
                    return slot;
                }
            }
            return null;
        }
        /**
         * - Check whether a specific segment intersects a custom bounding box for a slot in the armature.
         * The coordinate system of the segment and intersection is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param xA - The horizontal coordinate of the beginning of the segment.
         * @param yA - The vertical coordinate of the beginning of the segment.
         * @param xB - The horizontal coordinate of the end point of the segment.
         * @param yB - The vertical coordinate of the end point of the segment.
         * @param intersectionPointA - The first intersection at which a line segment intersects the bounding box from the beginning to the end. (If not set, the intersection point will not calculated)
         * @param intersectionPointB - The first intersection at which a line segment intersects the bounding box from the end to the beginning. (If not set, the intersection point will not calculated)
         * @param normalRadians - The normal radians of the tangent of the intersection boundary box. [x: Normal radian of the first intersection tangent, y: Normal radian of the second intersection tangent] (If not set, the normal will not calculated)
         * @returns The slot of the first custom bounding box where the segment intersects from the start point to the end point.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定线段是否与骨架的某个插槽的自定义边界框相交。
         * 线段和交点的坐标系均为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param xA - 线段起点的水平坐标。
         * @param yA - 线段起点的垂直坐标。
         * @param xB - 线段终点的水平坐标。
         * @param yB - 线段终点的垂直坐标。
         * @param intersectionPointA - 线段从起点到终点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param intersectionPointB - 线段从终点到起点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param normalRadians - 交点边界框切线的法线弧度。 [x: 第一个交点切线的法线弧度, y: 第二个交点切线的法线弧度] （如果未设置，则不计算法线）
         * @returns 线段从起点到终点相交的第一个自定义边界框的插槽。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        intersectsSegment(xA, yA, xB, yB, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            const isV = xA === xB;
            let dMin = 0.0;
            let dMax = 0.0;
            let intXA = 0.0;
            let intYA = 0.0;
            let intXB = 0.0;
            let intYB = 0.0;
            let intAN = 0.0;
            let intBN = 0.0;
            let intSlotA = null;
            let intSlotB = null;
            for (const slot of this._slots) {
                const intersectionCount = slot.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
                if (intersectionCount > 0) {
                    if (intersectionPointA !== null || intersectionPointB !== null) {
                        if (intersectionPointA !== null) {
                            let d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }
                            if (intSlotA === null || d < dMin) {
                                dMin = d;
                                intXA = intersectionPointA.x;
                                intYA = intersectionPointA.y;
                                intSlotA = slot;
                                if (normalRadians) {
                                    intAN = normalRadians.x;
                                }
                            }
                        }
                        if (intersectionPointB !== null) {
                            let d = intersectionPointB.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }
                            if (intSlotB === null || d > dMax) {
                                dMax = d;
                                intXB = intersectionPointB.x;
                                intYB = intersectionPointB.y;
                                intSlotB = slot;
                                if (normalRadians !== null) {
                                    intBN = normalRadians.y;
                                }
                            }
                        }
                    }
                    else {
                        intSlotA = slot;
                        break;
                    }
                }
            }
            if (intSlotA !== null && intersectionPointA !== null) {
                intersectionPointA.x = intXA;
                intersectionPointA.y = intYA;
                if (normalRadians !== null) {
                    normalRadians.x = intAN;
                }
            }
            if (intSlotB !== null && intersectionPointB !== null) {
                intersectionPointB.x = intXB;
                intersectionPointB.y = intYB;
                if (normalRadians !== null) {
                    normalRadians.y = intBN;
                }
            }
            return intSlotA;
        }
        /**
         * - Get a specific bone.
         * @param name - The bone name.
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的骨骼。
         * @param name - 骨骼名称。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBone(name) {
            for (const bone of this._bones) {
                if (bone.name === name) {
                    return bone;
                }
            }
            return null;
        }
        /**
         * - Get a specific bone by the display.
         * @param display - The display object.
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 通过显示对象获取特定的骨骼。
         * @param display - 显示对象。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBoneByDisplay(display) {
            const slot = this.getSlotByDisplay(display);
            return slot !== null ? slot.parent : null;
        }
        /**
         * - Get a specific slot.
         * @param name - The slot name.
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的插槽。
         * @param name - 插槽名称。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlot(name) {
            for (const slot of this._slots) {
                if (slot.name === name) {
                    return slot;
                }
            }
            return null;
        }
        /**
         * - Get a specific slot by the display.
         * @param display - The display object.
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 通过显示对象获取特定的插槽。
         * @param display - 显示对象。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlotByDisplay(display) {
            if (display !== null) {
                for (const slot of this._slots) {
                    if (slot.display === display) {
                        return slot;
                    }
                }
            }
            return null;
        }
        /**
         * - Get all bones.
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取所有的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBones() {
            return this._bones;
        }
        /**
         * - Get all slots.
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlots() {
            return this._slots;
        }
        getPathConstraints() {
            if (this._constraints) {
                const pathConstraints = [];
                for (const constraint of this._constraints) {
                    if (constraint instanceof dragonBones_1.PathConstraint) {
                        pathConstraints.push(constraint);
                    }
                }
                return pathConstraints;
            }
            return [];
        }
        /**
         * - Whether to flip the armature horizontally.
         * @version DragonBones 5.5
         * @language en_US
         */
        /**
         * - 是否将骨架水平翻转。
         * @version DragonBones 5.5
         * @language zh_CN
         */
        get flipX() {
            return this._flipX;
        }
        set flipX(value) {
            if (this._flipX === value) {
                return;
            }
            this._flipX = value;
            this.invalidUpdate();
        }
        /**
         * - Whether to flip the armature vertically.
         * @version DragonBones 5.5
         * @language en_US
         */
        /**
         * - 是否将骨架垂直翻转。
         * @version DragonBones 5.5
         * @language zh_CN
         */
        get flipY() {
            return this._flipY;
        }
        set flipY(value) {
            if (this._flipY === value) {
                return;
            }
            this._flipY = value;
            this.invalidUpdate();
        }
        /**
         * - The animation cache frame rate, which turns on the animation cache when the set value is greater than 0.
         * There is a certain amount of memory overhead to improve performance by caching animation data in memory.
         * The frame rate should not be set too high, usually with the frame rate of the animation is similar and lower than the program running frame rate.
         * When the animation cache is turned on, some features will fail, such as the offset property of bone.
         * @example
         * <pre>
         *     armature.cacheFrameRate = 24;
         * </pre>
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如骨骼的 offset 属性等。
         * @example
         * <pre>
         *     armature.cacheFrameRate = 24;
         * </pre>
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get cacheFrameRate() {
            return this._armatureData.cacheFrameRate;
        }
        set cacheFrameRate(value) {
            if (this._armatureData.cacheFrameRate !== value) {
                this._armatureData.cacheFrames(value);
                // Set child armature frameRate.
                for (const slot of this._slots) {
                    const childArmature = slot.childArmature;
                    if (childArmature !== null) {
                        childArmature.cacheFrameRate = value;
                    }
                }
            }
        }
        /**
         * - The armature name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨架名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get name() {
            return this._armatureData.name;
        }
        /**
         * - The armature data.
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get armatureData() {
            return this._armatureData;
        }
        /**
         * - The animation player.
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 动画播放器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get animation() {
            return this._animation;
        }
        /**
         * @pivate
         */
        get proxy() {
            return this._proxy;
        }
        /**
         * - The EventDispatcher instance of the armature.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 该骨架的 EventDispatcher 实例。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get eventDispatcher() {
            return this._proxy;
        }
        /**
         * - The display container.
         * The display of the slot is displayed as the parent.
         * Depending on the rendering engine, the type will be different, usually the DisplayObjectContainer type.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 显示容器实例。
         * 插槽的显示对象都会以此显示容器为父级。
         * 根据渲染引擎的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get display() {
            return this._display;
        }
        /**
         * @private
         */
        get replacedTexture() {
            return this._replacedTexture;
        }
        set replacedTexture(value) {
            if (this._replacedTexture === value) {
                return;
            }
            if (this._replaceTextureAtlasData !== null) {
                this._replaceTextureAtlasData.returnToPool();
                this._replaceTextureAtlasData = null;
            }
            this._replacedTexture = value;
            for (const slot of this._slots) {
                slot.invalidUpdate();
                slot.update(-1);
            }
        }
        /**
         * @inheritDoc
         */
        get clock() {
            return this._clock;
        }
        set clock(value) {
            if (this._clock === value) {
                return;
            }
            if (this._clock !== null) {
                this._clock.remove(this);
            }
            this._clock = value;
            if (this._clock) {
                this._clock.add(this);
            }
            // Update childArmature clock.
            for (const slot of this._slots) {
                const childArmature = slot.childArmature;
                if (childArmature !== null) {
                    childArmature.clock = this._clock;
                }
            }
        }
        /**
         * - Get the parent slot which the armature belongs to.
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 该骨架所属的父插槽。
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get parent() {
            return this._parent;
        }
        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        getDisplay() {
            return this._display;
        }
    }
    dragonBones_1.Armature = Armature;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The base class of the transform object.
     * @see dragonBones.Transform
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 变换对象的基类。
     * @see dragonBones.Transform
     * @version DragonBones 4.5
     * @language zh_CN
     */
    class TransformObject extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            /**
             * - A matrix relative to the armature coordinate system.
             * @version DragonBones 3.0
             * @language en_US
             */
            /**
             * - 相对于骨架坐标系的矩阵。
             * @version DragonBones 3.0
             * @language zh_CN
             */
            this.globalTransformMatrix = new dragonBones.Matrix();
            /**
             * - A transform relative to the armature coordinate system.
             * @see #updateGlobalTransform()
             * @version DragonBones 3.0
             * @language en_US
             */
            /**
             * - 相对于骨架坐标系的变换。
             * @see #updateGlobalTransform()
             * @version DragonBones 3.0
             * @language zh_CN
             */
            this.global = new dragonBones.Transform();
            /**
             * - The offset transform relative to the armature or the parent bone coordinate system.
             * @see #dragonBones.Bone#invalidUpdate()
             * @version DragonBones 3.0
             * @language en_US
             */
            /**
             * - 相对于骨架或父骨骼坐标系的偏移变换。
             * @see #dragonBones.Bone#invalidUpdate()
             * @version DragonBones 3.0
             * @language zh_CN
             */
            this.offset = new dragonBones.Transform();
        }
        /**
         */
        _onClear() {
            this.globalTransformMatrix.identity();
            this.global.identity();
            this.offset.identity();
            this.origin = null;
            this.userData = null;
            this._globalDirty = false;
            this._alpha = 1.0;
            this._globalAlpha = 1.0;
            this._armature = null; //
        }
        /**
         * - For performance considerations, rotation or scale in the {@link #global} attribute of the bone or slot is not always properly accessible,
         * some engines do not rely on these attributes to update rendering, such as Egret.
         * The use of this method ensures that the access to the {@link #global} property is correctly rotation or scale.
         * @example
         * <pre>
         *     bone.updateGlobalTransform();
         *     let rotation = bone.global.rotation;
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 出于性能的考虑，骨骼或插槽的 {@link #global} 属性中的旋转或缩放并不总是正确可访问的，有些引擎并不依赖这些属性更新渲染，比如 Egret。
         * 使用此方法可以保证访问到 {@link #global} 属性中正确的旋转或缩放。
         * @example
         * <pre>
         *     bone.updateGlobalTransform();
         *     let rotation = bone.global.rotation;
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        updateGlobalTransform() {
            if (this._globalDirty) {
                this._globalDirty = false;
                this.global.fromMatrix(this.globalTransformMatrix);
            }
        }
        /**
         * - The armature to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所属的骨架。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get armature() {
            return this._armature;
        }
    }
    TransformObject._helpMatrix = new dragonBones.Matrix();
    TransformObject._helpTransform = new dragonBones.Transform();
    TransformObject._helpPoint = new dragonBones.Point();
    dragonBones.TransformObject = TransformObject;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - Bone is one of the most important logical units in the armature animation system,
     * and is responsible for the realization of translate, rotation, scaling in the animations.
     * A armature can contain multiple bones.
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移、旋转、缩放的实现。
     * 一个骨架中可以包含多个骨骼。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Bone extends dragonBones.TransformObject {
        constructor() {
            super(...arguments);
            /**
             * @internal
             */
            this.animationPose = new dragonBones.Transform();
        }
        static toString() {
            return "[class dragonBones.Bone]";
        }
        _onClear() {
            super._onClear();
            this.offsetMode = 1 /* Additive */;
            this.animationPose.identity();
            this._transformDirty = false;
            this._childrenTransformDirty = false;
            this._localDirty = true;
            this._hasConstraint = false;
            this._visible = true;
            this._cachedFrameIndex = -1;
            this._boneData = null; //
            this._parent = null; //
            this._cachedFrameIndices = null;
        }
        _updateGlobalTransformMatrix(isCache) {
            // For typescript.
            const boneData = this._boneData;
            const global = this.global;
            const globalTransformMatrix = this.globalTransformMatrix;
            const origin = this.origin;
            const offset = this.offset;
            const animationPose = this.animationPose;
            const parent = this._parent; //
            const flipX = this._armature.flipX;
            const flipY = this._armature.flipY === dragonBones.DragonBones.yDown;
            let inherit = parent !== null;
            let rotation = 0.0;
            if (this.offsetMode === 1 /* Additive */) {
                if (origin !== null) {
                    // global.copyFrom(this.origin).add(this.offset).add(this.animationPose);
                    global.x = origin.x + offset.x + animationPose.x;
                    global.scaleX = origin.scaleX * offset.scaleX * animationPose.scaleX;
                    global.scaleY = origin.scaleY * offset.scaleY * animationPose.scaleY;
                    if (dragonBones.DragonBones.yDown) {
                        global.y = origin.y + offset.y + animationPose.y;
                        global.skew = origin.skew + offset.skew + animationPose.skew;
                        global.rotation = origin.rotation + offset.rotation + animationPose.rotation;
                    }
                    else {
                        global.y = origin.y - offset.y + animationPose.y;
                        global.skew = origin.skew - offset.skew + animationPose.skew;
                        global.rotation = origin.rotation - offset.rotation + animationPose.rotation;
                    }
                }
                else {
                    global.copyFrom(offset);
                    if (!dragonBones.DragonBones.yDown) {
                        global.y = -global.y;
                        global.skew = -global.skew;
                        global.rotation = -global.rotation;
                    }
                    global.add(animationPose);
                }
            }
            else if (this.offsetMode === 0 /* None */) {
                if (origin !== null) {
                    global.copyFrom(origin).add(animationPose);
                }
                else {
                    global.copyFrom(animationPose);
                }
            }
            else {
                inherit = false;
                global.copyFrom(offset);
                if (!dragonBones.DragonBones.yDown) {
                    global.y = -global.y;
                    global.skew = -global.skew;
                    global.rotation = -global.rotation;
                }
            }
            if (inherit) {
                const isSurface = parent._boneData.type === 1 /* Surface */;
                const surfaceBone = isSurface ? parent._bone : null;
                const parentMatrix = isSurface ? parent._getGlobalTransformMatrix(global.x, global.y) : parent.globalTransformMatrix;
                if (boneData.inheritScale && (!isSurface || surfaceBone !== null)) {
                    if (isSurface) {
                        if (boneData.inheritRotation) {
                            global.rotation += parent.global.rotation;
                        }
                        surfaceBone.updateGlobalTransform();
                        global.scaleX *= surfaceBone.global.scaleX;
                        global.scaleY *= surfaceBone.global.scaleY;
                        parentMatrix.transformPoint(global.x, global.y, global);
                        global.toMatrix(globalTransformMatrix);
                        if (boneData.inheritTranslation) {
                            global.x = globalTransformMatrix.tx;
                            global.y = globalTransformMatrix.ty;
                        }
                        else {
                            globalTransformMatrix.tx = global.x;
                            globalTransformMatrix.ty = global.y;
                        }
                    }
                    else {
                        if (!boneData.inheritRotation) {
                            parent.updateGlobalTransform();
                            if (flipX && flipY) {
                                rotation = global.rotation - (parent.global.rotation + Math.PI);
                            }
                            else if (flipX) {
                                rotation = global.rotation + parent.global.rotation + Math.PI;
                            }
                            else if (flipY) {
                                rotation = global.rotation + parent.global.rotation;
                            }
                            else {
                                rotation = global.rotation - parent.global.rotation;
                            }
                            global.rotation = rotation;
                        }
                        global.toMatrix(globalTransformMatrix);
                        globalTransformMatrix.concat(parentMatrix);
                        if (boneData.inheritTranslation) {
                            global.x = globalTransformMatrix.tx;
                            global.y = globalTransformMatrix.ty;
                        }
                        else {
                            globalTransformMatrix.tx = global.x;
                            globalTransformMatrix.ty = global.y;
                        }
                        if (isCache) {
                            global.fromMatrix(globalTransformMatrix);
                        }
                        else {
                            this._globalDirty = true;
                        }
                    }
                }
                else {
                    if (boneData.inheritTranslation) {
                        const x = global.x;
                        const y = global.y;
                        global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        global.y = parentMatrix.b * x + parentMatrix.d * y + parentMatrix.ty;
                    }
                    else {
                        if (flipX) {
                            global.x = -global.x;
                        }
                        if (flipY) {
                            global.y = -global.y;
                        }
                    }
                    if (boneData.inheritRotation) {
                        parent.updateGlobalTransform();
                        if (parent.global.scaleX < 0.0) {
                            rotation = global.rotation + parent.global.rotation + Math.PI;
                        }
                        else {
                            rotation = global.rotation + parent.global.rotation;
                        }
                        if (parentMatrix.a * parentMatrix.d - parentMatrix.b * parentMatrix.c < 0.0) {
                            rotation -= global.rotation * 2.0;
                            if (flipX !== flipY || boneData.inheritReflection) {
                                global.skew += Math.PI;
                            }
                            if (!dragonBones.DragonBones.yDown) {
                                global.skew = -global.skew;
                            }
                        }
                        global.rotation = rotation;
                    }
                    else if (flipX || flipY) {
                        if (flipX && flipY) {
                            rotation = global.rotation + Math.PI;
                        }
                        else {
                            if (flipX) {
                                rotation = Math.PI - global.rotation;
                            }
                            else {
                                rotation = -global.rotation;
                            }
                            global.skew += Math.PI;
                        }
                        global.rotation = rotation;
                    }
                    global.toMatrix(globalTransformMatrix);
                }
            }
            else {
                if (flipX || flipY) {
                    if (flipX) {
                        global.x = -global.x;
                    }
                    if (flipY) {
                        global.y = -global.y;
                    }
                    if (flipX && flipY) {
                        rotation = global.rotation + Math.PI;
                    }
                    else {
                        if (flipX) {
                            rotation = Math.PI - global.rotation;
                        }
                        else {
                            rotation = -global.rotation;
                        }
                        global.skew += Math.PI;
                    }
                    global.rotation = rotation;
                }
                global.toMatrix(globalTransformMatrix);
            }
            if (this._transformConstraint) {
                this._transformConstraint._dirty = true;
            }
            if (this._targetTransformConstraint) {
                this._targetTransformConstraint._dirty = true;
            }
            if (this._physicsConstraint) {
                this._physicsConstraint._sleeping = false;
            }
        }
        /**
         * @internal
         */
        _updateAlpha() {
            if (this._parent !== null) {
                this._globalAlpha = this._alpha * this._parent._globalAlpha;
            }
            else {
                this._globalAlpha = this._alpha * this._armature._globalAlpha;
            }
        }
        /**
         * @internal
         */
        init(boneData, armatureValue) {
            if (this._boneData !== null) {
                return;
            }
            this._boneData = boneData;
            this._armature = armatureValue;
            this._alpha = this._boneData.alpha;
            if (this._boneData.parent !== null) {
                this._parent = this._armature.getBone(this._boneData.parent.name);
            }
            this._armature._addBone(this);
            //
            this.origin = this._boneData.transform;
        }
        /**
         * @internal
         */
        update(cacheFrameIndex) {
            if (this._transformConstraint && this._transformConstraint._dirty) {
                this._transformDirty = true;
            }
            if (this._physicsConstraint && !this._physicsConstraint._sleeping) {
                this._transformDirty = true;
            }
            if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else {
                    if (this._hasConstraint) { // Update constraints.
                        for (const constraint of this._armature._constraints) {
                            if (constraint._root === this) {
                                constraint.update();
                            }
                        }
                    }
                    if (this._transformDirty ||
                        (this._parent !== null && this._parent._childrenTransformDirty)) { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                    else if (this._cachedFrameIndex >= 0) { // Same cache, but not set index yet.
                        this._transformDirty = false;
                        this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                    }
                    else { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                }
            }
            else {
                if (this._hasConstraint) { // Update constraints.
                    for (const constraint of this._armature._constraints) {
                        if (constraint._root === this) {
                            constraint.update();
                        }
                    }
                }
                if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) { // Dirty.
                    cacheFrameIndex = -1;
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
            }
            if (this._transformDirty) {
                this._transformDirty = false;
                this._childrenTransformDirty = true;
                //
                if (this._cachedFrameIndex < 0) {
                    const isCache = cacheFrameIndex >= 0;
                    if (this._localDirty) {
                        this._updateGlobalTransformMatrix(isCache);
                    }
                    if (isCache && this._cachedFrameIndices !== null) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }
                //
            }
            else if (this._childrenTransformDirty) {
                this._childrenTransformDirty = false;
            }
            if (this._transformConstraint) {
                this._transformConstraint.update();
            }
            if (this._physicsConstraint && !this._physicsConstraint._sleeping) {
                this._physicsConstraint.update();
            }
            this._localDirty = true;
        }
        /**
         * @internal
         */
        updateByConstraint() {
            if (this._localDirty) {
                this._localDirty = false;
                if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) {
                    this._updateGlobalTransformMatrix(true);
                }
                this._transformDirty = true;
            }
        }
        /**
         * @internal
         */
        forceUpdateTransform() {
            this._updateGlobalTransformMatrix(true);
        }
        /**
         * - Forces the bone to update the transform in the next frame.
         * When the bone is not animated or its animation state is finished, the bone will not continue to update,
         * and when the skeleton must be updated for some reason, the method needs to be called explicitly.
         * @example
         * <pre>
         *     let bone = armature.getBone("arm");
         *     bone.offset.scaleX = 2.0;
         *     bone.invalidUpdate();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 强制骨骼在下一帧更新变换。
         * 当该骨骼没有动画状态或其动画状态播放完成时，骨骼将不在继续更新，而此时由于某些原因必须更新骨骼时，则需要显式调用该方法。
         * @example
         * <pre>
         *     let bone = armature.getBone("arm");
         *     bone.offset.scaleX = 2.0;
         *     bone.invalidUpdate();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invalidUpdate() {
            this._transformDirty = true;
        }
        /**
         * - Check whether the bone contains a specific bone.
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查该骨骼是否包含特定的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        contains(value) {
            if (value === this) {
                return false;
            }
            let ancestor = value;
            while (ancestor !== this && ancestor !== null) {
                ancestor = ancestor.parent;
            }
            return ancestor === this;
        }
        /**
         * - The bone data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 骨骼数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get boneData() {
            return this._boneData;
        }
        /**
         * - The visible of all slots in the bone.
         * @default true
         * @see dragonBones.Slot#visible
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot#visible
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get visible() {
            return this._visible;
        }
        set visible(value) {
            if (this._visible === value) {
                return;
            }
            this._visible = value;
            for (const slot of this._armature.getSlots()) {
                if (slot.parent === this) {
                    slot._updateVisible();
                }
            }
        }
        /**
         * - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get name() {
            return this._boneData.name;
        }
        /**
         * - The parent bone to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所属的父骨骼。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get parent() {
            return this._parent;
        }
    }
    dragonBones.Bone = Bone;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     */
    class Surface extends dragonBones.Bone {
        constructor() {
            super(...arguments);
            this._vertices = [];
            this._deformVertices = [];
            /**
             * - x1, y1, x2, y2, x3, y3, x4, y4, d1X, d1Y, d2X, d2Y
             */
            this._hullCache = [];
            /**
             * - Inside [flag, a, b, c, d, tx, ty], Outside [flag, a, b, c, d, tx, ty]
             */
            this._matrixCahce = [];
        }
        static toString() {
            return "[class dragonBones.Surface]";
        }
        _onClear() {
            super._onClear();
            this._dX = 0.0;
            this._dY = 0.0;
            this._k = 0.0;
            this._kX = 0.0;
            this._kY = 0.0;
            this._vertices.length = 0;
            this._deformVertices.length = 0;
            this._matrixCahce.length = 0;
            this._hullCache.length = 0;
            this._bone = null;
        }
        _getAffineTransform(x, y, lX, lY, aX, aY, bX, bY, cX, cY, transform, matrix, isDown) {
            const dabX = bX - aX;
            const dabY = bY - aY;
            const dacX = cX - aX;
            const dacY = cY - aY;
            transform.rotation = Math.atan2(dabY, dabX);
            transform.skew = Math.atan2(dacY, dacX) - Math.PI * 0.5 - transform.rotation;
            if (isDown) {
                transform.rotation += Math.PI;
            }
            transform.scaleX = Math.sqrt(dabX * dabX + dabY * dabY) / lX;
            transform.scaleY = Math.sqrt(dacX * dacX + dacY * dacY) / lY;
            transform.toMatrix(matrix);
            transform.x = matrix.tx = aX - (matrix.a * x + matrix.c * y);
            transform.y = matrix.ty = aY - (matrix.b * x + matrix.d * y);
        }
        _updateVertices() {
            const data = this._armature.armatureData.parent;
            const geometry = this._boneData.geometry;
            const intArray = data.intArray;
            const floatArray = data.floatArray;
            const vertexCount = intArray[geometry.offset + 0 /* GeometryVertexCount */];
            const verticesOffset = intArray[geometry.offset + 2 /* GeometryFloatOffset */];
            const vertices = this._vertices;
            const animationVertices = this._deformVertices;
            if (this._parent !== null) {
                if (this._parent._boneData.type === 1 /* Surface */) {
                    for (let i = 0, l = vertexCount; i < l; ++i) {
                        const iD = i * 2;
                        const x = floatArray[verticesOffset + iD] + animationVertices[iD];
                        const y = floatArray[verticesOffset + iD + 1] + animationVertices[iD + 1];
                        const matrix = this._parent._getGlobalTransformMatrix(x, y);
                        //
                        vertices[iD] = matrix.a * x + matrix.c * y + matrix.tx;
                        vertices[iD + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                    }
                }
                else {
                    const parentMatrix = this._parent.globalTransformMatrix;
                    for (let i = 0, l = vertexCount; i < l; ++i) {
                        const iD = i * 2;
                        const x = floatArray[verticesOffset + iD] + animationVertices[iD];
                        const y = floatArray[verticesOffset + iD + 1] + animationVertices[iD + 1];
                        //
                        vertices[iD] = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        vertices[iD + 1] = parentMatrix.b * x + parentMatrix.d * y + parentMatrix.ty;
                    }
                }
            }
            else {
                for (let i = 0, l = vertexCount; i < l; ++i) {
                    const iD = i * 2;
                    vertices[iD] = floatArray[verticesOffset + iD] + animationVertices[iD];
                    vertices[iD + 1] = floatArray[verticesOffset + iD + 1] + animationVertices[iD + 1];
                }
            }
        }
        _updateGlobalTransformMatrix(isCache) {
            // tslint:disable-next-line:no-unused-expression
            isCache;
            const segmentXD = this._boneData.segmentX * 2;
            const lastIndex = this._vertices.length - 2;
            const lA = 200.0;
            //
            const raX = this._vertices[0];
            const raY = this._vertices[1];
            const rbX = this._vertices[segmentXD];
            const rbY = this._vertices[segmentXD + 1];
            const rcX = this._vertices[lastIndex];
            const rcY = this._vertices[lastIndex + 1];
            const rdX = this._vertices[lastIndex - segmentXD];
            const rdY = this._vertices[lastIndex - segmentXD + 1];
            //
            const dacX = raX + (rcX - raX) * 0.5;
            const dacY = raY + (rcY - raY) * 0.5;
            const dbdX = rbX + (rdX - rbX) * 0.5;
            const dbdY = rbY + (rdY - rbY) * 0.5;
            const aX = dacX + (dbdX - dacX) * 0.5;
            const aY = dacY + (dbdY - dacY) * 0.5;
            const bX = rbX + (rcX - rbX) * 0.5;
            const bY = rbY + (rcY - rbY) * 0.5;
            const cX = rdX + (rcX - rdX) * 0.5;
            const cY = rdY + (rcY - rdY) * 0.5;
            // TODO interpolation
            this._getAffineTransform(0.0, 0.0, lA, lA, aX, aY, bX, bY, cX, cY, this.global, this.globalTransformMatrix, false);
            this._globalDirty = false;
        }
        _getGlobalTransformMatrix(x, y) {
            const lA = 200.0;
            const lB = 1000.0;
            if (x < -lB || lB < x || y < -lB || lB < y) {
                return this.globalTransformMatrix;
            }
            let isDown = false;
            const surfaceData = this._boneData;
            const segmentX = surfaceData.segmentX;
            const segmentY = surfaceData.segmentY;
            const segmentXD = surfaceData.segmentX * 2;
            const dX = this._dX;
            const dY = this._dY;
            const indexX = Math.floor((x + lA) / dX); // -1 ~ segmentX - 1
            const indexY = Math.floor((y + lA) / dY); // -1 ~ segmentY - 1
            let matrixIndex = 0;
            let pX = indexX * dX - lA;
            let pY = indexY * dY - lA;
            //
            const matrices = this._matrixCahce;
            const helpMatrix = Surface._helpMatrix;
            if (x < -lA) {
                if (y < -lA || y >= lA) { // Out.
                    return this.globalTransformMatrix;
                }
                // Left.
                isDown = y > this._kX * (x + lA) + pY;
                matrixIndex = ((segmentX * segmentY + segmentX + segmentY + segmentY + indexY) * 2 + (isDown ? 1 : 0)) * 7;
                if (matrices[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = indexY * (segmentXD + 2);
                    const ddX = this._hullCache[4];
                    const ddY = this._hullCache[5];
                    const sX = this._hullCache[2] - (segmentY - indexY) * ddX;
                    const sY = this._hullCache[3] - (segmentY - indexY) * ddY;
                    const vertices = this._vertices;
                    if (isDown) {
                        this._getAffineTransform(-lA, pY + dY, lB - lA, dY, vertices[vertexIndex + segmentXD + 2], vertices[vertexIndex + segmentXD + 3], sX + ddX, sY + ddY, vertices[vertexIndex], vertices[vertexIndex + 1], Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(-lB, pY, lB - lA, dY, sX, sY, vertices[vertexIndex], vertices[vertexIndex + 1], sX + ddX, sY + ddY, Surface._helpTransform, helpMatrix, false);
                    }
                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else if (x >= lA) {
                if (y < -lA || y >= lA) { // Out.
                    return this.globalTransformMatrix;
                }
                // Right.
                isDown = y > this._kX * (x - lB) + pY;
                matrixIndex = ((segmentX * segmentY + segmentX + indexY) * 2 + (isDown ? 1 : 0)) * 7;
                if (matrices[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = (indexY + 1) * (segmentXD + 2) - 2;
                    const ddX = this._hullCache[4];
                    const ddY = this._hullCache[5];
                    const sX = this._hullCache[0] + indexY * ddX;
                    const sY = this._hullCache[1] + indexY * ddY;
                    const vertices = this._vertices;
                    if (isDown) {
                        this._getAffineTransform(lB, pY + dY, lB - lA, dY, sX + ddX, sY + ddY, vertices[vertexIndex + segmentXD + 2], vertices[vertexIndex + segmentXD + 3], sX, sY, Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(lA, pY, lB - lA, dY, vertices[vertexIndex], vertices[vertexIndex + 1], sX, sY, vertices[vertexIndex + segmentXD + 2], vertices[vertexIndex + segmentXD + 3], Surface._helpTransform, helpMatrix, false);
                    }
                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else if (y < -lA) {
                if (x < -lA || x >= lA) { // Out.
                    return this.globalTransformMatrix;
                }
                // Up.
                isDown = y > this._kY * (x - pX - dX) - lB;
                matrixIndex = ((segmentX * segmentY + indexX) * 2 + (isDown ? 1 : 0)) * 7;
                if (matrices[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = indexX * 2;
                    const ddX = this._hullCache[10];
                    const ddY = this._hullCache[11];
                    const sX = this._hullCache[8] + indexX * ddX;
                    const sY = this._hullCache[9] + indexX * ddY;
                    const vertices = this._vertices;
                    if (isDown) {
                        this._getAffineTransform(pX + dX, -lA, dX, lB - lA, vertices[vertexIndex + 2], vertices[vertexIndex + 3], vertices[vertexIndex], vertices[vertexIndex + 1], sX + ddX, sY + ddY, Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(pX, -lB, dX, lB - lA, sX, sY, sX + ddX, sY + ddY, vertices[vertexIndex], vertices[vertexIndex + 1], Surface._helpTransform, helpMatrix, false);
                    }
                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else if (y >= lA) {
                if (x < -lA || x >= lA) { //  Out.
                    return this.globalTransformMatrix;
                }
                // Down
                isDown = y > this._kY * (x - pX - dX) + lA;
                matrixIndex = ((segmentX * segmentY + segmentX + segmentY + indexX) * 2 + (isDown ? 1 : 0)) * 7;
                if (matrices[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = segmentY * (segmentXD + 2) + indexX * 2;
                    const ddX = this._hullCache[10];
                    const ddY = this._hullCache[11];
                    const sX = this._hullCache[6] - (segmentX - indexX) * ddX;
                    const sY = this._hullCache[7] - (segmentX - indexX) * ddY;
                    const vertices = this._vertices;
                    if (isDown) {
                        this._getAffineTransform(pX + dX, lB, dX, lB - lA, sX + ddX, sY + ddY, sX, sY, vertices[vertexIndex + 2], vertices[vertexIndex + 3], Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(pX, lA, dX, lB - lA, vertices[vertexIndex], vertices[vertexIndex + 1], vertices[vertexIndex + 2], vertices[vertexIndex + 3], sX, sY, Surface._helpTransform, helpMatrix, false);
                    }
                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            else { // Center.
                isDown = y > this._k * (x - pX - dX) + pY;
                matrixIndex = ((segmentX * indexY + indexX) * 2 + (isDown ? 1 : 0)) * 7;
                if (matrices[matrixIndex] > 0.0) {
                    helpMatrix.copyFromArray(matrices, matrixIndex + 1);
                }
                else {
                    const vertexIndex = indexX * 2 + indexY * (segmentXD + 2);
                    const vertices = this._vertices;
                    if (isDown) {
                        this._getAffineTransform(pX + dX, pY + dY, dX, dY, vertices[vertexIndex + segmentXD + 4], vertices[vertexIndex + segmentXD + 5], vertices[vertexIndex + segmentXD + 2], vertices[vertexIndex + segmentXD + 3], vertices[vertexIndex + 2], vertices[vertexIndex + 3], Surface._helpTransform, helpMatrix, true);
                    }
                    else {
                        this._getAffineTransform(pX, pY, dX, dY, vertices[vertexIndex], vertices[vertexIndex + 1], vertices[vertexIndex + 2], vertices[vertexIndex + 3], vertices[vertexIndex + segmentXD + 2], vertices[vertexIndex + segmentXD + 3], Surface._helpTransform, helpMatrix, false);
                    }
                    matrices[matrixIndex] = 1.0;
                    matrices[matrixIndex + 1] = helpMatrix.a;
                    matrices[matrixIndex + 2] = helpMatrix.b;
                    matrices[matrixIndex + 3] = helpMatrix.c;
                    matrices[matrixIndex + 4] = helpMatrix.d;
                    matrices[matrixIndex + 5] = helpMatrix.tx;
                    matrices[matrixIndex + 6] = helpMatrix.ty;
                }
            }
            return helpMatrix;
        }
        /**
         * @internal
         * @private
         */
        init(surfaceData, armatureValue) {
            if (this._boneData !== null) {
                return;
            }
            super.init(surfaceData, armatureValue);
            const segmentX = surfaceData.segmentX;
            const segmentY = surfaceData.segmentY;
            const vertexCount = this._armature.armatureData.parent.intArray[surfaceData.geometry.offset + 0 /* GeometryVertexCount */];
            const lB = 1000.0;
            const lA = 200.0;
            //
            this._dX = lA * 2.0 / segmentX;
            this._dY = lA * 2.0 / segmentY;
            this._k = -this._dY / this._dX;
            this._kX = -this._dY / (lB - lA);
            this._kY = -(lB - lA) / this._dX;
            this._vertices.length = vertexCount * 2;
            this._deformVertices.length = vertexCount * 2;
            this._matrixCahce.length = (segmentX * segmentY + segmentX * 2 + segmentY * 2) * 2 * 7;
            this._hullCache.length = 10;
            for (let i = 0; i < vertexCount * 2; ++i) {
                this._deformVertices[i] = 0.0;
            }
            if (this._parent !== null) {
                if (this._parent.boneData.type === 0 /* Bone */) {
                    this._bone = this._parent;
                }
                else {
                    this._bone = this._parent._bone;
                }
            }
        }
        /**
         * @internal
         */
        update(cacheFrameIndex) {
            if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else {
                    if (this._hasConstraint) { // Update constraints.
                        for (const constraint of this._armature._constraints) {
                            if (constraint._root === this) {
                                constraint.update();
                            }
                        }
                    }
                    if (this._transformDirty ||
                        (this._parent !== null && this._parent._childrenTransformDirty)) { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                    else if (this._cachedFrameIndex >= 0) { // Same cache, but not set index yet.
                        this._transformDirty = false;
                        this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                    }
                    else { // Dirty.
                        this._transformDirty = true;
                        this._cachedFrameIndex = -1;
                    }
                }
            }
            else {
                if (this._hasConstraint) { // Update constraints.
                    for (const constraint of this._armature._constraints) {
                        if (constraint._root === this) {
                            constraint.update();
                        }
                    }
                }
                if (this._transformDirty || (this._parent !== null && this._parent._childrenTransformDirty)) { // Dirty.
                    cacheFrameIndex = -1;
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
            }
            if (this._transformDirty) {
                this._transformDirty = false;
                this._childrenTransformDirty = true;
                //
                for (let i = 0, l = this._matrixCahce.length; i < l; i += 7) {
                    this._matrixCahce[i] = -1.0;
                }
                //
                this._updateVertices();
                //
                if (this._cachedFrameIndex < 0) {
                    const isCache = cacheFrameIndex >= 0;
                    if (this._localDirty) {
                        this._updateGlobalTransformMatrix(isCache);
                    }
                    if (isCache && this._cachedFrameIndices !== null) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }
                // Update hull vertices.
                const lB = 1000.0;
                const lA = 200.0;
                const ddX = 2 * this.global.x;
                const ddY = 2 * this.global.y;
                //
                const helpPoint = Surface._helpPoint;
                this.globalTransformMatrix.transformPoint(lB, -lA, helpPoint);
                this._hullCache[0] = helpPoint.x;
                this._hullCache[1] = helpPoint.y;
                this._hullCache[2] = ddX - helpPoint.x;
                this._hullCache[3] = ddY - helpPoint.y;
                this.globalTransformMatrix.transformPoint(0.0, this._dY, helpPoint, true);
                this._hullCache[4] = helpPoint.x;
                this._hullCache[5] = helpPoint.y;
                //
                this.globalTransformMatrix.transformPoint(lA, lB, helpPoint);
                this._hullCache[6] = helpPoint.x;
                this._hullCache[7] = helpPoint.y;
                this._hullCache[8] = ddX - helpPoint.x;
                this._hullCache[9] = ddY - helpPoint.y;
                this.globalTransformMatrix.transformPoint(this._dX, 0.0, helpPoint, true);
                this._hullCache[10] = helpPoint.x;
                this._hullCache[11] = helpPoint.y;
            }
            else if (this._childrenTransformDirty) {
                this._childrenTransformDirty = false;
            }
            this._localDirty = true;
        }
    }
    dragonBones.Surface = Surface;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class DisplayFrame extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            this.deformVertices = [];
            this.shapeVertices = [];
        }
        static toString() {
            return "[class dragonBones.DisplayFrame]";
        }
        _onClear() {
            this.rawDisplayData = null;
            this.displayData = null;
            this.textureData = null;
            this.display = null;
            this.deformVertices.length = 0;
            this.shapeVertices.length = 0;
        }
        updateDeformVertices() {
            if (this.rawDisplayData === null || this.deformVertices.length !== 0) {
                return;
            }
            console.log("updateDeformVertices", this.rawDisplayData);
            let rawGeometryData;
            if (this.rawDisplayData.type === 2 /* Mesh */) {
                rawGeometryData = this.rawDisplayData.geometry;
            }
            else if (this.rawDisplayData.type === 4 /* Path */) {
                rawGeometryData = this.rawDisplayData.geometry;
            }
            else {
                return;
            }
            let vertexCount = 0;
            if (rawGeometryData.weight !== null) {
                vertexCount = rawGeometryData.weight.count * 2;
            }
            else {
                vertexCount = rawGeometryData.data.intArray[rawGeometryData.offset + 0 /* GeometryVertexCount */] * 2;
            }
            this.deformVertices.length = vertexCount;
            for (let i = 0, l = this.deformVertices.length; i < l; ++i) {
                this.deformVertices[i] = 0.0;
            }
        }
        getGeometryData() {
            if (this.displayData !== null) {
                if (this.displayData.type === 2 /* Mesh */) {
                    return this.displayData.geometry;
                }
                if (this.displayData.type === 4 /* Path */) {
                    return this.displayData.geometry;
                }
            }
            if (this.rawDisplayData !== null) {
                if (this.rawDisplayData.type === 2 /* Mesh */) {
                    return this.rawDisplayData.geometry;
                }
                if (this.rawDisplayData.type === 4 /* Path */) {
                    return this.rawDisplayData.geometry;
                }
            }
            return null;
        }
        updateShapeVertices() {
            if (this.rawDisplayData === null || this.shapeVertices.length !== 0) {
                return;
            }
            let rawVerticesData = undefined;
            if (this.rawDisplayData.type === 5 /* Shape */) {
                if (this.rawDisplayData.shape) {
                    rawVerticesData = this.rawDisplayData.shape.vertices;
                }
            }
            else {
                return;
            }
            let vertexCount = rawVerticesData ? rawVerticesData.length : 0;
            this.shapeVertices.length = vertexCount;
            for (let i = 0, l = this.shapeVertices.length; i < l; ++i) {
                this.shapeVertices[i] = 0.0;
            }
        }
        getShapeData() {
            if (this.displayData !== null && this.displayData.type === 5 /* Shape */) {
                return this.displayData.shape;
            }
            if (this.rawDisplayData !== null && this.rawDisplayData.type === 5 /* Shape */) {
                return this.rawDisplayData.shape;
            }
            return null;
        }
        getBoundingBox() {
            if (this.displayData !== null && this.displayData.type === 3 /* BoundingBox */) {
                return this.displayData.boundingBox;
            }
            if (this.rawDisplayData !== null && this.rawDisplayData.type === 3 /* BoundingBox */) {
                return this.rawDisplayData.boundingBox;
            }
            return null;
        }
        getTextureData() {
            if (this.displayData !== null) {
                if (this.displayData.type === 0 /* Image */) {
                    return this.displayData.texture;
                }
                if (this.displayData.type === 2 /* Mesh */) {
                    return this.displayData.texture;
                }
            }
            if (this.textureData !== null) {
                return this.textureData;
            }
            if (this.rawDisplayData !== null) {
                if (this.rawDisplayData.type === 0 /* Image */) {
                    return this.rawDisplayData.texture;
                }
                if (this.rawDisplayData.type === 2 /* Mesh */) {
                    return this.rawDisplayData.texture;
                }
            }
            return null;
        }
    }
    dragonBones.DisplayFrame = DisplayFrame;
    /**
     * - The slot attached to the armature, controls the display status and properties of the display object.
     * A bone can contain multiple slots.
     * A slot can contain multiple display objects, displaying only one of the display objects at a time,
     * but you can toggle the display object into frame animation while the animation is playing.
     * The display object can be a normal texture, or it can be a display of a child armature, a grid display object,
     * and a custom other display object.
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 插槽附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Slot extends dragonBones.TransformObject {
        constructor() {
            super(...arguments);
            this._localMatrix = new dragonBones.Matrix();
            /**
             * @internal
             */
            this._colorTransform = new dragonBones.ColorTransform();
            /**
             * @internal
             */
            this._displayFrames = [];
            /**
             * @internal
             */
            this._geometryBones = [];
            this._rawDisplay = null; // Initial value.
            this._meshDisplay = null; // Initial value.
            this._shapeDisplay = null; // Initial value.
            this._display = null;
        }
        _onClear() {
            super._onClear();
            const disposeDisplayList = [];
            for (const dispayFrame of this._displayFrames) {
                const display = dispayFrame.display;
                if (display !== this._rawDisplay && display !== this._meshDisplay &&
                    disposeDisplayList.indexOf(display) < 0) {
                    disposeDisplayList.push(display);
                }
                dispayFrame.returnToPool();
            }
            for (const eachDisplay of disposeDisplayList) {
                if (eachDisplay instanceof dragonBones.Armature) {
                    eachDisplay.dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay, true);
                }
            }
            if (this._meshDisplay !== null && this._meshDisplay !== this._rawDisplay) { // May be _meshDisplay and _rawDisplay is the same one.
                this._disposeDisplay(this._meshDisplay, false);
            }
            if (this._shapeDisplay !== null && this._shapeDisplay !== this._rawDisplay) { // May be _shapeDisplay and _rawDisplay is the same one.
                this._disposeDisplay(this._shapeDisplay, false);
            }
            if (this._rawDisplay !== null) {
                this._disposeDisplay(this._rawDisplay, false);
            }
            this.displayController = null;
            this._displayDataDirty = false;
            this._displayDirty = false;
            this._geometryDirty = false;
            this._textureDirty = false;
            this._shapeDirty = false;
            this._visibleDirty = false;
            this._blendModeDirty = false;
            this._zOrderDirty = false;
            this._colorDirty = false;
            this._verticesDirty = false;
            this._transformDirty = false;
            this._visible = true;
            this._blendMode = 0 /* Normal */;
            this._displayIndex = -1;
            this._animationDisplayIndex = -1;
            this._zOrder = 0;
            this._zIndex = 0;
            this._cachedFrameIndex = -1;
            this._pivotX = 0.0;
            this._pivotY = 0.0;
            this._localMatrix.identity();
            this._colorTransform.identity();
            this._displayFrames.length = 0;
            this._geometryBones.length = 0;
            this._slotData = null; //
            this._displayFrame = null;
            this._geometryData = null;
            this._shapeData = null;
            this._boundingBoxData = null;
            this._textureData = null;
            this._rawDisplay = null;
            this._meshDisplay = null;
            this._display = null;
            this._childArmature = null;
            this._parent = null; //
            this._cachedFrameIndices = null;
        }
        _hasDisplay(display) {
            for (const displayFrame of this._displayFrames) {
                if (displayFrame.display === display) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @internal
         */
        _isBonesUpdate() {
            for (const bone of this._geometryBones) {
                if (bone !== null && bone._childrenTransformDirty) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @internal
         */
        _updateAlpha() {
            const globalAlpha = this._alpha * this._parent._globalAlpha;
            if (this._globalAlpha !== globalAlpha) {
                this._globalAlpha = globalAlpha;
                this._colorDirty = true;
            }
        }
        _updateDisplayData() {
            const prevDisplayFrame = this._displayFrame;
            const prevGeometryData = this._geometryData;
            const prevTextureData = this._textureData;
            const prevShapeData = this._shapeData;
            let rawDisplayData = null;
            let displayData = null;
            this._displayFrame = null;
            this._geometryData = null;
            this._shapeData = null;
            this._boundingBoxData = null;
            this._textureData = null;
            if (this._displayIndex >= 0 && this._displayIndex < this._displayFrames.length) {
                this._displayFrame = this._displayFrames[this._displayIndex];
                rawDisplayData = this._displayFrame.rawDisplayData;
                displayData = this._displayFrame.displayData;
                this._geometryData = this._displayFrame.getGeometryData();
                this._boundingBoxData = this._displayFrame.getBoundingBox();
                this._textureData = this._displayFrame.getTextureData();
                this._shapeData = this._displayFrame.getShapeData();
                this._mask = rawDisplayData ? rawDisplayData.mask : false;
                this._maskRange = rawDisplayData ? rawDisplayData.maskRange : 0;
            }
            if (this._displayFrame !== prevDisplayFrame ||
                this._geometryData !== prevGeometryData ||
                this._textureData !== prevTextureData ||
                this._shapeData !== prevShapeData) {
                // Update pivot offset.
                if (this._geometryData === null && this._textureData !== null) {
                    const imageDisplayData = ((displayData !== null && displayData.type === 0 /* Image */) ? displayData : rawDisplayData); //
                    const scale = this._textureData.parent.scale * this._armature._armatureData.scale;
                    const frame = this._textureData.frame;
                    this._pivotX = imageDisplayData.pivot.x;
                    this._pivotY = imageDisplayData.pivot.y;
                    const rect = frame !== null ? frame : this._textureData.region;
                    let width = rect.width;
                    let height = rect.height;
                    if (this._textureData.rotated && frame === null) {
                        width = rect.height;
                        height = rect.width;
                    }
                    this._pivotX *= width * scale;
                    this._pivotY *= height * scale;
                    // if (frame !== null) {
                    //     this._pivotX += frame.x * scale;
                    //     this._pivotY += frame.y * scale;
                    // }
                    // Update replace pivot. TODO
                    if (rawDisplayData !== null && imageDisplayData !== rawDisplayData) {
                        rawDisplayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX -= Slot._helpPoint.x;
                        this._pivotY -= Slot._helpPoint.y;
                        imageDisplayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX += Slot._helpPoint.x;
                        this._pivotY += Slot._helpPoint.y;
                    }
                    if (!dragonBones.DragonBones.yDown) {
                        this._pivotY = (this._textureData.rotated ? this._textureData.region.width : this._textureData.region.height) * scale - this._pivotY;
                    }
                }
                else if (this._shapeData !== null) {
                }
                else {
                    this._pivotX = 0.0;
                    this._pivotY = 0.0;
                }
                // Update original transform.
                if (rawDisplayData !== null) { // Compatible.
                    this.origin = rawDisplayData.transform;
                }
                else if (displayData !== null) { // Compatible.
                    this.origin = displayData.transform;
                }
                else {
                    this.origin = null;
                }
                // TODO remove slot offset.
                if (this.origin !== null) {
                    this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
                }
                else {
                    this.global.copyFrom(this.offset).toMatrix(this._localMatrix);
                }
                // Update geometry.
                if (this._geometryData !== prevGeometryData) {
                    this._geometryDirty = true;
                    this._verticesDirty = true;
                    if (this._geometryData !== null) {
                        this._geometryBones.length = 0;
                        if (this._geometryData.weight !== null) {
                            for (let i = 0, l = this._geometryData.weight.bones.length; i < l; ++i) {
                                const bone = this._armature.getBone(this._geometryData.weight.bones[i].name);
                                this._geometryBones.push(bone);
                            }
                        }
                    }
                    else {
                        this._geometryBones.length = 0;
                        this._geometryData = null;
                    }
                }
                if (this._shapeData !== prevShapeData) {
                    this._shapeDirty = true;
                }
                this._textureDirty = this._textureData !== prevTextureData;
                this._transformDirty = true;
            }
        }
        _updateDisplay() {
            const prevDisplay = this._display !== null ? this._display : this._rawDisplay;
            const prevChildArmature = this._childArmature;
            // Update display and child armature.
            if (this._displayFrame !== null) {
                this._display = this._displayFrame.display;
                if (this._display !== null && this._display instanceof dragonBones.Armature) {
                    this._childArmature = this._display;
                    this._display = this._childArmature.display;
                }
                else {
                    this._childArmature = null;
                }
            }
            else {
                this._display = null;
                this._childArmature = null;
            }
            // Update display.
            const currentDisplay = this._display !== null ? this._display : this._rawDisplay;
            if (currentDisplay !== prevDisplay) {
                this._textureDirty = true;
                this._visibleDirty = true;
                this._blendModeDirty = true;
                // this._zOrderDirty = true;
                this._colorDirty = true;
                this._transformDirty = true;
                this._onUpdateDisplay();
                this._replaceDisplay(prevDisplay);
            }
            // Update child armature.
            if (this._childArmature !== prevChildArmature) {
                if (prevChildArmature !== null) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    prevChildArmature.clock = null;
                    if (prevChildArmature.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }
                if (this._childArmature !== null) {
                    this._childArmature._parent = this; // Update child armature parent.
                    this._childArmature.clock = this._armature.clock;
                    if (this._childArmature.inheritAnimation) { // Set child armature cache frameRate.
                        if (this._childArmature.cacheFrameRate === 0) {
                            const cacheFrameRate = this._armature.cacheFrameRate;
                            if (cacheFrameRate !== 0) {
                                this._childArmature.cacheFrameRate = cacheFrameRate;
                            }
                        }
                        // Child armature action.
                        if (this._displayFrame !== null) {
                            let actions = null;
                            let displayData = this._displayFrame.displayData !== null ? this._displayFrame.displayData : this._displayFrame.rawDisplayData;
                            if (displayData !== null && displayData.type === 1 /* Armature */) {
                                actions = displayData.actions;
                            }
                            if (actions !== null && actions.length > 0) {
                                for (const action of actions) {
                                    const eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                                    dragonBones.EventObject.actionDataToInstance(action, eventObject, this._armature);
                                    eventObject.slot = this;
                                    this._armature._bufferAction(eventObject, false);
                                }
                            }
                            else {
                                this._childArmature.animation.play();
                            }
                        }
                    }
                }
            }
        }
        _updateGlobalTransformMatrix(isCache) {
            const parentMatrix = this._parent._boneData.type === 0 /* Bone */ ? this._parent.globalTransformMatrix : this._parent._getGlobalTransformMatrix(this.global.x, this.global.y);
            this.globalTransformMatrix.copyFrom(this._localMatrix);
            this.globalTransformMatrix.concat(parentMatrix);
            if (isCache) {
                this.global.fromMatrix(this.globalTransformMatrix);
            }
            else {
                this._globalDirty = true;
            }
        }
        /**
         * @internal
         */
        _setDisplayIndex(value, isAnimation = false) {
            if (isAnimation) {
                if (this._animationDisplayIndex === value) {
                    return;
                }
                this._animationDisplayIndex = value;
            }
            if (this._displayIndex === value) {
                return;
            }
            this._displayIndex = value < this._displayFrames.length ? value : this._displayFrames.length - 1;
            this._displayDataDirty = true;
            this._displayDirty = this._displayIndex < 0 || this._display !== this._displayFrames[this._displayIndex].display;
        }
        /**
         * @internal
         */
        _setZOrder(value) {
            if (this._zOrder === value) {
                // return false;
            }
            this._zOrder = value;
            this._zOrderDirty = true;
            return this._zOrderDirty;
        }
        /**
         * @internal
         */
        _setColor(value) {
            this._colorTransform.copyFrom(value);
            return this._colorDirty = true;
        }
        /**
         * @internal
         */
        init(slotData, armatureValue, rawDisplay, meshDisplay, shapeDisplay) {
            if (this._slotData !== null) {
                return;
            }
            this._slotData = slotData;
            this._colorDirty = true; //
            this._blendModeDirty = true; //
            this._blendMode = this._slotData.blendMode;
            this._zOrder = this._slotData.zOrder;
            this._zIndex = this._slotData.zIndex;
            this._alpha = this._slotData.alpha;
            this._colorTransform.copyFrom(this._slotData.color);
            this._rawDisplay = rawDisplay;
            this._meshDisplay = meshDisplay;
            this._shapeDisplay = shapeDisplay;
            //
            this._armature = armatureValue;
            const slotParent = this._armature.getBone(this._slotData.parent.name);
            if (slotParent !== null) {
                this._parent = slotParent;
            }
            else {
                // Never;
            }
            this._armature._addSlot(this);
            //
            this._initDisplay(this._rawDisplay, false);
            if (this._rawDisplay !== this._meshDisplay) {
                this._initDisplay(this._meshDisplay, false);
            }
            if (this._rawDisplay !== this._shapeDisplay) {
                this._initDisplay(this._shapeDisplay, false);
            }
            this._onUpdateDisplay();
            this._addDisplay();
        }
        /**
         * @internal
         */
        update(cacheFrameIndex) {
            if (this._displayDataDirty) {
                this._updateDisplayData();
                this._displayDataDirty = false;
            }
            if (this._displayDirty) {
                this._updateDisplay();
                this._displayDirty = false;
            }
            if (this._geometryDirty || this._textureDirty) {
                if (this._display === null || this._display === this._rawDisplay || this._display === this._meshDisplay) {
                    this._updateFrame();
                }
                this._geometryDirty = false;
                this._textureDirty = false;
            }
            if (this._display === null) {
                return;
            }
            if (this._visibleDirty) {
                this._updateVisible();
                this._visibleDirty = false;
            }
            if (this._blendModeDirty) {
                this._updateBlendMode();
                this._blendModeDirty = false;
            }
            if (this._colorDirty) {
                this._updateColor();
                this._colorDirty = false;
            }
            if (this._maskDirty) {
                this._updateMask();
                this._maskDirty = false;
            }
            if (this._zOrderDirty) {
                this._updateZOrder();
                this._zOrderDirty = false;
                this._maskDirty = true;
            }
            if (this._geometryData !== null && this._display === this._meshDisplay) {
                const isSkinned = this._geometryData.weight !== null;
                const isSurface = this._parent._boneData.type !== 0 /* Bone */;
                if (this._verticesDirty ||
                    (isSkinned && this._isBonesUpdate()) ||
                    (isSurface && this._parent._childrenTransformDirty)) {
                    this._verticesDirty = false; // Allow update mesh to reset the dirty value.
                    this._updateMesh();
                }
                if (isSkinned || isSurface) { // Compatible.
                    return;
                }
            }
            if (this._shapeData !== null && this._display === this._shapeDisplay) {
                if (this._shapeDirty || this._shapeVerticesDirty) {
                    this._shapeVerticesDirty = false;
                    this._shapeDirty = false;
                    this._updateShape();
                }
            }
            if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else if (this._transformDirty || this._parent._childrenTransformDirty) { // Dirty.
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
                else if (this._cachedFrameIndex >= 0) { // Same cache, but not set index yet.
                    this._transformDirty = false;
                    this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                }
                else { // Dirty.
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
            }
            else if (this._transformDirty || this._parent._childrenTransformDirty) { // Dirty.
                cacheFrameIndex = -1;
                this._transformDirty = true;
                this._cachedFrameIndex = -1;
            }
            if (this._transformDirty) {
                if (this._cachedFrameIndex < 0) {
                    const isCache = cacheFrameIndex >= 0;
                    this._updateGlobalTransformMatrix(isCache);
                    if (isCache && this._cachedFrameIndices !== null) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }
                this._updateTransform();
                this._transformDirty = false;
            }
        }
        /**
         * - Forces the slot to update the state of the display object in the next frame.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 强制插槽在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        invalidUpdate() {
            this._displayDataDirty = true;
            this._displayDirty = true;
            //
            this._transformDirty = true;
        }
        /**
         * @private
         */
        updateTransformAndMatrix() {
            if (this._transformDirty) {
                this._updateGlobalTransformMatrix(false);
                this._transformDirty = false;
            }
        }
        /**
         * @private
         */
        replaceRawDisplayData(displayData, index = -1) {
            if (index < 0) {
                index = this._displayIndex < 0 ? 0 : this._displayIndex;
            }
            else if (index >= this._displayFrames.length) {
                return;
            }
            const displayFrame = this._displayFrames[index];
            if (displayFrame.rawDisplayData !== displayData) {
                displayFrame.deformVertices.length = 0;
                displayFrame.rawDisplayData = displayData;
                if (displayFrame.rawDisplayData === null) {
                    const defaultSkin = this._armature._armatureData.defaultSkin;
                    if (defaultSkin !== null) {
                        const defaultRawDisplayDatas = defaultSkin.getDisplays(this._slotData.name);
                        if (defaultRawDisplayDatas !== null && index < defaultRawDisplayDatas.length) {
                            displayFrame.rawDisplayData = defaultRawDisplayDatas[index];
                        }
                    }
                }
                if (index === this._displayIndex) {
                    this._displayDataDirty = true;
                }
            }
        }
        /**
         * @private
         */
        replaceDisplayData(displayData, index = -1) {
            if (index < 0) {
                index = this._displayIndex < 0 ? 0 : this._displayIndex;
            }
            else if (index >= this._displayFrames.length) {
                return;
            }
            const displayFrame = this._displayFrames[index];
            if (displayFrame.displayData !== displayData && displayFrame.rawDisplayData !== displayData) {
                displayFrame.displayData = displayData;
                if (index === this._displayIndex) {
                    this._displayDataDirty = true;
                }
            }
        }
        /**
         * @private
         */
        replaceTextureData(textureData, index = -1) {
            if (index < 0) {
                index = this._displayIndex < 0 ? 0 : this._displayIndex;
            }
            else if (index >= this._displayFrames.length) {
                return;
            }
            const displayFrame = this._displayFrames[index];
            if (displayFrame.textureData !== textureData) {
                displayFrame.textureData = textureData;
                if (index === this._displayIndex) {
                    this._displayDataDirty = true;
                }
            }
        }
        /**
         * @private
         */
        replaceDisplay(value, index = -1) {
            if (index < 0) {
                index = this._displayIndex < 0 ? 0 : this._displayIndex;
            }
            else if (index >= this._displayFrames.length) {
                return;
            }
            const displayFrame = this._displayFrames[index];
            if (displayFrame.display !== value) {
                const prevDisplay = displayFrame.display;
                displayFrame.display = value;
                if (prevDisplay !== null &&
                    prevDisplay !== this._rawDisplay && prevDisplay !== this._meshDisplay &&
                    !this._hasDisplay(prevDisplay)) {
                    if (prevDisplay instanceof dragonBones.Armature) {
                        // (eachDisplay as Armature).dispose();
                    }
                    else {
                        this._disposeDisplay(prevDisplay, true);
                    }
                }
                if (value !== null &&
                    value !== this._rawDisplay && value !== this._meshDisplay &&
                    !this._hasDisplay(prevDisplay) &&
                    !(value instanceof dragonBones.Armature)) {
                    this._initDisplay(value, true);
                }
                if (index === this._displayIndex) {
                    this._displayDirty = true;
                }
            }
        }
        /**
         * - Check whether a specific point is inside a custom bounding box in the slot.
         * The coordinate system of the point is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param x - The horizontal coordinate of the point.
         * @param y - The vertical coordinate of the point.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定点是否在插槽的自定义边界框内。
         * 点的坐标系为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param x - 点的水平坐标。
         * @param y - 点的垂直坐标。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        containsPoint(x, y) {
            if (this._boundingBoxData === null) {
                return false;
            }
            this.updateTransformAndMatrix();
            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(x, y, Slot._helpPoint);
            return this._boundingBoxData.containsPoint(Slot._helpPoint.x, Slot._helpPoint.y);
        }
        /**
         * - Check whether a specific segment intersects a custom bounding box for the slot.
         * The coordinate system of the segment and intersection is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param xA - The horizontal coordinate of the beginning of the segment.
         * @param yA - The vertical coordinate of the beginning of the segment.
         * @param xB - The horizontal coordinate of the end point of the segment.
         * @param yB - The vertical coordinate of the end point of the segment.
         * @param intersectionPointA - The first intersection at which a line segment intersects the bounding box from the beginning to the end. (If not set, the intersection point will not calculated)
         * @param intersectionPointB - The first intersection at which a line segment intersects the bounding box from the end to the beginning. (If not set, the intersection point will not calculated)
         * @param normalRadians - The normal radians of the tangent of the intersection boundary box. [x: Normal radian of the first intersection tangent, y: Normal radian of the second intersection tangent] (If not set, the normal will not calculated)
         * @returns Intersection situation. [1: Disjoint and segments within the bounding box, 0: Disjoint, 1: Intersecting and having a nodal point and ending in the bounding box, 2: Intersecting and having a nodal point and starting at the bounding box, 3: Intersecting and having two intersections, N: Intersecting and having N intersections]
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定线段是否与插槽的自定义边界框相交。
         * 线段和交点的坐标系均为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param xA - 线段起点的水平坐标。
         * @param yA - 线段起点的垂直坐标。
         * @param xB - 线段终点的水平坐标。
         * @param yB - 线段终点的垂直坐标。
         * @param intersectionPointA - 线段从起点到终点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param intersectionPointB - 线段从终点到起点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param normalRadians - 交点边界框切线的法线弧度。 [x: 第一个交点切线的法线弧度, y: 第二个交点切线的法线弧度] （如果未设置，则不计算法线）
         * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
         * @version DragonBones 5.0
         * @language zh_CN
         */
        intersectsSegment(xA, yA, xB, yB, intersectionPointA = null, intersectionPointB = null, normalRadians = null) {
            if (this._boundingBoxData === null) {
                return 0;
            }
            this.updateTransformAndMatrix();
            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(xA, yA, Slot._helpPoint);
            xA = Slot._helpPoint.x;
            yA = Slot._helpPoint.y;
            Slot._helpMatrix.transformPoint(xB, yB, Slot._helpPoint);
            xB = Slot._helpPoint.x;
            yB = Slot._helpPoint.y;
            const intersectionCount = this._boundingBoxData.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
            if (intersectionCount > 0) {
                if (intersectionCount === 1 || intersectionCount === 2) {
                    if (intersectionPointA !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                        if (intersectionPointB !== null) {
                            intersectionPointB.x = intersectionPointA.x;
                            intersectionPointB.y = intersectionPointA.y;
                        }
                    }
                    else if (intersectionPointB !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                else {
                    if (intersectionPointA !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                    }
                    if (intersectionPointB !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                if (normalRadians !== null) {
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.x), Math.sin(normalRadians.x), Slot._helpPoint, true);
                    normalRadians.x = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.y), Math.sin(normalRadians.y), Slot._helpPoint, true);
                    normalRadians.y = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                }
            }
            return intersectionCount;
        }
        /**
         * @private
         */
        getDisplayFrameAt(index) {
            return this._displayFrames[index];
        }
        /**
         * - The visible of slot's display object.
         * @default true
         * @version DragonBones 5.6
         * @language en_US
         */
        /**
         * - 插槽的显示对象的可见。
         * @default true
         * @version DragonBones 5.6
         * @language zh_CN
         */
        get visible() {
            return this._visible;
        }
        set visible(value) {
            if (this._visible === value) {
                return;
            }
            this._visible = value;
            this._updateVisible();
        }
        /**
         * @private
         */
        get displayFrameCount() {
            return this._displayFrames.length;
        }
        set displayFrameCount(value) {
            const prevCount = this._displayFrames.length;
            if (prevCount < value) {
                this._displayFrames.length = value;
                for (let i = prevCount; i < value; ++i) {
                    this._displayFrames[i] = dragonBones.BaseObject.borrowObject(DisplayFrame);
                }
            }
            else if (prevCount > value) {
                for (let i = prevCount - 1; i < value; --i) {
                    this.replaceDisplay(null, i);
                    this._displayFrames[i].returnToPool();
                }
                this._displayFrames.length = value;
            }
        }
        /**
         * - The index of the display object displayed in the display list.
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.displayIndex = 3;
         *     slot.displayController = "none";
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 此时显示的显示对象在显示列表中的索引。
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.displayIndex = 3;
         *     slot.displayController = "none";
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get displayIndex() {
            return this._displayIndex;
        }
        set displayIndex(value) {
            this._setDisplayIndex(value);
            this.update(-1);
        }
        /**
         * - The slot name.
         * @see dragonBones.SlotData#name
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽名称。
         * @see dragonBones.SlotData#name
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get name() {
            return this._slotData.name;
        }
        /**
         * - Contains a display list of display objects or child armatures.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get displayList() {
            const displays = new Array();
            for (const displayFrame of this._displayFrames) {
                displays.push(displayFrame.display);
            }
            return displays;
        }
        set displayList(value) {
            this.displayFrameCount = value.length;
            let index = 0;
            for (const eachDisplay of value) {
                this.replaceDisplay(eachDisplay, index++);
            }
        }
        /**
         * - The slot data.
         * @see dragonBones.SlotData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get slotData() {
            return this._slotData;
        }
        /**
         * - The custom bounding box data for the slot at current time.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 插槽此时的自定义包围盒数据。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        get boundingBoxData() {
            return this._boundingBoxData;
        }
        /**
         * @private
         */
        get rawDisplay() {
            return this._rawDisplay;
        }
        /**
         * @private
         */
        get meshDisplay() {
            return this._meshDisplay;
        }
        /**
         * @private
         */
        get shapeDisplay() {
            return this._shapeDisplay;
        }
        /**
         * - The display object that the slot displays at this time.
         * @example
         * <pre>
         *     let slot = armature.getSlot("text");
         *     slot.display = new yourEngine.TextField();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽此时显示的显示对象。
         * @example
         * <pre>
         *     let slot = armature.getSlot("text");
         *     slot.display = new yourEngine.TextField();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get display() {
            return this._display;
        }
        set display(value) {
            if (this._display === value) {
                return;
            }
            if (this._displayFrames.length === 0) {
                this.displayFrameCount = 1;
                this._displayIndex = 0;
            }
            this.replaceDisplay(value, this._displayIndex);
        }
        /**
         * - The child armature that the slot displayed at current time.
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     let prevChildArmature = slot.childArmature;
         *     if (prevChildArmature) {
         *         prevChildArmature.dispose();
         *     }
         *     slot.childArmature = factory.buildArmature("weapon_blabla", "weapon_blabla_project");
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽此时显示的子骨架。
         * 注意，被替换的对象或子骨架并不会被回收，根据语言和引擎的不同，需要额外处理。
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     let prevChildArmature = slot.childArmature;
         *     if (prevChildArmature) {
         *         prevChildArmature.dispose();
         *     }
         *     slot.childArmature = factory.buildArmature("weapon_blabla", "weapon_blabla_project");
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get childArmature() {
            return this._childArmature;
        }
        set childArmature(value) {
            if (this._childArmature === value) {
                return;
            }
            this.display = value;
        }
        /**
         * - The parent bone to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所属的父骨骼。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get parent() {
            return this._parent;
        }
        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        getDisplay() {
            return this._display;
        }
        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        setDisplay(value) {
            this.display = value;
        }
    }
    dragonBones.Slot = Slot;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     */
    class Constraint extends dragonBones.BaseObject {
        _onClear() {
            this._armature = null; //
            this._target = null; //
            this._root = null; //
            this._bone = null;
        }
        get name() {
            return this._constraintData.name;
        }
    }
    Constraint._helpMatrix = new dragonBones.Matrix();
    Constraint._helpTransform = new dragonBones.Transform();
    Constraint._helpPoint = new dragonBones.Point();
    dragonBones.Constraint = Constraint;
    /**
     * @internal
     */
    class IKConstraint extends Constraint {
        static toString() {
            return "[class dragonBones.IKConstraint]";
        }
        _onClear() {
            super._onClear();
            // this._scaleEnabled = false;
            this._bendPositive = false;
            this._weight = 1.0;
            this._constraintData = null;
        }
        _computeA() {
            const ikGlobal = this._target.global;
            const global = this._root.global;
            const globalTransformMatrix = this._root.globalTransformMatrix;
            let radian = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                radian += Math.PI;
            }
            global.rotation += dragonBones.Transform.normalizeRadian(radian - global.rotation) * this._weight;
            global.toMatrix(globalTransformMatrix);
        }
        _computeB() {
            const boneLength = this._bone._boneData.length;
            const parent = this._root;
            const ikGlobal = this._target.global;
            const parentGlobal = parent.global;
            const global = this._bone.global;
            const globalTransformMatrix = this._bone.globalTransformMatrix;
            const x = globalTransformMatrix.a * boneLength;
            const y = globalTransformMatrix.b * boneLength;
            const lLL = x * x + y * y;
            const lL = Math.sqrt(lLL);
            let dX = global.x - parentGlobal.x;
            let dY = global.y - parentGlobal.y;
            const lPP = dX * dX + dY * dY;
            const lP = Math.sqrt(lPP);
            const rawRadian = global.rotation;
            const rawParentRadian = parentGlobal.rotation;
            const rawRadianA = Math.atan2(dY, dX);
            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            const lTT = dX * dX + dY * dY;
            const lT = Math.sqrt(lTT);
            let radianA = 0.0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                radianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x);
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    radianA += Math.PI;
                }
            }
            else {
                const h = (lPP - lLL + lTT) / (2.0 * lTT);
                const r = Math.sqrt(lPP - h * h * lTT) / lT;
                const hX = parentGlobal.x + (dX * h);
                const hY = parentGlobal.y + (dY * h);
                const rX = -dY * r;
                const rY = dX * r;
                let isPPR = false;
                const parentParent = parent.parent;
                if (parentParent !== null) {
                    const parentParentMatrix = parentParent.globalTransformMatrix;
                    isPPR = parentParentMatrix.a * parentParentMatrix.d - parentParentMatrix.b * parentParentMatrix.c < 0.0;
                }
                if (isPPR !== this._bendPositive) {
                    global.x = hX - rX;
                    global.y = hY - rY;
                }
                else {
                    global.x = hX + rX;
                    global.y = hY + rY;
                }
                radianA = Math.atan2(global.y - parentGlobal.y, global.x - parentGlobal.x);
            }
            const dR = dragonBones.Transform.normalizeRadian(radianA - rawRadianA);
            parentGlobal.rotation = rawParentRadian + dR * this._weight;
            parentGlobal.toMatrix(parent.globalTransformMatrix);
            //
            const currentRadianA = rawRadianA + dR * this._weight;
            global.x = parentGlobal.x + Math.cos(currentRadianA) * lP;
            global.y = parentGlobal.y + Math.sin(currentRadianA) * lP;
            //
            let radianB = Math.atan2(ikGlobal.y - global.y, ikGlobal.x - global.x);
            if (global.scaleX < 0.0) {
                radianB += Math.PI;
            }
            global.rotation = parentGlobal.rotation + rawRadian - rawParentRadian + dragonBones.Transform.normalizeRadian(radianB - dR - rawRadian) * this._weight;
            global.toMatrix(globalTransformMatrix);
        }
        init(constraintData, armature) {
            if (this._constraintData !== null) {
                return;
            }
            this._constraintData = constraintData;
            this._armature = armature;
            this._target = this._armature.getBone(this._constraintData.target.name);
            this._root = this._armature.getBone(this._constraintData.root.name);
            this._bone = this._constraintData.bone !== null ? this._armature.getBone(this._constraintData.bone.name) : null;
            {
                const ikConstraintData = this._constraintData;
                // this._scaleEnabled = ikConstraintData.scaleEnabled;
                this._bendPositive = ikConstraintData.bendPositive;
                this._weight = ikConstraintData.weight;
            }
            this._root._hasConstraint = true;
        }
        update() {
            this._root.updateByConstraint();
            if (this._bone !== null) {
                this._bone.updateByConstraint();
                this._computeB();
            }
            else {
                this._computeA();
            }
        }
        invalidUpdate() {
            this._root.invalidUpdate();
            if (this._bone !== null) {
                this._bone.invalidUpdate();
            }
        }
    }
    dragonBones.IKConstraint = IKConstraint;
    /**
     * @internal
     */
    class TransformConstraint extends Constraint {
        constructor() {
            super(...arguments);
            this._helpMatrix1 = new dragonBones.Matrix();
            this._helpMatrix2 = new dragonBones.Matrix();
            this._helpTransform = new dragonBones.Transform();
            this._dirty = true;
            this.index = -1;
        }
        static toString() {
            return "[class dragonBones.TransformConstraint]";
        }
        _onClear() {
            super._onClear();
            this._constraintData = null;
            this.index = -1;
        }
        init(constraintData, armature) {
            if (this._constraintData !== null) {
                return;
            }
            if (this.index < 0) {
                return;
            }
            this._constraintData = constraintData;
            this._armature = armature;
            this._target = this._armature.getBone(this._constraintData.target.name);
            const transformConstraintData = this._constraintData;
            const boneName = transformConstraintData.bones[this.index].name;
            this._bone = this._armature.getBone(boneName);
            if (!this._bone) {
                return;
            }
            this._rotateWeight = transformConstraintData.rotateWeight;
            this._scaleWeight = transformConstraintData.scaleWeight;
            this._translateWeight = transformConstraintData.translateWeight;
            this._root = this._bone;
            this._root._transformConstraint = this;
            this._target._targetTransformConstraint = this;
        }
        update() {
            if (!this._dirty) {
                return;
            }
            if (!this._root || !this._target || !this._bone) {
                return;
            }
            if (this._bone !== null) {
                this._compute();
            }
            this._dirty = false;
        }
        _compute() {
            if (this._target && this._root) {
                const transformConstraintData = this._constraintData;
                const { offsetX, offsetY, offsetRotation, offsetScaleX, offsetScaleY, local, relative } = transformConstraintData;
                const globalTransformMatrix = this._root.globalTransformMatrix;
                if (local) {
                    const parentMatrix = this._target.globalTransformMatrix;
                    const localMatrix = this._helpMatrix1.copyFrom(parentMatrix);
                    if (this._target.parent) {
                        const grandMatrix = this._helpMatrix2.copyFrom(this._target.parent.globalTransformMatrix);
                        const p = grandMatrix.invert();
                        localMatrix.concat(p);
                    }
                    const localTransform = this._helpTransform.fromMatrix(localMatrix);
                    this._root.global.x = this._root.global.x * (1 - this._translateWeight) + localTransform.x * this._translateWeight + offsetX;
                    this._root.global.y = this._root.global.y * (1 - this._translateWeight) + localTransform.y * this._translateWeight + offsetY;
                    this._root.global.rotation = this._root.global.rotation * (1 - this._rotateWeight) + localTransform.rotation * this._rotateWeight + offsetRotation;
                    this._root.global.scaleX = this._root.global.scaleX * (1 - this._scaleWeight) + localTransform.scaleX * this._scaleWeight + offsetScaleX;
                    this._root.global.scaleY = this._root.global.scaleY * (1 - this._scaleWeight) + localTransform.scaleY * this._scaleWeight + offsetScaleY;
                    this._root.global.toMatrix(globalTransformMatrix);
                }
                else {
                    this._root.global.x = this._root.global.x * (1 - this._translateWeight) + this._target.global.x * this._translateWeight + offsetX;
                    this._root.global.y = this._root.global.y * (1 - this._translateWeight) + this._target.global.y * this._translateWeight + offsetY;
                    this._root.global.rotation = this._root.global.rotation * (1 - this._rotateWeight) + this._target.global.rotation * this._rotateWeight + offsetRotation;
                    this._root.global.scaleX = this._root.global.scaleX * (1 - this._scaleWeight) + this._target.global.scaleX * this._scaleWeight + offsetScaleX;
                    this._root.global.scaleY = this._root.global.scaleY * (1 - this._scaleWeight) + this._target.global.scaleY * this._scaleWeight + offsetScaleY;
                    this._root.global.toMatrix(globalTransformMatrix);
                }
            }
        }
        invalidUpdate() {
            if (this._root) {
                this._root.invalidUpdate();
            }
        }
    }
    dragonBones.TransformConstraint = TransformConstraint;
    /**
     * @internal
     */
    class PhysicsConstraint extends Constraint {
        constructor() {
            super(...arguments);
            this._sleeping = false;
            this._massInverse = 0;
            this._fpsTime = 0;
            this._dump = 0;
            this._remaining = 0;
            this._lastTime = 0;
            this._xOffset = 0;
            this._xVelocity = 0;
            this._yOffset = 0;
            this._yVelocity = 0;
            this._rotateOffset = 0;
            this._rotateVelocity = 0;
            this._scaleOffset = 0;
            this._scaleVelocity = 0;
            this._lastReset = false;
            this._by = 0;
            this._bx = 0;
            this._cx = 0;
            this._cy = 0;
            this._tx = 0;
            this._ty = 0;
            this.PI = 3.1415927;
            this.PI2 = this.PI * 2;
            this.PI1_2 = 1 / this.PI2;
        }
        static toString() {
            return "[class dragonBones.PhysicsConstraint]";
        }
        _onClear() {
            super._onClear();
            this._constraintData = null;
        }
        init(constraintData, armature) {
            if (this._constraintData !== null) {
                return;
            }
            this._constraintData = constraintData;
            this._armature = armature;
            this._target = this._armature.getBone(this._constraintData.target.name);
            if (this._target) {
                this._target._physicsConstraint = this;
            }
            const physicsData = this._constraintData;
            this._inertia = physicsData.inertia;
            this._strength = physicsData.strength;
            this._damping = physicsData.damping;
            this._mass = physicsData.mass;
            this._wind = physicsData.wind;
            this._gravity = physicsData.gravity;
            this._weight = physicsData.weight;
            this._fpsTime = 1 / physicsData.fps;
            this._massInverse = 1 / this._mass;
            this._dump = 1 - this._damping;
            this._reset = true;
        }
        isNumberEqual(a, b, acc = 0.001) {
            if (a + acc >= b && a - acc <= b) {
                return true;
            }
            return false;
        }
        update() {
            if (this._sleeping) {
                return;
            }
            const physicsData = this._constraintData;
            if (this._armature.clock) {
                const bone = this._target;
                const hasX = physicsData.x > 0;
                const hasY = physicsData.y > 0;
                const hasRotate = physicsData.rotate > 0 || physicsData.shearX > 0;
                const hasScaleX = physicsData.scaleX > 0;
                const boneLength = bone.boneData.length;
                if (this._reset) {
                    this.reset();
                    this._reset = false;
                    this._lastReset = true;
                }
                else {
                    this._sleeping = true;
                    // 过去的时间，单位是秒
                    const globalTime = this._armature.clock.time;
                    const delta = Math.max(globalTime - this._lastTime, 0);
                    // 参与计算的时间，单位是秒
                    this._remaining += delta;
                    this._lastTime = globalTime;
                    // console.log('start bone.globalTransform.x', bone.globalTransform.x)
                    const bx = bone.global.x;
                    const by = bone.global.y;
                    if (this._lastReset) {
                        this._lastReset = false;
                        this._bx = bx;
                        this._by = by;
                    }
                    else {
                        // console.log('physics update', delta, this._sleeping)
                        const armatureReferenceScale = 1;
                        const armatureScaleX = 1;
                        const armatureScaleY = 1;
                        const armatureYDown = dragonBones.DragonBones.yDown;
                        let remaining = this._remaining;
                        let armatureScale = armatureReferenceScale;
                        let damping = -1;
                        let qx = physicsData.limit * delta;
                        let qy = qx * Math.abs(armatureScaleX);
                        qx *= Math.abs(armatureScaleY);
                        if (hasX || hasY) {
                            if (hasX) {
                                // 在惯性下，偏移会继续增加一点，这个增加的值是上一帧的偏移和这一帧的偏移的差值
                                const u = (this._bx - bx) * this._inertia;
                                // 惯性有个最大值
                                this._xOffset += u > qx ? qx : u < -qx ? -qx : u;
                                // 每次迭代只和上一帧的偏移有关
                                this._bx = bx;
                            }
                            if (hasY) {
                                const u = (this._by - by) * this._inertia;
                                this._yOffset += u > qy ? qy : u < -qy ? -qy : u;
                                this._by = by;
                            }
                            if (remaining >= this._fpsTime) {
                                damping = this._dump;
                                const w = this._wind * armatureScale * armatureScaleX;
                                const g = this._gravity * armatureScale * armatureScaleY;
                                do {
                                    //物理fps
                                    if (hasX) {
                                        // 力 = 弹簧力 + 风力
                                        const deltaV = (w - this._xOffset * this._strength) * this._massInverse * this._fpsTime;
                                        this._xVelocity += deltaV;
                                        const deltaOffset = this._xVelocity * this._fpsTime;
                                        this._xOffset += deltaOffset;
                                        this._xVelocity *= damping;
                                    }
                                    if (hasY) {
                                        this._yVelocity -= (g + this._yOffset * this._strength) * this._massInverse * this._fpsTime;
                                        this._yOffset += this._yVelocity * this._fpsTime;
                                        this._yVelocity *= damping;
                                    }
                                    remaining -= this._fpsTime;
                                } while (remaining >= this._fpsTime);
                            }
                            if (hasX) {
                                // 偏移要乘以物理的权重，再乘以x的权重
                                if (Math.abs(this._xOffset) > physicsData.limit) {
                                    // 防止过大
                                    this._xOffset = this._xOffset > 0 ? physicsData.limit : -physicsData.limit;
                                }
                                const offsetX = this._xOffset * this._weight * physicsData.x;
                                bone.global.x += offsetX;
                                if (!this.isNumberEqual(offsetX, 0)) {
                                    this._sleeping = false;
                                }
                            }
                            if (hasY) {
                                if (Math.abs(this._yOffset) > physicsData.limit) {
                                    // 防止过大
                                    this._yOffset = this._yOffset > 0 ? physicsData.limit : -physicsData.limit;
                                }
                                const offsetY = this._yOffset * this._weight * physicsData.y;
                                bone.global.y += offsetY;
                                if (!this.isNumberEqual(offsetY, 0)) {
                                    this._sleeping = false;
                                }
                            }
                        }
                        if (hasRotate || hasScaleX) {
                            const globalMatrix = bone.globalTransformMatrix;
                            let ca = Math.atan2(globalMatrix.c, globalMatrix.a);
                            let c = 0;
                            let s = 0;
                            let mr = 0;
                            let dx = this._cx - bone.global.x;
                            let dy = this._cy - bone.global.y;
                            if (dx > qx)
                                dx = qx;
                            else if (dx < -qx) //
                                dx = -qx;
                            if (dy > qy)
                                dy = qy;
                            else if (dy < -qy) //
                                dy = -qy;
                            if (hasRotate) {
                                mr = (physicsData.rotate + physicsData.shearX) * this._weight;
                                let r = Math.atan2(dy + this._ty, dx + this._tx) - ca - this._rotateOffset * mr;
                                // r 限制在 -pi到pi之间；
                                r = (r - Math.ceil(r * this.PI1_2 - 0.5) * this.PI2);
                                const inertiaRotateOffset = r * this._inertia;
                                if (!this.isNumberEqual(inertiaRotateOffset, 0, 0.0001)) {
                                    this._sleeping = false;
                                }
                                // 旋转的偏移收到惯性的影响
                                this._rotateOffset += inertiaRotateOffset;
                                r = this._rotateOffset * mr + ca;
                                c = Math.cos(r);
                                s = Math.sin(r);
                                if (hasScaleX) {
                                    r = boneLength * bone.global.scaleX;
                                    if (r > 0) {
                                        this._scaleOffset += (dx * c + dy * s) * this._inertia / r;
                                    }
                                }
                            }
                            else {
                                c = Math.cos(ca);
                                s = Math.sin(ca);
                                const r = boneLength * bone.global.scaleX;
                                if (r > 0) {
                                    this._scaleOffset += (dx * c + dy * s) * this._inertia / r;
                                }
                            }
                            remaining = this._remaining;
                            if (remaining >= this._fpsTime) {
                                if (damping == -1) {
                                    damping = this._dump;
                                }
                                const mass = this._massInverse * this._fpsTime;
                                const strength = this._strength;
                                const wind = this._wind;
                                const gravity = (armatureYDown ? -this._gravity : this._gravity);
                                const boneLen = boneLength / armatureScale;
                                while (true) {
                                    remaining -= this._fpsTime;
                                    if (hasScaleX) {
                                        this._scaleVelocity += (wind * c - gravity * s - this._scaleOffset * strength) * mass;
                                        this._scaleOffset += this._scaleVelocity * this._fpsTime;
                                        this._scaleVelocity *= damping;
                                    }
                                    if (hasRotate) {
                                        this._rotateVelocity -= ((wind * s + gravity * c) * boneLen + this._rotateOffset * strength) * mass;
                                        // 旋转的偏移受到力作用
                                        this._rotateOffset += this._rotateVelocity * this._fpsTime;
                                        if (Math.abs(this._rotateOffset) > this.PI2) {
                                            // 旋转的偏移限制在 -2pi到2pi之间；
                                            this._rotateOffset = this._rotateOffset > 0 ? this.PI2 : -this.PI2;
                                        }
                                        if (!this.isNumberEqual(this._rotateVelocity, 0, 0.0001)) {
                                            this._sleeping = false;
                                        }
                                        this._rotateVelocity *= damping;
                                        if (remaining < this._fpsTime) {
                                            break;
                                        }
                                        const r = this._rotateOffset * mr + ca;
                                        c = Math.cos(r);
                                        s = Math.sin(r);
                                    }
                                    else if (remaining < this._fpsTime) //
                                        break;
                                }
                            }
                        }
                        this._remaining = remaining;
                    }
                    this._cx = bone.global.x;
                    this._cy = bone.global.y;
                }
                const globalMatrix = this._target.globalTransformMatrix;
                if (hasRotate) {
                    let o = this._rotateOffset * this._weight, s = 0, c = 0, a = 0;
                    if (physicsData.shearX > 0) {
                        let r = 0;
                        if (physicsData.rotate > 0) {
                            r = o * physicsData.rotate;
                            s = Math.sin(r);
                            c = Math.cos(r);
                            a = globalMatrix.b;
                            globalMatrix.b = c * a - s * globalMatrix.d;
                            globalMatrix.d = s * a + c * globalMatrix.d;
                        }
                        r += o * physicsData.shearX;
                        s = Math.sin(r);
                        c = Math.cos(r);
                        a = globalMatrix.a;
                        globalMatrix.a = c * a - s * globalMatrix.c;
                        globalMatrix.c = s * a + c * globalMatrix.c;
                    }
                    else {
                        o *= physicsData.rotate;
                        s = Math.sin(o);
                        c = Math.cos(o);
                        a = globalMatrix.a;
                        globalMatrix.a = c * a - s * globalMatrix.c;
                        globalMatrix.c = s * a + c * globalMatrix.c;
                        a = globalMatrix.b;
                        globalMatrix.b = c * a - s * globalMatrix.d;
                        globalMatrix.d = s * a + c * globalMatrix.d;
                    }
                }
                if (hasScaleX) {
                    const s = 1 + this._scaleOffset * this._weight * physicsData.scaleX;
                    globalMatrix.a *= s;
                    globalMatrix.c *= s;
                }
                this._tx = boneLength * globalMatrix.a;
                this._ty = boneLength * globalMatrix.c;
                globalMatrix.tx = bone.global.x;
                globalMatrix.ty = bone.global.y;
                const oldRotation = bone.global.rotation;
                const oldSkew = bone.global.skew;
                bone.global.fromMatrix(globalMatrix);
                if (!this.isNumberEqual(oldRotation, bone.global.rotation)
                    || (!this.isNumberEqual(oldSkew, bone.global.skew))) {
                    this._sleeping = false;
                }
            }
        }
        reset() {
            this._remaining = 0;
            this._lastTime = this._armature.clock ? this._armature.clock.time : 0;
            this._xOffset = 0;
            this._xVelocity = 0;
            this._yOffset = 0;
            this._yVelocity = 0;
            this._rotateOffset = 0;
            this._rotateVelocity = 0;
            this._scaleOffset = 0;
            this._scaleVelocity = 0;
        }
        invalidUpdate() {
            if (this._root) {
                this._root.invalidUpdate();
            }
        }
    }
    dragonBones.PhysicsConstraint = PhysicsConstraint;
    /**
     * @internal
     */
    class PathConstraint extends Constraint {
        constructor() {
            super(...arguments);
            this._bones = [];
            this._spaces = [];
            this._positions = [];
            this._curves = [];
            this._boneLengths = [];
            this._pathGlobalVertices = [];
            this._segments = [10];
        }
        static toString() {
            return "[class dragonBones.PathConstraint]";
        }
        _onClear() {
            super._onClear();
            this.dirty = false;
            this.pathOffset = 0;
            this.position = 0.0;
            this.spacing = 0.0;
            this.rotateOffset = 0.0;
            this.rotateWeight = 1.0;
            this.xWeight = 1.0;
            this.yWeight = 1.0;
            this._pathSlot = null;
            this._bones.length = 0;
            this._spaces.length = 0;
            this._positions.length = 0;
            this._curves.length = 0;
            this._boneLengths.length = 0;
            this._pathGlobalVertices.length = 0;
        }
        _updatePathVertices(verticesData) {
            //计算曲线的节点数据
            const armature = this._armature;
            const dragonBonesData = armature.armatureData.parent;
            const scale = armature.armatureData.scale;
            const intArray = dragonBonesData.intArray;
            const floatArray = dragonBonesData.floatArray;
            const pathOffset = verticesData.offset;
            const pathVertexCount = intArray[pathOffset + 0 /* GeometryVertexCount */];
            const pathVertexOffset = intArray[pathOffset + 2 /* GeometryFloatOffset */];
            this._pathGlobalVertices.length = pathVertexCount * 2;
            const weightData = verticesData.weight;
            //没有骨骼约束我,那节点只受自己的Bone控制
            if (weightData === null) {
                const parentBone = this._pathSlot.parent;
                parentBone.updateByConstraint();
                const matrix = parentBone.globalTransformMatrix;
                for (let i = 0, iV = pathVertexOffset; i < pathVertexCount * 2; i += 2) {
                    const vx = floatArray[iV++] * scale;
                    const vy = floatArray[iV++] * scale;
                    const x = matrix.a * vx + matrix.c * vy + matrix.tx;
                    const y = matrix.b * vx + matrix.d * vy + matrix.ty;
                    //
                    this._pathGlobalVertices[i] = x;
                    this._pathGlobalVertices[i + 1] = y;
                }
                return;
            }
            //有骨骼约束我,那我的节点受骨骼权重控制
            const bones = this._pathSlot._geometryBones;
            const weightBoneCount = weightData.bones.length;
            const weightOffset = weightData.offset;
            const floatOffset = intArray[weightOffset + 1 /* WeigthFloatOffset */];
            let iV = floatOffset;
            let iB = weightOffset + 2 /* WeigthBoneIndices */ + weightBoneCount;
            for (let i = 0, iW = 0; i < pathVertexCount; i++) {
                const vertexBoneCount = intArray[iB++]; //
                let xG = 0.0, yG = 0.0;
                for (let ii = 0, ll = vertexBoneCount; ii < ll; ii++) {
                    const boneIndex = intArray[iB++];
                    const bone = bones[boneIndex];
                    if (bone === null) {
                        continue;
                    }
                    bone.updateByConstraint();
                    const matrix = bone.globalTransformMatrix;
                    const weight = floatArray[iV++];
                    const vx = floatArray[iV++] * scale;
                    const vy = floatArray[iV++] * scale;
                    xG += (matrix.a * vx + matrix.c * vy + matrix.tx) * weight;
                    yG += (matrix.b * vx + matrix.d * vy + matrix.ty) * weight;
                }
                this._pathGlobalVertices[iW++] = xG;
                this._pathGlobalVertices[iW++] = yG;
            }
        }
        _computeVertices(start, count, offset, out) {
            //TODO优化
            for (let i = offset, iW = start; i < count; i += 2) {
                out[i] = this._pathGlobalVertices[iW++];
                out[i + 1] = this._pathGlobalVertices[iW++];
            }
        }
        _computeBezierCurve(pathDisplayDta, spaceCount, tangents, percentPosition, percentSpacing) {
            //计算当前的骨骼在曲线上的位置
            const armature = this._armature;
            const intArray = armature.armatureData.parent.intArray;
            const vertexCount = intArray[pathDisplayDta.geometry.offset + 0 /* GeometryVertexCount */];
            const positions = this._positions;
            const spaces = this._spaces;
            const isClosed = pathDisplayDta.closed;
            const curveVertices = Array();
            let verticesLength = vertexCount * 2;
            let curveCount = verticesLength / 6;
            let preCurve = -1;
            let position = this.position;
            positions.length = spaceCount * 3 + 2;
            // 最后一个就是整个曲线的长度
            let pathLength = pathDisplayDta.curveLengths[pathDisplayDta.curveLengths.length - 1];
            //不需要匀速运动，效率高些
            if (!pathDisplayDta.constantSpeed) {
                const lengths = pathDisplayDta.curveLengths;
                curveCount -= isClosed ? 1 : 1;
                if (percentPosition) {
                    position *= pathLength;
                }
                if (percentSpacing) {
                    for (let i = 0; i < spaceCount; i++) {
                        spaces[i] *= pathLength;
                    }
                }
                curveVertices.length = 10;
                for (let i = 0, o = 0, curve = 0; i < spaceCount; i++, o += 3) {
                    const space = spaces[i];
                    position += space;
                    let percent = 0.0;
                    if (isClosed) {
                        position %= pathLength;
                        if (position < 0) {
                            position += pathLength;
                        }
                        curve = 0;
                    }
                    if (position < 0) {
                        percent = position / pathLength;
                        curve = 0;
                    }
                    else if (position > pathLength) {
                        percent = (position) / pathLength;
                        curve = curveCount - 1;
                    }
                    else {
                        for (;; curve++) {
                            const len = lengths[curve];
                            if (position > len) {
                                continue;
                            }
                            if (curve === 0) {
                                percent = position / len;
                            }
                            else {
                                const preLen = lengths[curve - 1];
                                percent = (position - preLen) / (len - preLen);
                            }
                            break;
                        }
                    }
                    if (curve !== preCurve) {
                        preCurve = curve;
                        if (isClosed && curve === curveCount) {
                            //计算是哪段曲线
                            this._computeVertices(verticesLength - 4, 4, 0, curveVertices);
                            this._computeVertices(0, 10, 4, curveVertices);
                        }
                        else {
                            this._computeVertices(curve * 6 + 2, 10, 0, curveVertices);
                        }
                    }
                    // 计算曲线上点的位置和斜率
                    this.addCurvePosition2(percent, curveVertices, positions, o, tangents, pathLength);
                }
                return;
            }
            //匀速的
            if (isClosed) {
                verticesLength += 2;
                curveVertices.length = vertexCount;
                this._computeVertices(2, verticesLength - 4, 0, curveVertices);
                this._computeVertices(0, 2, verticesLength - 4, curveVertices);
                curveVertices[verticesLength - 2] = curveVertices[0];
                curveVertices[verticesLength - 1] = curveVertices[1];
            }
            else {
                curveCount--;
                verticesLength -= 4;
                curveVertices.length = verticesLength;
                this._computeVertices(2, verticesLength, 0, curveVertices);
            }
            //
            let curves = new Array(curveCount);
            pathLength = 0;
            let x1 = curveVertices[0], y1 = curveVertices[1], cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0, x2 = 0, y2 = 0;
            let tmpx, tmpy, dddfx, dddfy, ddfx, ddfy, dfx, dfy;
            for (let i = 0, w = 2; i < curveCount; i++, w += 6) {
                cx1 = curveVertices[w];
                cy1 = curveVertices[w + 1];
                cx2 = curveVertices[w + 2];
                cy2 = curveVertices[w + 3];
                x2 = curveVertices[w + 4];
                y2 = curveVertices[w + 5];
                tmpx = (x1 - cx1 * 2 + cx2) * 0.1875;
                tmpy = (y1 - cy1 * 2 + cy2) * 0.1875;
                dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.09375;
                dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.09375;
                ddfx = tmpx * 2 + dddfx;
                ddfy = tmpy * 2 + dddfy;
                dfx = (cx1 - x1) * 0.75 + tmpx + dddfx * 0.16666667;
                dfy = (cy1 - y1) * 0.75 + tmpy + dddfy * 0.16666667;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx;
                dfy += ddfy;
                ddfx += dddfx;
                ddfy += dddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx;
                dfy += ddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx + dddfx;
                dfy += ddfy + dddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                curves[i] = pathLength;
                x1 = x2;
                y1 = y2;
            }
            if (percentPosition) {
                position *= pathLength;
            }
            if (percentSpacing) {
                for (let i = 0; i < spaceCount; i++) {
                    spaces[i] *= pathLength;
                }
            }
            let segments = this._segments;
            let curveLength = 0;
            for (let i = 0, o = 0, curve = 0, segment = 0; i < spaceCount; i++, o += 3) {
                const space = spaces[i];
                position += space;
                let p = position;
                if (isClosed) {
                    p %= pathLength;
                    if (p < 0)
                        p += pathLength;
                    curve = 0;
                }
                else if (p < 0) {
                    continue;
                }
                else if (p > pathLength) {
                    continue;
                }
                // Determine curve containing position.
                for (;; curve++) {
                    const length = curves[curve];
                    if (p > length)
                        continue;
                    if (curve === 0)
                        p /= length;
                    else {
                        const prev = curves[curve - 1];
                        p = (p - prev) / (length - prev);
                    }
                    break;
                }
                if (curve !== preCurve) {
                    preCurve = curve;
                    let ii = curve * 6;
                    x1 = curveVertices[ii];
                    y1 = curveVertices[ii + 1];
                    cx1 = curveVertices[ii + 2];
                    cy1 = curveVertices[ii + 3];
                    cx2 = curveVertices[ii + 4];
                    cy2 = curveVertices[ii + 5];
                    x2 = curveVertices[ii + 6];
                    y2 = curveVertices[ii + 7];
                    tmpx = (x1 - cx1 * 2 + cx2) * 0.03;
                    tmpy = (y1 - cy1 * 2 + cy2) * 0.03;
                    dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.006;
                    dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.006;
                    ddfx = tmpx * 2 + dddfx;
                    ddfy = tmpy * 2 + dddfy;
                    dfx = (cx1 - x1) * 0.3 + tmpx + dddfx * 0.16666667;
                    dfy = (cy1 - y1) * 0.3 + tmpy + dddfy * 0.16666667;
                    curveLength = Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[0] = curveLength;
                    for (ii = 1; ii < 8; ii++) {
                        dfx += ddfx;
                        dfy += ddfy;
                        ddfx += dddfx;
                        ddfy += dddfy;
                        curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                        segments[ii] = curveLength;
                    }
                    dfx += ddfx;
                    dfy += ddfy;
                    curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[8] = curveLength;
                    dfx += ddfx + dddfx;
                    dfy += ddfy + dddfy;
                    curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[9] = curveLength;
                    segment = 0;
                }
                // Weight by segment length.
                p *= curveLength;
                for (;; segment++) {
                    const length = segments[segment];
                    if (p > length)
                        continue;
                    if (segment === 0)
                        p /= length;
                    else {
                        const prev = segments[segment - 1];
                        p = segment + (p - prev) / (length - prev);
                    }
                    break;
                }
                this.addCurvePosition(p * 0.1, x1, y1, cx1, cy1, cx2, cy2, x2, y2, positions, o, tangents);
            }
        }
        //Calculates a point on the curve, for a given t value between 0 and 1.
        addCurvePosition(t, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, offset, tangents) {
            if (t === 0) {
                out[offset] = x1;
                out[offset + 1] = y1;
                out[offset + 2] = 0;
                return;
            }
            if (t === 1) {
                out[offset] = x2;
                out[offset + 1] = y2;
                out[offset + 2] = 0;
                return;
            }
            const mt = 1 - t;
            const mt2 = mt * mt;
            const t2 = t * t;
            const a = mt2 * mt;
            const b = mt2 * t * 3;
            const c = mt * t2 * 3;
            const d = t * t2;
            const x = a * x1 + b * cx1 + c * cx2 + d * x2;
            const y = a * y1 + b * cy1 + c * cy2 + d * y2;
            out[offset] = x;
            out[offset + 1] = y;
            if (tangents) {
                //Calculates the curve tangent at the specified t value
                out[offset + 2] = Math.atan2(y - (a * y1 + b * cy1 + c * cy2), x - (a * x1 + b * cx1 + c * cx2));
            }
            else {
                out[offset + 2] = 0;
            }
        }
        addCurvePosition2(t, vertices, out, offset, tangents, totalLength) {
            if (vertices.length !== 10) {
                out[offset] = 0;
                out[offset + 1] = 0;
                out[offset + 2] = 0;
                return;
            }
            const x1 = vertices[0];
            const y1 = vertices[1];
            const cx1 = vertices[2];
            const cy1 = vertices[3];
            const cx2 = vertices[4];
            const cy2 = vertices[5];
            const x2 = vertices[6];
            const y2 = vertices[7];
            const cx3 = vertices[8];
            const cy3 = vertices[9];
            if (t < 0) {
                const dydt = cy1 - y1;
                const dxdt = cx1 - x1;
                const angle = Math.atan2(dydt, dxdt);
                const length = totalLength * t;
                out[offset] = x1 + length * Math.cos(angle);
                out[offset + 1] = y1 + length * Math.sin(angle);
                out[offset + 2] = angle;
                return;
            }
            if (t > 1) {
                const dydt = cy3 - y2;
                const dxdt = cx3 - x2;
                const angle = Math.atan2(dydt, dxdt);
                const length = totalLength * (1 - t);
                out[offset] = x2 + length * Math.cos(angle);
                out[offset + 1] = y2 + length * Math.sin(angle);
                out[offset + 2] = angle;
            }
            if (t === 0) {
                out[offset] = x1;
                out[offset + 1] = y1;
                const dydt = cy1 - y1;
                const dxdt = cx1 - x1;
                out[offset + 2] = Math.atan2(dydt, dxdt);
                return;
            }
            if (t === 1) {
                out[offset] = x2;
                out[offset + 1] = y2;
                const dydt = cy3 - y2;
                const dxdt = cx3 - x2;
                out[offset + 2] = Math.atan2(dydt, dxdt);
                return;
            }
            const t1 = 1 - t;
            const t1Sq = t1 * t1;
            const t1Cu = t1Sq * t1;
            const tSq = t * t;
            const tCu = tSq * t;
            // 计算坐标
            const x = t1Cu * x1 + 3 * t1Sq * t * cx1 + 3 * t1 * tSq * cx2 + tCu * x2;
            const y = t1Cu * y1 + 3 * t1Sq * t * cy1 + 3 * t1 * tSq * cy2 + tCu * y2;
            out[offset] = x;
            out[offset + 1] = y;
            if (tangents) {
                // 计算导数（切线方向）
                const dxdt = 3 * ((cx1 - x1) * t1Sq +
                    2 * (cx2 - cx1) * t1 * t +
                    (x2 - cx2) * tSq);
                const dydt = 3 * ((cy1 - y1) * t1Sq +
                    2 * (cy2 - cy1) * t1 * t +
                    (y2 - cy2) * tSq);
                // 处理斜率计算
                out[offset + 2] = Math.atan2(dydt, dxdt);
            }
            else {
                out[offset + 2] = 0;
            }
        }
        init(constraintData, armature) {
            this._constraintData = constraintData;
            this._armature = armature;
            let data = constraintData;
            this.pathOffset = data.pathDisplayData.geometry.offset;
            //
            this.position = data.position;
            this.spacing = data.spacing;
            this.rotateOffset = data.rotateOffset;
            this.rotateWeight = data.rotateWeight;
            this.xWeight = data.xWeight;
            this.yWeight = data.yWeight;
            //
            this._root = this._armature.getBone(data.root.name);
            this._target = this._armature.getBone(data.target.name);
            this._pathSlot = this._armature.getSlot(data.pathSlot.name);
            for (let i = 0, l = data.bones.length; i < l; i++) {
                const bone = this._armature.getBone(data.bones[i].name);
                if (bone !== null) {
                    this._bones.push(bone);
                }
            }
            if (data.rotateMode === 2 /* ChainScale */) {
                this._boneLengths.length = this._bones.length;
            }
            this._root._hasConstraint = true;
        }
        update() {
            const pathSlot = this._pathSlot;
            if (pathSlot._geometryData === null ||
                pathSlot._geometryData.offset !== this.pathOffset) {
                return;
            }
            const constraintData = this._constraintData;
            //
            //曲线节点数据改变:父亲bone改变，权重bones改变，变形顶点改变
            let isPathVerticeDirty = false;
            if (this._root._childrenTransformDirty) {
                this._updatePathVertices(pathSlot._geometryData);
                isPathVerticeDirty = true;
            }
            else if (pathSlot._verticesDirty || pathSlot._isBonesUpdate()) {
                this._updatePathVertices(pathSlot._geometryData);
                pathSlot._verticesDirty = false;
                isPathVerticeDirty = true;
            }
            if (!isPathVerticeDirty && !this.dirty) {
                return;
            }
            //
            const positionMode = constraintData.positionMode;
            const spacingMode = constraintData.spacingMode;
            const rotateMode = constraintData.rotateMode;
            const bones = this._bones;
            const isLengthMode = spacingMode === 0 /* Length */;
            const isChainScaleMode = rotateMode === 2 /* ChainScale */;
            const isTangentMode = rotateMode === 0 /* Tangent */;
            const boneCount = bones.length;
            const spacesCount = isTangentMode ? boneCount : boneCount + 1;
            const spacing = this.spacing;
            let spaces = this._spaces;
            spaces.length = spacesCount;
            //计曲线间隔和长度
            if (isChainScaleMode || isLengthMode) {
                //Bone改变和spacing改变触发
                spaces[0] = 0;
                for (let i = 0, l = spacesCount - 1; i < l; i++) {
                    const bone = bones[i];
                    bone.updateByConstraint();
                    const boneLength = bone._boneData.length;
                    const matrix = bone.globalTransformMatrix;
                    const x = boneLength * matrix.a;
                    const y = boneLength * matrix.b;
                    const len = Math.sqrt(x * x + y * y);
                    if (isChainScaleMode) {
                        this._boneLengths[i] = len;
                    }
                    spaces[i + 1] = (boneLength + spacing) * len / boneLength;
                }
            }
            else {
                for (let i = 0; i < spacesCount; i++) {
                    spaces[i] = spacing;
                }
            }
            //
            this._computeBezierCurve(pathSlot._displayFrame.rawDisplayData, spacesCount, isTangentMode, positionMode === 1 /* Percent */, spacingMode === 2 /* Percent */);
            //根据新的节点数据重新采样
            const positions = this._positions;
            let rotateOffset = this.rotateOffset;
            let boneX = positions[0], boneY = positions[1];
            let tip;
            if (rotateOffset === 0) {
                tip = rotateMode === 1 /* Chain */;
            }
            else {
                tip = false;
                const bone = pathSlot.parent;
                if (bone !== null) {
                    const matrix = bone.globalTransformMatrix;
                    rotateOffset *= matrix.a * matrix.d - matrix.b * matrix.c > 0 ? dragonBones.Transform.DEG_RAD : -dragonBones.Transform.DEG_RAD;
                }
            }
            //
            const rotateWeight = this.rotateWeight;
            const xWeight = this.xWeight;
            const yWeight = this.yWeight;
            for (let i = 0, p = 3; i < boneCount; i++, p += 3) {
                let bone = bones[i];
                // TODO: 优化,这里可能会计算多遍
                bone.forceUpdateTransform();
                bone.updateByConstraint();
                let matrix = bone.globalTransformMatrix;
                matrix.tx += (boneX - matrix.tx) * xWeight;
                matrix.ty += (boneY - matrix.ty) * yWeight;
                const x = positions[p], y = positions[p + 1];
                const dx = x - boneX, dy = y - boneY;
                if (isChainScaleMode) {
                    const lenght = this._boneLengths[i];
                    const s = (Math.sqrt(dx * dx + dy * dy) / lenght - 1) * rotateWeight + 1;
                    matrix.a *= s;
                    matrix.b *= s;
                }
                boneX = x;
                boneY = y;
                if (rotateWeight > 0) {
                    let a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, r, cos, sin;
                    if (isTangentMode) {
                        r = positions[p - 1];
                    }
                    else {
                        r = Math.atan2(dy, dx);
                    }
                    r -= Math.atan2(b, a);
                    if (tip) {
                        cos = Math.cos(r);
                        sin = Math.sin(r);
                        const length = bone._boneData.length;
                        boneX += (length * (cos * a - sin * b) - dx) * rotateWeight;
                        boneY += (length * (sin * a + cos * b) - dy) * rotateWeight;
                    }
                    else {
                        r += rotateOffset;
                    }
                    if (r > dragonBones.Transform.PI) {
                        r -= dragonBones.Transform.PI_D;
                    }
                    else if (r < -dragonBones.Transform.PI) {
                        r += dragonBones.Transform.PI_D;
                    }
                    r *= rotateWeight;
                    cos = Math.cos(r);
                    sin = Math.sin(r);
                    matrix.a = cos * a - sin * b;
                    matrix.b = sin * a + cos * b;
                    matrix.c = cos * c - sin * d;
                    matrix.d = sin * c + cos * d;
                }
                bone.global.fromMatrix(matrix);
            }
            this.dirty = false;
        }
        invalidUpdate() {
        }
    }
    dragonBones.PathConstraint = PathConstraint;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - Worldclock provides clock support for animations, advance time for each IAnimatable object added to the instance.
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - WorldClock 对动画提供时钟支持，为每个加入到该实例的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class WorldClock {
        /**
         * - Creating a Worldclock instance. Typically, you do not need to create Worldclock instance.
         * When multiple Worldclock instances are running at different speeds, can achieving some specific animation effects, such as bullet time.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建一个 WorldClock 实例。通常并不需要创建 WorldClock 实例。
         * 当多个 WorldClock 实例使用不同的速度运行时，可以实现一些特殊的动画效果，比如子弹时间等。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(time = 0.0) {
            /**
             * - Current time. (In seconds)
             * @version DragonBones 3.0
             * @language en_US
             */
            /**
             * - 当前的时间。 (以秒为单位)
             * @version DragonBones 3.0
             * @language zh_CN
             */
            this.time = 0.0;
            /**
             * - The play speed, used to control animation speed-shift play.
             * [0: Stop play, (0~1): Slow play, 1: Normal play, (1~N): Fast play]
             * @default 1.0
             * @version DragonBones 3.0
             * @language en_US
             */
            /**
             * - 播放速度，用于控制动画变速播放。
             * [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * @default 1.0
             * @version DragonBones 3.0
             * @language zh_CN
             */
            this.timeScale = 1.0;
            this._systemTime = 0.0;
            this._animatebles = [];
            this._clock = null;
            this.time = time;
            this._systemTime = new Date().getTime() * 0.001;
        }
        /**
         * - Advance time for all IAnimatable instances.
         * @param passedTime - Passed time. [-1: Automatically calculates the time difference between the current frame and the previous frame, [0~N): Passed time] (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 为所有的 IAnimatable 实例更新时间。
         * @param passedTime - 前进的时间。 [-1: 自动计算当前帧与上一帧的时间差, [0~N): 前进的时间] (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        advanceTime(passedTime) {
            if (passedTime !== passedTime) {
                passedTime = 0.0;
            }
            const currentTime = Date.now() * 0.001;
            if (passedTime < 0.0) {
                passedTime = currentTime - this._systemTime;
            }
            this._systemTime = currentTime;
            if (this.timeScale !== 1.0) {
                passedTime *= this.timeScale;
            }
            if (passedTime === 0.0) {
                return;
            }
            if (passedTime < 0.0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }
            let i = 0, r = 0, l = this._animatebles.length;
            for (; i < l; ++i) {
                const animatable = this._animatebles[i];
                if (animatable !== null) {
                    if (r > 0) {
                        this._animatebles[i - r] = animatable;
                        this._animatebles[i] = null;
                    }
                    animatable.advanceTime(passedTime);
                }
                else {
                    r++;
                }
            }
            if (r > 0) {
                l = this._animatebles.length;
                for (; i < l; ++i) {
                    const animateble = this._animatebles[i];
                    if (animateble !== null) {
                        this._animatebles[i - r] = animateble;
                    }
                    else {
                        r++;
                    }
                }
                this._animatebles.length -= r;
            }
        }
        /**
         * - Check whether contains a specific instance of IAnimatable.
         * @param value - The IAnimatable instance.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含特定的 IAnimatable 实例。
         * @param value - IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        contains(value) {
            if (value === this) {
                return false;
            }
            let ancestor = value;
            while (ancestor !== this && ancestor !== null) {
                ancestor = ancestor.clock;
            }
            return ancestor === this;
        }
        /**
         * - Add IAnimatable instance.
         * @param value - The IAnimatable instance.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 添加 IAnimatable 实例。
         * @param value - IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        add(value) {
            if (this._animatebles.indexOf(value) < 0) {
                this._animatebles.push(value);
                value.clock = this;
            }
        }
        /**
         * - Removes a specified IAnimatable instance.
         * @param value - The IAnimatable instance.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 移除特定的 IAnimatable 实例。
         * @param value - IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        remove(value) {
            const index = this._animatebles.indexOf(value);
            if (index >= 0) {
                this._animatebles[index] = null;
                value.clock = null;
            }
        }
        /**
         * - Clear all IAnimatable instances.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        clear() {
            for (const animatable of this._animatebles) {
                if (animatable !== null) {
                    animatable.clock = null;
                }
            }
        }
        /**
         * @inheritDoc
         */
        get clock() {
            return this._clock;
        }
        set clock(value) {
            if (this._clock === value) {
                return;
            }
            if (this._clock !== null) {
                this._clock.remove(this);
            }
            this._clock = value;
            if (this._clock !== null) {
                this._clock.add(this);
            }
        }
    }
    dragonBones.WorldClock = WorldClock;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The animation player is used to play the animation data and manage the animation states.
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画播放器用来播放动画数据和管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Animation extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            this._animationNames = [];
            this._animationStates = [];
            this._animations = {};
            this._blendStates = {};
            this._animationConfig = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.Animation]";
        }
        _onClear() {
            for (const animationState of this._animationStates) {
                animationState.returnToPool();
            }
            for (let k in this._animations) {
                delete this._animations[k];
            }
            for (let k in this._blendStates) {
                const blendStates = this._blendStates[k];
                for (let kB in blendStates) {
                    blendStates[kB].returnToPool();
                }
                delete this._blendStates[k];
            }
            if (this._animationConfig !== null) {
                this._animationConfig.returnToPool();
            }
            this.timeScale = 1.0;
            this._animationDirty = false;
            this._inheritTimeScale = 1.0;
            this._animationNames.length = 0;
            this._animationStates.length = 0;
            //this._animations.clear();
            this._armature = null; //
            this._animationConfig = null; //
            this._lastAnimationState = null;
        }
        _fadeOut(animationConfig) {
            switch (animationConfig.fadeOutMode) {
                case 1 /* SameLayer */:
                    for (const animationState of this._animationStates) {
                        if (animationState._parent !== null) {
                            continue;
                        }
                        if (animationState.layer === animationConfig.layer) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;
                case 2 /* SameGroup */:
                    for (const animationState of this._animationStates) {
                        if (animationState._parent !== null) {
                            continue;
                        }
                        if (animationState.group === animationConfig.group) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;
                case 3 /* SameLayerAndGroup */:
                    for (const animationState of this._animationStates) {
                        if (animationState._parent !== null) {
                            continue;
                        }
                        if (animationState.layer === animationConfig.layer &&
                            animationState.group === animationConfig.group) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;
                case 4 /* All */:
                    for (const animationState of this._animationStates) {
                        if (animationState._parent !== null) {
                            continue;
                        }
                        animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                    }
                    break;
                case 5 /* Single */: // TODO
                default:
                    break;
            }
        }
        /**
         * @internal
         */
        init(armature) {
            if (this._armature !== null) {
                return;
            }
            this._armature = armature;
            this._animationConfig = dragonBones.BaseObject.borrowObject(dragonBones.AnimationConfig);
        }
        /**
         * @internal
         */
        advanceTime(passedTime) {
            if (passedTime < 0.0) { // Only animationState can reverse play.
                passedTime = -passedTime;
            }
            if (this._armature.inheritAnimation && this._armature._parent !== null) { // Inherit parent animation timeScale.
                this._inheritTimeScale = this._armature._parent._armature.animation._inheritTimeScale * this.timeScale;
            }
            else {
                this._inheritTimeScale = this.timeScale;
            }
            if (this._inheritTimeScale !== 1.0) {
                passedTime *= this._inheritTimeScale;
            }
            for (let k in this._blendStates) {
                const blendStates = this._blendStates[k];
                for (let kB in blendStates) {
                    blendStates[kB].reset();
                }
            }
            const animationStateCount = this._animationStates.length;
            if (animationStateCount === 1) {
                const animationState = this._animationStates[0];
                if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                    this._armature._dragonBones.bufferObject(animationState);
                    this._animationStates.length = 0;
                    this._lastAnimationState = null;
                }
                else {
                    const animationData = animationState.animationData;
                    const cacheFrameRate = animationData.cacheFrameRate;
                    if (this._animationDirty && cacheFrameRate > 0.0) { // Update cachedFrameIndices.
                        this._animationDirty = false;
                        for (const bone of this._armature.getBones()) {
                            bone._cachedFrameIndices = animationData.getBoneCachedFrameIndices(bone.name);
                        }
                        for (const slot of this._armature.getSlots()) {
                            if (slot.displayFrameCount > 0) {
                                const rawDisplayData = slot.getDisplayFrameAt(0).rawDisplayData;
                                if (rawDisplayData !== null &&
                                    rawDisplayData.parent === this._armature.armatureData.defaultSkin) {
                                    slot._cachedFrameIndices = animationData.getSlotCachedFrameIndices(slot.name);
                                    continue;
                                }
                            }
                            slot._cachedFrameIndices = null;
                        }
                    }
                    animationState.advanceTime(passedTime, cacheFrameRate);
                }
            }
            else if (animationStateCount > 1) {
                for (let i = 0, r = 0; i < animationStateCount; ++i) {
                    const animationState = this._animationStates[i];
                    if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                        r++;
                        this._armature._dragonBones.bufferObject(animationState);
                        this._animationDirty = true;
                        if (this._lastAnimationState === animationState) { // Update last animation state.
                            this._lastAnimationState = null;
                        }
                    }
                    else {
                        if (r > 0) {
                            this._animationStates[i - r] = animationState;
                        }
                        animationState.advanceTime(passedTime, 0.0);
                    }
                    if (i === animationStateCount - 1 && r > 0) { // Modify animation states size.
                        this._animationStates.length -= r;
                        if (this._lastAnimationState === null && this._animationStates.length > 0) {
                            this._lastAnimationState = this._animationStates[this._animationStates.length - 1];
                        }
                    }
                }
                this._armature._cacheFrameIndex = -1;
            }
            else {
                this._armature._cacheFrameIndex = -1;
            }
        }
        /**
         * - Clear all animations states.
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除所有的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        reset() {
            for (const animationState of this._animationStates) {
                animationState.returnToPool();
            }
            this._animationDirty = false;
            this._animationConfig.clear();
            this._animationStates.length = 0;
            this._lastAnimationState = null;
        }
        /**
         * - Pause a specific animation state.
         * @param animationName - The name of animation state. (If not set, it will pause all animations)
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 暂停指定动画状态的播放。
         * @param animationName - 动画状态名称。 （如果未设置，则暂停所有动画）
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        stop(animationName = null) {
            if (animationName !== null) {
                const animationState = this.getState(animationName);
                if (animationState !== null) {
                    animationState.stop();
                }
            }
            else {
                for (const animationState of this._animationStates) {
                    animationState.stop();
                }
            }
        }
        /**
         * - Play animation with a specific animation config.
         * The API is still in the experimental phase and may encounter bugs or stability or compatibility issues when used.
         * @param animationConfig - The animation config.
         * @returns The playing animation state.
         * @see dragonBones.AnimationConfig
         * @beta
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 通过指定的动画配置来播放动画。
         * 该 API 仍在实验阶段，使用时可能遭遇 bug 或稳定性或兼容性问题。
         * @param animationConfig - 动画配置。
         * @returns 播放的动画状态。
         * @see dragonBones.AnimationConfig
         * @beta
         * @version DragonBones 5.0
         * @language zh_CN
         */
        playConfig(animationConfig) {
            const animationName = animationConfig.animation;
            if (!(animationName in this._animations)) {
                console.warn("Non-existent animation.\n", "DragonBones name: " + this._armature.armatureData.parent.name, "Armature name: " + this._armature.name, "Animation name: " + animationName);
                return null;
            }
            const animationData = this._animations[animationName];
            if (animationConfig.fadeOutMode === 5 /* Single */) {
                for (const animationState of this._animationStates) {
                    if (animationState._fadeState < 1 &&
                        animationState.layer === animationConfig.layer &&
                        animationState.animationData === animationData) {
                        return animationState;
                    }
                }
            }
            if (this._animationStates.length === 0) {
                animationConfig.fadeInTime = 0.0;
            }
            else if (animationConfig.fadeInTime < 0.0) {
                animationConfig.fadeInTime = animationData.fadeInTime;
            }
            if (animationConfig.fadeOutTime < 0.0) {
                animationConfig.fadeOutTime = animationConfig.fadeInTime;
            }
            if (animationConfig.timeScale <= -100.0) {
                animationConfig.timeScale = 1.0 / animationData.scale;
            }
            if (animationData.frameCount > 0) {
                if (animationConfig.position < 0.0) {
                    animationConfig.position %= animationData.duration;
                    animationConfig.position = animationData.duration - animationConfig.position;
                }
                else if (animationConfig.position === animationData.duration) {
                    animationConfig.position -= 0.000001; // Play a little time before end.
                }
                else if (animationConfig.position > animationData.duration) {
                    animationConfig.position %= animationData.duration;
                }
                if (animationConfig.duration > 0.0 && animationConfig.position + animationConfig.duration > animationData.duration) {
                    animationConfig.duration = animationData.duration - animationConfig.position;
                }
                if (animationConfig.playTimes < 0) {
                    animationConfig.playTimes = animationData.playTimes;
                }
            }
            else {
                animationConfig.playTimes = 1;
                animationConfig.position = 0.0;
                if (animationConfig.duration > 0.0) {
                    animationConfig.duration = 0.0;
                }
            }
            if (animationConfig.duration === 0.0) {
                animationConfig.duration = -1.0;
            }
            this._fadeOut(animationConfig);
            //
            const animationState = dragonBones.BaseObject.borrowObject(dragonBones.AnimationState);
            animationState.init(this._armature, animationData, animationConfig);
            this._animationDirty = true;
            this._armature._cacheFrameIndex = -1;
            if (this._animationStates.length > 0) { // Sort animation state.
                let added = false;
                for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                    if (animationState.layer > this._animationStates[i].layer) {
                        added = true;
                        this._animationStates.splice(i, 0, animationState);
                        break;
                    }
                    else if (i !== l - 1 && animationState.layer > this._animationStates[i + 1].layer) {
                        added = true;
                        this._animationStates.splice(i + 1, 0, animationState);
                        break;
                    }
                }
                if (!added) {
                    this._animationStates.push(animationState);
                }
            }
            else {
                this._animationStates.push(animationState);
            }
            for (const slot of this._armature.getSlots()) { // Child armature play same name animation.
                const childArmature = slot.childArmature;
                if (childArmature !== null && childArmature.inheritAnimation &&
                    childArmature.animation.hasAnimation(animationName) &&
                    childArmature.animation.getState(animationName) === null) {
                    childArmature.animation.fadeIn(animationName); //
                }
            }
            for (let k in animationData.animationTimelines) { // Blend animation node.
                const childAnimationState = this.fadeIn(k, 0.0, 1, animationState.layer, "", 5 /* Single */);
                if (childAnimationState === null) {
                    continue;
                }
                const timelines = animationData.animationTimelines[k];
                childAnimationState.actionEnabled = false;
                childAnimationState.resetToPose = false;
                childAnimationState.stop();
                animationState.addState(childAnimationState, timelines);
                //
                const index = this._animationStates.indexOf(animationState);
                const childIndex = this._animationStates.indexOf(childAnimationState);
                if (childIndex < index) {
                    this._animationStates.splice(index, 1);
                    this._animationStates.splice(childIndex, 0, animationState);
                }
            }
            // if (!this._armature._lockUpdate && animationConfig.fadeInTime <= 0.0) { // Blend animation state, update armature.
            //     this._armature.advanceTime(0.0);
            // }
            this._lastAnimationState = animationState;
            return animationState;
        }
        /**
         * - Play a specific animation.
         * @param animationName - The name of animation data. (If not set, The default animation will be played, or resume the animation playing from pause status, or replay the last playing animation)
         * @param playTimes - Playing repeat times. [-1: Use default value of the animation data, 0: No end loop playing, [1~N]: Repeat N times] (default: -1)
         * @returns The playing animation state.
         * @example
         * <pre>
         *     armature.animation.play("walk");
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 播放指定动画。
         * @param animationName - 动画数据名称。 （如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放之前播放的动画）
         * @param playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @example
         * <pre>
         *     armature.animation.play("walk");
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        play(animationName = null, playTimes = -1) {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName !== null ? animationName : "";
            if (animationName !== null && animationName.length > 0) {
                this.playConfig(this._animationConfig);
            }
            else if (this._lastAnimationState === null) {
                const defaultAnimation = this._armature.armatureData.defaultAnimation;
                if (defaultAnimation !== null) {
                    this._animationConfig.animation = defaultAnimation.name;
                    this.playConfig(this._animationConfig);
                }
            }
            else if (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted) {
                this._lastAnimationState.play();
            }
            else {
                this._animationConfig.animation = this._lastAnimationState.name;
                this.playConfig(this._animationConfig);
            }
            return this._lastAnimationState;
        }
        /**
         * - Fade in a specific animation.
         * @param animationName - The name of animation data.
         * @param fadeInTime - The fade in time. [-1: Use the default value of animation data, [0~N]: The fade in time (In seconds)] (Default: -1)
         * @param playTimes - playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @param layer - The blending layer, the animation states in high level layer will get the blending weights with high priority, when the total blending weights are more than 1.0, there will be no more weights can be allocated to the other animation states. (Default: 0)
         * @param group - The blending group name, it is typically used to specify the substitution of multiple animation states blending. (Default: null)
         * @param fadeOutMode - The fade out mode, which is typically used to specify alternate mode of multiple animation states blending. (Default: AnimationFadeOutMode.SameLayerAndGroup)
         * @returns The playing animation state.
         * @example
         * <pre>
         *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
         *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 淡入播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param fadeInTime - 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间 (以秒为单位)] （默认: -1）
         * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @param layer - 混合图层，图层高的动画状态会优先获取混合权重，当混合权重分配总和超过 1.0 时，剩余的动画状态将不能再获得权重分配。 （默认: 0）
         * @param group - 混合组名称，该属性通常用来指定多个动画状态混合时的相互替换关系。 （默认: null）
         * @param fadeOutMode - 淡出模式，该属性通常用来指定多个动画状态混合时的相互替换模式。 （默认: AnimationFadeOutMode.SameLayerAndGroup）
         * @returns 播放的动画状态。
         * @example
         * <pre>
         *     armature.animation.fadeIn("walk", 0.3, 0, 0, "normalGroup").resetToPose = false;
         *     armature.animation.fadeIn("attack", 0.3, 1, 0, "attackGroup").resetToPose = false;
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        fadeIn(animationName, fadeInTime = -1.0, playTimes = -1, layer = 0, group = null, fadeOutMode = 3 /* SameLayerAndGroup */) {
            this._animationConfig.clear();
            this._animationConfig.fadeOutMode = fadeOutMode;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.layer = layer;
            this._animationConfig.fadeInTime = fadeInTime;
            this._animationConfig.animation = animationName;
            this._animationConfig.group = group !== null ? group : "";
            return this.playConfig(this._animationConfig);
        }
        /**
         * - Play a specific animation from the specific time.
         * @param animationName - The name of animation data.
         * @param time - The start time point of playing. (In seconds)
         * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从指定时间开始播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param time - 播放开始的时间。 (以秒为单位)
         * @param playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByTime(animationName, time = 0.0, playTimes = -1) {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.position = time;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName;
            return this.playConfig(this._animationConfig);
        }
        /**
         * - Play a specific animation from the specific frame.
         * @param animationName - The name of animation data.
         * @param frame - The start frame of playing.
         * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从指定帧开始播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param frame - 播放开始的帧数。
         * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByFrame(animationName, frame = 0, playTimes = -1) {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName;
            const animationData = animationName in this._animations ? this._animations[animationName] : null;
            if (animationData !== null) {
                this._animationConfig.position = animationData.frameCount > 0 ? animationData.duration * frame / animationData.frameCount : 0.0;
            }
            return this.playConfig(this._animationConfig);
        }
        /**
         * - Play a specific animation from the specific progress.
         * @param animationName - The name of animation data.
         * @param progress - The start progress value of playing.
         * @param playTimes - Playing repeat times. [-1: Use the default value of animation data, 0: No end loop playing, [1~N]: Repeat N times] (Default: -1)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 从指定进度开始播放指定的动画。
         * @param animationName - 动画数据名称。
         * @param progress - 开始播放的进度。
         * @param playTimes - 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByProgress(animationName, progress = 0.0, playTimes = -1) {
            this._animationConfig.clear();
            this._animationConfig.resetToPose = true;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animation = animationName;
            const animationData = animationName in this._animations ? this._animations[animationName] : null;
            if (animationData !== null) {
                this._animationConfig.position = animationData.duration * (progress > 0.0 ? progress : 0.0);
            }
            return this.playConfig(this._animationConfig);
        }
        /**
         * - Stop a specific animation at the specific time.
         * @param animationName - The name of animation data.
         * @param time - The stop time. (In seconds)
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 在指定时间停止指定动画播放
         * @param animationName - 动画数据名称。
         * @param time - 停止的时间。 (以秒为单位)
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByTime(animationName, time = 0.0) {
            const animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState !== null) {
                animationState.stop();
            }
            return animationState;
        }
        /**
         * - Stop a specific animation at the specific frame.
         * @param animationName - The name of animation data.
         * @param frame - The stop frame.
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 在指定帧停止指定动画的播放
         * @param animationName - 动画数据名称。
         * @param frame - 停止的帧数。
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByFrame(animationName, frame = 0) {
            const animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
            if (animationState !== null) {
                animationState.stop();
            }
            return animationState;
        }
        /**
         * - Stop a specific animation at the specific progress.
         * @param animationName - The name of animation data.
         * @param progress - The stop progress value.
         * @returns The played animation state.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 在指定的进度停止指定的动画播放。
         * @param animationName - 动画数据名称。
         * @param progress - 停止进度。
         * @returns 播放的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByProgress(animationName, progress = 0.0) {
            const animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState !== null) {
                animationState.stop();
            }
            return animationState;
        }
        /**
         * @internal
         */
        getBlendState(type, name, target) {
            if (!(type in this._blendStates)) {
                this._blendStates[type] = {};
            }
            const blendStates = this._blendStates[type];
            if (!(name in blendStates)) {
                const blendState = blendStates[name] = dragonBones.BaseObject.borrowObject(dragonBones.BlendState);
                blendState.target = target;
            }
            return blendStates[name];
        }
        /**
         * - Get a specific animation state.
         * @param animationName - The name of animation state.
         * @param layer - The layer of find animation states. [-1: Find all layers, [0~N]: Specified layer] (default: -1)
         * @example
         * <pre>
         *     armature.animation.play("walk");
         *     let walkState = armature.animation.getState("walk");
         *     walkState.timeScale = 0.5;
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取指定的动画状态。
         * @param animationName - 动画状态名称。
         * @param layer - 查找动画状态的层级。 [-1: 查找所有层级, [0~N]: 指定层级] （默认: -1）
         * @example
         * <pre>
         *     armature.animation.play("walk");
         *     let walkState = armature.animation.getState("walk");
         *     walkState.timeScale = 0.5;
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getState(animationName, layer = -1) {
            let i = this._animationStates.length;
            while (i--) {
                const animationState = this._animationStates[i];
                if (animationState.name === animationName && (layer < 0 || animationState.layer === layer)) {
                    return animationState;
                }
            }
            return null;
        }
        /**
         * - Check whether a specific animation data is included.
         * @param animationName - The name of animation data.
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含指定的动画数据
         * @param animationName - 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        hasAnimation(animationName) {
            return animationName in this._animations;
        }
        /**
         * - Get all the animation states.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 获取所有的动画状态
         * @version DragonBones 5.1
         * @language zh_CN
         */
        getStates() {
            return this._animationStates;
        }
        /**
         * - Check whether there is an animation state is playing
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否有动画状态正在播放
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get isPlaying() {
            for (const animationState of this._animationStates) {
                if (animationState.isPlaying) {
                    return true;
                }
            }
            return false;
        }
        /**
         * - Check whether all the animation states' playing were finished.
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否所有的动画状态均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get isCompleted() {
            for (const animationState of this._animationStates) {
                if (!animationState.isCompleted) {
                    return false;
                }
            }
            return this._animationStates.length > 0;
        }
        /**
         * - The name of the last playing animation state.
         * @see #lastAnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 上一个播放的动画状态名称
         * @see #lastAnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get lastAnimationName() {
            return this._lastAnimationState !== null ? this._lastAnimationState.name : "";
        }
        /**
         * - The name of all animation data
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 所有动画数据的名称
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get animationNames() {
            return this._animationNames;
        }
        /**
         * - All animation data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 所有的动画数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get animations() {
            return this._animations;
        }
        set animations(value) {
            if (this._animations === value) {
                return;
            }
            this._animationNames.length = 0;
            for (let k in this._animations) {
                delete this._animations[k];
            }
            for (let k in value) {
                this._animationNames.push(k);
                this._animations[k] = value[k];
            }
        }
        /**
         * - An AnimationConfig instance that can be used quickly.
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 一个可以快速使用的动画配置实例。
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @language zh_CN
         */
        get animationConfig() {
            this._animationConfig.clear();
            return this._animationConfig;
        }
        /**
         * - The last playing animation state
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 上一个播放的动画状态
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get lastAnimationState() {
            return this._lastAnimationState;
        }
    }
    dragonBones.Animation = Animation;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The animation state is generated when the animation data is played.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画状态由播放动画数据时产生。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class AnimationState extends dragonBones.BaseObject {
        constructor() {
            super(...arguments);
            this._boneMask = [];
            this._boneTimelines = [];
            this._boneBlendTimelines = [];
            this._slotTimelines = [];
            this._slotBlendTimelines = [];
            this._constraintTimelines = [];
            this._animationTimelines = [];
            this._poseTimelines = [];
            /**
             * @internal
             */
            this._actionTimeline = null; // Initial value.
            this._zOrderTimeline = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.AnimationState]";
        }
        _onClear() {
            for (const timeline of this._boneTimelines) {
                timeline.returnToPool();
            }
            for (const timeline of this._boneBlendTimelines) {
                timeline.returnToPool();
            }
            for (const timeline of this._slotTimelines) {
                timeline.returnToPool();
            }
            for (const timeline of this._slotBlendTimelines) {
                timeline.returnToPool();
            }
            for (const timeline of this._constraintTimelines) {
                timeline.returnToPool();
            }
            for (const timeline of this._animationTimelines) {
                const animationState = timeline.target;
                if (animationState._parent === this) {
                    animationState._fadeState = 1;
                    animationState._subFadeState = 1;
                    animationState._parent = null;
                }
                timeline.returnToPool();
            }
            if (this._actionTimeline !== null) {
                this._actionTimeline.returnToPool();
            }
            if (this._zOrderTimeline !== null) {
                this._zOrderTimeline.returnToPool();
            }
            this.actionEnabled = false;
            this.additive = false;
            this.displayControl = false;
            this.resetToPose = false;
            this.blendType = 0 /* None */;
            this.playTimes = 1;
            this.layer = 0;
            this.timeScale = 1.0;
            this._weight = 1.0;
            this.parameterX = 0.0;
            this.parameterY = 0.0;
            this.positionX = 0.0;
            this.positionY = 0.0;
            this.autoFadeOutTime = 0.0;
            this.fadeTotalTime = 0.0;
            this.name = "";
            this.group = "";
            this._timelineDirty = 2;
            this._playheadState = 0;
            this._fadeState = -1;
            this._subFadeState = -1;
            this._position = 0.0;
            this._duration = 0.0;
            this._fadeTime = 0.0;
            this._time = 0.0;
            this._fadeProgress = 0.0;
            this._weightResult = 0.0;
            this._boneMask.length = 0;
            this._boneTimelines.length = 0;
            this._boneBlendTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._slotBlendTimelines.length = 0;
            this._constraintTimelines.length = 0;
            this._animationTimelines.length = 0;
            this._poseTimelines.length = 0;
            // this._bonePoses.clear();
            this._animationData = null; //
            this._armature = null; //
            this._actionTimeline = null; //
            this._zOrderTimeline = null;
            this._activeChildA = null;
            this._activeChildB = null;
            this._parent = null;
        }
        _updateTimelines() {
            { // Update constraint timelines.
                for (const constraint of this._armature._constraints) {
                    const timelineDatas = this._animationData.getConstraintTimelines(constraint.name);
                    if (timelineDatas !== null) {
                        for (const timelineData of timelineDatas) {
                            switch (timelineData.type) {
                                case 30 /* IKConstraint */: {
                                    const timeline = dragonBones.BaseObject.borrowObject(dragonBones.IKConstraintTimelineState);
                                    timeline.target = constraint;
                                    timeline.init(this._armature, this, timelineData);
                                    this._constraintTimelines.push(timeline);
                                    break;
                                }
                                case 31 /* PathConstraintPosition */: {
                                    const timeline = dragonBones.BaseObject.borrowObject(dragonBones.PathConstraintPositionTimelineState);
                                    timeline.target = constraint;
                                    timeline.init(this._armature, this, timelineData);
                                    this._constraintTimelines.push(timeline);
                                    break;
                                }
                                case 32 /* PathConstraintSpacing */: {
                                    const timeline = dragonBones.BaseObject.borrowObject(dragonBones.PathConstraintSpacingTimelineState);
                                    timeline.target = constraint;
                                    timeline.init(this._armature, this, timelineData);
                                    this._constraintTimelines.push(timeline);
                                    break;
                                }
                                case 33 /* PathConstraintWeight */: {
                                    const timeline = dragonBones.BaseObject.borrowObject(dragonBones.PathConstraintWeightTimelineState);
                                    timeline.target = constraint;
                                    timeline.init(this._armature, this, timelineData);
                                    this._constraintTimelines.push(timeline);
                                    break;
                                }
                                default:
                                    break;
                            }
                        }
                    }
                    else if (this.resetToPose) { // Pose timeline.
                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.IKConstraintTimelineState);
                        timeline.target = constraint;
                        timeline.init(this._armature, this, null);
                        this._constraintTimelines.push(timeline);
                        this._poseTimelines.push(timeline);
                    }
                }
            }
        }
        _updateBoneAndSlotTimelines() {
            { // Update bone and surface timelines.
                const boneTimelines = {};
                // Create bone timelines map.
                for (const timeline of this._boneTimelines) {
                    const timelineName = timeline.target.target.name;
                    if (!(timelineName in boneTimelines)) {
                        boneTimelines[timelineName] = [];
                    }
                    boneTimelines[timelineName].push(timeline);
                }
                for (const timeline of this._boneBlendTimelines) {
                    const timelineName = timeline.target.target.name;
                    if (!(timelineName in boneTimelines)) {
                        boneTimelines[timelineName] = [];
                    }
                    boneTimelines[timelineName].push(timeline);
                }
                //
                for (const bone of this._armature.getBones()) {
                    const timelineName = bone.name;
                    if (!this.containsBoneMask(timelineName)) {
                        continue;
                    }
                    if (timelineName in boneTimelines) { // Remove bone timeline from map.
                        delete boneTimelines[timelineName];
                    }
                    else { // Create new bone timeline.
                        const timelineDatas = this._animationData.getBoneTimelines(timelineName);
                        const blendState = this._armature.animation.getBlendState(BlendState.BONE_TRANSFORM, bone.name, bone);
                        if (timelineDatas !== null) {
                            for (const timelineData of timelineDatas) {
                                switch (timelineData.type) {
                                    case 10 /* BoneAll */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneAllTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }
                                    case 11 /* BoneTranslate */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneTranslateTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }
                                    case 12 /* BoneRotate */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneRotateTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }
                                    case 13 /* BoneScale */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneScaleTimelineState);
                                        timeline.target = blendState;
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneTimelines.push(timeline);
                                        break;
                                    }
                                    case 60 /* BoneAlpha */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.AlphaTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.BONE_ALPHA, bone.name, bone);
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneBlendTimelines.push(timeline);
                                        break;
                                    }
                                    case 50 /* Surface */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.SurfaceTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.SURFACE, bone.name, bone);
                                        timeline.init(this._armature, this, timelineData);
                                        this._boneBlendTimelines.push(timeline);
                                        break;
                                    }
                                    default:
                                        break;
                                }
                            }
                        }
                        else if (this.resetToPose) { // Pose timeline.
                            if (bone._boneData.type === 0 /* Bone */) {
                                const timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneAllTimelineState);
                                timeline.target = blendState;
                                timeline.init(this._armature, this, null);
                                this._boneTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }
                            else {
                                const timeline = dragonBones.BaseObject.borrowObject(dragonBones.SurfaceTimelineState);
                                timeline.target = this._armature.animation.getBlendState(BlendState.SURFACE, bone.name, bone);
                                timeline.init(this._armature, this, null);
                                this._boneBlendTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }
                        }
                    }
                }
                for (let k in boneTimelines) { // Remove bone timelines.
                    for (const timeline of boneTimelines[k]) {
                        let index = this._boneTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._boneTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }
                        index = this._boneBlendTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._boneBlendTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }
                    }
                }
            }
            { // Update slot timelines.
                const slotTimelines = {};
                const ffdFlags = [];
                const shapeFlags = [];
                // Create slot timelines map.
                for (const timeline of this._slotTimelines) {
                    const timelineName = timeline.target.name;
                    if (!(timelineName in slotTimelines)) {
                        slotTimelines[timelineName] = [];
                    }
                    slotTimelines[timelineName].push(timeline);
                }
                for (const timeline of this._slotBlendTimelines) {
                    const timelineName = timeline.target.target.name;
                    if (!(timelineName in slotTimelines)) {
                        slotTimelines[timelineName] = [];
                    }
                    slotTimelines[timelineName].push(timeline);
                }
                //
                for (const slot of this._armature.getSlots()) {
                    const boneName = slot.parent.name;
                    if (!this.containsBoneMask(boneName)) {
                        continue;
                    }
                    const timelineName = slot.name;
                    if (timelineName in slotTimelines) { // Remove slot timeline from map.
                        delete slotTimelines[timelineName];
                    }
                    else { // Create new slot timeline.
                        let displayIndexFlag = false;
                        let colorFlag = false;
                        ffdFlags.length = 0;
                        shapeFlags.length = 0;
                        const timelineDatas = this._animationData.getSlotTimelines(timelineName);
                        if (timelineDatas !== null) {
                            for (const timelineData of timelineDatas) {
                                switch (timelineData.type) {
                                    case 20 /* SlotDisplay */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotDisplayTimelineState);
                                        timeline.target = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        displayIndexFlag = true;
                                        break;
                                    }
                                    case 23 /* SlotZIndex */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotZIndexTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_Z_INDEX, slot.name, slot);
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotBlendTimelines.push(timeline);
                                        break;
                                    }
                                    case 21 /* SlotColor */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotColorTimelineState);
                                        timeline.target = slot;
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotTimelines.push(timeline);
                                        colorFlag = true;
                                        break;
                                    }
                                    case 22 /* SlotDeform */: {
                                        const dragonBonesData = this._animationData.parent.parent;
                                        const timelineArray = dragonBonesData.timelineArray;
                                        const frameIntOffset = this._animationData.frameIntOffset + timelineArray[timelineData.offset + 5 /* TimelineFrameValueCount */];
                                        const frameIntArray = dragonBonesData.frameIntArray;
                                        let geometryOffset = frameIntArray[frameIntOffset + 0 /* DeformVertexOffset */];
                                        if (geometryOffset < 0) {
                                            geometryOffset += 65536; // Fixed out of bounds bug. 
                                        }
                                        for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                                            const displayFrame = slot.getDisplayFrameAt(i);
                                            const geometryData = displayFrame.getGeometryData();
                                            if (geometryData === null) {
                                                continue;
                                            }
                                            if (geometryData.offset === geometryOffset) {
                                                const timeline = dragonBones.BaseObject.borrowObject(dragonBones.DeformTimelineState);
                                                timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_DEFORM, displayFrame.rawDisplayData.name, slot);
                                                timeline.displayFrame = displayFrame;
                                                timeline.init(this._armature, this, timelineData);
                                                this._slotBlendTimelines.push(timeline);
                                                displayFrame.updateDeformVertices();
                                                ffdFlags.push(geometryOffset);
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                    case 24 /* SlotAlpha */: {
                                        const timeline = dragonBones.BaseObject.borrowObject(dragonBones.AlphaTimelineState);
                                        timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_ALPHA, slot.name, slot);
                                        timeline.init(this._armature, this, timelineData);
                                        this._slotBlendTimelines.push(timeline);
                                        break;
                                    }
                                    case 25 /* SlotShape */: {
                                        const dragonBonesData = this._animationData.parent.parent;
                                        const timelineArray = dragonBonesData.timelineArray;
                                        const frameIntOffset = this._animationData.frameIntOffset + timelineArray[timelineData.offset + 5 /* TimelineFrameValueCount */];
                                        const frameIntArray = dragonBonesData.frameIntArray;
                                        let shapeVerticesOffset = frameIntArray[frameIntOffset + 0 /* ShapeVerticesOffset */];
                                        if (shapeVerticesOffset < 0) {
                                            shapeVerticesOffset += 65536; // Fixed out of bounds bug. 
                                        }
                                        for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                                            const displayFrame = slot.getDisplayFrameAt(i);
                                            const shapeData = displayFrame.getShapeData();
                                            if (shapeData === null) {
                                                continue;
                                            }
                                            if (shapeData.offset === shapeVerticesOffset) {
                                                const timeline = dragonBones.BaseObject.borrowObject(dragonBones.ShapeTimelineState);
                                                timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_SHAPE, displayFrame.rawDisplayData.name, slot);
                                                timeline.displayFrame = displayFrame;
                                                timeline.init(this._armature, this, timelineData);
                                                this._slotBlendTimelines.push(timeline);
                                                displayFrame.updateShapeVertices();
                                                shapeFlags.push(shapeVerticesOffset);
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                    default:
                                        break;
                                }
                            }
                        }
                        if (this.resetToPose) { // Pose timeline.
                            if (!displayIndexFlag) {
                                const timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotDisplayTimelineState);
                                timeline.target = slot;
                                timeline.init(this._armature, this, null);
                                this._slotTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }
                            if (!colorFlag) {
                                const timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotColorTimelineState);
                                timeline.target = slot;
                                timeline.init(this._armature, this, null);
                                this._slotTimelines.push(timeline);
                                this._poseTimelines.push(timeline);
                            }
                            for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                                const displayFrame = slot.getDisplayFrameAt(i);
                                if (displayFrame.deformVertices.length === 0) {
                                    continue;
                                }
                                const geometryData = displayFrame.getGeometryData();
                                if (geometryData !== null && ffdFlags.indexOf(geometryData.offset) < 0) {
                                    const timeline = dragonBones.BaseObject.borrowObject(dragonBones.DeformTimelineState);
                                    timeline.displayFrame = displayFrame; //
                                    timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_DEFORM, slot.name, slot);
                                    timeline.init(this._armature, this, null);
                                    this._slotBlendTimelines.push(timeline);
                                    this._poseTimelines.push(timeline);
                                }
                                const shapeData = displayFrame.getShapeData();
                                if (shapeData !== null && shapeFlags.indexOf(shapeData.offset) < 0) {
                                    const timeline = dragonBones.BaseObject.borrowObject(dragonBones.ShapeTimelineState);
                                    timeline.displayFrame = displayFrame; //
                                    timeline.target = this._armature.animation.getBlendState(BlendState.SLOT_SHAPE, slot.name, slot);
                                    timeline.init(this._armature, this, null);
                                    this._slotBlendTimelines.push(timeline);
                                    this._poseTimelines.push(timeline);
                                }
                            }
                        }
                    }
                }
                for (let k in slotTimelines) { // Remove slot timelines.
                    for (const timeline of slotTimelines[k]) {
                        let index = this._slotTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._slotTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }
                        index = this._slotBlendTimelines.indexOf(timeline);
                        if (index >= 0) {
                            this._slotBlendTimelines.splice(index, 1);
                            timeline.returnToPool();
                        }
                    }
                }
            }
        }
        _advanceFadeTime(passedTime) {
            const isFadeOut = this._fadeState > 0;
            if (this._subFadeState < 0) { // Fade start event.
                this._subFadeState = 0;
                const eventActive = this._parent === null && this.actionEnabled;
                if (eventActive) {
                    const eventType = isFadeOut ? dragonBones.EventObject.FADE_OUT : dragonBones.EventObject.FADE_IN;
                    if (this._armature.eventDispatcher.hasDBEventListener(eventType)) {
                        const eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.type = eventType;
                        eventObject.armature = this._armature;
                        eventObject.animationState = this;
                        this._armature._dragonBones.bufferEvent(eventObject);
                    }
                }
            }
            if (passedTime < 0.0) {
                passedTime = -passedTime;
            }
            this._fadeTime += passedTime;
            if (this._fadeTime >= this.fadeTotalTime) { // Fade complete.
                this._subFadeState = 1;
                this._fadeProgress = isFadeOut ? 0.0 : 1.0;
            }
            else if (this._fadeTime > 0.0) { // Fading.
                this._fadeProgress = isFadeOut ? (1.0 - this._fadeTime / this.fadeTotalTime) : (this._fadeTime / this.fadeTotalTime);
            }
            else { // Before fade.
                this._fadeProgress = isFadeOut ? 1.0 : 0.0;
            }
            if (this._subFadeState > 0) { // Fade complete event.
                if (!isFadeOut) {
                    this._playheadState |= 1; // x1
                    this._fadeState = 0;
                }
                const eventActive = this._parent === null && this.actionEnabled;
                if (eventActive) {
                    const eventType = isFadeOut ? dragonBones.EventObject.FADE_OUT_COMPLETE : dragonBones.EventObject.FADE_IN_COMPLETE;
                    if (this._armature.eventDispatcher.hasDBEventListener(eventType)) {
                        const eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.type = eventType;
                        eventObject.armature = this._armature;
                        eventObject.animationState = this;
                        this._armature._dragonBones.bufferEvent(eventObject);
                    }
                }
            }
        }
        /**
         * @internal
         */
        init(armature, animationData, animationConfig) {
            if (this._armature !== null) {
                return;
            }
            this._armature = armature;
            this._animationData = animationData;
            //
            this.resetToPose = animationConfig.resetToPose;
            this.additive = animationConfig.additive;
            this.displayControl = animationConfig.displayControl;
            this.actionEnabled = animationConfig.actionEnabled;
            this.blendType = animationData.blendType;
            this.layer = animationConfig.layer;
            this.playTimes = animationConfig.playTimes;
            this.timeScale = animationConfig.timeScale;
            this.fadeTotalTime = animationConfig.fadeInTime;
            this.autoFadeOutTime = animationConfig.autoFadeOutTime;
            this.name = animationConfig.name.length > 0 ? animationConfig.name : animationConfig.animation;
            this.group = animationConfig.group;
            //
            this._weight = animationConfig.weight;
            if (animationConfig.pauseFadeIn) {
                this._playheadState = 2; // 10
            }
            else {
                this._playheadState = 3; // 11
            }
            if (animationConfig.duration < 0.0) {
                this._position = 0.0;
                this._duration = this._animationData.duration;
                if (animationConfig.position !== 0.0) {
                    if (this.timeScale >= 0.0) {
                        this._time = animationConfig.position;
                    }
                    else {
                        this._time = animationConfig.position - this._duration;
                    }
                }
                else {
                    this._time = 0.0;
                }
            }
            else {
                this._position = animationConfig.position;
                this._duration = animationConfig.duration;
                this._time = 0.0;
            }
            if (this.timeScale < 0.0 && this._time === 0.0) {
                this._time = -0.000001; // Turn to end.
            }
            if (this.fadeTotalTime <= 0.0) {
                this._fadeProgress = 0.999999; // Make different.
            }
            if (animationConfig.boneMask.length > 0) {
                this._boneMask.length = animationConfig.boneMask.length;
                for (let i = 0, l = this._boneMask.length; i < l; ++i) {
                    this._boneMask[i] = animationConfig.boneMask[i];
                }
            }
            this._actionTimeline = dragonBones.BaseObject.borrowObject(dragonBones.ActionTimelineState);
            this._actionTimeline.init(this._armature, this, this._animationData.actionTimeline);
            this._actionTimeline.currentTime = this._time;
            if (this._actionTimeline.currentTime < 0.0) {
                this._actionTimeline.currentTime = this._duration - this._actionTimeline.currentTime;
            }
            if (this._animationData.zOrderTimeline !== null) {
                this._zOrderTimeline = dragonBones.BaseObject.borrowObject(dragonBones.ZOrderTimelineState);
                this._zOrderTimeline.init(this._armature, this, this._animationData.zOrderTimeline);
            }
        }
        /**
         * @internal
         */
        advanceTime(passedTime, cacheFrameRate) {
            // Update fade time.
            if (this._fadeState !== 0 || this._subFadeState !== 0) {
                this._advanceFadeTime(passedTime);
            }
            // Update time.
            if (this._playheadState === 3) { // 11
                if (this.timeScale !== 1.0) {
                    passedTime *= this.timeScale;
                }
                this._time += passedTime;
            }
            // Update timeline.
            if (this._timelineDirty !== 0) {
                if (this._timelineDirty === 2) {
                    this._updateTimelines();
                }
                this._timelineDirty = 0;
                this._updateBoneAndSlotTimelines();
            }
            const isBlendDirty = this._fadeState !== 0 || this._subFadeState === 0;
            const isCacheEnabled = this._fadeState === 0 && cacheFrameRate > 0.0;
            let isUpdateTimeline = true;
            let isUpdateBoneTimeline = true;
            let time = this._time;
            this._weightResult = this._weight * this._fadeProgress;
            if (this._parent !== null) {
                this._weightResult *= this._parent._weightResult;
            }
            if (this._actionTimeline.playState <= 0) { // Update main timeline.
                this._actionTimeline.update(time);
            }
            if (this._weight === 0.0) {
                return;
            }
            if (isCacheEnabled) { // Cache time internval.
                const internval = cacheFrameRate * 2.0;
                this._actionTimeline.currentTime = Math.floor(this._actionTimeline.currentTime * internval) / internval;
            }
            if (this._zOrderTimeline !== null && this._zOrderTimeline.playState <= 0) { // Update zOrder timeline.
                this._zOrderTimeline.update(time);
            }
            if (isCacheEnabled) { // Update cache.
                const cacheFrameIndex = Math.floor(this._actionTimeline.currentTime * cacheFrameRate); // uint
                if (this._armature._cacheFrameIndex === cacheFrameIndex) { // Same cache.
                    isUpdateTimeline = false;
                    isUpdateBoneTimeline = false;
                }
                else {
                    this._armature._cacheFrameIndex = cacheFrameIndex;
                    if (this._animationData.cachedFrames[cacheFrameIndex]) { // Cached.
                        isUpdateBoneTimeline = false;
                    }
                    else { // Cache.
                        this._animationData.cachedFrames[cacheFrameIndex] = true;
                    }
                }
            }
            if (isUpdateTimeline) {
                let isBlend = false;
                let prevTarget = null; //
                if (isUpdateBoneTimeline) {
                    for (let i = 0, l = this._boneTimelines.length; i < l; ++i) {
                        const timeline = this._boneTimelines[i];
                        if (timeline.playState <= 0) {
                            timeline.update(time);
                        }
                        if (timeline.target !== prevTarget) {
                            const blendState = timeline.target;
                            isBlend = blendState.update(this);
                            prevTarget = blendState;
                            if (blendState.dirty === 1) {
                                const pose = blendState.target.animationPose;
                                pose.x = 0.0;
                                pose.y = 0.0;
                                pose.rotation = 0.0;
                                pose.skew = 0.0;
                                pose.scaleX = 1.0;
                                pose.scaleY = 1.0;
                            }
                        }
                        if (isBlend) {
                            timeline.blend(isBlendDirty);
                        }
                    }
                }
                for (let i = 0, l = this._boneBlendTimelines.length; i < l; ++i) {
                    const timeline = this._boneBlendTimelines[i];
                    if (timeline.playState <= 0) {
                        timeline.update(time);
                    }
                    if (timeline.target.update(this)) {
                        timeline.blend(isBlendDirty);
                    }
                }
                if (this.displayControl) {
                    for (let i = 0, l = this._slotTimelines.length; i < l; ++i) {
                        const timeline = this._slotTimelines[i];
                        if (timeline.playState <= 0) {
                            const slot = timeline.target;
                            const displayController = slot.displayController;
                            if (displayController === null ||
                                displayController === this.name ||
                                displayController === this.group) {
                                timeline.update(time);
                            }
                        }
                    }
                }
                for (let i = 0, l = this._slotBlendTimelines.length; i < l; ++i) {
                    const timeline = this._slotBlendTimelines[i];
                    if (timeline.playState <= 0) {
                        const blendState = timeline.target;
                        timeline.update(time);
                        if (blendState.update(this)) {
                            timeline.blend(isBlendDirty);
                        }
                    }
                }
                for (let i = 0, l = this._constraintTimelines.length; i < l; ++i) {
                    const timeline = this._constraintTimelines[i];
                    if (timeline.playState <= 0) {
                        timeline.update(time);
                    }
                }
                if (this._animationTimelines.length > 0) {
                    let dL = 100.0;
                    let dR = 100.0;
                    let leftState = null;
                    let rightState = null;
                    for (let i = 0, l = this._animationTimelines.length; i < l; ++i) {
                        const timeline = this._animationTimelines[i];
                        if (timeline.playState <= 0) {
                            timeline.update(time);
                        }
                        if (this.blendType === 1 /* E1D */) { // TODO
                            const animationState = timeline.target;
                            const d = this.parameterX - animationState.positionX;
                            if (d >= 0.0) {
                                if (d < dL) {
                                    dL = d;
                                    leftState = animationState;
                                }
                            }
                            else {
                                if (-d < dR) {
                                    dR = -d;
                                    rightState = animationState;
                                }
                            }
                        }
                    }
                    if (leftState !== null) {
                        if (this._activeChildA !== leftState) {
                            if (this._activeChildA !== null) {
                                this._activeChildA.weight = 0.0;
                            }
                            this._activeChildA = leftState;
                            this._activeChildA.activeTimeline();
                        }
                        if (this._activeChildB !== rightState) {
                            if (this._activeChildB !== null) {
                                this._activeChildB.weight = 0.0;
                            }
                            this._activeChildB = rightState;
                        }
                        leftState.weight = dR / (dL + dR);
                        if (rightState) {
                            rightState.weight = 1.0 - leftState.weight;
                        }
                    }
                }
            }
            if (this._fadeState === 0) {
                if (this._subFadeState > 0) {
                    this._subFadeState = 0;
                    if (this._poseTimelines.length > 0) { // Remove pose timelines.
                        for (const timeline of this._poseTimelines) {
                            let index = this._boneTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._boneTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }
                            index = this._boneBlendTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._boneBlendTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }
                            index = this._slotTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._slotTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }
                            index = this._slotBlendTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._slotBlendTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }
                            index = this._constraintTimelines.indexOf(timeline);
                            if (index >= 0) {
                                this._constraintTimelines.splice(index, 1);
                                timeline.returnToPool();
                                continue;
                            }
                        }
                        this._poseTimelines.length = 0;
                    }
                }
                if (this._actionTimeline.playState > 0) {
                    if (this.autoFadeOutTime >= 0.0) { // Auto fade out.
                        this.fadeOut(this.autoFadeOutTime);
                    }
                }
            }
        }
        /**
         * - Continue play.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 继续播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        play() {
            this._playheadState = 3; // 11
        }
        /**
         * - Stop play.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        stop() {
            this._playheadState &= 1; // 0x
        }
        /**
         * - Fade out the animation state.
         * @param fadeOutTime - The fade out time. (In seconds)
         * @param pausePlayhead - Whether to pause the animation playing when fade out.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 淡出动画状态。
         * @param fadeOutTime - 淡出时间。 （以秒为单位）
         * @param pausePlayhead - 淡出时是否暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        fadeOut(fadeOutTime, pausePlayhead = true) {
            if (fadeOutTime < 0.0) {
                fadeOutTime = 0.0;
            }
            if (pausePlayhead) {
                this._playheadState &= 2; // x0
            }
            if (this._fadeState > 0) {
                if (fadeOutTime > this.fadeTotalTime - this._fadeTime) { // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._fadeState = 1;
                this._subFadeState = -1;
                if (fadeOutTime <= 0.0 || this._fadeProgress <= 0.0) {
                    this._fadeProgress = 0.000001; // Modify fade progress to different value.
                }
                for (const timeline of this._boneTimelines) {
                    timeline.fadeOut();
                }
                for (const timeline of this._boneBlendTimelines) {
                    timeline.fadeOut();
                }
                for (const timeline of this._slotTimelines) {
                    timeline.fadeOut();
                }
                for (const timeline of this._slotBlendTimelines) {
                    timeline.fadeOut();
                }
                for (const timeline of this._constraintTimelines) {
                    timeline.fadeOut();
                }
                for (const timeline of this._animationTimelines) {
                    timeline.fadeOut();
                    //
                    const animaitonState = timeline.target;
                    animaitonState.fadeOut(999999.0, true);
                }
            }
            this.displayControl = false; //
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0.0;
            this._fadeTime = this.fadeTotalTime * (1.0 - this._fadeProgress);
        }
        /**
         * - Check if a specific bone mask is included.
         * @param boneName - The bone name.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 检查是否包含特定骨骼遮罩。
         * @param boneName - 骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        containsBoneMask(boneName) {
            return this._boneMask.length === 0 || this._boneMask.indexOf(boneName) >= 0;
        }
        /**
         * - Add a specific bone mask.
         * @param boneName - The bone name.
         * @param recursive - Whether or not to add a mask to the bone's sub-bone.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 添加特定的骨骼遮罩。
         * @param boneName - 骨骼名称。
         * @param recursive - 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addBoneMask(boneName, recursive = true) {
            const currentBone = this._armature.getBone(boneName);
            if (currentBone === null) {
                return;
            }
            if (this._boneMask.indexOf(boneName) < 0) { // Add mixing
                this._boneMask.push(boneName);
            }
            if (recursive) { // Add recursive mixing.
                for (const bone of this._armature.getBones()) {
                    if (this._boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                        this._boneMask.push(bone.name);
                    }
                }
            }
            this._timelineDirty = 1;
        }
        /**
         * - Remove the mask of a specific bone.
         * @param boneName - The bone name.
         * @param recursive - Whether to remove the bone's sub-bone mask.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 删除特定骨骼的遮罩。
         * @param boneName - 骨骼名称。
         * @param recursive - 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeBoneMask(boneName, recursive = true) {
            const index = this._boneMask.indexOf(boneName);
            if (index >= 0) { // Remove mixing.
                this._boneMask.splice(index, 1);
            }
            if (recursive) {
                const currentBone = this._armature.getBone(boneName);
                if (currentBone !== null) {
                    const bones = this._armature.getBones();
                    if (this._boneMask.length > 0) { // Remove recursive mixing.
                        for (const bone of bones) {
                            const index = this._boneMask.indexOf(bone.name);
                            if (index >= 0 && currentBone.contains(bone)) {
                                this._boneMask.splice(index, 1);
                            }
                        }
                    }
                    else { // Add unrecursive mixing.
                        for (const bone of bones) {
                            if (bone === currentBone) {
                                continue;
                            }
                            if (!currentBone.contains(bone)) {
                                this._boneMask.push(bone.name);
                            }
                        }
                    }
                }
            }
            this._timelineDirty = 1;
        }
        /**
         * - Remove all bone masks.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeAllBoneMask() {
            this._boneMask.length = 0;
            this._timelineDirty = 1;
        }
        /**
         * @private
         */
        addState(animationState, timelineDatas = null) {
            if (timelineDatas !== null) {
                for (const timelineData of timelineDatas) {
                    switch (timelineData.type) {
                        case 40 /* AnimationProgress */: {
                            const timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationProgressTimelineState);
                            timeline.target = animationState;
                            timeline.init(this._armature, this, timelineData);
                            this._animationTimelines.push(timeline);
                            if (this.blendType !== 0 /* None */) {
                                const animaitonTimelineData = timelineData;
                                animationState.positionX = animaitonTimelineData.x;
                                animationState.positionY = animaitonTimelineData.y;
                                animationState.weight = 0.0;
                            }
                            animationState._parent = this;
                            this.resetToPose = false;
                            break;
                        }
                        case 41 /* AnimationWeight */: {
                            const timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationWeightTimelineState);
                            timeline.target = animationState;
                            timeline.init(this._armature, this, timelineData);
                            this._animationTimelines.push(timeline);
                            break;
                        }
                        case 42 /* AnimationParameter */: {
                            const timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationParametersTimelineState);
                            timeline.target = animationState;
                            timeline.init(this._armature, this, timelineData);
                            this._animationTimelines.push(timeline);
                            break;
                        }
                        default:
                            break;
                    }
                }
            }
            if (animationState._parent === null) {
                animationState._parent = this;
            }
        }
        /**
         * @internal
         */
        activeTimeline() {
            for (const timeline of this._slotTimelines) {
                timeline.dirty = true;
                timeline.currentTime = -1.0;
            }
        }
        /**
         * - Whether the animation state is fading in.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否正在淡入。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        get isFadeIn() {
            return this._fadeState < 0;
        }
        /**
         * - Whether the animation state is fading out.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否正在淡出。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        get isFadeOut() {
            return this._fadeState > 0;
        }
        /**
         * - Whether the animation state is fade completed.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 是否淡入或淡出完毕。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        get isFadeComplete() {
            return this._fadeState === 0;
        }
        /**
         * - Whether the animation state is playing.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 是否正在播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get isPlaying() {
            return (this._playheadState & 2) !== 0 && this._actionTimeline.playState <= 0;
        }
        /**
         * - Whether the animation state is play completed.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 是否播放完毕。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get isCompleted() {
            return this._actionTimeline.playState > 0;
        }
        /**
         * - The times has been played.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 已经循环播放的次数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get currentPlayTimes() {
            return this._actionTimeline.currentPlayTimes;
        }
        /**
         * - The total time. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 总播放时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get totalTime() {
            return this._duration;
        }
        /**
         * - The time is currently playing. (In seconds)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 当前播放的时间。 （以秒为单位）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get currentTime() {
            return this._actionTimeline.currentTime;
        }
        set currentTime(value) {
            const currentPlayTimes = this._actionTimeline.currentPlayTimes - (this._actionTimeline.playState > 0 ? 1 : 0);
            if (value < 0 || this._duration < value) {
                value = (value % this._duration) + currentPlayTimes * this._duration;
                if (value < 0) {
                    value += this._duration;
                }
            }
            if (this.playTimes > 0 && currentPlayTimes === this.playTimes - 1 &&
                value === this._duration && this._parent === null) {
                value = this._duration - 0.000001; // 
            }
            if (this._time === value) {
                return;
            }
            this._time = value;
            this._actionTimeline.setCurrentTime(this._time);
            if (this._zOrderTimeline !== null) {
                this._zOrderTimeline.playState = -1;
            }
            for (const timeline of this._boneTimelines) {
                timeline.playState = -1;
            }
            for (const timeline of this._slotTimelines) {
                timeline.playState = -1;
            }
        }
        /**
         * - The blend weight.
         * @default 1.0
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 混合权重。
         * @default 1.0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        /**
         * - The animation data.
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language en_US
         */
        get weight() {
            return this._weight;
        }
        set weight(value) {
            if (this._weight === value) {
                return;
            }
            this._weight = value;
            for (const timeline of this._boneTimelines) {
                timeline.dirty = true;
            }
            for (const timeline of this._boneBlendTimelines) {
                timeline.dirty = true;
            }
            for (const timeline of this._slotBlendTimelines) {
                timeline.dirty = true;
            }
        }
        /**
         * - 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get animationData() {
            return this._animationData;
        }
    }
    dragonBones.AnimationState = AnimationState;
    /**
     * @internal
     */
    class BlendState extends dragonBones.BaseObject {
        static toString() {
            return "[class dragonBones.BlendState]";
        }
        _onClear() {
            this.reset();
            this.target = null;
        }
        update(animationState) {
            const animationLayer = animationState.layer;
            let animationWeight = animationState._weightResult;
            if (this.dirty > 0) {
                if (this.leftWeight > 0.0) {
                    if (this.layer !== animationLayer) {
                        if (this.layerWeight >= this.leftWeight) {
                            this.dirty++;
                            this.layer = animationLayer;
                            this.leftWeight = 0.0;
                            this.blendWeight = 0.0;
                            return false;
                        }
                        this.layer = animationLayer;
                        this.leftWeight -= this.layerWeight;
                        this.layerWeight = 0.0;
                    }
                    animationWeight *= this.leftWeight;
                    this.dirty++;
                    this.blendWeight = animationWeight;
                    this.layerWeight += this.blendWeight;
                    return true;
                }
                return false;
            }
            this.dirty++;
            this.layer = animationLayer;
            this.leftWeight = 1.0;
            this.blendWeight = animationWeight;
            this.layerWeight = animationWeight;
            return true;
        }
        reset() {
            this.dirty = 0;
            this.layer = 0;
            this.leftWeight = 0.0;
            this.layerWeight = 0.0;
            this.blendWeight = 0.0;
        }
    }
    BlendState.BONE_TRANSFORM = "boneTransform";
    BlendState.BONE_ALPHA = "boneAlpha";
    BlendState.SURFACE = "surface";
    BlendState.SLOT_DEFORM = "slotDeform";
    BlendState.SLOT_ALPHA = "slotAlpha";
    BlendState.SLOT_Z_INDEX = "slotZIndex";
    BlendState.SLOT_SHAPE = "slotShape";
    dragonBones.BlendState = BlendState;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     */
    class TimelineState extends dragonBones.BaseObject {
        _onClear() {
            this.dirty = false;
            this.playState = -1;
            this.currentPlayTimes = 0;
            this.currentTime = -1.0;
            this.target = null;
            this._isTween = false;
            this._valueOffset = 0;
            this._frameValueOffset = 0;
            this._frameOffset = 0;
            this._frameRate = 0;
            this._frameCount = 0;
            this._frameIndex = -1;
            this._frameRateR = 0.0;
            this._position = 0.0;
            this._duration = 0.0;
            this._timeScale = 1.0;
            this._timeOffset = 0.0;
            this._animationData = null; //
            this._timelineData = null; //
            this._armature = null; //
            this._animationState = null; //
            this._actionTimeline = null; //
            this._frameArray = null; //
            this._valueArray = null; //
            this._timelineArray = null; //
            this._frameIndices = null; //
        }
        _setCurrentTime(passedTime) {
            const prevState = this.playState;
            const prevPlayTimes = this.currentPlayTimes;
            const prevTime = this.currentTime;
            if (this._actionTimeline !== null && this._frameCount <= 1) { // No frame or only one frame.
                this.playState = this._actionTimeline.playState >= 0 ? 1 : -1;
                this.currentPlayTimes = 1;
                this.currentTime = this._actionTimeline.currentTime;
            }
            else if (this._actionTimeline === null) {
                // Action timeline 主时间轴，是事件时间轴，如果没有事件，就是空帧的时间轴。不可缩放，不可偏移，不可循环
                // 每次更新会首先更新它，然后再更新其他时间轴
                // FIXME: playState 变成1后，时间轴不更新了，导致最后一帧的状态更新不上。
                const playTimes = this._animationState.playTimes;
                const totalTime = playTimes * this._duration;
                if (playTimes > 0 && (passedTime >= totalTime || passedTime <= -totalTime)) {
                    if (this.playState <= 0 && this._animationState._playheadState === 3) {
                        this.playState = 1;
                    }
                    this.currentPlayTimes = playTimes;
                    if (passedTime < 0.0) {
                        this.currentTime = 0.0;
                    }
                    else {
                        this.currentTime = this.playState === 1 ? this._duration + 0.000001 : this._duration; // Precision problem
                    }
                }
                else {
                    if (this.playState !== 0 && this._animationState._playheadState === 3) {
                        this.playState = 0;
                    }
                    if (passedTime < 0.0) {
                        passedTime = -passedTime;
                        this.currentPlayTimes = Math.floor(passedTime / this._duration);
                        // 倒放
                        this.currentTime = this._duration - (passedTime % this._duration);
                    }
                    else {
                        this.currentPlayTimes = Math.floor(passedTime / this._duration);
                        this.currentTime = passedTime % this._duration;
                    }
                }
                this.currentTime += this._position;
            }
            else { // Multi frames.
                // 包含多帧的时间轴，可以缩放，可以偏移，可以循环
                // 这里和5.7版本的逻辑不一样了。增加了时间轴的循环属性，缩放和偏移稍有不同
                // 5.7版本的缩放和偏移是加在骨骼上的，并且每个时间轴的长度必须和总时间轴的长度一致
                // 6.0版本的缩放和偏移是加在时间轴上的，每个时间轴的长度可以不一致
                this.playState = this._actionTimeline.playState;
                this.currentPlayTimes = this._actionTimeline.currentPlayTimes;
                let mainTime = this._actionTimeline.currentTime;
                if (this._timeScale === 1.0 && this._timeOffset === 0.0 && this._timeLoop === 0 && this._timelineDuration === this._duration) {
                    this.currentTime = mainTime;
                }
                else {
                    if (this._timeScale !== 1.0 || this._timeOffset !== 0.0) {
                        mainTime *= this._timeScale;
                        mainTime += this._timeOffset;
                    }
                    if (this._timeLoop !== 0) {
                        mainTime = mainTime % this._timelineDuration;
                        if (mainTime < 0) {
                            mainTime += this._timelineDuration;
                        }
                    }
                    else if (mainTime > this._timelineDuration) {
                        // 如果时间轴不循环，那么当时间超过时间轴长度时，就会停在最后一帧
                        mainTime = this._timelineDuration + 0.000001;
                    }
                    else if (mainTime < 0) {
                        mainTime = 0.0;
                    }
                    this.currentTime = mainTime;
                }
                this.currentTime += this._position;
            }
            if (this.currentPlayTimes === prevPlayTimes && this.currentTime === prevTime) {
                return false;
            }
            // Clear frame flag when timeline start or loopComplete.
            if ((prevState < 0 && this.playState !== prevState) ||
                (this.playState <= 0 && this.currentPlayTimes !== prevPlayTimes)) {
                this._frameIndex = -1;
            }
            return true;
        }
        uint2int(v) {
            if (v > 32767) {
                return v - 65536;
            }
            return v;
        }
        init(armature, animationState, timelineData) {
            this._armature = armature;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this._actionTimeline = this._animationState._actionTimeline;
            if (this === this._actionTimeline) {
                this._actionTimeline = null; //
            }
            this._animationData = this._animationState.animationData;
            //
            this._frameRate = this._animationData.parent.frameRate;
            this._frameRateR = 1.0 / this._frameRate;
            this._position = this._animationState._position;
            this._duration = this._animationState._duration;
            if (this._timelineData !== null) {
                const dragonBonesData = this._animationData.parent.parent; // May by the animation data is not belone to this armature data.
                this._frameArray = dragonBonesData.frameArray;
                this._timelineArray = dragonBonesData.timelineArray;
                this._frameIndices = dragonBonesData.frameIndices;
                //
                this._frameCount = this._timelineArray[this._timelineData.offset + 4 /* TimelineKeyFrameCount */];
                this._frameValueOffset = this._timelineArray[this._timelineData.offset + 6 /* TimelineFrameValueOffset */];
                this._timeScale = this._timelineArray[this._timelineData.offset + 0 /* TimelineScale */] * 0.01;
                this._timeOffset = this.uint2int(this._timelineArray[this._timelineData.offset + 1 /* TimelineOffset */]) * this._frameRateR;
                this._timeLoop = this._timelineArray[this._timelineData.offset + 2 /* TimelineLoop */];
                this._timelineDuration = this._timelineArray[this._timelineData.offset + 3 /* TimelineDuration */] * this._frameRateR;
            }
        }
        fadeOut() {
            this.dirty = false;
        }
        update(passedTime) {
            if (this._setCurrentTime(passedTime)) {
                if (this._frameCount > 1) {
                    const timelineFrameIndex = Math.floor(this.currentTime * this._frameRate); // uint
                    const frameIndex = this._frameIndices[this._timelineData.frameIndicesOffset + timelineFrameIndex];
                    if (this._frameIndex !== frameIndex) {
                        this._frameIndex = frameIndex;
                        this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 7 /* TimelineFrameOffset */ + this._frameIndex];
                        this._onArriveAtFrame();
                    }
                }
                else if (this._frameIndex < 0) {
                    this._frameIndex = 0;
                    if (this._timelineData !== null) { // May be pose timeline.
                        this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 7 /* TimelineFrameOffset */];
                    }
                    this._onArriveAtFrame();
                }
                if (this._isTween || this.dirty) {
                    this._onUpdateFrame();
                }
            }
        }
        blend(_isDirty) {
        }
    }
    dragonBones.TimelineState = TimelineState;
    /**
     * @internal
     */
    class TweenTimelineState extends TimelineState {
        static _getEasingValue(tweenType, progress, easing) {
            let value = progress;
            switch (tweenType) {
                case 3 /* QuadIn */:
                    value = Math.pow(progress, 2.0);
                    break;
                case 4 /* QuadOut */:
                    value = 1.0 - Math.pow(1.0 - progress, 2.0);
                    break;
                case 5 /* QuadInOut */:
                    value = 0.5 * (1.0 - Math.cos(progress * Math.PI));
                    break;
            }
            return (value - progress) * easing + progress;
        }
        static _getEasingCurveValue(progress, samples, count, offset) {
            if (progress <= 0.0) {
                return 0.0;
            }
            else if (progress >= 1.0) {
                return 1.0;
            }
            const isOmited = count > 0;
            const segmentCount = count + 1; // + 2 - 1
            const valueIndex = Math.floor(progress * segmentCount);
            let fromValue = 0.0;
            let toValue = 0.0;
            if (isOmited) {
                fromValue = valueIndex === 0 ? 0.0 : samples[offset + valueIndex - 1];
                toValue = (valueIndex === segmentCount - 1) ? 10000.0 : samples[offset + valueIndex];
            }
            else {
                fromValue = samples[offset + valueIndex - 1];
                toValue = samples[offset + valueIndex];
            }
            return (fromValue + (toValue - fromValue) * (progress * segmentCount - valueIndex)) * 0.0001;
        }
        _onClear() {
            super._onClear();
            this._tweenType = 0 /* None */;
            this._curveCount = 0;
            this._framePosition = 0.0;
            this._frameDurationR = 0.0;
            this._tweenEasing = 0.0;
            this._tweenProgress = 0.0;
            this._valueScale = 1.0;
        }
        _onArriveAtFrame() {
            if (this._frameCount > 1 &&
                (this._frameIndex !== this._frameCount - 1 ||
                    this._animationState.playTimes === 0 ||
                    this._animationState.currentPlayTimes < this._animationState.playTimes - 1)) {
                this._tweenType = this._frameArray[this._frameOffset + 1 /* FrameTweenType */];
                this._isTween = this._tweenType !== 0 /* None */;
                if (this._isTween) {
                    if (this._tweenType === 2 /* Curve */) {
                        this._curveCount = this._frameArray[this._frameOffset + 2 /* FrameTweenEasingOrCurveSampleCount */];
                    }
                    else if (this._tweenType !== 0 /* None */ && this._tweenType !== 1 /* Line */) {
                        this._tweenEasing = this._frameArray[this._frameOffset + 2 /* FrameTweenEasingOrCurveSampleCount */] * 0.01;
                    }
                }
                else {
                    this.dirty = true;
                }
                this._framePosition = this._frameArray[this._frameOffset] * this._frameRateR;
                if (this._frameIndex === this._frameCount - 1) {
                    this._frameDurationR = 1.0 / (this._animationData.duration - this._framePosition);
                }
                else {
                    const nextFrameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 7 /* TimelineFrameOffset */ + this._frameIndex + 1];
                    const frameDuration = this._frameArray[nextFrameOffset] * this._frameRateR - this._framePosition;
                    if (frameDuration > 0) {
                        this._frameDurationR = 1.0 / frameDuration;
                    }
                    else {
                        this._frameDurationR = 0.0;
                    }
                }
            }
            else {
                this.dirty = true;
                this._isTween = false;
            }
        }
        _onUpdateFrame() {
            if (this._isTween) {
                this.dirty = true;
                this._tweenProgress = (this.currentTime - this._framePosition) * this._frameDurationR;
                if (this._tweenType === 2 /* Curve */) {
                    this._tweenProgress = TweenTimelineState._getEasingCurveValue(this._tweenProgress, this._frameArray, this._curveCount, this._frameOffset + 3 /* FrameCurveSamples */);
                }
                else if (this._tweenType !== 1 /* Line */) {
                    this._tweenProgress = TweenTimelineState._getEasingValue(this._tweenType, this._tweenProgress, this._tweenEasing);
                }
            }
        }
    }
    dragonBones.TweenTimelineState = TweenTimelineState;
    /**
     * @internal
     */
    class SingleValueTimelineState extends TweenTimelineState {
        _onClear() {
            super._onClear();
            this._current = 0.0;
            this._difference = 0.0;
            this._result = 0.0;
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._timelineData !== null) {
                const valueScale = this._valueScale;
                const valueArray = this._valueArray;
                //
                const valueOffset = this._valueOffset + this._frameValueOffset + this._frameIndex;
                if (this._isTween) {
                    const nextValueOffset = this._frameIndex === this._frameCount - 1 ?
                        this._valueOffset + this._frameValueOffset :
                        valueOffset + 1;
                    if (valueScale === 1.0) {
                        this._current = valueArray[valueOffset];
                        this._difference = valueArray[nextValueOffset] - this._current;
                    }
                    else {
                        this._current = valueArray[valueOffset] * valueScale;
                        this._difference = valueArray[nextValueOffset] * valueScale - this._current;
                    }
                }
                else {
                    this._result = valueArray[valueOffset] * valueScale;
                }
            }
            else {
                this._result = 0.0;
            }
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            if (this._isTween) {
                this._result = this._current + this._difference * this._tweenProgress;
            }
        }
    }
    dragonBones.SingleValueTimelineState = SingleValueTimelineState;
    /**
     * @internal
     */
    class DoubleValueTimelineState extends TweenTimelineState {
        _onClear() {
            super._onClear();
            this._currentA = 0.0;
            this._currentB = 0.0;
            this._differenceA = 0.0;
            this._differenceB = 0.0;
            this._resultA = 0.0;
            this._resultB = 0.0;
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._timelineData !== null) {
                const valueScale = this._valueScale;
                const valueArray = this._valueArray;
                //
                const valueOffset = this._valueOffset + this._frameValueOffset + this._frameIndex * 2;
                if (this._isTween) {
                    const nextValueOffset = this._frameIndex === this._frameCount - 1 ?
                        this._valueOffset + this._frameValueOffset :
                        valueOffset + 2;
                    if (valueScale === 1.0) {
                        this._currentA = valueArray[valueOffset];
                        this._currentB = valueArray[valueOffset + 1];
                        this._differenceA = valueArray[nextValueOffset] - this._currentA;
                        this._differenceB = valueArray[nextValueOffset + 1] - this._currentB;
                    }
                    else {
                        this._currentA = valueArray[valueOffset] * valueScale;
                        this._currentB = valueArray[valueOffset + 1] * valueScale;
                        this._differenceA = valueArray[nextValueOffset] * valueScale - this._currentA;
                        this._differenceB = valueArray[nextValueOffset + 1] * valueScale - this._currentB;
                    }
                }
                else {
                    this._resultA = valueArray[valueOffset] * valueScale;
                    this._resultB = valueArray[valueOffset + 1] * valueScale;
                }
            }
            else {
                this._resultA = 0.0;
                this._resultB = 0.0;
            }
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            if (this._isTween) {
                this._resultA = this._currentA + this._differenceA * this._tweenProgress;
                this._resultB = this._currentB + this._differenceB * this._tweenProgress;
            }
        }
    }
    dragonBones.DoubleValueTimelineState = DoubleValueTimelineState;
    /**
     * @internal
     */
    class MutilpleValueTimelineState extends TweenTimelineState {
        constructor() {
            super(...arguments);
            this._rd = [];
        }
        _onClear() {
            super._onClear();
            this._valueCount = 0;
            this._rd.length = 0;
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            const valueCount = this._valueCount;
            const rd = this._rd;
            if (this._timelineData !== null) {
                const valueScale = this._valueScale;
                const valueArray = this._valueArray;
                //
                const valueOffset = this._valueOffset + this._frameValueOffset + this._frameIndex * valueCount;
                if (this._isTween) {
                    const nextValueOffset = this._frameIndex === this._frameCount - 1 ?
                        this._valueOffset + this._frameValueOffset :
                        valueOffset + valueCount;
                    if (valueScale === 1.0) {
                        for (let i = 0; i < valueCount; ++i) {
                            rd[valueCount + i] = valueArray[nextValueOffset + i] - valueArray[valueOffset + i];
                        }
                    }
                    else {
                        for (let i = 0; i < valueCount; ++i) {
                            rd[valueCount + i] = (valueArray[nextValueOffset + i] - valueArray[valueOffset + i]) * valueScale;
                        }
                    }
                }
                else if (valueScale === 1.0) {
                    for (let i = 0; i < valueCount; ++i) {
                        rd[i] = valueArray[valueOffset + i];
                    }
                }
                else {
                    for (let i = 0; i < valueCount; ++i) {
                        rd[i] = valueArray[valueOffset + i] * valueScale;
                    }
                }
            }
            else {
                for (let i = 0; i < valueCount; ++i) {
                    rd[i] = 0.0;
                }
            }
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            if (this._isTween) {
                const valueCount = this._valueCount;
                const valueScale = this._valueScale;
                const tweenProgress = this._tweenProgress;
                const valueArray = this._valueArray;
                const rd = this._rd;
                //
                const valueOffset = this._valueOffset + this._frameValueOffset + this._frameIndex * valueCount;
                if (valueScale === 1.0) {
                    for (let i = 0; i < valueCount; ++i) {
                        rd[i] = valueArray[valueOffset + i] + rd[valueCount + i] * tweenProgress;
                    }
                }
                else {
                    for (let i = 0; i < valueCount; ++i) {
                        rd[i] = valueArray[valueOffset + i] * valueScale + rd[valueCount + i] * tweenProgress;
                    }
                }
            }
        }
    }
    dragonBones.MutilpleValueTimelineState = MutilpleValueTimelineState;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     */
    class ActionTimelineState extends dragonBones.TimelineState {
        static toString() {
            return "[class dragonBones.ActionTimelineState]";
        }
        _onCrossFrame(frameIndex) {
            const eventDispatcher = this._armature.eventDispatcher;
            if (this._animationState.actionEnabled) {
                const frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 7 /* TimelineFrameOffset */ + frameIndex];
                const actionCount = this._frameArray[frameOffset + 1];
                const actions = this._animationData.parent.actions; // May be the animaton data not belong to this armature data.
                for (let i = 0; i < actionCount; ++i) {
                    const actionIndex = this._frameArray[frameOffset + 2 + i];
                    const action = actions[actionIndex];
                    if (action.type === 0 /* Play */) {
                        const eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        // eventObject.time = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                        eventObject.time = this._frameArray[frameOffset] / this._frameRate;
                        eventObject.animationState = this._animationState;
                        dragonBones.EventObject.actionDataToInstance(action, eventObject, this._armature);
                        this._armature._bufferAction(eventObject, true);
                    }
                    else {
                        const eventType = action.type === 10 /* Frame */ ? dragonBones.EventObject.FRAME_EVENT : dragonBones.EventObject.SOUND_EVENT;
                        if (action.type === 11 /* Sound */ || eventDispatcher.hasDBEventListener(eventType)) {
                            const eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            // eventObject.time = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                            eventObject.time = this._frameArray[frameOffset] / this._frameRate;
                            eventObject.animationState = this._animationState;
                            dragonBones.EventObject.actionDataToInstance(action, eventObject, this._armature);
                            this._armature._dragonBones.bufferEvent(eventObject);
                        }
                    }
                }
            }
        }
        _onArriveAtFrame() { }
        _onUpdateFrame() { }
        update(passedTime) {
            const prevState = this.playState;
            let prevPlayTimes = this.currentPlayTimes;
            let prevTime = this.currentTime;
            if (this._setCurrentTime(passedTime)) {
                const eventActive = this._animationState._parent === null && this._animationState.actionEnabled;
                const eventDispatcher = this._armature.eventDispatcher;
                if (prevState < 0) {
                    if (this.playState !== prevState) {
                        if (this._animationState.displayControl && this._animationState.resetToPose) { // Reset zorder to pose.
                            this._armature._sortZOrder(null, 0);
                        }
                        // prevPlayTimes = this.currentPlayTimes; // TODO
                        if (eventActive && eventDispatcher.hasDBEventListener(dragonBones.EventObject.START)) {
                            const eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            eventObject.type = dragonBones.EventObject.START;
                            eventObject.armature = this._armature;
                            eventObject.animationState = this._animationState;
                            this._armature._dragonBones.bufferEvent(eventObject);
                        }
                    }
                    else {
                        return;
                    }
                }
                const isReverse = this._animationState.timeScale < 0.0;
                let loopCompleteEvent = null;
                let completeEvent = null;
                if (eventActive && this.currentPlayTimes !== prevPlayTimes) {
                    if (eventDispatcher.hasDBEventListener(dragonBones.EventObject.LOOP_COMPLETE)) {
                        loopCompleteEvent = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        loopCompleteEvent.type = dragonBones.EventObject.LOOP_COMPLETE;
                        loopCompleteEvent.armature = this._armature;
                        loopCompleteEvent.animationState = this._animationState;
                    }
                    if (this.playState > 0) {
                        if (eventDispatcher.hasDBEventListener(dragonBones.EventObject.COMPLETE)) {
                            completeEvent = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            completeEvent.type = dragonBones.EventObject.COMPLETE;
                            completeEvent.armature = this._armature;
                            completeEvent.animationState = this._animationState;
                        }
                    }
                }
                if (this._frameCount > 1) {
                    const timelineData = this._timelineData;
                    const timelineFrameIndex = Math.floor(this.currentTime * this._frameRate); // uint
                    const frameIndex = this._frameIndices[timelineData.frameIndicesOffset + timelineFrameIndex];
                    if (this._frameIndex !== frameIndex) { // Arrive at frame.                   
                        let crossedFrameIndex = this._frameIndex;
                        this._frameIndex = frameIndex;
                        if (this._timelineArray !== null) {
                            this._frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + 7 /* TimelineFrameOffset */ + this._frameIndex];
                            if (isReverse) {
                                if (crossedFrameIndex < 0) {
                                    const prevFrameIndex = Math.floor(prevTime * this._frameRate);
                                    crossedFrameIndex = this._frameIndices[timelineData.frameIndicesOffset + prevFrameIndex];
                                    if (this.currentPlayTimes === prevPlayTimes) { // Start.
                                        if (crossedFrameIndex === frameIndex) { // Uncrossed.
                                            crossedFrameIndex = -1;
                                        }
                                    }
                                }
                                while (crossedFrameIndex >= 0) {
                                    const frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + 7 /* TimelineFrameOffset */ + crossedFrameIndex];
                                    // const framePosition = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                                    const framePosition = this._frameArray[frameOffset] / this._frameRate;
                                    if (this._position <= framePosition &&
                                        framePosition <= this._position + this._duration) { // Support interval play.
                                        this._onCrossFrame(crossedFrameIndex);
                                    }
                                    if (loopCompleteEvent !== null && crossedFrameIndex === 0) { // Add loop complete event after first frame.
                                        this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                                        loopCompleteEvent = null;
                                    }
                                    if (crossedFrameIndex > 0) {
                                        crossedFrameIndex--;
                                    }
                                    else {
                                        crossedFrameIndex = this._frameCount - 1;
                                    }
                                    if (crossedFrameIndex === frameIndex) {
                                        break;
                                    }
                                }
                            }
                            else {
                                if (crossedFrameIndex < 0) {
                                    const prevFrameIndex = Math.floor(prevTime * this._frameRate);
                                    crossedFrameIndex = this._frameIndices[timelineData.frameIndicesOffset + prevFrameIndex];
                                    const frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + 7 /* TimelineFrameOffset */ + crossedFrameIndex];
                                    // const framePosition = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                                    const framePosition = this._frameArray[frameOffset] / this._frameRate;
                                    if (this.currentPlayTimes === prevPlayTimes) { // Start.
                                        if (prevTime <= framePosition) { // Crossed.
                                            if (crossedFrameIndex > 0) {
                                                crossedFrameIndex--;
                                            }
                                            else {
                                                crossedFrameIndex = this._frameCount - 1;
                                            }
                                        }
                                        else if (crossedFrameIndex === frameIndex) { // Uncrossed.
                                            crossedFrameIndex = -1;
                                        }
                                    }
                                }
                                while (crossedFrameIndex >= 0) {
                                    if (crossedFrameIndex < this._frameCount - 1) {
                                        crossedFrameIndex++;
                                    }
                                    else {
                                        crossedFrameIndex = 0;
                                    }
                                    const frameOffset = this._animationData.frameOffset + this._timelineArray[timelineData.offset + 7 /* TimelineFrameOffset */ + crossedFrameIndex];
                                    // const framePosition = this._frameArray[frameOffset] * this._frameRateR; // Precision problem
                                    const framePosition = this._frameArray[frameOffset] / this._frameRate;
                                    if (this._position <= framePosition &&
                                        framePosition <= this._position + this._duration //
                                    ) { // Support interval play.
                                        this._onCrossFrame(crossedFrameIndex);
                                    }
                                    if (loopCompleteEvent !== null && crossedFrameIndex === 0) { // Add loop complete event before first frame.
                                        this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                                        loopCompleteEvent = null;
                                    }
                                    if (crossedFrameIndex === frameIndex) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (this._frameIndex < 0) {
                    this._frameIndex = 0;
                    if (this._timelineData !== null) {
                        this._frameOffset = this._animationData.frameOffset + this._timelineArray[this._timelineData.offset + 7 /* TimelineFrameOffset */];
                        // Arrive at frame.
                        const framePosition = this._frameArray[this._frameOffset] / this._frameRate;
                        if (this.currentPlayTimes === prevPlayTimes) { // Start.
                            if (prevTime <= framePosition) {
                                this._onCrossFrame(this._frameIndex);
                            }
                        }
                        else if (this._position <= framePosition) { // Loop complete.
                            if (!isReverse && loopCompleteEvent !== null) { // Add loop complete event before first frame.
                                this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                                loopCompleteEvent = null;
                            }
                            this._onCrossFrame(this._frameIndex);
                        }
                    }
                }
                if (loopCompleteEvent !== null) {
                    this._armature._dragonBones.bufferEvent(loopCompleteEvent);
                }
                if (completeEvent !== null) {
                    this._armature._dragonBones.bufferEvent(completeEvent);
                }
            }
        }
        setCurrentTime(value) {
            this._setCurrentTime(value);
            this._frameIndex = -1;
        }
    }
    dragonBones.ActionTimelineState = ActionTimelineState;
    /**
     * @internal
     */
    class ZOrderTimelineState extends dragonBones.TimelineState {
        static toString() {
            return "[class dragonBones.ZOrderTimelineState]";
        }
        _onArriveAtFrame() {
            if (this.playState >= 0) {
                const count = this._frameArray[this._frameOffset + 1];
                if (count > 0) {
                    this._armature._sortZOrder(this._frameArray, this._frameOffset + 2);
                }
                else {
                    this._armature._sortZOrder(null, 0);
                }
            }
        }
        _onUpdateFrame() { }
    }
    dragonBones.ZOrderTimelineState = ZOrderTimelineState;
    /**
     * @internal
     */
    class BoneAllTimelineState extends dragonBones.MutilpleValueTimelineState {
        static toString() {
            return "[class dragonBones.BoneAllTimelineState]";
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._isTween && this._frameIndex === this._frameCount - 1) {
                this._rd[2] = dragonBones.Transform.normalizeRadian(this._rd[2]);
                this._rd[3] = dragonBones.Transform.normalizeRadian(this._rd[3]);
            }
            if (this._timelineData === null) { // Pose.
                this._rd[4] = 1.0;
                this._rd[5] = 1.0;
            }
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameFloatOffset;
            this._valueCount = 6;
            this._valueArray = this._animationData.parent.parent.frameFloatArray;
        }
        fadeOut() {
            this.dirty = false;
            this._rd[2] = dragonBones.Transform.normalizeRadian(this._rd[2]);
            this._rd[3] = dragonBones.Transform.normalizeRadian(this._rd[3]);
        }
        blend(isDirty) {
            const valueScale = this._armature.armatureData.scale;
            const rd = this._rd;
            //
            const blendState = this.target;
            const bone = blendState.target;
            const blendWeight = blendState.blendWeight;
            const result = bone.animationPose;
            if (blendState.dirty > 1) {
                result.x += rd[0] * blendWeight * valueScale;
                result.y += rd[1] * blendWeight * valueScale;
                result.rotation += rd[2] * blendWeight;
                result.skew += rd[3] * blendWeight;
                result.scaleX += (rd[4] - 1.0) * blendWeight;
                result.scaleY += (rd[5] - 1.0) * blendWeight;
            }
            else {
                result.x = rd[0] * blendWeight * valueScale;
                result.y = rd[1] * blendWeight * valueScale;
                result.rotation = rd[2] * blendWeight;
                result.skew = rd[3] * blendWeight;
                result.scaleX = (rd[4] - 1.0) * blendWeight + 1.0; // 
                result.scaleY = (rd[5] - 1.0) * blendWeight + 1.0; //
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                bone._transformDirty = true;
            }
        }
    }
    dragonBones.BoneAllTimelineState = BoneAllTimelineState;
    /**
     * @internal
     */
    class BoneTranslateTimelineState extends dragonBones.DoubleValueTimelineState {
        static toString() {
            return "[class dragonBones.BoneTranslateTimelineState]";
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameFloatOffset;
            this._valueScale = this._armature.armatureData.scale;
            this._valueArray = this._animationData.parent.parent.frameFloatArray;
        }
        blend(isDirty) {
            const blendState = this.target;
            const bone = blendState.target;
            const blendWeight = blendState.blendWeight;
            const result = bone.animationPose;
            if (blendState.dirty > 1) {
                result.x += this._resultA * blendWeight;
                result.y += this._resultB * blendWeight;
            }
            else if (blendWeight !== 1.0) {
                result.x = this._resultA * blendWeight;
                result.y = this._resultB * blendWeight;
            }
            else {
                result.x = this._resultA;
                result.y = this._resultB;
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                bone._transformDirty = true;
            }
        }
    }
    dragonBones.BoneTranslateTimelineState = BoneTranslateTimelineState;
    /**
     * @internal
     */
    class BoneRotateTimelineState extends dragonBones.DoubleValueTimelineState {
        static toString() {
            return "[class dragonBones.BoneRotateTimelineState]";
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._isTween && this._frameIndex === this._frameCount - 1) {
                this._differenceA = dragonBones.Transform.normalizeRadian(this._differenceA);
                this._differenceB = dragonBones.Transform.normalizeRadian(this._differenceB);
            }
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameFloatOffset;
            this._valueArray = this._animationData.parent.parent.frameFloatArray;
        }
        fadeOut() {
            this.dirty = false;
            this._resultA = dragonBones.Transform.normalizeRadian(this._resultA);
            this._resultB = dragonBones.Transform.normalizeRadian(this._resultB);
        }
        blend(isDirty) {
            const blendState = this.target;
            const bone = blendState.target;
            const blendWeight = blendState.blendWeight;
            const result = bone.animationPose;
            if (blendState.dirty > 1) {
                result.rotation += this._resultA * blendWeight;
                result.skew += this._resultB * blendWeight;
            }
            else if (blendWeight !== 1.0) {
                result.rotation = this._resultA * blendWeight;
                result.skew = this._resultB * blendWeight;
            }
            else {
                result.rotation = this._resultA;
                result.skew = this._resultB;
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                bone._transformDirty = true;
            }
        }
    }
    dragonBones.BoneRotateTimelineState = BoneRotateTimelineState;
    /**
     * @internal
     */
    class BoneScaleTimelineState extends dragonBones.DoubleValueTimelineState {
        static toString() {
            return "[class dragonBones.BoneScaleTimelineState]";
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._timelineData === null) { // Pose.
                this._resultA = 1.0;
                this._resultB = 1.0;
            }
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameFloatOffset;
            this._valueArray = this._animationData.parent.parent.frameFloatArray;
        }
        blend(isDirty) {
            const blendState = this.target;
            const bone = blendState.target;
            const blendWeight = blendState.blendWeight;
            const result = bone.animationPose;
            if (blendState.dirty > 1) {
                result.scaleX += (this._resultA - 1.0) * blendWeight;
                result.scaleY += (this._resultB - 1.0) * blendWeight;
            }
            else if (blendWeight !== 1.0) {
                result.scaleX = (this._resultA - 1.0) * blendWeight + 1.0;
                result.scaleY = (this._resultB - 1.0) * blendWeight + 1.0;
            }
            else {
                result.scaleX = this._resultA;
                result.scaleY = this._resultB;
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                bone._transformDirty = true;
            }
        }
    }
    dragonBones.BoneScaleTimelineState = BoneScaleTimelineState;
    /**
     * @internal
     */
    class SurfaceTimelineState extends dragonBones.MutilpleValueTimelineState {
        static toString() {
            return "[class dragonBones.SurfaceTimelineState]";
        }
        _onClear() {
            super._onClear();
            this._deformCount = 0;
            this._deformOffset = 0;
            this._sameValueOffset = 0;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            if (this._timelineData !== null) {
                const dragonBonesData = this._animationData.parent.parent;
                const frameIntArray = dragonBonesData.frameIntArray;
                const frameIntOffset = this._animationData.frameIntOffset + this._timelineArray[this._timelineData.offset + 5 /* TimelineFrameValueCount */];
                this._valueOffset = this._animationData.frameFloatOffset;
                this._valueCount = frameIntArray[frameIntOffset + 2 /* DeformValueCount */];
                this._deformCount = frameIntArray[frameIntOffset + 1 /* DeformCount */];
                this._deformOffset = frameIntArray[frameIntOffset + 3 /* DeformValueOffset */];
                this._sameValueOffset = frameIntArray[frameIntOffset + 4 /* DeformFloatOffset */] + this._animationData.frameFloatOffset;
                this._valueScale = this._armature.armatureData.scale;
                this._valueArray = dragonBonesData.frameFloatArray;
                this._rd.length = this._valueCount * 2;
            }
            else {
                this._deformCount = this.target.target._deformVertices.length;
            }
        }
        blend(isDirty) {
            const blendState = this.target;
            const surface = blendState.target;
            const blendWeight = blendState.blendWeight;
            const result = surface._deformVertices;
            const valueArray = this._valueArray;
            if (valueArray !== null) {
                const valueCount = this._valueCount;
                const deformOffset = this._deformOffset;
                const sameValueOffset = this._sameValueOffset;
                const rd = this._rd;
                for (let i = 0; i < this._deformCount; ++i) {
                    let value = 0.0;
                    if (i < deformOffset) {
                        value = valueArray[sameValueOffset + i];
                    }
                    else if (i < deformOffset + valueCount) {
                        value = rd[i - deformOffset];
                    }
                    else {
                        value = valueArray[sameValueOffset + i - valueCount];
                    }
                    if (blendState.dirty > 1) {
                        result[i] += value * blendWeight;
                    }
                    else {
                        result[i] = value * blendWeight;
                    }
                }
            }
            else if (blendState.dirty === 1) {
                for (let i = 0; i < this._deformCount; ++i) {
                    result[i] = 0.0;
                }
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                surface._transformDirty = true;
            }
        }
    }
    dragonBones.SurfaceTimelineState = SurfaceTimelineState;
    /**
     * @internal
     */
    class AlphaTimelineState extends dragonBones.SingleValueTimelineState {
        static toString() {
            return "[class dragonBones.AlphaTimelineState]";
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._timelineData === null) { // Pose.
                this._result = 1.0;
            }
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameIntOffset;
            this._valueScale = 0.01;
            this._valueArray = this._animationData.parent.parent.frameIntArray;
        }
        blend(isDirty) {
            const blendState = this.target;
            const alphaTarget = blendState.target;
            const blendWeight = blendState.blendWeight;
            if (blendState.dirty > 1) {
                alphaTarget._alpha += this._result * blendWeight;
                if (alphaTarget._alpha > 1.0) {
                    alphaTarget._alpha = 1.0;
                }
            }
            else {
                alphaTarget._alpha = this._result * blendWeight;
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                this._armature._alphaDirty = true;
            }
        }
    }
    dragonBones.AlphaTimelineState = AlphaTimelineState;
    /**
     * @internal
     */
    class SlotDisplayTimelineState extends dragonBones.TimelineState {
        static toString() {
            return "[class dragonBones.SlotDisplayTimelineState]";
        }
        _onArriveAtFrame() {
            if (this.playState >= 0) {
                const slot = this.target;
                const displayIndex = this._timelineData !== null ? this._frameArray[this._frameOffset + 1] : slot._slotData.displayIndex;
                if (slot.displayIndex !== displayIndex) {
                    slot._setDisplayIndex(displayIndex, true);
                }
            }
        }
        _onUpdateFrame() {
        }
    }
    dragonBones.SlotDisplayTimelineState = SlotDisplayTimelineState;
    /**
     * @internal
     */
    class SlotColorTimelineState extends dragonBones.TweenTimelineState {
        constructor() {
            super(...arguments);
            this._current = [0, 0, 0, 0, 0, 0, 0, 0];
            this._difference = [0, 0, 0, 0, 0, 0, 0, 0];
            this._result = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        }
        static toString() {
            return "[class dragonBones.SlotColorTimelineState]";
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._timelineData !== null) {
                const dragonBonesData = this._animationData.parent.parent;
                const colorArray = dragonBonesData.colorArray;
                const frameIntArray = dragonBonesData.frameIntArray;
                const valueOffset = this._animationData.frameIntOffset + this._frameValueOffset + this._frameIndex;
                let colorOffset = frameIntArray[valueOffset];
                if (colorOffset < 0) {
                    colorOffset += 65536; // Fixed out of bounds bug. 
                }
                if (this._isTween) {
                    this._current[0] = colorArray[colorOffset++];
                    this._current[1] = colorArray[colorOffset++];
                    this._current[2] = colorArray[colorOffset++];
                    this._current[3] = colorArray[colorOffset++];
                    this._current[4] = colorArray[colorOffset++];
                    this._current[5] = colorArray[colorOffset++];
                    this._current[6] = colorArray[colorOffset++];
                    this._current[7] = colorArray[colorOffset++];
                    if (this._frameIndex === this._frameCount - 1) {
                        colorOffset = frameIntArray[this._animationData.frameIntOffset + this._frameValueOffset];
                    }
                    else {
                        colorOffset = frameIntArray[valueOffset + 1];
                    }
                    if (colorOffset < 0) {
                        colorOffset += 65536; // Fixed out of bounds bug. 
                    }
                    this._difference[0] = colorArray[colorOffset++] - this._current[0];
                    this._difference[1] = colorArray[colorOffset++] - this._current[1];
                    this._difference[2] = colorArray[colorOffset++] - this._current[2];
                    this._difference[3] = colorArray[colorOffset++] - this._current[3];
                    this._difference[4] = colorArray[colorOffset++] - this._current[4];
                    this._difference[5] = colorArray[colorOffset++] - this._current[5];
                    this._difference[6] = colorArray[colorOffset++] - this._current[6];
                    this._difference[7] = colorArray[colorOffset++] - this._current[7];
                }
                else {
                    this._result[0] = colorArray[colorOffset++] * 0.01;
                    this._result[1] = colorArray[colorOffset++] * 0.01;
                    this._result[2] = colorArray[colorOffset++] * 0.01;
                    this._result[3] = colorArray[colorOffset++] * 0.01;
                    this._result[4] = colorArray[colorOffset++];
                    this._result[5] = colorArray[colorOffset++];
                    this._result[6] = colorArray[colorOffset++];
                    this._result[7] = colorArray[colorOffset++];
                }
            }
            else { // Pose.
                const slot = this.target;
                const color = slot.slotData.color;
                this._result[0] = color.alphaMultiplier;
                this._result[1] = color.redMultiplier;
                this._result[2] = color.greenMultiplier;
                this._result[3] = color.blueMultiplier;
                this._result[4] = color.alphaOffset;
                this._result[5] = color.redOffset;
                this._result[6] = color.greenOffset;
                this._result[7] = color.blueOffset;
            }
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            if (this._isTween) {
                this._result[0] = (this._current[0] + this._difference[0] * this._tweenProgress) * 0.01;
                this._result[1] = (this._current[1] + this._difference[1] * this._tweenProgress) * 0.01;
                this._result[2] = (this._current[2] + this._difference[2] * this._tweenProgress) * 0.01;
                this._result[3] = (this._current[3] + this._difference[3] * this._tweenProgress) * 0.01;
                this._result[4] = this._current[4] + this._difference[4] * this._tweenProgress;
                this._result[5] = this._current[5] + this._difference[5] * this._tweenProgress;
                this._result[6] = this._current[6] + this._difference[6] * this._tweenProgress;
                this._result[7] = this._current[7] + this._difference[7] * this._tweenProgress;
            }
        }
        fadeOut() {
            this._isTween = false;
        }
        update(passedTime) {
            super.update(passedTime);
            // Fade animation.
            if (this._isTween || this.dirty) {
                const slot = this.target;
                const result = slot._colorTransform;
                if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    if (result.alphaMultiplier !== this._result[0] ||
                        result.redMultiplier !== this._result[1] ||
                        result.greenMultiplier !== this._result[2] ||
                        result.blueMultiplier !== this._result[3] ||
                        result.alphaOffset !== this._result[4] ||
                        result.redOffset !== this._result[5] ||
                        result.greenOffset !== this._result[6] ||
                        result.blueOffset !== this._result[7]) {
                        const fadeProgress = Math.pow(this._animationState._fadeProgress, 4);
                        result.alphaMultiplier += (this._result[0] - result.alphaMultiplier) * fadeProgress;
                        result.redMultiplier += (this._result[1] - result.redMultiplier) * fadeProgress;
                        result.greenMultiplier += (this._result[2] - result.greenMultiplier) * fadeProgress;
                        result.blueMultiplier += (this._result[3] - result.blueMultiplier) * fadeProgress;
                        result.alphaOffset += (this._result[4] - result.alphaOffset) * fadeProgress;
                        result.redOffset += (this._result[5] - result.redOffset) * fadeProgress;
                        result.greenOffset += (this._result[6] - result.greenOffset) * fadeProgress;
                        result.blueOffset += (this._result[7] - result.blueOffset) * fadeProgress;
                        slot._colorDirty = true;
                    }
                }
                else if (this.dirty) {
                    this.dirty = false;
                    if (result.alphaMultiplier !== this._result[0] ||
                        result.redMultiplier !== this._result[1] ||
                        result.greenMultiplier !== this._result[2] ||
                        result.blueMultiplier !== this._result[3] ||
                        result.alphaOffset !== this._result[4] ||
                        result.redOffset !== this._result[5] ||
                        result.greenOffset !== this._result[6] ||
                        result.blueOffset !== this._result[7]) {
                        result.alphaMultiplier = this._result[0];
                        result.redMultiplier = this._result[1];
                        result.greenMultiplier = this._result[2];
                        result.blueMultiplier = this._result[3];
                        result.alphaOffset = this._result[4];
                        result.redOffset = this._result[5];
                        result.greenOffset = this._result[6];
                        result.blueOffset = this._result[7];
                        slot._colorDirty = true;
                    }
                }
            }
        }
    }
    dragonBones.SlotColorTimelineState = SlotColorTimelineState;
    /**
     * @internal
     */
    class SlotZIndexTimelineState extends dragonBones.SingleValueTimelineState {
        static toString() {
            return "[class dragonBones.SlotZIndexTimelineState]";
        }
        _onArriveAtFrame() {
            super._onArriveAtFrame();
            if (this._timelineData === null) { // Pose.
                const blendState = this.target;
                const slot = blendState.target;
                this._result = slot.slotData.zIndex;
            }
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameIntOffset;
            this._valueArray = this._animationData.parent.parent.frameIntArray;
        }
        blend(isDirty) {
            const blendState = this.target;
            const slot = blendState.target;
            const blendWeight = blendState.blendWeight;
            if (blendState.dirty > 1) {
                slot._zIndex += this._result * blendWeight;
            }
            else {
                slot._zIndex = this._result * blendWeight;
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                this._armature._zIndexDirty = true;
            }
        }
    }
    dragonBones.SlotZIndexTimelineState = SlotZIndexTimelineState;
    /**
     * @internal
     */
    class DeformTimelineState extends dragonBones.MutilpleValueTimelineState {
        static toString() {
            return "[class dragonBones.DeformTimelineState]";
        }
        _onClear() {
            super._onClear();
            this.displayFrame = null;
            this._deformCount = 0;
            this._deformOffset = 0;
            this._sameValueOffset = 0;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            if (this._timelineData !== null) {
                const frameIntOffset = this._animationData.frameIntOffset + this._timelineArray[this._timelineData.offset + 5 /* TimelineFrameValueCount */];
                const dragonBonesData = this._animationData.parent.parent;
                const frameIntArray = dragonBonesData.frameIntArray;
                this._valueOffset = this._animationData.frameFloatOffset;
                this._valueCount = frameIntArray[frameIntOffset + 2 /* DeformValueCount */];
                this._deformCount = frameIntArray[frameIntOffset + 1 /* DeformCount */];
                this._deformOffset = frameIntArray[frameIntOffset + 3 /* DeformValueOffset */];
                this._sameValueOffset = frameIntArray[frameIntOffset + 4 /* DeformFloatOffset */];
                if (this._sameValueOffset < 0) {
                    this._sameValueOffset += 65536; // Fixed out of bounds bug. 
                }
                this._sameValueOffset += this._animationData.frameFloatOffset;
                this._valueScale = this._armature.armatureData.scale;
                this._valueArray = dragonBonesData.frameFloatArray;
                this._rd.length = this._valueCount * 2;
            }
            else {
                this._deformCount = this.displayFrame.deformVertices.length;
            }
        }
        blend(isDirty) {
            const blendState = this.target;
            const slot = blendState.target;
            const blendWeight = blendState.blendWeight;
            const result = this.displayFrame.deformVertices;
            const valueArray = this._valueArray;
            if (valueArray !== null) {
                const valueCount = this._valueCount;
                const deformOffset = this._deformOffset;
                const sameValueOffset = this._sameValueOffset;
                const rd = this._rd;
                for (let i = 0; i < this._deformCount; ++i) {
                    let value = 0.0;
                    if (i < deformOffset) {
                        value = valueArray[sameValueOffset + i];
                    }
                    else if (i < deformOffset + valueCount) {
                        value = rd[i - deformOffset];
                    }
                    else {
                        value = valueArray[sameValueOffset + i - valueCount];
                    }
                    if (blendState.dirty > 1) {
                        result[i] += value * blendWeight;
                    }
                    else {
                        result[i] = value * blendWeight;
                    }
                }
            }
            else if (blendState.dirty === 1) {
                for (let i = 0; i < this._deformCount; ++i) {
                    result[i] = 0.0;
                }
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                if (slot._geometryData === this.displayFrame.getGeometryData()) {
                    slot._verticesDirty = true;
                }
            }
        }
    }
    dragonBones.DeformTimelineState = DeformTimelineState;
    /**
     * @internal
     */
    class IKConstraintTimelineState extends dragonBones.DoubleValueTimelineState {
        static toString() {
            return "[class dragonBones.IKConstraintTimelineState]";
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            const ikConstraint = this.target;
            if (this._timelineData !== null) {
                ikConstraint._bendPositive = this._currentA > 0.0;
                ikConstraint._weight = this._resultB;
            }
            else {
                const ikConstraintData = ikConstraint._constraintData;
                ikConstraint._bendPositive = ikConstraintData.bendPositive;
                ikConstraint._weight = ikConstraintData.weight;
            }
            ikConstraint.invalidUpdate();
            this.dirty = false;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameIntOffset;
            this._valueScale = 0.01;
            this._valueArray = this._animationData.parent.parent.frameIntArray;
        }
    }
    dragonBones.IKConstraintTimelineState = IKConstraintTimelineState;
    /**
     * @internal
     */
    class PathConstraintPositionTimelineState extends dragonBones.SingleValueTimelineState {
        static toString() {
            return "[class dragonBones.PathConstraintPositionTimelineState]";
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            const pathConstraint = this.target;
            if (this._timelineData !== null) {
                pathConstraint.position = this._result;
            }
            else {
                const pathConstraintData = pathConstraint._constraintData;
                pathConstraint.position = pathConstraintData.position;
            }
            pathConstraint.invalidUpdate();
            this.dirty = false;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameFloatOffset;
            this._valueArray = this._animationData.parent.parent.frameFloatArray;
        }
    }
    dragonBones.PathConstraintPositionTimelineState = PathConstraintPositionTimelineState;
    /**
     * @internal
     */
    class PathConstraintSpacingTimelineState extends dragonBones.SingleValueTimelineState {
        static toString() {
            return "[class dragonBones.PathConstraintSpacingTimelineState]";
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            const pathConstraint = this.target;
            if (this._timelineData !== null) {
                pathConstraint.spacing = this._result;
            }
            else {
                const pathConstraintData = pathConstraint._constraintData;
                pathConstraint.spacing = pathConstraintData.spacing;
            }
            pathConstraint.invalidUpdate();
            this.dirty = false;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameFloatOffset;
            this._valueArray = this._animationData.parent.parent.frameFloatArray;
        }
    }
    dragonBones.PathConstraintSpacingTimelineState = PathConstraintSpacingTimelineState;
    /**
     * @internal
     */
    class PathConstraintWeightTimelineState extends dragonBones.MutilpleValueTimelineState {
        static toString() {
            return "[class dragonBones.PathConstraintWeightTimelineState]";
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            const pathConstraint = this.target;
            if (this._timelineData !== null) {
                const result = this._rd;
                pathConstraint.rotateWeight = result[0];
                pathConstraint.xWeight = result[1];
                pathConstraint.yWeight = result[2];
            }
            else {
                const pathConstraintData = pathConstraint._constraintData;
                pathConstraint.rotateWeight = pathConstraintData.rotateWeight;
                pathConstraint.xWeight = pathConstraintData.xWeight;
                pathConstraint.yWeight = pathConstraintData.yWeight;
            }
            pathConstraint.invalidUpdate();
            this.dirty = false;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueCount = 3;
            this._valueOffset = this._animationData.frameFloatOffset;
            this._valueArray = this._animationData.parent.parent.frameFloatArray;
        }
    }
    dragonBones.PathConstraintWeightTimelineState = PathConstraintWeightTimelineState;
    /**
     * @internal
     */
    class AnimationProgressTimelineState extends dragonBones.SingleValueTimelineState {
        static toString() {
            return "[class dragonBones.AnimationProgressTimelineState]";
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            const animationState = this.target;
            if (animationState._parent !== null) {
                animationState.currentTime = this._result * animationState.totalTime;
            }
            this.dirty = false;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameIntOffset;
            this._valueScale = 0.0001;
            this._valueArray = this._animationData.parent.parent.frameIntArray;
        }
    }
    dragonBones.AnimationProgressTimelineState = AnimationProgressTimelineState;
    /**
     * @internal
     */
    class AnimationWeightTimelineState extends dragonBones.SingleValueTimelineState {
        static toString() {
            return "[class dragonBones.AnimationWeightTimelineState]";
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            const animationState = this.target;
            if (animationState._parent !== null) {
                animationState.weight = this._result;
            }
            this.dirty = false;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameIntOffset;
            this._valueScale = 0.0001;
            this._valueArray = this._animationData.parent.parent.frameIntArray;
        }
    }
    dragonBones.AnimationWeightTimelineState = AnimationWeightTimelineState;
    /**
     * @internal
     */
    class AnimationParametersTimelineState extends dragonBones.DoubleValueTimelineState {
        static toString() {
            return "[class dragonBones.AnimationParametersTimelineState]";
        }
        _onUpdateFrame() {
            super._onUpdateFrame();
            const animationState = this.target;
            if (animationState._parent !== null) {
                animationState.parameterX = this._resultA;
                animationState.parameterY = this._resultB;
            }
            this.dirty = false;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            this._valueOffset = this._animationData.frameIntOffset;
            this._valueScale = 0.0001;
            this._valueArray = this._animationData.parent.parent.frameIntArray;
        }
    }
    dragonBones.AnimationParametersTimelineState = AnimationParametersTimelineState;
    class ShapeTimelineState extends dragonBones.MutilpleValueTimelineState {
        static toString() {
            return "[class dragonBones.ShapeTimelineState]";
        }
        _onClear() {
            super._onClear();
            this.displayFrame = null;
            this._shapeVerticesCount = 0;
            this._shapeVerticesOffset = 0;
            this._sameValueOffset = 0;
        }
        init(armature, animationState, timelineData) {
            super.init(armature, animationState, timelineData);
            if (this._timelineData !== null) {
                const frameIntOffset = this._animationData.frameIntOffset + this._timelineArray[this._timelineData.offset + 5 /* TimelineFrameValueCount */];
                const dragonBonesData = this._animationData.parent.parent;
                const frameIntArray = dragonBonesData.frameIntArray;
                this._valueOffset = this._animationData.frameFloatOffset;
                this._valueCount = frameIntArray[frameIntOffset + 2 /* ShapeVerticesValueCount */];
                this._shapeVerticesCount = frameIntArray[frameIntOffset + 1 /* ShapeVerticesCount */];
                this._shapeVerticesOffset = frameIntArray[frameIntOffset + 0 /* ShapeVerticesOffset */];
                this._sameValueOffset = frameIntArray[frameIntOffset + 4 /* ShapeVerticesFloatOffset */];
                if (this._sameValueOffset < 0) {
                    this._sameValueOffset += 65536; // Fixed out of bounds bug. 
                }
                this._sameValueOffset += this._animationData.frameFloatOffset;
                this._valueScale = this._armature.armatureData.scale;
                this._valueArray = dragonBonesData.frameFloatArray;
                this._rd.length = this._valueCount * 2;
            }
            else {
                this._shapeVerticesCount = this.displayFrame.shapeVertices.length;
            }
        }
        blend(isDirty) {
            const blendState = this.target;
            const slot = blendState.target;
            const blendWeight = blendState.blendWeight;
            const result = this.displayFrame.shapeVertices;
            const valueArray = this._valueArray;
            if (valueArray !== null) {
                const valueCount = this._valueCount;
                const shapeVerticesOffset = this._shapeVerticesOffset;
                const sameValueOffset = this._sameValueOffset;
                const rd = this._rd;
                for (let i = 0; i < this._shapeVerticesCount; ++i) {
                    let value = 0.0;
                    if (i < shapeVerticesOffset) {
                        value = valueArray[sameValueOffset + i];
                    }
                    else if (i < shapeVerticesOffset + valueCount) {
                        value = rd[i - shapeVerticesOffset];
                    }
                    else {
                        value = valueArray[sameValueOffset + i - valueCount];
                    }
                    if (blendState.dirty > 1) {
                        result[i] += value * blendWeight;
                    }
                    else {
                        result[i] = value * blendWeight;
                    }
                }
            }
            else if (blendState.dirty === 1) {
                for (let i = 0; i < this._shapeVerticesCount; ++i) {
                    result[i] = 0.0;
                }
            }
            if (isDirty || this.dirty) {
                this.dirty = false;
                if (slot._shapeData === this.displayFrame.getShapeData()) {
                    slot._shapeVerticesDirty = true;
                }
            }
        }
    }
    dragonBones.ShapeTimelineState = ShapeTimelineState;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The properties of the object carry basic information about an event,
     * which are passed as parameter or parameter's parameter to event listeners when an event occurs.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 事件对象，包含有关事件的基本信息，当发生事件时，该实例将作为参数或参数的参数传递给事件侦听器。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    class EventObject extends dragonBones.BaseObject {
        /**
         * @internal
         * @private
         */
        static actionDataToInstance(data, instance, armature) {
            if (data.type === 0 /* Play */) {
                instance.type = EventObject.FRAME_EVENT;
            }
            else {
                instance.type = data.type === 10 /* Frame */ ? EventObject.FRAME_EVENT : EventObject.SOUND_EVENT;
            }
            instance.name = data.name;
            instance.armature = armature;
            instance.actionData = data;
            instance.data = data.data;
            if (data.bone !== null) {
                instance.bone = armature.getBone(data.bone.name);
            }
            if (data.slot !== null) {
                instance.slot = armature.getSlot(data.slot.name);
            }
        }
        static toString() {
            return "[class dragonBones.EventObject]";
        }
        _onClear() {
            this.time = 0.0;
            this.type = "";
            this.name = "";
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
            this.actionData = null;
            this.data = null;
        }
    }
    /**
     * - Animation start play.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画开始播放。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.START = "start";
    /**
     * - Animation loop play complete once.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画循环播放完成一次。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.LOOP_COMPLETE = "loopComplete";
    /**
     * - Animation play complete.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画播放完成。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.COMPLETE = "complete";
    /**
     * - Animation fade in start.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画淡入开始。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.FADE_IN = "fadeIn";
    /**
     * - Animation fade in complete.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画淡入完成。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.FADE_IN_COMPLETE = "fadeInComplete";
    /**
     * - Animation fade out start.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画淡出开始。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.FADE_OUT = "fadeOut";
    /**
     * - Animation fade out complete.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画淡出完成。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
    /**
     * - Animation frame event.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画帧事件。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.FRAME_EVENT = "frameEvent";
    /**
     * - Animation frame sound event.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 动画帧声音事件。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    EventObject.SOUND_EVENT = "soundEvent";
    dragonBones.EventObject = EventObject;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class DataParser {
        static _getArmatureType(value) {
            switch (value.toLowerCase()) {
                case "stage":
                    return 2 /* Stage */;
                case "armature":
                    return 0 /* Armature */;
                case "movieclip":
                    return 1 /* MovieClip */;
                default:
                    return 0 /* Armature */;
            }
        }
        static _getBoneType(value) {
            switch (value.toLowerCase()) {
                case "bone":
                    return 0 /* Bone */;
                case "surface":
                    return 1 /* Surface */;
                default:
                    return 0 /* Bone */;
            }
        }
        static _getPositionMode(value) {
            switch (value) {
                case 1 /* Percent */:
                    return 1 /* Percent */;
                case 0 /* Fixed */:
                    return 0 /* Fixed */;
                default:
                    return 1 /* Percent */;
            }
        }
        static _getSpacingMode(value) {
            switch (value) {
                case 0 /* Length */:
                    return 0 /* Length */;
                case 2 /* Percent */:
                    return 2 /* Percent */;
                case 1 /* Fixed */:
                    return 1 /* Fixed */;
                default:
                    return 0 /* Length */;
            }
        }
        static _getRotateMode(value) {
            switch (value) {
                case 0 /* Tangent */:
                    return 0 /* Tangent */;
                case 1 /* Chain */:
                    return 1 /* Chain */;
                case 2 /* ChainScale */:
                    return 2 /* ChainScale */;
                default:
                    return 0 /* Tangent */;
            }
        }
        static _getDisplayType(value) {
            switch (value.toLowerCase()) {
                case "image":
                    return 0 /* Image */;
                case "mesh":
                    return 2 /* Mesh */;
                case "armature":
                    return 1 /* Armature */;
                case "boundingbox":
                    return 3 /* BoundingBox */;
                case "path":
                    return 4 /* Path */;
                case 'shape':
                    return 5 /* Shape */;
                default:
                    return 0 /* Image */;
            }
        }
        static _getBoundingBoxType(value) {
            switch (value.toLowerCase()) {
                case "rectangle":
                    return 0 /* Rectangle */;
                case "ellipse":
                    return 1 /* Ellipse */;
                case "polygon":
                    return 2 /* Polygon */;
                default:
                    return 0 /* Rectangle */;
            }
        }
        static _getBlendMode(value) {
            switch (value.toLowerCase()) {
                case "normal":
                    return 0 /* Normal */;
                case "add":
                    return 1 /* Add */;
                case "alpha":
                    return 2 /* Alpha */;
                case "darken":
                    return 3 /* Darken */;
                case "difference":
                    return 4 /* Difference */;
                case "erase":
                    return 5 /* Erase */;
                case "hardlight":
                    return 6 /* HardLight */;
                case "invert":
                    return 7 /* Invert */;
                case "layer":
                    return 8 /* Layer */;
                case "lighten":
                    return 9 /* Lighten */;
                case "multiply":
                    return 10 /* Multiply */;
                case "overlay":
                    return 11 /* Overlay */;
                case "screen":
                    return 12 /* Screen */;
                case "subtract":
                    return 13 /* Subtract */;
                default:
                    return 0 /* Normal */;
            }
        }
        static _getAnimationBlendType(value) {
            switch (value.toLowerCase()) {
                case "none":
                    return 0 /* None */;
                case "1d":
                    return 1 /* E1D */;
                default:
                    return 0 /* None */;
            }
        }
        static _getActionType(value) {
            switch (value.toLowerCase()) {
                case "play":
                    return 0 /* Play */;
                case "frame":
                    return 10 /* Frame */;
                case "sound":
                    return 11 /* Sound */;
                default:
                    return 0 /* Play */;
            }
        }
    }
    DataParser.DATA_VERSION_2_3 = "2.3";
    DataParser.DATA_VERSION_3_0 = "3.0";
    DataParser.DATA_VERSION_4_0 = "4.0";
    DataParser.DATA_VERSION_4_5 = "4.5";
    DataParser.DATA_VERSION_5_0 = "5.0";
    DataParser.DATA_VERSION_5_5 = "5.5";
    DataParser.DATA_VERSION_5_6 = "5.6";
    DataParser.DATA_VERSION_6_0 = "6.0";
    DataParser.DATA_VERSION = DataParser.DATA_VERSION_5_6;
    DataParser.DATA_VERSIONS = [
        DataParser.DATA_VERSION_4_0,
        DataParser.DATA_VERSION_4_5,
        DataParser.DATA_VERSION_5_0,
        DataParser.DATA_VERSION_5_5,
        DataParser.DATA_VERSION_5_6,
        DataParser.DATA_VERSION_6_0,
    ];
    DataParser.TEXTURE_ATLAS = "textureAtlas";
    DataParser.SUB_TEXTURE = "SubTexture";
    DataParser.FORMAT = "format";
    DataParser.IMAGE_PATH = "imagePath";
    DataParser.WIDTH = "width";
    DataParser.HEIGHT = "height";
    DataParser.ROTATED = "rotated";
    DataParser.FRAME_X = "frameX";
    DataParser.FRAME_Y = "frameY";
    DataParser.FRAME_WIDTH = "frameWidth";
    DataParser.FRAME_HEIGHT = "frameHeight";
    DataParser.DRADON_BONES = "dragonBones";
    DataParser.USER_DATA = "userData";
    DataParser.ARMATURE = "armature";
    DataParser.CANVAS = "canvas";
    DataParser.BONE = "bone";
    DataParser.SURFACE = "surface";
    DataParser.SLOT = "slot";
    DataParser.CONSTRAINT = "constraint";
    DataParser.SKIN = "skin";
    DataParser.DISPLAY = "display";
    DataParser.FRAME = "frame";
    DataParser.IK = "ik";
    DataParser.TRANSFORM_CONSTRAINT = "transform";
    DataParser.PHYSICS = "physics";
    DataParser.PATH_CONSTRAINT = "path";
    DataParser.PATH_CONSTRAINT_POSITION = "position";
    DataParser.PATH_CONSTRAINT_SPACING = "spacing";
    DataParser.PATH_CONSTRAINT_WEIGHT = "weight";
    DataParser.ANIMATION = "animation";
    DataParser.TIMELINE = "timeline";
    DataParser.FFD = "ffd";
    DataParser.SHAPE = "shape";
    DataParser.TRANSLATE_FRAME = "translateFrame";
    DataParser.ROTATE_FRAME = "rotateFrame";
    DataParser.SCALE_FRAME = "scaleFrame";
    DataParser.DISPLAY_FRAME = "displayFrame";
    DataParser.COLOR_FRAME = "colorFrame";
    DataParser.DEFAULT_ACTIONS = "defaultActions";
    DataParser.ACTIONS = "actions";
    DataParser.EVENTS = "events";
    DataParser.INTS = "ints";
    DataParser.FLOATS = "floats";
    DataParser.STRINGS = "strings";
    DataParser.TRANSFORM = "transform";
    DataParser.PIVOT = "pivot";
    DataParser.AABB = "aabb";
    DataParser.COLOR = "color";
    DataParser.VERSION = "version";
    DataParser.COMPATIBLE_VERSION = "compatibleVersion";
    DataParser.FRAME_RATE = "frameRate";
    DataParser.TYPE = "type";
    DataParser.SUB_TYPE = "subType";
    DataParser.NAME = "name";
    DataParser.PARENT = "parent";
    DataParser.TARGET = "target";
    DataParser.STAGE = "stage";
    DataParser.SHARE = "share";
    DataParser.PATH = "path";
    DataParser.LENGTH = "length";
    DataParser.DISPLAY_INDEX = "displayIndex";
    DataParser.Z_ORDER = "zOrder";
    DataParser.Z_INDEX = "zIndex";
    DataParser.BLEND_MODE = "blendMode";
    DataParser.INHERIT_TRANSLATION = "inheritTranslation";
    DataParser.INHERIT_ROTATION = "inheritRotation";
    DataParser.INHERIT_SCALE = "inheritScale";
    DataParser.INHERIT_REFLECTION = "inheritReflection";
    DataParser.INHERIT_ANIMATION = "inheritAnimation";
    DataParser.INHERIT_DEFORM = "inheritDeform";
    DataParser.SEGMENT_X = "segmentX";
    DataParser.SEGMENT_Y = "segmentY";
    DataParser.BEND_POSITIVE = "bendPositive";
    DataParser.CHAIN = "chain";
    DataParser.WEIGHT = "weight";
    DataParser.MASK = "mask";
    DataParser.MASK_RANGE = "maskRange";
    DataParser.BLEND_TYPE = "blendType";
    DataParser.FADE_IN_TIME = "fadeInTime";
    DataParser.PLAY_TIMES = "playTimes";
    DataParser.SCALE = "scale";
    DataParser.OFFSET = "offset";
    DataParser.LOOP = "loop";
    DataParser.POSITION = "position";
    DataParser.DURATION = "duration";
    DataParser.TWEEN_EASING = "tweenEasing";
    DataParser.TWEEN_ROTATE = "tweenRotate";
    DataParser.TWEEN_SCALE = "tweenScale";
    DataParser.CLOCK_WISE = "clockwise";
    DataParser.CURVE = "curve";
    DataParser.SOUND = "sound";
    DataParser.EVENT = "event";
    DataParser.ACTION = "action";
    DataParser.X = "x";
    DataParser.Y = "y";
    DataParser.SKEW_X = "skX";
    DataParser.SKEW_Y = "skY";
    DataParser.SCALE_X = "scX";
    DataParser.SCALE_Y = "scY";
    DataParser.SHEAR_X = "shearX";
    DataParser.VALUE = "value";
    DataParser.ROTATE = "rotate";
    DataParser.SKEW = "skew";
    DataParser.ALPHA = "alpha";
    DataParser.ALPHA_OFFSET = "aO";
    DataParser.RED_OFFSET = "rO";
    DataParser.GREEN_OFFSET = "gO";
    DataParser.BLUE_OFFSET = "bO";
    DataParser.ALPHA_MULTIPLIER = "aM";
    DataParser.RED_MULTIPLIER = "rM";
    DataParser.GREEN_MULTIPLIER = "gM";
    DataParser.BLUE_MULTIPLIER = "bM";
    DataParser.UVS = "uvs";
    DataParser.VERTICES = "vertices";
    DataParser.TRIANGLES = "triangles";
    DataParser.WEIGHTS = "weights";
    DataParser.SLOT_POSE = "slotPose";
    DataParser.BONE_POSE = "bonePose";
    DataParser.BONES = "bones";
    DataParser.POSITION_MODE = "positionMode";
    DataParser.SPACING_MODE = "spacingMode";
    DataParser.ROTATE_MODE = "rotateMode";
    DataParser.SPACING = "spacing";
    DataParser.ROTATE_OFFSET = "rotateOffset";
    DataParser.ROTATE_WEIGHT = "rotateWeight";
    DataParser.SCALE_WEIGHT = "scaleWeight";
    DataParser.TRANSLATE_WEIGHT = "translateWeight";
    DataParser.X_WEIGHT = "xWeight";
    DataParser.Y_WEIGHT = "yWeight";
    DataParser.LOCAL = "local";
    DataParser.RELATIVE = "relative";
    DataParser.TARGET_DISPLAY = "targetDisplay";
    DataParser.CLOSED = "closed";
    DataParser.CONSTANT_SPEED = "constantSpeed";
    DataParser.VERTEX_COUNT = "vertexCount";
    DataParser.LENGTHS = "lengths";
    DataParser.GOTO_AND_PLAY = "gotoAndPlay";
    DataParser.DEFAULT_NAME = "default";
    // physics
    DataParser.LIMIT = "limit";
    DataParser.FPS = "fps";
    DataParser.INERTIA = "inertia";
    DataParser.STRENGTH = "strength";
    DataParser.DAMPING = "damping";
    DataParser.MASS = "mass";
    DataParser.WIND = "wind";
    DataParser.GRAVITY = "gravity";
    dragonBones.DataParser = DataParser;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class ObjectDataParser extends dragonBones.DataParser {
        constructor() {
            super(...arguments);
            this._rawTextureAtlasIndex = 0;
            this._rawBones = [];
            this._data = null; //
            this._armature = null; //
            this._bone = null; //
            this._geometry = null; //
            this._slot = null; //
            this._skin = null; //
            this._mesh = null; //
            this._shape = null; //
            this._animation = null; //
            this._timeline = null; //
            this._rawTextureAtlases = null;
            this._frameValueType = 0 /* Step */;
            this._defaultColorOffset = -1;
            this._prevClockwise = 0;
            this._prevRotation = 0.0;
            this._frameDefaultValue = 0.0;
            this._frameValueScale = 1.0;
            this._helpMatrixA = new dragonBones.Matrix();
            this._helpMatrixB = new dragonBones.Matrix();
            this._helpTransform = new dragonBones.Transform();
            this._helpColorTransform = new dragonBones.ColorTransform();
            this._helpPoint = new dragonBones.Point();
            this._helpArray = [];
            this._intArray = [];
            this._floatArray = [];
            this._frameIntArray = [];
            this._frameFloatArray = [];
            this._frameArray = [];
            this._timelineArray = [];
            this._colorArray = [];
            this._cacheRawMeshes = [];
            this._cacheMeshes = [];
            this._actionFrames = [];
            this._weightSlotPose = {};
            this._weightBonePoses = {};
            this._cacheBones = {};
            this._slotChildActions = {};
        }
        static _getBoolean(rawData, key, defaultValue) {
            if (key in rawData) {
                const value = rawData[key];
                const type = typeof value;
                if (type === "boolean") {
                    return value;
                }
                else if (type === "string") {
                    switch (value) {
                        case "0":
                        case "NaN":
                        case "":
                        case "false":
                        case "null":
                        case "undefined":
                            return false;
                        default:
                            return true;
                    }
                }
                else {
                    return !!value;
                }
            }
            return defaultValue;
        }
        static _getNumber(rawData, key, defaultValue) {
            if (key in rawData) {
                const value = rawData[key];
                if (value === null || value === "NaN") {
                    return defaultValue;
                }
                return +value || 0;
            }
            return defaultValue;
        }
        static _getString(rawData, key, defaultValue) {
            if (key in rawData) {
                const value = rawData[key];
                const type = typeof value;
                if (type === "string") {
                    return value;
                }
                return String(value);
            }
            return defaultValue;
        }
        _getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, t, result) {
            const l_t = 1.0 - t;
            const powA = l_t * l_t;
            const powB = t * t;
            const kA = l_t * powA;
            const kB = 3.0 * t * powA;
            const kC = 3.0 * l_t * powB;
            const kD = t * powB;
            result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
            result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
        }
        _samplingEasingCurve(curve, samples) {
            const curveCount = curve.length;
            if (curveCount % 3 === 1) {
                let stepIndex = -2;
                for (let i = 0, l = samples.length; i < l; ++i) {
                    let t = (i + 1) / (l + 1); // float
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
                    while (higher - lower > 0.0001) {
                        const percentage = (higher + lower) * 0.5;
                        this._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, this._helpPoint);
                        if (t - this._helpPoint.x > 0.0) {
                            lower = percentage;
                        }
                        else {
                            higher = percentage;
                        }
                    }
                    samples[i] = this._helpPoint.y;
                }
                return true;
            }
            else {
                let stepIndex = 0;
                for (let i = 0, l = samples.length; i < l; ++i) {
                    let t = (i + 1) / (l + 1); // float
                    while (curve[stepIndex + 6] < t) { // stepIndex + 3 * 2
                        stepIndex += 6;
                    }
                    const x1 = curve[stepIndex];
                    const y1 = curve[stepIndex + 1];
                    const x2 = curve[stepIndex + 2];
                    const y2 = curve[stepIndex + 3];
                    const x3 = curve[stepIndex + 4];
                    const y3 = curve[stepIndex + 5];
                    const x4 = curve[stepIndex + 6];
                    const y4 = curve[stepIndex + 7];
                    let lower = 0.0;
                    let higher = 1.0;
                    while (higher - lower > 0.0001) {
                        const percentage = (higher + lower) * 0.5;
                        this._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, this._helpPoint);
                        if (t - this._helpPoint.x > 0.0) {
                            lower = percentage;
                        }
                        else {
                            higher = percentage;
                        }
                    }
                    samples[i] = this._helpPoint.y;
                }
                return false;
            }
        }
        _parseActionDataInFrame(rawData, frameStart, bone, slot) {
            if (dragonBones.DataParser.EVENT in rawData) {
                this._mergeActionFrame(rawData[dragonBones.DataParser.EVENT], frameStart, 10 /* Frame */, bone, slot);
            }
            if (dragonBones.DataParser.SOUND in rawData) {
                this._mergeActionFrame(rawData[dragonBones.DataParser.SOUND], frameStart, 11 /* Sound */, bone, slot);
            }
            if (dragonBones.DataParser.ACTION in rawData) {
                this._mergeActionFrame(rawData[dragonBones.DataParser.ACTION], frameStart, 0 /* Play */, bone, slot);
            }
            if (dragonBones.DataParser.EVENTS in rawData) {
                this._mergeActionFrame(rawData[dragonBones.DataParser.EVENTS], frameStart, 10 /* Frame */, bone, slot);
            }
            if (dragonBones.DataParser.ACTIONS in rawData) {
                this._mergeActionFrame(rawData[dragonBones.DataParser.ACTIONS], frameStart, 0 /* Play */, bone, slot);
            }
        }
        _mergeActionFrame(rawData, frameStart, type, bone, slot) {
            const actionOffset = this._armature.actions.length;
            const actions = this._parseActionData(rawData, type, bone, slot);
            let frameIndex = 0;
            let frame = null;
            for (const action of actions) {
                this._armature.addAction(action, false);
            }
            if (this._actionFrames.length === 0) { // First frame.
                frame = new ActionFrame();
                frame.frameStart = 0;
                this._actionFrames.push(frame);
                frame = null;
            }
            for (const eachFrame of this._actionFrames) { // Get same frame.
                if (eachFrame.frameStart === frameStart) {
                    frame = eachFrame;
                    break;
                }
                else if (eachFrame.frameStart > frameStart) {
                    break;
                }
                frameIndex++;
            }
            if (frame === null) { // Create and cache frame.
                frame = new ActionFrame();
                frame.frameStart = frameStart;
                this._actionFrames.splice(frameIndex, 0, frame);
            }
            for (let i = 0; i < actions.length; ++i) { // Cache action offsets.
                frame.actions.push(actionOffset + i);
            }
        }
        _parseArmature(rawData, scale) {
            const armature = dragonBones.BaseObject.borrowObject(dragonBones.ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            armature.frameRate = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.FRAME_RATE, this._data.frameRate);
            armature.scale = scale;
            if (dragonBones.DataParser.TYPE in rawData && typeof rawData[dragonBones.DataParser.TYPE] === "string") {
                armature.type = dragonBones.DataParser._getArmatureType(rawData[dragonBones.DataParser.TYPE]);
            }
            else {
                armature.type = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.TYPE, 0 /* Armature */);
            }
            if (armature.frameRate === 0) { // Data error.
                armature.frameRate = 24;
            }
            this._armature = armature;
            if (dragonBones.DataParser.CANVAS in rawData) {
                const rawCanvas = rawData[dragonBones.DataParser.CANVAS];
                const canvas = dragonBones.BaseObject.borrowObject(dragonBones.CanvasData);
                if (dragonBones.DataParser.COLOR in rawCanvas) {
                    canvas.hasBackground = true;
                }
                else {
                    canvas.hasBackground = false;
                }
                canvas.color = ObjectDataParser._getNumber(rawCanvas, dragonBones.DataParser.COLOR, 0);
                canvas.x = ObjectDataParser._getNumber(rawCanvas, dragonBones.DataParser.X, 0) * armature.scale;
                canvas.y = ObjectDataParser._getNumber(rawCanvas, dragonBones.DataParser.Y, 0) * armature.scale;
                canvas.width = ObjectDataParser._getNumber(rawCanvas, dragonBones.DataParser.WIDTH, 0) * armature.scale;
                canvas.height = ObjectDataParser._getNumber(rawCanvas, dragonBones.DataParser.HEIGHT, 0) * armature.scale;
                armature.canvas = canvas;
            }
            if (dragonBones.DataParser.AABB in rawData) {
                const rawAABB = rawData[dragonBones.DataParser.AABB];
                armature.aabb.x = ObjectDataParser._getNumber(rawAABB, dragonBones.DataParser.X, 0.0) * armature.scale;
                armature.aabb.y = ObjectDataParser._getNumber(rawAABB, dragonBones.DataParser.Y, 0.0) * armature.scale;
                armature.aabb.width = ObjectDataParser._getNumber(rawAABB, dragonBones.DataParser.WIDTH, 0.0) * armature.scale;
                armature.aabb.height = ObjectDataParser._getNumber(rawAABB, dragonBones.DataParser.HEIGHT, 0.0) * armature.scale;
            }
            if (dragonBones.DataParser.BONE in rawData) {
                const rawBones = rawData[dragonBones.DataParser.BONE];
                for (const rawBone of rawBones) {
                    const parentName = ObjectDataParser._getString(rawBone, dragonBones.DataParser.PARENT, "");
                    const bone = this._parseBone(rawBone);
                    if (parentName.length > 0) { // Get bone parent.
                        const parent = armature.getBone(parentName);
                        if (parent !== null) {
                            bone.parent = parent;
                        }
                        else { // Cache.
                            if (!(parentName in this._cacheBones)) {
                                this._cacheBones[parentName] = [];
                            }
                            this._cacheBones[parentName].push(bone);
                        }
                    }
                    if (bone.name in this._cacheBones) {
                        for (const child of this._cacheBones[bone.name]) {
                            child.parent = bone;
                        }
                        delete this._cacheBones[bone.name];
                    }
                    armature.addBone(bone);
                    this._rawBones.push(bone); // Cache raw bones sort.
                }
            }
            if (dragonBones.DataParser.IK in rawData) {
                const rawIKS = rawData[dragonBones.DataParser.IK];
                for (const rawIK of rawIKS) {
                    const constraint = this._parseIKConstraint(rawIK);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }
            if (dragonBones.DataParser.TRANSFORM_CONSTRAINT in rawData) {
                const rawTransformConstraints = rawData[dragonBones.DataParser.TRANSFORM_CONSTRAINT];
                for (const rawTransCon of rawTransformConstraints) {
                    const constraint = this._parseTransformConstraint(rawTransCon);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }
            if (dragonBones.DataParser.PHYSICS in rawData) {
                const rawPhysicsConstraints = rawData[dragonBones.DataParser.PHYSICS];
                for (const rawPhysicsCon of rawPhysicsConstraints) {
                    const constraint = this._parsePhysics(rawPhysicsCon);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }
            armature.sortBones();
            if (dragonBones.DataParser.SLOT in rawData) {
                let zOrder = 0;
                const rawSlots = rawData[dragonBones.DataParser.SLOT];
                for (const rawSlot of rawSlots) {
                    armature.addSlot(this._parseSlot(rawSlot, zOrder++));
                }
            }
            if (dragonBones.DataParser.SKIN in rawData) {
                const rawSkins = rawData[dragonBones.DataParser.SKIN];
                for (const rawSkin of rawSkins) {
                    armature.addSkin(this._parseSkin(rawSkin));
                }
            }
            if (dragonBones.DataParser.PATH_CONSTRAINT in rawData) {
                const rawPaths = rawData[dragonBones.DataParser.PATH_CONSTRAINT];
                for (const rawPath of rawPaths) {
                    const constraint = this._parsePathConstraint(rawPath);
                    if (constraint) {
                        armature.addConstraint(constraint);
                    }
                }
            }
            for (let i = 0, l = this._cacheRawMeshes.length; i < l; ++i) { // Link mesh.
                const rawData = this._cacheRawMeshes[i];
                const shareName = ObjectDataParser._getString(rawData, dragonBones.DataParser.SHARE, "");
                if (shareName.length === 0) {
                    continue;
                }
                let skinName = ObjectDataParser._getString(rawData, dragonBones.DataParser.SKIN, dragonBones.DataParser.DEFAULT_NAME);
                if (skinName.length === 0) { // 
                    skinName = dragonBones.DataParser.DEFAULT_NAME;
                }
                const shareMesh = armature.getMesh(skinName, "", shareName); // TODO slot;
                if (shareMesh === null) {
                    continue; // Error.
                }
                const mesh = this._cacheMeshes[i];
                mesh.geometry.shareFrom(shareMesh.geometry);
            }
            if (dragonBones.DataParser.ANIMATION in rawData) {
                const rawAnimations = rawData[dragonBones.DataParser.ANIMATION];
                for (const rawAnimation of rawAnimations) {
                    const animation = this._parseAnimation(rawAnimation);
                    armature.addAnimation(animation);
                }
            }
            if (dragonBones.DataParser.DEFAULT_ACTIONS in rawData) {
                const actions = this._parseActionData(rawData[dragonBones.DataParser.DEFAULT_ACTIONS], 0 /* Play */, null, null);
                for (const action of actions) {
                    armature.addAction(action, true);
                    if (action.type === 0 /* Play */) { // Set default animation from default action.
                        const animation = armature.getAnimation(action.name);
                        if (animation !== null) {
                            armature.defaultAnimation = animation;
                        }
                    }
                }
            }
            if (dragonBones.DataParser.ACTIONS in rawData) {
                const actions = this._parseActionData(rawData[dragonBones.DataParser.ACTIONS], 0 /* Play */, null, null);
                for (const action of actions) {
                    armature.addAction(action, false);
                }
            }
            // Clear helper.
            this._rawBones.length = 0;
            this._cacheRawMeshes.length = 0;
            this._cacheMeshes.length = 0;
            this._armature = null;
            for (let k in this._weightSlotPose) {
                delete this._weightSlotPose[k];
            }
            for (let k in this._weightBonePoses) {
                delete this._weightBonePoses[k];
            }
            for (let k in this._cacheBones) {
                delete this._cacheBones[k];
            }
            for (let k in this._slotChildActions) {
                delete this._slotChildActions[k];
            }
            return armature;
        }
        _parseBone(rawData) {
            let type = 0 /* Bone */;
            if (dragonBones.DataParser.TYPE in rawData && typeof rawData[dragonBones.DataParser.TYPE] === "string") {
                type = dragonBones.DataParser._getBoneType(rawData[dragonBones.DataParser.TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.TYPE, 0 /* Bone */);
            }
            if (type === 0 /* Bone */) {
                const scale = this._armature.scale;
                const bone = dragonBones.BaseObject.borrowObject(dragonBones.BoneData);
                bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.INHERIT_TRANSLATION, true);
                bone.inheritRotation = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.INHERIT_ROTATION, true);
                bone.inheritScale = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.INHERIT_SCALE, true);
                bone.inheritReflection = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.INHERIT_REFLECTION, true);
                bone.length = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.LENGTH, 0) * scale;
                bone.alpha = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ALPHA, 1.0);
                bone.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
                if (dragonBones.DataParser.TRANSFORM in rawData) {
                    this._parseTransform(rawData[dragonBones.DataParser.TRANSFORM], bone.transform, scale);
                }
                return bone;
            }
            const surface = dragonBones.BaseObject.borrowObject(dragonBones.SurfaceData);
            surface.alpha = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ALPHA, 1.0);
            surface.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            surface.segmentX = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SEGMENT_X, 0);
            surface.segmentY = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SEGMENT_Y, 0);
            this._parseGeometry(rawData, surface.geometry);
            return surface;
        }
        _parseIKConstraint(rawData) {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, dragonBones.DataParser.BONE, ""));
            if (bone === null) {
                return null;
            }
            const target = this._armature.getBone(ObjectDataParser._getString(rawData, dragonBones.DataParser.TARGET, ""));
            if (target === null) {
                return null;
            }
            const chain = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.CHAIN, 0);
            const constraint = dragonBones.BaseObject.borrowObject(dragonBones.IKConstraintData);
            constraint.scaleEnabled = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.SCALE, false);
            constraint.bendPositive = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.BEND_POSITIVE, true);
            constraint.weight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.WEIGHT, 1.0);
            constraint.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            constraint.type = 0 /* IK */;
            constraint.target = target;
            if (chain > 0 && bone.parent !== null) {
                constraint.root = bone.parent;
                constraint.bone = bone;
            }
            else {
                constraint.root = bone;
                constraint.bone = null;
            }
            return constraint;
        }
        _parseTransformConstraint(rawData) {
            const target = this._armature.getBone(ObjectDataParser._getString(rawData, dragonBones.DataParser.TARGET, ""));
            if (target === null) {
                return null;
            }
            const boneNames = rawData[dragonBones.DataParser.BONES];
            if (boneNames === null || boneNames.length === 0) {
                return null;
            }
            const bones = new Array();
            for (let boneName of boneNames) {
                const bone = this._armature.getBone(boneName);
                if (bone !== null) {
                    bones.push(bone);
                }
            }
            if (bones.length === 0) {
                return null;
            }
            const constraint = dragonBones.BaseObject.borrowObject(dragonBones.TransformConstraintData);
            constraint.type = 2 /* Transform */;
            constraint.target = target;
            constraint.bones = bones;
            constraint.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            const rawOffsetTransform = rawData[dragonBones.DataParser.OFFSET];
            constraint.offsetX = ObjectDataParser._getNumber(rawOffsetTransform, dragonBones.DataParser.X, 0.0);
            constraint.offsetY = ObjectDataParser._getNumber(rawOffsetTransform, dragonBones.DataParser.Y, 0.0);
            if (dragonBones.DataParser.SKEW_X in rawOffsetTransform) {
                constraint.offsetRotation = dragonBones.Transform.normalizeRadian(ObjectDataParser._getNumber(rawOffsetTransform, dragonBones.DataParser.SKEW_X, 0.0) * dragonBones.Transform.DEG_RAD);
            }
            constraint.offsetScaleX = ObjectDataParser._getNumber(rawOffsetTransform, dragonBones.DataParser.SCALE_X, 0.0);
            constraint.offsetScaleY = ObjectDataParser._getNumber(rawOffsetTransform, dragonBones.DataParser.SCALE_Y, 0.0);
            constraint.rotateWeight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ROTATE_WEIGHT, 0.0);
            constraint.scaleWeight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SCALE_WEIGHT, 0.0);
            constraint.translateWeight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.TRANSLATE_WEIGHT, 0.0);
            constraint.local = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.LOCAL, false);
            constraint.relative = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.RELATIVE, false);
            return constraint;
        }
        _parsePhysics(rawData) {
            const boneName = rawData[dragonBones.DataParser.BONE];
            if (!boneName) {
                return null;
            }
            const bone = this._armature.getBone(boneName);
            if (!bone) {
                return null;
            }
            const constraint = dragonBones.BaseObject.borrowObject(dragonBones.PhysicsConstraintData);
            constraint.type = 3 /* Physics */;
            constraint.target = bone;
            constraint.bone = bone;
            constraint.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            constraint.x = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X, 0.0);
            constraint.y = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y, 0.0);
            constraint.rotate = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ROTATE, 0.0);
            constraint.scaleX = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SCALE_X, 0.0);
            constraint.shearX = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SHEAR_X, 0.0);
            constraint.limit = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.LIMIT, 0.0);
            constraint.fps = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.FPS, 1.0);
            constraint.inertia = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.INERTIA, 0.0);
            constraint.strength = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.STRENGTH, 0.0);
            constraint.damping = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.DAMPING, 0.0);
            constraint.mass = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.MASS, 0.0);
            constraint.wind = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.WIND, 0.0);
            constraint.gravity = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.GRAVITY, 0.0);
            constraint.weight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.WEIGHT, 0.0);
            return constraint;
        }
        _parsePathConstraint(rawData) {
            const target = this._armature.getSlot(ObjectDataParser._getString(rawData, dragonBones.DataParser.TARGET, ""));
            if (target === null) {
                return null;
            }
            const defaultSkin = this._armature.defaultSkin;
            if (defaultSkin === null) {
                return null;
            }
            //TODO
            const targetDisplay = defaultSkin.getDisplay(target.name, ObjectDataParser._getString(rawData, dragonBones.DataParser.TARGET_DISPLAY, target.name));
            if (targetDisplay === null || !(targetDisplay instanceof dragonBones.PathDisplayData)) {
                return null;
            }
            const bones = rawData[dragonBones.DataParser.BONES];
            if (bones === null || bones.length === 0) {
                return null;
            }
            const constraint = dragonBones.BaseObject.borrowObject(dragonBones.PathConstraintData);
            constraint.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            constraint.type = 1 /* Path */;
            constraint.pathSlot = target;
            constraint.pathDisplayData = targetDisplay;
            constraint.target = target.parent;
            constraint.positionMode = dragonBones.DataParser._getPositionMode(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.POSITION_MODE, 0 /* Fixed */));
            constraint.spacingMode = dragonBones.DataParser._getSpacingMode(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SPACING_MODE, 1 /* Fixed */));
            constraint.rotateMode = dragonBones.DataParser._getRotateMode(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ROTATE_MODE, 0 /* Tangent */));
            constraint.position = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.POSITION, 0);
            constraint.spacing = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SPACING, 0);
            constraint.rotateOffset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ROTATE_OFFSET, 0);
            constraint.rotateWeight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ROTATE_WEIGHT, 1);
            constraint.xWeight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X_WEIGHT, 1);
            constraint.yWeight = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y_WEIGHT, 1);
            //
            for (var boneName of bones) {
                const bone = this._armature.getBone(boneName);
                if (bone !== null) {
                    constraint.AddBone(bone);
                    if (constraint.root === null) {
                        constraint.root = bone;
                    }
                }
            }
            return constraint;
        }
        _parseSlot(rawData, zOrder) {
            const slot = dragonBones.BaseObject.borrowObject(dragonBones.SlotData);
            slot.displayIndex = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.DISPLAY_INDEX, 0);
            slot.zOrder = zOrder;
            slot.zIndex = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Z_INDEX, 0);
            slot.alpha = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ALPHA, 1.0);
            slot.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, dragonBones.DataParser.PARENT, "")); //
            if (dragonBones.DataParser.BLEND_MODE in rawData && typeof rawData[dragonBones.DataParser.BLEND_MODE] === "string") {
                slot.blendMode = dragonBones.DataParser._getBlendMode(rawData[dragonBones.DataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.BLEND_MODE, 0 /* Normal */);
            }
            if (dragonBones.DataParser.COLOR in rawData) {
                slot.color = dragonBones.SlotData.createColor();
                this._parseColorTransform(rawData[dragonBones.DataParser.COLOR], slot.color);
            }
            else {
                slot.color = dragonBones.SlotData.DEFAULT_COLOR;
            }
            if (dragonBones.DataParser.ACTIONS in rawData) {
                this._slotChildActions[slot.name] = this._parseActionData(rawData[dragonBones.DataParser.ACTIONS], 0 /* Play */, null, null);
            }
            return slot;
        }
        _parseSkin(rawData) {
            const skin = dragonBones.BaseObject.borrowObject(dragonBones.SkinData);
            skin.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, dragonBones.DataParser.DEFAULT_NAME);
            if (skin.name.length === 0) {
                skin.name = dragonBones.DataParser.DEFAULT_NAME;
            }
            if (dragonBones.DataParser.SLOT in rawData) {
                const rawSlots = rawData[dragonBones.DataParser.SLOT];
                this._skin = skin;
                for (const rawSlot of rawSlots) {
                    const slotName = ObjectDataParser._getString(rawSlot, dragonBones.DataParser.NAME, "");
                    const slot = this._armature.getSlot(slotName);
                    if (slot !== null) {
                        this._slot = slot;
                        if (dragonBones.DataParser.DISPLAY in rawSlot) {
                            const rawDisplays = rawSlot[dragonBones.DataParser.DISPLAY];
                            for (const rawDisplay of rawDisplays) {
                                if (rawDisplay) {
                                    skin.addDisplay(slotName, this._parseDisplay(rawDisplay));
                                }
                                else {
                                    skin.addDisplay(slotName, null);
                                }
                            }
                        }
                        this._slot = null; //
                    }
                }
                this._skin = null; //
            }
            return skin;
        }
        _parseDisplay(rawData) {
            const name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            const path = ObjectDataParser._getString(rawData, dragonBones.DataParser.PATH, "");
            let type = 0 /* Image */;
            let display = null;
            if (dragonBones.DataParser.TYPE in rawData && typeof rawData[dragonBones.DataParser.TYPE] === "string") {
                type = dragonBones.DataParser._getDisplayType(rawData[dragonBones.DataParser.TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.TYPE, type);
            }
            switch (type) {
                case 0 /* Image */: {
                    const imageDisplay = display = dragonBones.BaseObject.borrowObject(dragonBones.ImageDisplayData);
                    imageDisplay.name = name;
                    imageDisplay.path = path.length > 0 ? path : name;
                    this._parsePivot(rawData, imageDisplay);
                    imageDisplay.mask = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.MASK, false);
                    imageDisplay.maskRange = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.MASK_RANGE, 0);
                    break;
                }
                case 1 /* Armature */: {
                    const armatureDisplay = display = dragonBones.BaseObject.borrowObject(dragonBones.ArmatureDisplayData);
                    armatureDisplay.name = name;
                    armatureDisplay.path = path.length > 0 ? path : name;
                    armatureDisplay.inheritAnimation = true;
                    if (dragonBones.DataParser.ACTIONS in rawData) {
                        const actions = this._parseActionData(rawData[dragonBones.DataParser.ACTIONS], 0 /* Play */, null, null);
                        for (const action of actions) {
                            armatureDisplay.addAction(action);
                        }
                    }
                    else if (this._slot.name in this._slotChildActions) {
                        const displays = this._skin.getDisplays(this._slot.name);
                        if (displays === null ? this._slot.displayIndex === 0 : this._slot.displayIndex === displays.length) {
                            for (const action of this._slotChildActions[this._slot.name]) {
                                armatureDisplay.addAction(action);
                            }
                            delete this._slotChildActions[this._slot.name];
                        }
                    }
                    break;
                }
                case 2 /* Mesh */: {
                    const meshDisplay = display = dragonBones.BaseObject.borrowObject(dragonBones.MeshDisplayData);
                    meshDisplay.geometry.inheritDeform = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.INHERIT_DEFORM, true);
                    meshDisplay.name = name;
                    meshDisplay.path = path.length > 0 ? path : name;
                    if (dragonBones.DataParser.SHARE in rawData) {
                        meshDisplay.geometry.data = this._data;
                        this._cacheRawMeshes.push(rawData);
                        this._cacheMeshes.push(meshDisplay);
                    }
                    else {
                        this._parseMesh(rawData, meshDisplay);
                    }
                    break;
                }
                case 3 /* BoundingBox */: {
                    const boundingBox = this._parseBoundingBox(rawData);
                    if (boundingBox !== null) {
                        const boundingBoxDisplay = display = dragonBones.BaseObject.borrowObject(dragonBones.BoundingBoxDisplayData);
                        boundingBoxDisplay.name = name;
                        boundingBoxDisplay.path = path.length > 0 ? path : name;
                        boundingBoxDisplay.boundingBox = boundingBox;
                    }
                    break;
                }
                case 4 /* Path */: {
                    const rawCurveLengths = rawData[dragonBones.DataParser.LENGTHS];
                    const pathDisplay = display = dragonBones.BaseObject.borrowObject(dragonBones.PathDisplayData);
                    pathDisplay.closed = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.CLOSED, false);
                    pathDisplay.constantSpeed = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.CONSTANT_SPEED, false);
                    pathDisplay.name = name;
                    pathDisplay.path = path.length > 0 ? path : name;
                    pathDisplay.curveLengths.length = rawCurveLengths.length;
                    for (let i = 0, l = rawCurveLengths.length; i < l; ++i) {
                        pathDisplay.curveLengths[i] = rawCurveLengths[i];
                    }
                    this._parsePath(rawData, pathDisplay);
                    break;
                }
                case 5 /* Shape */: {
                    const shape = this._parseShape(rawData);
                    if (shape !== null) {
                        const shapeDisplay = display = dragonBones.BaseObject.borrowObject(dragonBones.ShapeDisplayData);
                        shapeDisplay.name = name;
                        shapeDisplay.path = path.length > 0 ? path : name;
                        shapeDisplay.shape = shape;
                        shapeDisplay.mask = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.MASK, false);
                        shapeDisplay.maskRange = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.MASK_RANGE, 0);
                    }
                    break;
                }
            }
            if (display !== null && dragonBones.DataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[dragonBones.DataParser.TRANSFORM], display.transform, this._armature.scale);
            }
            return display;
        }
        _parsePath(rawData, display) {
            this._parseGeometry(rawData, display.geometry);
        }
        _parsePivot(rawData, display) {
            if (dragonBones.DataParser.PIVOT in rawData) {
                const rawPivot = rawData[dragonBones.DataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(rawPivot, dragonBones.DataParser.X, 0.0);
                display.pivot.y = ObjectDataParser._getNumber(rawPivot, dragonBones.DataParser.Y, 0.0);
            }
            else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }
        }
        _parseMesh(rawData, mesh) {
            this._parseGeometry(rawData, mesh.geometry);
            if (dragonBones.DataParser.WEIGHTS in rawData) { // Cache pose data.
                const rawSlotPose = rawData[dragonBones.DataParser.SLOT_POSE];
                const rawBonePoses = rawData[dragonBones.DataParser.BONE_POSE];
                const meshName = this._skin.name + "_" + this._slot.name + "_" + mesh.name;
                this._weightSlotPose[meshName] = rawSlotPose;
                this._weightBonePoses[meshName] = rawBonePoses;
            }
        }
        _parseBoundingBox(rawData) {
            let boundingBox = null;
            let type = 0 /* Rectangle */;
            if (dragonBones.DataParser.SUB_TYPE in rawData && typeof rawData[dragonBones.DataParser.SUB_TYPE] === "string") {
                type = dragonBones.DataParser._getBoundingBoxType(rawData[dragonBones.DataParser.SUB_TYPE]);
            }
            else {
                type = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SUB_TYPE, type);
            }
            switch (type) {
                case 0 /* Rectangle */:
                    boundingBox = dragonBones.BaseObject.borrowObject(dragonBones.RectangleBoundingBoxData);
                    break;
                case 1 /* Ellipse */:
                    boundingBox = dragonBones.BaseObject.borrowObject(dragonBones.EllipseBoundingBoxData);
                    break;
                case 2 /* Polygon */:
                    boundingBox = this._parsePolygonBoundingBox(rawData);
                    break;
            }
            if (boundingBox !== null) {
                boundingBox.color = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.COLOR, 0x000000);
                if (boundingBox.type === 0 /* Rectangle */ || boundingBox.type === 1 /* Ellipse */) {
                    boundingBox.width = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.WIDTH, 0.0);
                    boundingBox.height = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.HEIGHT, 0.0);
                }
            }
            return boundingBox;
        }
        _parsePolygonBoundingBox(rawData) {
            const polygonBoundingBox = dragonBones.BaseObject.borrowObject(dragonBones.PolygonBoundingBoxData);
            if (dragonBones.DataParser.VERTICES in rawData) {
                const scale = this._armature.scale;
                const rawVertices = rawData[dragonBones.DataParser.VERTICES];
                const vertices = polygonBoundingBox.vertices;
                vertices.length = rawVertices.length;
                for (let i = 0, l = rawVertices.length; i < l; i += 2) {
                    const x = rawVertices[i] * scale;
                    const y = rawVertices[i + 1] * scale;
                    vertices[i] = x;
                    vertices[i + 1] = y;
                    // AABB.
                    if (i === 0) {
                        polygonBoundingBox.x = x;
                        polygonBoundingBox.y = y;
                        polygonBoundingBox.width = x;
                        polygonBoundingBox.height = y;
                    }
                    else {
                        if (x < polygonBoundingBox.x) {
                            polygonBoundingBox.x = x;
                        }
                        else if (x > polygonBoundingBox.width) {
                            polygonBoundingBox.width = x;
                        }
                        if (y < polygonBoundingBox.y) {
                            polygonBoundingBox.y = y;
                        }
                        else if (y > polygonBoundingBox.height) {
                            polygonBoundingBox.height = y;
                        }
                    }
                }
                polygonBoundingBox.width -= polygonBoundingBox.x;
                polygonBoundingBox.height -= polygonBoundingBox.y;
            }
            else {
                console.warn("Data error.\n Please reexport DragonBones Data to fixed the bug.");
            }
            return polygonBoundingBox;
        }
        _parseShape(rawData) {
            let shape = null;
            shape = dragonBones.BaseObject.borrowObject(dragonBones.ShapeData);
            if (dragonBones.DataParser.SHAPE in rawData) {
                const scale = this._armature.scale;
                const shapeData = rawData[dragonBones.DataParser.SHAPE];
                const vertices = shapeData.vertices;
                for (let i = 0, len = vertices.length; i < len; i++) {
                    shape.vertices.push(vertices[i] * scale);
                }
                if (shapeData.paths) {
                    for (let i = 0, len = shapeData.paths.length; i < len; i++) {
                        shape.paths.push(shapeData.paths[i]);
                    }
                }
            }
            else {
                console.warn("Data error.\n Please reexport DragonBones Data to fixed the bug.");
            }
            return shape;
        }
        _parseAnimation(rawData) {
            const animation = dragonBones.BaseObject.borrowObject(dragonBones.AnimationData);
            animation.blendType = dragonBones.DataParser._getAnimationBlendType(ObjectDataParser._getString(rawData, dragonBones.DataParser.BLEND_TYPE, ""));
            animation.frameCount = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.DURATION, 0);
            animation.playTimes = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.PLAY_TIMES, 1);
            animation.duration = animation.frameCount / this._armature.frameRate; // float
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.FADE_IN_TIME, 0.0);
            animation.scale = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SCALE, 1.0);
            animation.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, dragonBones.DataParser.DEFAULT_NAME);
            if (animation.name.length === 0) {
                animation.name = dragonBones.DataParser.DEFAULT_NAME;
            }
            animation.frameIntOffset = this._frameIntArray.length;
            animation.frameFloatOffset = this._frameFloatArray.length;
            animation.frameOffset = this._frameArray.length;
            this._animation = animation;
            if (dragonBones.DataParser.FRAME in rawData) {
                const rawFrames = rawData[dragonBones.DataParser.FRAME];
                const keyFrameCount = rawFrames.length;
                if (keyFrameCount > 0) {
                    for (let i = 0, frameStart = 0; i < keyFrameCount; ++i) {
                        const rawFrame = rawFrames[i];
                        this._parseActionDataInFrame(rawFrame, frameStart, null, null);
                        frameStart += ObjectDataParser._getNumber(rawFrame, dragonBones.DataParser.DURATION, 1);
                    }
                }
            }
            if (dragonBones.DataParser.Z_ORDER in rawData) {
                this._animation.zOrderTimeline = this._parseTimeline(rawData[dragonBones.DataParser.Z_ORDER], null, dragonBones.DataParser.FRAME, 1 /* ZOrder */, 0 /* Step */, 0, this._parseZOrderFrame);
            }
            if (dragonBones.DataParser.BONE in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.BONE];
                for (const rawTimeline of rawTimelines) {
                    this._parseBoneTimeline(rawTimeline);
                }
            }
            if (dragonBones.DataParser.SLOT in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.SLOT];
                for (const rawTimeline of rawTimelines) {
                    this._parseSlotTimeline(rawTimeline);
                }
            }
            if (dragonBones.DataParser.FFD in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.FFD];
                for (const rawTimeline of rawTimelines) {
                    let skinName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.SKIN, dragonBones.DataParser.DEFAULT_NAME);
                    const slotName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.SLOT, "");
                    const displayName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.NAME, "");
                    if (skinName.length === 0) { //
                        skinName = dragonBones.DataParser.DEFAULT_NAME;
                    }
                    this._slot = this._armature.getSlot(slotName);
                    this._mesh = this._armature.getMesh(skinName, slotName, displayName);
                    if (this._slot === null || this._mesh === null) {
                        continue;
                    }
                    const timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, 22 /* SlotDeform */, 2 /* Float */, 0, this._parseSlotDeformFrame);
                    if (timeline !== null) {
                        this._animation.addSlotTimeline(slotName, timeline);
                    }
                    this._slot = null; //
                    this._mesh = null; //
                }
            }
            if (dragonBones.DataParser.SHAPE in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.SHAPE];
                for (const rawTimeline of rawTimelines) {
                    let skinName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.SKIN, dragonBones.DataParser.DEFAULT_NAME);
                    const slotName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.SLOT, "");
                    const displayName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.NAME, "");
                    if (skinName.length === 0) { //
                        skinName = dragonBones.DataParser.DEFAULT_NAME;
                    }
                    this._slot = this._armature.getSlot(slotName);
                    this._shape = this._armature.getShape(skinName, slotName, displayName);
                    if (this._slot === null || this._shape === null) {
                        continue;
                    }
                    const timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, 25 /* SlotShape */, 2 /* Float */, 0, this._parseSlotShapeFrame);
                    if (timeline !== null) {
                        this._animation.addSlotTimeline(slotName, timeline);
                    }
                    this._slot = null; //
                    this._shape = null; //
                }
            }
            if (dragonBones.DataParser.IK in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.IK];
                for (const rawTimeline of rawTimelines) {
                    const constraintName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.NAME, "");
                    const constraint = this._armature.getConstraint(constraintName);
                    if (constraint === null) {
                        continue;
                    }
                    const timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, 30 /* IKConstraint */, 1 /* Int */, 2, this._parseIKConstraintFrame);
                    if (timeline !== null) {
                        this._animation.addConstraintTimeline(constraintName, timeline);
                    }
                }
            }
            if (dragonBones.DataParser.PATH in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.PATH];
                for (const rawTimeline of rawTimelines) {
                    const constraintName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.NAME, "");
                    const constraint = this._armature.getConstraint(constraintName);
                    if (constraint === null) {
                        continue;
                    }
                    // 
                    if (rawTimeline[dragonBones.DataParser.PATH_CONSTRAINT_POSITION]) {
                        const timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.PATH_CONSTRAINT_POSITION, 31 /* PathConstraintPosition */, 2 /* Float */, 1, this._parsePathConstraintPositionFrame);
                        if (timeline !== null) {
                            this._animation.addConstraintTimeline(constraintName, timeline);
                        }
                    }
                    if (rawTimeline[dragonBones.DataParser.PATH_CONSTRAINT_SPACING]) {
                        const timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.PATH_CONSTRAINT_SPACING, 32 /* PathConstraintSpacing */, 2 /* Float */, 1, this._parsePathConstraintSpacingFrame);
                        if (timeline !== null) {
                            this._animation.addConstraintTimeline(constraintName, timeline);
                        }
                    }
                    if (rawTimeline[dragonBones.DataParser.PATH_CONSTRAINT_WEIGHT]) {
                        const timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.PATH_CONSTRAINT_WEIGHT, 33 /* PathConstraintWeight */, 2 /* Float */, 3, this._parsePathConstraintWeightFrame);
                        if (timeline !== null) {
                            this._animation.addConstraintTimeline(constraintName, timeline);
                        }
                    }
                }
            }
            if (this._actionFrames.length > 0) {
                this._animation.actionTimeline = this._parseTimeline(null, this._actionFrames, "", 0 /* Action */, 0 /* Step */, 0, this._parseActionFrame);
                this._actionFrames.length = 0;
            }
            if (dragonBones.DataParser.TIMELINE in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.TIMELINE];
                for (const rawTimeline of rawTimelines) {
                    const timelineType = ObjectDataParser._getNumber(rawTimeline, dragonBones.DataParser.TYPE, 0 /* Action */);
                    const timelineName = ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.NAME, "");
                    let timeline = null;
                    switch (timelineType) {
                        case 0 /* Action */:
                            // TODO
                            break;
                        case 20 /* SlotDisplay */: // TODO
                        case 23 /* SlotZIndex */:
                        case 60 /* BoneAlpha */:
                        case 24 /* SlotAlpha */:
                        case 40 /* AnimationProgress */:
                        case 41 /* AnimationWeight */:
                            if (timelineType === 20 /* SlotDisplay */) {
                                this._frameValueType = 0 /* Step */;
                                this._frameValueScale = 1.0;
                            }
                            else {
                                this._frameValueType = 1 /* Int */;
                                if (timelineType === 23 /* SlotZIndex */) {
                                    this._frameValueScale = 1.0;
                                }
                                else if (timelineType === 40 /* AnimationProgress */ ||
                                    timelineType === 41 /* AnimationWeight */) {
                                    this._frameValueScale = 10000.0;
                                }
                                else {
                                    this._frameValueScale = 100.0;
                                }
                            }
                            if (timelineType === 60 /* BoneAlpha */ ||
                                timelineType === 24 /* SlotAlpha */ ||
                                timelineType === 41 /* AnimationWeight */) {
                                this._frameDefaultValue = 1.0;
                            }
                            else {
                                this._frameDefaultValue = 0.0;
                            }
                            if (timelineType === 40 /* AnimationProgress */ && animation.blendType !== 0 /* None */) {
                                timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationTimelineData);
                                const animaitonTimeline = timeline;
                                animaitonTimeline.x = ObjectDataParser._getNumber(rawTimeline, dragonBones.DataParser.X, 0.0);
                                animaitonTimeline.y = ObjectDataParser._getNumber(rawTimeline, dragonBones.DataParser.Y, 0.0);
                            }
                            timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, timelineType, this._frameValueType, 1, this._parseSingleValueFrame, timeline);
                            break;
                        case 11 /* BoneTranslate */:
                        case 12 /* BoneRotate */:
                        case 13 /* BoneScale */:
                        case 30 /* IKConstraint */:
                        case 42 /* AnimationParameter */:
                            if (timelineType === 30 /* IKConstraint */ ||
                                timelineType === 42 /* AnimationParameter */) {
                                this._frameValueType = 1 /* Int */;
                                if (timelineType === 42 /* AnimationParameter */) {
                                    this._frameValueScale = 10000.0;
                                }
                                else {
                                    this._frameValueScale = 100.0;
                                }
                            }
                            else {
                                if (timelineType === 12 /* BoneRotate */) {
                                    this._frameValueScale = dragonBones.Transform.DEG_RAD;
                                }
                                else {
                                    this._frameValueScale = 1.0;
                                }
                                this._frameValueType = 2 /* Float */;
                            }
                            if (timelineType === 13 /* BoneScale */ ||
                                timelineType === 30 /* IKConstraint */) {
                                this._frameDefaultValue = 1.0;
                            }
                            else {
                                this._frameDefaultValue = 0.0;
                            }
                            timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, timelineType, this._frameValueType, 2, this._parseDoubleValueFrame);
                            break;
                        case 1 /* ZOrder */:
                            // TODO
                            break;
                        case 50 /* Surface */: {
                            const surface = this._armature.getBone(timelineName);
                            if (surface === null) {
                                continue;
                            }
                            this._geometry = surface.geometry;
                            timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, timelineType, 2 /* Float */, 0, this._parseDeformFrame);
                            this._geometry = null; //
                            break;
                        }
                        case 22 /* SlotDeform */: {
                            this._geometry = null; //
                            for (const skinName in this._armature.skins) {
                                const skin = this._armature.skins[skinName];
                                for (const slontName in skin.displays) {
                                    const displays = skin.displays[slontName];
                                    for (const display of displays) {
                                        if (display !== null && display.name === timelineName) {
                                            this._geometry = display.geometry;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (this._geometry === null) {
                                continue;
                            }
                            timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, timelineType, 2 /* Float */, 0, this._parseDeformFrame);
                            this._geometry = null; //
                            break;
                        }
                        case 21 /* SlotColor */:
                            timeline = this._parseTimeline(rawTimeline, null, dragonBones.DataParser.FRAME, timelineType, 1 /* Int */, 1, this._parseSlotColorFrame);
                            break;
                    }
                    if (timeline !== null) {
                        switch (timelineType) {
                            case 0 /* Action */:
                                // TODO
                                break;
                            case 1 /* ZOrder */:
                                // TODO
                                break;
                            case 11 /* BoneTranslate */:
                            case 12 /* BoneRotate */:
                            case 13 /* BoneScale */:
                            case 50 /* Surface */:
                            case 60 /* BoneAlpha */:
                                this._animation.addBoneTimeline(timelineName, timeline);
                                break;
                            case 20 /* SlotDisplay */:
                            case 21 /* SlotColor */:
                            case 22 /* SlotDeform */:
                            case 23 /* SlotZIndex */:
                            case 24 /* SlotAlpha */:
                                this._animation.addSlotTimeline(timelineName, timeline);
                                break;
                            case 30 /* IKConstraint */:
                                this._animation.addConstraintTimeline(timelineName, timeline);
                                break;
                            case 40 /* AnimationProgress */:
                            case 41 /* AnimationWeight */:
                            case 42 /* AnimationParameter */:
                                this._animation.addAnimationTimeline(timelineName, timeline);
                                break;
                        }
                    }
                }
            }
            this._animation = null; //
            return animation;
        }
        getTimelineDuration(frames) {
            if (!frames || frames.length === 0) {
                return 0;
            }
            else {
                let duration = 0;
                for (let i = 0, l = frames.length; i < l; ++i) {
                    const frame = frames[i];
                    duration += frame.duration >= 0 ? frame.duration : 0;
                }
                return duration;
            }
        }
        _parseTimeline(rawData, rawFrames, framesKey, timelineType, frameValueType, frameValueCount, frameParser, timeline = null) {
            if (rawData !== null && framesKey.length > 0 && framesKey in rawData) {
                rawFrames = rawData[framesKey];
            }
            if (rawFrames === null) {
                return null;
            }
            const keyFrameCount = rawFrames.length;
            if (keyFrameCount === 0) {
                return null;
            }
            const frameIntArrayLength = this._frameIntArray.length;
            const frameFloatArrayLength = this._frameFloatArray.length;
            const timelineOffset = this._timelineArray.length;
            if (timeline === null) {
                timeline = dragonBones.BaseObject.borrowObject(dragonBones.TimelineData);
            }
            timeline.type = timelineType;
            timeline.offset = timelineOffset;
            this._frameValueType = frameValueType;
            this._timeline = timeline;
            // 这里比5.7版本增加了TimelineLoop和TimelineDuration，所以就和二进制版本的数据不兼容了。
            // BinaryOffset.TimelineScale
            // BinaryOffset.TimelineOffset
            // BinaryOffset.TimelineLoop = 2,
            // BinaryOffset.TimelineDuration = 3,
            // BinaryOffset.TimelineKeyFrameCount
            // BinaryOffset.TimelineFrameValueCount
            // BinaryOffset.TimelineFrameValueOffset
            // 帧的数量
            //
            this._timelineArray.length += 1 + 1 + 1 + 1 + 1 + 1 + 1 + keyFrameCount;
            if (rawData !== null && rawData.timelineConfig && rawData.timelineConfig[framesKey]) {
                const rawTimelineConfig = rawData.timelineConfig[framesKey];
                this._timelineArray[timelineOffset + 0 /* TimelineScale */] = Math.round(ObjectDataParser._getNumber(rawTimelineConfig, dragonBones.DataParser.SCALE, 1.0) * 100);
                this._timelineArray[timelineOffset + 1 /* TimelineOffset */] = Math.round(ObjectDataParser._getNumber(rawTimelineConfig, dragonBones.DataParser.OFFSET, 0));
                this._timelineArray[timelineOffset + 2 /* TimelineLoop */] = (ObjectDataParser._getBoolean(rawTimelineConfig, dragonBones.DataParser.LOOP, false)) ? 1 : 0;
            }
            else {
                this._timelineArray[timelineOffset + 0 /* TimelineScale */] = 100;
                this._timelineArray[timelineOffset + 1 /* TimelineOffset */] = 0;
                this._timelineArray[timelineOffset + 2 /* TimelineLoop */] = 0;
            }
            const timelineDuration = this.getTimelineDuration(rawFrames);
            this._timelineArray[timelineOffset + 3 /* TimelineDuration */] = timelineDuration;
            this._timelineArray[timelineOffset + 4 /* TimelineKeyFrameCount */] = keyFrameCount;
            this._timelineArray[timelineOffset + 5 /* TimelineFrameValueCount */] = frameValueCount;
            switch (this._frameValueType) {
                case 0 /* Step */:
                    this._timelineArray[timelineOffset + 6 /* TimelineFrameValueOffset */] = 0;
                    break;
                case 1 /* Int */:
                    this._timelineArray[timelineOffset + 6 /* TimelineFrameValueOffset */] = frameIntArrayLength - this._animation.frameIntOffset;
                    break;
                case 2 /* Float */:
                    this._timelineArray[timelineOffset + 6 /* TimelineFrameValueOffset */] = frameFloatArrayLength - this._animation.frameFloatOffset;
                    break;
            }
            if (keyFrameCount === 1) { // Only one frame.
                timeline.frameIndicesOffset = -1;
                this._timelineArray[timelineOffset + 7 /* TimelineFrameOffset */ + 0] = frameParser.call(this, rawFrames[0], 0, 0) - this._animation.frameOffset;
            }
            else {
                const totalFrameCount = this._animation.frameCount + 1; // One more frame than animation.
                const frameIndices = this._data.frameIndices;
                const frameIndicesOffset = frameIndices.length;
                frameIndices.length += totalFrameCount;
                timeline.frameIndicesOffset = frameIndicesOffset;
                for (let i = 0, iK = 0, frameStart = 0, frameCount = 0; i < totalFrameCount; ++i) {
                    if (frameStart + frameCount <= i && iK < keyFrameCount) {
                        const rawFrame = rawFrames[iK];
                        frameStart = i; // frame.frameStart;
                        if (iK === keyFrameCount - 1) {
                            frameCount = this._animation.frameCount - frameStart;
                        }
                        else {
                            if (rawFrame instanceof ActionFrame) {
                                frameCount = this._actionFrames[iK + 1].frameStart - frameStart;
                            }
                            else {
                                frameCount = ObjectDataParser._getNumber(rawFrame, dragonBones.DataParser.DURATION, 1);
                            }
                        }
                        this._timelineArray[timelineOffset + 7 /* TimelineFrameOffset */ + iK] = frameParser.call(this, rawFrame, frameStart, frameCount) - this._animation.frameOffset;
                        iK++;
                    }
                    frameIndices[frameIndicesOffset + i] = iK - 1;
                }
            }
            this._timeline = null; //
            return timeline;
        }
        _parseBoneTimeline(rawData) {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, ""));
            if (bone === null) {
                return;
            }
            this._bone = bone;
            this._slot = this._armature.getSlot(this._bone.name);
            if (dragonBones.DataParser.TRANSLATE_FRAME in rawData) {
                this._frameDefaultValue = 0.0;
                this._frameValueScale = 1.0;
                const timeline = this._parseTimeline(rawData, null, dragonBones.DataParser.TRANSLATE_FRAME, 11 /* BoneTranslate */, 2 /* Float */, 2, this._parseDoubleValueFrame);
                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }
            if (dragonBones.DataParser.ROTATE_FRAME in rawData) {
                this._frameDefaultValue = 0.0;
                this._frameValueScale = 1.0;
                const timeline = this._parseTimeline(rawData, null, dragonBones.DataParser.ROTATE_FRAME, 12 /* BoneRotate */, 2 /* Float */, 2, this._parseBoneRotateFrame);
                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }
            if (dragonBones.DataParser.SCALE_FRAME in rawData) {
                this._frameDefaultValue = 1.0;
                this._frameValueScale = 1.0;
                const timeline = this._parseTimeline(rawData, null, dragonBones.DataParser.SCALE_FRAME, 13 /* BoneScale */, 2 /* Float */, 2, this._parseBoneScaleFrame);
                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }
            if (dragonBones.DataParser.FRAME in rawData) {
                const timeline = this._parseTimeline(rawData, null, dragonBones.DataParser.FRAME, 10 /* BoneAll */, 2 /* Float */, 6, this._parseBoneAllFrame);
                if (timeline !== null) {
                    this._animation.addBoneTimeline(bone.name, timeline);
                }
            }
            this._bone = null; //
            this._slot = null; //
        }
        _parseSlotTimeline(rawData) {
            const slot = this._armature.getSlot(ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, ""));
            if (slot === null) {
                return;
            }
            let displayTimeline = null;
            let colorTimeline = null;
            this._slot = slot;
            if (dragonBones.DataParser.DISPLAY_FRAME in rawData) {
                displayTimeline = this._parseTimeline(rawData, null, dragonBones.DataParser.DISPLAY_FRAME, 20 /* SlotDisplay */, 0 /* Step */, 0, this._parseSlotDisplayFrame);
            }
            else {
                displayTimeline = this._parseTimeline(rawData, null, dragonBones.DataParser.FRAME, 20 /* SlotDisplay */, 0 /* Step */, 0, this._parseSlotDisplayFrame);
            }
            if (dragonBones.DataParser.COLOR_FRAME in rawData) {
                colorTimeline = this._parseTimeline(rawData, null, dragonBones.DataParser.COLOR_FRAME, 21 /* SlotColor */, 1 /* Int */, 1, this._parseSlotColorFrame);
            }
            else {
                colorTimeline = this._parseTimeline(rawData, null, dragonBones.DataParser.FRAME, 21 /* SlotColor */, 1 /* Int */, 1, this._parseSlotColorFrame);
            }
            if (displayTimeline !== null) {
                this._animation.addSlotTimeline(slot.name, displayTimeline);
            }
            if (colorTimeline !== null) {
                this._animation.addSlotTimeline(slot.name, colorTimeline);
            }
            this._slot = null; //
        }
        _parseFrame(rawData, frameStart, frameCount) {
            // tslint:disable-next-line:no-unused-expression
            rawData;
            // tslint:disable-next-line:no-unused-expression
            frameCount;
            const frameOffset = this._frameArray.length;
            this._frameArray.length += 1;
            this._frameArray[frameOffset + 0 /* FramePosition */] = frameStart;
            return frameOffset;
        }
        _parseTweenFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount);
            if (frameCount > 0) {
                if (dragonBones.DataParser.CURVE in rawData) {
                    const sampleCount = frameCount + 1;
                    this._helpArray.length = sampleCount;
                    const isOmited = this._samplingEasingCurve(rawData[dragonBones.DataParser.CURVE], this._helpArray);
                    this._frameArray.length += 1 + 1 + this._helpArray.length;
                    this._frameArray[frameOffset + 1 /* FrameTweenType */] = 2 /* Curve */;
                    this._frameArray[frameOffset + 2 /* FrameTweenEasingOrCurveSampleCount */] = isOmited ? sampleCount : -sampleCount;
                    for (let i = 0; i < sampleCount; ++i) {
                        this._frameArray[frameOffset + 3 /* FrameCurveSamples */ + i] = Math.round(this._helpArray[i] * 10000.0);
                    }
                }
                else {
                    const noTween = -2.0;
                    let tweenEasing = noTween;
                    if (dragonBones.DataParser.TWEEN_EASING in rawData) {
                        tweenEasing = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.TWEEN_EASING, noTween);
                    }
                    if (tweenEasing === noTween) {
                        this._frameArray.length += 1;
                        this._frameArray[frameOffset + 1 /* FrameTweenType */] = 0 /* None */;
                    }
                    else if (tweenEasing === 0.0) {
                        this._frameArray.length += 1;
                        this._frameArray[frameOffset + 1 /* FrameTweenType */] = 1 /* Line */;
                    }
                    else if (tweenEasing < 0.0) {
                        this._frameArray.length += 1 + 1;
                        this._frameArray[frameOffset + 1 /* FrameTweenType */] = 3 /* QuadIn */;
                        this._frameArray[frameOffset + 2 /* FrameTweenEasingOrCurveSampleCount */] = Math.round(-tweenEasing * 100.0);
                    }
                    else if (tweenEasing <= 1.0) {
                        this._frameArray.length += 1 + 1;
                        this._frameArray[frameOffset + 1 /* FrameTweenType */] = 4 /* QuadOut */;
                        this._frameArray[frameOffset + 2 /* FrameTweenEasingOrCurveSampleCount */] = Math.round(tweenEasing * 100.0);
                    }
                    else {
                        this._frameArray.length += 1 + 1;
                        this._frameArray[frameOffset + 1 /* FrameTweenType */] = 5 /* QuadInOut */;
                        this._frameArray[frameOffset + 2 /* FrameTweenEasingOrCurveSampleCount */] = Math.round(tweenEasing * 100.0 - 100.0);
                    }
                }
            }
            else {
                this._frameArray.length += 1;
                this._frameArray[frameOffset + 1 /* FrameTweenType */] = 0 /* None */;
            }
            return frameOffset;
        }
        _parseSingleValueFrame(rawData, frameStart, frameCount) {
            let frameOffset = 0;
            switch (this._frameValueType) {
                case 0: {
                    frameOffset = this._parseFrame(rawData, frameStart, frameCount);
                    this._frameArray.length += 1;
                    this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.VALUE, this._frameDefaultValue);
                    break;
                }
                case 1: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameIntArray.length;
                    this._frameIntArray.length += 1;
                    this._frameIntArray[frameValueOffset] = Math.round(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.VALUE, this._frameDefaultValue) * this._frameValueScale);
                    break;
                }
                case 2: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameFloatArray.length;
                    this._frameFloatArray.length += 1;
                    this._frameFloatArray[frameValueOffset] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.VALUE, this._frameDefaultValue) * this._frameValueScale;
                    break;
                }
            }
            return frameOffset;
        }
        _parseDoubleValueFrame(rawData, frameStart, frameCount) {
            let frameOffset = 0;
            switch (this._frameValueType) {
                case 0: {
                    frameOffset = this._parseFrame(rawData, frameStart, frameCount);
                    this._frameArray.length += 2;
                    this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X, this._frameDefaultValue);
                    this._frameArray[frameOffset + 2] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y, this._frameDefaultValue);
                    break;
                }
                case 1: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameIntArray.length;
                    this._frameIntArray.length += 2;
                    this._frameIntArray[frameValueOffset] = Math.round(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X, this._frameDefaultValue) * this._frameValueScale);
                    this._frameIntArray[frameValueOffset + 1] = Math.round(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y, this._frameDefaultValue) * this._frameValueScale);
                    break;
                }
                case 2: {
                    frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
                    const frameValueOffset = this._frameFloatArray.length;
                    this._frameFloatArray.length += 2;
                    this._frameFloatArray[frameValueOffset] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X, this._frameDefaultValue) * this._frameValueScale;
                    this._frameFloatArray[frameValueOffset + 1] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y, this._frameDefaultValue) * this._frameValueScale;
                    break;
                }
            }
            return frameOffset;
        }
        _parseActionFrame(frame, frameStart, frameCount) {
            // tslint:disable-next-line:no-unused-expression
            frameCount;
            const frameOffset = this._frameArray.length;
            const actionCount = frame.actions.length;
            this._frameArray.length += 1 + 1 + actionCount;
            this._frameArray[frameOffset + 0 /* FramePosition */] = frameStart;
            this._frameArray[frameOffset + 0 /* FramePosition */ + 1] = actionCount; // Action count.
            for (let i = 0; i < actionCount; ++i) { // Action offsets.
                this._frameArray[frameOffset + 0 /* FramePosition */ + 2 + i] = frame.actions[i];
            }
            return frameOffset;
        }
        _parseZOrderFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount);
            if (dragonBones.DataParser.Z_ORDER in rawData) {
                const rawZOrder = rawData[dragonBones.DataParser.Z_ORDER];
                if (rawZOrder.length > 0) {
                    const slotCount = this._armature.sortedSlots.length;
                    const unchanged = new Array(slotCount - rawZOrder.length / 2);
                    const zOrders = new Array(slotCount);
                    for (let i = 0; i < unchanged.length; ++i) {
                        unchanged[i] = 0;
                    }
                    for (let i = 0; i < slotCount; ++i) {
                        zOrders[i] = -1;
                    }
                    let originalIndex = 0;
                    let unchangedIndex = 0;
                    for (let i = 0, l = rawZOrder.length; i < l; i += 2) {
                        const slotIndex = rawZOrder[i];
                        const zOrderOffset = rawZOrder[i + 1];
                        while (originalIndex !== slotIndex) {
                            unchanged[unchangedIndex++] = originalIndex++;
                        }
                        const index = originalIndex + zOrderOffset;
                        zOrders[index] = originalIndex++;
                    }
                    while (originalIndex < slotCount) {
                        unchanged[unchangedIndex++] = originalIndex++;
                    }
                    this._frameArray.length += 1 + slotCount;
                    this._frameArray[frameOffset + 1] = slotCount;
                    let i = slotCount;
                    while (i--) {
                        if (zOrders[i] === -1) {
                            this._frameArray[frameOffset + 2 + i] = unchanged[--unchangedIndex] || 0;
                        }
                        else {
                            this._frameArray[frameOffset + 2 + i] = zOrders[i] || 0;
                        }
                    }
                    return frameOffset;
                }
            }
            this._frameArray.length += 1;
            this._frameArray[frameOffset + 1] = 0;
            return frameOffset;
        }
        _parseBoneAllFrame(rawData, frameStart, frameCount) {
            this._helpTransform.identity();
            if (dragonBones.DataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[dragonBones.DataParser.TRANSFORM], this._helpTransform, 1.0);
            }
            // Modify rotation.
            let rotation = this._helpTransform.rotation;
            if (frameStart !== 0) {
                if (this._prevClockwise === 0) {
                    rotation = this._prevRotation + dragonBones.Transform.normalizeRadian(rotation - this._prevRotation);
                }
                else {
                    if (this._prevClockwise > 0 ? rotation >= this._prevRotation : rotation <= this._prevRotation) {
                        this._prevClockwise = this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
                    }
                    rotation = this._prevRotation + rotation - this._prevRotation + dragonBones.Transform.PI_D * this._prevClockwise;
                }
            }
            this._prevClockwise = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.TWEEN_ROTATE, 0.0);
            this._prevRotation = rotation;
            //
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 6;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.x;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.y;
            this._frameFloatArray[frameFloatOffset++] = rotation;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.skew;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleX;
            this._frameFloatArray[frameFloatOffset++] = this._helpTransform.scaleY;
            this._parseActionDataInFrame(rawData, frameStart, this._bone, this._slot);
            return frameOffset;
        }
        _parseBoneTranslateFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X, 0.0);
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y, 0.0);
            return frameOffset;
        }
        _parseBoneRotateFrame(rawData, frameStart, frameCount) {
            // Modify rotation.
            let rotation = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ROTATE, 0.0) * dragonBones.Transform.DEG_RAD;
            if (frameStart !== 0) {
                if (this._prevClockwise === 0) {
                    rotation = this._prevRotation + dragonBones.Transform.normalizeRadian(rotation - this._prevRotation);
                }
                else {
                    if (this._prevClockwise > 0 ? rotation >= this._prevRotation : rotation <= this._prevRotation) {
                        this._prevClockwise = this._prevClockwise > 0 ? this._prevClockwise - 1 : this._prevClockwise + 1;
                    }
                    rotation = this._prevRotation + rotation - this._prevRotation + dragonBones.Transform.PI_D * this._prevClockwise;
                }
            }
            this._prevClockwise = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.CLOCK_WISE, 0);
            this._prevRotation = rotation;
            //
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = rotation;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SKEW, 0.0) * dragonBones.Transform.DEG_RAD;
            return frameOffset;
        }
        _parseBoneScaleFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 2;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X, 1.0);
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y, 1.0);
            return frameOffset;
        }
        _parseSlotDisplayFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseFrame(rawData, frameStart, frameCount);
            this._frameArray.length += 1;
            if (dragonBones.DataParser.VALUE in rawData) {
                this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.VALUE, 0);
            }
            else {
                this._frameArray[frameOffset + 1] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.DISPLAY_INDEX, 0);
            }
            this._parseActionDataInFrame(rawData, frameStart, this._slot.parent, this._slot);
            return frameOffset;
        }
        _parseSlotColorFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let colorOffset = -1;
            if (dragonBones.DataParser.VALUE in rawData || dragonBones.DataParser.COLOR in rawData) {
                const rawColor = dragonBones.DataParser.VALUE in rawData ? rawData[dragonBones.DataParser.VALUE] : rawData[dragonBones.DataParser.COLOR];
                for (let k in rawColor) { // Detects the presence of color.
                    // tslint:disable-next-line:no-unused-expression
                    k;
                    this._parseColorTransform(rawColor, this._helpColorTransform);
                    colorOffset = this._colorArray.length;
                    this._colorArray.length += 8;
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.alphaMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.redMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.greenMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.blueMultiplier * 100);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.alphaOffset);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.redOffset);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.greenOffset);
                    this._colorArray[colorOffset++] = Math.round(this._helpColorTransform.blueOffset);
                    colorOffset -= 8;
                    break;
                }
            }
            if (colorOffset < 0) {
                if (this._defaultColorOffset < 0) {
                    this._defaultColorOffset = colorOffset = this._colorArray.length;
                    this._colorArray.length += 8;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 100;
                    this._colorArray[colorOffset++] = 0;
                    this._colorArray[colorOffset++] = 0;
                    this._colorArray[colorOffset++] = 0;
                    this._colorArray[colorOffset++] = 0;
                }
                colorOffset = this._defaultColorOffset;
            }
            const frameIntOffset = this._frameIntArray.length;
            this._frameIntArray.length += 1;
            this._frameIntArray[frameIntOffset] = colorOffset;
            return frameOffset;
        }
        _parseSlotDeformFrame(rawData, frameStart, frameCount) {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = dragonBones.DataParser.VERTICES in rawData ? rawData[dragonBones.DataParser.VERTICES] : null;
            const offset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.OFFSET, 0); // uint
            const vertexCount = this._intArray[this._mesh.geometry.offset + 0 /* GeometryVertexCount */];
            const meshName = this._mesh.parent.name + "_" + this._slot.name + "_" + this._mesh.name;
            const weight = this._mesh.geometry.weight;
            let x = 0.0;
            let y = 0.0;
            let iB = 0;
            let iV = 0;
            if (weight !== null) {
                const rawSlotPose = this._weightSlotPose[meshName];
                this._helpMatrixA.copyFromArray(rawSlotPose, 0);
                this._frameFloatArray.length += weight.count * 2;
                iB = weight.offset + 2 /* WeigthBoneIndices */ + weight.bones.length;
            }
            else {
                this._frameFloatArray.length += vertexCount * 2;
            }
            for (let i = 0; i < vertexCount * 2; i += 2) {
                if (rawVertices === null) { // Fill 0.
                    x = 0.0;
                    y = 0.0;
                }
                else {
                    if (i < offset || i - offset >= rawVertices.length) {
                        x = 0.0;
                    }
                    else {
                        x = rawVertices[i - offset];
                    }
                    if (i + 1 < offset || i + 1 - offset >= rawVertices.length) {
                        y = 0.0;
                    }
                    else {
                        y = rawVertices[i + 1 - offset];
                    }
                }
                if (weight !== null) { // If mesh is skinned, transform point by bone bind pose.
                    const rawBonePoses = this._weightBonePoses[meshName];
                    const vertexBoneCount = this._intArray[iB++];
                    this._helpMatrixA.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;
                    for (let j = 0; j < vertexBoneCount; ++j) {
                        const boneIndex = this._intArray[iB++];
                        this._helpMatrixB.copyFromArray(rawBonePoses, boneIndex * 7 + 1);
                        this._helpMatrixB.invert();
                        this._helpMatrixB.transformPoint(x, y, this._helpPoint, true);
                        this._frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.x;
                        this._frameFloatArray[frameFloatOffset + iV++] = this._helpPoint.y;
                    }
                }
                else {
                    this._frameFloatArray[frameFloatOffset + i] = x;
                    this._frameFloatArray[frameFloatOffset + i + 1] = y;
                }
            }
            if (frameStart === 0) {
                const frameIntOffset = this._frameIntArray.length;
                this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
                this._frameIntArray[frameIntOffset + 0 /* DeformVertexOffset */] = this._mesh.geometry.offset;
                this._frameIntArray[frameIntOffset + 1 /* DeformCount */] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + 2 /* DeformValueCount */] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + 3 /* DeformValueOffset */] = 0;
                this._frameIntArray[frameIntOffset + 4 /* DeformFloatOffset */] = frameFloatOffset - this._animation.frameFloatOffset;
                this._timelineArray[this._timeline.offset + 5 /* TimelineFrameValueCount */] = frameIntOffset - this._animation.frameIntOffset;
            }
            return frameOffset;
        }
        _parseSlotShapeFrame(rawData, frameStart, frameCount) {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = dragonBones.DataParser.VERTICES in rawData ? rawData[dragonBones.DataParser.VERTICES] : null;
            const offset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.OFFSET, 0); // uint
            const vertexCount = this._shape.shape ? this._shape.shape.vertices.length / 6 : 0;
            // TODO: 把shape的数据存到_intArray里,来兼容二进制数据
            // const vertexCount = this._intArray[this._mesh.geometry.offset + BinaryOffset.GeometryVertexCount];
            let x = 0.0;
            let y = 0.0;
            let c0X = 0.0;
            let c0Y = 0.0;
            let c1X = 0.0;
            let c1Y = 0.0;
            const vertexValueCount = 6; // 贝塞尔曲线3个点
            this._frameFloatArray.length += vertexCount * vertexValueCount;
            for (let i = 0; i < vertexCount * vertexValueCount; i += vertexValueCount) {
                if (rawVertices === null) { // Fill 0.
                    x = 0.0;
                    y = 0.0;
                    c0X = 0.0;
                    c0Y = 0.0;
                    c1X = 0.0;
                    c1Y = 0.0;
                }
                else {
                    // 这个offset表示数据前面省略了多少个0
                    if (i < offset || i - offset >= rawVertices.length) {
                        x = 0.0;
                    }
                    else {
                        x = rawVertices[i - offset];
                    }
                    if (i + 1 < offset || i + 1 - offset >= rawVertices.length) {
                        y = 0.0;
                    }
                    else {
                        y = rawVertices[i + 1 - offset];
                    }
                    if (i + 2 < offset || i + 2 - offset >= rawVertices.length) {
                        c0X = 0.0;
                    }
                    else {
                        c0X = rawVertices[i + 2 - offset];
                    }
                    if (i + 3 < offset || i + 3 - offset >= rawVertices.length) {
                        c0Y = 0.0;
                    }
                    else {
                        c0Y = rawVertices[i + 3 - offset];
                    }
                    if (i + 4 < offset || i + 4 - offset >= rawVertices.length) {
                        c1X = 0.0;
                    }
                    else {
                        c1X = rawVertices[i + 4 - offset];
                    }
                    if (i + 5 < offset || i + 5 - offset >= rawVertices.length) {
                        c1Y = 0.0;
                    }
                    else {
                        c1Y = rawVertices[i + 5 - offset];
                    }
                }
                this._frameFloatArray[frameFloatOffset + i + 0] = x;
                this._frameFloatArray[frameFloatOffset + i + 1] = y;
                this._frameFloatArray[frameFloatOffset + i + 2] = c0X;
                this._frameFloatArray[frameFloatOffset + i + 3] = c0Y;
                this._frameFloatArray[frameFloatOffset + i + 4] = c1X;
                this._frameFloatArray[frameFloatOffset + i + 5] = c1Y;
            }
            if (frameStart === 0) {
                const frameIntOffset = this._frameIntArray.length;
                this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
                this._frameIntArray[frameIntOffset + 0 /* ShapeVerticesOffset */] = this._shape.shape ? this._shape.shape.offset : 0;
                this._frameIntArray[frameIntOffset + 1 /* ShapeVerticesCount */] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + 2 /* ShapeVerticesValueCount */] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + 3 /* ShapeVerticesValueOffset */] = 0;
                this._frameIntArray[frameIntOffset + 4 /* ShapeVerticesFloatOffset */] = frameFloatOffset - this._animation.frameFloatOffset;
                this._timelineArray[this._timeline.offset + 5 /* TimelineFrameValueCount */] = frameIntOffset - this._animation.frameIntOffset;
            }
            return frameOffset;
        }
        _parseIKConstraintFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameIntOffset = this._frameIntArray.length;
            this._frameIntArray.length += 2;
            this._frameIntArray[frameIntOffset++] = ObjectDataParser._getBoolean(rawData, dragonBones.DataParser.BEND_POSITIVE, true) ? 100 : 0;
            this._frameIntArray[frameIntOffset++] = Math.round(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.WEIGHT, 1.0) * 100.0);
            return frameOffset;
        }
        _parsePathConstraintPositionFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 1;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.VALUE, 0.0);
            return frameOffset;
        }
        _parsePathConstraintSpacingFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            this._frameFloatArray.length += 1;
            this._frameFloatArray[frameFloatOffset++] = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.VALUE, 0.0);
            return frameOffset;
        }
        _parsePathConstraintWeightFrame(rawData, frameStart, frameCount) {
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            let frameFloatOffset = this._frameFloatArray.length;
            const rawValue = dragonBones.DataParser.VALUE in rawData ? rawData[dragonBones.DataParser.VALUE] : [1.0, 1.0, 1.0];
            this._frameFloatArray.length += 3;
            this._frameFloatArray[frameFloatOffset++] = rawValue[0];
            this._frameFloatArray[frameFloatOffset++] = rawValue[1];
            this._frameFloatArray[frameFloatOffset++] = rawValue[2];
            return frameOffset;
        }
        _parseActionData(rawData, type, bone, slot) {
            const actions = new Array();
            if (typeof rawData === "string") {
                const action = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                action.type = type;
                action.name = rawData;
                action.bone = bone;
                action.slot = slot;
                actions.push(action);
            }
            else if (rawData instanceof Array) {
                for (const rawAction of rawData) {
                    const action = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                    if (dragonBones.DataParser.GOTO_AND_PLAY in rawAction) {
                        action.type = 0 /* Play */;
                        action.name = ObjectDataParser._getString(rawAction, dragonBones.DataParser.GOTO_AND_PLAY, "");
                    }
                    else {
                        if (dragonBones.DataParser.TYPE in rawAction && typeof rawAction[dragonBones.DataParser.TYPE] === "string") {
                            action.type = dragonBones.DataParser._getActionType(rawAction[dragonBones.DataParser.TYPE]);
                        }
                        else {
                            action.type = ObjectDataParser._getNumber(rawAction, dragonBones.DataParser.TYPE, type);
                        }
                        action.name = ObjectDataParser._getString(rawAction, dragonBones.DataParser.NAME, "");
                    }
                    if (dragonBones.DataParser.BONE in rawAction) {
                        const boneName = ObjectDataParser._getString(rawAction, dragonBones.DataParser.BONE, "");
                        action.bone = this._armature.getBone(boneName);
                    }
                    else {
                        action.bone = bone;
                    }
                    if (dragonBones.DataParser.SLOT in rawAction) {
                        const slotName = ObjectDataParser._getString(rawAction, dragonBones.DataParser.SLOT, "");
                        action.slot = this._armature.getSlot(slotName);
                    }
                    else {
                        action.slot = slot;
                    }
                    let userData = null;
                    if (dragonBones.DataParser.INTS in rawAction) {
                        if (userData === null) {
                            userData = dragonBones.BaseObject.borrowObject(dragonBones.UserData);
                        }
                        const rawInts = rawAction[dragonBones.DataParser.INTS];
                        for (const rawValue of rawInts) {
                            userData.addInt(rawValue);
                        }
                    }
                    if (dragonBones.DataParser.FLOATS in rawAction) {
                        if (userData === null) {
                            userData = dragonBones.BaseObject.borrowObject(dragonBones.UserData);
                        }
                        const rawFloats = rawAction[dragonBones.DataParser.FLOATS];
                        for (const rawValue of rawFloats) {
                            userData.addFloat(rawValue);
                        }
                    }
                    if (dragonBones.DataParser.STRINGS in rawAction) {
                        if (userData === null) {
                            userData = dragonBones.BaseObject.borrowObject(dragonBones.UserData);
                        }
                        const rawStrings = rawAction[dragonBones.DataParser.STRINGS];
                        for (const rawValue of rawStrings) {
                            userData.addString(rawValue);
                        }
                    }
                    action.data = userData;
                    actions.push(action);
                }
            }
            return actions;
        }
        _parseDeformFrame(rawData, frameStart, frameCount) {
            const frameFloatOffset = this._frameFloatArray.length;
            const frameOffset = this._parseTweenFrame(rawData, frameStart, frameCount);
            const rawVertices = dragonBones.DataParser.VERTICES in rawData ?
                rawData[dragonBones.DataParser.VERTICES] :
                (dragonBones.DataParser.VALUE in rawData ? rawData[dragonBones.DataParser.VALUE] : null);
            const offset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.OFFSET, 0); // uint
            const vertexCount = this._intArray[this._geometry.offset + 0 /* GeometryVertexCount */];
            const weight = this._geometry.weight;
            let x = 0.0;
            let y = 0.0;
            if (weight !== null) {
                // TODO
            }
            else {
                this._frameFloatArray.length += vertexCount * 2;
                for (let i = 0; i < vertexCount * 2; i += 2) {
                    if (rawVertices !== null) {
                        if (i < offset || i - offset >= rawVertices.length) {
                            x = 0.0;
                        }
                        else {
                            x = rawVertices[i - offset];
                        }
                        if (i + 1 < offset || i + 1 - offset >= rawVertices.length) {
                            y = 0.0;
                        }
                        else {
                            y = rawVertices[i + 1 - offset];
                        }
                    }
                    else {
                        x = 0.0;
                        y = 0.0;
                    }
                    this._frameFloatArray[frameFloatOffset + i] = x;
                    this._frameFloatArray[frameFloatOffset + i + 1] = y;
                }
            }
            if (frameStart === 0) {
                const frameIntOffset = this._frameIntArray.length;
                this._frameIntArray.length += 1 + 1 + 1 + 1 + 1;
                this._frameIntArray[frameIntOffset + 0 /* DeformVertexOffset */] = this._geometry.offset;
                this._frameIntArray[frameIntOffset + 1 /* DeformCount */] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + 2 /* DeformValueCount */] = this._frameFloatArray.length - frameFloatOffset;
                this._frameIntArray[frameIntOffset + 3 /* DeformValueOffset */] = 0;
                this._frameIntArray[frameIntOffset + 4 /* DeformFloatOffset */] = frameFloatOffset - this._animation.frameFloatOffset;
                this._timelineArray[this._timeline.offset + 5 /* TimelineFrameValueCount */] = frameIntOffset - this._animation.frameIntOffset;
            }
            return frameOffset;
        }
        _parseTransform(rawData, transform, scale) {
            transform.x = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.X, 0.0) * scale;
            transform.y = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.Y, 0.0) * scale;
            if (dragonBones.DataParser.ROTATE in rawData || dragonBones.DataParser.SKEW in rawData) {
                transform.rotation = dragonBones.Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ROTATE, 0.0) * dragonBones.Transform.DEG_RAD);
                transform.skew = dragonBones.Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SKEW, 0.0) * dragonBones.Transform.DEG_RAD);
            }
            else if (dragonBones.DataParser.SKEW_X in rawData || dragonBones.DataParser.SKEW_Y in rawData) {
                transform.rotation = dragonBones.Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SKEW_Y, 0.0) * dragonBones.Transform.DEG_RAD);
                transform.skew = dragonBones.Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SKEW_X, 0.0) * dragonBones.Transform.DEG_RAD) - transform.rotation;
            }
            transform.scaleX = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SCALE_X, 1.0);
            transform.scaleY = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SCALE_Y, 1.0);
        }
        _parseColorTransform(rawData, color) {
            color.alphaMultiplier = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ALPHA_MULTIPLIER, 100) * 0.01;
            color.redMultiplier = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.RED_MULTIPLIER, 100) * 0.01;
            color.greenMultiplier = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.GREEN_MULTIPLIER, 100) * 0.01;
            color.blueMultiplier = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.BLUE_MULTIPLIER, 100) * 0.01;
            color.alphaOffset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.ALPHA_OFFSET, 0);
            color.redOffset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.RED_OFFSET, 0);
            color.greenOffset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.GREEN_OFFSET, 0);
            color.blueOffset = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.BLUE_OFFSET, 0);
        }
        _parseGeometry(rawData, geometry) {
            const rawVertices = rawData[dragonBones.DataParser.VERTICES];
            const vertexCount = Math.floor(rawVertices.length / 2); // uint
            let triangleCount = 0;
            const geometryOffset = this._intArray.length;
            const verticesOffset = this._floatArray.length;
            //
            geometry.offset = geometryOffset;
            geometry.data = this._data;
            //
            this._intArray.length += 1 + 1 + 1 + 1;
            this._intArray[geometryOffset + 0 /* GeometryVertexCount */] = vertexCount;
            this._intArray[geometryOffset + 2 /* GeometryFloatOffset */] = verticesOffset;
            this._intArray[geometryOffset + 3 /* GeometryWeightOffset */] = -1; //
            // 
            this._floatArray.length += vertexCount * 2;
            for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                this._floatArray[verticesOffset + i] = rawVertices[i];
            }
            if (dragonBones.DataParser.TRIANGLES in rawData) {
                const rawTriangles = rawData[dragonBones.DataParser.TRIANGLES];
                triangleCount = Math.floor(rawTriangles.length / 3); // uint
                //
                this._intArray.length += triangleCount * 3;
                for (let i = 0, l = triangleCount * 3; i < l; ++i) {
                    this._intArray[geometryOffset + 4 /* GeometryVertexIndices */ + i] = rawTriangles[i];
                }
            }
            // Fill triangle count.
            this._intArray[geometryOffset + 1 /* GeometryTriangleCount */] = triangleCount;
            if (dragonBones.DataParser.UVS in rawData) {
                const rawUVs = rawData[dragonBones.DataParser.UVS];
                const uvOffset = verticesOffset + vertexCount * 2;
                this._floatArray.length += vertexCount * 2;
                for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                    this._floatArray[uvOffset + i] = rawUVs[i];
                }
            }
            if (dragonBones.DataParser.WEIGHTS in rawData) {
                const rawWeights = rawData[dragonBones.DataParser.WEIGHTS];
                const weightCount = Math.floor(rawWeights.length - vertexCount) / 2; // uint
                const weightOffset = this._intArray.length;
                const floatOffset = this._floatArray.length;
                let weightBoneCount = 0;
                const sortedBones = this._armature.sortedBones;
                const weight = dragonBones.BaseObject.borrowObject(dragonBones.WeightData);
                weight.count = weightCount;
                weight.offset = weightOffset;
                this._intArray.length += 1 + 1 + weightBoneCount + vertexCount + weightCount;
                this._intArray[weightOffset + 1 /* WeigthFloatOffset */] = floatOffset;
                if (dragonBones.DataParser.BONE_POSE in rawData) {
                    const rawSlotPose = rawData[dragonBones.DataParser.SLOT_POSE];
                    const rawBonePoses = rawData[dragonBones.DataParser.BONE_POSE];
                    const weightBoneIndices = new Array();
                    weightBoneCount = Math.floor(rawBonePoses.length / 7); // uint
                    weightBoneIndices.length = weightBoneCount;
                    for (let i = 0; i < weightBoneCount; ++i) {
                        const rawBoneIndex = rawBonePoses[i * 7]; // uint
                        const bone = this._rawBones[rawBoneIndex];
                        weight.addBone(bone);
                        weightBoneIndices[i] = rawBoneIndex;
                        this._intArray[weightOffset + 2 /* WeigthBoneIndices */ + i] = sortedBones.indexOf(bone);
                    }
                    this._floatArray.length += weightCount * 3;
                    this._helpMatrixA.copyFromArray(rawSlotPose, 0);
                    for (let i = 0, iW = 0, iB = weightOffset + 2 /* WeigthBoneIndices */ + weightBoneCount, iV = floatOffset; i < vertexCount; ++i) {
                        const iD = i * 2;
                        const vertexBoneCount = this._intArray[iB++] = rawWeights[iW++]; // uint
                        let x = this._floatArray[verticesOffset + iD];
                        let y = this._floatArray[verticesOffset + iD + 1];
                        this._helpMatrixA.transformPoint(x, y, this._helpPoint);
                        x = this._helpPoint.x;
                        y = this._helpPoint.y;
                        for (let j = 0; j < vertexBoneCount; ++j) {
                            const rawBoneIndex = rawWeights[iW++]; // uint
                            const boneIndex = weightBoneIndices.indexOf(rawBoneIndex);
                            this._helpMatrixB.copyFromArray(rawBonePoses, boneIndex * 7 + 1);
                            this._helpMatrixB.invert();
                            this._helpMatrixB.transformPoint(x, y, this._helpPoint);
                            this._intArray[iB++] = boneIndex;
                            this._floatArray[iV++] = rawWeights[iW++];
                            this._floatArray[iV++] = this._helpPoint.x;
                            this._floatArray[iV++] = this._helpPoint.y;
                        }
                    }
                }
                else {
                    const rawBones = rawData[dragonBones.DataParser.BONES];
                    weightBoneCount = rawBones.length;
                    for (let i = 0; i < weightBoneCount; i++) {
                        const rawBoneIndex = rawBones[i];
                        const bone = this._rawBones[rawBoneIndex];
                        weight.addBone(bone);
                        this._intArray[weightOffset + 2 /* WeigthBoneIndices */ + i] = sortedBones.indexOf(bone);
                    }
                    this._floatArray.length += weightCount * 3;
                    for (let i = 0, iW = 0, iV = 0, iB = weightOffset + 2 /* WeigthBoneIndices */ + weightBoneCount, iF = floatOffset; i < weightCount; i++) {
                        const vertexBoneCount = rawWeights[iW++];
                        this._intArray[iB++] = vertexBoneCount;
                        for (let j = 0; j < vertexBoneCount; j++) {
                            const boneIndex = rawWeights[iW++];
                            const boneWeight = rawWeights[iW++];
                            const x = rawVertices[iV++];
                            const y = rawVertices[iV++];
                            this._intArray[iB++] = rawBones.indexOf(boneIndex);
                            this._floatArray[iF++] = boneWeight;
                            this._floatArray[iF++] = x;
                            this._floatArray[iF++] = y;
                        }
                    }
                }
                geometry.weight = weight;
            }
        }
        _parseArray(rawData) {
            // tslint:disable-next-line:no-unused-expression
            rawData;
            this._intArray.length = 0;
            this._floatArray.length = 0;
            this._frameIntArray.length = 0;
            this._frameFloatArray.length = 0;
            this._frameArray.length = 0;
            this._timelineArray.length = 0;
            this._colorArray.length = 0;
        }
        _modifyArray() {
            // Align.
            if ((this._intArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._intArray.push(0);
            }
            if ((this._frameIntArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._frameIntArray.push(0);
            }
            if ((this._frameArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._frameArray.push(0);
            }
            if ((this._timelineArray.length % Uint16Array.BYTES_PER_ELEMENT) !== 0) {
                this._timelineArray.push(0);
            }
            if ((this._timelineArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
                this._colorArray.push(0);
            }
            const l1 = this._intArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l2 = this._floatArray.length * Float32Array.BYTES_PER_ELEMENT;
            const l3 = this._frameIntArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l4 = this._frameFloatArray.length * Float32Array.BYTES_PER_ELEMENT;
            const l5 = this._frameArray.length * Int16Array.BYTES_PER_ELEMENT;
            const l6 = this._timelineArray.length * Uint16Array.BYTES_PER_ELEMENT;
            const l7 = this._colorArray.length * Int16Array.BYTES_PER_ELEMENT;
            const lTotal = l1 + l2 + l3 + l4 + l5 + l6 + l7;
            //
            const binary = new ArrayBuffer(lTotal);
            const intArray = new Int16Array(binary, 0, this._intArray.length);
            const floatArray = new Float32Array(binary, l1, this._floatArray.length);
            const frameIntArray = new Int16Array(binary, l1 + l2, this._frameIntArray.length);
            const frameFloatArray = new Float32Array(binary, l1 + l2 + l3, this._frameFloatArray.length);
            const frameArray = new Int16Array(binary, l1 + l2 + l3 + l4, this._frameArray.length);
            const timelineArray = new Uint16Array(binary, l1 + l2 + l3 + l4 + l5, this._timelineArray.length);
            const colorArray = new Int16Array(binary, l1 + l2 + l3 + l4 + l5 + l6, this._colorArray.length);
            for (let i = 0, l = this._intArray.length; i < l; ++i) {
                intArray[i] = this._intArray[i];
            }
            for (let i = 0, l = this._floatArray.length; i < l; ++i) {
                floatArray[i] = this._floatArray[i];
            }
            for (let i = 0, l = this._frameIntArray.length; i < l; ++i) {
                frameIntArray[i] = this._frameIntArray[i];
            }
            for (let i = 0, l = this._frameFloatArray.length; i < l; ++i) {
                frameFloatArray[i] = this._frameFloatArray[i];
            }
            for (let i = 0, l = this._frameArray.length; i < l; ++i) {
                frameArray[i] = this._frameArray[i];
            }
            for (let i = 0, l = this._timelineArray.length; i < l; ++i) {
                timelineArray[i] = this._timelineArray[i];
            }
            for (let i = 0, l = this._colorArray.length; i < l; ++i) {
                colorArray[i] = this._colorArray[i];
            }
            this._data.binary = binary;
            this._data.intArray = intArray;
            this._data.floatArray = floatArray;
            this._data.frameIntArray = frameIntArray;
            this._data.frameFloatArray = frameFloatArray;
            this._data.frameArray = frameArray;
            this._data.timelineArray = timelineArray;
            this._data.colorArray = colorArray;
            this._defaultColorOffset = -1;
        }
        parseDragonBonesData(rawData, scale = 1) {
            console.assert(rawData !== null && rawData !== undefined, "Data error.");
            const version = ObjectDataParser._getString(rawData, dragonBones.DataParser.VERSION, "");
            const compatibleVersion = ObjectDataParser._getString(rawData, dragonBones.DataParser.COMPATIBLE_VERSION, "");
            if (dragonBones.DataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
                dragonBones.DataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0) {
                const data = dragonBones.BaseObject.borrowObject(dragonBones.DragonBonesData);
                data.version = version;
                data.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
                data.frameRate = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.FRAME_RATE, 24);
                if (data.frameRate === 0) { // Data error.
                    data.frameRate = 24;
                }
                if (dragonBones.DataParser.ARMATURE in rawData) {
                    this._data = data;
                    this._parseArray(rawData);
                    const rawArmatures = rawData[dragonBones.DataParser.ARMATURE];
                    for (const rawArmature of rawArmatures) {
                        data.addArmature(this._parseArmature(rawArmature, scale));
                    }
                    if (!this._data.binary) { // DragonBones.webAssembly ? 0 : null;
                        this._modifyArray();
                    }
                    if (dragonBones.DataParser.STAGE in rawData) {
                        data.stage = data.getArmature(ObjectDataParser._getString(rawData, dragonBones.DataParser.STAGE, ""));
                    }
                    else if (data.armatureNames.length > 0) {
                        data.stage = data.getArmature(data.armatureNames[0]);
                    }
                    this._data = null;
                }
                if (dragonBones.DataParser.TEXTURE_ATLAS in rawData) {
                    this._rawTextureAtlases = rawData[dragonBones.DataParser.TEXTURE_ATLAS];
                }
                return data;
            }
            else {
                console.assert(false, "Nonsupport data version: " + version + "\n" +
                    "Please convert DragonBones data to support version.\n" +
                    "Read more: https://github.com/DragonBones/Tools/");
            }
            return null;
        }
        parseTextureAtlasData(rawData, textureAtlasData, scale = 1.0) {
            console.assert(rawData !== undefined);
            if (rawData === null) {
                if (this._rawTextureAtlases === null || this._rawTextureAtlases.length === 0) {
                    return false;
                }
                const rawTextureAtlas = this._rawTextureAtlases[this._rawTextureAtlasIndex++];
                this.parseTextureAtlasData(rawTextureAtlas, textureAtlasData, scale);
                if (this._rawTextureAtlasIndex >= this._rawTextureAtlases.length) {
                    this._rawTextureAtlasIndex = 0;
                    this._rawTextureAtlases = null;
                }
                return true;
            }
            // Texture format.
            textureAtlasData.width = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.WIDTH, 0);
            textureAtlasData.height = ObjectDataParser._getNumber(rawData, dragonBones.DataParser.HEIGHT, 0);
            textureAtlasData.scale = scale === 1.0 ? (1.0 / ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SCALE, 1.0)) : scale;
            textureAtlasData.name = ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, "");
            textureAtlasData.imagePath = ObjectDataParser._getString(rawData, dragonBones.DataParser.IMAGE_PATH, "");
            if (dragonBones.DataParser.SUB_TEXTURE in rawData) {
                const rawTextures = rawData[dragonBones.DataParser.SUB_TEXTURE];
                for (let i = 0, l = rawTextures.length; i < l; ++i) {
                    const rawTexture = rawTextures[i];
                    const frameWidth = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.FRAME_WIDTH, -1.0);
                    const frameHeight = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.FRAME_HEIGHT, -1.0);
                    const textureData = textureAtlasData.createTexture();
                    textureData.rotated = ObjectDataParser._getBoolean(rawTexture, dragonBones.DataParser.ROTATED, false);
                    textureData.name = ObjectDataParser._getString(rawTexture, dragonBones.DataParser.NAME, "");
                    textureData.region.x = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.X, 0.0);
                    textureData.region.y = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.Y, 0.0);
                    textureData.region.width = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.WIDTH, 0.0);
                    textureData.region.height = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.HEIGHT, 0.0);
                    if (frameWidth > 0.0 && frameHeight > 0.0) {
                        textureData.frame = dragonBones.TextureData.createRectangle();
                        textureData.frame.x = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.FRAME_X, 0.0);
                        textureData.frame.y = ObjectDataParser._getNumber(rawTexture, dragonBones.DataParser.FRAME_Y, 0.0);
                        textureData.frame.width = frameWidth;
                        textureData.frame.height = frameHeight;
                    }
                    textureAtlasData.addTexture(textureData);
                }
            }
            return true;
        }
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parseDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parseDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        static getInstance() {
            if (ObjectDataParser._objectDataParserInstance === null) {
                ObjectDataParser._objectDataParserInstance = new ObjectDataParser();
            }
            return ObjectDataParser._objectDataParserInstance;
        }
    }
    ObjectDataParser._objectDataParserInstance = null;
    dragonBones.ObjectDataParser = ObjectDataParser;
    /**
     * @private
     */
    class ActionFrame {
        constructor() {
            this.frameStart = 0;
            this.actions = [];
        }
    }
    dragonBones.ActionFrame = ActionFrame;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    class BinaryDataParser extends dragonBones.ObjectDataParser {
        _inRange(a, min, max) {
            return min <= a && a <= max;
        }
        _decodeUTF8(data) {
            const EOF_byte = -1;
            const EOF_code_point = -1;
            const FATAL_POINT = 0xFFFD;
            let pos = 0;
            let result = "";
            let code_point;
            let utf8_code_point = 0;
            let utf8_bytes_needed = 0;
            let utf8_bytes_seen = 0;
            let utf8_lower_boundary = 0;
            while (data.length > pos) {
                let _byte = data[pos++];
                if (_byte === EOF_byte) {
                    if (utf8_bytes_needed !== 0) {
                        code_point = FATAL_POINT;
                    }
                    else {
                        code_point = EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed === 0) {
                        if (this._inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this._inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this._inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this._inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this._inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = _byte;
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            let cp = utf8_code_point;
                            let lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this._inRange(cp, lower_boundary, 0x10FFFF) && !this._inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = _byte;
                            }
                        }
                    }
                }
                //Decode string
                if (code_point !== null && code_point !== EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        }
        _parseBinaryTimeline(type, offset, timelineData = null) {
            const timeline = timelineData !== null ? timelineData : dragonBones.BaseObject.borrowObject(dragonBones.TimelineData);
            timeline.type = type;
            timeline.offset = offset;
            this._timeline = timeline;
            const keyFrameCount = this._timelineArrayBuffer[timeline.offset + 4 /* TimelineKeyFrameCount */];
            if (keyFrameCount === 1) {
                timeline.frameIndicesOffset = -1;
            }
            else {
                let frameIndicesOffset = 0;
                const totalFrameCount = this._animation.frameCount + 1; // One more frame than animation.
                const frameIndices = this._data.frameIndices;
                frameIndicesOffset = frameIndices.length;
                frameIndices.length += totalFrameCount;
                timeline.frameIndicesOffset = frameIndicesOffset;
                for (let i = 0, iK = 0, frameStart = 0, frameCount = 0; i < totalFrameCount; ++i) {
                    if (frameStart + frameCount <= i && iK < keyFrameCount) {
                        frameStart = this._frameArrayBuffer[this._animation.frameOffset + this._timelineArrayBuffer[timeline.offset + 7 /* TimelineFrameOffset */ + iK]];
                        if (iK === keyFrameCount - 1) {
                            frameCount = this._animation.frameCount - frameStart;
                        }
                        else {
                            frameCount = this._frameArrayBuffer[this._animation.frameOffset + this._timelineArrayBuffer[timeline.offset + 7 /* TimelineFrameOffset */ + iK + 1]] - frameStart;
                        }
                        iK++;
                    }
                    frameIndices[frameIndicesOffset + i] = iK - 1;
                }
            }
            this._timeline = null; //
            return timeline;
        }
        _parseAnimation(rawData) {
            const animation = dragonBones.BaseObject.borrowObject(dragonBones.AnimationData);
            animation.blendType = dragonBones.DataParser._getAnimationBlendType(dragonBones.ObjectDataParser._getString(rawData, dragonBones.DataParser.BLEND_TYPE, ""));
            animation.frameCount = dragonBones.ObjectDataParser._getNumber(rawData, dragonBones.DataParser.DURATION, 0);
            animation.playTimes = dragonBones.ObjectDataParser._getNumber(rawData, dragonBones.DataParser.PLAY_TIMES, 1);
            animation.duration = animation.frameCount / this._armature.frameRate; // float
            animation.fadeInTime = dragonBones.ObjectDataParser._getNumber(rawData, dragonBones.DataParser.FADE_IN_TIME, 0.0);
            animation.scale = dragonBones.ObjectDataParser._getNumber(rawData, dragonBones.DataParser.SCALE, 1.0);
            animation.name = dragonBones.ObjectDataParser._getString(rawData, dragonBones.DataParser.NAME, dragonBones.DataParser.DEFAULT_NAME);
            if (animation.name.length === 0) {
                animation.name = dragonBones.DataParser.DEFAULT_NAME;
            }
            // Offsets.
            const offsets = rawData[dragonBones.DataParser.OFFSET];
            animation.frameIntOffset = offsets[0];
            animation.frameFloatOffset = offsets[1];
            animation.frameOffset = offsets[2];
            this._animation = animation;
            if (dragonBones.DataParser.ACTION in rawData) {
                animation.actionTimeline = this._parseBinaryTimeline(0 /* Action */, rawData[dragonBones.DataParser.ACTION]);
            }
            if (dragonBones.DataParser.Z_ORDER in rawData) {
                animation.zOrderTimeline = this._parseBinaryTimeline(1 /* ZOrder */, rawData[dragonBones.DataParser.Z_ORDER]);
            }
            if (dragonBones.DataParser.BONE in rawData) {
                const rawTimeliness = rawData[dragonBones.DataParser.BONE];
                for (let k in rawTimeliness) {
                    const rawTimelines = rawTimeliness[k];
                    const bone = this._armature.getBone(k);
                    if (bone === null) {
                        continue;
                    }
                    for (let i = 0, l = rawTimelines.length; i < l; i += 2) {
                        const timelineType = rawTimelines[i];
                        const timelineOffset = rawTimelines[i + 1];
                        const timeline = this._parseBinaryTimeline(timelineType, timelineOffset);
                        this._animation.addBoneTimeline(bone.name, timeline);
                    }
                }
            }
            if (dragonBones.DataParser.SLOT in rawData) {
                const rawTimeliness = rawData[dragonBones.DataParser.SLOT];
                for (let k in rawTimeliness) {
                    const rawTimelines = rawTimeliness[k];
                    const slot = this._armature.getSlot(k);
                    if (slot === null) {
                        continue;
                    }
                    for (let i = 0, l = rawTimelines.length; i < l; i += 2) {
                        const timelineType = rawTimelines[i];
                        const timelineOffset = rawTimelines[i + 1];
                        const timeline = this._parseBinaryTimeline(timelineType, timelineOffset);
                        this._animation.addSlotTimeline(slot.name, timeline);
                    }
                }
            }
            if (dragonBones.DataParser.CONSTRAINT in rawData) {
                const rawTimeliness = rawData[dragonBones.DataParser.CONSTRAINT];
                for (let k in rawTimeliness) {
                    const rawTimelines = rawTimeliness[k];
                    const constraint = this._armature.getConstraint(k);
                    if (constraint === null) {
                        continue;
                    }
                    for (let i = 0, l = rawTimelines.length; i < l; i += 2) {
                        const timelineType = rawTimelines[i];
                        const timelineOffset = rawTimelines[i + 1];
                        const timeline = this._parseBinaryTimeline(timelineType, timelineOffset);
                        this._animation.addConstraintTimeline(constraint.name, timeline);
                    }
                }
            }
            if (dragonBones.DataParser.TIMELINE in rawData) {
                const rawTimelines = rawData[dragonBones.DataParser.TIMELINE];
                for (const rawTimeline of rawTimelines) {
                    const timelineOffset = dragonBones.ObjectDataParser._getNumber(rawTimeline, dragonBones.DataParser.OFFSET, 0);
                    if (timelineOffset >= 0) {
                        const timelineType = dragonBones.ObjectDataParser._getNumber(rawTimeline, dragonBones.DataParser.TYPE, 0 /* Action */);
                        const timelineName = dragonBones.ObjectDataParser._getString(rawTimeline, dragonBones.DataParser.NAME, "");
                        let timeline = null;
                        if (timelineType === 40 /* AnimationProgress */ && animation.blendType !== 0 /* None */) {
                            timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationTimelineData);
                            const animaitonTimeline = timeline;
                            animaitonTimeline.x = dragonBones.ObjectDataParser._getNumber(rawTimeline, dragonBones.DataParser.X, 0.0);
                            animaitonTimeline.y = dragonBones.ObjectDataParser._getNumber(rawTimeline, dragonBones.DataParser.Y, 0.0);
                        }
                        timeline = this._parseBinaryTimeline(timelineType, timelineOffset, timeline);
                        switch (timelineType) {
                            case 0 /* Action */:
                                // TODO
                                break;
                            case 1 /* ZOrder */:
                                // TODO
                                break;
                            case 11 /* BoneTranslate */:
                            case 12 /* BoneRotate */:
                            case 13 /* BoneScale */:
                            case 50 /* Surface */:
                            case 60 /* BoneAlpha */:
                                this._animation.addBoneTimeline(timelineName, timeline);
                                break;
                            case 20 /* SlotDisplay */:
                            case 21 /* SlotColor */:
                            case 22 /* SlotDeform */:
                            case 23 /* SlotZIndex */:
                            case 24 /* SlotAlpha */:
                                this._animation.addSlotTimeline(timelineName, timeline);
                                break;
                            case 30 /* IKConstraint */:
                                this._animation.addConstraintTimeline(timelineName, timeline);
                                break;
                            case 40 /* AnimationProgress */:
                            case 41 /* AnimationWeight */:
                            case 42 /* AnimationParameter */:
                                this._animation.addAnimationTimeline(timelineName, timeline);
                                break;
                        }
                    }
                }
            }
            this._animation = null;
            return animation;
        }
        _parseGeometry(rawData, geometry) {
            geometry.offset = rawData[dragonBones.DataParser.OFFSET];
            geometry.data = this._data;
            let weightOffset = this._intArrayBuffer[geometry.offset + 3 /* GeometryWeightOffset */];
            if (weightOffset < -1) { // -1 is a special flag that there is no bones weight.
                weightOffset += 65536; // Fixed out of bounds bug. 
            }
            if (weightOffset >= 0) {
                const weight = dragonBones.BaseObject.borrowObject(dragonBones.WeightData);
                const vertexCount = this._intArrayBuffer[geometry.offset + 0 /* GeometryVertexCount */];
                const boneCount = this._intArrayBuffer[weightOffset + 0 /* WeigthBoneCount */];
                weight.offset = weightOffset;
                for (let i = 0; i < boneCount; ++i) {
                    const boneIndex = this._intArrayBuffer[weightOffset + 2 /* WeigthBoneIndices */ + i];
                    weight.addBone(this._rawBones[boneIndex]);
                }
                let boneIndicesOffset = weightOffset + 2 /* WeigthBoneIndices */ + boneCount;
                let weightCount = 0;
                for (let i = 0, l = vertexCount; i < l; ++i) {
                    const vertexBoneCount = this._intArrayBuffer[boneIndicesOffset++];
                    weightCount += vertexBoneCount;
                    boneIndicesOffset += vertexBoneCount;
                }
                weight.count = weightCount;
                geometry.weight = weight;
            }
        }
        _parseArray(rawData) {
            const offsets = rawData[dragonBones.DataParser.OFFSET];
            const l1 = offsets[1];
            const l2 = offsets[3];
            const l3 = offsets[5];
            const l4 = offsets[7];
            const l5 = offsets[9];
            const l6 = offsets[11];
            const l7 = offsets.length > 12 ? offsets[13] : 0; // Color.
            const intArray = new Int16Array(this._binary, this._binaryOffset + offsets[0], l1 / Int16Array.BYTES_PER_ELEMENT);
            const floatArray = new Float32Array(this._binary, this._binaryOffset + offsets[2], l2 / Float32Array.BYTES_PER_ELEMENT);
            const frameIntArray = new Int16Array(this._binary, this._binaryOffset + offsets[4], l3 / Int16Array.BYTES_PER_ELEMENT);
            const frameFloatArray = new Float32Array(this._binary, this._binaryOffset + offsets[6], l4 / Float32Array.BYTES_PER_ELEMENT);
            const frameArray = new Int16Array(this._binary, this._binaryOffset + offsets[8], l5 / Int16Array.BYTES_PER_ELEMENT);
            const timelineArray = new Uint16Array(this._binary, this._binaryOffset + offsets[10], l6 / Uint16Array.BYTES_PER_ELEMENT);
            const colorArray = l7 > 0 ? new Int16Array(this._binary, this._binaryOffset + offsets[12], l7 / Uint16Array.BYTES_PER_ELEMENT) : intArray; // Color.
            this._data.binary = this._binary;
            this._data.intArray = this._intArrayBuffer = intArray;
            this._data.floatArray = floatArray;
            this._data.frameIntArray = frameIntArray;
            this._data.frameFloatArray = frameFloatArray;
            this._data.frameArray = this._frameArrayBuffer = frameArray;
            this._data.timelineArray = this._timelineArrayBuffer = timelineArray;
            // TODO: this._data.timelineArray 需要兼容，6.0版本的数据，每个时间轴多了两个数据，所以这里要处理一下
            this._data.colorArray = colorArray;
        }
        parseDragonBonesData(rawData, scale = 1) {
            console.assert(rawData !== null && rawData !== undefined && rawData instanceof ArrayBuffer, "Data error.");
            const tag = new Uint8Array(rawData, 0, 8);
            if (tag[0] !== "D".charCodeAt(0) ||
                tag[1] !== "B".charCodeAt(0) ||
                tag[2] !== "D".charCodeAt(0) ||
                tag[3] !== "T".charCodeAt(0)) {
                console.assert(false, "Nonsupport data.");
                return null;
            }
            const headerLength = new Uint32Array(rawData, 8, 1)[0];
            const headerBytes = new Uint8Array(rawData, 8 + 4, headerLength);
            const headerString = this._decodeUTF8(headerBytes);
            const header = JSON.parse(headerString);
            //
            this._binaryOffset = 8 + 4 + headerLength;
            this._binary = rawData;
            return super.parseDragonBonesData(header, scale);
        }
        /**
         * - Deprecated, please refer to {@link dragonBones.BaseFactory#parseDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link dragonBones.BaseFactory#parseDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        static getInstance() {
            if (BinaryDataParser._binaryDataParserInstance === null) {
                BinaryDataParser._binaryDataParserInstance = new BinaryDataParser();
            }
            return BinaryDataParser._binaryDataParserInstance;
        }
    }
    BinaryDataParser._binaryDataParserInstance = null;
    dragonBones.BinaryDataParser = BinaryDataParser;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - Base class for the factory that create the armatures. (Typically only one global factory instance is required)
     * The factory instance create armatures by parsed and added DragonBonesData instances and TextureAtlasData instances.
     * Once the data has been parsed, it has been cached in the factory instance and does not need to be parsed again until it is cleared by the factory instance.
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 创建骨架的工厂基类。 （通常只需要一个全局工厂实例）
     * 工厂通过解析并添加的 DragonBonesData 实例和 TextureAtlasData 实例来创建骨架。
     * 当数据被解析过之后，已经添加到工厂中，在没有被工厂清理之前，不需要再次解析。
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class BaseFactory {
        /**
         * - Create a factory instance. (typically only one global factory instance is required)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建一个工厂实例。 （通常只需要一个全局工厂实例）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(dataParser = null) {
            /**
             * @private
             */
            this.autoSearch = false;
            this._dragonBonesDataMap = {};
            this._textureAtlasDataMap = {};
            this._dragonBones = null;
            this._dataParser = null;
            if (BaseFactory._objectParser === null) {
                BaseFactory._objectParser = new dragonBones.ObjectDataParser();
            }
            if (BaseFactory._binaryParser === null) {
                BaseFactory._binaryParser = new dragonBones.BinaryDataParser();
            }
            this._dataParser = dataParser !== null ? dataParser : BaseFactory._objectParser;
        }
        _isSupportMesh() {
            return true;
        }
        _getTextureData(textureAtlasName, textureName) {
            if (textureAtlasName in this._textureAtlasDataMap) {
                for (const textureAtlasData of this._textureAtlasDataMap[textureAtlasName]) {
                    const textureData = textureAtlasData.getTexture(textureName);
                    if (textureData !== null) {
                        return textureData;
                    }
                }
            }
            if (this.autoSearch) { // Will be search all data, if the autoSearch is true.
                for (let k in this._textureAtlasDataMap) {
                    for (const textureAtlasData of this._textureAtlasDataMap[k]) {
                        if (textureAtlasData.autoSearch) {
                            const textureData = textureAtlasData.getTexture(textureName);
                            if (textureData !== null) {
                                return textureData;
                            }
                        }
                    }
                }
            }
            return null;
        }
        _fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, skinName, textureAtlasName) {
            let dragonBonesData = null;
            let armatureData = null;
            if (dragonBonesName.length > 0) {
                if (dragonBonesName in this._dragonBonesDataMap) {
                    dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                    armatureData = dragonBonesData.getArmature(armatureName);
                }
            }
            if (armatureData === null && (dragonBonesName.length === 0 || this.autoSearch)) { // Will be search all data, if do not give a data name or the autoSearch is true.
                for (let k in this._dragonBonesDataMap) {
                    dragonBonesData = this._dragonBonesDataMap[k];
                    if (dragonBonesName.length === 0 || dragonBonesData.autoSearch) {
                        armatureData = dragonBonesData.getArmature(armatureName);
                        if (armatureData !== null) {
                            dragonBonesName = k;
                            break;
                        }
                    }
                }
            }
            if (armatureData !== null) {
                dataPackage.dataName = dragonBonesName;
                dataPackage.textureAtlasName = textureAtlasName;
                dataPackage.data = dragonBonesData;
                dataPackage.armature = armatureData;
                dataPackage.skin = null;
                if (skinName.length > 0) {
                    dataPackage.skin = armatureData.getSkin(skinName);
                    if (dataPackage.skin === null && this.autoSearch) {
                        for (let k in this._dragonBonesDataMap) {
                            const skinDragonBonesData = this._dragonBonesDataMap[k];
                            const skinArmatureData = skinDragonBonesData.getArmature(skinName);
                            if (skinArmatureData !== null) {
                                dataPackage.skin = skinArmatureData.defaultSkin;
                                break;
                            }
                        }
                    }
                }
                if (dataPackage.skin === null) {
                    dataPackage.skin = armatureData.defaultSkin;
                }
                return true;
            }
            return false;
        }
        _buildBones(dataPackage, armature) {
            for (const boneData of dataPackage.armature.sortedBones) {
                const bone = dragonBones.BaseObject.borrowObject(boneData.type === 0 /* Bone */ ? dragonBones.Bone : dragonBones.Surface);
                bone.init(boneData, armature);
            }
        }
        /**
         * @private
         */
        _buildSlots(dataPackage, armature) {
            const currentSkin = dataPackage.skin;
            const defaultSkin = dataPackage.armature.defaultSkin;
            if (currentSkin === null || defaultSkin === null) {
                return;
            }
            const skinSlots = {};
            for (let k in defaultSkin.displays) {
                const displays = defaultSkin.getDisplays(k);
                skinSlots[k] = displays;
            }
            if (currentSkin !== defaultSkin) {
                for (let k in currentSkin.displays) {
                    const displays = currentSkin.getDisplays(k);
                    skinSlots[k] = displays;
                }
            }
            for (const slotData of dataPackage.armature.sortedSlots) {
                const displayDatas = slotData.name in skinSlots ? skinSlots[slotData.name] : null;
                const slot = this._buildSlot(dataPackage, slotData, armature);
                if (displayDatas !== null) {
                    slot.displayFrameCount = displayDatas.length;
                    for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                        const displayData = displayDatas[i];
                        slot.replaceRawDisplayData(displayData, i);
                        if (displayData !== null) {
                            if (dataPackage.textureAtlasName.length > 0) {
                                const textureData = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
                                slot.replaceTextureData(textureData, i);
                            }
                            const display = this._getSlotDisplay(dataPackage, displayData, slot);
                            slot.replaceDisplay(display, i);
                        }
                        else {
                            slot.replaceDisplay(null);
                        }
                    }
                }
                slot._setDisplayIndex(slotData.displayIndex, true);
            }
        }
        _buildConstraints(dataPackage, armature) {
            const constraints = dataPackage.armature.constraints;
            for (let k in constraints) {
                const constraintData = constraints[k];
                // TODO more constraint type.
                switch (constraintData.type) {
                    case 0 /* IK */:
                        const ikConstraint = dragonBones.BaseObject.borrowObject(dragonBones.IKConstraint);
                        ikConstraint.init(constraintData, armature);
                        armature._addConstraint(ikConstraint);
                        break;
                    case 1 /* Path */:
                        const pathConstraint = dragonBones.BaseObject.borrowObject(dragonBones.PathConstraint);
                        pathConstraint.init(constraintData, armature);
                        armature._addConstraint(pathConstraint);
                        break;
                    case 2 /* Transform */:
                        const transformConstraintData = constraintData;
                        if (transformConstraintData.bones && transformConstraintData.bones.length > 0) {
                            for (let i = 0, l = transformConstraintData.bones.length; i < l; ++i) {
                                const bone = transformConstraintData.bones[i];
                                if (bone) {
                                    const transformConstraint = dragonBones.BaseObject.borrowObject(dragonBones.TransformConstraint);
                                    transformConstraint.index = i;
                                    transformConstraint.init(constraintData, armature);
                                }
                            }
                        }
                        break;
                    case 3 /* Physics */:
                        const physicsConstraint = dragonBones.BaseObject.borrowObject(dragonBones.PhysicsConstraint);
                        physicsConstraint.init(constraintData, armature);
                        break;
                    default:
                        const constraint = dragonBones.BaseObject.borrowObject(dragonBones.IKConstraint);
                        constraint.init(constraintData, armature);
                        armature._addConstraint(constraint);
                        break;
                }
            }
        }
        _buildChildArmature(dataPackage, _slot, displayData) {
            return this.buildArmature(displayData.path, dataPackage !== null ? dataPackage.dataName : "", "", dataPackage !== null ? dataPackage.textureAtlasName : "");
        }
        _getSlotDisplay(dataPackage, displayData, slot) {
            const dataName = dataPackage !== null ? dataPackage.dataName : displayData.parent.parent.parent.name;
            let display = null;
            switch (displayData.type) {
                case 0 /* Image */: {
                    const imageDisplayData = displayData;
                    if (imageDisplayData.texture === null) {
                        imageDisplayData.texture = this._getTextureData(dataName, displayData.path);
                    }
                    display = slot.rawDisplay;
                    break;
                }
                case 2 /* Mesh */: {
                    const meshDisplayData = displayData;
                    if (meshDisplayData.texture === null) {
                        meshDisplayData.texture = this._getTextureData(dataName, meshDisplayData.path);
                    }
                    if (this._isSupportMesh()) {
                        display = slot.meshDisplay;
                    }
                    else {
                        display = slot.rawDisplay;
                    }
                    break;
                }
                case 1 /* Armature */: {
                    const armatureDisplayData = displayData;
                    const childArmature = this._buildChildArmature(dataPackage, slot, armatureDisplayData);
                    if (childArmature !== null) {
                        childArmature.inheritAnimation = armatureDisplayData.inheritAnimation;
                        if (!childArmature.inheritAnimation) {
                            const actions = armatureDisplayData.actions.length > 0 ? armatureDisplayData.actions : childArmature.armatureData.defaultActions;
                            if (actions.length > 0) {
                                for (const action of actions) {
                                    const eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                                    dragonBones.EventObject.actionDataToInstance(action, eventObject, slot.armature);
                                    eventObject.slot = slot;
                                    slot.armature._bufferAction(eventObject, false);
                                }
                            }
                            else {
                                childArmature.animation.play();
                            }
                        }
                        armatureDisplayData.armature = childArmature.armatureData; // 
                    }
                    display = childArmature;
                    break;
                }
                case 3 /* BoundingBox */:
                    break;
                case 5 /* Shape */: {
                    const shapeDisplayData = displayData;
                    display = slot.shapeDisplay;
                    break;
                }
                default:
                    break;
            }
            return display;
        }
        /**
         * - Parse the raw data to a DragonBonesData instance and cache it to the factory.
         * @param rawData - The raw data.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
         * @param scale - Specify a scaling value for all armatures. (Default: 1.0)
         * @returns DragonBonesData instance
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 将原始数据解析为 DragonBonesData 实例，并缓存到工厂中。
         * @param rawData - 原始数据。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param scale - 为所有的骨架指定一个缩放值。 （默认: 1.0）
         * @returns DragonBonesData 实例
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        parseDragonBonesData(rawData, name = null, scale = 1.0) {
            const dataParser = rawData instanceof ArrayBuffer ? BaseFactory._binaryParser : this._dataParser;
            const dragonBonesData = dataParser.parseDragonBonesData(rawData, scale);
            while (true) {
                const textureAtlasData = this._buildTextureAtlasData(null, null);
                if (dataParser.parseTextureAtlasData(null, textureAtlasData, scale)) {
                    this.addTextureAtlasData(textureAtlasData, name);
                }
                else {
                    textureAtlasData.returnToPool();
                    break;
                }
            }
            if (dragonBonesData !== null) {
                this.addDragonBonesData(dragonBonesData, name);
            }
            return dragonBonesData;
        }
        /**
         * - Parse the raw texture atlas data and the texture atlas object to a TextureAtlasData instance and cache it to the factory.
         * @param rawData - The raw texture atlas data.
         * @param textureAtlas - The texture atlas object.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
         * @param scale - Specify a scaling value for the map set. (Default: 1.0)
         * @returns TextureAtlasData instance
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 将原始贴图集数据和贴图集对象解析为 TextureAtlasData 实例，并缓存到工厂中。
         * @param rawData - 原始贴图集数据。
         * @param textureAtlas - 贴图集对象。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param scale - 为贴图集指定一个缩放值。 （默认: 1.0）
         * @returns TextureAtlasData 实例
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        parseTextureAtlasData(rawData, textureAtlas, name = null, scale = 1.0) {
            const textureAtlasData = this._buildTextureAtlasData(null, null);
            this._dataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);
            this._buildTextureAtlasData(textureAtlasData, textureAtlas || null);
            this.addTextureAtlasData(textureAtlasData, name);
            return textureAtlasData;
        }
        /**
         * - Update texture atlases.
         * @param textureAtlases - The texture atlas objects.
         * @param name - The texture atlas name.
         * @version DragonBones 5.7
         * @language en_US
         */
        /**
         * - 更新贴图集对象。
         * @param textureAtlases - 多个贴图集对象。
         * @param name - 贴图集名称。
         * @version DragonBones 5.7
         * @language zh_CN
         */
        updateTextureAtlases(textureAtlases, name) {
            const textureAtlasDatas = this.getTextureAtlasData(name);
            if (textureAtlasDatas !== null) {
                for (let i = 0, l = textureAtlasDatas.length; i < l; ++i) {
                    if (i < textureAtlases.length) {
                        this._buildTextureAtlasData(textureAtlasDatas[i], textureAtlases[i]);
                    }
                }
            }
        }
        /**
         * - Get a specific DragonBonesData instance.
         * @param name - The DragonBonesData instance cache name.
         * @returns DragonBonesData instance
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的 DragonBonesData 实例。
         * @param name - DragonBonesData 实例的缓存名称。
         * @returns DragonBonesData 实例
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getDragonBonesData(name) {
            return (name in this._dragonBonesDataMap) ? this._dragonBonesDataMap[name] : null;
        }
        /**
         * - Cache a DragonBonesData instance to the factory.
         * @param data - The DragonBonesData instance.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将 DragonBonesData 实例缓存到工厂中。
         * @param data - DragonBonesData 实例。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addDragonBonesData(data, name = null) {
            name = name !== null ? name : data.name;
            if (name in this._dragonBonesDataMap) {
                if (this._dragonBonesDataMap[name] === data) {
                    return;
                }
                console.warn("Can not add same name data: " + name);
                return;
            }
            this._dragonBonesDataMap[name] = data;
        }
        /**
         * - Remove a DragonBonesData instance.
         * @param name - The DragonBonesData instance cache name.
         * @param disposeData - Whether to dispose data. (Default: true)
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 移除 DragonBonesData 实例。
         * @param name - DragonBonesData 实例缓存名称。
         * @param disposeData - 是否释放数据。 （默认: true）
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeDragonBonesData(name, disposeData = true) {
            if (name in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBones.bufferObject(this._dragonBonesDataMap[name]);
                }
                delete this._dragonBonesDataMap[name];
            }
        }
        /**
         * - Get a list of specific TextureAtlasData instances.
         * @param name - The TextureAtlasData cahce name.
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 获取特定的 TextureAtlasData 实例列表。
         * @param name - TextureAtlasData 实例缓存名称。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getTextureAtlasData(name) {
            return (name in this._textureAtlasDataMap) ? this._textureAtlasDataMap[name] : null;
        }
        /**
         * - Cache a TextureAtlasData instance to the factory.
         * @param data - The TextureAtlasData instance.
         * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 将 TextureAtlasData 实例缓存到工厂中。
         * @param data - TextureAtlasData 实例。
         * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addTextureAtlasData(data, name = null) {
            name = name !== null ? name : data.name;
            const textureAtlasList = (name in this._textureAtlasDataMap) ? this._textureAtlasDataMap[name] : (this._textureAtlasDataMap[name] = []);
            if (textureAtlasList.indexOf(data) < 0) {
                textureAtlasList.push(data);
            }
        }
        /**
         * - Remove a TextureAtlasData instance.
         * @param name - The TextureAtlasData instance cache name.
         * @param disposeData - Whether to dispose data.
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 移除 TextureAtlasData 实例。
         * @param name - TextureAtlasData 实例的缓存名称。
         * @param disposeData - 是否释放数据。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeTextureAtlasData(name, disposeData = true) {
            if (name in this._textureAtlasDataMap) {
                const textureAtlasDataList = this._textureAtlasDataMap[name];
                if (disposeData) {
                    for (const textureAtlasData of textureAtlasDataList) {
                        this._dragonBones.bufferObject(textureAtlasData);
                    }
                }
                delete this._textureAtlasDataMap[name];
            }
        }
        /**
         * - Get a specific armature data.
         * @param name - The armature data name.
         * @param dragonBonesName - The cached name for DragonbonesData instance.
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 获取特定的骨架数据。
         * @param name - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.1
         * @language zh_CN
         */
        getArmatureData(name, dragonBonesName = "") {
            const dataPackage = new BuildArmaturePackage();
            if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName, name, "", "")) {
                return null;
            }
            return dataPackage.armature;
        }
        /**
         * - Clear all cached DragonBonesData instances and TextureAtlasData instances.
         * @param disposeData - Whether to dispose data.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 清除缓存的所有 DragonBonesData 实例和 TextureAtlasData 实例。
         * @param disposeData - 是否释放数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        clear(disposeData = true) {
            for (let k in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBones.bufferObject(this._dragonBonesDataMap[k]);
                }
                delete this._dragonBonesDataMap[k];
            }
            for (let k in this._textureAtlasDataMap) {
                if (disposeData) {
                    const textureAtlasDataList = this._textureAtlasDataMap[k];
                    for (const textureAtlasData of textureAtlasDataList) {
                        this._dragonBones.bufferObject(textureAtlasData);
                    }
                }
                delete this._textureAtlasDataMap[k];
            }
        }
        /**
         * - Create a armature from cached DragonBonesData instances and TextureAtlasData instances.
         * Note that when the created armature that is no longer in use, you need to explicitly dispose {@link #dragonBones.Armature#dispose()}.
         * @param armatureName - The armature data name.
         * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
         * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
         * @returns The armature.
         * @example
         * <pre>
         *     let armature = factory.buildArmature("armatureName", "dragonBonesName");
         *     armature.clock = factory.clock;
         * </pre>
         * @see dragonBones.DragonBonesData
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架。
         * 注意，创建的骨架不再使用时，需要显式释放 {@link #dragonBones.Armature#dispose()}。
         * @param armatureName - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
         * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。（如果未设置，则使用默认的皮肤数据）
         * @returns 骨架。
         * @example
         * <pre>
         *     let armature = factory.buildArmature("armatureName", "dragonBonesName");
         *     armature.clock = factory.clock;
         * </pre>
         * @see dragonBones.DragonBonesData
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        buildArmature(armatureName, dragonBonesName = "", skinName = "", textureAtlasName = "") {
            const dataPackage = new BuildArmaturePackage();
            if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName || "", armatureName, skinName || "", textureAtlasName || "")) {
                console.warn("No armature data: " + armatureName + ", " + (dragonBonesName !== null ? dragonBonesName : ""));
                return null;
            }
            const armature = this._buildArmature(dataPackage);
            this._buildBones(dataPackage, armature);
            this._buildSlots(dataPackage, armature);
            this._buildConstraints(dataPackage, armature);
            armature.invalidUpdate(null, true);
            armature.advanceTime(0.0); // Update armature pose.
            return armature;
        }
        /**
         * @private
         */
        replaceDisplay(slot, displayData, displayIndex = -1) {
            if (displayIndex < 0) {
                displayIndex = slot.displayIndex;
            }
            if (displayIndex < 0) {
                displayIndex = 0;
            }
            slot.replaceDisplayData(displayData, displayIndex);
            if (displayData !== null) {
                let display = this._getSlotDisplay(null, displayData, slot);
                if (displayData.type === 0 /* Image */) {
                    const rawDisplayData = slot.getDisplayFrameAt(displayIndex).rawDisplayData;
                    if (rawDisplayData !== null &&
                        rawDisplayData.type === 2 /* Mesh */) {
                        display = slot.meshDisplay;
                    }
                    else if (rawDisplayData !== null && rawDisplayData.type === 5 /* Shape */) {
                        display = slot.shapeDisplay;
                    }
                }
                slot.replaceDisplay(display, displayIndex);
            }
            else {
                slot.replaceDisplay(null, displayIndex);
            }
        }
        /**
         * - Replaces the current display data for a particular slot with a specific display data.
         * Specify display data with "dragonBonesName/armatureName/slotName/displayName".
         * @param dragonBonesName - The DragonBonesData instance cache name.
         * @param armatureName - The armature data name.
         * @param slotName - The slot data name.
         * @param displayName - The display data name.
         * @param slot - The slot.
         * @param displayIndex - The index of the display data that is replaced. (If it is not set, replaces the current display data)
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 用特定的显示对象数据替换特定插槽当前的显示对象数据。
         * 用 "dragonBonesName/armatureName/slotName/displayName" 指定显示对象数据。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。
         * @param armatureName - 骨架数据名称。
         * @param slotName - 插槽数据名称。
         * @param displayName - 显示对象数据名称。
         * @param slot - 插槽。
         * @param displayIndex - 被替换的显示对象数据的索引。 （如果未设置，则替换当前的显示对象数据）
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        replaceSlotDisplay(dragonBonesName, armatureName, slotName, displayName, slot, displayIndex = -1) {
            const armatureData = this.getArmatureData(armatureName, dragonBonesName || "");
            if (armatureData === null || armatureData.defaultSkin === null) {
                return false;
            }
            const displayData = armatureData.defaultSkin.getDisplay(slotName, displayName);
            this.replaceDisplay(slot, displayData, displayIndex);
            return true;
        }
        /**
         * @private
         */
        replaceSlotDisplayList(dragonBonesName, armatureName, slotName, slot) {
            const armatureData = this.getArmatureData(armatureName, dragonBonesName || "");
            if (!armatureData || !armatureData.defaultSkin) {
                return false;
            }
            const displayDatas = armatureData.defaultSkin.getDisplays(slotName);
            if (!displayDatas) {
                return false;
            }
            slot.displayFrameCount = displayDatas.length;
            for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                const displayData = displayDatas[i];
                this.replaceDisplay(slot, displayData, i);
            }
            return true;
        }
        /**
         * - Share specific skin data with specific armature.
         * @param armature - The armature.
         * @param skin - The skin data.
         * @param isOverride - Whether it completely override the original skin. (Default: false)
         * @param exclude - A list of slot names that do not need to be replace.
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB && armatureDataB.defaultSkin) {
         *     factory.replaceSkin(armatureA, armatureDataB.defaultSkin, false, ["arm_l", "weapon_l"]);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.SkinData
         * @version DragonBones 5.6
         * @language en_US
         */
        /**
         * - 将特定的皮肤数据共享给特定的骨架使用。
         * @param armature - 骨架。
         * @param skin - 皮肤数据。
         * @param isOverride - 是否完全覆盖原来的皮肤。 （默认: false）
         * @param exclude - 不需要被替换的插槽名称列表。
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB && armatureDataB.defaultSkin) {
         *     factory.replaceSkin(armatureA, armatureDataB.defaultSkin, false, ["arm_l", "weapon_l"]);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.SkinData
         * @version DragonBones 5.6
         * @language zh_CN
         */
        replaceSkin(armature, skin, isOverride = false, exclude = null) {
            let success = false;
            const defaultSkin = skin.parent.defaultSkin;
            for (const slot of armature.getSlots()) {
                if (exclude !== null && exclude.indexOf(slot.name) >= 0) {
                    continue;
                }
                let displayDatas = skin.getDisplays(slot.name);
                if (displayDatas === null) {
                    if (defaultSkin !== null && skin !== defaultSkin) {
                        displayDatas = defaultSkin.getDisplays(slot.name);
                    }
                    if (displayDatas === null) {
                        if (isOverride) {
                            slot.displayFrameCount = 0;
                        }
                        continue;
                    }
                }
                slot.displayFrameCount = displayDatas.length;
                for (let i = 0, l = slot.displayFrameCount; i < l; ++i) {
                    const displayData = displayDatas[i];
                    slot.replaceRawDisplayData(displayData, i);
                    if (displayData !== null) {
                        slot.replaceDisplay(this._getSlotDisplay(null, displayData, slot), i);
                    }
                    else {
                        slot.replaceDisplay(null, i);
                    }
                }
                success = true;
            }
            return success;
        }
        /**
         * - Replaces the existing animation data for a specific armature with the animation data for the specific armature data.
         * This enables you to make a armature template so that other armature without animations can share it's animations.
         * @param armature - The armtaure.
         * @param armatureData - The armature data.
         * @param isOverride - Whether to completely overwrite the original animation. (Default: false)
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB) {
         *     factory.replaceAnimation(armatureA, armatureDataB);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.6
         * @language en_US
         */
        /**
         * - 用特定骨架数据的动画数据替换特定骨架现有的动画数据。
         * 这样就能实现制作一个骨架动画模板，让其他没有制作动画的骨架共享该动画。
         * @param armature - 骨架。
         * @param armatureData - 骨架数据。
         * @param isOverride - 是否完全覆盖原来的动画。（默认: false）
         * @example
         * <pre>
         *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
         *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
         *     if (armatureDataB) {
         *     factory.replaceAnimation(armatureA, armatureDataB);
         *     }
         * </pre>
         * @see dragonBones.Armature
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.6
         * @language zh_CN
         */
        replaceAnimation(armature, armatureData, isOverride = true) {
            const skinData = armatureData.defaultSkin;
            if (skinData === null) {
                return false;
            }
            if (isOverride) {
                armature.animation.animations = armatureData.animations;
            }
            else {
                const rawAnimations = armature.animation.animations;
                const animations = {};
                for (let k in rawAnimations) {
                    animations[k] = rawAnimations[k];
                }
                for (let k in armatureData.animations) {
                    animations[k] = armatureData.animations[k];
                }
                armature.animation.animations = animations;
            }
            for (const slot of armature.getSlots()) {
                let index = 0;
                for (const display of slot.displayList) {
                    if (display instanceof dragonBones.Armature) {
                        const displayDatas = skinData.getDisplays(slot.name);
                        if (displayDatas !== null && index < displayDatas.length) {
                            const displayData = displayDatas[index];
                            if (displayData !== null && displayData.type === 1 /* Armature */) {
                                const childArmatureData = this.getArmatureData(displayData.path, displayData.parent.parent.parent.name);
                                if (childArmatureData) {
                                    this.replaceAnimation(display, childArmatureData, isOverride);
                                }
                            }
                        }
                    }
                    index++;
                }
            }
            return true;
        }
        /**
         * @private
         */
        getAllDragonBonesData() {
            return this._dragonBonesDataMap;
        }
        /**
         * @private
         */
        getAllTextureAtlasData() {
            return this._textureAtlasDataMap;
        }
        /**
         * - An Worldclock instance updated by engine.
         * @version DragonBones 5.7
         * @language en_US
         */
        /**
         * - 由引擎驱动的 WorldClock 实例。
         * @version DragonBones 5.7
         * @language zh_CN
         */
        get clock() {
            return this._dragonBones.clock;
        }
        /**
         * @private
         */
        get dragonBones() {
            return this._dragonBones;
        }
    }
    BaseFactory._objectParser = null;
    BaseFactory._binaryParser = null;
    dragonBones.BaseFactory = BaseFactory;
    /**
     * @private
     */
    class BuildArmaturePackage {
        constructor() {
            this.dataName = "";
            this.textureAtlasName = "";
            this.skin = null;
        }
    }
    dragonBones.BuildArmaturePackage = BuildArmaturePackage;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The PixiJS texture atlas data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - PixiJS 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class PixiTextureAtlasData extends dragonBones.TextureAtlasData {
        constructor() {
            super(...arguments);
            this._renderTexture = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.PixiTextureAtlasData]";
        }
        _onClear() {
            super._onClear();
            if (this._renderTexture !== null) {
                // this._renderTexture.dispose();
            }
            this._renderTexture = null;
        }
        /**
         * @inheritDoc
         */
        createTexture() {
            return dragonBones.BaseObject.borrowObject(PixiTextureData);
        }
        /**
         * - The PixiJS texture.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - PixiJS 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        get renderTexture() {
            return this._renderTexture;
        }
        set renderTexture(value) {
            if (this._renderTexture === value) {
                return;
            }
            this._renderTexture = value;
            if (this._renderTexture !== null) {
                for (let k in this.textures) {
                    const textureData = this.textures[k];
                    textureData.renderTexture = new PIXI.Texture(this._renderTexture, new PIXI.Rectangle(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height), new PIXI.Rectangle(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height), new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height), textureData.rotated // .d.ts bug
                    );
                }
            }
            else {
                for (let k in this.textures) {
                    const textureData = this.textures[k];
                    textureData.renderTexture = null;
                }
            }
        }
    }
    dragonBones.PixiTextureAtlasData = PixiTextureAtlasData;
    /**
     * @internal
     */
    class PixiTextureData extends dragonBones.TextureData {
        constructor() {
            super(...arguments);
            this.renderTexture = null; // Initial value.
        }
        static toString() {
            return "[class dragonBones.PixiTextureData]";
        }
        _onClear() {
            super._onClear();
            if (this.renderTexture !== null) {
                this.renderTexture.destroy(false);
            }
            this.renderTexture = null;
        }
    }
    dragonBones.PixiTextureData = PixiTextureData;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * @inheritDoc
     */
    class PixiArmatureDisplay extends PIXI.Sprite {
        constructor() {
            super(...arguments);
            /**
             * @private
             */
            this.debugDraw = false;
            this._debugDraw = false;
            // private _disposeProxy: boolean = false;
            this._armature = null;
            this._debugDrawer = null;
            this.pixiApp = null;
        }
        /**
         * @inheritDoc
         */
        dbInit(armature) {
            this._armature = armature;
        }
        /**
         * @inheritDoc
         */
        dbClear() {
            if (this._debugDrawer !== null) {
                this._debugDrawer.destroy(true);
            }
            this._armature = null;
            this._debugDrawer = null;
            super.destroy();
        }
        /**
         * @inheritDoc
         */
        dbUpdate() {
            const drawed = dragonBones.DragonBones.debugDraw || this.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
                if (this._debugDraw) {
                    if (this._debugDrawer === null) {
                        this._debugDrawer = new PIXI.Sprite();
                        const boneDrawer = new PIXI.Graphics();
                        this._debugDrawer.addChild(boneDrawer);
                    }
                    this.addChild(this._debugDrawer);
                    const boneDrawer = this._debugDrawer.getChildAt(0);
                    boneDrawer.clear();
                    const bones = this._armature.getBones();
                    for (let i = 0, l = bones.length; i < l; ++i) {
                        const bone = bones[i];
                        const boneLength = bone.boneData.length;
                        const startX = bone.globalTransformMatrix.tx;
                        const startY = bone.globalTransformMatrix.ty;
                        const endX = startX + bone.globalTransformMatrix.a * boneLength;
                        const endY = startY + bone.globalTransformMatrix.b * boneLength;
                        boneDrawer.lineStyle(2.0, 0x00FFFF, 0.7);
                        boneDrawer.moveTo(startX, startY);
                        boneDrawer.lineTo(endX, endY);
                        boneDrawer.lineStyle(0.0, 0, 0.0);
                        boneDrawer.beginFill(0x00FFFF, 0.7);
                        boneDrawer.drawCircle(startX, startY, 3.0);
                        boneDrawer.endFill();
                    }
                    const slots = this._armature.getSlots();
                    for (let i = 0, l = slots.length; i < l; ++i) {
                        const slot = slots[i];
                        const boundingBoxData = slot.boundingBoxData;
                        if (boundingBoxData) {
                            let child = this._debugDrawer.getChildByName(slot.name);
                            if (!child) {
                                child = new PIXI.Graphics();
                                child.name = slot.name;
                                this._debugDrawer.addChild(child);
                            }
                            child.clear();
                            child.lineStyle(2.0, 0xFF00FF, 0.7);
                            switch (boundingBoxData.type) {
                                case 0 /* Rectangle */:
                                    child.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;
                                case 1 /* Ellipse */:
                                    child.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;
                                case 2 /* Polygon */:
                                    const vertices = boundingBoxData.vertices;
                                    for (let i = 0, l = vertices.length; i < l; i += 2) {
                                        const x = vertices[i];
                                        const y = vertices[i + 1];
                                        if (i === 0) {
                                            child.moveTo(x, y);
                                        }
                                        else {
                                            child.lineTo(x, y);
                                        }
                                    }
                                    child.lineTo(vertices[0], vertices[1]);
                                    break;
                                default:
                                    break;
                            }
                            child.endFill();
                            slot.updateTransformAndMatrix();
                            slot.updateGlobalTransform();
                            const transform = slot.global;
                            child.setTransform(transform.x, transform.y, transform.scaleX, transform.scaleY, transform.rotation, transform.skew, 0.0, slot._pivotX, slot._pivotY);
                        }
                        else {
                            const child = this._debugDrawer.getChildByName(slot.name);
                            if (child) {
                                this._debugDrawer.removeChild(child);
                            }
                        }
                    }
                    const pathConstraints = this._armature.getPathConstraints();
                    if (pathConstraints) {
                        for (let i = 0, len = pathConstraints.length; i < len; i++) {
                            const pathConstraint = pathConstraints[i];
                            const pathData = pathConstraint._pathSlot._displayFrame.rawDisplayData;
                            let child = this._debugDrawer.getChildByName(pathConstraint.name);
                            if (!child) {
                                child = new PIXI.Graphics();
                                child.name = pathConstraint.name;
                                this._debugDrawer.addChild(child);
                            }
                            child.clear();
                            child.lineStyle(2.0, 0x00FF00, 0.7);
                            const vertices = pathConstraint._pathGlobalVertices;
                            if (vertices) {
                                for (let j = 0, jlen = vertices.length; j < jlen; j += 6) {
                                    if (j === 0) {
                                        child.moveTo(vertices[j + 2], vertices[j + 3]);
                                    }
                                    else {
                                        const prevP = (j - 6);
                                        child.bezierCurveTo(vertices[prevP + 4], vertices[prevP + 5], vertices[j + 0], vertices[j + 1], vertices[j + 2], vertices[j + 3]);
                                    }
                                }
                                if (pathData.closed) {
                                    child.bezierCurveTo(vertices[vertices.length - 2], vertices[vertices.length - 1], vertices[0], vertices[1], vertices[2], vertices[3]);
                                }
                            }
                        }
                    }
                }
                else if (this._debugDrawer !== null && this._debugDrawer.parent === this) {
                    this.removeChild(this._debugDrawer);
                }
            }
        }
        /**
         * @inheritDoc
         */
        dispose(disposeProxy = true) {
            // tslint:disable-next-line:no-unused-expression
            disposeProxy;
            if (this._armature !== null) {
                this._armature.dispose();
                this._armature = null;
            }
        }
        /**
         * @inheritDoc
         */
        destroy() {
            this.dispose();
        }
        /**
         * @private
         */
        dispatchDBEvent(type, eventObject) {
            this.emit(type, eventObject);
        }
        /**
         * @inheritDoc
         */
        hasDBEventListener(type) {
            return this.listeners(type, true); // .d.ts bug
        }
        /**
         * @inheritDoc
         */
        addDBEventListener(type, listener, target) {
            this.addListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        removeDBEventListener(type, listener, target) {
            this.removeListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        get armature() {
            return this._armature;
        }
        /**
         * @inheritDoc
         */
        get animation() {
            return this._armature.animation;
        }
    }
    dragonBones.PixiArmatureDisplay = PixiArmatureDisplay;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The PixiJS slot.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - PixiJS 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class PixiSlot extends dragonBones.Slot {
        static toString() {
            return "[class dragonBones.PixiSlot]";
        }
        _onClear() {
            super._onClear();
            this._textureScale = 1.0;
            this._renderDisplay = null;
            this._updateTransform = PIXI.VERSION[0] === "3" ? this._updateTransformV3 : this._updateTransformV4;
        }
        _initDisplay(value, isRetain) {
            // tslint:disable-next-line:no-unused-expression
            value;
            // tslint:disable-next-line:no-unused-expression
            isRetain;
        }
        _disposeDisplay(value, isRelease) {
            // tslint:disable-next-line:no-unused-expression
            value;
            if (!isRelease) {
                value.destroy();
            }
        }
        _onUpdateDisplay() {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay);
        }
        _addDisplay() {
            const container = this._armature.display;
            container.addChild(this._renderDisplay);
        }
        _replaceDisplay(value) {
            const container = this._armature.display;
            const prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
            this._textureScale = 1.0;
        }
        _removeDisplay() {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        }
        _updateZOrder() {
            const container = this._armature.display;
            const index = container.getChildIndex(this._renderDisplay);
            if (index === this._zOrder) {
                return;
            }
            container.addChildAt(this._renderDisplay, this._zOrder);
        }
        /**
         * @internal
         */
        _updateVisible() {
            this._renderDisplay.visible = this._parent.visible && this._visible;
        }
        _updateBlendMode() {
            if (this._renderDisplay instanceof PIXI.Sprite) {
                switch (this._blendMode) {
                    case 0 /* Normal */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.NORMAL;
                        break;
                    case 1 /* Add */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.ADD;
                        break;
                    case 3 /* Darken */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.DARKEN;
                        break;
                    case 4 /* Difference */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.DIFFERENCE;
                        break;
                    case 6 /* HardLight */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
                        break;
                    case 9 /* Lighten */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.LIGHTEN;
                        break;
                    case 10 /* Multiply */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.MULTIPLY;
                        break;
                    case 11 /* Overlay */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.OVERLAY;
                        break;
                    case 12 /* Screen */:
                        this._renderDisplay.blendMode = PIXI.BLEND_MODES.SCREEN;
                        break;
                    default:
                        break;
                }
            }
            // TODO child armature.
        }
        _updateColor() {
            const alpha = this._colorTransform.alphaMultiplier * this._globalAlpha;
            this._renderDisplay.alpha = alpha;
            if (this._renderDisplay instanceof PIXI.Sprite || this._renderDisplay instanceof PIXI.SimpleMesh) {
                const color = (Math.round(this._colorTransform.redMultiplier * 0xFF) << 16) + (Math.round(this._colorTransform.greenMultiplier * 0xFF) << 8) + Math.round(this._colorTransform.blueMultiplier * 0xFF);
                this._renderDisplay.tint = color;
            }
            // TODO child armature.
        }
        _updateFrame() {
            let currentTextureData = this._textureData;
            if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
                let currentTextureAtlasData = currentTextureData.parent;
                if (this._armature.replacedTexture !== null) { // Update replaced texture atlas.
                    if (this._armature._replaceTextureAtlasData === null) {
                        currentTextureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PixiTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    else {
                        currentTextureAtlasData = this._armature._replaceTextureAtlasData;
                    }
                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);
                }
                const renderTexture = currentTextureData.renderTexture;
                if (renderTexture !== null) {
                    if (this._geometryData !== null) { // Mesh.
                        const data = this._geometryData.data;
                        const intArray = data.intArray;
                        const floatArray = data.floatArray;
                        const vertexCount = intArray[this._geometryData.offset + 0 /* GeometryVertexCount */];
                        const triangleCount = intArray[this._geometryData.offset + 1 /* GeometryTriangleCount */];
                        let vertexOffset = intArray[this._geometryData.offset + 2 /* GeometryFloatOffset */];
                        if (vertexOffset < 0) {
                            vertexOffset += 65536; // Fixed out of bouds bug.
                        }
                        const uvOffset = vertexOffset + vertexCount * 2;
                        const scale = this._armature._armatureData.scale;
                        const meshDisplay = this._renderDisplay;
                        const vertices = new Float32Array(vertexCount * 2);
                        const uvs = new Float32Array(vertexCount * 2);
                        const indices = new Uint16Array(triangleCount * 3);
                        for (let i = 0, l = vertexCount * 2; i < l; ++i) {
                            vertices[i] = floatArray[vertexOffset + i] * scale;
                        }
                        for (let i = 0; i < triangleCount * 3; ++i) {
                            indices[i] = intArray[this._geometryData.offset + 4 /* GeometryVertexIndices */ + i];
                        }
                        for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                            const u = floatArray[uvOffset + i];
                            const v = floatArray[uvOffset + i + 1];
                            if (currentTextureData.rotated) {
                                uvs[i] = 1 - v;
                                uvs[i + 1] = u;
                            }
                            else {
                                uvs[i] = u;
                                uvs[i + 1] = v;
                            }
                        }
                        this._textureScale = 1.0;
                        meshDisplay.texture = renderTexture;
                        meshDisplay.vertices = vertices;
                        meshDisplay.uvBuffer.update(uvs);
                        meshDisplay.geometry.addIndex(indices);
                        const isSkinned = this._geometryData.weight !== null;
                        const isSurface = this._parent._boneData.type !== 0 /* Bone */;
                        if (isSkinned || isSurface) {
                            this._identityTransform();
                        }
                    }
                    else {
                        // Normal texture.
                        this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                        const normalDisplay = this._renderDisplay;
                        normalDisplay.texture = renderTexture;
                        if (this._mask) {
                            // pixi 的遮罩效果比较奇怪，详情见 https://ithelp.ithome.com.tw/articles/10191374
                            // 为了让遮罩效果统一，这里统一处理成灰阶
                            const colorMatrix = new PIXI.filters.ColorMatrixFilter();
                            colorMatrix.matrix = [
                                1, 0, 0, 0, 1,
                                0, 1, 0, 0, 1,
                                0, 0, 1, 0, 1,
                                0, 0, 0, 1, 0
                            ];
                            normalDisplay.filters = [colorMatrix];
                            const container = this._armature.display;
                            if (container && container.pixiApp) {
                                const texture = container.pixiApp.renderer.generateTexture(normalDisplay);
                                normalDisplay.texture = texture;
                                normalDisplay.filters = [];
                            }
                            if (this._maskRange > 0) {
                                this._updateMask();
                            }
                        }
                    }
                    this._visibleDirty = true;
                    return;
                }
            }
            if (this._geometryData !== null) {
                const meshDisplay = this._renderDisplay;
                // meshDisplay.texture = null as any;
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
                meshDisplay.visible = false;
            }
            else {
                const normalDisplay = this._renderDisplay;
                // normalDisplay.texture = null as any;
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
                normalDisplay.visible = false;
            }
        }
        _updateMesh() {
            const scale = this._armature._armatureData.scale;
            const deformVertices = this._displayFrame.deformVertices;
            const bones = this._geometryBones;
            const geometryData = this._geometryData;
            const weightData = geometryData.weight;
            const hasDeform = deformVertices.length > 0 && geometryData.inheritDeform;
            const meshDisplay = this._renderDisplay;
            if (weightData !== null) {
                const data = geometryData.data;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[geometryData.offset + 0 /* GeometryVertexCount */];
                let weightFloatOffset = intArray[weightData.offset + 1 /* WeigthFloatOffset */];
                if (weightFloatOffset < 0) {
                    weightFloatOffset += 65536; // Fixed out of bouds bug. 
                }
                for (let i = 0, iD = 0, iB = weightData.offset + 2 /* WeigthBoneIndices */ + bones.length, iV = weightFloatOffset, iF = 0; i < vertexCount; ++i) {
                    const boneCount = intArray[iB++];
                    let xG = 0.0, yG = 0.0;
                    for (let j = 0; j < boneCount; ++j) {
                        const boneIndex = intArray[iB++];
                        const bone = bones[boneIndex];
                        if (bone !== null) {
                            const matrix = bone.globalTransformMatrix;
                            const weight = floatArray[iV++];
                            let xL = floatArray[iV++] * scale;
                            let yL = floatArray[iV++] * scale;
                            if (hasDeform) {
                                xL += deformVertices[iF++];
                                yL += deformVertices[iF++];
                            }
                            xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                            yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        }
                    }
                    meshDisplay.vertices[iD++] = xG;
                    meshDisplay.vertices[iD++] = yG;
                }
            }
            else {
                const isSurface = this._parent._boneData.type !== 0 /* Bone */;
                const data = geometryData.data;
                const intArray = data.intArray;
                const floatArray = data.floatArray;
                const vertexCount = intArray[geometryData.offset + 0 /* GeometryVertexCount */];
                let vertexOffset = intArray[geometryData.offset + 2 /* GeometryFloatOffset */];
                if (vertexOffset < 0) {
                    vertexOffset += 65536; // Fixed out of bouds bug. 
                }
                for (let i = 0, l = vertexCount * 2; i < l; i += 2) {
                    let x = floatArray[vertexOffset + i] * scale;
                    let y = floatArray[vertexOffset + i + 1] * scale;
                    if (hasDeform) {
                        x += deformVertices[i];
                        y += deformVertices[i + 1];
                    }
                    if (isSurface) {
                        const matrix = this._parent._getGlobalTransformMatrix(x, y);
                        meshDisplay.vertices[i] = matrix.a * x + matrix.c * y + matrix.tx;
                        meshDisplay.vertices[i + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                    }
                    else {
                        meshDisplay.vertices[i] = x;
                        meshDisplay.vertices[i + 1] = y;
                    }
                }
            }
        }
        _updateShape() {
            const scale = this._armature._armatureData.scale;
            const shapeData = this._shapeData;
            const shapeDisplay = this._renderDisplay;
            shapeDisplay.clear();
            const shapeVertices = this._displayFrame.shapeVertices;
            const hasMorph = shapeVertices && shapeVertices.length > 0;
            const pointValueCount = 6;
            for (let i = 0, len = shapeData.paths.length; i < len; i++) {
                const path = shapeData.paths[i];
                const { indexes, style } = path;
                const { fill, stroke } = style;
                if (indexes.length === 0) {
                    continue;
                }
                if (stroke) {
                    shapeDisplay.lineStyle(stroke.width || 1, stroke.color || 0, stroke.opacity || 0);
                }
                else {
                    shapeDisplay.lineStyle(0, 0, 0);
                }
                if (fill) {
                    shapeDisplay.beginFill(fill.color, fill.opacity);
                }
                for (let j = 0, jLen = indexes.length; j < jLen; j++) {
                    const pointIndex = indexes[j] * pointValueCount;
                    // TODO: 数据存到floatArray里面
                    let x = shapeData.vertices[pointIndex + 0] * scale;
                    let y = shapeData.vertices[pointIndex + 1] * scale;
                    let c0x = shapeData.vertices[pointIndex + 2] * scale;
                    let c0y = shapeData.vertices[pointIndex + 3] * scale;
                    if (hasMorph) {
                        const morphIndex = pointIndex;
                        x += shapeVertices[morphIndex];
                        y += shapeVertices[morphIndex + 1];
                        c0x += shapeVertices[morphIndex + 2];
                        c0y += shapeVertices[morphIndex + 3];
                        ;
                    }
                    if (j === 0) {
                        shapeDisplay.moveTo(x, y);
                    }
                    else {
                        const prevPointIndex = indexes[j - 1] * pointValueCount;
                        let prevC1x = shapeData.vertices[prevPointIndex + 4] * scale;
                        let prevC1y = shapeData.vertices[prevPointIndex + 5] * scale;
                        if (hasMorph) {
                            const morphIndex = prevPointIndex;
                            prevC1x += shapeVertices[morphIndex + 4];
                            prevC1y += shapeVertices[morphIndex + 5];
                        }
                        shapeDisplay.bezierCurveTo(prevC1x, prevC1y, c0x, c0y, x, y);
                    }
                }
                if (fill) {
                    shapeDisplay.endFill();
                }
            }
            this._updateMask();
        }
        _updateMask() {
            if (this._mask && this._maskRange > 0) {
                const container = this._armature.display;
                // clear mask
                const length = container.children.length;
                for (let i = 0; i < length; i++) {
                    const child = container.getChildAt(i);
                    if (child.mask === this._renderDisplay) {
                        child.mask = null;
                    }
                }
                // set mask
                const index = container.getChildIndex(this._renderDisplay);
                for (let i = 0; i < this._maskRange; i++) {
                    let maskIndex = index + i + 1;
                    if (maskIndex < length) {
                        const child = container.getChildAt(maskIndex);
                        if (child) {
                            child.mask = this._renderDisplay;
                        }
                    }
                }
            }
        }
        _updateTransform() {
            throw new Error();
        }
        _updateTransformV3() {
            this.updateGlobalTransform(); // Update transform.
            const transform = this.global;
            if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                this._renderDisplay.setTransform(x, y, transform.scaleX * this._textureScale, transform.scaleY * this._textureScale, transform.rotation, transform.skew, 0.0);
            }
            else {
                this._renderDisplay.position.set(transform.x, transform.y);
                this._renderDisplay.rotation = transform.rotation;
                this._renderDisplay.skew.set(transform.skew, 0.0);
                this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
            }
        }
        _updateTransformV4() {
            this.updateGlobalTransform(); // Update transform.
            const transform = this.global;
            if (this._renderDisplay === this._rawDisplay || this._renderDisplay === this._meshDisplay) {
                const x = transform.x - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                const y = transform.y - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                this._renderDisplay.setTransform(x, y, transform.scaleX * this._textureScale, transform.scaleY * this._textureScale, transform.rotation, -transform.skew, 0.0);
            }
            else {
                this._renderDisplay.position.set(transform.x, transform.y);
                this._renderDisplay.rotation = transform.rotation;
                this._renderDisplay.skew.set(-transform.skew, 0.0);
                this._renderDisplay.scale.set(transform.scaleX, transform.scaleY);
            }
        }
        _identityTransform() {
            this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0);
        }
    }
    dragonBones.PixiSlot = PixiSlot;
})(dragonBones || (dragonBones = {}));
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
var dragonBones;
(function (dragonBones) {
    /**
     * - The PixiJS factory.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - PixiJS 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class PixiFactory extends dragonBones.BaseFactory {
        /**
         * @inheritDoc
         */
        constructor(dataParser = null) {
            super(dataParser);
            this._app = null;
            if (PixiFactory._dragonBonesInstance === null) {
                PIXI.Assets.loader.parsers.push(new PixiDBBinParser());
                const eventManager = new dragonBones.PixiArmatureDisplay();
                PixiFactory._dragonBonesInstance = new dragonBones.DragonBones(eventManager);
                PIXI.Ticker.shared.add(PixiFactory._clockHandler, PixiFactory);
            }
            this._dragonBones = PixiFactory._dragonBonesInstance;
        }
        static _clockHandler(passedTime) {
            this._dragonBonesInstance.advanceTime(PIXI.Ticker.shared.elapsedMS * passedTime * 0.001);
        }
        /**
         * - A global factory instance that can be used directly.
         * @version DragonBones 4.7
         * @language en_US
         */
        /**
         * - 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        static get factory() {
            if (PixiFactory._factory === null) {
                PixiFactory._factory = new PixiFactory();
            }
            return PixiFactory._factory;
        }
        _buildTextureAtlasData(textureAtlasData, textureAtlas) {
            if (textureAtlasData) {
                textureAtlasData.renderTexture = textureAtlas;
            }
            else {
                textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PixiTextureAtlasData);
            }
            return textureAtlasData;
        }
        _buildArmature(dataPackage) {
            const armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            const armatureDisplay = new dragonBones.PixiArmatureDisplay();
            armatureDisplay.pixiApp = this._app;
            armature.init(dataPackage.armature, armatureDisplay, armatureDisplay, this._dragonBones);
            return armature;
        }
        _buildSlot(_dataPackage, slotData, armature) {
            const slot = dragonBones.BaseObject.borrowObject(dragonBones.PixiSlot);
            slot.init(slotData, armature, new PIXI.Sprite(), new PIXI.SimpleMesh(), new PIXI.Graphics());
            return slot;
        }
        /**
         * - Create a armature from cached DragonBonesData instances and TextureAtlasData instances, then use the {@link #clock} to update it.
         * The difference is that the armature created by {@link #buildArmature} is not WorldClock instance update.
         * @param armatureName - The armature data name.
         * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
         * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
         * @returns The armature display container.
         * @see dragonBones.IArmatureProxy
         * @see dragonBones.BaseFactory#buildArmature
         * @version DragonBones 4.5
         * @example
         * <pre>
         *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
         * </pre>
         * @language en_US
         */
        /**
         * - 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架，并用 {@link #clock} 更新该骨架。
         * 区别在于由 {@link #buildArmature} 创建的骨架没有 WorldClock 实例驱动。
         * @param armatureName - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
         * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。 （如果未设置，则使用默认的皮肤数据）
         * @returns 骨架的显示容器。
         * @see dragonBones.IArmatureProxy
         * @see dragonBones.BaseFactory#buildArmature
         * @version DragonBones 4.5
         * @example
         * <pre>
         *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
         * </pre>
         * @language zh_CN
         */
        buildArmatureDisplay(armatureName, dragonBonesName = "", skinName = "", textureAtlasName = "") {
            const armature = this.buildArmature(armatureName, dragonBonesName || "", skinName || "", textureAtlasName || "");
            if (armature !== null) {
                this._dragonBones.clock.add(armature);
                return armature.display;
            }
            return null;
        }
        /**
         * - Create the display object with the specified texture.
         * @param textureName - The texture data name.
         * @param textureAtlasName - The texture atlas data name (Of not set, all texture atlas data will be searched)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建带有指定贴图的显示对象。
         * @param textureName - 贴图数据名称。
         * @param textureAtlasName - 贴图集数据名称。 （如果未设置，将检索所有的贴图集数据）
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getTextureDisplay(textureName, textureAtlasName = null) {
            const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : "", textureName);
            if (textureData !== null && textureData.renderTexture !== null) {
                return new PIXI.Sprite(textureData.renderTexture);
            }
            return null;
        }
        /**
         * - A global sound event manager.
         * Sound events can be listened to uniformly from the manager.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 全局声音事件管理器。
         * 声音事件可以从该管理器统一侦听。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        get soundEventManager() {
            return this._dragonBones.eventManager;
        }
        set pixiApp(app) {
            this._app = app;
        }
    }
    PixiFactory._dragonBonesInstance = null;
    PixiFactory._factory = null;
    dragonBones.PixiFactory = PixiFactory;
})(dragonBones || (dragonBones = {}));
class PixiDBBinParser {
    constructor() {
        this.extension = {
            type: 'dbbin-loader',
            priority: 0,
        };
    }
    test(url) {
        console.log('skk test', url, url.endsWith('.dbbin'));
        return url.endsWith('.dbbin');
    }
    load(url) {
        return fetch(url).then(response => response.arrayBuffer());
    }
    parse(asset) {
        return new DataView(asset);
    }
}
//# sourceMappingURL=dragonBones.js.map