namespace dragonBones {
    /**
     * 动画配置，描述播放一个动画所需要的全部信息。
     * @see dragonBones.AnimationState
     * @version DragonBones 5.0
     * @beta
     * @language zh_CN
     */
    export class AnimationConfig extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.AnimationConfig]";
        }
        /**
         * 是否暂停淡出的动画。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public pauseFadeOut: boolean;
        /**
         * 淡出模式。
         * @default dragonBones.AnimationFadeOutMode.All
         * @see dragonBones.AnimationFadeOutMode
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public fadeOutMode: AnimationFadeOutMode;
        /**
         * 淡出缓动方式。
         * @default TweenType.Line
         * @see dragonBones.TweenType
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public fadeOutTweenType: TweenType;
        /**
         * 淡出时间。 [-1: 与淡入时间同步, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public fadeOutTime: number;

        /**
         * 否能触发行为。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public actionEnabled: boolean;
        /**
         * 是否以增加的方式混合。
         * @default false
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public additiveBlending: boolean;
        /**
         * 是否对插槽的显示对象有控制权。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public displayControl: boolean;
        /**
         * 是否暂停淡入的动画，直到淡入过程结束。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public pauseFadeIn: boolean;
        /**
         * 是否将没有动画的对象重置为初始值。
         * @default true
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public resetToPose: boolean;
        /**
         * 淡入缓动方式。
         * @default TweenType.Line
         * @see dragonBones.TweenType
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public fadeInTweenType: TweenType;
        /**
         * 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public playTimes: number;
        /**
         * 混合图层，图层高会优先获取混合权重。
         * @default 0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public layer: number;
        /**
         * 开始时间。 (以秒为单位)
         * @default 0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public position: number;
        /**
         * 持续时间。 [-1: 使用动画数据默认值, 0: 动画停止, (0~N]: 持续时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public duration: number;
        /**
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public timeScale: number;
        /**
         * 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public fadeInTime: number;
        /**
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public autoFadeOutTime: number;
        /**
         * 混合权重。
         * @default 1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public weight: number;
        /**
         * 动画状态名。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public name: string;
        /**
         * 动画数据名。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public animation: string;
        /**
         * 混合组，用于动画状态编组，方便控制淡出。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public group: string;
        /**
         * 骨骼遮罩。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public readonly boneMask: Array<string> = [];
        /**
         * @private
         */
        protected _onClear(): void {
            this.pauseFadeOut = true;
            this.fadeOutMode = AnimationFadeOutMode.All;
            this.fadeOutTweenType = TweenType.Line;
            this.fadeOutTime = -1.0;

            this.actionEnabled = true;
            this.additiveBlending = false;
            this.displayControl = true;
            this.pauseFadeIn = true;
            this.resetToPose = true;
            this.fadeInTweenType = TweenType.Line;
            this.playTimes = -1;
            this.layer = 0;
            this.position = 0.0;
            this.duration = -1.0;
            this.timeScale = -100.0;
            this.fadeInTime = -1.0;
            this.autoFadeOutTime = -1.0;
            this.weight = 1.0;
            this.name = "";
            this.animation = "";
            this.group = "";
            this.boneMask.length = 0;
        }

        public clear(): void {
            this._onClear();
        }

        public copyFrom(value: AnimationConfig): void {
            this.pauseFadeOut = value.pauseFadeOut;
            this.fadeOutMode = value.fadeOutMode;
            this.autoFadeOutTime = value.autoFadeOutTime;
            this.fadeOutTweenType = value.fadeOutTweenType;

            this.actionEnabled = value.actionEnabled;
            this.additiveBlending = value.additiveBlending;
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

        public containsBoneMask(name: string): boolean {
            return this.boneMask.length === 0 || this.boneMask.indexOf(name) >= 0;
        }

        public addBoneMask(armature: Armature, name: string, recursive: boolean = true): void {
            const currentBone = armature.getBone(name);
            if (currentBone === null) {
                return;
            }

            if (this.boneMask.indexOf(name) < 0) { // Add mixing
                this.boneMask.push(name);
            }

            if (recursive) { // Add recursive mixing.
                for (const bone of armature.getBones()) {
                    if (this.boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                        this.boneMask.push(bone.name);
                    }
                }
            }
        }

        public removeBoneMask(armature: Armature, name: string, recursive: boolean = true): void {
            const index = this.boneMask.indexOf(name);
            if (index >= 0) { // Remove mixing.
                this.boneMask.splice(index, 1);
            }

            if (recursive) {
                const currentBone = armature.getBone(name);
                if (currentBone !== null) {
                    if (this.boneMask.length > 0) { // Remove recursive mixing.
                        for (const bone of armature.getBones()) {
                            const index = this.boneMask.indexOf(bone.name);
                            if (index >= 0 && currentBone.contains(bone)) {
                                this.boneMask.splice(index, 1);
                            }
                        }
                    }
                    else { // Add unrecursive mixing.
                        for (const bone of armature.getBones()) {
                            if (bone === currentBone) {
                                continue;
                            }

                            if (!currentBone.contains(bone)) {
                                this.boneMask.push(bone.name);
                            }
                        }
                    }
                }
            }
        }
    }
}