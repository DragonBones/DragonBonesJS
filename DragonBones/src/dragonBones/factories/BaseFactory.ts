namespace dragonBones {
    /**
     * @private
     */
    export type BuildArmaturePackage = { dataName?: string, data?: DragonBonesData, armature?: ArmatureData, skin?: SkinData };

    export abstract class BaseFactory {
        public autoSearch: boolean = false;
        /**
         * @private
         */
        protected _objectDataParser: ObjectDataParser = new ObjectDataParser();
        /**
         * @private
         */
        protected _dragonBonesDataMap: Map<DragonBonesData> = {};
        /**
         * @private
         */
        protected _textureAtlasDataMap: Map<Array<TextureAtlasData>> = {};

        public constructor() {
        }

        protected _getTextureData(dragonBonesName: string, textureName: string): TextureData {
            let textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
            if (textureAtlasDataList) {
                for (let i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                    const textureData = textureAtlasDataList[i].getTextureData(textureName);
                    if (textureData) {
                        return textureData;
                    }
                }
            }

            if (this.autoSearch) {
                for (let i in this._textureAtlasDataMap) {
                    textureAtlasDataList = this._textureAtlasDataMap[i];
                    for (let j = 0, lJ = textureAtlasDataList.length; j < lJ; ++j) {
                        const textureAtlasData = textureAtlasDataList[i];
                        if (textureAtlasData.autoSearch) {
                            const textureData = textureAtlasData.getTextureData(textureName);
                            if (textureData) {
                                return textureData;
                            }
                        }
                    }
                }
            }

            return null;
        }
        /**
         * @private
         */
        protected _fillBuildArmaturePackage(dragonBonesName: string, armatureName: string, skinName: string, dataPackage: BuildArmaturePackage): boolean {
            if (dragonBonesName) {
                const dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                if (dragonBonesData) {
                    const armatureData = dragonBonesData.getArmature(armatureName);
                    if (armatureData) {
                        dataPackage.dataName = dragonBonesName;
                        dataPackage.data = dragonBonesData;
                        dataPackage.armature = armatureData;
                        dataPackage.skin = armatureData.getSkin(skinName);
                        if (!dataPackage.skin) {
                            dataPackage.skin = armatureData.defaultSkin;
                        }

                        return true;
                    }
                }
            }

            if (!dragonBonesName || this.autoSearch) {
                for (let eachDragonBonesName in this._dragonBonesDataMap) {
                    const dragonBonesData = this._dragonBonesDataMap[eachDragonBonesName];
                    if (!dragonBonesName || dragonBonesData.autoSearch) {
                        const armatureData = dragonBonesData.getArmature(armatureName);
                        if (armatureData) {
                            dataPackage.dataName = eachDragonBonesName;
                            dataPackage.data = dragonBonesData;
                            dataPackage.armature = armatureData;
                            dataPackage.skin = armatureData.getSkin(skinName);
                            if (!dataPackage.skin) {
                                dataPackage.skin = armatureData.defaultSkin;
                            }

                            return true;
                        }
                    }
                }
            }

            return false;
        }
        /**
         * @private
         */
        protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void {
            const bones = dataPackage.armature.sortedBones;

            for (let i = 0, l = bones.length; i < l; ++i) {
                const boneData = bones[i];
                const bone = BaseObject.borrowObject(Bone);

                bone.name = boneData.name;
                bone.inheritTranslation = boneData.inheritTranslation;
                bone.inheritRotation = boneData.inheritRotation;
                bone.inheritScale = boneData.inheritScale;
                bone.length = boneData.length;
                bone.origin.copyFrom(boneData.transform);

                if (boneData.parent) {
                    armature.addBone(bone, boneData.parent.name);
                } else {
                    armature.addBone(bone);
                }

                if (boneData.ik) {
                    bone.ikBendPositive = boneData.bendPositive;
                    bone.ikWeight = boneData.weight;
                    bone._setIK(armature.getBone(boneData.ik.name), boneData.chain, boneData.chainIndex);
                }
            }
        }
        /**
         * @private
         */
        protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void {
            const currentSkin = dataPackage.skin;
            const defaultSkin = dataPackage.armature.defaultSkin;
            const slotDisplayDataSetMap: Map<SlotDisplayDataSet> = {};

            for (let i in defaultSkin.slots) {
                const slotDisplayDataSet = defaultSkin.slots[i];
                slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
            }

            if (currentSkin != defaultSkin) {
                for (let i in currentSkin.slots) {
                    const slotDisplayDataSet = currentSkin.slots[i];
                    slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
                }
            }

            const slots = dataPackage.armature.sortedSlots;
            for (let i in slots) {
                const slotData = slots[i];
                const slotDisplayDataSet = slotDisplayDataSetMap[slotData.name];
                if (!slotDisplayDataSet) {
                    continue;
                }

                const slot = this._generateSlot(dataPackage, slotDisplayDataSet);

                slot._displayDataSet = slotDisplayDataSet;
                slot._setDisplayIndex(slotData.displayIndex);
                slot._setBlendMode(slotData.blendMode);
                slot._setColor(slotData.color);

                slot._replaceDisplayDataSet.length = slot._displayDataSet.displays.length;

                armature.addSlot(slot, slotData.parent.name);
            }
        }
        /**
         * @private
         */
        protected _replaceSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData, slot: Slot, displayIndex: number): void {
            if (displayIndex < 0) {
                displayIndex = slot.displayIndex;
            }

            if (displayIndex >= 0) {
                const displayList = slot.displayList; // Copy.
                if (displayList.length <= displayIndex) {
                    displayList.length = displayIndex + 1;
                }

                if (!displayData.textureData) {
                    displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                }

                if (displayData.type == DisplayType.Armature) {
                    const childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                    displayList[displayIndex] = childArmature;
                } else {
                    if (slot._replaceDisplayDataSet.length <= displayIndex) {
                        slot._replaceDisplayDataSet.length = displayIndex + 1;
                    }

                    slot._replaceDisplayDataSet[displayIndex] = displayData;

                    if (displayData.meshData) {
                        displayList[displayIndex] = slot.MeshDisplay;
                    } else {
                        displayList[displayIndex] = slot.rawDisplay;
                    }
                }

                slot.displayList = displayList;
                slot.invalidUpdate();
            }
        }

        protected abstract _generateTextureAtlasData(textureAtlasData: TextureAtlasData, textureAtlas: any): TextureAtlasData;
        protected abstract _generateArmature(dataPackage: BuildArmaturePackage): Armature;
        protected abstract _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet): Slot;

        public parseDragonBonesData(rawData: any, dragonBonesName: string = null): DragonBonesData {
            const dragonBonesData = this._objectDataParser.parseDragonBonesData(rawData);
            this.addDragonBonesData(dragonBonesData, dragonBonesName);

            return dragonBonesData;
        }

        public parseTextureAtlasData(rawData: any, textureAtlas: Object, name: string = null, scale: number = 0): TextureAtlasData {
            const textureAtlasData = this._generateTextureAtlasData(null, null);
            this._objectDataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);

            this._generateTextureAtlasData(textureAtlasData, textureAtlas);
            this.addTextureAtlasData(textureAtlasData, name);
            return textureAtlasData;
        }

        public getDragonBonesData(name: string): DragonBonesData {
            return this._dragonBonesDataMap[name];
        }

        public addDragonBonesData(data: DragonBonesData, dragonBonesName: string = null): void {
            if (data) {
                dragonBonesName = dragonBonesName || data.name;
                if (dragonBonesName) {
                    if (!this._dragonBonesDataMap[dragonBonesName]) {
                        this._dragonBonesDataMap[dragonBonesName] = data;
                    } else {
                        console.warn("Same name data.");
                    }
                } else {
                    console.warn("Unnamed data.");
                }
            } else {
                throw new Error();
            }
        }

        public removeDragonBonesData(dragonBonesName: string, disposeData: boolean = true): void {
            const dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
            if (dragonBonesData) {
                if (disposeData) {
                    dragonBonesData.returnToPool();
                }

                delete this._dragonBonesDataMap[dragonBonesName];
            }
        }

        public getTextureAtlasData(dragonBonesName: string): Array<TextureAtlasData> {
            return this._textureAtlasDataMap[dragonBonesName];
        }

        public addTextureAtlasData(data: TextureAtlasData, dragonBonesName: string = null): void {
            if (data) {
                dragonBonesName = dragonBonesName || data.name;
                if (dragonBonesName) {
                    const textureAtlasList = this._textureAtlasDataMap[dragonBonesName] = this._textureAtlasDataMap[dragonBonesName] || [];
                    if (textureAtlasList.indexOf(data) < 0) {
                        textureAtlasList.push(data);
                    }
                } else {
                    console.warn("Unnamed data.");
                }
            } else {
                throw new Error();
            }
        }

        public removeTextureAtlasData(dragonBonesName: string, disposeData: boolean = true): void {
            const textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
            if (textureAtlasDataList) {
                if (disposeData) {
                    for (let i in textureAtlasDataList) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }

                delete this._textureAtlasDataMap[dragonBonesName];
            }
        }

        public clear(disposeData: Boolean = true): void {

            for (let i in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBonesDataMap[i].returnToPool();
                }

                delete this._dragonBonesDataMap[i];
            }

            for (let i in this._textureAtlasDataMap) {
                if (disposeData) {
                    const textureAtlasDataList = this._dragonBonesDataMap[i];
                    for (let i in textureAtlasDataList) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }

                delete this._textureAtlasDataMap[i];
            }
        }

        public buildArmature(armatureName: string, dragonBonesName: string = null, skinName: string = null): Armature {
            const dataPackage: BuildArmaturePackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, skinName, dataPackage)) {
                const armature = this._generateArmature(dataPackage);
                this._buildBones(dataPackage, armature);
                this._buildSlots(dataPackage, armature);

                // Update armature pose
                armature.advanceTime(0);

                //
                armature._display._init();
                return armature;
            }

            return null;
        }

        public copyAnimationsToArmature(
            toArmature: Armature, fromArmatreName: string, fromSkinName: string = null,
            fromDragonBonesDataName: string = null, ifRemoveOriginalAnimationList: boolean = true
        ): boolean {
            const dataPackage: BuildArmaturePackage = {};
            if (this._fillBuildArmaturePackage(fromDragonBonesDataName, fromArmatreName, fromSkinName, dataPackage)) {
                const fromArmatureData = dataPackage.armature;
                if (ifRemoveOriginalAnimationList) {
                    toArmature.animation.animations = fromArmatureData.animations;
                } else {
                    const animations: Map<AnimationData> = {};
                    for (let animationName in toArmature.animation.animations) {
                        animations[animationName] = toArmature.animation.animations[animationName];
                    }

                    for (let animationName in fromArmatureData.animations) {
                        animations[animationName] = fromArmatureData.animations[animationName];
                    }

                    toArmature.animation.animations = animations;
                }

                if (dataPackage.skin) {
                    const slots = toArmature.getSlots();
                    for (let i in slots) {
                        const toSlot = slots[i];
                        const toSlotDisplayList = toSlot.displayList;
                        for (let i = 0, l = toSlotDisplayList.length; i < l; ++i) {
                            const toDisplayObject = toSlotDisplayList[i];
                            if (toDisplayObject instanceof Armature) {
                                const displays = dataPackage.skin.getSlot(toSlot.name).displays;
                                if (i < displays.length) {
                                    const fromDisplayData = displays[i];
                                    if (fromDisplayData.type == DisplayType.Armature) {
                                        this.copyAnimationsToArmature(<Armature>toDisplayObject, fromDisplayData.name, fromSkinName, fromDragonBonesDataName, ifRemoveOriginalAnimationList);
                                    }
                                }
                            }
                        }
                    }

                    return true;
                }
            }

            return false;
        }

        public replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex: number = -1): void {
            const dataPackage: BuildArmaturePackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, null, dataPackage)) {
                const slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
                if (slotDisplayDataSet) {
                    for (let i in slotDisplayDataSet.displays) {
                        const displayData = slotDisplayDataSet.displays[i];
                        if (displayData.name == displayName) {
                            this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex);
                            break;
                        }
                    }
                }
            }
        }
    }
}