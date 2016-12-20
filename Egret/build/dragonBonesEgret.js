var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            return "[class dragonBones.EgretTextureAtlasData]";
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
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        EgretTextureAtlasData.prototype.dispose = function () {
            this.returnToPool();
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
            return "[class dragonBones.EgretTextureData]";
        };
        /**
         * @inheritDoc
         */
        EgretTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        };
        return EgretTextureData;
    }(dragonBones.TextureData));
    dragonBones.EgretTextureData = EgretTextureData;
})(dragonBones || (dragonBones = {}));
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
        Object.defineProperty(EgretEvent.prototype, "frameLabel", {
            /**
             * @deprecated
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
             * @deprecated
             * @see dragonBones.EventObject#name
             */
            get: function () {
                return this.eventObject.name;
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
        /**
         * @deprecated
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        EgretEvent.SOUND = dragonBones.EventObject.SOUND_EVENT;
        return EgretEvent;
    }(egret.Event));
    dragonBones.EgretEvent = EgretEvent;
    /**
     * @inheritDoc
     */
    var EgretArmatureDisplay = (function (_super) {
        __extends(EgretArmatureDisplay, _super);
        /**
         * @internal
         * @private
         */
        function EgretArmatureDisplay() {
            _super.call(this);
            /**
             * @internal
             * @private
             */
            this._subTextures = {};
        }
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype._onClear = function () {
            for (var i in this._subTextures) {
                //this._subTextures[i].dispose();
                delete this._subTextures[i];
            }
            if (this._armature) {
                this.advanceTimeBySelf(false);
            }
            this._armature = null;
            this._debugDrawer = null;
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
        EgretArmatureDisplay.prototype._debugDraw = function (isEnabled) {
            if (!this._debugDrawer) {
                this._debugDrawer = new egret.Sprite();
            }
            if (isEnabled) {
                this.addChild(this._debugDrawer);
                this._debugDrawer.graphics.clear();
                var bones = this._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    var boneLength = bone.length;
                    var startX = bone.globalTransformMatrix.tx;
                    var startY = bone.globalTransformMatrix.ty;
                    var endX = startX + bone.globalTransformMatrix.a * boneLength;
                    var endY = startY + bone.globalTransformMatrix.b * boneLength;
                    this._debugDrawer.graphics.lineStyle(2, bone.ik ? 0xFF0000 : 0x00FFFF, 0.7);
                    this._debugDrawer.graphics.moveTo(startX, startY);
                    this._debugDrawer.graphics.lineTo(endX, endY);
                    this._debugDrawer.graphics.lineStyle(0, 0, 0);
                    this._debugDrawer.graphics.beginFill(0x00FFFF, 0.7);
                    this._debugDrawer.graphics.drawCircle(startX, startY, 3);
                    this._debugDrawer.graphics.endFill();
                }
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    var displayData = slot.displayData;
                    if (displayData && displayData.boundingBox) {
                        var boundingBox = displayData.boundingBox;
                        var child = this._debugDrawer.getChildByName(slot.name);
                        if (!child) {
                            child = new egret.Shape();
                            child.name = slot.name;
                            this._debugDrawer.addChild(child);
                        }
                        child.graphics.clear();
                        child.graphics.beginFill(0xFF00FF, 0.3);
                        switch (boundingBox.type) {
                            case 0 /* Rectangle */:
                                child.graphics.drawRect(-boundingBox.width * 0.5, -boundingBox.height * 0.5, boundingBox.width, boundingBox.height);
                                break;
                            case 1 /* Ellipse */:
                                child.graphics.drawEllipse(-boundingBox.width * 0.5, -boundingBox.height * 0.5, boundingBox.width, boundingBox.height);
                                break;
                            case 2 /* Polygon */:
                                var vertices = boundingBox.vertices;
                                for (var i_1 = 0, l_1 = boundingBox.vertices.length; i_1 < l_1; i_1 += 2) {
                                    if (i_1 == 0) {
                                        child.graphics.moveTo(vertices[i_1], vertices[i_1 + 1]);
                                    }
                                    else {
                                        child.graphics.lineTo(vertices[i_1], vertices[i_1 + 1]);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        child.graphics.endFill();
                        if (slot._blendIndex == 0) {
                            slot._blendIndex = 1;
                            slot["_updateLocalTransformMatrix"]();
                            slot["_updateGlobalTransformMatrix"]();
                        }
                        child.$setMatrix(slot.globalTransformMatrix, false);
                    }
                    else {
                        var child = this._debugDrawer.getChildByName(slot.name);
                        if (child) {
                            this._debugDrawer.removeChild(child);
                        }
                    }
                }
            }
            else if (this._debugDrawer && this.contains(this._debugDrawer)) {
                this.removeChild(this._debugDrawer);
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype._onReplaceTexture = function (texture) {
            for (var i in this._subTextures) {
                //this._subTextures[i].dispose();
                delete this._subTextures[i];
            }
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
        EgretArmatureDisplay.prototype.dispose = function () {
            if (this._armature) {
                this.advanceTimeBySelf(false);
                this._armature.dispose();
                this._armature = null;
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                dragonBones.EgretFactory._clock.add(this._armature);
            }
            else {
                dragonBones.EgretFactory._clock.remove(this._armature);
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
        return EgretArmatureDisplay;
    }(egret.DisplayObjectContainer));
    dragonBones.EgretArmatureDisplay = EgretArmatureDisplay;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event() {
            _super.apply(this, arguments);
        }
        return Event;
    }(EgretEvent));
    dragonBones.Event = Event;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var ArmatureEvent = (function (_super) {
        __extends(ArmatureEvent, _super);
        function ArmatureEvent() {
            _super.apply(this, arguments);
        }
        return ArmatureEvent;
    }(EgretEvent));
    dragonBones.ArmatureEvent = ArmatureEvent;
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
            return "[class dragonBones.EgretTextureAtlas]";
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
            return dragonBones.EgretFactory._eventManager;
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
            return "[class dragonBones.EgretSlot]";
        };
        EgretSlot.prototype._createTexture = function (textureData, textureAtlas) {
            var textureAtlasWidth = textureAtlas.width;
            var textureAtlasHeight = textureAtlas.height;
            var subTextureWidth = Math.min(textureData.region.width, textureAtlasWidth - textureData.region.x); // TODO need remove
            var subTextureHeight = Math.min(textureData.region.height, textureAtlasHeight - textureData.region.y); // TODO need remove
            var texture = new egret.Texture();
            texture._bitmapData = textureAtlas;
            texture.$initData(textureData.region.x, textureData.region.y, subTextureWidth, subTextureHeight, 0, 0, subTextureWidth, subTextureHeight, textureAtlasWidth, textureAtlasHeight);
            return texture;
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
        EgretSlot.prototype._initDisplay = function (value) {
        };
        /**
         * @private
         */
        EgretSlot.prototype._disposeDisplay = function (value) {
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
        EgretSlot.prototype._updateZOrder = function () {
            var container = this._armature._display;
            var index = container.getChildIndex(this._renderDisplay);
            if (index == this._zOrder) {
                return;
            }
            container.addChildAt(this._renderDisplay, index < this._zOrder ? this._zOrder : this._zOrder + 1);
        };
        /**
         * @internal
         * @private
         */
        EgretSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateBlendMode = function () {
            switch (this._blendMode) {
                case 0 /* Normal */:
                    this._renderDisplay.blendMode = egret.BlendMode.NORMAL;
                    break;
                case 1 /* Add */:
                    this._renderDisplay.blendMode = egret.BlendMode.ADD;
                    break;
                case 5 /* Erase */:
                    this._renderDisplay.blendMode = egret.BlendMode.ERASE;
                    break;
                default:
                    break;
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
                this._colorTransform.blueOffset != 0 ||
                this._colorTransform.alphaOffset != 0) {
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
                colorMatrix[19] = this._colorTransform.alphaOffset;
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
            if (this._display && this._displayIndex >= 0) {
                var rawDisplayData = this._displayIndex < this._displayDataSet.displays.length ? this._displayDataSet.displays[this._displayIndex] : null;
                var replacedDisplayData = this._displayIndex < this._replacedDisplayDataSet.length ? this._replacedDisplayDataSet[this._displayIndex] : null;
                var currentDisplayData = replacedDisplayData || rawDisplayData;
                var currentTextureData = currentDisplayData.texture;
                if (currentTextureData) {
                    var currentTextureAtlasData = currentTextureData.parent;
                    var replacedTextureAtlas = this._armature.replacedTexture ? this._armature.replacedTexture._bitmapData : null;
                    var currentTextureAtlas = (replacedTextureAtlas && currentDisplayData.texture.parent == rawDisplayData.texture.parent) ?
                        replacedTextureAtlas : (currentTextureAtlasData.texture ? currentTextureAtlasData.texture._bitmapData : null);
                    if (currentTextureAtlas) {
                        var currentTexture = currentTextureData.texture;
                        if (currentTextureAtlas == replacedTextureAtlas) {
                            var armatureDisplay = this._armature._display;
                            var textureName = currentTextureData.name;
                            currentTexture = armatureDisplay._subTextures[textureName];
                            if (!currentTexture) {
                                currentTexture = this._createTexture(currentTextureData, currentTextureAtlas);
                                armatureDisplay._subTextures[textureName] = currentTexture;
                            }
                        }
                        else if (!currentTextureData.texture) {
                            currentTexture = this._createTexture(currentTextureData, currentTextureAtlas);
                            currentTextureData.texture = currentTexture;
                        }
                        this._updatePivot(rawDisplayData, currentDisplayData, currentTextureData);
                        if (this._meshData && this._display == this._meshDisplay) {
                            var meshDisplay = this._meshDisplay;
                            var meshNode = meshDisplay.$renderNode;
                            meshNode.uvs.length = 0;
                            meshNode.vertices.length = 0;
                            meshNode.indices.length = 0;
                            for (var i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                                meshNode.uvs[i] = this._meshData.uvs[i];
                                meshNode.vertices[i] = this._meshData.vertices[i];
                            }
                            for (var i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
                                meshNode.indices[i] = this._meshData.vertexIndices[i];
                            }
                            meshDisplay.$setBitmapData(currentTexture);
                            meshDisplay.$setAnchorOffsetX(this._pivotX);
                            meshDisplay.$setAnchorOffsetY(this._pivotY);
                            meshDisplay.$updateVertices();
                            meshDisplay.$invalidateTransform();
                            // Identity transform.
                            if (this._meshData.skinned) {
                                var transformationMatrix = meshDisplay.matrix;
                                transformationMatrix.identity();
                                meshDisplay.matrix = transformationMatrix;
                            }
                        }
                        else {
                            var frameDisplay_1 = this._display;
                            frameDisplay_1.$setBitmapData(currentTexture);
                            frameDisplay_1.$setAnchorOffsetX(this._pivotX);
                            frameDisplay_1.$setAnchorOffsetY(this._pivotY);
                        }
                        this._updateVisible();
                        return;
                    }
                }
            }
            this._pivotX = 0;
            this._pivotY = 0;
            var frameDisplay = this._renderDisplay;
            frameDisplay.visible = false;
            frameDisplay.$setBitmapData(null);
            frameDisplay.$setAnchorOffsetX(this._pivotX);
            frameDisplay.$setAnchorOffsetY(this._pivotY);
            frameDisplay.x = this.origin.x;
            frameDisplay.y = this.origin.y;
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
            if (this.transformUpdateEnabled) {
                this._renderDisplay.$setMatrix(this.globalTransformMatrix, this.transformUpdateEnabled);
                this._renderDisplay.$setAnchorOffsetX(this._pivotX);
                this._renderDisplay.$setAnchorOffsetX(this._pivotY);
            }
            else {
                var values = this._renderDisplay.$DisplayObject;
                var displayMatrix = values[6];
                displayMatrix.a = this.globalTransformMatrix.a;
                displayMatrix.b = this.globalTransformMatrix.b;
                displayMatrix.c = this.globalTransformMatrix.c;
                displayMatrix.d = this.globalTransformMatrix.d;
                displayMatrix.tx = this.globalTransformMatrix.tx;
                displayMatrix.ty = this.globalTransformMatrix.ty;
                this._renderDisplay.$removeFlags(8);
                this._renderDisplay.$invalidatePosition();
            }
        };
        return EgretSlot;
    }(dragonBones.Slot));
    dragonBones.EgretSlot = EgretSlot;
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
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        function EgretFactory(dataParser) {
            if (dataParser === void 0) { dataParser = null; }
            _super.call(this, dataParser);
            if (!EgretFactory._eventManager) {
                EgretFactory._eventManager = new dragonBones.EgretArmatureDisplay();
                EgretFactory._clock = new dragonBones.WorldClock();
                EgretFactory._clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretFactory._clockHandler, EgretFactory);
            }
        }
        EgretFactory._clockHandler = function (time) {
            time *= 0.001;
            var passedTime = time - EgretFactory._clock.time;
            EgretFactory._clock.advanceTime(passedTime);
            EgretFactory._clock.time = time;
            return false;
        };
        Object.defineProperty(EgretFactory, "factory", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局工厂实例.
             * @version DragonBones 4.7
             */
            get: function () {
                if (!EgretFactory._factory) {
                    EgretFactory._factory = new EgretFactory();
                }
                return EgretFactory._factory;
            },
            enumerable: true,
            configurable: true
        });
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
            armature._eventManager = EgretFactory._eventManager;
            armatureDisplayContainer._armature = armature;
            armature._animation._armature = armature;
            armature.animation.animations = dataPackage.armature.animations;
            return armature;
        };
        /**
         * @private
         */
        EgretFactory.prototype._generateSlot = function (dataPackage, slotDisplayDataSet, armature) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.EgretSlot);
            var slotData = slotDisplayDataSet.slot;
            var displayList = [];
            slot.name = slotData.name;
            slot._rawDisplay = new egret.Bitmap();
            slot._meshDisplay = new egret.Mesh();
            for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                var displayData = slotDisplayDataSet.displays[i];
                switch (displayData.type) {
                    case 0 /* Image */:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        displayList.push(slot._rawDisplay);
                        break;
                    case 2 /* Mesh */:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        if (egret.Capabilities.renderMode == "webgl") {
                            displayList.push(slot._meshDisplay);
                        }
                        else {
                            console.warn("Canvas can not support mesh, please change renderMode to webgl.");
                            displayList.push(slot._rawDisplay);
                        }
                        break;
                    case 1 /* Armature */:
                        var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            if (!slot.inheritAnimation) {
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
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         */
        EgretFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
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
         * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
         * @version DragonBones 3.0
         */
        EgretFactory.prototype.getTextureDisplay = function (textureName, textureAtlasName) {
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var textureData = this._getTextureData(textureAtlasName, textureName);
            if (textureData) {
                if (!textureData.texture) {
                    var textureAtlasTexture = textureData.parent.texture;
                    textureData.texture = new egret.Texture();
                    textureData.texture._bitmapData = textureAtlasTexture._bitmapData;
                    textureData.texture.$initData(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height, 0, 0, textureData.region.width, textureData.region.height, textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight);
                }
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
                return EgretFactory._eventManager;
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
            this.removeDragonBonesData(dragonBonesName);
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
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#clear()
         */
        EgretFactory.prototype.dispose = function () {
            this.clear();
        };
        EgretFactory._factory = null;
        /**
         * @private
         */
        EgretFactory._eventManager = null;
        /**
         * @private
         */
        EgretFactory._clock = null;
        return EgretFactory;
    }(dragonBones.BaseFactory));
    dragonBones.EgretFactory = EgretFactory;
})(dragonBones || (dragonBones = {}));
