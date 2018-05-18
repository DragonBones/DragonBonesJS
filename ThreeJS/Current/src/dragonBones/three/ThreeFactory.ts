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
     * - The ThreeJS factory.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - ThreeJS 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class ThreeFactory extends BaseFactory {
        /**
         * @private
         */
        public static readonly POOL_TYPE_VECTOR2: string = "POOL_TYPE_VECTOR2";
        /**
         * @private
         */
        public static readonly POOL_TYPE_VECTOR3: string = "POOL_TYPE_VECTOR3";
        /**
         * @private
         */
        public static readonly POOL_TYPE_FACE3: string = "POOL_TYPE_FACE3";

        private static readonly _emptyMaterial: THREE.Material = new THREE.MeshBasicMaterial();
        private static readonly _pools: Map<Array<any>> = {};
        private static _dragonBonesInstance: DragonBones = null as any;
        private static _factory: ThreeFactory = null as any;

        private static _createDragonBones(): DragonBones {
            const eventManager = new ThreeArmatureDisplay();
            const dragonBonesInstance = new DragonBones(eventManager);

            return dragonBonesInstance;
        }
        /**
         * @private
         */
        public static create<T>(type: string): T {
            let pool: Array<any>;
            if (type in ThreeFactory._pools) {
                pool = ThreeFactory._pools[type];
            }
            else {
                pool = ThreeFactory._pools[type] = [];
            }

            if (pool.length > 0) {
                return pool.pop();
            }

            switch (type) {
                case ThreeFactory.POOL_TYPE_VECTOR2:
                    return new THREE.Vector2() as any;

                case ThreeFactory.POOL_TYPE_VECTOR3:
                    return new THREE.Vector3() as any;

                case ThreeFactory.POOL_TYPE_FACE3:
                    return new THREE.Face3(0, 1, 2) as any;
            }

            throw new Error();
        }
        /**
         * @private
         */
        public static release(object: any, type: string): void {
            let pool: Array<any>;
            if (type in ThreeFactory._pools) {
                pool = ThreeFactory._pools[type];
            }
            else {
                pool = ThreeFactory._pools[type] = [];
            }

            if (pool.indexOf(object) < 0) {
                pool.push(object);
            }
            else {
                throw new Error();
            }
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
        public static get factory(): ThreeFactory {
            if (ThreeFactory._factory === null) {
                ThreeFactory._factory = new ThreeFactory();
            }

            return ThreeFactory._factory;
        }
        /**
         * @inheritDoc
         */
        public constructor(dataParser: DataParser | null = null) {
            super(dataParser);

            if (ThreeFactory._dragonBonesInstance === null) {
                ThreeFactory._dragonBonesInstance = ThreeFactory._createDragonBones();
            }

            this._dragonBones = ThreeFactory._dragonBonesInstance;
        }

        protected _buildTextureAtlasData(textureAtlasData: ThreeTextureAtlasData | null, textureAtlas: THREE.Texture | null): TextureAtlasData {
            if (textureAtlasData) {
                textureAtlasData.renderTexture = textureAtlas;
                const material = new THREE.MeshBasicMaterial();
                material.side = THREE.DoubleSide;
                material.transparent = true;

                if (textureAtlas !== null) {
                    material.map = textureAtlas;
                }

                textureAtlasData.material = material;
            }
            else {
                textureAtlasData = BaseObject.borrowObject(ThreeTextureAtlasData);
            }

            return textureAtlasData;
        }

        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplay = new ThreeArmatureDisplay();

            armature.init(
                dataPackage.armature,
                armatureDisplay, armatureDisplay, this._dragonBones
            );

            return armature;
        }

        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, armature: Armature): Slot {
            // tslint:disable-next-line:no-unused-expression
            dataPackage;
            // tslint:disable-next-line:no-unused-expression
            armature;

            const slot = BaseObject.borrowObject(ThreeSlot);
            const geometry = new THREE.Geometry();
            const rawDisplay = new THREE.Mesh(geometry, ThreeFactory._emptyMaterial);

            slot.init(
                slotData, armature,
                rawDisplay, rawDisplay
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
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = ""): ThreeArmatureDisplay | null {
            const armature = this.buildArmature(armatureName, dragonBonesName || "", skinName || "", textureAtlasName || "");
            if (armature !== null) {
                this._dragonBones.clock.add(armature);

                return armature.display as ThreeArmatureDisplay;
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
        public getTextureDisplay(textureName: string, textureAtlasName: string | null = null): THREE.Sprite | null {
            const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : "", textureName) as ThreeTextureData;
            if (textureData !== null) {
                const textureAtlasData = textureData.parent as ThreeTextureAtlasData;
                if (textureAtlasData.renderTexture !== null) {
                    const material = new THREE.SpriteMaterial({ map: textureAtlasData.renderTexture });
                    const sprite = new THREE.Sprite(material);

                    return sprite;
                }
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
        public get soundEventManager(): ThreeArmatureDisplay {
            return this._dragonBones.eventManager as ThreeArmatureDisplay;
        }
    }
}