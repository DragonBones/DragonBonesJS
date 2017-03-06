declare namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     */
    class EgretTextureAtlasData extends TextureAtlasData {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * Egret 贴图。
         * @version DragonBones 3.0
         */
        texture: egret.Texture;
        /**
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        generateTexture(): TextureData;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        dispose(): void;
    }
    /**
     * @private
     */
    class EgretTextureData extends TextureData {
        static toString(): string;
        texture: egret.Texture;
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 事件。
     * @version DragonBones 4.5
     */
    class EgretEvent extends egret.Event {
        /**
         * @language zh_CN
         * 事件对象。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         */
        readonly eventObject: EventObject;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#animationName
         */
        readonly animationName: string;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#armature
         */
        readonly armature: Armature;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#bone
         */
        readonly bone: Bone;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#slot
         */
        readonly slot: Slot;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        readonly animationState: AnimationState;
        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        readonly frameLabel: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        readonly sound: string;
        /**
         * @deprecated
         * @see #animationName
         */
        readonly movementID: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.START
         */
        static START: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        static LOOP_COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.COMPLETE
         */
        static COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_IN
         */
        static FADE_IN: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        static FADE_IN_COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_OUT
         */
        static FADE_OUT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        static FADE_OUT_COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        static SOUND_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static ANIMATION_FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static BONE_FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static MOVEMENT_FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        static SOUND: string;
    }
    /**
     * @inheritDoc
     */
    class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureDisplay, IEventDispatcher {
        private _disposeProxy;
        private _debugDrawer;
        /**
         * @private
         */
        constructor();
        /**
         * @private
         */
        _onClear(): void;
        /**
         * @private
         */
        _dispatchEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * @private
         */
        _debugDraw(isEnabled: boolean): void;
        /**
         * @inheritDoc
         */
        dispose(disposeProxy?: boolean): void;
        /**
         * @inheritDoc
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * @inheritDoc
         */
        addEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void;
        /**
         * @inheritDoc
         */
        removeEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void;
        /**
         * @inheritDoc
         */
        readonly armature: Armature;
        /**
         * @inheritDoc
         */
        readonly animation: Animation;
        /**
         * @deprecated
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        advanceTimeBySelf(on: boolean): void;
    }
    /**
     * @deprecated
     * @see dragonBones.Armature
     */
    type FastArmature = Armature;
    /**
     * @deprecated
     * @see dragonBones.Bone
     */
    type FastBone = Bone;
    /**
     * @deprecated
     * @see dragonBones.Slot
     */
    type FastSlot = Slot;
    /**
     * @deprecated
     * @see dragonBones.Animation
     */
    type FastAnimation = Animation;
    /**
     * @deprecated
     * @see dragonBones.AnimationState
     */
    type FastAnimationState = AnimationState;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class Event extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class ArmatureEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class AnimationEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class FrameEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class SoundEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    class EgretTextureAtlas extends EgretTextureAtlasData {
        /**
         * @private
         */
        static toString(): string;
        constructor(texture: egret.Texture, rawData: any, scale?: number);
    }
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    class EgretSheetAtlas extends EgretTextureAtlas {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretFactory#soundEventManater
     */
    class SoundEventManager {
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManater
         */
        static getInstance(): EgretArmatureDisplay;
    }
    /**
     * @deprecated
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    class AnimationCacheManager {
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    class EgretSlot extends Slot {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否更新显示对象的变换属性。
         * 为了更好的性能, 并不会更新 display 的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         */
        transformUpdateEnabled: boolean;
        private _renderDisplay;
        private _colorFilter;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        protected _initDisplay(value: any): void;
        /**
         * @private
         */
        protected _disposeDisplay(value: any): void;
        /**
         * @private
         */
        protected _onUpdateDisplay(): void;
        /**
         * @private
         */
        protected _addDisplay(): void;
        /**
         * @private
         */
        protected _replaceDisplay(value: any): void;
        /**
         * @private
         */
        protected _removeDisplay(): void;
        /**
         * @private
         */
        protected _updateZOrder(): void;
        /**
         * @private
         */
        protected _updateBlendMode(): void;
        /**
         * @private
         */
        protected _updateColor(): void;
        /**
         * @private
         */
        protected _updateFrame(): void;
        /**
         * @private
         */
        protected _updateMesh(): void;
        /**
         * @private
         */
        protected _updateTransform(isSkinnedMesh: boolean): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    class EgretFactory extends BaseFactory {
        private static _factory;
        private static _eventManager;
        /**
         * @private
         */
        static _clock: WorldClock;
        private static _clockHandler(time);
        /**
         * @language zh_CN
         * 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         */
        static readonly factory: EgretFactory;
        /**
         * @language zh_CN
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        constructor(dataParser?: DataParser);
        /**
         * @private
         */
        protected _generateTextureAtlasData(textureAtlasData: EgretTextureAtlasData, textureAtlas: egret.Texture): EgretTextureAtlasData;
        /**
         * @private
         */
        protected _generateArmature(dataPackage: BuildArmaturePackage): Armature;
        /**
         * @private
         */
        protected _generateSlot(dataPackage: BuildArmaturePackage, skinSlotData: SkinSlotData, armature: Armature): Slot;
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         */
        buildArmatureDisplay(armatureName: string, dragonBonesName?: string, skinName?: string, textureAtlasName?: string): EgretArmatureDisplay;
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
         * @version DragonBones 3.0
         */
        getTextureDisplay(textureName: string, textureAtlasName?: string): egret.Bitmap;
        /**
         * @language zh_CN
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         */
        readonly soundEventManager: EgretArmatureDisplay;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName?: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        getSkeletonData(dragonBonesName: string): DragonBonesData;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        removeSkeletonData(dragonBonesName: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName?: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        getTextureAtlas(dragonBonesName: string): TextureAtlasData[];
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        removeTextureAtlas(dragonBonesName: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        buildFastArmature(armatureName: string, dragonBonesName?: string, skinName?: string): FastArmature;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#clear()
         */
        dispose(): void;
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManager()
         */
        readonly soundEventManater: EgretArmatureDisplay;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 是否包含指定名称的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function hasMovieGroup(groupName: string): boolean;
    /**
     * @language zh_CN
     * 添加动画组。
     * @param groupData 动画二进制数据。
     * @param textureAtlas 贴图集或贴图集列表。
     * @param groupName 为动画组指定一个名称，如果未设置，则使用数据中的名称。
     * @version DragonBones 4.7
     */
    function addMovieGroup(groupData: ArrayBuffer, textureAtlas: egret.Texture | egret.Texture[], groupName?: string): void;
    /**
     * @language zh_CN
     * 移除动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeMovieGroup(groupName: string): void;
    /**
     * @language zh_CN
     * 移除所有的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeAllMovieGroup(): void;
    /**
     * @language zh_CN
     * 创建一个动画。
     * @param movieName 动画的名称。
     * @param groupName 动画组的名称，如果未设置，将检索所有的动画组，当多个动画组中包含同名的动画时，可能无法创建出准确的动画。
     * @version DragonBones 4.7
     */
    function buildMovie(movieName: string, groupName?: string): Movie;
    /**
     * @language zh_CN
     * 获取指定动画组内包含的所有动画名称。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function getMovieNames(groupName: string): string[];
    /**
     * @language zh_CN
     * 动画事件。
     * @version DragonBones 4.7
     */
    class MovieEvent extends egret.Event {
        /**
         * @language zh_CN
         * 动画剪辑开始播放。
         * @version DragonBones 4.7
         */
        static START: string;
        /**
         * @language zh_CN
         * 动画剪辑循环播放一次完成。
         * @version DragonBones 4.7
         */
        static LOOP_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画剪辑播放完成。
         * @version DragonBones 4.7
         */
        static COMPLETE: string;
        /**
         * @language zh_CN
         * 动画剪辑帧事件。
         * @version DragonBones 4.7
         */
        static FRAME_EVENT: string;
        /**
         * @language zh_CN
         * 动画剪辑声音事件。
         * @version DragonBones 4.7
         */
        static SOUND_EVENT: string;
        /**
         * @language zh_CN
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.7
         */
        name: string;
        /**
         * @language zh_CN
         * 发出事件的插槽名称。
         * @version DragonBones 4.7
         */
        slotName: string;
        /**
         * @language zh_CN
         * 发出事件的动画剪辑名称。
         * @version DragonBones 4.7
         */
        clipName: string;
        /**
         * @language zh_CN
         * 发出事件的动画。
         * @version DragonBones 4.7
         */
        movie: Movie;
        /**
         * @private
         */
        constructor(type: string);
    }
    /**
     * @language zh_CN
     * 通过读取缓存的二进制动画数据来更新动画，具有良好的运行性能，同时对内存的占用也非常低。
     * @see dragonBones.buildMovie
     * @version DragonBones 4.7
     */
    class Movie extends egret.DisplayObjectContainer implements IAnimateble {
        private static _cleanBeforeRender();
        /**
         * @language zh_CN
         * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 4.7
         */
        timeScale: number;
        /**
         * @language zh_CN
         * 动画剪辑的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * （当再次播放其他动画剪辑时，此值将被重置为 1）
         * @default 1
         * @version DragonBones 4.7
         */
        clipTimeScale: number;
        private _batchEnabled;
        private _isLockDispose;
        private _isDelayDispose;
        private _isStarted;
        private _isPlaying;
        private _isReversing;
        private _isCompleted;
        private _playTimes;
        private _time;
        private _currentTime;
        private _timeStamp;
        private _currentPlayTimes;
        private _cacheFrameIndex;
        private _frameSize;
        private _cacheRectangle;
        private _clock;
        private _groupConfig;
        private _config;
        private _clipConfig;
        private _currentFrameConfig;
        private _clipArray;
        private _clipNames;
        private _slots;
        private _childMovies;
        private _configToEvent(config, event);
        private _onCrossFrame(frameConfig);
        private _updateSlotBlendMode(slot);
        private _updateSlotColor(slot, aM, rM, gM, bM, aO, rO, gO, bO);
        private _updateSlotDisplay(slot);
        private _getSlot(name);
        /**
         * @inheritDoc
         */
        $render(): void;
        /**
         * @inheritDoc
         */
        $measureContentBounds(bounds: egret.Rectangle): void;
        /**
         * @inheritDoc
         */
        $doAddChild(child: egret.DisplayObject, index: number, notifyListeners?: boolean): egret.DisplayObject;
        /**
         * @inheritDoc
         */
        $doRemoveChild(index: number, notifyListeners?: boolean): egret.DisplayObject;
        /**
         * @language zh_CN
         * 释放动画。
         * @version DragonBones 3.0
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        advanceTime(passedTime: number): void;
        /**
         * @language zh_CN
         * 播放动画剪辑。
         * @param clipName 动画剪辑的名称，如果未设置，则播放默认动画剪辑，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画剪辑。
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         */
        play(clipName?: string, playTimes?: number): void;
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @version DragonBones 4.7
         */
        stop(): void;
        /**
         * @language zh_CN
         * 从指定时间播放动画。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 5.0
         */
        gotoAndPlay(clipName: string, time: number, playTimes?: number): void;
        /**
         * @language zh_CN
         * 将动画停止到指定时间。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @version DragonBones 5.0
         */
        gotoAndStop(clipName: string, time: number): void;
        /**
         * @language zh_CN
         * 是否包含指定动画剪辑。
         * @param clipName 动画剪辑的名称。
         * @version DragonBones 4.7
         */
        hasClip(clipName: string): boolean;
        /**
         * @language zh_CN
         * 动画剪辑是否处正在播放。
         * @version DragonBones 4.7
         */
        readonly isPlaying: boolean;
        /**
         * @language zh_CN
         * 动画剪辑是否均播放完毕。
         * @version DragonBones 4.7
         */
        readonly isComplete: boolean;
        /**
         * @language zh_CN
         * 当前动画剪辑的播放时间。 (以秒为单位)
         * @version DragonBones 4.7
         */
        readonly currentTime: number;
        /**
         * @language zh_CN
         * 当前动画剪辑的总时间。 (以秒为单位)
         * @version DragonBones 4.7
         */
        readonly totalTime: number;
        /**
         * @language zh_CN
         * 当前动画剪辑的播放次数。
         * @version DragonBones 4.7
         */
        readonly currentPlayTimes: number;
        /**
         * @language zh_CN
         * 当前动画剪辑需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         */
        readonly playTimes: number;
        readonly groupName: string;
        /**
         * @language zh_CN
         * 正在播放的动画剪辑名称。
         * @version DragonBones 4.7
         */
        readonly clipName: string;
        /**
         * @language zh_CN
         * 所有动画剪辑的名称。
         * @version DragonBones 4.7
         */
        readonly clipNames: string[];
        /**
         * @inheritDoc
         */
        clock: WorldClock;
        /**
         * @language zh_CN
         * 由 Movie 自己来更新动画。
         * @param on 开启或关闭 Movie 自己对动画的更新。
         * @version DragonBones 4.7
         */
        advanceTimeBySelf(on: boolean): void;
    }
}
