/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
namespace dragonBones {
    /**
     * - The PixiJS factory.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - PixiJS 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class PixiFactory extends BaseFactory {
        private static _dragonBonesInstance: DragonBones = null as any;
        private static _factory: PixiFactory = null as any;
        private static _clockHandler(passedTime: number): void {
            PixiFactory._dragonBonesInstance.advanceTime(PIXI.ticker.shared.elapsedMS * passedTime * 0.001);
        }

        private static _createDragonBones(): DragonBones {
            const eventManager = new PixiArmatureDisplay();
            const dragonBonesInstance = new DragonBones(eventManager);
            PIXI.ticker.shared.add(PixiFactory._clockHandler, PixiFactory);

            return dragonBonesInstance;
        }
        /**
         * - A global factory instance that can be used directly.
         * @version DragonBones 4.7
         * @language en_US
         */
        /**
         * - 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         * @language zh_CN
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
                PixiFactory._dragonBonesInstance = PixiFactory._createDragonBones();
            }

            this._dragonBones = PixiFactory._dragonBonesInstance;
        }
        /**
         * @inheritDoc
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
         * @inheritDoc
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
         * @inheritDoc
         */
        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData | null> | null, armature: Armature): Slot {
            // tslint:disable-next-line:no-unused-expression
            dataPackage;
            // tslint:disable-next-line:no-unused-expression
            armature;
            
            const slot = BaseObject.borrowObject(PixiSlot);

            slot.init(
                slotData, displays,
                new PIXI.Sprite(), new PIXI.mesh.Mesh(null as any, null as any, null as any, null as any, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES)
            );

            return slot;
        }
        /**
         * - Create a armature from cached DragonBonesData instances and TextureAtlasData instances, then use the {@link #clock} to update it.
         * The difference is that the armature created by {@link #buildArmature} is not WorldClock instance update.
         * @param armatureName - The armature data name.
         * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
         * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
         * @returns The armature display container.
         * @version DragonBones 4.5
         * @example
         * <pre>
         *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
         * </pre>
         * @language en_US
         */
        /**
         * - 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架，并用 {@link #clock} 更新该骨架。
         * 区别在于由 {@link #buildArmature} 创建的骨架没有 WorldClock 实例驱动。
         * @param armatureName - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
         * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。 （如果未设置，则使用默认的皮肤数据）
         * @returns 骨架的显示容器。
         * @version DragonBones 4.5
         * @example
         * <pre>
         *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
         * </pre>
         * @language zh_CN
         */
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = ""): PixiArmatureDisplay | null {
            const armature = this.buildArmature(armatureName, dragonBonesName || "", skinName || "", textureAtlasName || "");
            if (armature !== null) {
                this._dragonBones.clock.add(armature);

                return armature.display as PixiArmatureDisplay;
            }

            return null;
        }
        /**
         * - Create the display object with the specified texture.
         * @param textureName - The texture data name.
         * @param textureAtlasName - The texture atlas data name (Of not set, all texture atlas data will be searched)
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 创建带有指定贴图的显示对象。
         * @param textureName - 贴图数据名称。
         * @param textureAtlasName - 贴图集数据名称。 （如果未设置，将检索所有的贴图集数据）
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
         * - A global sound event manager.
         * Sound events can be listened to uniformly from the manager.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 全局声音事件管理器。
         * 声音事件可以从该管理器统一侦听。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get soundEventManager(): PixiArmatureDisplay {
            return this._dragonBones.eventManager as PixiArmatureDisplay;
        }

        /**
         * - Deprecated, please refer to {@link #clock}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #clock}。
         * @deprecated
         * @language zh_CN
         */
        public static get clock(): WorldClock {
            return PixiFactory.factory.clock;
        }
    }
}