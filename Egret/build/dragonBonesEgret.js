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
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     */
    var EgretTextureAtlasData = (function (_super) {
        __extends(EgretTextureAtlasData, _super);
        /**
         * @private
         */
        function EgretTextureAtlasData() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EgretTextureAtlasData.toString = function () {
            return "[class dragonBones.EgretTextureAtlasData]";
        };
        /**
         * @private
         */
        EgretTextureAtlasData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
            }
            this.texture = null;
        };
        /**
         * @private
         */
        EgretTextureAtlasData.prototype.generateTexture = function () {
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
            return _super.call(this) || this;
        }
        EgretTextureData.toString = function () {
            return "[class dragonBones.EgretTextureData]";
        };
        /**
         * @private
         */
        EgretTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
            }
            this.texture = null;
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
         * @internal
         * @private
         */
        function EgretEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        Object.defineProperty(EgretEvent.prototype, "eventObject", {
            /**
             * @language zh_CN
             * 事件对象。
             * @see dragonBones.EventObject
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
             * @deprecated
             * @see #eventObject
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
             * @deprecated
             * @see #eventObject
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
             * @deprecated
             * @see #eventObject
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
             * @deprecated
             * @see #eventObject
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
             * @deprecated
             * @see #eventObject
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
        return EgretEvent;
    }(egret.Event));
    /**
     * @deprecated
     * @see dragonBones.EventObject.START
     */
    EgretEvent.START = dragonBones.EventObject.START;
    /**
     * @deprecated
     * @see dragonBones.EventObject.LOOP_COMPLETE
     */
    EgretEvent.LOOP_COMPLETE = dragonBones.EventObject.LOOP_COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.COMPLETE
     */
    EgretEvent.COMPLETE = dragonBones.EventObject.COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_IN
     */
    EgretEvent.FADE_IN = dragonBones.EventObject.FADE_IN;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_IN_COMPLETE
     */
    EgretEvent.FADE_IN_COMPLETE = dragonBones.EventObject.FADE_IN_COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_OUT
     */
    EgretEvent.FADE_OUT = dragonBones.EventObject.FADE_OUT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_OUT_COMPLETE
     */
    EgretEvent.FADE_OUT_COMPLETE = dragonBones.EventObject.FADE_OUT_COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
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
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EgretArmatureDisplay.prototype._onClear = function () {
            this._disposeProxy = false;
            this._armature = null;
            this._debugDrawer = null;
        };
        /**
         * @private
         */
        EgretArmatureDisplay.prototype._dispatchEvent = function (type, eventObject) {
            var event = egret.Event.create(EgretEvent, type);
            event.data = eventObject;
            _super.prototype.dispatchEvent.call(this, event);
            egret.Event.release(event);
        };
        /**
         * @private
         */
        EgretArmatureDisplay.prototype._debugDraw = function (isEnabled) {
            if (isEnabled) {
                if (!this._debugDrawer) {
                    this._debugDrawer = new egret.Sprite();
                }
                this.addChild(this._debugDrawer);
                this._debugDrawer.graphics.clear();
                var bones = this._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    bone.updateGlobalTransform();
                    var boneLength = bone.boneData.length;
                    var startX = bone.globalTransformMatrix.tx;
                    var startY = bone.globalTransformMatrix.ty;
                    var endX = startX + bone.globalTransformMatrix.a * boneLength;
                    var endY = startY + bone.globalTransformMatrix.b * boneLength;
                    this._debugDrawer.graphics.lineStyle(2.0, bone.ik ? 0xFF0000 : 0x00FFFF, 0.7);
                    this._debugDrawer.graphics.moveTo(startX, startY);
                    this._debugDrawer.graphics.lineTo(endX, endY);
                    this._debugDrawer.graphics.lineStyle(0.0, 0, 0);
                    this._debugDrawer.graphics.beginFill(0x00FFFF, 0.7);
                    this._debugDrawer.graphics.drawCircle(startX, startY, 3.0);
                    this._debugDrawer.graphics.endFill();
                }
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    var boundingBoxData = slot.boundingBoxData;
                    if (boundingBoxData) {
                        var child = this._debugDrawer.getChildByName(slot.name);
                        if (!child) {
                            child = new egret.Shape();
                            child.name = slot.name;
                            this._debugDrawer.addChild(child);
                        }
                        child.graphics.clear();
                        child.graphics.beginFill(boundingBoxData.color ? boundingBoxData.color : 0xFF00FF, 0.3);
                        switch (boundingBoxData.type) {
                            case 0 /* Rectangle */:
                                child.graphics.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;
                            case 1 /* Ellipse */:
                                child.graphics.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;
                            case 2 /* Polygon */:
                                var vertices = boundingBoxData.vertices;
                                for (var iA = 0, lA = boundingBoxData.vertices.length; iA < lA; iA += 2) {
                                    if (iA === 0) {
                                        child.graphics.moveTo(vertices[iA], vertices[iA + 1]);
                                    }
                                    else {
                                        child.graphics.lineTo(vertices[iA], vertices[iA + 1]);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        child.graphics.endFill();
                        slot._updateTransformAndMatrix();
                        slot.updateGlobalTransform();
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
            else if (this._debugDrawer && this._debugDrawer.parent === this) {
                this.removeChild(this._debugDrawer);
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.dispose = function (disposeProxy) {
            if (disposeProxy === void 0) { disposeProxy = true; }
            this._disposeProxy = disposeProxy;
            if (this._armature) {
                this._armature.dispose();
                this._armature = null;
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
        /**
         * @deprecated
         * @see dragonBones.Armature#clock
         * @see dragonBones.EgretFactory#clock
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        EgretArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                this._armature.clock = dragonBones.EgretFactory.clock;
            }
            else {
                this._armature.clock = null;
            }
        };
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
            return _super !== null && _super.apply(this, arguments) || this;
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
            return _super !== null && _super.apply(this, arguments) || this;
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
            return _super !== null && _super.apply(this, arguments) || this;
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
            return _super !== null && _super.apply(this, arguments) || this;
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
            return _super !== null && _super.apply(this, arguments) || this;
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
            var _this = _super.call(this) || this;
            _this._onClear();
            _this.texture = texture;
            dragonBones.ObjectDataParser.getInstance().parseTextureAtlasData(rawData, _this, scale);
            return _this;
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
            return _super !== null && _super.apply(this, arguments) || this;
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
            return dragonBones.EgretFactory.factory.soundEventManager;
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
         * @internal
         * @private
         */
        function EgretSlot() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EgretSlot.toString = function () {
            return "[class dragonBones.EgretSlot]";
        };
        /**
         * @private
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
            this._renderDisplay = (this._display ? this._display : this._rawDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._addDisplay = function () {
            var container = this._armature.display;
            container.addChild(this._renderDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature.display;
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
            if (this._colorTransform.redMultiplier !== 1 ||
                this._colorTransform.greenMultiplier !== 1 ||
                this._colorTransform.blueMultiplier !== 1 ||
                this._colorTransform.redOffset !== 0 ||
                this._colorTransform.greenOffset !== 0 ||
                this._colorTransform.blueOffset !== 0 ||
                this._colorTransform.alphaOffset !== 0) {
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
                this._renderDisplay.$setAlpha(1.0);
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
        EgretSlot.prototype._updateFrame = function () {
            var isMeshDisplay = this._meshData && this._display === this._meshDisplay;
            var currentTextureData = this._textureData;
            if (this._displayIndex >= 0 && this._display && currentTextureData) {
                var currentTextureAtlasData = currentTextureData.parent;
                // Update replaced texture atlas.
                if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData;
                    if (!currentTextureAtlasData) {
                        currentTextureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.EgretTextureAtlasData);
                        currentTextureAtlasData.copyFrom(this._textureData.parent);
                        currentTextureAtlasData.texture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);
                }
                var currentTextureAtlas = currentTextureAtlasData.texture ? currentTextureAtlasData.texture._bitmapData : null;
                if (currentTextureAtlas) {
                    if (!currentTextureData.texture) {
                        var textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
                        var textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;
                        var subTextureWidth = Math.min(currentTextureData.region.width, textureAtlasWidth - currentTextureData.region.x); // TODO need remove
                        var subTextureHeight = Math.min(currentTextureData.region.height, textureAtlasHeight - currentTextureData.region.y); // TODO need remove
                        currentTextureData.texture = new egret.Texture();
                        currentTextureData.texture._bitmapData = currentTextureAtlas;
                        currentTextureData.texture.$initData(currentTextureData.region.x, currentTextureData.region.y, subTextureWidth, subTextureHeight, 0, 0, subTextureWidth, subTextureHeight, textureAtlasWidth, textureAtlasHeight);
                    }
                    if (isMeshDisplay) {
                        var meshDisplay = this._renderDisplay;
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
                        meshDisplay.$setBitmapData(currentTextureData.texture);
                        meshDisplay.$setAnchorOffsetX(this._pivotX);
                        meshDisplay.$setAnchorOffsetY(this._pivotY);
                        meshDisplay.$updateVertices();
                        meshDisplay.$invalidateTransform();
                    }
                    else {
                        var normalDisplay = this._renderDisplay;
                        normalDisplay.$setBitmapData(currentTextureData.texture);
                        normalDisplay.$setAnchorOffsetX(this._pivotX);
                        normalDisplay.$setAnchorOffsetY(this._pivotY);
                    }
                    this._updateVisible();
                    return;
                }
            }
            if (isMeshDisplay) {
                var meshDisplay = this._renderDisplay;
                meshDisplay.$setBitmapData(null);
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
                meshDisplay.visible = false;
            }
            else {
                var normalDisplay = this._renderDisplay;
                normalDisplay.$setBitmapData(null);
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
                normalDisplay.visible = false;
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateMesh = function () {
            var meshDisplay = this._renderDisplay;
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
        EgretSlot.prototype._updateTransform = function (isSkinnedMesh) {
            if (isSkinnedMesh) {
                var transformationMatrix = this._renderDisplay.matrix;
                transformationMatrix.identity();
                this._renderDisplay.$setMatrix(transformationMatrix, this.transformUpdateEnabled);
            }
            else {
                if (this.transformUpdateEnabled) {
                    this._renderDisplay.$setMatrix(this.globalTransformMatrix, true);
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
            var _this = _super.call(this, dataParser) || this;
            if (!EgretFactory._eventManager) {
                EgretFactory._eventManager = new dragonBones.EgretArmatureDisplay();
                EgretFactory._clock = new dragonBones.WorldClock();
                EgretFactory._clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretFactory._clockHandler, EgretFactory);
            }
            return _this;
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
             * 一个可以直接使用的全局工厂实例。
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
        Object.defineProperty(EgretFactory, "clock", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局 WorldClock 实例.
             * @version DragonBones 5.0
             */
            get: function () {
                return EgretFactory._clock;
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
            var armatureDisplay = new dragonBones.EgretArmatureDisplay();
            armatureDisplay._armature = armature;
            armature._init(dataPackage.armature, dataPackage.skin, armatureDisplay, armatureDisplay, EgretFactory._eventManager);
            return armature;
        };
        /**
         * @private
         */
        EgretFactory.prototype._generateSlot = function (dataPackage, skinSlotData, armature) {
            var slotData = skinSlotData.slot;
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.EgretSlot);
            var displayList = [];
            slot._init(skinSlotData, new egret.Bitmap(), new egret.Mesh());
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
                        if (egret.Capabilities.renderMode === "webgl" || egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                            displayList[i] = slot.meshDisplay;
                        }
                        else {
                            console.warn("Canvas can not support mesh, please change renderMode to webgl.");
                            displayList[i] = slot.rawDisplay;
                        }
                        break;
                    case 1 /* Armature */:
                        var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            childArmature.inheritAnimation = displayData.inheritAnimation;
                            if (!childArmature.inheritAnimation) {
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
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         */
        EgretFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature) {
                EgretFactory._clock.add(armature);
                return armature.display;
            }
            return null;
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
        Object.defineProperty(EgretFactory.prototype, "soundEventManager", {
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
        Object.defineProperty(EgretFactory.prototype, "soundEventManater", {
            /**
             * @deprecated
             * @see dragonBones.EgretFactory#soundEventManager()
             */
            get: function () {
                return EgretFactory._eventManager;
            },
            enumerable: true,
            configurable: true
        });
        return EgretFactory;
    }(dragonBones.BaseFactory));
    EgretFactory._factory = null;
    EgretFactory._eventManager = null;
    EgretFactory._clock = null;
    dragonBones.EgretFactory = EgretFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var _helpRectangle = new egret.Rectangle();
    /**
     * @private
     */
    var _helpMatrix = new egret.Matrix();
    /**
     * @private
     */
    var _groupConfigMap = {};
    /**
     * @private
     */
    function _findObjectInArray(array, name) {
        for (var i = 0, l = array.length; i < l; ++i) {
            var data = array[i];
            if (data.name === name) {
                return data;
            }
        }
        return null;
    }
    /**
     * @private
     */
    function _fillCreateMovieHelper(createMovieHelper) {
        if (createMovieHelper.groupName) {
            var groupConfig = _groupConfigMap[createMovieHelper.groupName];
            if (groupConfig) {
                var movieConfig = _findObjectInArray(groupConfig.movie || groupConfig.animation, createMovieHelper.movieName);
                if (movieConfig) {
                    createMovieHelper.groupConfig = groupConfig;
                    createMovieHelper.movieConfig = movieConfig;
                    return true;
                }
            }
        }
        if (!createMovieHelper.groupName) {
            for (var groupName in _groupConfigMap) {
                var groupConfig = _groupConfigMap[groupName];
                if (!createMovieHelper.groupName) {
                    var movieConfig = _findObjectInArray(groupConfig.movie || groupConfig.animation, createMovieHelper.movieName);
                    if (movieConfig) {
                        createMovieHelper.groupName = groupName;
                        createMovieHelper.groupConfig = groupConfig;
                        createMovieHelper.movieConfig = movieConfig;
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * @language zh_CN
     * 是否包含指定名称的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function hasMovieGroup(groupName) {
        return _groupConfigMap[groupName] != null;
    }
    dragonBones.hasMovieGroup = hasMovieGroup;
    /**
     * @language zh_CN
     * 添加动画组。
     * @param groupData 动画二进制数据。
     * @param textureAtlas 贴图集或贴图集列表。
     * @param groupName 为动画组指定一个名称，如果未设置，则使用数据中的名称。
     * @version DragonBones 4.7
     */
    function addMovieGroup(groupData, textureAtlas, groupName) {
        if (groupName === void 0) { groupName = null; }
        if (groupData) {
            var byteArray = new egret.ByteArray(groupData);
            byteArray.endian = egret.Endian.LITTLE_ENDIAN;
            byteArray.position = 8; // TODO format
            var groupConfig = JSON.parse(byteArray.readUTF());
            groupConfig.offset = byteArray.position;
            groupConfig.arrayBuffer = groupData;
            groupConfig.textures = [];
            var p = groupConfig.offset % 4;
            if (p) {
                groupConfig.offset += 4 - p;
            }
            for (var i = 0, l = groupConfig.position.length; i < l; i += 3) {
                switch (i / 3) {
                    case 1:
                        groupConfig.displayFrameArray = new Int16Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 2:
                        groupConfig.rectangleArray = new Float32Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 3:
                        groupConfig.transformArray = new Float32Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 4:
                        groupConfig.colorArray = new Int16Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                }
            }
            groupName = groupName || groupConfig.name;
            if (_groupConfigMap[groupName]) {
                // TODO
            }
            _groupConfigMap[groupName] = groupConfig;
            //
            if (textureAtlas instanceof Array) {
                for (var i = 0, l = textureAtlas.length; i < l; ++i) {
                    var texture = textureAtlas[i];
                    groupConfig.textures.push(texture);
                }
            }
            else {
                groupConfig.textures.push(textureAtlas);
            }
        }
        else {
            throw new Error();
        }
    }
    dragonBones.addMovieGroup = addMovieGroup;
    /**
     * @language zh_CN
     * 移除动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeMovieGroup(groupName) {
        var groupConfig = _groupConfigMap[groupName];
        if (groupConfig) {
            delete _groupConfigMap[groupName];
        }
    }
    dragonBones.removeMovieGroup = removeMovieGroup;
    /**
     * @language zh_CN
     * 移除所有的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeAllMovieGroup() {
        for (var i in _groupConfigMap) {
            delete _groupConfigMap[i];
        }
    }
    dragonBones.removeAllMovieGroup = removeAllMovieGroup;
    /**
     * @language zh_CN
     * 创建一个动画。
     * @param movieName 动画的名称。
     * @param groupName 动画组的名称，如果未设置，将检索所有的动画组，当多个动画组中包含同名的动画时，可能无法创建出准确的动画。
     * @version DragonBones 4.7
     */
    function buildMovie(movieName, groupName) {
        if (groupName === void 0) { groupName = null; }
        var createMovieHelper = { movieName: movieName, groupName: groupName };
        if (_fillCreateMovieHelper(createMovieHelper)) {
            var movie = new Movie(createMovieHelper);
            dragonBones.EgretFactory.factory;
            movie.clock = dragonBones.EgretFactory.clock;
            return movie;
        }
        else {
            console.warn("No movie named: " + movieName);
        }
        return null;
    }
    dragonBones.buildMovie = buildMovie;
    /**
     * @language zh_CN
     * 获取指定动画组内包含的所有动画名称。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function getMovieNames(groupName) {
        var groupConfig = _groupConfigMap[groupName];
        if (groupConfig) {
            var movieNameGroup = [];
            var movie = groupConfig.movie || groupConfig.animation;
            for (var i = 0, l = movie.length; i < l; ++i) {
                movieNameGroup.push(movie[i].name);
            }
            return movieNameGroup;
        }
        else {
            console.warn("No group named: " + groupName);
        }
        return null;
    }
    dragonBones.getMovieNames = getMovieNames;
    /**
     * @language zh_CN
     * 动画事件。
     * @version DragonBones 4.7
     */
    var MovieEvent = (function (_super) {
        __extends(MovieEvent, _super);
        /**
         * @private
         */
        function MovieEvent(type) {
            var _this = _super.call(this, type) || this;
            /**
             * @language zh_CN
             * 事件名称。 (帧标签的名称或声音的名称)
             * @version DragonBones 4.7
             */
            _this.name = null;
            /**
             * @language zh_CN
             * 发出事件的插槽名称。
             * @version DragonBones 4.7
             */
            _this.slotName = null;
            /**
             * @language zh_CN
             * 发出事件的动画剪辑名称。
             * @version DragonBones 4.7
             */
            _this.clipName = null;
            /**
             * @language zh_CN
             * 发出事件的动画。
             * @version DragonBones 4.7
             */
            _this.movie = null;
            return _this;
        }
        Object.defineProperty(MovieEvent.prototype, "armature", {
            //========================================= // 兼容旧数据
            /**
             * @private
             */
            get: function () {
                return this.movie;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieEvent.prototype, "bone", {
            /**
             * @private
             */
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieEvent.prototype, "animationState", {
            /**
             * @private
             */
            get: function () {
                return { name: this.clipName };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieEvent.prototype, "frameLabel", {
            /**
             * @private
             */
            get: function () {
                return this.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieEvent.prototype, "movementID", {
            /**
             * @private
             */
            get: function () {
                return this.clipName;
            },
            enumerable: true,
            configurable: true
        });
        return MovieEvent;
    }(egret.Event));
    /**
     * @language zh_CN
     * 动画剪辑开始播放。
     * @version DragonBones 4.7
     */
    MovieEvent.START = "start";
    /**
     * @language zh_CN
     * 动画剪辑循环播放一次完成。
     * @version DragonBones 4.7
     */
    MovieEvent.LOOP_COMPLETE = "loopComplete";
    /**
     * @language zh_CN
     * 动画剪辑播放完成。
     * @version DragonBones 4.7
     */
    MovieEvent.COMPLETE = "complete";
    /**
     * @language zh_CN
     * 动画剪辑帧事件。
     * @version DragonBones 4.7
     */
    MovieEvent.FRAME_EVENT = "frameEvent";
    /**
     * @language zh_CN
     * 动画剪辑声音事件。
     * @version DragonBones 4.7
     */
    MovieEvent.SOUND_EVENT = "soundEvent";
    dragonBones.MovieEvent = MovieEvent;
    /**
     * @private
     */
    var MovieSlot = (function (_super) {
        __extends(MovieSlot, _super);
        function MovieSlot(slotConfig) {
            var _this = _super.call(this) || this;
            _this.displayIndex = -1;
            _this.colorIndex = -1;
            _this.transformIndex = -1;
            _this.rawDisplay = new egret.Bitmap();
            _this.childMovies = {};
            _this.config = null;
            _this.displayConfig = null;
            _this.display = null;
            _this.childMovie = null;
            _this.colorFilter = null;
            _this.display = _this.rawDisplay;
            _this.config = slotConfig;
            _this.rawDisplay.name = _this.config.name;
            if (_this.config.blendMode == null) {
                _this.config.blendMode = 0 /* Normal */;
            }
            return _this;
        }
        MovieSlot.prototype.dispose = function () {
            this.rawDisplay = null;
            this.childMovies = null;
            this.config = null;
            this.displayConfig = null;
            this.display = null;
            this.childMovie = null;
            this.colorFilter = null;
        };
        return MovieSlot;
    }(egret.HashObject));
    /**
     * @language zh_CN
     * 通过读取缓存的二进制动画数据来更新动画，具有良好的运行性能，同时对内存的占用也非常低。
     * @see dragonBones.buildMovie
     * @version DragonBones 4.7
     */
    var Movie = (function (_super) {
        __extends(Movie, _super);
        /**
         * @internal
         * @private
         */
        function Movie(createMovieHelper) {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * @default 1
             * @version DragonBones 4.7
             */
            _this.timeScale = 1;
            /**
             * @language zh_CN
             * 动画剪辑的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * （当再次播放其他动画剪辑时，此值将被重置为 1）
             * @default 1
             * @version DragonBones 4.7
             */
            _this.clipTimeScale = 1;
            _this._batchEnabled = true;
            _this._isLockDispose = false;
            _this._isDelayDispose = false;
            _this._isStarted = false;
            _this._isPlaying = false;
            _this._isReversing = false;
            _this._isCompleted = false;
            _this._playTimes = 0;
            _this._time = 0;
            _this._currentTime = 0;
            _this._timeStamp = 0;
            _this._currentPlayTimes = 0;
            _this._cacheFrameIndex = 0;
            _this._frameSize = 0;
            _this._cacheRectangle = null;
            _this._clock = null;
            _this._groupConfig = null;
            _this._config = null;
            _this._clipConfig = null;
            _this._currentFrameConfig = null;
            _this._clipArray = null;
            _this._clipNames = [];
            _this._slots = [];
            _this._childMovies = [];
            _this._groupConfig = createMovieHelper.groupConfig;
            _this._config = createMovieHelper.movieConfig;
            _this._batchEnabled = !(_this._config.isNested || _this._config.hasChildAnimation);
            if (_this._batchEnabled) {
                _this.$renderNode = new egret.sys.GroupNode();
                _this.$renderNode.cleanBeforeRender = Movie._cleanBeforeRender;
            }
            _this._clipNames.length = 0;
            for (var i = 0, l = _this._config.clip.length; i < l; ++i) {
                _this._clipNames.push(_this._config.clip[i].name);
            }
            for (var i = 0, l = _this._config.slot.length; i < l; ++i) {
                var slot = new MovieSlot(_this._config.slot[i]);
                _this._updateSlotBlendMode(slot);
                _this._slots.push(slot);
                if (_this._batchEnabled) {
                    _this.$renderNode.addNode(slot.rawDisplay.$renderNode);
                }
                else {
                    _this.addChild(slot.rawDisplay);
                }
            }
            _this._frameSize = (1 + 1) * _this._slots.length; // displayFrame, transformFrame.
            _this.name = _this._config.name;
            _this.play();
            _this.advanceTime(0.000001);
            _this.stop();
            return _this;
        }
        Movie._cleanBeforeRender = function () { };
        Movie.prototype._configToEvent = function (config, event) {
            event.movie = this;
            event.clipName = this._clipConfig.name;
            event.name = config.name;
            event.slotName = config.slot;
        };
        Movie.prototype._onCrossFrame = function (frameConfig) {
            for (var i = 0, l = frameConfig.actionAndEvent.length; i < l; ++i) {
                var actionAndEvent = frameConfig.actionAndEvent[i];
                if (actionAndEvent) {
                    switch (actionAndEvent.type) {
                        case 11 /* Sound */:
                            if (dragonBones.EgretFactory.factory.soundEventManager.hasEventListener(MovieEvent.SOUND_EVENT)) {
                                var event_1 = egret.Event.create(MovieEvent, MovieEvent.SOUND_EVENT);
                                this._configToEvent(actionAndEvent, event_1);
                                dragonBones.EgretFactory.factory.soundEventManager.dispatchEvent(event_1);
                                egret.Event.release(event_1);
                            }
                            break;
                        case 10 /* Frame */:
                            if (this.hasEventListener(MovieEvent.FRAME_EVENT)) {
                                var event_2 = egret.Event.create(MovieEvent, MovieEvent.FRAME_EVENT);
                                this._configToEvent(actionAndEvent, event_2);
                                this.dispatchEvent(event_2);
                                egret.Event.release(event_2);
                            }
                            break;
                        case 0 /* Play */:
                        case 4 /* Fade */:
                            if (actionAndEvent.slot) {
                                var slot = this._getSlot(actionAndEvent.slot);
                                if (slot && slot.childMovie) {
                                    slot.childMovie.play(actionAndEvent.name);
                                }
                            }
                            else {
                                this.play(actionAndEvent.name);
                            }
                            break;
                    }
                }
            }
        };
        Movie.prototype._updateSlotBlendMode = function (slot) {
            var blendMode = "";
            switch (slot.config.blendMode) {
                case 0 /* Normal */:
                    blendMode = egret.BlendMode.NORMAL;
                    break;
                case 1 /* Add */:
                    blendMode = egret.BlendMode.ADD;
                    break;
                case 5 /* Erase */:
                    blendMode = egret.BlendMode.ERASE;
                    break;
                default:
                    break;
            }
            if (blendMode) {
                if (this._batchEnabled) {
                    // RenderNode display.
                    slot.display.$renderNode.blendMode = egret.sys.blendModeToNumber(blendMode);
                }
                else {
                    // Classic display.
                    slot.display.blendMode = blendMode;
                }
            }
        };
        Movie.prototype._updateSlotColor = function (slot, aM, rM, gM, bM, aO, rO, gO, bO) {
            if (rM !== 1 ||
                gM !== 1 ||
                bM !== 1 ||
                rO !== 0 ||
                gO !== 0 ||
                bO !== 0 ||
                aO !== 0) {
                if (!slot.colorFilter) {
                    slot.colorFilter = new egret.ColorMatrixFilter();
                }
                var colorMatrix = slot.colorFilter.matrix;
                colorMatrix[0] = rM;
                colorMatrix[6] = gM;
                colorMatrix[12] = bM;
                colorMatrix[18] = aM;
                colorMatrix[4] = rO;
                colorMatrix[9] = gO;
                colorMatrix[14] = bO;
                colorMatrix[19] = aO;
                slot.colorFilter.matrix = colorMatrix;
                if (this._batchEnabled) {
                    // RenderNode display.
                    var filter = slot.display.$renderNode.filter;
                    slot.display.$renderNode.filter = slot.colorFilter;
                    slot.display.$renderNode.alpha = 1.0;
                }
                else {
                    // Classic display.
                    var filters = slot.display.filters;
                    if (!filters) {
                        filters = [];
                    }
                    if (filters.indexOf(slot.colorFilter) < 0) {
                        filters.push(slot.colorFilter);
                    }
                    slot.display.filters = filters;
                    slot.display.$setAlpha(1.0);
                }
            }
            else {
                if (slot.colorFilter) {
                    slot.colorFilter = null;
                }
                if (this._batchEnabled) {
                    // RenderNode display.
                    slot.display.$renderNode.filter = null;
                    slot.display.$renderNode.alpha = aM;
                }
                else {
                    // Classic display.
                    slot.display.filters = null;
                    slot.display.$setAlpha(aM);
                }
            }
        };
        Movie.prototype._updateSlotDisplay = function (slot) {
            var prevDisplay = slot.display || slot.rawDisplay;
            var prevChildMovie = slot.childMovie;
            if (slot.displayIndex >= 0) {
                slot.displayConfig = this._groupConfig.display[slot.displayIndex];
                if (slot.displayConfig.type === 1 /* Armature */) {
                    var childMovie = slot.childMovies[slot.displayConfig.name];
                    if (!childMovie) {
                        childMovie = buildMovie(slot.displayConfig.name, this._groupConfig.name);
                        slot.childMovies[slot.displayConfig.name] = childMovie;
                    }
                    slot.display = childMovie;
                    slot.childMovie = childMovie;
                }
                else {
                    slot.display = slot.rawDisplay;
                    slot.childMovie = null;
                }
            }
            else {
                slot.displayConfig = null;
                slot.display = slot.rawDisplay;
                slot.childMovie = null;
            }
            if (slot.display !== prevDisplay) {
                if (prevDisplay) {
                    this.addChild(slot.display);
                    this.swapChildren(slot.display, prevDisplay);
                    this.removeChild(prevDisplay);
                }
                // Update blendMode.
                this._updateSlotBlendMode(slot);
            }
            // Update frame.
            if (slot.display === slot.rawDisplay) {
                if (slot.displayConfig && slot.displayConfig.regionIndex != null) {
                    if (!slot.displayConfig.texture) {
                        var textureAtlasTexture = this._groupConfig.textures[slot.displayConfig.textureIndex || 0];
                        var regionIndex = slot.displayConfig.regionIndex * 4;
                        var x = this._groupConfig.rectangleArray[regionIndex];
                        var y = this._groupConfig.rectangleArray[regionIndex + 1];
                        var width = this._groupConfig.rectangleArray[regionIndex + 2];
                        var height = this._groupConfig.rectangleArray[regionIndex + 3];
                        slot.displayConfig.texture = new egret.Texture();
                        slot.displayConfig.texture._bitmapData = textureAtlasTexture._bitmapData;
                        slot.displayConfig.texture.$initData(x, y, Math.min(width, textureAtlasTexture.textureWidth - x), Math.min(height, textureAtlasTexture.textureHeight - y), 0, 0, Math.min(width, textureAtlasTexture.textureWidth - x), Math.min(height, textureAtlasTexture.textureHeight - y), textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight);
                    }
                    if (this._batchEnabled) {
                        // RenderNode display.
                        var texture = slot.displayConfig.texture;
                        var bitmapNode = slot.rawDisplay.$renderNode;
                        egret.sys.RenderNode.prototype.cleanBeforeRender.call(slot.rawDisplay.$renderNode);
                        bitmapNode.image = texture._bitmapData;
                        bitmapNode.drawImage(texture._bitmapX, texture._bitmapY, texture._bitmapWidth, texture._bitmapHeight, texture._offsetX, texture._offsetY, texture.textureWidth, texture.textureHeight);
                        bitmapNode.imageWidth = texture._sourceWidth;
                        bitmapNode.imageHeight = texture._sourceHeight;
                    }
                    else {
                        // Classic display.
                        slot.rawDisplay.visible = true;
                        slot.rawDisplay.$setBitmapData(slot.displayConfig.texture);
                    }
                }
                else {
                    if (this._batchEnabled) {
                        // RenderNode display.
                        slot.rawDisplay.$renderNode.image = null;
                    }
                    else {
                        // Classic display.
                        slot.rawDisplay.visible = false;
                        slot.rawDisplay.$setBitmapData(null);
                    }
                }
            }
            // Update child movie.
            if (slot.childMovie !== prevChildMovie) {
                if (prevChildMovie) {
                    prevChildMovie.stop();
                    this._childMovies.slice(this._childMovies.indexOf(prevChildMovie), 1);
                }
                if (slot.childMovie) {
                    if (this._childMovies.indexOf(slot.childMovie) < 0) {
                        this._childMovies.push(slot.childMovie);
                    }
                    if (slot.config.action) {
                        slot.childMovie.play(slot.config.action);
                    }
                    else {
                        slot.childMovie.play(slot.childMovie._config.action);
                    }
                }
            }
        };
        Movie.prototype._getSlot = function (name) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.config.name === name) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$render = function () {
            if (this._batchEnabled) {
                // RenderNode display.
            }
            else {
                // Classic display.
                _super.prototype.$render.call(this);
            }
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$measureContentBounds = function (bounds) {
            if (this._batchEnabled && this._cacheRectangle) {
                // RenderNode display.
                bounds.setTo(this._cacheRectangle.x, this._cacheRectangle.y, this._cacheRectangle.width - this._cacheRectangle.x, this._cacheRectangle.height - this._cacheRectangle.y);
            }
            else {
                // Classic display.
                _super.prototype.$measureContentBounds.call(this, bounds);
            }
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$doAddChild = function (child, index, notifyListeners) {
            if (this._batchEnabled) {
                // RenderNode display.
                console.warn("Can not add child.");
                return null;
            }
            // Classic display.
            return _super.prototype.$doAddChild.call(this, child, index, notifyListeners);
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$doRemoveChild = function (index, notifyListeners) {
            if (this._batchEnabled) {
                // RenderNode display.
                console.warn("Can not remove child.");
                return null;
            }
            // Classic display.
            return _super.prototype.$doRemoveChild.call(this, index, notifyListeners);
        };
        /**
         * @language zh_CN
         * 释放动画。
         * @version DragonBones 3.0
         */
        Movie.prototype.dispose = function () {
            if (this._isLockDispose) {
                this._isDelayDispose = true;
            }
            else {
                if (this._clock) {
                    this._clock.remove(this);
                }
                if (this._slots) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].dispose();
                    }
                }
                this._isPlaying = false;
                this._cacheRectangle = null;
                this._clock = null;
                this._groupConfig = null;
                this._config = null;
                this._clipConfig = null;
                this._currentFrameConfig = null;
                this._clipArray = null;
                this._clipNames = null;
                this._slots = null;
                this._childMovies = null;
            }
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.advanceTime = function (passedTime) {
            if (this._isPlaying) {
                this._isLockDispose = true;
                if (passedTime < 0) {
                    passedTime = -passedTime;
                }
                passedTime *= this.timeScale;
                this._time += passedTime * this.clipTimeScale;
                // Modify time.            
                var duration = this._clipConfig.duration;
                var totalTime = duration * this._playTimes;
                var currentTime = this._time;
                var currentPlayTimes = this._currentPlayTimes;
                if (this._playTimes > 0 && (currentTime >= totalTime || currentTime <= -totalTime)) {
                    this._isCompleted = true;
                    currentPlayTimes = this._playTimes;
                    if (currentTime < 0) {
                        currentTime = 0;
                    }
                    else {
                        currentTime = duration;
                    }
                }
                else {
                    this._isCompleted = false;
                    if (currentTime < 0) {
                        currentPlayTimes = Math.floor(-currentTime / duration);
                        currentTime = duration - (-currentTime % duration);
                    }
                    else {
                        currentPlayTimes = Math.floor(currentTime / duration);
                        currentTime %= duration;
                    }
                    if (this._playTimes > 0 && currentPlayTimes > this._playTimes) {
                        currentPlayTimes = this._playTimes;
                    }
                }
                if (this._currentTime === currentTime) {
                    return;
                }
                var cacheFrameIndex = Math.floor(currentTime * this._clipConfig.cacheTimeToFrameScale);
                if (this._cacheFrameIndex !== cacheFrameIndex) {
                    this._cacheFrameIndex = cacheFrameIndex;
                    var displayFrameArray = this._groupConfig.displayFrameArray;
                    var transformArray = this._groupConfig.transformArray;
                    var colorArray = this._groupConfig.colorArray;
                    //
                    var isFirst = true;
                    var hasDisplay = false;
                    var needCacheRectangle = false;
                    var prevCacheRectangle = this._cacheRectangle;
                    this._cacheRectangle = this._clipConfig.cacheRectangles[this._cacheFrameIndex];
                    if (this._batchEnabled && !this._cacheRectangle) {
                        needCacheRectangle = true;
                        this._cacheRectangle = new egret.Rectangle();
                        this._clipConfig.cacheRectangles[this._cacheFrameIndex] = this._cacheRectangle;
                    }
                    // Update slots.
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        var slot = this._slots[i];
                        var clipFrameIndex = this._frameSize * this._cacheFrameIndex + i * 2;
                        if (clipFrameIndex >= this._clipArray.length) {
                            clipFrameIndex = this._frameSize * (this._cacheFrameIndex - 1) + i * 2;
                        }
                        var displayFrameIndex = this._clipArray[clipFrameIndex] * 2;
                        if (displayFrameIndex >= 0) {
                            var displayIndex = displayFrameArray[displayFrameIndex];
                            var colorIndex = displayFrameArray[displayFrameIndex + 1] * 8;
                            var transformIndex = this._clipArray[clipFrameIndex + 1] * 6;
                            var colorChange = false;
                            if (slot.displayIndex !== displayIndex) {
                                slot.displayIndex = displayIndex;
                                colorChange = true;
                                this._updateSlotDisplay(slot);
                            }
                            if (slot.colorIndex !== colorIndex || colorChange) {
                                slot.colorIndex = colorIndex;
                                if (slot.colorIndex >= 0) {
                                    this._updateSlotColor(slot, colorArray[colorIndex] * 0.01, colorArray[colorIndex + 1] * 0.01, colorArray[colorIndex + 2] * 0.01, colorArray[colorIndex + 3] * 0.01, colorArray[colorIndex + 4], colorArray[colorIndex + 5], colorArray[colorIndex + 6], colorArray[colorIndex + 7]);
                                }
                                else {
                                    this._updateSlotColor(slot, 1, 1, 1, 1, 0, 0, 0, 0);
                                }
                            }
                            hasDisplay = true;
                            if (slot.transformIndex !== transformIndex) {
                                slot.transformIndex = transformIndex;
                                if (this._batchEnabled) {
                                    // RenderNode display.
                                    var matrix = slot.display.$renderNode.matrix;
                                    if (!matrix) {
                                        matrix = slot.display.$renderNode.matrix = new egret.Matrix();
                                    }
                                    matrix.a = transformArray[transformIndex];
                                    matrix.b = transformArray[transformIndex + 1];
                                    matrix.c = transformArray[transformIndex + 2];
                                    matrix.d = transformArray[transformIndex + 3];
                                    matrix.tx = transformArray[transformIndex + 4];
                                    matrix.ty = transformArray[transformIndex + 5];
                                }
                                else {
                                    // Classic display.
                                    _helpMatrix.a = transformArray[transformIndex];
                                    _helpMatrix.b = transformArray[transformIndex + 1];
                                    _helpMatrix.c = transformArray[transformIndex + 2];
                                    _helpMatrix.d = transformArray[transformIndex + 3];
                                    _helpMatrix.tx = transformArray[transformIndex + 4];
                                    _helpMatrix.ty = transformArray[transformIndex + 5];
                                    slot.display.$setMatrix(_helpMatrix);
                                }
                            }
                            // 
                            if (this._batchEnabled && needCacheRectangle) {
                                // RenderNode display.
                                var matrix = slot.display.$renderNode.matrix;
                                _helpRectangle.x = 0;
                                _helpRectangle.y = 0;
                                _helpRectangle.width = slot.displayConfig.texture.textureWidth;
                                _helpRectangle.height = slot.displayConfig.texture.textureHeight;
                                matrix.$transformBounds(_helpRectangle);
                                if (isFirst) {
                                    isFirst = false;
                                    this._cacheRectangle.x = _helpRectangle.x;
                                    this._cacheRectangle.width = _helpRectangle.x + _helpRectangle.width;
                                    this._cacheRectangle.y = _helpRectangle.y;
                                    this._cacheRectangle.height = _helpRectangle.y + _helpRectangle.height;
                                }
                                else {
                                    this._cacheRectangle.x = Math.min(this._cacheRectangle.x, _helpRectangle.x);
                                    this._cacheRectangle.width = Math.max(this._cacheRectangle.width, _helpRectangle.x + _helpRectangle.width);
                                    this._cacheRectangle.y = Math.min(this._cacheRectangle.y, _helpRectangle.y);
                                    this._cacheRectangle.height = Math.max(this._cacheRectangle.height, _helpRectangle.y + _helpRectangle.height);
                                }
                            }
                        }
                        else if (slot.displayIndex !== -1) {
                            slot.displayIndex = -1;
                            this._updateSlotDisplay(slot);
                        }
                    }
                    //
                    if (this._cacheRectangle) {
                        if (hasDisplay && needCacheRectangle && isFirst && prevCacheRectangle) {
                            this._cacheRectangle.x = prevCacheRectangle.x;
                            this._cacheRectangle.y = prevCacheRectangle.y;
                            this._cacheRectangle.width = prevCacheRectangle.width;
                            this._cacheRectangle.height = prevCacheRectangle.height;
                        }
                        this.$invalidateContentBounds();
                    }
                }
                if (this._isCompleted) {
                    this._isPlaying = false;
                }
                if (!this._isStarted) {
                    this._isStarted = true;
                    if (this.hasEventListener(MovieEvent.START)) {
                        var event_3 = egret.Event.create(MovieEvent, MovieEvent.START);
                        event_3.movie = this;
                        event_3.clipName = this._clipConfig.name;
                        event_3.name = null;
                        event_3.slotName = null;
                        this.dispatchEvent(event_3);
                    }
                }
                this._isReversing = this._currentTime > currentTime && this._currentPlayTimes === currentPlayTimes;
                this._currentTime = currentTime;
                // Action and event.
                var frameCount = this._clipConfig.frame ? this._clipConfig.frame.length : 0;
                if (frameCount > 0) {
                    var currentFrameIndex = Math.floor(this._currentTime * this._config.frameRate);
                    var currentFrameConfig = this._groupConfig.frame[this._clipConfig.frame[currentFrameIndex]];
                    if (this._currentFrameConfig !== currentFrameConfig) {
                        if (frameCount > 1) {
                            var crossedFrameConfig = this._currentFrameConfig;
                            this._currentFrameConfig = currentFrameConfig;
                            if (!crossedFrameConfig) {
                                var prevFrameIndex = Math.floor(this._currentTime * this._config.frameRate);
                                crossedFrameConfig = this._groupConfig.frame[this._clipConfig.frame[prevFrameIndex]];
                                if (this._isReversing) {
                                }
                                else {
                                    if (this._currentTime <= crossedFrameConfig.position ||
                                        this._currentPlayTimes !== currentPlayTimes) {
                                        crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.prev];
                                    }
                                }
                            }
                            if (this._isReversing) {
                                while (crossedFrameConfig !== currentFrameConfig) {
                                    this._onCrossFrame(crossedFrameConfig);
                                    crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.prev];
                                }
                            }
                            else {
                                while (crossedFrameConfig !== currentFrameConfig) {
                                    crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.next];
                                    this._onCrossFrame(crossedFrameConfig);
                                }
                            }
                        }
                        else {
                            this._currentFrameConfig = currentFrameConfig;
                            if (this._currentFrameConfig) {
                                this._onCrossFrame(this._currentFrameConfig);
                            }
                        }
                    }
                }
                if (this._currentPlayTimes !== currentPlayTimes) {
                    this._currentPlayTimes = currentPlayTimes;
                    if (this.hasEventListener(MovieEvent.LOOP_COMPLETE)) {
                        var event_4 = egret.Event.create(MovieEvent, MovieEvent.LOOP_COMPLETE);
                        event_4.movie = this;
                        event_4.clipName = this._clipConfig.name;
                        event_4.name = null;
                        event_4.slotName = null;
                        this.dispatchEvent(event_4);
                        egret.Event.release(event_4);
                    }
                    if (this._isCompleted && this.hasEventListener(MovieEvent.COMPLETE)) {
                        var event_5 = egret.Event.create(MovieEvent, MovieEvent.COMPLETE);
                        event_5.movie = this;
                        event_5.clipName = this._clipConfig.name;
                        event_5.name = null;
                        event_5.slotName = null;
                        this.dispatchEvent(event_5);
                        egret.Event.release(event_5);
                    }
                }
            }
            this._isLockDispose = false;
            if (this._isDelayDispose) {
                this.dispose();
            }
        };
        /**
         * @language zh_CN
         * 播放动画剪辑。
         * @param clipName 动画剪辑的名称，如果未设置，则播放默认动画剪辑，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画剪辑。
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         */
        Movie.prototype.play = function (clipName, playTimes) {
            if (clipName === void 0) { clipName = null; }
            if (playTimes === void 0) { playTimes = -1; }
            if (clipName) {
                var clipConfig = null;
                for (var i = 0, l = this._config.clip.length; i < l; ++i) {
                    var data = this._config.clip[i];
                    if (data.name === clipName) {
                        clipConfig = data;
                    }
                }
                if (clipConfig) {
                    this._clipConfig = clipConfig;
                    this._clipArray = new Int16Array(this._groupConfig.arrayBuffer, this._groupConfig.offset + this._groupConfig.position[0] + this._clipConfig.p, this._clipConfig.s / this._groupConfig.position[2]);
                    if (!this._clipConfig.cacheRectangles) {
                        this._clipConfig.cacheRectangles = [];
                    }
                    this._isPlaying = true;
                    this._isStarted = false;
                    this._isCompleted = false;
                    if (playTimes < 0 || playTimes !== playTimes) {
                        this._playTimes = this._clipConfig.playTimes;
                    }
                    else {
                        this._playTimes = playTimes;
                    }
                    this._time = 0;
                    this._currentTime = 0;
                    this._currentPlayTimes = 0;
                    this._cacheFrameIndex = -1;
                    this._currentFrameConfig = null;
                    this._cacheRectangle = null;
                    this.clipTimeScale = 1 / this._clipConfig.scale;
                }
                else {
                    console.warn("No clip in movie.", this._config.name, clipName);
                }
            }
            else if (this._clipConfig) {
                if (this._isPlaying || this._isCompleted) {
                    this.play(this._clipConfig.name, this._playTimes);
                }
                else {
                    this._isPlaying = true;
                }
                // playTimes
            }
            else if (this._config.action) {
                this.play(this._config.action, playTimes);
            }
        };
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @version DragonBones 4.7
         */
        Movie.prototype.stop = function () {
            this._isPlaying = false;
        };
        /**
         * @language zh_CN
         * 从指定时间播放动画。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 5.0
         */
        Movie.prototype.gotoAndPlay = function (clipName, time, playTimes) {
            if (clipName === void 0) { clipName = null; }
            if (playTimes === void 0) { playTimes = -1; }
            time %= this._clipConfig.duration;
            if (time < 0) {
                time += this._clipConfig.duration;
            }
            this.play(clipName, playTimes);
            this._time = time;
            this._currentTime = time;
        };
        /**
         * @language zh_CN
         * 将动画停止到指定时间。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @version DragonBones 5.0
         */
        Movie.prototype.gotoAndStop = function (clipName, time) {
            if (clipName === void 0) { clipName = null; }
            time %= this._clipConfig.duration;
            if (time < 0) {
                time += this._clipConfig.duration;
            }
            this.play(clipName, 1);
            this._time = time;
            this._currentTime = time;
            this.advanceTime(0.001);
            this.stop();
        };
        /**
         * @language zh_CN
         * 是否包含指定动画剪辑。
         * @param clipName 动画剪辑的名称。
         * @version DragonBones 4.7
         */
        Movie.prototype.hasClip = function (clipName) {
            for (var i = 0, l = this._config.clip.length; i < l; ++i) {
                var clip = this._config.clip[i];
                if (clip.name === clipName) {
                    return true;
                }
            }
            return false;
        };
        Object.defineProperty(Movie.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 动画剪辑是否处正在播放。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._isPlaying && !this._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "isComplete", {
            /**
             * @language zh_CN
             * 动画剪辑是否均播放完毕。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "currentTime", {
            /**
             * @language zh_CN
             * 当前动画剪辑的播放时间。 (以秒为单位)
             * @version DragonBones 4.7
             */
            get: function () {
                return this._currentTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "totalTime", {
            /**
             * @language zh_CN
             * 当前动画剪辑的总时间。 (以秒为单位)
             * @version DragonBones 4.7
             */
            get: function () {
                return this._clipConfig ? this._clipConfig.duration : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "currentPlayTimes", {
            /**
             * @language zh_CN
             * 当前动画剪辑的播放次数。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._currentPlayTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "playTimes", {
            /**
             * @language zh_CN
             * 当前动画剪辑需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
             * @version DragonBones 4.7
             */
            get: function () {
                return this._playTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "groupName", {
            get: function () {
                return this._groupConfig.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "clipName", {
            /**
             * @language zh_CN
             * 正在播放的动画剪辑名称。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._clipConfig ? this._clipConfig.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "clipNames", {
            /**
             * @language zh_CN
             * 所有动画剪辑的名称。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._clipNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "clock", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._clock;
            },
            set: function (value) {
                if (this._clock === value) {
                    return;
                }
                var prevClock = this._clock;
                if (prevClock) {
                    prevClock.remove(this);
                }
                this._clock = value;
                if (this._clock) {
                    this._clock.add(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.Movie#clock
         * @see dragonBones.EgretFactory#clock
         * @see dragonBones.Movie#timescale
         * @see dragonBones.Movie#stop()
         */
        Movie.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                this.clock = dragonBones.EgretFactory.clock;
            }
            else {
                this.clock = null;
            }
        };
        Object.defineProperty(Movie.prototype, "display", {
            //========================================= // 兼容旧数据
            /**
             * @private
             */
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "animation", {
            /**
             * @private
             */
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "armature", {
            /**
             * @private
             */
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        Movie.prototype.getAnimation = function () {
            return this;
        };
        /**
         * @private
         */
        Movie.prototype.getArmature = function () {
            return this;
        };
        /**
         * @private
         */
        Movie.prototype.getDisplay = function () {
            return this;
        };
        /**
         * @private
         */
        Movie.prototype.hasAnimation = function (name) {
            return this.hasClip(name);
        };
        /**
         * @private
         */
        Movie.prototype.invalidUpdate = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
        };
        Object.defineProperty(Movie.prototype, "lastAnimationName", {
            /**
             * @private
             */
            get: function () {
                return this.clipName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "animationNames", {
            /**
             * @private
             */
            get: function () {
                return this.clipNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "animationList", {
            /**
             * @private
             */
            get: function () {
                return this.clipNames;
            },
            enumerable: true,
            configurable: true
        });
        return Movie;
    }(egret.DisplayObjectContainer));
    dragonBones.Movie = Movie;
})(dragonBones || (dragonBones = {}));
