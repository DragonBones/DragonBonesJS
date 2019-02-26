namespace dragonBones.phaser {
    export class Factory extends BaseFactory {
        protected _scene: Phaser.Scene;
        protected _dragonBones: DragonBones;

        constructor(dragonBones: DragonBones, scene: Phaser.Scene, dataParser?: DataParser) {
            super(dataParser);
            this._scene = scene;
            this._dragonBones = dragonBones;
        }

        protected _isSupportMesh(): boolean {
            return true;
        }

        protected _buildTextureAtlasData(textureAtlasData: display.TextureAtlasData, textureAtlas: Phaser.Textures.Texture): TextureAtlasData {
            if (textureAtlasData) {
                textureAtlasData.renderTexture = textureAtlas;
            } else
                textureAtlasData = BaseObject.borrowObject(display.TextureAtlasData);

            return textureAtlasData;
        }

        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplay = new display.ArmatureDisplay(this._scene);

            armature.init(
                dataPackage.armature,
                armatureDisplay, armatureDisplay, this._dragonBones
            );

            return armature;
        }

        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, armature: Armature): Slot {
            const slot = BaseObject.borrowObject(display.Slot);
            const rawDisplay = this._scene.dragonbone.createSlotDisplayPlaceholder();
            const meshDisplay = this._scene.dragonbone.createMeshDisplayPlaceholder();
            slot.init(slotData, armature, rawDisplay, meshDisplay);

            return slot;
        }

        buildArmatureDisplay(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = "", textureScale = 1.0): display.ArmatureDisplay {
            let armature: dragonBones.Armature;

            if (!this._dragonBonesDataMap[dragonBonesName]) {
                const cache = this._scene.cache;
                const boneRawData: any = cache.custom.dragonbone.get(dragonBonesName);
                if (boneRawData != null) {
                    // parse raw data and add to cache map
                    this.parseDragonBonesData(boneRawData, dragonBonesName, textureScale);

                    const texture = this._scene.textures.get(dragonBonesName);
                    const json = cache.json.get(`${dragonBonesName}_atlasjson`);

                    this.parseTextureAtlasData(json, texture, texture.key, textureScale);
                    armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
                }
            } else
                armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);

            return armature.display as display.ArmatureDisplay;
        }

        /**
         * - A global sound event manager.
         * Sound events can be listened to uniformly from the manager.
         * @version DragonBones 4.5
         * @language en_US
         */
        public get soundEventManager(): display.ArmatureDisplay {
            return this._dragonBones.eventManager as display.ArmatureDisplay;
        }        
    }
}
