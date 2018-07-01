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
    const {
        ccclass,
    } = cc._decorator;

    @ccclass
    class ClockHandler extends cc.Component {
        update(passedTime: number) {
            CocosFactory.factory.dragonBones.advanceTime(passedTime);
        }
    }
    /**
     * - The Cocos factory.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - Cocos 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class CocosFactory extends BaseFactory {
        private static _dragonBonesInstance: DragonBones = null as any;
        private static _factory: CocosFactory | null = null;
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
        public static get factory(): CocosFactory {
            if (this._factory === null) {
                this._factory = new CocosFactory();
            }

            return this._factory;
        }

        protected _node: cc.Node | null = null;
        protected _armatureNode: cc.Node | null = null;

        public constructor(dataParser: DataParser | null = null) {
            super(dataParser);

            if (!CC_EDITOR) { // Is playing.
                if (this._node === null) {
                    const nodeName = "DragonBones Node";
                    this._node = cc.find(nodeName);
                    if (this._node === null) {
                        this._node = new cc.Node(nodeName);
                        cc.game.addPersistRootNode(this._node);
                    }
                }

                if (!this._node.getComponent(ClockHandler)) {
                    this._node.addComponent(ClockHandler);
                }

                const eventManager = this._node.getComponent(CocosArmatureComponent) || this._node.addComponent(CocosArmatureComponent);
                if (CocosFactory._dragonBonesInstance === null) {
                    CocosFactory._dragonBonesInstance = new DragonBones(eventManager);
                    //
                    DragonBones.yDown = false;
                }
            }
            else {
                if (CocosFactory._dragonBonesInstance === null) {
                    CocosFactory._dragonBonesInstance = new DragonBones(null as any);
                    //
                    DragonBones.yDown = false;
                }
            }

            this._dragonBones = CocosFactory._dragonBonesInstance;
        }

        protected _isSupportMesh(): boolean {
            if ((cc as any)._renderType !== (cc.game as any).RENDER_TYPE_WEBGL) { // creator.d.ts error.
                console.warn("Only webgl mode can support mesh.");

                return false;
            }

            return true;
        }

        protected _buildTextureAtlasData(textureAtlasData: CocosTextureAtlasData | null, textureAtlas: cc.Texture2D | null): CocosTextureAtlasData {
            if (textureAtlasData !== null) {
                textureAtlasData.renderTexture = textureAtlas;
            }
            else {
                textureAtlasData = BaseObject.borrowObject(CocosTextureAtlasData);
            }

            return textureAtlasData;
        }

        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplay = this._armatureNode === null ? new cc.Node(dataPackage.armature.name) : this._armatureNode;
            const armatureComponent = armatureDisplay.getComponent(CocosArmatureComponent) || armatureDisplay.addComponent(CocosArmatureComponent);

            armatureDisplay.setOpacityModifyRGB(false);
            armatureDisplay.setCascadeOpacityEnabled(true);
            (armatureDisplay as any)._sgNode.setCascadeColorEnabled(true); // creator.d.ts error.

            this._armatureNode = null;
            armatureComponent._armature = armature;
            armature.init(
                dataPackage.armature,
                armatureComponent, armatureDisplay, this._dragonBones
            );

            return armature;
        }

        protected _buildChildArmature(dataPackage: BuildArmaturePackage | null, slot: Slot, displayData: ArmatureDisplayData): Armature | null {
            const childDisplayName = slot.slotData.name + " (" + displayData.path.replace("/", "_") + ")"; //
            const proxy = slot.armature.proxy as CocosArmatureComponent;
            let childNode = cc.find(childDisplayName, proxy.node);
            let childArmature: Armature | null = null;

            if (!childNode) {
                if (dataPackage !== null) {
                    childArmature = this.buildArmature(displayData.path, dataPackage.dataName);
                }
                else {
                    childArmature = this.buildArmature(displayData.path, displayData.parent.parent.parent.name);
                }
            }
            else {
                let childArmatureComponent: CocosArmatureComponent | null = childNode.getComponent(CocosArmatureComponent) || null;

                if (childArmatureComponent === null) {
                    if (dataPackage !== null) {
                        childArmatureComponent = this.buildArmatureComponent(displayData.path, dataPackage !== null ? dataPackage.dataName : "", "", dataPackage.textureAtlasName, childNode);
                    }
                    else {
                        childArmatureComponent = this.buildArmatureComponent(displayData.path, "", "", "", childNode);
                    }
                }

                if (childArmatureComponent !== null) {
                    childArmature = childArmatureComponent.armature;
                }
            }

            if (childArmature === null) {
                return null;
            }

            const childArmatureDisplay = childArmature.display as cc.Node;
            childArmatureDisplay.name = childDisplayName;

            if (childArmatureDisplay.parent !== proxy.node) {
                proxy.node.addChild(childArmatureDisplay, slot._zOrder);
            }

            childArmatureDisplay.active = false;

            return childArmature;
        }

        protected _buildSlot(_dataPackage: BuildArmaturePackage, slotData: SlotData, armature: Armature): Slot {
            const slot = BaseObject.borrowObject(CocosSlot);
            const armatureDisplay = armature.display as cc.Node;
            const rawSlotDisplay = cc.find(slotData.name, armatureDisplay) || new cc.Node(slotData.name);
            rawSlotDisplay.addComponent(cc.Sprite);
            rawSlotDisplay.setAnchorPoint(0.0, 0.0);
            rawSlotDisplay.setOpacityModifyRGB(false);
            rawSlotDisplay.setCascadeOpacityEnabled(true);
            (rawSlotDisplay as any)._sgNode.setCascadeColorEnabled(true); // creator.d.ts error.

            slot.init(
                slotData, armature,
                rawSlotDisplay, rawSlotDisplay
            );

            return slot;
        }
        /**
         * - Create a armature component from cached DragonBonesData instances and TextureAtlasData instances, then use the {@link #clock} to update it.
         * - The difference is that the armature created by {@link #buildArmature} is not WorldClock instance update.
         * - Note that when the created armature proxy that is no longer in use, you need to explicitly dispose {@link #dragonBones.IArmatureProxy#dispose()}.
         * @param armatureName - The armature data name.
         * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
         * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
         * @returns The armature component.
         * @see dragonBones.IArmatureProxy
         * @see dragonBones.BaseFactory#buildArmature
         * @version DragonBones 4.5
         * @example
         * 
         * <pre>
         *     let armatureComponent = factory.buildArmatureComponent("armatureName", "dragonBonesName");
         * </pre>
         * @language en_US
         */
        /**
         * - 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架组件，并用 {@link #clock} 更新该骨架。
         * - 区别在于由 {@link #buildArmature} 创建的骨架没有 WorldClock 实例驱动。
         * - 注意，创建的骨架代理不再使用时，需要显式释放 {@link #dragonBones.IArmatureProxy#dispose()}。
         * @param armatureName - 骨架数据名称。
         * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
         * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。（如果未设置，则使用默认的皮肤数据）
         * @returns 骨架组件。
         * @see dragonBones.IArmatureProxy
         * @see dragonBones.BaseFactory#buildArmature
         * @version DragonBones 4.5
         * @example
         * 
         * <pre>
         *     let armatureComponent = factory.buildArmatureComponent("armatureName", "dragonBonesName");
         * </pre>
         * @language zh_CN
         */
        public buildArmatureComponent(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = "", node: cc.Node | null = null): CocosArmatureComponent | null {
            this._armatureNode = node;
            const armature = this.buildArmature(armatureName, dragonBonesName || "", skinName || "", textureAtlasName || "");
            if (armature !== null) {
                this._dragonBones.clock.add(armature);

                return armature.proxy as CocosArmatureComponent;
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
        public getTextureDisplay(textureName: string, textureAtlasName: string | null = null): cc.Sprite | null {
            const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : "", textureName) as CocosTextureData;
            if (textureData !== null && textureData.renderTexture !== null) {
                const texture = textureData.renderTexture;
                const sprite = new cc.Sprite();
                sprite.spriteFrame = texture;

                return sprite;
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
        public get soundEventManager(): cc.Node {
            return (this._dragonBones.eventManager as CocosArmatureComponent).node;
        }
    }
}