/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2025 DragonBones team and other contributors
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
    export class WorldClock implements IAnimatable {
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
        public time: number = 0.0;
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
        public timeScale: number = 1.0;

        private _systemTime: number = 0.0;
        private readonly _animatebles: Array<IAnimatable | null> = [];
        private _clock: WorldClock | null = null;
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
        public constructor(time: number = 0.0) {
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
        public advanceTime(passedTime: number): void {
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
        public contains(value: IAnimatable): boolean {
            if (value === this) {
                return false;
            }

            let ancestor: IAnimatable | null = value;
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
        public add(value: IAnimatable): void {
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
        public remove(value: IAnimatable): void {
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
        public clear(): void {
            for (const animatable of this._animatebles) {
                if (animatable !== null) {
                    animatable.clock = null;
                }
            }
        }
        /**
         * @inheritDoc
         */
        public get clock(): WorldClock | null {
            return this._clock;
        }
        public set clock(value: WorldClock | null) {
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
}
