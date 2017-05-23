namespace dragonBones {
    /**
     * @language zh_CN
     * WorldClock 提供时钟支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    export class WorldClock implements IAnimateble {
        private static _clock: WorldClock = null;
        /**
         * @language zh_CN
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 3.0
         */
        public static get clock(): WorldClock {
            if (!WorldClock._clock) {
                WorldClock._clock = new WorldClock();
            }

            return WorldClock._clock;
        }
        /**
         * @language zh_CN
         * 当前时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public time: number = new Date().getTime() / DragonBones.SECOND_TO_MILLISECOND;
        /**
         * @language zh_CN
         * 时间流逝速度，用于控制动画变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        public timeScale: number = 1.0;

        private _animatebles: Array<IAnimateble> = [];
        private _clock: WorldClock = null;
        /**
         * @language zh_CN
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 实例可以更灵活的为需要更新的 IAnimateble 实例分组，用于控制不同组不同的播放速度)
         * @version DragonBones 3.0
         */
        public constructor() {
        }
        /**
         * @language zh_CN
         * 为所有的 IAnimatable 实例更新时间。
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         */
        public advanceTime(passedTime: number): void {
            if (passedTime !== passedTime) {
                passedTime = 0.0;
            }

            if (passedTime < 0.0) {
                passedTime = new Date().getTime() / DragonBones.SECOND_TO_MILLISECOND - this.time;
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

            if (passedTime) {
                let i = 0, r = 0, l = this._animatebles.length;
                for (; i < l; ++i) {
                    const animateble = this._animatebles[i];
                    if (animateble) {
                        if (r > 0) {
                            this._animatebles[i - r] = animateble;
                            this._animatebles[i] = null;
                        }

                        animateble.advanceTime(passedTime);
                    }
                    else {
                        r++;
                    }
                }

                if (r > 0) {
                    l = this._animatebles.length;
                    for (; i < l; ++i) {
                        const animateble = this._animatebles[i];
                        if (animateble) {
                            this._animatebles[i - r] = animateble;
                        }
                        else {
                            r++;
                        }
                    }

                    this._animatebles.length -= r;
                }
            }
        }
        /** 
         * 是否包含 IAnimatable 实例
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        public contains(value: IAnimateble): boolean {
            return this._animatebles.indexOf(value) >= 0;
        }
        /**
         * @language zh_CN
         * 添加 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        public add(value: IAnimateble): void {
            if (value && this._animatebles.indexOf(value) < 0) {
                this._animatebles.push(value);
                value.clock = this;

                if (DragonBones.debug && value instanceof Armature) {
                    DragonBones.addArmature(value);
                }
            }
        }
        /**
         * @language zh_CN
         * 移除 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        public remove(value: IAnimateble): void {
            let index = this._animatebles.indexOf(value);
            if (index >= 0) {
                this._animatebles[index] = null;
                value.clock = null;

                if (DragonBones.debug && value instanceof Armature) {
                    DragonBones.removeArmature(value);
                }
            }
        }
        /**
         * @language zh_CN
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         */
        public clear(): void {
            for (let i = 0, l = this._animatebles.length; i < l; ++i) {
                let animateble = this._animatebles[i];
                this._animatebles[i] = null;
                if (animateble != null) {
                    animateble.clock = null;
                }
            }
        }
        /**
         * @inheritDoc
         */
        public get clock(): WorldClock {
            return this._clock;
        }
        public set clock(value: WorldClock) {
            if (this._clock === value) {
                return;
            }

            const prevClock = this._clock;
            if (prevClock) {
                prevClock.remove(this);
            }

            this._clock = value;
            if (this._clock) {
                this._clock.add(this);
            }
        }
    }
}