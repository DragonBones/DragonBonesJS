var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        PixiTextureAtlasData.toString = function () {
            return "[class dragonBones.PixiTextureAtlasData]";
        };
        /**
         * @private
         */
        PixiTextureAtlasData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
            }
            this.texture = null;
        };
        /**
         * @private
         */
        PixiTextureAtlasData.prototype.generateTexture = function () {
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
            return _super.call(this) || this;
        }
        PixiTextureData.toString = function () {
            return "[class dragonBones.PixiTextureData]";
        };
        PixiTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture.destroy();
            }
            this.texture = null;
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
         * @internal
         * @private
         */
        function PixiArmatureDisplay() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        PixiArmatureDisplay.prototype._onClear = function () {
            if (this._debugDrawer) {
                this._debugDrawer.destroy(true);
            }
            this._armature = null;
            this._debugDrawer = null;
            this.destroy();
        };
        /**
         * @private
         */
        PixiArmatureDisplay.prototype._dispatchEvent = function (type, eventObject) {
            this.emit(type, eventObject);
        };
        /**
         * @private
         */
        PixiArmatureDisplay.prototype._debugDraw = function (isEnabled) {
            if (!this._debugDrawer) {
                this._debugDrawer = new PIXI.Sprite();
                var boneDrawer = new PIXI.Graphics();
                this._debugDrawer.addChild(boneDrawer);
            }
            if (isEnabled) {
                this.addChild(this._debugDrawer);
                var boneDrawer = this._debugDrawer.getChildAt(0);
                boneDrawer.clear();
                var bones = this._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    var boneLength = bone.boneData.length;
                    var startX = bone.globalTransformMatrix.tx;
                    var startY = bone.globalTransformMatrix.ty;
                    var endX = startX + bone.globalTransformMatrix.a * boneLength;
                    var endY = startY + bone.globalTransformMatrix.b * boneLength;
                    boneDrawer.lineStyle(2, bone.ik ? 0xFF0000 : 0x00FFFF, 0.7);
                    boneDrawer.moveTo(startX, startY);
                    boneDrawer.lineTo(endX, endY);
                    boneDrawer.lineStyle(0, 0, 0);
                    boneDrawer.beginFill(0x00FFFF, 0.7);
                    boneDrawer.drawCircle(startX, startY, 3);
                    boneDrawer.endFill();
                }
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    var boundingBoxData = slot.boundingBoxData;
                    if (boundingBoxData) {
                        var child = this._debugDrawer.getChildByName(slot.name);
                        if (!child) {
                            child = new PIXI.Graphics();
                            child.name = slot.name;
                            this._debugDrawer.addChild(child);
                        }
                        child.clear();
                        child.beginFill(0xFF00FF, 0.3);
                        switch (boundingBoxData.type) {
                            case 0 /* Rectangle */:
                                child.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;
                            case 1 /* Ellipse */:
                                child.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;
                            case 2 /* Polygon */:
                                var vertices = boundingBoxData.vertices;
                                for (var i_1 = 0, l_1 = boundingBoxData.vertices.length; i_1 < l_1; i_1 += 2) {
                                    if (i_1 === 0) {
                                        child.moveTo(vertices[i_1], vertices[i_1 + 1]);
                                    }
                                    else {
                                        child.lineTo(vertices[i_1], vertices[i_1 + 1]);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        child.endFill();
                        slot._updateTransformAndMatrix();
                        slot.updateGlobalTransform();
                        var transform = slot.global;
                        child.setTransform(transform.x, transform.y, transform.scaleX, transform.scaleY, transform.skewX, 0.0, transform.skewY - transform.skewX, slot._pivotX, slot._pivotY);
                    }
                    else {
                        var child = this._debugDrawer.getChildByName(slot.name);
                        if (child) {
                            this._debugDrawer.removeChild(child);
                        }
                    }
                }
            }
            else if (this._debugDrawer && this._debugDrawer.parent === this) {
                this.removeChild(this._debugDrawer);
            }
        };
        /**
         * @inheritDoc
         */
        PixiArmatureDisplay.prototype.hasEvent = function (type) {
            return this.listeners(type, true); // .d.ts bug
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
        PixiArmatureDisplay.prototype.dispose = function (disposeProxy) {
            if (disposeProxy === void 0) { disposeProxy = true; }
            if (this._armature) {
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
        /**
         * @deprecated
         * @see dragonBones.Armature#clock
         * @see dragonBones.PixiFactory#clock
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        PixiArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                this._armature.clock = dragonBones.PixiFactory.clock;
            }
            else {
                this._armature.clock = null;
            }
        };
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
         * @internal
         * @private
         */
        function PixiSlot() {
            var _this = _super.call(this) || this;
            _this._updateTransform = PIXI.VERSION[0] === "3" ? _this._updateTransformV3 : _this._updateTransformV4;
            return _this;
        }
        /**
         * @private
         */
        PixiSlot.toString = function () {
            return "[class dragonBones.PixiSlot]";
        };
        /**
         * @private
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
            this._renderDisplay = (this._display ? this._display : this._rawDisplay);
        };
        /**
         * @private
         */
        PixiSlot.prototype._addDisplay = function () {
            var container = this._armature.display;
            container.addChild(this._renderDisplay);
        };
        /**
         * @private
         */
        PixiSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature.display;
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
        PixiSlot.prototype._updateZOrder = function () {
            var container = this._armature.display;
            var index = container.getChildIndex(this._renderDisplay);
            if (index === this._zOrder) {
                return;
            }
            container.addChildAt(this._renderDisplay, this._zOrder);
        };
        /**
         * @internal
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
        PixiSlot.prototype._updateFrame = function () {
            var isMeshDisplay = this._meshData && this._display === this._meshDisplay;
            var currentTextureData = this._textureData;
            if (this._displayIndex >= 0 && this._display && currentTextureData) {
                var currentTextureAtlasData = currentTextureData.parent;
                // Update replaced texture atlas.
                if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData;
                    if (!currentTextureAtlasData) {
                        currentTextureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PixiTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.texture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);
                }
                var currentTextureAtlas = currentTextureAtlasData.texture;
                if (currentTextureAtlas) {
                    if (!currentTextureData.texture) {
                        currentTextureData.texture = new PIXI.Texture(currentTextureAtlas, currentTextureData.region, // No need to set frame.
                        currentTextureData.region, new PIXI.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height), currentTextureData.rotated // .d.ts bug
                        );
                    }
                    if (isMeshDisplay) {
                        var meshDisplay = this._renderDisplay;
                        var textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
                        var textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;
                        meshDisplay.uvs = new Float32Array(this._meshData.uvs);
                        meshDisplay.vertices = new Float32Array(this._meshData.vertices);
                        meshDisplay.indices = new Uint16Array(this._meshData.vertexIndices);
                        for (var i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                            var u = meshDisplay.uvs[i];
                            var v = meshDisplay.uvs[i + 1];
                            meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
                            meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
                        }
                        meshDisplay.texture = currentTextureData.texture;
                        //meshDisplay.dirty = true; // Pixi 3.x
                        meshDisplay.dirty++; // Pixi 4.x Can not support change mesh vertice count.
                    }
                    else {
                        var normalDisplay = this._renderDisplay;
                        normalDisplay.texture = currentTextureData.texture;
                    }
                    this._updateVisible();
                    return;
                }
            }
            if (isMeshDisplay) {
                var meshDisplay = this._renderDisplay;
                meshDisplay.texture = null;
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
                meshDisplay.visible = false;
            }
            else {
                var normalDisplay = this._renderDisplay;
                normalDisplay.texture = null;
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
                normalDisplay.visible = false;
            }
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateMesh = function () {
            var meshDisplay = this._renderDisplay;
            var hasFFD = this._ffdVertices.length > 0;
            if (this._meshData.skinned) {
                for (var i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var iH = i / 2;
                    var boneIndices = this._meshData.boneIndices[iH];
                    var boneVertices = this._meshData.boneVertices[iH];
                    var weights = this._meshData.weights[iH];
                    var xG = 0.0, yG = 0.0;
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var bone = this._meshBones[boneIndices[iB]];
                        var matrix = bone.globalTransformMatrix;
                        var weight = weights[iB];
                        var xL = 0.0, yL = 0.0;
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
        PixiSlot.prototype._updateTransform = function (isSkinnedMesh) {
            throw new Error();
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateTransformV3 = function (isSkinnedMesh) {
            if (isSkinnedMesh) {
                this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
            }
            else {
                this.updateGlobalTransform(); // Update transform.
                var x = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY); // Pixi pivot do not work.
                var y = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY); // Pixi pivot do not work.
                var transform = this.global;
                this._renderDisplay.setTransform(x, y, transform.scaleX, transform.scaleY, transform.skewX, 0.0, transform.skewY - transform.skewX);
            }
        };
        /**
         * @private
         */
        PixiSlot.prototype._updateTransformV4 = function (isSkinnedMesh) {
            if (isSkinnedMesh) {
                this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
            }
            else {
                this.updateGlobalTransform(); // Update transform.
                var transform = this.global;
                this._renderDisplay.setTransform(transform.x, transform.y, transform.scaleX, transform.scaleY, transform.skewX, 0.0, transform.skewY - transform.skewX, this._pivotX, this._pivotY);
            }
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
            var _this = _super.call(this, dataParser) || this;
            if (!PixiFactory._eventManager) {
                PixiFactory._eventManager = new dragonBones.PixiArmatureDisplay();
                PixiFactory._clock = new dragonBones.WorldClock();
                PIXI.ticker.shared.add(PixiFactory._clockHandler, PixiFactory);
            }
            return _this;
        }
        PixiFactory._clockHandler = function (passedTime) {
            PixiFactory._clock.advanceTime(-1); // passedTime !?
        };
        Object.defineProperty(PixiFactory, "factory", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局工厂实例。
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
        Object.defineProperty(PixiFactory, "clock", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局 WorldClock 实例.
             * @version DragonBones 5.0
             */
            get: function () {
                return PixiFactory._clock;
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
            var armatureDisplay = new dragonBones.PixiArmatureDisplay();
            armatureDisplay._armature = armature;
            armature._init(dataPackage.armature, dataPackage.skin, armatureDisplay, armatureDisplay, PixiFactory._eventManager);
            return armature;
        };
        /**
         * @private
         */
        PixiFactory.prototype._generateSlot = function (dataPackage, skinSlotData, armature) {
            var slotData = skinSlotData.slot;
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.PixiSlot);
            var displayList = [];
            slot._init(skinSlotData, new PIXI.Sprite(), new PIXI.mesh.Mesh(null, null, null, null, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES));
            for (var i = 0, l = skinSlotData.displays.length; i < l; ++i) {
                var displayData = skinSlotData.displays[i];
                switch (displayData.type) {
                    case 0 /* Image */:
                        if (!displayData.texture) {
                            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.path);
                        }
                        if (dataPackage.textureAtlasName) {
                            slot._textureDatas[i] = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
                        }
                        displayList[i] = slot.rawDisplay;
                        break;
                    case 2 /* Mesh */:
                        if (!displayData.texture) {
                            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.path);
                        }
                        if (dataPackage.textureAtlasName) {
                            slot._textureDatas[i] = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
                        }
                        if (!displayData.mesh && displayData.share) {
                            displayData.mesh = skinSlotData.getMesh(displayData.share);
                        }
                        displayList[i] = slot.meshDisplay;
                        break;
                    case 1 /* Armature */:
                        var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            childArmature.inheritAnimation = displayData.inheritAnimation;
                            if (!childArmature.inheritAnimation) {
                                var actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
                                if (actions.length > 0) {
                                    for (var i_2 = 0, l_2 = actions.length; i_2 < l_2; ++i_2) {
                                        childArmature._bufferAction(actions[i_2]);
                                    }
                                }
                                else {
                                    childArmature.animation.play();
                                }
                            }
                            displayData.armature = childArmature.armatureData; // 
                        }
                        displayList[i] = childArmature;
                        break;
                    default:
                        displayList[i] = null;
                        break;
                }
            }
            slot._setDisplayList(displayList);
            return slot;
        };
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.PixiArmatureDisplay
         * @version DragonBones 4.5
         */
        PixiFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature) {
                var armatureDisplay = armature.display;
                PixiFactory._clock.add(armature);
                return armatureDisplay;
            }
            return null;
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
                    textureData.texture = new PIXI.Texture(textureAtlasTexture, null, textureData.region, originSize, textureData.rotated // .d.ts bug
                    );
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
        return PixiFactory;
    }(dragonBones.BaseFactory));
    PixiFactory._factory = null;
    PixiFactory._eventManager = null;
    PixiFactory._clock = null;
    dragonBones.PixiFactory = PixiFactory;
})(dragonBones || (dragonBones = {}));
