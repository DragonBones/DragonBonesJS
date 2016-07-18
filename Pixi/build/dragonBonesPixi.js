var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dragonBones;
(function (dragonBones) {
    /**
     * @inheritDoc
     */
    var PixiArmatureDisplay = (function (_super) {
        __extends(PixiArmatureDisplay, _super);
        /**
         * @private
         */
        function PixiArmatureDisplay() {
            _super.call(this);
            if (!PixiArmatureDisplay._clock) {
                PixiArmatureDisplay._clock = new dragonBones.WorldClock();
                PIXI.ticker.shared.add(PixiArmatureDisplay._clockHandler, PixiArmatureDisplay);
            }
        }
        PixiArmatureDisplay._clockHandler = function (passedTime) {
            PixiArmatureDisplay._clock.advanceTime(-1); // passedTime !?
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype._onClear = function () {
            this.advanceTimeBySelf(false);
            this._armature = null;
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype._dispatchEvent = function (eventObject) {
            this.emit(eventObject.type, eventObject);
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype.hasEvent = function (type) {
            return this.listeners(type, true);
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype.addEvent = function (type, listener, target) {
            this.addListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype.removeEvent = function (type, listener, target) {
            this.removeListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                PixiArmatureDisplay._clock.add(this._armature);
            }
            else {
                PixiArmatureDisplay._clock.remove(this._armature);
            }
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype.dispose = function () {
            if (this._armature) {
                this._armature.dispose();
            }
        };
        Object.defineProperty(PixiArmatureDisplay.prototype, "armature", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PixiArmatureDisplay.prototype, "animation", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature.animation;
            },
            enumerable: true,
            configurable: true
        });
        PixiArmatureDisplay._clock = null;
        return PixiArmatureDisplay;
    }(PIXI.Container));
    dragonBones.PixiArmatureDisplay = PixiArmatureDisplay;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Pixi 工厂。
     * @version DragonBones 3.0
     */
    var PixiFactory = (function (_super) {
        __extends(PixiFactory, _super);
        /**
         * @language zh_CN
         * 创建一个工厂。
         * @version DragonBones 3.0
         */
        function PixiFactory() {
            _super.call(this);
            if (!dragonBones.Armature._soundEventManager) {
                dragonBones.Armature._soundEventManager = new dragonBones.PixiArmatureDisplay();
            }
        }
        /**
         * @private
         */
        PixiFactory.prototype._generateTextureAtlasData = function (textureAtlasData, textureAtlas) {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PixiTextureAtlasData);
            }
            return textureAtlasData;
        };
        /**
         * @private
         */
        PixiFactory.prototype._generateArmature = function (dataPackage) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            var armatureDisplayContainer = new dragonBones.PixiArmatureDisplay();
            armature._armatureData = dataPackage.armature;
            armature._skinData = dataPackage.skin;
            armature._animation = dragonBones.BaseObject.borrowObject(dragonBones.Animation);
            armature._display = armatureDisplayContainer;
            armatureDisplayContainer._armature = armature;
            armature._animation._armature = armature;
            armature.animation.animations = dataPackage.armature.animations;
            return armature;
        };
        /**
         * @private
         */
        PixiFactory.prototype._generateSlot = function (dataPackage, slotDisplayDataSet) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.PixiSlot);
            var slotData = slotDisplayDataSet.slot;
            var displayList = [];
            slot.name = slotData.name;
            slot._rawDisplay = new PIXI.Sprite();
            for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                var displayData = slotDisplayDataSet.displays[i];
                switch (displayData.type) {
                    case 0 /* Image */:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }
                        displayList.push(slot._rawDisplay);
                        break;
                    case 2 /* Mesh */:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }
                        if (!slot._meshDisplay) {
                            slot._meshDisplay = new PIXI.mesh.Mesh(null, null, null, null, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
                        }
                        displayList.push(slot._meshDisplay);
                        break;
                    case 1 /* Armature */:
                        var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                        if (childArmature) {
                            if (slotData.actions.length > 0) {
                                childArmature._action = slotData.actions[slotData.actions.length - 1];
                                childArmature.advanceTime(0);
                            }
                            else {
                                childArmature.animation.play();
                            }
                        }
                        displayList.push(childArmature);
                        break;
                    default:
                        displayList.push(null);
                        break;
                }
            }
            slot._setDisplayList(displayList);
            return slot;
        };
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @returns 骨架的显示容器。
         * @see dragonBones.IArmatureDisplayContainer
         * @version DragonBones 4.5
         */
        PixiFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName);
            var armatureDisplay = armature ? armature._display : null;
            if (armatureDisplay) {
                armatureDisplay.advanceTimeBySelf(true);
            }
            return armatureDisplay;
        };
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param dragonBonesName 指定的龙骨数据名称，如果未设置，将检索所有的龙骨数据。
         * @version DragonBones 3.0
         */
        PixiFactory.prototype.getTextureDisplay = function (textureName, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            var textureData = this._getTextureData(dragonBonesName, textureName);
            if (textureData) {
                return new PIXI.Sprite(textureData.texture);
            }
            return null;
        };
        Object.defineProperty(PixiFactory.prototype, "soundEventManater", {
            /**
             * @language zh_CN
             * 获取全局声音事件管理器。
             * @version DragonBones 4.5
             */
            get: function () {
                return dragonBones.Armature._soundEventManager;
            },
            enumerable: true,
            configurable: true
        });
        return PixiFactory;
    }(dragonBones.BaseFactory));
    dragonBones.PixiFactory = PixiFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Pixi 插槽。
     * @version DragonBones 3.0
     */
    var PixiSlot = (function (_super) {
        __extends(PixiSlot, _super);
        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        function PixiSlot() {
            _super.call(this);
        }
        /**
         * @private
         */
        PixiSlot.toString = function () {
            return "[Class dragonBones.PixiSlot]";
        };
        /**
         * @inheritDoc
         */
        PixiSlot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._renderDisplay = null;
        };
        /**
         * @private
         */
        PixiSlot.prototype._onUpdateDisplay = function () {
            if (!this._rawDisplay) {
                this._rawDisplay = new PIXI.Sprite();
            }
            this._renderDisplay = (this._display || this._rawDisplay);
        };
        /**
         * @private
         */
        PixiSlot.prototype._initDisplay = function (value) {
        };
        /**
         * @private
         */
        PixiSlot.prototype._addDisplay = function () {
            var container = this._armature._display;
            container.addChild(this._renderDisplay);
        };
        /**
         * @private
         */
        PixiSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature._display;
            var prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        };
        /**
         * @private
         */
        PixiSlot.prototype._removeDisplay = function () {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        };
        /**
         * @private
         */
        PixiSlot.prototype._disposeDisplay = function (value) {
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateBlendMode = function () {
            if (this._blendMode < PixiSlot.BLEND_MODE_LIST.length) {
                var blendMode = PixiSlot.BLEND_MODE_LIST[this._blendMode];
                if (blendMode > 0 && this._renderDisplay instanceof PIXI.Sprite) {
                    this._renderDisplay.blendMode = blendMode;
                }
            }
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateColor = function () {
            this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateFilters = function () { };
        /**
         * @private
         */
        PixiSlot.prototype._updateFrame = function () {
            var frameDisplay = this._renderDisplay;
            if (this._display && this._displayIndex >= 0) {
                var rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
                var replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
                var currentDisplayData = replacedDisplayData || rawDisplayData;
                var currentTextureData = currentDisplayData.textureData;
                if (currentTextureData) {
                    if (!currentTextureData.texture) {
                        var textureAtlasTexture = currentTextureData.parent.texture;
                        if (textureAtlasTexture) {
                            var originSize = new PIXI.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height);
                            currentTextureData.texture = new PIXI.Texture(textureAtlasTexture, null, currentTextureData.region, originSize, currentTextureData.rotated);
                        }
                    }
                    var texture = this._armature._replacedTexture || currentTextureData.texture;
                    if (texture) {
                        if (this._meshData && this._display == this._meshDisplay) {
                            var meshDisplay = this._meshDisplay;
                            /*
                            for (let i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                                meshDisplay.uvs[i] = this._meshData.uvs[i];
                                meshDisplay.vertices[i] = this._meshData.vertices[i];
                            }

                            for (let i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
                                meshDisplay.indices[i] = this._meshData.vertexIndices[i];
                            }
                            */
                            meshDisplay.uvs = new Float32Array(this._meshData.uvs);
                            meshDisplay.vertices = new Float32Array(this._meshData.vertices);
                            meshDisplay.indices = new Uint16Array(this._meshData.vertexIndices);
                            for (var i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                                var u = meshDisplay.uvs[i];
                                var v = meshDisplay.uvs[i + 1];
                                meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / texture.baseTexture.width;
                                meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / texture.baseTexture.height;
                            }
                            meshDisplay.texture = texture;
                            meshDisplay.dirty = true;
                        }
                        else {
                            var rect = currentTextureData.frame || currentTextureData.region;
                            var width = rect.width;
                            var height = rect.height;
                            if (currentTextureData.rotated) {
                                width = rect.height;
                                height = rect.width;
                            }
                            var pivotX = currentDisplayData.pivot.x;
                            var pivotY = currentDisplayData.pivot.y;
                            if (currentDisplayData.isRelativePivot) {
                                pivotX = width * pivotX;
                                pivotY = height * pivotY;
                            }
                            if (currentTextureData.frame) {
                                pivotX += currentTextureData.frame.x;
                                pivotY += currentTextureData.frame.y;
                            }
                            if (rawDisplayData && replacedDisplayData) {
                                pivotX += rawDisplayData.transform.x - replacedDisplayData.transform.x;
                                pivotY += rawDisplayData.transform.y - replacedDisplayData.transform.y;
                            }
                            frameDisplay.texture = texture;
                            frameDisplay.pivot.set(pivotX, pivotY);
                        }
                        this._updateVisible();
                        return;
                    }
                }
            }
            frameDisplay.visible = false;
            frameDisplay.texture = null;
            frameDisplay.pivot.set(0, 0);
            frameDisplay.x = 0;
            frameDisplay.y = 0;
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateMesh = function () {
            var meshDisplay = this._meshDisplay;
            var hasFFD = this._ffdVertices.length > 0;
            if (this._meshData.skinned) {
                for (var i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var iH = i / 2;
                    var boneIndices = this._meshData.boneIndices[iH];
                    var boneVertices = this._meshData.boneVertices[iH];
                    var weights = this._meshData.weights[iH];
                    var xG = 0, yG = 0;
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var bone = this._meshBones[boneIndices[iB]];
                        var matrix = bone.globalTransformMatrix;
                        var weight = weights[iB];
                        var xL = 0, yL = 0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                        }
                        else {
                            xL = boneVertices[iB * 2];
                            yL = boneVertices[iB * 2 + 1];
                        }
                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        iF += 2;
                    }
                    meshDisplay.vertices[i] = xG;
                    meshDisplay.vertices[i + 1] = yG;
                }
            }
            else if (hasFFD) {
                var vertices = this._meshData.vertices;
                for (var i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var xG = vertices[i] + this._ffdVertices[i];
                    var yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshDisplay.vertices[i] = xG;
                    meshDisplay.vertices[i + 1] = yG;
                }
            }
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateTransform = function () {
            //this._renderDisplay.worldTransform.copy(<PIXI.Matrix><any>this.globalTransformMatrix); // How to set matrix !?
            this._renderDisplay.setTransform(this.global.x, this.global.y, this.global.scaleX, this.global.scaleY, this.global.skewY, 0, 0, this._renderDisplay.pivot.x, this._renderDisplay.pivot.y);
        };
        /**
         * @private
         */
        PixiSlot.BLEND_MODE_LIST = [
            PIXI.BLEND_MODES.NORMAL,
            PIXI.BLEND_MODES.ADD,
            -1,
            PIXI.BLEND_MODES.DARKEN,
            PIXI.BLEND_MODES.DIFFERENCE,
            -1,
            PIXI.BLEND_MODES.HARD_LIGHT,
            -1,
            -1,
            PIXI.BLEND_MODES.LIGHTEN,
            PIXI.BLEND_MODES.MULTIPLY,
            PIXI.BLEND_MODES.OVERLAY,
            PIXI.BLEND_MODES.SCREEN,
            -1
        ];
        return PixiSlot;
    }(dragonBones.Slot));
    dragonBones.PixiSlot = PixiSlot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Pixi 贴图集数据。
     * @version DragonBones 3.0
     */
    var PixiTextureAtlasData = (function (_super) {
        __extends(PixiTextureAtlasData, _super);
        /**
         * @private
         */
        function PixiTextureAtlasData() {
            _super.call(this);
        }
        /**
         * @private
         */
        PixiTextureAtlasData.toString = function () {
            return "[Class dragonBones.PixiTextureAtlasData]";
        };
        /**
         * @inheritDoc
         */
        PixiTextureAtlasData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        };
        /**
         * @private
         */
        PixiTextureAtlasData.prototype.generateTextureData = function () {
            return dragonBones.BaseObject.borrowObject(PixiTextureData);
        };
        return PixiTextureAtlasData;
    }(dragonBones.TextureAtlasData));
    dragonBones.PixiTextureAtlasData = PixiTextureAtlasData;
    /**
     * @private
     */
    var PixiTextureData = (function (_super) {
        __extends(PixiTextureData, _super);
        function PixiTextureData() {
            _super.call(this);
        }
        PixiTextureData.toString = function () {
            return "[Class dragonBones.PixiTextureData]";
        };
        /**
         * @inheritDoc
         */
        PixiTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture.destroy(false);
                this.texture = null;
            }
        };
        return PixiTextureData;
    }(dragonBones.TextureData));
    dragonBones.PixiTextureData = PixiTextureData;
})(dragonBones || (dragonBones = {}));
