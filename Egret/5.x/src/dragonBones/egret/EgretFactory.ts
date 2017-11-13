namespace dragonBones {
    /**
     * Egret 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class EgretFactory extends BaseFactory {
        private static _time: number = 0;
        private static _dragonBonesInstance: DragonBones = null as any;
        private static _factory: EgretFactory | null = null;
        private static _clockHandler(time: number): boolean {
            time *= 0.001;
            const passedTime = time - EgretFactory._time;
            EgretFactory._dragonBonesInstance.advanceTime(passedTime);
            EgretFactory._time = time;

            return false;
        }
        /**
         * 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public static get factory(): EgretFactory {
            if (EgretFactory._factory === null) {
                EgretFactory._factory = new EgretFactory();
            }

            return EgretFactory._factory;
        }
        /**
         * @inheritDoc
         */
        public constructor() {
            super();

            if (EgretFactory._dragonBonesInstance === null) {
                const eventManager = new EgretArmatureDisplay();
                EgretFactory._dragonBonesInstance = new DragonBones(eventManager);
                EgretFactory._dragonBonesInstance.clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretFactory._clockHandler, EgretFactory);
            }

            this._dragonBones = EgretFactory._dragonBonesInstance;
        }
        /** 
         * @private 
         */
        protected _isSupportMesh(): boolean {
            if (egret.Capabilities.renderMode === "webgl" || egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                return true;
            }

            console.warn("Canvas can not support mesh, please change renderMode to webgl.");

            return false;
        }
        /**
         * @private
         */
        protected _buildTextureAtlasData(textureAtlasData: EgretTextureAtlasData | null, textureAtlas: egret.Texture | HTMLImageElement | null): EgretTextureAtlasData {
            if (textureAtlasData !== null) {
                if (textureAtlas instanceof egret.Texture) {
                    textureAtlasData.renderTexture = textureAtlas;
                }
                else {
                    const egretTexture = new egret.Texture();
                    egretTexture.bitmapData = new egret.BitmapData(textureAtlas);
                    textureAtlasData.disposeEnabled = true;
                    textureAtlasData.renderTexture = egretTexture;
                }
            }
            else {
                textureAtlasData = BaseObject.borrowObject(EgretTextureAtlasData);
            }

            return textureAtlasData;
        }
        /**
         * @private
         */
        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplay = new EgretArmatureDisplay();

            armature.init(
                dataPackage.armature,
                armatureDisplay, armatureDisplay, this._dragonBones
            );

            return armature;
        }
        /**
         * @private
         */
        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData | null> | null, armature: Armature): Slot {
            dataPackage;
            armature;
            const slot = BaseObject.borrowObject(EgretSlot);
            slot.init(
                slotData, displays,
                new egret.Bitmap(), new egret.Mesh()
            );

            return slot;
        }
        /**
         * 创建一个指定名称的骨架。
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string | null = null, skinName: string | null = null, textureAtlasName: string | null = null): EgretArmatureDisplay | null {
            const armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature !== null) {
                this._dragonBones.clock.add(armature);
                return armature.display as EgretArmatureDisplay;
            }

            return null;
        }
        /**
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getTextureDisplay(textureName: string, textureAtlasName: string | null = null): egret.Bitmap | null {
            const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : "", textureName) as EgretTextureData;
            if (textureData !== null && textureData.renderTexture !== null) {
                const texture = textureData.renderTexture;
                const bitmap = new egret.Bitmap(texture);
                bitmap.width = texture.textureWidth * textureData.parent.scale;
                bitmap.height = texture.textureHeight * textureData.parent.scale;

                return bitmap;
            }

            return null;
        }
        /**
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get soundEventManager(): EgretArmatureDisplay {
            return this._dragonBones.eventManager as EgretArmatureDisplay;
        }

        /**
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#clock
         * @deprecated
         */
        public static get clock(): WorldClock {
            return EgretFactory.factory.clock;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        public addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName: string | null = null): void {
            console.warn("已废弃，请参考 @see");
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        public getSkeletonData(dragonBonesName: string) {
            console.warn("已废弃，请参考 @see");
            return this.getDragonBonesData(dragonBonesName);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        public removeSkeletonData(dragonBonesName: string): void {
            console.warn("已废弃，请参考 @see");
            this.removeDragonBonesData(dragonBonesName);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        public addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName: string | null = null): void {
            console.warn("已废弃，请参考 @see");
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        public getTextureAtlas(dragonBonesName: string) {
            console.warn("已废弃，请参考 @see");
            return this.getTextureAtlasData(dragonBonesName);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        public removeTextureAtlas(dragonBonesName: string): void {
            console.warn("已废弃，请参考 @see");
            this.removeTextureAtlasData(dragonBonesName);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#buildArmature()
         */
        public buildFastArmature(armatureName: string, dragonBonesName: string | null = null, skinName: string | null = null): FastArmature | null {
            console.warn("已废弃，请参考 @see");
            return this.buildArmature(armatureName, dragonBonesName, skinName);
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.BaseFactory#clear()
         */
        public dispose(): void {
            console.warn("已废弃，请参考 @see");
            this.clear();
        }
    }
}