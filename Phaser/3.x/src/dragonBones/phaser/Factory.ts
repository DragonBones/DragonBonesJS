namespace dragonBones.phaser {
    export class Factory extends BaseFactory {
        protected _scene: Phaser.Scene;
        protected _dragonBones: DragonBones;
        protected _cacheStore:Phaser.Cache.BaseCache;

        constructor(dragonBones: DragonBones, scene: Phaser.Scene, dataParser?: DataParser) {
            super(dataParser);
            this._scene = scene;
            this._dragonBones = dragonBones;
            this._cacheStore = scene.cache.addCustom("dragonbones");
        }

        protected _isSupportMesh(): boolean {
            console.warn("Mesh is not supported yet");

            return false;
        }

        protected _buildTextureAtlasData(textureAtlasData: display.TextureAtlasData, textureAtlas: any): TextureAtlasData {
            if (textureAtlasData) {
                const tex = this._scene.textures.addImage(textureAtlasData.name, textureAtlas);
                textureAtlasData.renderTexture = tex;
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

        buildArmatureDisplay(armatureName: string, dragonBonesName: string = "", skinName: string = "", textureAtlasName: string = ""): display.ArmatureDisplay {
            let armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature !== null) {
                this._dragonBones.clock.add(armature);
                return armature.display as display.ArmatureDisplay;
            } else {
                const cacheObject:util.CacheItem = this._cacheStore.get(dragonBonesName);
                if(cacheObject != null) {
                    const scale = cacheObject.scale;
                    this.addDragonBonesData(cacheObject.boneData, dragonBonesName);
                    this.parseTextureAtlasData(cacheObject.textureData, cacheObject.textureImage, cacheObject.textureImageKey, scale);
                    armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);

                    this._dragonBones.clock.add(armature);
                    return armature.display as display.ArmatureDisplay;
               }
            }

            return null;
        }
    }
}
