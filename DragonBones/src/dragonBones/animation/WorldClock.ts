namespace dragonBones {
    /**
     * WorldClock 提供时钟支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class WorldClock implements IAnimatable {
        /**
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public static readonly clock: WorldClock = new WorldClock();
        /**
         * 当前时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public time: number = 0.0;
        /**
         * 时间流逝速度，用于控制动画变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public timeScale: number = 1.0;
        private readonly _animatebles: Array<IAnimatable | null> = [];
        private _clock: WorldClock | null = null;
        /**
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 实例可以更灵活的为需要更新的 IAnimateble 实例分组，用于控制不同组不同的播放速度)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public constructor(time: number = -1.0) {
            if (time < 0.0) {
                this.time = new Date().getTime() * 0.001;
            }
            else {
                this.time = time;
            }
        }
        /**
         * 为所有的 IAnimatable 实例更新时间。
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public advanceTime(passedTime: number): void {
            if (passedTime !== passedTime) { // isNaN
                passedTime = 0.0;
            }

            if (passedTime < 0.0) {
                passedTime = new Date().getTime() * 0.001 - this.time;
            }

            if (this.timeScale !== 1.0) {
                passedTime *= this.timeScale;
            }

            if (passedTime < 0.0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }

            if (passedTime === 0.0) {
                return;
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
         * 是否包含 IAnimatable 实例
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public contains(value: IAnimatable): boolean {
            return this._animatebles.indexOf(value) >= 0;
        }
        /**
         * 添加 IAnimatable 实例。
         * @param value IAnimatable 实例。
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
         * 移除 IAnimatable 实例。
         * @param value IAnimatable 实例。
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
         * 清除所有的 IAnimatable 实例。
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