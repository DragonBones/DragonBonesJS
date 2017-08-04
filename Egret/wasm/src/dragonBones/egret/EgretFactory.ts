namespace dragonBones {
    /**
     * Egret 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export class EgretFactory extends BaseFactory {
        private static _time: number = 0;
        private static _dragonBones: DragonBones = null as any;
        private static _factory: EgretFactory | null = null;
        private static _eventManager: EgretArmatureDisplay;
        private static _clockHandler(time: number): boolean {
            const dbcore = EgretFactory._dragonBones as any;
            //
            const objects = dbcore.getObjects();
            for (let i = 0, l = objects.size(); i < l; ++i) {
                objects.get(i).returnToPool();
            }
            objects.resize(0, null);
            //
            time *= 0.001;
            const passedTime = time - EgretFactory._time;
            dbcore.clock.advanceTime(passedTime);
            EgretFactory._time = time;
            //
            const events = dbcore.getEvents();
            for (let i = 0, l = events.size(); i < l; ++i) {
                const eventObject = events.get(i);
                const armature = eventObject.armature;
                const type = eventObject.type;
                if (armature === null || armature.display === null || armature.display === undefined) {
                    console.log("armature display error!");
                }
                armature.display._dispatchEvent(type, eventObject);
                if (type === EventObject.SOUND_EVENT) {
                    EgretFactory._eventManager._dispatchEvent(eventObject.type, eventObject);
                }

                eventObject.returnToPool();
            }
            events.resize(0, null);

            return false;
        }
        /**
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public static get clock(): any {
            return EgretFactory._dragonBones.clock;
        }
        /**
         * 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        public static get factory(): EgretFactory {
            if (EgretFactory._factory === null) {
                registerGetterSetter();
                egretWASMInit();
                EgretFactory._factory = new EgretFactory();
            }

            return EgretFactory._factory;
        }
        /**
         * @private
         */
        private _rawTextures: any = null;
        /**
         * @inheritDoc
         */
        public constructor() {
            super();

            if (EgretFactory._dragonBones === null) {
                dragonBones.DragonBones.webAssembly = true;
                const eventDisplay = new EgretArmatureDisplay();
                EgretFactory._eventManager = eventDisplay;
                EgretFactory._dragonBones = new Module["DragonBones"]();
                EgretFactory._dragonBones.clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretFactory._clockHandler, EgretFactory);
            }
        }
        /** 
         * @private 
         */
        protected _isSupportMesh(): boolean {
            if (egret.Capabilities.renderMode === "webgl" || egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                return true;
            }

            console.warn("Canvas can not support mesh, please change renderMode to webgl.");

            return false;
        }
        /**
         * @private
         */
        protected _buildTextureAtlasData(textureAtlasData: any | null, textureAtlas: egret.Texture): TextureAtlasData {
            if (textureAtlasData !== null) {
                if ((textureAtlas as any)["textureId"] === null) {
                    (egret as any).WebAssemblyNode.setValuesToBitmapData(textureAtlas);
                }

                textureAtlasData.renderTexture = textureAtlas;
            }
            else {
                textureAtlasData = new EgretTextureAtlasData(this._rawTextures);
            }

            return textureAtlasData;
        }
        /**
         * @private
         */
        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = new Module['EgretArmature']();
            const armatureDisplay = new EgretArmatureDisplay();
            const armatureProxy = new EgretArmatureProxy(armatureDisplay);
            const displayID = (armatureDisplay as any).$waNode.id;
            armature.init(
                dataPackage.armature,
                armatureProxy, displayID, EgretFactory._dragonBones
            );
            armatureDisplay.init(armature);
            return armature;
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

            const currentSkinSlotNames: any = (currentSkin as any).getSkinSlotNames();
            const defaultSkinSlotNames: any = (defaultSkin as any).getSkinSlotNames();

            const skinSlots: Map<Array<DisplayData | null>> = {};
            // for (let k in defaultSkin.displays) {
            for (let i = 0, l = defaultSkinSlotNames.size(); i < l; ++i) {
                const slotName = defaultSkinSlotNames.get(i);
                const displays = defaultSkin.getDisplays(slotName);
                if (displays !== null) {
                    skinSlots[slotName] = displays;
                }
            }

            if (currentSkin !== defaultSkin) {
                // for (let k in currentSkin.displays) {
                for (let i = 0, l = currentSkinSlotNames.size(); i < l; ++i) {
                    const slotName = currentSkinSlotNames.get(i);
                    const displays = currentSkin.getDisplays(slotName);
                    if (displays !== null) {
                        skinSlots[slotName] = displays;
                    }
                }
            }

            // for (const slotData of dataPackage.armature.sortedSlots) {
            const slots = dataPackage.armature.sortedSlots as any;
            for (let i = 0, l = slots.size(); i < l; ++i) {
                const slotData = slots.get(i);
                if (!(slotData.name in skinSlots)) {
                    continue;
                }

                const displays = skinSlots[slotData.name];
                const slot = this._buildSlot(dataPackage, slotData, displays, armature);
                const displayList = new Module["EgretSlotDisplayVector"]();
                for (let i = 0, l = (displays as any).size(); i < l; ++i) {
                    const displayData = (displays as any).get(i);
                    if (displayData !== null) {
                        const display = this._getSlotDisplay(dataPackage, displayData, null, slot);
                        if (display === null) {
                            const displayWrapper = createEgretDisplay(display, DisplayType.Image);
                            displayList.push_back(displayWrapper);
                        }
                        else if (display.getDisplayType() === DisplayType.Armature) {
                            const displayWrapper = createEgretDisplay(display, DisplayType.Armature);
                            displayList.push_back(displayWrapper);
                        }
                        else {
                            displayList.push_back(display);
                        }
                    }
                    else {
                        const displayWrapper = createEgretDisplay(null, DisplayType.Image);
                        displayList.push_back(displayWrapper);
                    }
                }

                armature.addSlot(slot, slotData.parent.name);
                (slot as any)._setEgretDisplayList(displayList);
                slot._setDisplayIndex(slotData.displayIndex, true);
            }
        }
        /**
         * @private
         */
        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData | null>, armature: Armature): Slot {
            dataPackage;
            armature;
            const slot = new EgretSlot() as Slot;
            slot.init(
                slotData, displays,
                new egret.Bitmap(), new egret.Mesh()
            );

            return slot;
        }
        /**
         * @private
         */
        public parseTextureAtlasData(rawData: any, textureAtlas: any, name: string | null = null, scale: number = 0.0): TextureAtlasData {
            this._rawTextures = rawData ? rawData.SubTexture : null;

            return super.parseTextureAtlasData(rawData, textureAtlas, name, scale);
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
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string | null = null, skinName: string | null = null, textureAtlasName: string | null = null): EgretArmatureDisplay | null {
            const armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature !== null) {
                EgretFactory.clock.add(armature);
                return armature.display as EgretArmatureDisplay;
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
        public getTextureDisplay(textureName: string, textureAtlasName: string | null = null): egret.Bitmap | null {
            const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : "", textureName) as any;
            if (textureData !== null && textureData.texture === null) {
                return new egret.Bitmap(textureData.texture);
            }

            return null;
        }
        /*
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
                        display = (slot as any).getMeshWASMDisplay();
                    }
                    else {
                        display = (slot as any).getRawWASMDisplay();
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
                        display = (slot as any).getMeshWASMDisplay();
                    }
                    else {
                        display = (slot as any).getRawWASMDisplay();
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
                                    childArmature.animation.fadeIn(action.name); // TODO action should be do after advanceTime.
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
         * public
         */
        public changeSkin(armature: Armature, skin: SkinData, exclude: Array<string> | null = null): void {
            // for (const slot of armature.getSlots()) {
            let slots = armature.getSlots();
            for (let i = 0, l = (slots as any).size(); i < l; ++i) {
                let slot = (slots as any).get(i);
                if ((exclude !== null && exclude.indexOf(slot.name) >= 0)) {
                    continue;
                }
                const displays = (skin.displays as any).get(slot.name);
                if (displays === null || displays === undefined) {
                    continue;
                }
                const displayList = (slot as any).getEgretDisplayList(); // Copy.
                if (displayList === null || displayList === undefined) {
                    console.log("Slot does not has displayList" + slot.name);
                    continue;
                }
                const datalen = displays.size();
                displayList.resize(datalen, null);// Modify displayList length.

                for (let i = 0, l = displays.size(); i < l; ++i) {
                    let currData = displays.get(i);
                    let currSlot = this._getSlotDisplay(null, currData, null, slot);
                    if (currSlot.getDisplayType() == DisplayType.Armature) {
                        let displayWrapper = createEgretDisplay(currSlot, DisplayType.Armature);
                        displayList.set(i, displayWrapper);
                    }
                    else {
                        displayList.set(i, currSlot);
                    }
                }

                slot.switchDisplayData(displays);

                //TODO
                // slot.displayList = displayList;
                (slot as any).setEgretDisplayList(displayList);
            }
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
        public replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex: number = -1): void {
            const dataPackage: BuildArmaturePackage = {} as any;
            if (!this._fillBuildArmaturePackage(dataPackage, dragonBonesName || "", armatureName, "", "") || dataPackage.skin === null) {
                return;
            }

            const displays = dataPackage.skin.getDisplays(slotName);
            if (displays === null) {
                return;
            }

            // for (const display of displays) {
            for (let i = 0, l = (displays as any).size(); i < l; ++i) {
                let display = (displays as any).get(i);
                if (display !== null && display.name === displayName) {
                    this._replaceSlotDisplay(dataPackage, display, slot, displayIndex);
                    break;
                }
            }
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

            const displayList = (slot as any).getEgretDisplayList(); // Copy.
            if ((displayList as any).size() <= displayIndex) {
                (displayList as any).resize(displayIndex + 1, null);
            }

            (slot as any).replaceDisplayData(displayData, displayIndex);
            if (displayData !== null) {
                displayList.set(displayIndex, this._getSlotDisplay(dataPackage, displayData, null, slot));
            }
            else {
                displayList.set(displayIndex, null);
            }
            (slot as any).setEgretDisplayList(displayList);
        }
        /**
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get soundEventManager(): egret.EventDispatcher {
            return EgretFactory._eventManager;
        }
    }
}