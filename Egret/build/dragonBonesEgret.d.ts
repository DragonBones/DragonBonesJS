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
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        generateTextureData(): TextureData;
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
         * @inheritDoc
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
         * @version DragonBones 4.5
         */
        eventObject: EventObject;
        /**
         * @private
         */
        constructor(type: EventStringType, bubbles?: boolean, cancelable?: boolean, data?: any);
        /**
         * @see dragonBones.EventObject#animationName
         */
        animationName: string;
        /**
         * @see dragonBones.EventObject#armature
         */
        armature: Armature;
        /**
         * @see dragonBones.EventObject#bone
         */
        bone: Bone;
        /**
         * @see dragonBones.EventObject#slot
         */
        slot: Slot;
        /**
         * @see dragonBones.EventObject#animationState
         */
        animationState: AnimationState;
        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        frameLabel: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        sound: string;
        /**
         * @deprecated
         * @see #animationName
         */
        movementID: string;
        /**
         * @see dragonBones.EventObject.START
         */
        static START: string;
        /**
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        static LOOP_COMPLETE: string;
        /**
         * @see dragonBones.EventObject.COMPLETE
         */
        static COMPLETE: string;
        /**
         * @see dragonBones.EventObject.FADE_IN
         */
        static FADE_IN: string;
        /**
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        static FADE_IN_COMPLETE: string;
        /**
         * @see dragonBones.EventObject.FADE_OUT
         */
        static FADE_OUT: string;
        /**
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        static FADE_OUT_COMPLETE: string;
        /**
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static FRAME_EVENT: string;
        /**
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
    class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureDisplay {
        private _debugDrawer;
        /**
         * @inheritDoc
         */
        _onClear(): void;
        /**
         * @inheritDoc
         */
        _dispatchEvent(eventObject: EventObject): void;
        /**
         * @inheritDoc
         */
        _debugDraw(): void;
        /**
         * @inheritDoc
         */
        _onReplaceTexture(texture: any): void;
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
        dispose(): void;
        /**
         * @inheritDoc
         */
        advanceTimeBySelf(on: boolean): void;
        /**
         * @inheritDoc
         */
        armature: Armature;
        /**
         * @inheritDoc
         */
        animation: Animation;
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
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        constructor();
        private _createTexture(textureData, textureAtlas);
        /**
         * @inheritDoc
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
        protected _updateFilters(): void;
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
        protected _updateTransform(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    class EgretFactory extends BaseFactory {
        static _factory: EgretFactory;
        /**
         * @private
         */
        static _eventManager: EgretArmatureDisplay;
        /**
         * @private
         */
        static _clock: WorldClock;
        private static _clockHandler(time);
        /**
         * @language zh_CN
         * 一个可以直接使用的全局工厂实例.
         * @version DragonBones 4.7
         */
        static factory: EgretFactory;
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
        protected _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet, armature: Armature): Slot;
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
        soundEventManater: EgretArmatureDisplay;
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
    }
}
