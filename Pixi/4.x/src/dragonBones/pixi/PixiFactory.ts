namespace dragonBones {
    /**
     * Pixi 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class PixiFactory extends BaseFactory {
        private static _dragonBonesInstance: DragonBones = null as any;
        private static _factory: PixiFactory = null as any;
        private static _clockHandler(passedTime: number): void {
            // PixiFactory._dragonBonesInstance.advanceTime(PIXI.ticker.shared.elapsedMS * passedTime * 0.001);
            passedTime;
            PixiFactory._dragonBonesInstance.advanceTime(-1);
        }
        /**
         * 一个可以直接使用的全局 WorldClock 实例。(由引擎驱动)
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public static get clock(): WorldClock {
            return PixiFactory._dragonBonesInstance.clock;
        }
        /**
         * @language zh_CN
         * 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         */
        public static get factory(): PixiFactory {
            if (PixiFactory._factory === null) {
                PixiFactory._factory = new PixiFactory();
            }

            return PixiFactory._factory;
        }
        /**
         * @inheritDoc
         */
        public constructor(dataParser: DataParser | null = null) {
            super(dataParser);

            if (PixiFactory._dragonBonesInstance === null) {
                const eventManager = new PixiArmatureDisplay();
                PixiFactory._dragonBonesInstance = new DragonBones(eventManager);
                PIXI.ticker.shared.add(PixiFactory._clockHandler, PixiFactory);
            }

            this._dragonBones = PixiFactory._dragonBonesInstance;
        }
        /**
         * @private
         */
        protected _buildTextureAtlasData(textureAtlasData: PixiTextureAtlasData | null, textureAtlas: PIXI.BaseTexture | null): PixiTextureAtlasData {
            if (textureAtlasData) {
                textureAtlasData.renderTexture = textureAtlas;
            }
            else {
                textureAtlasData = BaseObject.borrowObject(PixiTextureAtlasData);
            }

            return textureAtlasData;
        }
        /**
         * @private
         */
        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplay = new PixiArmatureDisplay();

            armature.init(
                dataPackage.armature,
                armatureDisplay, armatureDisplay, this._dragonBones
            );

            return armature;
        }
        /**
         * @private
         */
        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData>, armature: Armature): Slot {
            dataPackage;
            armature;
            const slot = BaseObject.borrowObject(PixiSlot);

            slot.init(
                slotData, displays,
                new PIXI.Sprite(), new PIXI.mesh.Mesh(null as any, null as any, null as any, null as any, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES)
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
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string | null = null, skinName: string | null = null, textureAtlasName: string | null = null): PixiArmatureDisplay | null {
            const armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature !== null) {
                this._dragonBones.clock.add(armature);

                return armature.display as PixiArmatureDisplay;
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
        public getTextureDisplay(textureName: string, textureAtlasName: string | null = null): PIXI.Sprite | null {
            const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : "", textureName) as PixiTextureData;
            if (textureData !== null && textureData.renderTexture !== null) {
                return new PIXI.Sprite(textureData.renderTexture);
            }

            return null;
        }
        /**
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get soundEventManager(): PixiArmatureDisplay {
            return this._dragonBones.eventManager as PixiArmatureDisplay;
        }
    }
}