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
            console.warn("Mesh is not supported yet");

            return false;
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
            const meshDisplay = rawDisplay;  // TODO: meshDisplay is not supported yet
            slot.init(slotData, armature, rawDisplay, meshDisplay);

            return slot;
        }

        // dragonBonesName must be assigned, or can't find in cache inside
        buildArmatureDisplay(armatureName: string, dragonBonesName: string, skinName: string = "", textureAtlasName: string = "", textureScale = 1.0): display.ArmatureDisplay {
            let armature: dragonBones.Armature;

            if (this.buildDragonBonesData(dragonBonesName, textureScale)) {
                armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            }

            return armature.display as display.ArmatureDisplay;
        }

        buildDragonBonesData(dragonBonesName: string, textureScale = 1.0): DragonBonesData {
            let data = this._dragonBonesDataMap[dragonBonesName];
            if (!data) {
                const cache = this._scene.cache;
                const boneRawData: any = cache.custom.dragonbone.get(dragonBonesName);
                if (boneRawData) {
                    // parse raw data and add to cache map
                    data = this.parseDragonBonesData(boneRawData, dragonBonesName, textureScale);

                    const texture = this._scene.textures.get(dragonBonesName);
                    const json = cache.json.get(`${dragonBonesName}_atlasjson`);

                    this.parseTextureAtlasData(json, texture, texture.key, textureScale);
                }
            }
            return data;
        }
    }
}
