declare namespace dragonBones {
    /**
     * @language zh_CN
     * Pixi 贴图集数据。
     * @version DragonBones 3.0
     */
    class PixiTextureAtlasData extends TextureAtlasData {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * Pixi 贴图。
         * @version DragonBones 3.0
         */
        texture: PIXI.BaseTexture;
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
    }
    /**
     * @private
     */
    class PixiTextureData extends TextureData {
        static toString(): string;
        texture: PIXI.Texture;
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @inheritDoc
     */
    class PixiArmatureDisplay extends PIXI.Container implements IArmatureDisplay {
        private static _clock;
        private static _clockHandler(passedTime);
        /**
         * @private
         */
        _armature: Armature;
        private _debugDrawer;
        /**
         * @private
         */
        constructor();
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
        hasEvent(type: EventStringType): boolean;
        /**
         * @inheritDoc
         */
        addEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void;
        /**
         * @inheritDoc
         */
        removeEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void;
        /**
         * @inheritDoc
         */
        advanceTimeBySelf(on: Boolean): void;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        armature: Armature;
        /**
         * @inheritDoc
         */
        animation: Animation;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * Pixi 插槽。
     * @version DragonBones 3.0
     */
    class PixiSlot extends Slot {
        /**
         * @private
         */
        static toString(): string;
        private _renderDisplay;
        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        protected _initDisplay(value: Object): void;
        /**
         * @private
         */
        protected _disposeDisplay(value: Object): void;
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
        protected _replaceDisplay(value: Object): void;
        /**
         * @private
         */
        protected _removeDisplay(): void;
        /**
         * @private
         */
        _updateVisible(): void;
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
     * Pixi 工厂。
     * @version DragonBones 3.0
     */
    class PixiFactory extends BaseFactory {
        private static _factory;
        /**
         * @language zh_CN
         * 一个可以直接使用的全局工厂实例.
         * @version DragonBones 4.7
         */
        static factory: PixiFactory;
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
        protected _generateTextureAtlasData(textureAtlasData: PixiTextureAtlasData, textureAtlas: PIXI.BaseTexture): PixiTextureAtlasData;
        /**
         * @private
         */
        protected _generateArmature(dataPackage: BuildArmaturePackage): Armature;
        /**
         * @private
         */
        protected _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet): Slot;
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @returns 骨架的显示容器。
         * @see dragonBones.IArmatureDisplayContainer
         * @version DragonBones 4.5
         */
        buildArmatureDisplay(armatureName: string, dragonBonesName?: string, skinName?: string): PixiArmatureDisplay;
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param dragonBonesName 指定的龙骨数据名称，如果未设置，将检索所有的龙骨数据。
         * @version DragonBones 3.0
         */
        getTextureDisplay(textureName: string, dragonBonesName?: string): PIXI.Sprite;
        /**
         * @language zh_CN
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         */
        soundEventManater: PixiArmatureDisplay;
    }
}
