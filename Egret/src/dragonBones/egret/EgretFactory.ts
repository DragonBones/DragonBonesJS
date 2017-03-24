namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    export class EgretFactory extends BaseFactory {
        private static _factory: EgretFactory = null;
        private static _eventManager: EgretArmatureDisplay = null;
        private static _clock: WorldClock = null;

        private static _clockHandler(time: number): boolean {
            time *= 0.001;

            const passedTime = time - EgretFactory._clock.time;
            EgretFactory._clock.advanceTime(passedTime);
            EgretFactory._clock.time = time;

            return false;
        }
        /**
         * @language zh_CN
         * 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         */
        public static get factory(): EgretFactory {
            if (!EgretFactory._factory) {
                EgretFactory._factory = new EgretFactory();
            }

            return EgretFactory._factory;
        }
        /**
         * @language zh_CN
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 5.0
         */
        public static get clock(): WorldClock {
            return EgretFactory._clock;
        }
        /**
         * @language zh_CN
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        public constructor(dataParser: DataParser = null) {
            super(dataParser);

            if (!EgretFactory._eventManager) {
                EgretFactory._eventManager = new EgretArmatureDisplay();
                EgretFactory._clock = new WorldClock();
                EgretFactory._clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretFactory._clockHandler, EgretFactory);
            }
        }
        /**
         * @private
         */
        protected _generateTextureAtlasData(textureAtlasData: EgretTextureAtlasData, textureAtlas: egret.Texture): EgretTextureAtlasData {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = BaseObject.borrowObject(EgretTextureAtlasData);
            }

            return textureAtlasData;
        }
        /**
         * @private
         */
        protected _generateArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplay = new EgretArmatureDisplay();
            armatureDisplay._armature = armature;

            armature._init(
                dataPackage.armature, dataPackage.skin,
                armatureDisplay, armatureDisplay, EgretFactory._eventManager
            );

            return armature;
        }
        /**
         * @private
         */
        protected _generateSlot(dataPackage: BuildArmaturePackage, skinSlotData: SkinSlotData, armature: Armature): Slot {
            const slotData = skinSlotData.slot;
            const slot = BaseObject.borrowObject(EgretSlot);
            const displayList = [];

            slot._init(
                skinSlotData,
                new egret.Bitmap(),
                new egret.Mesh()
            );

            for (let i = 0, l = skinSlotData.displays.length; i < l; ++i) {
                const displayData = skinSlotData.displays[i];
                switch (displayData.type) {
                    case DisplayType.Image:
                        if (!displayData.texture) {
                            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.path);
                        }

                        if (dataPackage.textureAtlasName) {
                            slot._textureDatas[i] = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
                        }

                        displayList[i] = slot.rawDisplay;
                        break;

                    case DisplayType.Mesh:
                        if (!displayData.texture) {
                            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.path);
                        }

                        if (dataPackage.textureAtlasName) {
                            slot._textureDatas[i] = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
                        }

                        if (!displayData.mesh && displayData.share) {
                            displayData.mesh = skinSlotData.getMesh(displayData.share);
                        }

                        if (egret.Capabilities.renderMode === "webgl" || egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                            displayList[i] = slot.meshDisplay;
                        }
                        else {
                            console.warn("Canvas can not support mesh, please change renderMode to webgl.");
                            displayList[i] = slot.rawDisplay;
                        }
                        break;

                    case DisplayType.Armature:
                        const childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            childArmature.inheritAnimation = displayData.inheritAnimation;
                            if (!childArmature.inheritAnimation) {
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

                        displayList[i] = childArmature;
                        break;

                    default:
                        displayList[i] = null;
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
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         */
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string = null, skinName: string = null, textureAtlasName: string = null): EgretArmatureDisplay {
            const armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature) {
                EgretFactory._clock.add(armature);
                return armature.display as EgretArmatureDisplay;
            }

            return null;
        }
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
         * @version DragonBones 3.0
         */
        public getTextureDisplay(textureName: string, textureAtlasName: string = null): egret.Bitmap {
            const textureData = <EgretTextureData>this._getTextureData(textureAtlasName, textureName);
            if (textureData) {
                if (!textureData.texture) {
                    const textureAtlasTexture = (textureData.parent as EgretTextureAtlasData).texture;
                    textureData.texture = new egret.Texture();
                    textureData.texture._bitmapData = textureAtlasTexture._bitmapData;

                    textureData.texture.$initData(
                        textureData.region.x, textureData.region.y,
                        textureData.region.width, textureData.region.height,
                        0, 0,
                        textureData.region.width, textureData.region.height,
                        textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight
                    );
                }

                return new egret.Bitmap(textureData.texture);
            }

            return null;
        }
        /**
         * @language zh_CN
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         */
        public get soundEventManager(): EgretArmatureDisplay {
            return EgretFactory._eventManager;
        }

        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        public addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName: string = null): void {
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        public getSkeletonData(dragonBonesName: string) {
            return this.getDragonBonesData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        public removeSkeletonData(dragonBonesName: string): void {
            this.removeDragonBonesData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        public addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName: string = null): void {
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        public getTextureAtlas(dragonBonesName: string) {
            return this.getTextureAtlasData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        public removeTextureAtlas(dragonBonesName: string): void {
            this.removeTextureAtlasData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        public buildFastArmature(armatureName: string, dragonBonesName: string = null, skinName: string = null): FastArmature {
            return this.buildArmature(armatureName, dragonBonesName, skinName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#clear()
         */
        public dispose(): void {
            this.clear();
        }
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManager()
         */
        public get soundEventManater(): EgretArmatureDisplay {
            return EgretFactory._eventManager;
        }
    }
}