namespace dragonBones {
    /**
     * @private
     */
    export class BuildArmaturePackage {
        public dataName: string = "";
        public textureAtlasName: string = "";
        public data: DragonBonesData;
        public armature: ArmatureData;
        public skin: SkinData | null = null;
    }
    /**
     * 创建骨架的基础工厂。 (通常只需要一个全局工厂实例)
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export abstract class BaseFactory {
        /**
         * @private
         */
        protected static _objectParser: ObjectDataParser = null as any;
        /**
         * @private
         */
        protected static _binaryParser: BinaryDataParser = null as any;
        /**
         * 是否开启共享搜索。
         * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
         * @see dragonBones.DragonBonesData#autoSearch
         * @see dragonBones.TextureAtlasData#autoSearch
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public autoSearch: boolean = false;
        /**
         * @private
         */
        protected readonly _dragonBonesDataMap: Map<DragonBonesData> = {};
        /**
         * @private
         */
        protected readonly _textureAtlasDataMap: Map<Array<TextureAtlasData>> = {};
        /** 
         * @private 
         */
        protected _dragonBones: DragonBones = null as any;
        /**
         * @private
         */
        protected _dataParser: DataParser = null as any;
        /**
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public constructor(dataParser: DataParser | null = null) {
            if (BaseFactory._objectParser === null) {
                BaseFactory._objectParser = new ObjectDataParser();
            }

            if (BaseFactory._binaryParser === null) {
                BaseFactory._binaryParser = new BinaryDataParser();
            }

            this._dataParser = dataParser !== null ? dataParser : BaseFactory._objectParser;
        }
        /** 
         * @private 
         */
        protected _isSupportMesh(): boolean {
            return true;
        }
        /** 
         * @private 
         */
        protected _getTextureData(textureAtlasName: string, textureName: string): TextureData | null {
            if (textureAtlasName in this._textureAtlasDataMap) {
                for (const textureAtlasData of this._textureAtlasDataMap[textureAtlasName]) {
                    const textureData = textureAtlasData.getTexture(textureName);
                    if (textureData !== null) {
                        return textureData;
                    }
                }
            }

            if (this.autoSearch) { // Will be search all data, if the autoSearch is true.
                for (let k in this._textureAtlasDataMap) {
                    for (const textureAtlasData of this._textureAtlasDataMap[k]) {
                        if (textureAtlasData.autoSearch) {
                            const textureData = textureAtlasData.getTexture(textureName);
                            if (textureData !== null) {
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
        protected _fillBuildArmaturePackage(
            dataPackage: BuildArmaturePackage,
            dragonBonesName: string, armatureName: string, skinName: string, textureAtlasName: string
        ): boolean {
            let dragonBonesData: DragonBonesData | null = null;
            let armatureData: ArmatureData | null = null;

            if (dragonBonesName.length > 0) {
                if (dragonBonesName in this._dragonBonesDataMap) {
                    dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                    armatureData = dragonBonesData.getArmature(armatureName);
                }
            }

            if (armatureData === null && (dragonBonesName.length === 0 || this.autoSearch)) { // Will be search all data, if do not give a data name or the autoSearch is true.
                for (let k in this._dragonBonesDataMap) {
                    dragonBonesData = this._dragonBonesDataMap[k];
                    if (dragonBonesName.length === 0 || dragonBonesData.autoSearch) {
                        armatureData = dragonBonesData.getArmature(armatureName);
                        if (armatureData !== null) {
                            dragonBonesName = k;
                            break;
                        }
                    }
                }
            }

            if (armatureData !== null) {
                dataPackage.dataName = dragonBonesName;
                dataPackage.textureAtlasName = textureAtlasName;
                dataPackage.data = dragonBonesData as any;
                dataPackage.armature = armatureData;
                dataPackage.skin = null;

                if (skinName.length > 0) {
                    dataPackage.skin = armatureData.getSkin(skinName);
                    if (dataPackage.skin === null && this.autoSearch) {
                        for (let k in this._dragonBonesDataMap) {
                            const skinDragonBonesData = this._dragonBonesDataMap[k];
                            const skinArmatureData = skinDragonBonesData.getArmature(skinName);
                            if (skinArmatureData !== null) {
                                dataPackage.skin = skinArmatureData.defaultSkin;
                                break;
                            }
                        }
                    }
                }

                if (dataPackage.skin === null) {
                    dataPackage.skin = armatureData.defaultSkin;
                }

                return true;
            }

            return false;
        }
        /**
         * @private
         */
        protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void {
            const bones = dataPackage.armature.sortedBones;
            for (let i = 0; i < (DragonBones.webAssembly ? (bones as any).size() : bones.length); ++i) {
                const boneData = DragonBones.webAssembly ? (bones as any).get(i) as BoneData : bones[i];
                const bone = DragonBones.webAssembly ? new Module["Bone"]() as Bone : BaseObject.borrowObject(Bone);
                bone.init(boneData);

                if (boneData.parent !== null) {
                    armature.addBone(bone, boneData.parent.name);
                }
                else {
                    armature.addBone(bone);
                }

                const constraints = boneData.constraints;
                for (let j = 0; j < (DragonBones.webAssembly ? (constraints as any).size() : constraints.length); ++j) {
                    const constraintData = DragonBones.webAssembly ? (constraints as any).get(j) as ConstraintData : constraints[j];
                    const target = armature.getBone(constraintData.target.name);
                    if (target === null) {
                        continue;
                    }

                    // TODO more constraint type.
                    const ikConstraintData = constraintData as IKConstraintData;
                    const constraint = DragonBones.webAssembly ? new Module["IKConstraint"]() as IKConstraint : BaseObject.borrowObject(IKConstraint);
                    const root = ikConstraintData.root !== null ? armature.getBone(ikConstraintData.root.name) : null;
                    constraint.target = target;
                    constraint.bone = bone;
                    constraint.root = root;
                    constraint.bendPositive = ikConstraintData.bendPositive;
                    constraint.scaleEnabled = ikConstraintData.scaleEnabled;
                    constraint.weight = ikConstraintData.weight;

                    if (root !== null) {
                        root.addConstraint(constraint);
                    }
                    else {
                        bone.addConstraint(constraint);
                    }
                }
            }
        }
        /**
         * @private
         */
        protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void {
            const currentSkin = dataPackage.skin;
            const defaultSkin = dataPackage.armature.defaultSkin;
            if (currentSkin === null || defaultSkin === null) {
                return;
            }

            const skinSlots: Map<Array<DisplayData | null>> = {};
            for (let k in defaultSkin.displays) {
                const displays = defaultSkin.displays[k];
                skinSlots[k] = displays;
            }

            if (currentSkin !== defaultSkin) {
                for (let k in currentSkin.displays) {
                    const displays = currentSkin.displays[k];
                    skinSlots[k] = displays;
                }
            }

            for (const slotData of dataPackage.armature.sortedSlots) {
                if (!(slotData.name in skinSlots)) {
                    continue;
                }

                const displays = skinSlots[slotData.name];
                const slot = this._buildSlot(dataPackage, slotData, displays, armature);
                const displayList = new Array<any>();
                for (const displayData of displays) {
                    if (displayData !== null) {
                        displayList.push(this._getSlotDisplay(dataPackage, displayData, null, slot));
                    }
                    else {
                        displayList.push(null);
                    }
                }

                armature.addSlot(slot, slotData.parent.name);
                slot._setDisplayList(displayList);
                slot._setDisplayIndex(slotData.displayIndex, true);
            }
        }
        /**
         * @private
         */
        protected _getSlotDisplay(dataPackage: BuildArmaturePackage | null, displayData: DisplayData, rawDisplayData: DisplayData | null, slot: Slot): any {
            const dataName = dataPackage !== null ? dataPackage.dataName : displayData.parent.parent.name;
            let display: any = null;
            switch (displayData.type) {
                case DisplayType.Image:
                    const imageDisplayData = displayData as ImageDisplayData;
                    if (imageDisplayData.texture === null) {
                        imageDisplayData.texture = this._getTextureData(dataName, displayData.path);
                    }
                    else if (dataPackage !== null && dataPackage.textureAtlasName.length > 0) {
                        imageDisplayData.texture = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
                    }

                    if (rawDisplayData !== null && rawDisplayData.type === DisplayType.Mesh && this._isSupportMesh()) {
                        display = slot.meshDisplay;
                    }
                    else {
                        display = slot.rawDisplay;
                    }
                    break;

                case DisplayType.Mesh:
                    const meshDisplayData = displayData as MeshDisplayData;
                    if (meshDisplayData.texture === null) {
                        meshDisplayData.texture = this._getTextureData(dataName, meshDisplayData.path);
                    }
                    else if (dataPackage !== null && dataPackage.textureAtlasName.length > 0) {
                        meshDisplayData.texture = this._getTextureData(dataPackage.textureAtlasName, meshDisplayData.path);
                    }

                    if (this._isSupportMesh()) {
                        display = slot.meshDisplay;
                    }
                    else {
                        display = slot.rawDisplay;
                    }
                    break;

                case DisplayType.Armature:
                    const armatureDisplayData = displayData as ArmatureDisplayData;
                    const childArmature = this.buildArmature(armatureDisplayData.path, dataName, null, dataPackage !== null ? dataPackage.textureAtlasName : null);
                    if (childArmature !== null) {
                        childArmature.inheritAnimation = armatureDisplayData.inheritAnimation;
                        if (!childArmature.inheritAnimation) {
                            const actions = armatureDisplayData.actions.length > 0 ? armatureDisplayData.actions : childArmature.armatureData.defaultActions;
                            if (actions.length > 0) {
                                for (const action of actions) {
                                    childArmature._bufferAction(action, true);
                                }
                            }
                            else {
                                childArmature.animation.play();
                            }
                        }

                        armatureDisplayData.armature = childArmature.armatureData; // 
                    }

                    display = childArmature;
                    break;
            }

            return display;
        }
        /**
         * @private
         */
        protected _replaceSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData | null, slot: Slot, displayIndex: number): void {
            if (displayIndex < 0) {
                displayIndex = slot.displayIndex;
            }

            if (displayIndex < 0) {
                displayIndex = 0;
            }

            const displayList = slot.displayList; // Copy.
            if (displayList.length <= displayIndex) {
                displayList.length = displayIndex + 1;

                for (let i = 0, l = displayList.length; i < l; ++i) { // Clean undefined.
                    if (!displayList[i]) {
                        displayList[i] = null;
                    }
                }
            }

            if (slot._displayDatas.length <= displayIndex) {
                slot._displayDatas.length = displayIndex + 1;

                for (let i = 0, l = slot._displayDatas.length; i < l; ++i) { // Clean undefined.
                    if (!slot._displayDatas[i]) {
                        slot._displayDatas[i] = null;
                    }
                }
            }

            slot._displayDatas[displayIndex] = displayData;
            if (displayData !== null) {
                displayList[displayIndex] = this._getSlotDisplay(
                    dataPackage,
                    displayData,
                    displayIndex < slot._rawDisplayDatas.length ? slot._rawDisplayDatas[displayIndex] : null,
                    slot
                );
            }
            else {
                displayList[displayIndex] = null;
            }

            slot.displayList = displayList;
        }
        /** 
         * @private 
         */
        protected abstract _buildTextureAtlasData(textureAtlasData: TextureAtlasData | null, textureAtlas: any): TextureAtlasData;
        /** 
         * @private 
         */
        protected abstract _buildArmature(dataPackage: BuildArmaturePackage): Armature;
        /** 
         * @private 
         */
        protected abstract _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData | null>, armature: Armature): Slot;
        /**
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。
         * @param name 为数据提供一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @returns DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public parseDragonBonesData(rawData: any, name: string | null = null, scale: number = 1.0): DragonBonesData | null {
            let dragonBonesData: DragonBonesData | null = null;
            if (rawData instanceof ArrayBuffer) {
                dragonBonesData = BaseFactory._binaryParser.parseDragonBonesData(rawData, scale);
            }
            else {
                dragonBonesData = this._dataParser.parseDragonBonesData(rawData, scale);
            }

            while (true) {
                const textureAtlasData = this._buildTextureAtlasData(null, null);
                if (this._dataParser.parseTextureAtlasData(null, textureAtlasData, scale)) {
                    this.addTextureAtlasData(textureAtlasData, name);
                }
                else {
                    textureAtlasData.returnToPool();
                    break;
                }
            }

            if (dragonBonesData !== null) {
                this.addDragonBonesData(dragonBonesData, name);
            }

            return dragonBonesData;
        }
        /**
         * 解析并添加贴图集数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param textureAtlas 贴图。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @param scale 为贴图集设置一个缩放值。
         * @returns 贴图集数据
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public parseTextureAtlasData(rawData: any, textureAtlas: any, name: string | null = null, scale: number = 0.0): TextureAtlasData {
            const textureAtlasData = this._buildTextureAtlasData(null, null);
            this._dataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);
            this._buildTextureAtlasData(textureAtlasData, textureAtlas || null);
            this.addTextureAtlasData(textureAtlasData, name);

            return textureAtlasData;
        }
        /**
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public updateTextureAtlasData(name: string, textureAtlases: Array<any>): void {
            const textureAtlasDatas = this.getTextureAtlasData(name);
            if (textureAtlasDatas !== null) {
                for (let i = 0, l = textureAtlasDatas.length; i < l; ++i) {
                    if (i < textureAtlases.length) {
                        this._buildTextureAtlasData(textureAtlasDatas[i], textureAtlases[i]);
                    }
                }
            }
        }
        /**
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @returns DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getDragonBonesData(name: string): DragonBonesData | null {
            return (name in this._dragonBonesDataMap) ? this._dragonBonesDataMap[name] : null;
        }
        /**
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public addDragonBonesData(data: DragonBonesData, name: string | null = null): void {
            name = name !== null ? name : data.name;
            if (name in this._dragonBonesDataMap) {
                if (this._dragonBonesDataMap[name] === data) {
                    return;
                }

                console.warn("Replace data: " + name);
                this._dragonBonesDataMap[name].returnToPool();
            }

            this._dragonBonesDataMap[name] = data;
        }
        /**
         * 移除龙骨数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public removeDragonBonesData(name: string, disposeData: boolean = true): void {
            if (name in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBones.bufferObject(this._dragonBonesDataMap[name]);
                }

                delete this._dragonBonesDataMap[name];
            }
        }
        /**
         * 获取指定名称的贴图集数据列表。
         * @param name 数据名称。
         * @returns 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public getTextureAtlasData(name: string): Array<TextureAtlasData> | null {
            return (name in this._textureAtlasDataMap) ? this._textureAtlasDataMap[name] : null;
        }
        /**
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public addTextureAtlasData(data: TextureAtlasData, name: string | null = null): void {
            name = name !== null ? name : data.name;
            const textureAtlasList = (name in this._textureAtlasDataMap) ? this._textureAtlasDataMap[name] : (this._textureAtlasDataMap[name] = []);
            if (textureAtlasList.indexOf(data) < 0) {
                textureAtlasList.push(data);
            }
        }
        /**
         * 移除贴图集数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public removeTextureAtlasData(name: string, disposeData: boolean = true): void {
            if (name in this._textureAtlasDataMap) {
                const textureAtlasDataList = this._textureAtlasDataMap[name];
                if (disposeData) {
                    for (const textureAtlasData of textureAtlasDataList) {
                        this._dragonBones.bufferObject(textureAtlasData);
                    }
                }

                delete this._textureAtlasDataMap[name];
            }
        }
        /**
         * 获取骨架数据。
         * @param name 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public getArmatureData(name: string, dragonBonesName: string = ""): ArmatureData | null {
            const dataPackage: BuildArmaturePackage = new BuildArmaturePackage();
            if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName, name, "", "")) {
                return null;
            }

            return dataPackage.armature;
        }
        /**
         * 清除所有的数据。
         * @param disposeData 是否释放数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public clear(disposeData: boolean = true): void {
            for (let k in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBones.bufferObject(this._dragonBonesDataMap[k]);
                }

                delete this._dragonBonesDataMap[k];
            }

            for (let k in this._textureAtlasDataMap) {
                if (disposeData) {
                    const textureAtlasDataList = this._textureAtlasDataMap[k];
                    for (const textureAtlasData of textureAtlasDataList) {
                        this._dragonBones.bufferObject(textureAtlasData);
                    }
                }

                delete this._textureAtlasDataMap[k];
            }
        }
        /**
         * 创建一个骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据名称。
         * @returns 骨架
         * @see dragonBones.ArmatureData
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public buildArmature(armatureName: string, dragonBonesName: string | null = null, skinName: string | null = null, textureAtlasName: string | null = null): Armature | null {
            const dataPackage: BuildArmaturePackage = new BuildArmaturePackage();
            if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName || "", armatureName, skinName || "", textureAtlasName || "")) {
                console.warn("No armature data. " + armatureName + ", " + (dragonBonesName !== null ? dragonBonesName : ""));
                return null;
            }

            const armature = this._buildArmature(dataPackage);
            this._buildBones(dataPackage, armature);
            this._buildSlots(dataPackage, armature);
            // armature.invalidUpdate(null, true); TODO
            armature.invalidUpdate("", true);
            armature.advanceTime(0.0); // Update armature pose.

            return armature;
        }
        /**
         * 用指定资源替换指定插槽的显示对象。(用 "dragonBonesName/armatureName/slotName/displayName" 的资源替换 "slot" 的显示对象)
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public replaceSlotDisplay(
            dragonBonesName: string | null, armatureName: string, slotName: string, displayName: string,
            slot: Slot, displayIndex: number = -1
        ): void {
            const dataPackage: BuildArmaturePackage = {} as any;
            if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName || "", armatureName, "", "") || dataPackage.skin === null) {
                return;
            }

            const displays = dataPackage.skin.getDisplays(slotName);
            if (displays === null) {
                return;
            }

            for (const display of displays) {
                if (display !== null && display.name === displayName) {
                    this._replaceSlotDisplay(dataPackage, display, slot, displayIndex);
                    break;
                }
            }
        }
        /**
         * 用指定资源列表替换插槽的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public replaceSlotDisplayList(
            dragonBonesName: string | null, armatureName: string, slotName: string,
            slot: Slot
        ): void {
            const dataPackage: BuildArmaturePackage = {} as any;
            if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName || "", armatureName, "", "") || dataPackage.skin === null) {
                return;
            }

            const displays = dataPackage.skin.getDisplays(slotName);
            if (displays === null) {
                return;
            }

            let displayIndex = 0;
            for (const displayData of displays) {
                this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex++);
            }
        }
        /**
         * 更换骨架皮肤。
         * @param armature 骨架。
         * @param skin 皮肤数据。
         * @param exclude 不需要更新的插槽。
         * @see dragonBones.Armature
         * @see dragonBones.SkinData
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public changeSkin(armature: Armature, skin: SkinData, exclude: Array<string> | null = null): void {
            for (const slot of armature.getSlots()) {
                if (!(slot.name in skin.displays) || (exclude !== null && exclude.indexOf(slot.name) >= 0)) {
                    continue;
                }

                const displays = skin.displays[slot.name];
                const displayList = slot.displayList; // Copy.
                displayList.length = displays.length; // Modify displayList length.
                for (let i = 0, l = displays.length; i < l; ++i) {
                    const displayData = displays[i];
                    if (displayData !== null) {
                        displayList[i] = this._getSlotDisplay(null, displayData, null, slot);
                    }
                    else {
                        displayList[i] = null;
                    }
                }

                slot._rawDisplayDatas = displays;
                slot._displayDatas.length = displays.length;
                for (let i = 0, l = slot._displayDatas.length; i < l; ++i) {
                    slot._displayDatas[i] = displays[i];
                }

                slot.displayList = displayList;
            }
        }
        /**
         * 将骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
         * @param toArmature 指定的骨架。
         * @param fromArmatreName 其他骨架的名称。
         * @param fromSkinName 其他骨架的皮肤名称，如果未设置，则使用默认皮肤。
         * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称，如果未设置，则检索所有的龙骨数据。
         * @param replaceOriginalAnimation 是否替换原有的同名动画。
         * @returns 是否替换成功。
         * @see dragonBones.Armature
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public copyAnimationsToArmature(
            toArmature: Armature,
            fromArmatreName: string, fromSkinName: string | null = null, fromDragonBonesDataName: string | null = null,
            replaceOriginalAnimation: boolean = true
        ): boolean {
            const dataPackage = new BuildArmaturePackage();
            if (this._fillBuildArmaturePackage(dataPackage, fromDragonBonesDataName || "", fromArmatreName, fromSkinName || "", "")) {
                const fromArmatureData = dataPackage.armature;
                if (replaceOriginalAnimation) {
                    toArmature.animation.animations = fromArmatureData.animations;
                }
                else {
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
                    for (let i = 0, l = slots.length; i < l; ++i) {
                        const toSlot = slots[i];
                        const toSlotDisplayList = toSlot.displayList;
                        for (let j = 0, lJ = toSlotDisplayList.length; j < lJ; ++j) {
                            const toDisplayObject = toSlotDisplayList[j];
                            if (toDisplayObject instanceof Armature) {
                                const displays = dataPackage.skin.getDisplays(toSlot.name);
                                if (displays !== null && j < displays.length) {
                                    const fromDisplayData = displays[j];
                                    if (fromDisplayData !== null && fromDisplayData.type === DisplayType.Armature) {
                                        this.copyAnimationsToArmature(toDisplayObject as Armature, fromDisplayData.path, fromSkinName, fromDragonBonesDataName, replaceOriginalAnimation);
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
        /** 
         * @private 
         */
        public getAllDragonBonesData(): Map<DragonBonesData> {
            return this._dragonBonesDataMap;
        }
        /** 
         * @private 
         */
        public getAllTextureAtlasData(): Map<Array<TextureAtlasData>> {
            return this._textureAtlasDataMap;
        }
    }
}