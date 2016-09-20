var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            return "[class dragonBones.PixiTextureAtlasData]";
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
            return "[class dragonBones.PixiTextureData]";
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
        }
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype._onClear = function () {
            this._armature = null;
            if (this._debugDrawer) {
                this._debugDrawer.destroy(true);
                this._debugDrawer = null;
            }
            this.destroy(true);
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
        PixiArmatureDisplay.prototype._debugDraw = function () {
            if (!this._debugDrawer) {
                this._debugDrawer = new PIXI.Graphics();
            }
            this.addChild(this._debugDrawer);
            this._debugDrawer.clear();
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneLength = Math.max(bone.length, 5);
                var startX = bone.globalTransformMatrix.tx;
                var startY = bone.globalTransformMatrix.ty;
                var endX = startX + bone.globalTransformMatrix.a * boneLength;
                var endY = startY + bone.globalTransformMatrix.b * boneLength;
                this._debugDrawer.lineStyle(1, bone.ik ? 0xFF0000 : 0x00FF00, 0.5);
                this._debugDrawer.moveTo(startX, startY);
                this._debugDrawer.lineTo(endX, endY);
            }
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
                dragonBones.PixiFactory._clock.add(this._armature);
            }
            else {
                dragonBones.PixiFactory._clock.remove(this._armature);
            }
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype.dispose = function () {
            if (this._armature) {
                this.advanceTimeBySelf(false);
                this._armature.dispose();
                this._armature = null;
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
        return PixiArmatureDisplay;
    }(PIXI.Container));
    dragonBones.PixiArmatureDisplay = PixiArmatureDisplay;
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
            return "[class dragonBones.PixiSlot]";
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
        PixiSlot.prototype._initDisplay = function (value) {
        };
        /**
         * @private
         */
        PixiSlot.prototype._disposeDisplay = function (value) {
            value.destroy();
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
        PixiSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateBlendMode = function () {
            switch (this._blendMode) {
                case 0 /* Normal */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.NORMAL;
                    break;
                case 1 /* Add */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.ADD;
                    break;
                case 3 /* Darken */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.DARKEN;
                    break;
                case 4 /* Difference */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.DIFFERENCE;
                    break;
                case 6 /* HardLight */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
                    break;
                case 9 /* Lighten */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.LIGHTEN;
                    break;
                case 10 /* Multiply */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.MULTIPLY;
                    break;
                case 11 /* Overlay */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.OVERLAY;
                    break;
                case 12 /* Screen */:
                    this._renderDisplay.blendMode = PIXI.BLEND_MODES.SCREEN;
                    break;
                default:
                    break;
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
                var currentTextureData = currentDisplayData.texture;
                if (currentTextureData) {
                    var textureAtlasTexture = currentTextureData.parent.texture;
                    if (!currentTextureData.texture && textureAtlasTexture) {
                        var originSize = new PIXI.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height);
                        currentTextureData.texture = new PIXI.Texture(textureAtlasTexture, currentTextureData.region, // No need to set frame.
                        currentTextureData.region, originSize, currentTextureData.rotated);
                    }
                    var texture = this._armature._replacedTexture || currentTextureData.texture;
                    if (this._meshData && this._display == this._meshDisplay) {
                        var meshDisplay = this._meshDisplay;
                        if (this._meshData != rawDisplayData.mesh && rawDisplayData && rawDisplayData != currentDisplayData) {
                            this._pivotX = rawDisplayData.transform.x - currentDisplayData.transform.x;
                            this._pivotY = rawDisplayData.transform.y - currentDisplayData.transform.y;
                        }
                        else {
                            this._pivotX = 0;
                            this._pivotY = 0;
                        }
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
                            meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasTexture.width;
                            meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasTexture.height;
                        }
                        meshDisplay.texture = texture;
                        meshDisplay.dirty = true;
                        // Identity transform.
                        if (this._meshData.skinned) {
                            meshDisplay.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);
                        }
                    }
                    else {
                        this._updatePivot(rawDisplayData, currentDisplayData, currentTextureData);
                        frameDisplay.texture = texture;
                    }
                    this._updateVisible();
                    return;
                }
            }
            this._pivotX = 0;
            this._pivotY = 0;
            frameDisplay.visible = false;
            frameDisplay.texture = null;
            frameDisplay.x = this.origin.x;
            frameDisplay.y = this.origin.y;
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
            // this._renderDisplay.worldTransform.copy(<PIXI.Matrix><any>this.globalTransformMatrix); // How to set matrix !?
            this._renderDisplay.setTransform(this.global.x, this.global.y, this.global.scaleX, this.global.scaleY, this.global.skewY, 0, 0, this._pivotX, this._pivotY);
        };
        return PixiSlot;
    }(dragonBones.Slot));
    dragonBones.PixiSlot = PixiSlot;
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
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        function PixiFactory(dataParser) {
            if (dataParser === void 0) { dataParser = null; }
            _super.call(this, dataParser);
            if (!PixiFactory._eventManager) {
                PixiFactory._eventManager = new dragonBones.PixiArmatureDisplay();
                PixiFactory._clock = new dragonBones.WorldClock();
                PIXI.ticker.shared.add(PixiFactory._clockHandler, PixiFactory);
            }
        }
        PixiFactory._clockHandler = function (passedTime) {
            PixiFactory._clock.advanceTime(-1); // passedTime !?
        };
        Object.defineProperty(PixiFactory, "factory", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局工厂实例.
             * @version DragonBones 4.7
             */
            get: function () {
                if (!PixiFactory._factory) {
                    PixiFactory._factory = new PixiFactory();
                }
                return PixiFactory._factory;
            },
            enumerable: true,
            configurable: true
        });
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
            armature._eventManager = PixiFactory._eventManager;
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
            slot._meshDisplay = new PIXI.mesh.Mesh(null, null, null, null, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
            for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                var displayData = slotDisplayDataSet.displays[i];
                switch (displayData.type) {
                    case 0 /* Image */:
                        if (!displayData.texture) {
                            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
                        }
                        displayList.push(slot._rawDisplay);
                        break;
                    case 2 /* Mesh */:
                        if (!displayData.texture) {
                            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
                        }
                        displayList.push(slot._meshDisplay);
                        break;
                    case 1 /* Armature */:
                        var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                        if (childArmature) {
                            if (!slot.inheritAnimation) {
                                var actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
                                if (actions.length > 0) {
                                    for (var i_1 = 0, l_1 = actions.length; i_1 < l_1; ++i_1) {
                                        childArmature._bufferAction(actions[i_1]);
                                    }
                                }
                                else {
                                    childArmature.animation.play();
                                }
                            }
                            displayData.armature = childArmature.armatureData; // 
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
                if (!textureData.texture) {
                    var textureAtlasTexture = textureData.parent.texture;
                    var originSize = new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height);
                    textureData.texture = new PIXI.Texture(textureAtlasTexture, null, textureData.region, originSize, textureData.rotated);
                }
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
                return PixiFactory._eventManager;
            },
            enumerable: true,
            configurable: true
        });
        PixiFactory._factory = null;
        /**
         * @private
         */
        PixiFactory._eventManager = null;
        /**
         * @private
         */
        PixiFactory._clock = null;
        return PixiFactory;
    }(dragonBones.BaseFactory));
    dragonBones.PixiFactory = PixiFactory;
})(dragonBones || (dragonBones = {}));
