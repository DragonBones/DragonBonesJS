namespace dragonBones {
    /**
     *
     */
    export class WorldClock implements IAnimateble {
        private static _clock: WorldClock = null;
        public static get clock(): WorldClock {
            if (!WorldClock._clock) {
                WorldClock._clock = new WorldClock();
            }
            
            return WorldClock._clock;
        }

        public time: number = new Date().getTime() / DragonBones.SECOND_TO_MILLISECOND;
        public timeScale: number = 1;
        private _animatebles: Array<IAnimateble> = [];
        public constructor() {
        }
        /**
         *
         */
        public advanceTime(passedTime: number): void {
            if (passedTime != passedTime) {
                passedTime = 0;
            }

            if (passedTime < 0) {
                passedTime = new Date().getTime() / DragonBones.SECOND_TO_MILLISECOND - this.time;
            }

            passedTime *= this.timeScale;

            if (passedTime < 0) {
                this.time -= passedTime;
            } else {
                this.time += passedTime;
            }

            if (passedTime) {
                let i = 0, r = 0, l = this._animatebles.length;
                for (; i < l; ++i) {
                    const animateble = this._animatebles[i];
                    if (animateble) {
                        animateble.advanceTime(passedTime);

                        if (r > 0) {
                            this._animatebles[i - r] = animateble;
                        }
                    } else {
                        r++;
                    }
                }

                if (r > 0) {
                    l = this._animatebles.length;

                    for (; i < l; ++i) {
                        const animateble = this._animatebles[i];
                        if (animateble) {
                            this._animatebles[i - r] = animateble;
                        } else {
                            r++;
                        }
                    }

                    this._animatebles.length -= r;
                }
            }
        }
        /**
         *
         */
        public contains(value: IAnimateble): boolean {
            return this._animatebles.indexOf(value) >= 0;
        }
        /**
         * @language zh_CN
         * 添加指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        public add(value: IAnimateble): void {
            if (value && this._animatebles.indexOf(value) < 0) {
                this._animatebles.push(value);
            }
        }
        /**
         * @language zh_CN
         * 移除指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        public remove(value: IAnimateble): void {
            let index = this._animatebles.indexOf(value);
            if (index >= 0) {
                this._animatebles[index] = null;
            }
        }
        /**
         *
         */
        public clear(): void {
            for (let i = 0, l = this._animatebles.length; i < l; ++i) {
                this._animatebles[i] = null;
            }
        }
    }
}