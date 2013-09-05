/// <reference path="createjs.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dragonBones;
(function (dragonBones) {
    (function (events) {
        var Event = (function () {
            function Event(type) {
                this.type = type;
            }
            return Event;
        })();
        events.Event = Event;

        var AnimationEvent = (function (_super) {
            __extends(AnimationEvent, _super);
            function AnimationEvent(type) {
                _super.call(this, type);
            }
            AnimationEvent.FADE_IN = "fadeIn";
            AnimationEvent.FADE_OUT = "fadeOut";
            AnimationEvent.START = "start";
            AnimationEvent.COMPLETE = "complete";
            AnimationEvent.LOOP_COMPLETE = "loopComplete";
            AnimationEvent.FADE_IN_COMPLETE = "fadeInComplete";
            AnimationEvent.FADE_OUT_COMPLETE = "fadeOutComplete";
            return AnimationEvent;
        })(Event);
        events.AnimationEvent = AnimationEvent;

        var ArmatureEvent = (function (_super) {
            __extends(ArmatureEvent, _super);
            function ArmatureEvent(type) {
                _super.call(this, type);
            }
            ArmatureEvent.Z_ORDER_UPDATED = "zOrderUpdated";
            return ArmatureEvent;
        })(Event);
        events.ArmatureEvent = ArmatureEvent;

        var FrameEvent = (function (_super) {
            __extends(FrameEvent, _super);
            function FrameEvent(type) {
                _super.call(this, type);
            }
            FrameEvent.ANIMATION_FRAME_EVENT = "animationFrameEvent";
            FrameEvent.BONE_FRAME_EVENT = "boneFrameEvent";
            return FrameEvent;
        })(Event);
        events.FrameEvent = FrameEvent;

        var SoundEvent = (function (_super) {
            __extends(SoundEvent, _super);
            function SoundEvent(type) {
                _super.call(this, type);
            }
            SoundEvent.SOUND = "sound";
            SoundEvent.BONE_FRAME_EVENT = "boneFrameEvent";
            return SoundEvent;
        })(Event);
        events.SoundEvent = SoundEvent;

        var EventDispatcher = (function () {
            function EventDispatcher() {
            }
            EventDispatcher.prototype.hasEventListener = function (type) {
                if (this._listenersMap && this._listenersMap[type]) {
                    return true;
                }
                return false;
            };

            EventDispatcher.prototype.addEventListener = function (type, listener) {
                if (type && listener) {
                    if (!this._listenersMap) {
                        this._listenersMap = {};
                    }
                    var listeners = this._listenersMap[type];
                    if (listeners) {
                        this.removeEventListener(type, listener);
                    }
                    if (listeners) {
                        listeners.push(listener);
                    } else {
                        this._listenersMap[type] = [listener];
                    }
                }
            };

            EventDispatcher.prototype.removeEventListener = function (type, listener) {
                if (!this._listenersMap || !type || !listener) {
                    return;
                }
                var listeners = this._listenersMap[type];
                if (listeners) {
                    for (var i = 0, l = listeners.length; i < length; i++) {
                        if (listeners[i] == listener) {
                            if (l == 1) {
                                listeners.length = 0;
                                delete this._listenersMap[type];
                            } else {
                                listeners.splice(i, 1);
                            }
                        }
                    }
                }
            };

            EventDispatcher.prototype.removeAllEventListeners = function (type) {
                if (type) {
                    delete this._listenersMap[type];
                } else {
                    this._listenersMap = null;
                }
            };

            EventDispatcher.prototype.dispatchEvent = function (event) {
                if (event) {
                    var listeners = this._listenersMap[event.type];
                    if (listeners) {
                        event.target = this;
                        var listenersCopy = listeners.concat();
                        for (var i = 0, l = listenersCopy.length; i < l; i++) {
                            listenersCopy[i](event);
                        }
                    }
                }
            };
            return EventDispatcher;
        })();
        events.EventDispatcher = EventDispatcher;

        var SoundEventManager = (function (_super) {
            __extends(SoundEventManager, _super);
            function SoundEventManager() {
                _super.call(this);
                if (SoundEventManager._instance) {
                    throw new Error("Singleton already constructed!");
                }
            }
            SoundEventManager.getInstance = function () {
                if (!SoundEventManager._instance) {
                    SoundEventManager._instance = new SoundEventManager();
                }
                return SoundEventManager._instance;
            };
            return SoundEventManager;
        })(EventDispatcher);
        events.SoundEventManager = SoundEventManager;
    })(dragonBones.events || (dragonBones.events = {}));
    var events = dragonBones.events;

    (function (animation) {
        var Animation = (function () {
            function Animation(armature) {
            }
            return Animation;
        })();
        animation.Animation = Animation;

        var AnimationState = (function () {
            function AnimationState() {
            }
            return AnimationState;
        })();
        animation.AnimationState = AnimationState;

        var TimelineState = (function () {
            function TimelineState() {
            }
            return TimelineState;
        })();
        animation.TimelineState = TimelineState;

        var WorldClock = (function () {
            function WorldClock() {
            }
            return WorldClock;
        })();
        animation.WorldClock = WorldClock;
    })(dragonBones.animation || (dragonBones.animation = {}));
    var animation = dragonBones.animation;

    (function (display) {
        var CreateJSDisplayBridge = (function () {
            function CreateJSDisplayBridge() {
            }
            CreateJSDisplayBridge.prototype.getVisible = function () {
                return this._display ? this._display.visible : false;
            };
            CreateJSDisplayBridge.prototype.setVisible = function (value) {
                if (this._display) {
                    this._display.visible = value;
                }
            };

            CreateJSDisplayBridge.prototype.getDisplay = function () {
                return this._display;
            };
            CreateJSDisplayBridge.prototype.setDisplay = function (value) {
                if (this._display == value) {
                    return;
                }
                if (this._display) {
                    var parent = this._display.parent;
                    if (parent) {
                        var index = this._display.parent.getChildIndex(this._display);
                    }
                    this.removeDisplay();
                }
                this._display = value;
                this.addDisplay(parent, index);
            };

            CreateJSDisplayBridge.prototype.dispose = function () {
                this._display = null;
            };

            CreateJSDisplayBridge.prototype.updateTransform = function (matrix, transform) {
                /*var pivotX:number = this._display.regX;
                var pivotY:number = this._display.regY;
                matrix.tx -= matrix.a * pivotX + matrix.c * pivotY;
                matrix.ty -= matrix.b * pivotX + matrix.d * pivotY;
                
                this._display._matrix.a = matrix.a;
                this._display._matrix.b = matrix.b;
                this._display._matrix.c = matrix.c;
                this._display._matrix.d = matrix.d;
                this._display._matrix.tx = matrix.tx;
                this._display._matrix.ty = matrix.ty;*/
                this._display.x = transform.x;
                this._display.y = transform.y;
                this._display.skewX = transform.skewX;
                this._display.skewY = transform.skewY;
                this._display.scaleX = transform.scaleX;
                this._display.scaleY = transform.scaleY;
            };

            CreateJSDisplayBridge.prototype.updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier) {
            };

            CreateJSDisplayBridge.prototype.addDisplay = function (container, index) {
                var parent = container;
                if (parent && this._display) {
                    if (index < 0) {
                        parent.addChild(this._display);
                    } else {
                        parent.addChildAt(this._display, Math.min(index, parent.getNumChildren()));
                    }
                }
            };

            CreateJSDisplayBridge.prototype.removeDisplay = function () {
                if (this._display && this._display.parent) {
                    this._display.parent.removeChild(this._display);
                }
            };
            return CreateJSDisplayBridge;
        })();
        display.CreateJSDisplayBridge = CreateJSDisplayBridge;
    })(dragonBones.display || (dragonBones.display = {}));
    var display = dragonBones.display;

    (function (factorys) {
        var BaseFactory = (function () {
            function BaseFactory() {
            }
            return BaseFactory;
        })();
        factorys.BaseFactory = BaseFactory;

        var CreateJSFactory = (function (_super) {
            __extends(CreateJSFactory, _super);
            function CreateJSFactory() {
                _super.call(this);
            }
            return CreateJSFactory;
        })(BaseFactory);
        factorys.CreateJSFactory = CreateJSFactory;
    })(dragonBones.factorys || (dragonBones.factorys = {}));
    var factorys = dragonBones.factorys;

    (function (objects) {
        var DisplayData = (function () {
            function DisplayData() {
            }
            return DisplayData;
        })();
        objects.DisplayData = DisplayData;

        var SlotData = (function () {
            function SlotData() {
            }
            return SlotData;
        })();
        objects.SlotData = SlotData;

        var BoneData = (function () {
            function BoneData() {
            }
            return BoneData;
        })();
        objects.BoneData = BoneData;

        var SkinData = (function () {
            function SkinData() {
            }
            return SkinData;
        })();
        objects.SkinData = SkinData;

        var ArmatureData = (function () {
            function ArmatureData() {
            }
            return ArmatureData;
        })();
        objects.ArmatureData = ArmatureData;

        var Timeline = (function () {
            function Timeline() {
            }
            return Timeline;
        })();
        objects.Timeline = Timeline;

        var Frame = (function () {
            function Frame() {
            }
            return Frame;
        })();
        objects.Frame = Frame;

        var TransformFrame = (function (_super) {
            __extends(TransformFrame, _super);
            function TransformFrame() {
                _super.call(this);
            }
            return TransformFrame;
        })(Frame);
        objects.TransformFrame = TransformFrame;

        var AnimationData = (function (_super) {
            __extends(AnimationData, _super);
            function AnimationData() {
                _super.call(this);
            }
            return AnimationData;
        })(Timeline);
        objects.AnimationData = AnimationData;

        var DBTransform = (function () {
            function DBTransform() {
                this.x = 0;
                this.y = 0;
                this.skewX = 0;
                this.skewY = 0;
                this.scaleX = 1;
                this.scaleY = 1;
            }
            DBTransform.prototype.getRotation = function () {
                return this.skewX;
            };
            DBTransform.prototype.setRotation = function (value) {
                this.skewX = this.skewY = value;
            };

            DBTransform.prototype.copy = function (transform) {
                this.x = transform.x;
                this.y = transform.y;
                this.skewX = transform.skewX;
                this.skewY = transform.skewY;
                this.scaleX = transform.scaleX;
                this.scaleY = transform.scaleY;
            };
            return DBTransform;
        })();
        objects.DBTransform = DBTransform;
    })(dragonBones.objects || (dragonBones.objects = {}));
    var objects = dragonBones.objects;

    (function (textures) {
        var CreateJSTextureAtlas = (function () {
            function CreateJSTextureAtlas() {
            }
            return CreateJSTextureAtlas;
        })();
        textures.CreateJSTextureAtlas = CreateJSTextureAtlas;
    })(dragonBones.textures || (dragonBones.textures = {}));
    var textures = dragonBones.textures;

    (function (geom) {
        var Point = (function () {
            function Point() {
                this.x = 0;
                this.y = 0;
            }
            return Point;
        })();
        geom.Point = Point;

        var Matrix = (function () {
            function Matrix() {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.tx = 0;
                this.ty = 0;
            }
            return Matrix;
        })();
        geom.Matrix = Matrix;
    })(dragonBones.geom || (dragonBones.geom = {}));
    var geom = dragonBones.geom;

    (function (utils) {
        var ConstValues = (function () {
            function ConstValues() {
            }
            ConstValues.ANGLE_TO_RADIAN = Math.PI / 180;

            ConstValues.DRAGON_BONES = "dragonBones";
            ConstValues.ARMATURE = "armature";
            ConstValues.SKIN = "skin";
            ConstValues.BONE = "bone";
            ConstValues.SLOT = "slot";
            ConstValues.DISPLAY = "display";
            ConstValues.ANIMATION = "animation";
            ConstValues.TIMELINE = "timeline";
            ConstValues.FRAME = "frame";
            ConstValues.TRANSFORM = "transform";
            ConstValues.COLOR_TRANSFORM = "colorTransform";

            ConstValues.TEXTURE_ATLAS = "TextureAtlas";
            ConstValues.SUB_TEXTURE = "SubTexture";

            ConstValues.A_VERSION = "version";
            ConstValues.A_IMAGE_PATH = "imagePath";
            ConstValues.A_FRAME_RATE = "frameRate";
            ConstValues.A_NAME = "name";
            ConstValues.A_PARENT = "parent";
            ConstValues.A_LENGTH = "length";
            ConstValues.A_TYPE = "type";
            ConstValues.A_FADE_IN_TIME = "fadeInTime";
            ConstValues.A_DURATION = "duration";
            ConstValues.A_SCALE = "scale";
            ConstValues.A_OFFSET = "offset";
            ConstValues.A_LOOP = "loop";
            ConstValues.A_EVENT = "event";
            ConstValues.A_SOUND = "sound";
            ConstValues.A_ACTION = "action";
            ConstValues.A_HIDE = "hide";
            ConstValues.A_TWEEN_EASING = "tweenEasing";
            ConstValues.A_TWEEN_ROTATE = "tweenRotate";
            ConstValues.A_DISPLAY_INDEX = "displayIndex";
            ConstValues.A_Z_ORDER = "z";
            ConstValues.A_WIDTH = "width";
            ConstValues.A_HEIGHT = "height";
            ConstValues.A_X = "x";
            ConstValues.A_Y = "y";
            ConstValues.A_SKEW_X = "skX";
            ConstValues.A_SKEW_Y = "skY";
            ConstValues.A_SCALE_X = "scX";
            ConstValues.A_SCALE_Y = "scY";
            ConstValues.A_PIVOT_X = "pX";
            ConstValues.A_PIVOT_Y = "pY";
            ConstValues.A_ALPHA_OFFSET = "aO";
            ConstValues.A_RED_OFFSET = "rO";
            ConstValues.A_GREEN_OFFSET = "gO";
            ConstValues.A_BLUE_OFFSET = "bO";
            ConstValues.A_ALPHA_MULTIPLIER = "aM";
            ConstValues.A_RED_MULTIPLIER = "rM";
            ConstValues.A_GREEN_MULTIPLIER = "gM";
            ConstValues.A_BLUE_MULTIPLIER = "bM";
            return ConstValues;
        })();
        utils.ConstValues = ConstValues;

        var TransformUtil = (function () {
            function TransformUtil() {
            }
            return TransformUtil;
        })();
        utils.TransformUtil = TransformUtil;

        var DBDataUtil = (function () {
            function DBDataUtil() {
            }
            return DBDataUtil;
        })();
        utils.DBDataUtil = DBDataUtil;
    })(dragonBones.utils || (dragonBones.utils = {}));
    var utils = dragonBones.utils;

    /** @private */
    var DBObject = (function () {
        function DBObject() {
            this.global = new objects.DBTransform();
            this.origin = new objects.DBTransform();
            this.offset = new objects.DBTransform();
            this.tween = new objects.DBTransform();
            this.tween.scaleX = this.tween.scaleY = 0;

            this._globalTransformMatrix = new geom.Matrix();

            this._visible = true;
        }
        DBObject.prototype.getVisible = function () {
            return this._visible;
        };
        DBObject.prototype.setVisible = function (value) {
            this._visible = value;
        };

        /** @private */
        DBObject.prototype._setParent = function (value) {
            this.parent = value;
        };

        /** @private */
        DBObject.prototype._setArmature = function (value) {
            if (this.armature) {
                this.armature._removeDBObject(this);
            }
            this.armature = value;
            if (this.armature) {
                this.armature._addDBObject(this);
            }
        };

        DBObject.prototype.dispose = function () {
            this.parent = null;
            this.armature = null;
            this.global = null;
            this.origin = null;
            this.offset = null;
            this.tween = null;
            this._globalTransformMatrix = null;
        };

        /** @private */
        DBObject.prototype._update = function () {
            this.global.scaleX = (this.origin.scaleX + this.tween.scaleX) * this.offset.scaleX;
            this.global.scaleY = (this.origin.scaleY + this.tween.scaleY) * this.offset.scaleY;

            if (this.parent) {
                var x = this.origin.x + this.offset.x + this.tween.x;
                var y = this.origin.y + this.offset.y + this.tween.y;
                var parentMatrix = this.parent._globalTransformMatrix;

                this._globalTransformMatrix.tx = this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                this._globalTransformMatrix.ty = this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;

                if (this.fixedRotation) {
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
                } else {
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX + this.parent.global.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY + this.parent.global.skewY;
                }

                if (this.parent.scaleMode >= this._scaleType) {
                    this.global.scaleX *= this.parent.global.scaleX;
                    this.global.scaleY *= this.parent.global.scaleY;
                }
            } else {
                this._globalTransformMatrix.tx = this.global.x = this.origin.x + this.offset.x + this.tween.x;
                this._globalTransformMatrix.ty = this.global.y = this.origin.y + this.offset.y + this.tween.y;

                this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
            }

            this._globalTransformMatrix.a = this.global.scaleX * Math.cos(this.global.skewY);
            this._globalTransformMatrix.b = this.global.scaleX * Math.sin(this.global.skewY);
            this._globalTransformMatrix.c = -this.global.scaleY * Math.sin(this.global.skewX);
            this._globalTransformMatrix.d = this.global.scaleY * Math.cos(this.global.skewX);
        };
        return DBObject;
    })();
    dragonBones.DBObject = DBObject;

    var Slot = (function (_super) {
        __extends(Slot, _super);
        function Slot(displayBrideg) {
            _super.call(this);
            this._displayBridge = displayBrideg;
            this._displayList = [];
            this._displayIndex = -1;
            this._scaleType = 1;

            this._originZOrder = 0;
            this._tweenZorder = 0;
            this._offsetZOrder = 0;

            this._isDisplayOnStage = false;
            this._isHideDisplay = false;
        }
        Slot.prototype.getZOrder = function () {
            return this._originZOrder + this._tweenZorder + this._offsetZOrder;
        };

        Slot.prototype.setZOrder = function (value) {
            if (this.getZOrder() != value) {
                this._offsetZOrder = value - this._originZOrder - this._tweenZorder;
                if (this.armature) {
                    this.armature._slotsZOrderChanged = true;
                }
            }
        };

        Slot.prototype.getDisplay = function () {
            var display = this._displayList[this._displayIndex];
            if (display instanceof Armature) {
                return (display).display;
            }
            return display;
        };
        Slot.prototype.setDisplay = function (value) {
            this._displayList[this._displayIndex] = value;
            this._setDisplay(value);
        };

        Slot.prototype.getChildArmature = function () {
            return this._displayList[this._displayIndex];
        };
        Slot.prototype.setChildArmature = function (value) {
            this._displayList[this._displayIndex] = value;
            if (value) {
                this._setDisplay(value.display);
            }
        };

        Slot.prototype.getDisplayList = function () {
            return this._displayList;
        };
        Slot.prototype.setDisplayList = function (value) {
            if (!value) {
                throw new Error();
            }
            var i = this._displayList.length = value.length;
            while (i--) {
                this._displayList[i] = value[i];
            }

            if (this._displayIndex >= 0) {
                this._displayIndex = -1;
                this._changeDisplay(this._displayIndex);
            }
        };

        Slot.prototype._setDisplay = function (display) {
            if (this._displayBridge.getDisplay()) {
                this._displayBridge.setDisplay(display);
            } else {
                this._displayBridge.setDisplay(display);
                if (this.armature) {
                    this._displayBridge.addDisplay(this.armature.display, -1);
                    this.armature._slotsZOrderChanged = true;
                }
            }

            this.updateChildArmatureAnimation();

            if (!this._isHideDisplay && this._displayBridge.getDisplay()) {
                this._isDisplayOnStage = true;
            } else {
                this._isDisplayOnStage = false;
            }
        };

        /** @private */
        Slot.prototype._changeDisplay = function (displayIndex) {
            if (displayIndex < 0) {
                if (!this._isHideDisplay) {
                    this._isHideDisplay = true;
                    this._displayBridge.removeDisplay();
                    this.updateChildArmatureAnimation();
                }
            } else {
                if (this._isHideDisplay) {
                    this._isHideDisplay = false;
                    var changeShowState = true;
                    if (this.armature) {
                        this._displayBridge.addDisplay(this.armature.display, -1);
                        this.armature._slotsZOrderChanged = true;
                    }
                }

                var length = this._displayList.length;
                if (displayIndex >= length && length > 0) {
                    displayIndex = length - 1;
                }
                if (this._displayIndex != displayIndex) {
                    this._displayIndex = displayIndex;

                    var content = this._displayList[this._displayIndex];
                    if (content instanceof Armature) {
                        this._setDisplay((content).display);
                    } else {
                        this._setDisplay(content);
                    }

                    if (this._dislayDataList && this._displayIndex <= this._dislayDataList.length) {
                        this.origin.copy(this._dislayDataList[this._displayIndex].transform);
                    }
                } else if (changeShowState) {
                    this.updateChildArmatureAnimation();
                }
            }

            if (!this._isHideDisplay && this._displayBridge.getDisplay()) {
                this._isDisplayOnStage = true;
            } else {
                this._isDisplayOnStage = false;
            }
        };

        Slot.prototype.setVisible = function (value) {
            if (value != this._visible) {
                this._visible = value;
                this._updateVisible(this._visible);
            }
        };

        /** @private */
        Slot.prototype._setArmature = function (value) {
            _super.prototype._setArmature.call(this, value);
            if (this.armature) {
                this.armature._slotsZOrderChanged = true;
                this._displayBridge.addDisplay(this.armature.display, -1);
            } else {
                this._displayBridge.removeDisplay();
            }
        };

        Slot.prototype.dispose = function () {
            if (!this._displayBridge) {
                return;
            }
            _super.prototype.dispose.call(this);

            this._displayBridge.dispose();
            this._displayList.length = 0;

            this._displayBridge = null;
            this._displayList = null;
            this._dislayDataList = null;
        };

        /** @private */
        Slot.prototype._update = function () {
            _super.prototype._update.call(this);

            if (this._isDisplayOnStage) {
                var pivotX = this.parent._tweenPivot.x;
                var pivotY = this.parent._tweenPivot.y;
                if (pivotX || pivotY) {
                    var parentMatrix = this.parent._globalTransformMatrix;
                    this._globalTransformMatrix.tx += parentMatrix.a * pivotX + parentMatrix.c * pivotY;
                    this._globalTransformMatrix.ty += parentMatrix.b * pivotX + parentMatrix.d * pivotY;
                }

                this._displayBridge.updateTransform(this._globalTransformMatrix, this.global);
            }
        };

        /** @private */
        Slot.prototype._updateVisible = function (value) {
            this._displayBridge.setVisible(this.parent.getVisible() && this._visible && value);
        };

        Slot.prototype.updateChildArmatureAnimation = function () {
            var childArmature = this.getChildArmature();

            if (childArmature) {
                if (this._isHideDisplay) {
                    childArmature.animation.stop();
                    childArmature.animation._lastAnimationState = null;
                } else {
                    if (this.armature && this.armature.animation.lastAnimationState && childArmature.animation.hasAnimation(this.armature.animation.lastAnimationState.name)) {
                        childArmature.animation.gotoAndPlay(this.armature.animation.lastAnimationState.name);
                    } else {
                        childArmature.animation.play();
                    }
                }
            }
        };
        return Slot;
    })(DBObject);
    dragonBones.Slot = Slot;

    var Bone = (function (_super) {
        __extends(Bone, _super);
        function Bone() {
            _super.call(this);
            this._children = [];
            this._scaleType = 2;

            this._tweenPivot = new geom.Point();

            this.scaleMode = 1;
        }
        Bone.prototype.setVisible = function (value) {
            if (this._visible != value) {
                this._visible = value;
                var i = this._children.length;
                while (i--) {
                    var slot = this._children[i];
                    if (slot) {
                        slot._updateVisible(this._visible);
                    }
                }
            }
        };

        /** @private */
        Bone.prototype._setArmature = function (value) {
            _super.prototype._setArmature.call(this, value);
            var i = this._children.length;
            while (i--) {
                this._children[i]._setArmature(this.armature);
            }
        };

        Bone.prototype.dispose = function () {
            if (!this._children) {
                return;
            }
            _super.prototype.dispose.call(this);

            var i = this._children.length;
            while (i--) {
                this._children[i].dispose();
            }
            this._children.length = 0;

            this._children = null;
            this._tweenPivot = null;

            this.slot = null;
        };

        Bone.prototype.contains = function (child) {
            if (!child) {
                throw new Error();
            }
            if (child == this) {
                return false;
            }
            var ancestor = child;
            while (!(ancestor == this || ancestor == null)) {
                ancestor = ancestor.parent;
            }
            return ancestor == this;
        };

        Bone.prototype.addChild = function (child) {
            if (!child) {
                throw new Error();
            }

            var bone = child;
            if (child == this || (bone && bone.contains(this))) {
                throw new Error("An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)");
            }

            if (child.parent) {
                child.parent.removeChild(child);
            }
            this._children[this._children.length] = child;
            child._setParent(this);
            child._setArmature(this.armature);

            if (!this.slot && child instanceof Slot) {
                this.slot = child;
            }
        };

        Bone.prototype.removeChild = function (child) {
            if (!child) {
                throw new Error();
            }

            var index = this._children.indexOf(child);
            if (index >= 0) {
                this._children.splice(index, 1);
                child._setParent(null);
                child._setArmature(null);

                if (this.slot && child == this.slot) {
                    this.slot = null;
                }
            } else {
                throw new Error();
            }
        };

        Bone.prototype.getSlots = function () {
            var slotList = [];
            var i = this._children.length;
            while (i--) {
                if (this._children[i] instanceof Slot) {
                    slotList.unshift(this._children[i]);
                }
            }
            return slotList;
        };

        /** @private */
        Bone.prototype._arriveAtFrame = function (frame, timelineState, animationState, isCross) {
            if (frame) {
                var mixingType = animationState.getMixingTransform(name);
                if (animationState.displayControl && (mixingType == 2 || mixingType == -1)) {
                    if (!this.displayController || this.displayController == animationState.name) {
                        var tansformFrame = frame;
                        if (this.slot) {
                            var displayIndex = tansformFrame.displayIndex;
                            if (displayIndex >= 0) {
                                if (!isNaN(tansformFrame.zOrder) && tansformFrame.zOrder != this.slot._tweenZorder) {
                                    this.slot._tweenZorder = tansformFrame.zOrder;
                                    this.armature._slotsZOrderChanged = true;
                                }
                            }
                            this.slot._changeDisplay(displayIndex);
                            this.slot._updateVisible(tansformFrame.visible);
                        }
                    }
                }

                if (frame.event && this.armature.hasEventListener(events.FrameEvent.BONE_FRAME_EVENT)) {
                    var frameEvent = new events.FrameEvent(events.FrameEvent.BONE_FRAME_EVENT);
                    frameEvent.bone = this;
                    frameEvent.animationState = animationState;
                    frameEvent.frameLabel = frame.event;
                    this.armature._eventList.push(frameEvent);
                }

                if (frame.sound && Bone._soundManager.hasEventListener(events.SoundEvent.SOUND)) {
                    var soundEvent = new events.SoundEvent(events.SoundEvent.SOUND);
                    soundEvent.armature = this.armature;
                    soundEvent.animationState = animationState;
                    soundEvent.sound = frame.sound;
                    Bone._soundManager.dispatchEvent(soundEvent);
                }

                if (frame.action) {
                    var childArmature = this.getChildArmature();
                    if (childArmature) {
                        childArmature.animation.gotoAndPlay(frame.action);
                    }
                }
            } else {
                if (this.slot) {
                    this.slot._changeDisplay(-1);
                }
            }
        };

        /** @private */
        Bone.prototype._updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, isColorChanged) {
            if (isColorChanged || this._isColorChanged) {
                this.slot._displayBridge.updateColor(aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier);
            }
            this._isColorChanged = isColorChanged;
        };
        Bone._soundManager = events.SoundEventManager.getInstance();
        return Bone;
    })(DBObject);
    dragonBones.Bone = Bone;

    var Armature = (function (_super) {
        __extends(Armature, _super);
        function Armature(display) {
            _super.call(this);

            this.display = display;
            this.animation = new animation.Animation(this);

            this._slotsZOrderChanged = false;
            this._slotList = [];
            this._boneList = [];
            this._eventList = [];
        }
        Armature.prototype.dispose = function () {
            if (!this.animation) {
                return;
            }

            this.animation.dispose();
            var i = this._slotList.length;

            while (i--) {
                this._slotList[i].dispose();
            }

            i = this._boneList.length;
            while (i--) {
                this._boneList[i].dispose();
            }

            this._slotList.length = 0;
            this._boneList.length = 0;
            this._eventList.length = 0;

            this.animation = null;
            this._slotList = null;
            this._boneList = null;
            this._eventList = null;

            this.display = null;
        };

        Armature.prototype.advanceTime = function (passedTime) {
            this.animation.advanceTime(passedTime);

            var i = this._boneList.length;
            while (i--) {
                this._boneList[i]._update();
            }

            i = this._slotList.length;
            var slot;
            while (i--) {
                slot = this._slotList[i];
                slot._update();
                if (slot._isDisplayOnStage) {
                    var childArmature = slot.getChildArmature();
                    if (childArmature) {
                        childArmature.advanceTime(passedTime);
                    }
                }
            }

            if (this._slotsZOrderChanged) {
                this.updateSlotsZOrder();

                if (this.hasEventListener(events.ArmatureEvent.Z_ORDER_UPDATED)) {
                    this.dispatchEvent(new events.ArmatureEvent(events.ArmatureEvent.Z_ORDER_UPDATED));
                }
            }

            if (this._eventList.length) {
                i = this._eventList.length;
                while (i--) {
                    this.dispatchEvent(this._eventList[i]);
                }
                this._eventList.length = 0;
            }
        };

        Armature.prototype.getSlots = function (returnCopy) {
            if (typeof returnCopy === "undefined") { returnCopy = true; }
            return returnCopy ? this._slotList.concat() : this._slotList;
        };

        Armature.prototype.getBones = function (returnCopy) {
            if (typeof returnCopy === "undefined") { returnCopy = true; }
            return returnCopy ? this._boneList.concat() : this._boneList;
        };

        Armature.prototype.getSlot = function (slotName) {
            var i = this._slotList.length;
            while (i--) {
                if (this._slotList[i].name == slotName) {
                    return this._slotList[i];
                }
            }
            return null;
        };

        Armature.prototype.getSlotByDisplay = function (display) {
            if (display) {
                var i = this._slotList.length;
                while (i--) {
                    if (this._slotList[i].getDisplay() == display) {
                        return this._slotList[i];
                    }
                }
            }
            return null;
        };

        Armature.prototype.removeSlot = function (slot) {
            if (!slot) {
                throw new Error();
            }

            if (this._slotList.indexOf(slot) >= 0) {
                slot.parent.removeChild(slot);
            } else {
                throw new Error();
            }
        };

        Armature.prototype.removeSlotByName = function (slotName) {
            if (!slotName) {
                return;
            }

            var slot = this.getSlot(slotName);
            if (slot) {
                this.removeSlot(slot);
            }
        };

        Armature.prototype.getBone = function (boneName) {
            var i = this._boneList.length;
            while (i--) {
                if (this._boneList[i].name == boneName) {
                    return this._boneList[i];
                }
            }
            return null;
        };

        Armature.prototype.getBoneByDisplay = function (display) {
            var slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        };

        Armature.prototype.removeBone = function (bone) {
            if (!bone) {
                throw new Error();
            }

            if (this._boneList.indexOf(bone) >= 0) {
                if (bone.parent) {
                    bone.parent.removeChild(bone);
                } else {
                    bone._setArmature(null);
                }
            } else {
                throw new Error();
            }
        };

        Armature.prototype.removeBoneByName = function (boneName) {
            if (!boneName) {
                return;
            }

            var bone = this.getBone(boneName);
            if (bone) {
                this.removeBone(bone);
            }
        };

        Armature.prototype.addChild = function (object, parentName) {
            if (!object) {
                throw new Error();
            }

            if (parentName) {
                var boneParent = this.getBone(parentName);
                if (boneParent) {
                    boneParent.addChild(object);
                } else {
                    throw new Error();
                }
            } else {
                if (object.parent) {
                    object.parent.removeChild(object);
                }
                object._setArmature(this);
            }
        };

        Armature.prototype.updateSlotsZOrder = function () {
            this._slotList.sort(this.sortSlot);
            var i = this._slotList.length;
            var slot;
            while (i--) {
                slot = this._slotList[i];
                if (slot._isDisplayOnStage) {
                    slot._displayBridge.addDisplay(display, -1);
                }
            }

            this._slotsZOrderChanged = false;
        };

        /** @private */
        Armature.prototype._addDBObject = function (object) {
            if (object instanceof Slot) {
                var slot = object;
                if (this._slotList.indexOf(slot) < 0) {
                    this._slotList[this._slotList.length] = slot;
                }
            } else if (object instanceof Bone) {
                var bone = object;
                if (this._boneList.indexOf(bone) < 0) {
                    this._boneList[this._boneList.length] = bone;
                    this._sortBoneList();
                }
            }
        };

        /** @private */
        Armature.prototype._removeDBObject = function (object) {
            if (object instanceof Slot) {
                var slot = object;
                var index = this._slotList.indexOf(slot);
                if (index >= 0) {
                    this._slotList.splice(index, 1);
                }
            } else if (object instanceof Bone) {
                var bone = object;
                index = this._boneList.indexOf(bone);
                if (index >= 0) {
                    this._boneList.splice(index, 1);
                }
            }
        };

        /** @private */
        Armature.prototype._sortBoneList = function () {
            var i = this._boneList.length;
            if (i == 0) {
                return;
            }
            var _helpArray = [];
            var level;
            var bone;
            var boneParent;
            while (i--) {
                level = 0;
                bone = this._boneList[i];
                boneParent = bone;
                while (boneParent) {
                    level++;
                    boneParent = boneParent.parent;
                }
                _helpArray[i] = { level: level, bone: bone };
            }

            _helpArray.sort(this.sortBone);

            i = _helpArray.length;
            while (i--) {
                this._boneList[i] = _helpArray[i].bone;
            }
        };

        /** @private */
        Armature.prototype.arriveAtFrame = function (frame, timelineState, animationState, isCross) {
            if (frame.event && this.hasEventListener(events.FrameEvent.ANIMATION_FRAME_EVENT)) {
                var frameEvent = new events.FrameEvent(events.FrameEvent.ANIMATION_FRAME_EVENT);
                frameEvent.animationState = animationState;
                frameEvent.frameLabel = frame.event;
                this._eventList.push(frameEvent);
            }

            if (frame.sound && Armature._soundManager.hasEventListener(events.SoundEvent.SOUND)) {
                var soundEvent = new events.SoundEvent(events.SoundEvent.SOUND);
                soundEvent.armature = this;
                soundEvent.animationState = animationState;
                soundEvent.sound = frame.sound;
                Armature._soundManager.dispatchEvent(soundEvent);
            }

            if (frame.action) {
                if (animationState.isPlaying) {
                    this.animation.gotoAndPlay(frame.action);
                }
            }
        };

        Armature.prototype.sortSlot = function (slot1, slot2) {
            return slot1.getZOrder() < slot2.getZOrder() ? 1 : -1;
        };

        Armature.prototype.sortBone = function (bone1, bone2) {
            return 1;
        };
        Armature._soundManager = events.SoundEventManager.getInstance();
        return Armature;
    })(events.EventDispatcher);
    dragonBones.Armature = Armature;
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=dragonBones.js.map
