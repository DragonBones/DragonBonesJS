var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 事件。
     * @version DragonBones 4.5
     */
    var EgretEvent = (function (_super) {
        __extends(EgretEvent, _super);
        /**
         * @private
         */
        function EgretEvent(type, bubbles, cancelable, data) {
            _super.call(this, type, bubbles, cancelable, data);
        }
        Object.defineProperty(EgretEvent.prototype, "eventObject", {
            /**
             * @language zh_CN
             * 事件对象。
             * @version DragonBones 4.5
             */
            get: function () {
                return this.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "frameLabel", {
            /**
             * @see dragonBones.EventObject#name
             */
            get: function () {
                return this.eventObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "sound", {
            /**
             * @see dragonBones.EventObject#name
             */
            get: function () {
                return this.eventObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "animationName", {
            /**
             * @see dragonBones.EventObject#animationName
             */
            get: function () {
                return this.eventObject.animationState.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "armature", {
            /**
             * @see dragonBones.EventObject#armature
             */
            get: function () {
                return this.eventObject.armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "bone", {
            /**
             * @see dragonBones.EventObject#bone
             */
            get: function () {
                return this.eventObject.bone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "slot", {
            /**
             * @see dragonBones.EventObject#slot
             */
            get: function () {
                return this.eventObject.slot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "animationState", {
            /**
             * @see dragonBones.EventObject#animationState
             */
            get: function () {
                return this.eventObject.animationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "movementID", {
            /**
             * @deprecated
             * @see #animationName
             */
            get: function () {
                return this.animationName;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @see dragonBones.EventObject.START
         */
        EgretEvent.START = dragonBones.EventObject.START;
        /**
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        EgretEvent.LOOP_COMPLETE = dragonBones.EventObject.LOOP_COMPLETE;
        /**
         * @see dragonBones.EventObject.COMPLETE
         */
        EgretEvent.COMPLETE = dragonBones.EventObject.COMPLETE;
        /**
         * @see dragonBones.EventObject.FADE_IN
         */
        EgretEvent.FADE_IN = dragonBones.EventObject.FADE_IN;
        /**
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        EgretEvent.FADE_IN_COMPLETE = dragonBones.EventObject.FADE_IN_COMPLETE;
        /**
         * @see dragonBones.EventObject.FADE_OUT
         */
        EgretEvent.FADE_OUT = dragonBones.EventObject.FADE_OUT;
        /**
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        EgretEvent.FADE_OUT_COMPLETE = dragonBones.EventObject.FADE_OUT_COMPLETE;
        /**
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        /**
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        EgretEvent.SOUND_EVENT = dragonBones.EventObject.SOUND_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.ANIMATION_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.BONE_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.MOVEMENT_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        return EgretEvent;
    }(egret.Event));
    dragonBones.EgretEvent = EgretEvent;
    /**
     * @inheritDoc
     */
    var EgretArmatureDisplay = (function (_super) {
        __extends(EgretArmatureDisplay, _super);
        /**
         * @private
         */
        function EgretArmatureDisplay() {
            _super.call(this);
            if (!EgretArmatureDisplay._clock) {
                EgretArmatureDisplay._clock = new dragonBones.WorldClock();
                EgretArmatureDisplay._clock.time = egret.getTimer();
                egret.startTick(EgretArmatureDisplay._clockHandler, EgretArmatureDisplay);
            }
        }
        EgretArmatureDisplay._clockHandler = function (time) {
            var passedTime = time - EgretArmatureDisplay._clock.time;
            EgretArmatureDisplay._clock.advanceTime(passedTime * 0.001);
            EgretArmatureDisplay._clock.time = time;
            return false;
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype._onClear = function () {
            this.advanceTimeBySelf(false);
            this._armature = null;
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype._dispatchEvent = function (eventObject) {
            var event = egret.Event.create(EgretEvent, eventObject.type);
            event.data = eventObject;
            this.dispatchEvent(event);
            egret.Event.release(event);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.advanceTime = function (passedTime) {
            this._armature.advanceTime(passedTime);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.hasEvent = function (type) {
            return this.hasEventListener(type);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.addEvent = function (type, listener, target) {
            this.addEventListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.removeEvent = function (type, listener, target) {
            this.removeEventListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                EgretArmatureDisplay._clock.add(this._armature);
            }
            else {
                EgretArmatureDisplay._clock.remove(this._armature);
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.dispose = function () {
            if (this._armature) {
                this._armature.dispose();
            }
        };
        Object.defineProperty(EgretArmatureDisplay.prototype, "armature", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretArmatureDisplay.prototype, "animation", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature.animation;
            },
            enumerable: true,
            configurable: true
        });
        EgretArmatureDisplay._clock = null;
        return EgretArmatureDisplay;
    }(egret.DisplayObjectContainer));
    dragonBones.EgretArmatureDisplay = EgretArmatureDisplay;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var AnimationEvent = (function (_super) {
        __extends(AnimationEvent, _super);
        function AnimationEvent() {
            _super.apply(this, arguments);
        }
        return AnimationEvent;
    }(EgretEvent));
    dragonBones.AnimationEvent = AnimationEvent;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var FrameEvent = (function (_super) {
        __extends(FrameEvent, _super);
        function FrameEvent() {
            _super.apply(this, arguments);
        }
        return FrameEvent;
    }(EgretEvent));
    dragonBones.FrameEvent = FrameEvent;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var SoundEvent = (function (_super) {
        __extends(SoundEvent, _super);
        function SoundEvent() {
            _super.apply(this, arguments);
        }
        return SoundEvent;
    }(EgretEvent));
    dragonBones.SoundEvent = SoundEvent;
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretTextureAtlas = (function (_super) {
        __extends(EgretTextureAtlas, _super);
        function EgretTextureAtlas(texture, rawData, scale) {
            if (scale === void 0) { scale = 1; }
            _super.call(this);
            this._onClear();
            this.texture = texture;
            dragonBones.ObjectDataParser.getInstance().parseTextureAtlasData(rawData, this, scale);
        }
        /**
         * @private
         */
        EgretTextureAtlas.toString = function () {
            return "[Class dragonBones.EgretTextureAtlas]";
        };
        EgretTextureAtlas.prototype.dispose = function () {
            this.returnToPool();
        };
        return EgretTextureAtlas;
    }(dragonBones.EgretTextureAtlasData));
    dragonBones.EgretTextureAtlas = EgretTextureAtlas;
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretSheetAtlas = (function (_super) {
        __extends(EgretSheetAtlas, _super);
        function EgretSheetAtlas() {
            _super.apply(this, arguments);
        }
        return EgretSheetAtlas;
    }(EgretTextureAtlas));
    dragonBones.EgretSheetAtlas = EgretSheetAtlas;
    /**
     * @deprecated
     * @see dragonBones.EgretFactory#soundEventManater
     */
    var SoundEventManager = (function () {
        function SoundEventManager() {
        }
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManater
         */
        SoundEventManager.getInstance = function () {
            return dragonBones.Armature._soundEventManager;
        };
        return SoundEventManager;
    }());
    dragonBones.SoundEventManager = SoundEventManager;
    /**
     * @deprecated
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    var AnimationCacheManager = (function () {
        function AnimationCacheManager() {
        }
        return AnimationCacheManager;
    }());
    dragonBones.AnimationCacheManager = AnimationCacheManager;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    var EgretFactory = (function (_super) {
        __extends(EgretFactory, _super);
        /**
         * @language zh_CN
         * 创建一个工厂。
         * @version DragonBones 3.0
         */
        function EgretFactory() {
            _super.call(this);
            if (!dragonBones.Armature._soundEventManager) {
                dragonBones.Armature._soundEventManager = new dragonBones.EgretArmatureDisplay();
            }
        }
        /**
         * @private
         */
        EgretFactory.prototype._generateTextureAtlasData = function (textureAtlasData, textureAtlas) {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.EgretTextureAtlasData);
            }
            return textureAtlasData;
        };
        /**
         * @private
         */
        EgretFactory.prototype._generateArmature = function (dataPackage) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            var armatureDisplayContainer = new dragonBones.EgretArmatureDisplay();
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
        EgretFactory.prototype._generateSlot = function (dataPackage, slotDisplayDataSet) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.EgretSlot);
            var slotData = slotDisplayDataSet.slot;
            var displayList = [];
            slot.name = slotData.name;
            slot._rawDisplay = new egret.Bitmap();
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
                        if (egret.Capabilities.renderMode == "webgl") {
                            if (!slot._meshDisplay) {
                                slot._meshDisplay = new egret.Mesh();
                            }
                            displayList.push(slot._meshDisplay);
                        }
                        else {
                            displayList.push(slot._rawDisplay);
                        }
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
        EgretFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName) {
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
        EgretFactory.prototype.getTextureDisplay = function (textureName, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            var textureData = this._getTextureData(dragonBonesName, textureName);
            if (textureData) {
                return new egret.Bitmap(textureData.texture);
            }
            return null;
        };
        Object.defineProperty(EgretFactory.prototype, "soundEventManater", {
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
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        EgretFactory.prototype.addSkeletonData = function (dragonBonesData, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        EgretFactory.prototype.getSkeletonData = function (dragonBonesName) {
            return this.getDragonBonesData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        EgretFactory.prototype.removeSkeletonData = function (dragonBonesName) {
            this.removeSkeletonData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        EgretFactory.prototype.addTextureAtlas = function (textureAtlasData, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        EgretFactory.prototype.getTextureAtlas = function (dragonBonesName) {
            return this.getTextureAtlasData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        EgretFactory.prototype.removeTextureAtlas = function (dragonBonesName) {
            this.removeTextureAtlasData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        EgretFactory.prototype.buildFastArmature = function (armatureName, dragonBonesName, skinName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            return this.buildArmature(armatureName, dragonBonesName, skinName);
        };
        return EgretFactory;
    }(dragonBones.BaseFactory));
    dragonBones.EgretFactory = EgretFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    var EgretSlot = (function (_super) {
        __extends(EgretSlot, _super);
        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        function EgretSlot() {
            _super.call(this);
        }
        /**
         * @private
         */
        EgretSlot.toString = function () {
            return "[Class dragonBones.EgretSlot]";
        };
        /**
         * @inheritDoc
         */
        EgretSlot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.transformUpdateEnabled = false;
            this._renderDisplay = null;
            this._colorFilter = null;
        };
        /**
         * @private
         */
        EgretSlot.prototype._onUpdateDisplay = function () {
            if (!this._rawDisplay) {
                this._rawDisplay = new egret.Bitmap();
            }
            this._renderDisplay = (this._display || this._rawDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._initDisplay = function (value) {
        };
        /**
         * @private
         */
        EgretSlot.prototype._addDisplay = function () {
            var container = this._armature._display;
            container.addChild(this._renderDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature._display;
            var prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._removeDisplay = function () {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._disposeDisplay = function (value) {
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateBlendMode = function () {
            if (this._blendMode < EgretSlot.BLEND_MODE_LIST.length) {
                var blendMode = EgretSlot.BLEND_MODE_LIST[this._blendMode];
                if (blendMode) {
                    this._renderDisplay.blendMode = blendMode;
                }
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateColor = function () {
            if (this._colorTransform.redMultiplier != 1 ||
                this._colorTransform.greenMultiplier != 1 ||
                this._colorTransform.blueMultiplier != 1 ||
                this._colorTransform.redOffset != 0 ||
                this._colorTransform.greenOffset != 0 ||
                this._colorTransform.blueOffset != 0) {
                if (!this._colorFilter) {
                    this._colorFilter = new egret.ColorMatrixFilter();
                }
                var colorMatrix = this._colorFilter.matrix;
                colorMatrix[0] = this._colorTransform.redMultiplier;
                colorMatrix[6] = this._colorTransform.greenMultiplier;
                colorMatrix[12] = this._colorTransform.blueMultiplier;
                colorMatrix[18] = this._colorTransform.alphaMultiplier;
                colorMatrix[4] = this._colorTransform.redOffset;
                colorMatrix[9] = this._colorTransform.greenOffset;
                colorMatrix[14] = this._colorTransform.blueOffset;
                //colorMatrix[19] = this._colorTransform.alphaOffset / 255;
                this._colorFilter.matrix = colorMatrix;
                var filters = this._renderDisplay.filters;
                if (!filters) {
                    filters = [];
                }
                if (filters.indexOf(this._colorFilter) < 0) {
                    filters.push(this._colorFilter);
                }
                this._renderDisplay.filters = filters;
            }
            else {
                if (this._colorFilter) {
                    this._colorFilter = null;
                    this._renderDisplay.filters = null;
                }
                this._renderDisplay.$setAlpha(this._colorTransform.alphaMultiplier);
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateFilters = function () { };
        /**
         * @private
         */
        EgretSlot.prototype._updateFrame = function () {
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
                            currentTextureData.texture = new egret.Texture();
                            currentTextureData.texture._bitmapData = textureAtlasTexture._bitmapData;
                            currentTextureData.texture.$initData(currentTextureData.region.x, currentTextureData.region.y, currentTextureData.region.width, currentTextureData.region.height, 0, 0, currentTextureData.region.width, currentTextureData.region.height, textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight);
                        }
                    }
                    var texture = this._armature._replacedTexture || currentTextureData.texture;
                    if (texture) {
                        if (this._meshData && this._display == this._meshDisplay) {
                            var meshDisplay = this._meshDisplay;
                            var meshNode = meshDisplay.$renderNode;
                            for (var i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                                meshNode.uvs[i] = this._meshData.uvs[i];
                                meshNode.vertices[i] = this._meshData.vertices[i];
                            }
                            for (var i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
                                meshNode.indices[i] = this._meshData.vertexIndices[i];
                            }
                            meshDisplay.$setBitmapData(texture);
                            meshDisplay.$updateVertices();
                            meshDisplay.$invalidateTransform();
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
                            frameDisplay.$setBitmapData(texture);
                            frameDisplay.$setAnchorOffsetX(pivotX);
                            frameDisplay.$setAnchorOffsetY(pivotY);
                        }
                        this._updateVisible();
                        return;
                    }
                }
            }
            frameDisplay.visible = false;
            frameDisplay.$setBitmapData(null);
            frameDisplay.$setAnchorOffsetX(0);
            frameDisplay.$setAnchorOffsetY(0);
            frameDisplay.x = 0;
            frameDisplay.y = 0;
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateMesh = function () {
            var meshDisplay = this._meshDisplay;
            var meshNode = meshDisplay.$renderNode;
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
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
            else if (hasFFD) {
                var vertices = this._meshData.vertices;
                for (var i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var xG = vertices[i] + this._ffdVertices[i];
                    var yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateTransform = function () {
            this._renderDisplay.$setMatrix(this.globalTransformMatrix, this.transformUpdateEnabled);
        };
        /**
         * @private
         */
        EgretSlot.BLEND_MODE_LIST = [
            egret.BlendMode.NORMAL,
            egret.BlendMode.ADD,
            null,
            null,
            null,
            egret.BlendMode.ERASE,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ];
        return EgretSlot;
    }(dragonBones.Slot));
    dragonBones.EgretSlot = EgretSlot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     */
    var EgretTextureAtlasData = (function (_super) {
        __extends(EgretTextureAtlasData, _super);
        /**
         * @private
         */
        function EgretTextureAtlasData() {
            _super.call(this);
        }
        /**
         * @private
         */
        EgretTextureAtlasData.toString = function () {
            return "[Class dragonBones.EgretTextureAtlasData]";
        };
        /**
         * @inheritDoc
         */
        EgretTextureAtlasData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        };
        /**
         * @private
         */
        EgretTextureAtlasData.prototype.generateTextureData = function () {
            return dragonBones.BaseObject.borrowObject(EgretTextureData);
        };
        return EgretTextureAtlasData;
    }(dragonBones.TextureAtlasData));
    dragonBones.EgretTextureAtlasData = EgretTextureAtlasData;
    /**
     * @private
     */
    var EgretTextureData = (function (_super) {
        __extends(EgretTextureData, _super);
        function EgretTextureData() {
            _super.call(this);
        }
        EgretTextureData.toString = function () {
            return "[Class dragonBones.EgretTextureData]";
        };
        /**
         * @inheritDoc
         */
        EgretTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture.dispose();
                this.texture = null;
            }
        };
        return EgretTextureData;
    }(dragonBones.TextureData));
    dragonBones.EgretTextureData = EgretTextureData;
})(dragonBones || (dragonBones = {}));
