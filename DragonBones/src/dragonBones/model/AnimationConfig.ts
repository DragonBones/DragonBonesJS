namespace dragonBones {
    /**
     * @language zh_CN
     * @beta
     * 动画配置，描述播放一个动画所需要的全部信息。
     * @see dragonBones.AnimationState
     * @version DragonBones 5.0
     */
    export class AnimationConfig extends BaseObject {
        public static toString(): string {
            return "[class dragonBones.AnimationConfig]";
        }
        /**
         * @language zh_CN
         * 是否暂停淡出的动画。
         * @default true
         * @version DragonBones 5.0
         */
        public pauseFadeOut: boolean;
        /**
         * @language zh_CN
         * 淡出模式。
         * @default dragonBones.AnimationFadeOutMode.All
         * @see dragonBones.AnimationFadeOutMode
         * @version DragonBones 5.0
         */
        public fadeOutMode: AnimationFadeOutMode;
        /**
         * @language zh_CN
         * 淡出时间。 [-1: 与淡入时间同步, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        public fadeOutTime: number;
        /**
         * @language zh_CN
         * 淡出缓动方式。
         * @default 0
         * @version DragonBones 5.0
         */
        public fadeOutEasing: number;
        /**
         * @language zh_CN
         * 是否以增加的方式混合。
         * @default false
         * @version DragonBones 5.0
         */
        public additiveBlending: boolean;
        /**
         * @language zh_CN
         * 是否对插槽的显示对象有控制权。
         * @default true
         * @version DragonBones 5.0
         */
        public displayControl: boolean;
        /**
         * @language zh_CN
         * 是否暂停淡入的动画，直到淡入过程结束。
         * @default true
         * @version DragonBones 5.0
         */
        public pauseFadeIn: boolean;
        /**
         * @language zh_CN
         * 否能触发行为。
         * @default true
         * @version DragonBones 5.0
         */
        public actionEnabled: boolean;
        /**
         * @language zh_CN
         * 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @default -1
         * @version DragonBones 5.0
         */
        public playTimes: number;
        /**
         * @language zh_CN
         * 混合图层，图层高会优先获取混合权重。
         * @default 0
         * @version DragonBones 5.0
         */
        public layer: number;
        /**
         * @language zh_CN
         * 开始时间。 (以秒为单位)
         * @default 0
         * @version DragonBones 5.0
         */
        public position: number;
        /**
         * @language zh_CN
         * 持续时间。 [-1: 使用动画数据默认值, 0: 动画停止, (0~N]: 持续时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        public duration: number;
        /**
         * @language zh_CN
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        public timeScale: number;
        /**
         * @language zh_CN
         * 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        public fadeInTime: number;
        /**
         * @language zh_CN
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        public autoFadeOutTime: number;
        /**
         * @language zh_CN
         * 淡入缓动方式。
         * @default 0
         * @version DragonBones 5.0
         */
        public fadeInEasing: number;
        /**
         * @language zh_CN
         * 权重。
         * @default 1
         * @version DragonBones 5.0
         */
        public weight: number;
        /**
         * @language zh_CN
         * 动画状态名。
         * @version DragonBones 5.0
         */
        public name: string;
        /**
         * @language zh_CN
         * 动画数据名。
         * @version DragonBones 5.0
         */
        public animation: string;
        /**
         * @language zh_CN
         * 混合组，用于动画状态编组，方便控制淡出。
         * @version DragonBones 5.0
         */
        public group: string;
        /**
         * @language zh_CN
         * 骨骼遮罩。
         * @version DragonBones 5.0
         */
        public boneMask: Array<string> = [];
        /**
         * @language zh_CN
         * @version DragonBones 5.0
         */
        public animationNames: Array<string> = [];
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _onClear(): void {
            this.pauseFadeOut = true;
            this.fadeOutMode = AnimationFadeOutMode.All;
            this.fadeOutTime = -1.0;
            this.fadeOutEasing = 0.0;

            this.additiveBlending = false;
            this.displayControl = true;
            this.pauseFadeIn = true;
            this.actionEnabled = true;
            this.playTimes = -1;
            this.layer = 0;
            this.position = 0.0;
            this.duration = -1.0;
            this.timeScale = -100.0;
            this.fadeInTime = -1.0;
            this.autoFadeOutTime = -1.0;
            this.fadeInEasing = 0.0;
            this.weight = 1.0;
            this.name = null;
            this.animation = null;
            this.group = null;
            this.boneMask.length = 0;
            this.animationNames.length = 0;
        }

        public clear(): void {
            this._onClear();
        }

        public copyFrom(value: AnimationConfig): void {
            this.pauseFadeOut = value.pauseFadeOut;
            this.fadeOutMode = value.fadeOutMode;
            this.autoFadeOutTime = value.autoFadeOutTime;
            this.fadeOutEasing = value.fadeOutEasing;

            this.additiveBlending = value.additiveBlending;
            this.displayControl = value.displayControl;
            this.pauseFadeIn = value.pauseFadeIn;
            this.actionEnabled = value.actionEnabled;
            this.playTimes = value.playTimes;
            this.layer = value.layer;
            this.position = value.position;
            this.duration = value.duration;
            this.timeScale = value.timeScale;
            this.fadeInTime = value.fadeInTime;
            this.fadeOutTime = value.fadeOutTime;
            this.fadeInEasing = value.fadeInEasing;
            this.weight = value.weight;
            this.name = value.name;
            this.animation = value.animation;
            this.group = value.group;

            this.boneMask.length = value.boneMask.length;
            for (let i = 0, l = this.boneMask.length; i < l; ++i) {
                this.boneMask[i] = value.boneMask[i];
            }

            this.animationNames.length = value.animationNames.length;
            for (let i = 0, l = this.animationNames.length; i < l; ++i) {
                this.animationNames[i] = value.animationNames[i];
            }
        }

        public containsBoneMask(name: string): boolean {
            return this.boneMask.length === 0 || this.boneMask.indexOf(name) >= 0;
        }

        public addBoneMask(armature: Armature, name: string, recursive: boolean = true): void {
            const currentBone = armature.getBone(name);
            if (!currentBone) {
                return;
            }

            if (this.boneMask.indexOf(name) < 0) { // Add mixing
                this.boneMask.push(name);
            }

            if (recursive) { // Add recursive mixing.
                const bones = armature.getBones();
                for (let i = 0, l = bones.length; i < l; ++i) {
                    const bone = bones[i];
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
                if (currentBone) {
                    const bones = armature.getBones();
                    if (this.boneMask.length > 0) { // Remove recursive mixing.
                        for (let i = 0, l = bones.length; i < l; ++i) {
                            const bone = bones[i];
                            const index = this.boneMask.indexOf(bone.name);
                            if (index >= 0 && currentBone.contains(bone)) {
                                this.boneMask.splice(index, 1);
                            }
                        }
                    }
                    else { // Add unrecursive mixing.
                        for (let i = 0, l = bones.length; i < l; ++i) {
                            const bone = bones[i];
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