/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
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
     * @internal
     */
    export const isV5 = Number(egret.Capabilities.engineVersion.substr(0, 3)) >= 5.1;
    /**
     * - The Egret factory.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Egret 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class EgretFactory extends BaseFactory {
        private static _time: number = 0.0;
        private static _dragonBonesInstance: DragonBones = null as any;
        private static _factory: EgretFactory | null = null;

        private static _clockHandler(time: number): boolean {
            time *= 0.001;

            const passedTime = time - this._time;
            EgretFactory._dragonBonesInstance.advanceTime(passedTime);
            this._time = time;

            return false;
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
        public static get factory(): EgretFactory {
            if (EgretFactory._factory === null) {
                EgretFactory._factory = new EgretFactory();
            }

            return EgretFactory._factory;
        }
        /**
         * @inheritDoc
         */
        public constructor(dataParser: DataParser | null = null) {
            super(dataParser);

            if (EgretFactory._dragonBonesInstance === null) {
                //
                const eventManager = new EgretArmatureDisplay();
                EgretFactory._dragonBonesInstance = new DragonBones(eventManager);
                EgretFactory._time = egret.getTimer() * 0.001;
                egret.startTick(EgretFactory._clockHandler, EgretFactory);
            }

            this._dragonBones = EgretFactory._dragonBonesInstance;
        }

        protected _isSupportMesh(): boolean {
            if (egret.Capabilities.renderMode === "webgl" || egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                return true;
            }

            console.warn("Canvas can not support mesh, please change renderMode to webgl.");

            return false;
        }

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

        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplay = new EgretArmatureDisplay();

            armature.init(
                dataPackage.armature,
                armatureDisplay, armatureDisplay, this._dragonBones
            );

            return armature;
        }

        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, armature: Armature): Slot {
            // tslint:disable-next-line:no-unused-expression
            dataPackage;

            const slot = BaseObject.borrowObject(EgretSlot);
            slot.init(
                slotData, armature,
                new egret.Bitmap(), new egret.Mesh()
            );

            return slot;
        }
        /**
         * - Create a armature from cached DragonBonesData instances and TextureAtlasData instances, then use the {@link #clock} to update it.
         * Note that when the created armature proxy that is no longer in use, you need to explicitly dispose {@link #dragonBones.IArmatureProxy#dispose()}.
         * The difference is that the armature created by {@link #buildArmature} is not WorldClock instance update.
         * @param armatureName - The armature data name.
         * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
         * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
         * @returns The armature display container.
         * @see dragonBones.IArmatureProxy
         * @see dragonBones.BaseFactory#buildArmature
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
         * 注意，创建的骨架代理不再使用时，需要显式释放 {@link #dragonBones.IArmatureProxy#dispose()}。
         * @param armatureName - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
         * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。（如果未设置，则使用默认的皮肤数据）
         * @returns 骨架的显示容器。
         * @see dragonBones.IArmatureProxy
         * @see dragonBones.BaseFactory#buildArmature
         * @version DragonBones 4.5
         * @example
         * <pre>
         *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
         * </pre>
         * @language zh_CN
         */
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = ""): EgretArmatureDisplay | null {
            const armature = this.buildArmature(armatureName, dragonBonesName || "", skinName || "", textureAtlasName || "");
            if (armature !== null) {
                this._dragonBones.clock.add(armature);

                return armature.display as EgretArmatureDisplay;
            }

            return null;
        }
        /**
         * - Create the display object with the specified texture.
         * @param textureName - The texture data name.
         * @param textureAtlasName - The texture atlas data name. (Of not set, all texture atlas data will be searched)
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
        public get soundEventManager(): EgretArmatureDisplay {
            return this._dragonBones.eventManager as EgretArmatureDisplay;
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
            return EgretFactory.factory.clock;
        }
        /**
         * - Deprecated, please refer to {@link #addDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #addDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        public addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName: string | null = null): void {
            console.warn("已废弃");
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        }
        /**
         * - Deprecated, please refer to {@link #getDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #getDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        public getSkeletonData(dragonBonesName: string) {
            console.warn("已废弃");
            return this.getDragonBonesData(dragonBonesName);
        }
        /**
         * - Deprecated, please refer to {@link #removeDragonBonesData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #removeDragonBonesData()}。
         * @deprecated
         * @language zh_CN
         */
        public removeSkeletonData(dragonBonesName: string): void {
            console.warn("已废弃");
            this.removeDragonBonesData(dragonBonesName);
        }
        /**
         * - Deprecated, please refer to {@link #addTextureAtlasData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #addTextureAtlasData()}。
         * @deprecated
         * @language zh_CN
         */
        public addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName: string | null = null): void {
            console.warn("已废弃");
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        }
        /**
         * - Deprecated, please refer to {@link #getTextureAtlas()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #getTextureAtlas()}。
         * @deprecated
         * @language zh_CN
         */
        public getTextureAtlas(dragonBonesName: string) {
            console.warn("已废弃");
            return this.getTextureAtlasData(dragonBonesName);
        }
        /**
         * - Deprecated, please refer to {@link #removeTextureAtlasData()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #removeTextureAtlasData()}。
         * @deprecated
         * @language zh_CN
         */
        public removeTextureAtlas(dragonBonesName: string): void {
            console.warn("已废弃");
            this.removeTextureAtlasData(dragonBonesName);
        }
        /**
         * - Deprecated, please refer to {@link #buildArmature()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #buildArmature()}。
         * @deprecated
         * @language zh_CN
         */
        public buildFastArmature(armatureName: string, dragonBonesName: string = "", skinName: string = ""): FastArmature | null {
            console.warn("已废弃");
            return this.buildArmature(armatureName, dragonBonesName || "", skinName || "");
        }
        /**
         * - Deprecated, please refer to {@link #clear()}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #clear()}。
         * @deprecated
         * @language zh_CN
         */
        public dispose(): void {
            console.warn("已废弃");
            this.clear();
        }
    }
}