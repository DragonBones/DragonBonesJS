namespace dragonBones {
    /**
     * @language zh_CN
     * Pixi 工厂。
     * @version DragonBones 3.0
     */
    export class PixiFactory extends BaseFactory {
        private static _factory: PixiFactory = null;
        /**
         * @private
         */
        public static _eventManager: PixiArmatureDisplay = null;
        /**
         * @private
         */
        public static _clock: WorldClock = null;

        private static _clockHandler(passedTime: number): void {
            PixiFactory._clock.advanceTime(-1); // passedTime !?
        }
        /**
         * @language zh_CN
         * 一个可以直接使用的全局工厂实例.
         * @version DragonBones 4.7
         */
        public static get factory(): PixiFactory {
            if (!PixiFactory._factory) {
                PixiFactory._factory = new PixiFactory();
            }

            return PixiFactory._factory;
        }
        /**
         * @language zh_CN
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        public constructor(dataParser: DataParser = null) {
            super(dataParser);

            if (!PixiFactory._eventManager) {
                PixiFactory._eventManager = new PixiArmatureDisplay();
                PixiFactory._clock = new WorldClock();
                PIXI.ticker.shared.add(PixiFactory._clockHandler, PixiFactory);
            }
        }
        /**
         * @private
         */
        protected _generateTextureAtlasData(textureAtlasData: PixiTextureAtlasData, textureAtlas: PIXI.BaseTexture): PixiTextureAtlasData {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = BaseObject.borrowObject(PixiTextureAtlasData);
            }

            return textureAtlasData;
        }
        /**
         * @private
         */
        protected _generateArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplayContainer = new PixiArmatureDisplay();

            armature._armatureData = dataPackage.armature;
            armature._skinData = dataPackage.skin;
            armature._animation = BaseObject.borrowObject(Animation);
            armature._display = armatureDisplayContainer;
            armature._eventManager = PixiFactory._eventManager;

            armatureDisplayContainer._armature = armature;
            armature._animation._armature = armature;

            armature.animation.animations = dataPackage.armature.animations;

            return armature;
        }
        /**
         * @private
         */
        protected _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet, armature: Armature): Slot {
            const slot = BaseObject.borrowObject(PixiSlot);
            const slotData = slotDisplayDataSet.slot;
            const displayList = [];

            slot.name = slotData.name;
            slot._rawDisplay = new PIXI.Sprite();
            slot._meshDisplay = new PIXI.mesh.Mesh(null, null, null, null, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);

            for (let i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                const displayData = slotDisplayDataSet.displays[i];
                switch (displayData.type) {
                    case DisplayType.Image:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }

                        displayList.push(slot._rawDisplay);
                        break;

                    case DisplayType.Mesh:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }

                        displayList.push(slot._meshDisplay);
                        break;

                    case DisplayType.Armature:
                        const childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            if (!slot.inheritAnimation) {
                                const actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
                                if (actions.length > 0) {
                                    for (let i = 0, l = actions.length; i < l; ++i) {
                                        childArmature._bufferAction(actions[i]);
                                    }
                                }
                                else {
                                    childArmature.animation.play();
                                }
                            }

                            displayData.armature = childArmature.armatureData; // 
                        }

                        displayList.push(childArmature);
                        break;

                    default:
                        displayList.push(null);
                        break;
                }
            }

            slot._setDisplayList(displayList);

            return slot;
        }
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
		 * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.PixiArmatureDisplay
         * @version DragonBones 4.5
         */
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string = null, skinName: string = null, textureAtlasName: string = null): PixiArmatureDisplay {
            const armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            const armatureDisplay = armature ? armature._display as PixiArmatureDisplay: null;
            if (armatureDisplay) {
                armatureDisplay.advanceTimeBySelf(true);
            }

            return armatureDisplay;
        }
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param dragonBonesName 指定的龙骨数据名称，如果未设置，将检索所有的龙骨数据。
         * @version DragonBones 3.0
         */
        public getTextureDisplay(textureName: string, dragonBonesName: string = null): PIXI.Sprite {
            const textureData = this._getTextureData(dragonBonesName, textureName) as PixiTextureData;
            if (textureData) {
                if (!textureData.texture) {
                    const textureAtlasTexture = (textureData.parent as PixiTextureAtlasData).texture;
                    const originSize = new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height);
                    textureData.texture = new PIXI.Texture(
                        textureAtlasTexture,
                        null,
                        <PIXI.Rectangle><any>textureData.region,
                        originSize,
                        textureData.rotated
                    );
                }

                return new PIXI.Sprite(textureData.texture);
            }

            return null;
        }
        /**
         * @language zh_CN
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         */
        public get soundEventManater(): PixiArmatureDisplay {
            return PixiFactory._eventManager;
        }
    }
}