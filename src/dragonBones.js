/// <reference path="createjs.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dragonBones;
(function (dragonBones) {
    (function (geom) {
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            return Point;
        })();
        geom.Point = Point;

        var Rectangle = (function () {
            function Rectangle(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            return Rectangle;
        })();
        geom.Rectangle = Rectangle;

        var Matrix = (function () {
            function Matrix() {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.tx = 0;
                this.ty = 0;
            }
            Matrix.prototype.invert = function () {
                var a1 = this.a;
                var b1 = this.b;
                var c1 = this.c;
                var d1 = this.d;
                var tx1 = this.tx;
                var n = a1 * d1 - b1 * c1;

                this.a = d1 / n;
                this.b = -b1 / n;
                this.c = -c1 / n;
                this.d = a1 / n;
                this.tx = (c1 * this.ty - d1 * tx1) / n;
                this.ty = -(a1 * this.ty - b1 * tx1) / n;
            };
            return Matrix;
        })();
        geom.Matrix = Matrix;

        var ColorTransform = (function () {
            function ColorTransform() {
                this.alphaMultiplier = 0;
                this.alphaOffset = 0;
                this.blueMultiplier = 0;
                this.blueOffset = 0;
                this.greenMultiplier = 0;
                this.greenOffset = 0;
                this.redMultiplier = 0;
                this.redOffset = 0;
            }
            return ColorTransform;
        })();
        geom.ColorTransform = ColorTransform;
    })(dragonBones.geom || (dragonBones.geom = {}));
    var geom = dragonBones.geom;

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

    (function (objects) {
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

        var Frame = (function () {
            function Frame() {
                this.position = 0;
                this.duration = 0;
            }
            Frame.prototype.dispose = function () {
            };
            return Frame;
        })();
        objects.Frame = Frame;

        var TransformFrame = (function (_super) {
            __extends(TransformFrame, _super);
            function TransformFrame() {
                _super.call(this);

                this.tweenEasing = 0;
                this.tweenRotate = 0;
                this.displayIndex = 0;
                this.visible = true;
                this.zOrder = NaN;

                this.global = new DBTransform();
                this.transform = new DBTransform();
                this.pivot = new geom.Point(0, 0);
            }
            TransformFrame.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.global = null;
                this.transform = null;

                //SkeletonData pivots
                this.pivot = null;
                this.color = null;
            };
            return TransformFrame;
        })(Frame);
        objects.TransformFrame = TransformFrame;

        var Timeline = (function () {
            function Timeline() {
                this._frameList = [];
                this.duration = 0;
                this.scale = 1;
            }
            Timeline.prototype.getFrameList = function () {
                return this._frameList;
            };

            Timeline.prototype.dispose = function () {
                var i = this._frameList.length;
                while (i--) {
                    this._frameList[i].dispose();
                }
                this._frameList.length = 0;
                this._frameList = null;
            };

            Timeline.prototype.addFrame = function (frame) {
                if (!frame) {
                    throw new Error();
                }

                if (this._frameList.indexOf(frame) < 0) {
                    this._frameList[this._frameList.length] = frame;
                } else {
                    throw new Error();
                }
            };
            return Timeline;
        })();
        objects.Timeline = Timeline;

        var TransformTimeline = (function (_super) {
            __extends(TransformTimeline, _super);
            function TransformTimeline() {
                _super.call(this);
                this.originTransform = new DBTransform();
                this.originPivot = new geom.Point(0, 0);
                this.offset = 0;
            }
            TransformTimeline.prototype.dispose = function () {
                if (this == TransformTimeline.HIDE_TIMELINE) {
                    return;
                }
                _super.prototype.dispose.call(this);
                this.originTransform = null;
                this.originPivot = null;
            };
            TransformTimeline.HIDE_TIMELINE = new TransformTimeline();
            return TransformTimeline;
        })(Timeline);
        objects.TransformTimeline = TransformTimeline;

        var AnimationData = (function (_super) {
            __extends(AnimationData, _super);
            function AnimationData() {
                _super.call(this);
                this.loop = 0;
                this.tweenEasing = NaN;
                this.fadeInTime = 0;

                this._timelines = {};
            }
            AnimationData.prototype.getTimelines = function () {
                return this._timelines;
            };

            AnimationData.prototype.dispose = function () {
                _super.prototype.dispose.call(this);

                for (var timelineName in this._timelines) {
                    (this._timelines[timelineName]).dispose();
                }
                this._timelines = null;
            };

            AnimationData.prototype.getTimeline = function (timelineName) {
                return this._timelines[timelineName];
            };

            AnimationData.prototype.addTimeline = function (timeline, timelineName) {
                if (!timeline) {
                    throw new Error();
                }

                this._timelines[timelineName] = timeline;
            };
            return AnimationData;
        })(Timeline);
        objects.AnimationData = AnimationData;

        var DisplayData = (function () {
            function DisplayData() {
                this.transform = new DBTransform();
            }
            DisplayData.prototype.dispose = function () {
                this.transform = null;
                this.pivot = null;
            };
            DisplayData.ARMATURE = "armature";
            DisplayData.IMAGE = "image";
            return DisplayData;
        })();
        objects.DisplayData = DisplayData;

        var SlotData = (function () {
            function SlotData() {
                this._displayDataList = [];
                this.zOrder = 0;
            }
            SlotData.prototype.getDisplayDataList = function () {
                return this._displayDataList;
            };

            SlotData.prototype.dispose = function () {
                var i = this._displayDataList.length;
                while (i--) {
                    this._displayDataList[i].dispose();
                }
                this._displayDataList.length = 0;
                this._displayDataList = null;
            };

            SlotData.prototype.addDisplayData = function (displayData) {
                if (!displayData) {
                    throw new Error();
                }
                if (this._displayDataList.indexOf(displayData) < 0) {
                    this._displayDataList[this._displayDataList.length] = displayData;
                } else {
                    throw new Error();
                }
            };

            SlotData.prototype.getDisplayData = function (displayName) {
                var i = this._displayDataList.length;
                while (i--) {
                    if (this._displayDataList[i].name == displayName) {
                        return this._displayDataList[i];
                    }
                }

                return null;
            };
            return SlotData;
        })();
        objects.SlotData = SlotData;

        var BoneData = (function () {
            function BoneData() {
                this.length = 0;
                this.global = new DBTransform();
                this.transform = new DBTransform();
            }
            BoneData.prototype.dispose = function () {
                this.global = null;
                this.transform = null;
            };
            return BoneData;
        })();
        objects.BoneData = BoneData;

        var SkinData = (function () {
            function SkinData() {
                this._slotDataList = [];
            }
            SkinData.prototype.getSlotDataList = function () {
                return this._slotDataList;
            };

            SkinData.prototype.dispose = function () {
                var i = this._slotDataList.length;
                while (i--) {
                    this._slotDataList[i].dispose();
                }
                this._slotDataList.length = 0;
                this._slotDataList = null;
            };

            SkinData.prototype.getSlotData = function (slotName) {
                var i = this._slotDataList.length;
                while (i--) {
                    if (this._slotDataList[i].name == slotName) {
                        return this._slotDataList[i];
                    }
                }
                return null;
            };

            SkinData.prototype.addSlotData = function (slotData) {
                if (!slotData) {
                    throw new Error();
                }

                if (this._slotDataList.indexOf(slotData) < 0) {
                    this._slotDataList[this._slotDataList.length] = slotData;
                } else {
                    throw new Error();
                }
            };
            return SkinData;
        })();
        objects.SkinData = SkinData;

        var ArmatureData = (function () {
            function ArmatureData() {
                this._boneDataList = [];
                this._skinDataList = [];
                this._animationDataList = [];
            }
            ArmatureData.prototype.getBoneDataList = function () {
                return this._boneDataList;
            };

            ArmatureData.prototype.getSkinDataList = function () {
                return this._skinDataList;
            };

            ArmatureData.prototype.getAnimationDataList = function () {
                return this._animationDataList;
            };

            ArmatureData.prototype.dispose = function () {
                var i = this._boneDataList.length;
                while (i--) {
                    this._boneDataList[i].dispose();
                }
                i = this._skinDataList.length;
                while (i--) {
                    this._skinDataList[i].dispose();
                }
                i = this._animationDataList.length;
                while (i--) {
                    this._animationDataList[i].dispose();
                }
                this._boneDataList.length = 0;
                this._skinDataList.length = 0;
                this._animationDataList.length = 0;
                this._boneDataList = null;
                this._skinDataList = null;
                this._animationDataList = null;
            };

            ArmatureData.prototype.getBoneData = function (boneName) {
                var i = this._boneDataList.length;
                while (i--) {
                    if (this._boneDataList[i].name == boneName) {
                        return this._boneDataList[i];
                    }
                }
                return null;
            };

            ArmatureData.prototype.getSkinData = function (skinName) {
                if (!skinName) {
                    return this._skinDataList[0];
                }
                var i = this._skinDataList.length;
                while (i--) {
                    if (this._skinDataList[i].name == skinName) {
                        return this._skinDataList[i];
                    }
                }

                return null;
            };

            ArmatureData.prototype.getAnimationData = function (animationName) {
                var i = this._animationDataList.length;
                while (i--) {
                    if (this._animationDataList[i].name == animationName) {
                        return this._animationDataList[i];
                    }
                }
                return null;
            };

            ArmatureData.prototype.addBoneData = function (boneData) {
                if (!boneData) {
                    throw new Error();
                }

                if (this._boneDataList.indexOf(boneData) < 0) {
                    this._boneDataList[this._boneDataList.length] = boneData;
                } else {
                    throw new Error();
                }
            };

            ArmatureData.prototype.addSkinData = function (skinData) {
                if (!skinData) {
                    throw new Error();
                }

                if (this._skinDataList.indexOf(skinData) < 0) {
                    this._skinDataList[this._skinDataList.length] = skinData;
                } else {
                    throw new Error();
                }
            };

            ArmatureData.prototype.addAnimationData = function (animationData) {
                if (!animationData) {
                    throw new Error();
                }

                if (this._animationDataList.indexOf(animationData) < 0) {
                    this._animationDataList[this._animationDataList.length] = animationData;
                }
            };

            ArmatureData.prototype.sortBoneDataList = function () {
                var i = this._boneDataList.length;
                if (i == 0) {
                    return;
                }

                var helpArray = [];
                while (i--) {
                    var boneData = this._boneDataList[i];
                    var level = 0;
                    var parentData = boneData;
                    while (parentData && parentData.parent) {
                        level++;
                        parentData = this.getBoneData(parentData.parent);
                    }
                    helpArray[i] = { level: level, boneData: boneData };
                }

                helpArray.sort(this.sortBoneData);

                i = helpArray.length;
                while (i--) {
                    this._boneDataList[i] = helpArray[i].boneData;
                }
            };

            ArmatureData.prototype.sortBoneData = function (object1, object2) {
                return object1.level > object1.level ? 1 : -1;
            };
            return ArmatureData;
        })();
        objects.ArmatureData = ArmatureData;

        var SkeletonData = (function () {
            function SkeletonData() {
                this._armatureDataList = [];
                this._subTexturePivots = {};
            }
            SkeletonData.prototype.getArmatureNames = function () {
                var nameList = [];
                for (var armatureDataIndex in this._armatureDataList) {
                    nameList[nameList.length] = this._armatureDataList[armatureDataIndex].name;
                }
                return nameList;
            };

            SkeletonData.prototype.getArmatureDataList = function () {
                return this._armatureDataList;
            };

            SkeletonData.prototype.dispose = function () {
                for (var armatureDataIndex in this._armatureDataList) {
                    this._armatureDataList[armatureDataIndex].dispose();
                }
                this._armatureDataList.length = 0;

                this._armatureDataList = null;
                this._subTexturePivots = null;
            };

            SkeletonData.prototype.getArmatureData = function (armatureName) {
                var i = this._armatureDataList.length;
                while (i--) {
                    if (this._armatureDataList[i].name == armatureName) {
                        return this._armatureDataList[i];
                    }
                }

                return null;
            };

            SkeletonData.prototype.addArmatureData = function (armatureData) {
                if (!armatureData) {
                    throw new Error();
                }

                if (this._armatureDataList.indexOf(armatureData) < 0) {
                    this._armatureDataList[this._armatureDataList.length] = armatureData;
                } else {
                    throw new Error();
                }
            };

            SkeletonData.prototype.removeArmatureData = function (armatureData) {
                var index = this._armatureDataList.indexOf(armatureData);
                if (index >= 0) {
                    this._armatureDataList.splice(index, 1);
                }
            };

            SkeletonData.prototype.removeArmatureDataByName = function (armatureName) {
                var i = this._armatureDataList.length;
                while (i--) {
                    if (this._armatureDataList[i].name == armatureName) {
                        this._armatureDataList.splice(i, 1);
                    }
                }
            };

            SkeletonData.prototype.getSubTexturePivot = function (subTextureName) {
                return this._subTexturePivots[subTextureName];
            };

            SkeletonData.prototype.addSubTexturePivot = function (x, y, subTextureName) {
                var point = this._subTexturePivots[subTextureName];
                if (point) {
                    point.x = x;
                    point.y = y;
                } else {
                    this._subTexturePivots[subTextureName] = point = new geom.Point(x, y);
                }

                return point;
            };

            SkeletonData.prototype.removeSubTexturePivot = function (subTextureName) {
                if (subTextureName) {
                    delete this._subTexturePivots[subTextureName];
                } else {
                    for (subTextureName in this._subTexturePivots) {
                        delete this._subTexturePivots[subTextureName];
                    }
                }
            };
            return SkeletonData;
        })();
        objects.SkeletonData = SkeletonData;

        var DataParser = (function () {
            function DataParser() {
            }
            DataParser.parseTextureAtlasData = function (rawData, scale) {
                if (typeof scale === "undefined") { scale = 1; }
                if (!rawData) {
                    throw new Error();
                }

                var textureAtlasData = {};
                textureAtlasData.__name = rawData[utils.ConstValues.A_NAME];
                var subTextureList = rawData[utils.ConstValues.SUB_TEXTURE];
                for (var index in subTextureList) {
                    var subTextureObject = subTextureList[index];
                    var subTextureName = subTextureObject[utils.ConstValues.A_NAME];
                    var subTextureData = new geom.Rectangle(Number(subTextureObject[utils.ConstValues.A_X]) / scale, Number(subTextureObject[utils.ConstValues.A_Y]) / scale, Number(subTextureObject[utils.ConstValues.A_WIDTH]) / scale, Number(subTextureObject[utils.ConstValues.A_HEIGHT]) / scale);
                    textureAtlasData[subTextureName] = subTextureData;
                }

                return textureAtlasData;
            };

            DataParser.parseSkeletonData = function (rawData) {
                if (!rawData) {
                    throw new Error();
                }

                /*var version:string = rawData[utils.ConstValues.A_VERSION];
                switch (version)
                {
                case dragonBones:
                break;
                default:
                throw new Error("Nonsupport version!");
                }*/
                var frameRate = Number(rawData[utils.ConstValues.A_FRAME_RATE]);

                var data = new SkeletonData();
                data.name = rawData[utils.ConstValues.A_NAME];

                var armatureObjectList = rawData[utils.ConstValues.ARMATURE];
                for (var index in armatureObjectList) {
                    var armatureObject = armatureObjectList[index];
                    data.addArmatureData(DataParser.parseArmatureData(armatureObject, data, frameRate));
                }

                return data;
            };

            DataParser.parseArmatureData = function (armatureObject, data, frameRate) {
                var armatureData = new ArmatureData();
                armatureData.name = armatureObject[utils.ConstValues.A_NAME];

                var boneObjectList = armatureObject[utils.ConstValues.BONE];
                for (var index in boneObjectList) {
                    var boneObject = boneObjectList[index];
                    armatureData.addBoneData(DataParser.parseBoneData(boneObject));
                }

                var skinObjectList = armatureObject[ConstValues.SKIN];
                for (var index in skinObjectList) {
                    var skinObject = skinObjectList[index];
                    armatureData.addSkinData(DataParser.parseSkinData(skinObject, data));
                }

                utils.DBDataUtil.transformArmatureData(armatureData);
                armatureData.sortBoneDataList();

                var animationObjectList = armatureObject[utils.ConstValues.ANIMATION];

                for (var index in animationObjectList) {
                    var animationObject = animationObjectList[index];
                    armatureData.addAnimationData(DataParser.parseAnimationData(animationObject, armatureData, frameRate));
                }

                return armatureData;
            };

            DataParser.parseBoneData = function (boneObject) {
                var boneData = new BoneData();
                boneData.name = boneObject[utils.ConstValues.A_NAME];
                boneData.parent = boneObject[utils.ConstValues.A_PARENT];
                boneData.length = Number(boneObject[utils.ConstValues.A_LENGTH]) || 0;

                DataParser.parseTransform(boneObject[utils.ConstValues.TRANSFORM], boneData.global);
                boneData.transform.copy(boneData.global);

                return boneData;
            };

            DataParser.parseSkinData = function (skinObject, data) {
                var skinData = new SkinData();
                skinData.name = skinObject[utils.ConstValues.A_NAME];
                var slotObjectList = skinObject[utils.ConstValues.SLOT];
                for (var index in slotObjectList) {
                    var slotObject = slotObjectList[index];
                    skinData.addSlotData(DataParser.parseSlotData(slotObject, data));
                }

                return skinData;
            };

            DataParser.parseSlotData = function (slotObject, data) {
                var slotData = new SlotData();
                slotData.name = slotObject[utils.ConstValues.A_NAME];
                slotData.parent = slotObject[utils.ConstValues.A_PARENT];
                slotData.zOrder = Number(slotObject[utils.ConstValues.A_Z_ORDER]);

                var displayObjectList = slotObject[utils.ConstValues.DISPLAY];
                for (var index in displayObjectList) {
                    var displayObject = displayObjectList[index];
                    slotData.addDisplayData(DataParser.parseDisplayData(displayObject, data));
                }

                return slotData;
            };

            DataParser.parseDisplayData = function (displayObject, data) {
                var displayData = new DisplayData();
                displayData.name = displayObject[utils.ConstValues.A_NAME];
                displayData.type = displayObject[utils.ConstValues.A_TYPE];

                displayData.pivot = data.addSubTexturePivot(0, 0, displayData.name);

                DataParser.parseTransform(displayObject[utils.ConstValues.TRANSFORM], displayData.transform, displayData.pivot);

                return displayData;
            };

            DataParser.parseAnimationData = function (animationObject, armatureData, frameRate) {
                var animationData = new AnimationData();
                animationData.name = animationObject[utils.ConstValues.A_NAME];
                animationData.frameRate = frameRate;
                animationData.loop = Number(animationObject[utils.ConstValues.A_LOOP]);
                animationData.fadeInTime = Number(animationObject[utils.ConstValues.A_FADE_IN_TIME]);
                animationData.duration = Number(animationObject[utils.ConstValues.A_DURATION]) / frameRate;
                animationData.scale = Number(animationObject[utils.ConstValues.A_SCALE]);

                if (animationObject.hasOwnProperty(utils.ConstValues.A_TWEEN_EASING)) {
                    var tweenEase = animationObject[utils.ConstValues.A_TWEEN_EASING];
                    if (tweenEase == undefined || tweenEase == null) {
                        animationData.tweenEasing = NaN;
                    } else {
                        animationData.tweenEasing = Number(tweenEase);
                    }
                } else {
                    animationData.tweenEasing = NaN;
                }

                DataParser.parseTimeline(animationObject, animationData, DataParser.parseMainFrame, frameRate);

                var timeline;
                var timelineName;
                var timelineObjectList = animationObject[ConstValues.TIMELINE];
                for (var index in timelineObjectList) {
                    var timelineObject = timelineObjectList[index];
                    timeline = DataParser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
                    timelineName = timelineObject[utils.ConstValues.A_NAME];
                    animationData.addTimeline(timeline, timelineName);
                }

                utils.DBDataUtil.addHideTimeline(animationData, armatureData);
                utils.DBDataUtil.transformAnimationData(animationData, armatureData);

                return animationData;
            };

            DataParser.parseTimeline = function (timelineObject, timeline, frameParser, frameRate) {
                var position = 0;
                var frame;
                var frameObjectList = timelineObject[utils.ConstValues.FRAME];
                for (var index in frameObjectList) {
                    var frameObject = frameObjectList[index];
                    frame = frameParser(frameObject, frameRate);
                    frame.position = position;
                    timeline.addFrame(frame);
                    position += frame.duration;
                }
                if (frame) {
                    frame.duration = timeline.duration - frame.position;
                }
            };

            DataParser.parseTransformTimeline = function (timelineObject, duration, frameRate) {
                var timeline = new TransformTimeline();
                timeline.duration = duration;

                DataParser.parseTimeline(timelineObject, timeline, DataParser.parseTransformFrame, frameRate);

                timeline.scale = Number(timelineObject[utils.ConstValues.A_SCALE]);
                timeline.offset = Number(timelineObject[utils.ConstValues.A_OFFSET]);

                return timeline;
            };

            DataParser.parseFrame = function (frameObject, frame, frameRate) {
                frame.duration = Number(frameObject[utils.ConstValues.A_DURATION]) / frameRate;
                frame.action = frameObject[utils.ConstValues.A_ACTION];
                frame.event = frameObject[utils.ConstValues.A_EVENT];
                frame.sound = frameObject[utils.ConstValues.A_SOUND];
            };

            DataParser.parseMainFrame = function (frameObject, frameRate) {
                var frame = new Frame();
                DataParser.parseFrame(frameObject, frame, frameRate);
                return frame;
            };

            DataParser.parseTransformFrame = function (frameObject, frameRate) {
                var frame = new TransformFrame();
                DataParser.parseFrame(frameObject, frame, frameRate);

                frame.visible = Number(frameObject[utils.ConstValues.A_HIDE]) != 1;

                if (frameObject.hasOwnProperty(utils.ConstValues.A_TWEEN_EASING)) {
                    var tweenEase = frameObject[utils.ConstValues.A_TWEEN_EASING];
                    if (tweenEase == undefined || tweenEase == null) {
                        frame.tweenEasing = NaN;
                    } else {
                        frame.tweenEasing = Number(tweenEase);
                    }
                } else {
                    frame.tweenEasing = 0;
                }

                frame.tweenRotate = Number(frameObject[utils.ConstValues.A_TWEEN_ROTATE]);
                frame.displayIndex = Number(frameObject[utils.ConstValues.A_DISPLAY_INDEX]);

                //
                frame.zOrder = Number(frameObject[utils.ConstValues.A_Z_ORDER]);

                DataParser.parseTransform(frameObject[utils.ConstValues.TRANSFORM], frame.global, frame.pivot);
                frame.transform.copy(frame.global);

                var colorTransformObject = frameObject[utils.ConstValues.COLOR_TRANSFORM];
                if (colorTransformObject) {
                    frame.color = new geom.ColorTransform();
                    frame.color.alphaOffset = Number(colorTransformObject[utils.ConstValues.A_ALPHA_OFFSET]);
                    frame.color.redOffset = Number(colorTransformObject[utils.ConstValues.A_RED_OFFSET]);
                    frame.color.greenOffset = Number(colorTransformObject[utils.ConstValues.A_GREEN_OFFSET]);
                    frame.color.blueOffset = Number(colorTransformObject[utils.ConstValues.A_BLUE_OFFSET]);

                    frame.color.alphaMultiplier = Number(colorTransformObject[utils.ConstValues.A_ALPHA_MULTIPLIER]) * 0.01;
                    frame.color.redMultiplier = Number(colorTransformObject[utils.ConstValues.A_RED_MULTIPLIER]) * 0.01;
                    frame.color.greenMultiplier = Number(colorTransformObject[utils.ConstValues.A_GREEN_MULTIPLIER]) * 0.01;
                    frame.color.blueMultiplier = Number(colorTransformObject[utils.ConstValues.A_BLUE_MULTIPLIER]) * 0.01;
                }

                return frame;
            };

            DataParser.parseTransform = function (transformObject, transform, pivot) {
                if (typeof pivot === "undefined") { pivot = null; }
                if (transformObject) {
                    if (transform) {
                        transform.x = Number(transformObject[utils.ConstValues.A_X]);
                        transform.y = Number(transformObject[utils.ConstValues.A_Y]);
                        transform.skewX = Number(transformObject[utils.ConstValues.A_SKEW_X]) * utils.ConstValues.ANGLE_TO_RADIAN;
                        transform.skewY = Number(transformObject[utils.ConstValues.A_SKEW_Y]) * utils.ConstValues.ANGLE_TO_RADIAN;
                        transform.scaleX = Number(transformObject[utils.ConstValues.A_SCALE_X]);
                        transform.scaleY = Number(transformObject[utils.ConstValues.A_SCALE_Y]);
                    }
                    if (pivot) {
                        pivot.x = Number(transformObject[utils.ConstValues.A_PIVOT_X]);
                        pivot.y = Number(transformObject[utils.ConstValues.A_PIVOT_Y]);
                    }
                }
            };
            return DataParser;
        })();
        objects.DataParser = DataParser;
    })(dragonBones.objects || (dragonBones.objects = {}));
    var objects = dragonBones.objects;

    (function (textures) {
        var CreateJSTextureAtlas = (function () {
            function CreateJSTextureAtlas(image, textureAtlasRawData) {
                this.image = image;
            }
            CreateJSTextureAtlas.prototype.dispose = function () {
                this.image = null;
            };

            CreateJSTextureAtlas.prototype.getRegion = function (name) {
                return null;
            };
            return CreateJSTextureAtlas;
        })();
        textures.CreateJSTextureAtlas = CreateJSTextureAtlas;
    })(dragonBones.textures || (dragonBones.textures = {}));
    var textures = dragonBones.textures;

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
        var BaseFactory = (function (_super) {
            __extends(BaseFactory, _super);
            function BaseFactory() {
                _super.call(this);

                this._dataDic = {};
                this._textureAtlasDic = {};
                this._textureAtlasLoadingDic = {};
            }
            BaseFactory.prototype.getSkeletonData = function (name) {
                return this._dataDic[name];
            };

            BaseFactory.prototype.addSkeletonData = function (data, name) {
                if (!data) {
                    throw new Error();
                }
                name = name || data.name;
                if (!name) {
                    throw new Error("Unnamed data!");
                }
                if (this._dataDic[name]) {
                }
                this._dataDic[name] = data;
            };

            BaseFactory.prototype.removeSkeletonData = function (name) {
                delete this._dataDic[name];
            };

            BaseFactory.prototype.getTextureAtlas = function (name) {
                return this._textureAtlasDic[name];
            };

            BaseFactory.prototype.addTextureAtlas = function (textureAtlas, name) {
                if (!textureAtlas) {
                    throw new Error();
                }

                name = name || textureAtlas.name;
                if (!name) {
                    throw new Error("Unnamed data!");
                }
                if (this._textureAtlasDic[name]) {
                }
                this._textureAtlasDic[name] = textureAtlas;
            };

            BaseFactory.prototype.removeTextureAtlas = function (name) {
                delete this._textureAtlasDic[name];
            };

            BaseFactory.prototype.dispose = function (disposeData) {
                if (typeof disposeData === "undefined") { disposeData = true; }
                if (disposeData) {
                    for (var i in this._dataDic) {
                        this._dataDic[i].dispose();
                    }
                    for (var i in this._textureAtlasDic) {
                        this._textureAtlasDic[i].dispose();
                    }
                }
                this._dataDic = null;
                this._textureAtlasDic = null;
                this._textureAtlasLoadingDic = null;
                this._currentDataName = null;
                this._currentTextureAtlasName = null;
            };

            BaseFactory.prototype.buildArmature = function (armatureName, animationName, skeletonName, textureAtlasName, skinName) {
                if (skeletonName) {
                    var data = this._dataDic[skeletonName];
                    if (data) {
                        var armatureData = data.getArmatureData(armatureName);
                    }
                } else {
                    for (skeletonName in this._dataDic) {
                        data = this._dataDic[skeletonName];
                        armatureData = data.getArmatureData(armatureName);
                        if (armatureData) {
                            break;
                        }
                    }
                }

                if (!armatureData) {
                    return null;
                }

                this._currentDataName = skeletonName;
                this._currentTextureAtlasName = textureAtlasName || skeletonName;

                var armature = this._generateArmature();
                armature.name = armatureName;
                var bone;
                var boneData;
                var boneDataList = armatureData.getBoneDataList();
                for (var index in boneDataList) {
                    boneData = boneDataList[index];
                    bone = new dragonBones.Bone();
                    bone.name = boneData.name;
                    bone.origin.copy(boneData.transform);
                    if (armatureData.getBoneData(boneData.parent)) {
                        armature.addChild(bone, boneData.parent);
                    } else {
                        armature.addChild(bone, null);
                    }
                }

                if (animationName && animationName != armatureName) {
                    var animationArmatureData = data.getArmatureData(animationName);
                    if (!animationArmatureData) {
                        for (skeletonName in this._dataDic) {
                            data = this._dataDic[skeletonName];
                            animationArmatureData = data.getArmatureData(animationName);
                            if (animationArmatureData) {
                                break;
                            }
                        }
                    }
                }

                if (animationArmatureData) {
                    armature.animation.setAnimationDataList(animationArmatureData.getAnimationDataList());
                } else {
                    armature.animation.setAnimationDataList(armatureData.getAnimationDataList());
                }

                var skinData = armatureData.getSkinData(skinName);
                if (!skinData) {
                    throw new Error();
                }

                var slot;
                var displayData;
                var childArmature;
                var i;
                var helpArray = [];
                var slotData;
                var slotDataList = skinData.getSlotDataList();
                var displayDataList;
                for (var index in slotDataList) {
                    slotData = slotDataList[index];
                    bone = armature.getBone(slotData.parent);
                    if (!bone) {
                        continue;
                    }
                    displayDataList = slotData.getDisplayDataList();
                    slot = this._generateSlot();
                    slot.name = slotData.name;
                    slot._originZOrder = slotData.zOrder;
                    slot._dislayDataList = displayDataList;

                    helpArray.length = 0;
                    i = displayDataList.length;
                    while (i--) {
                        displayData = displayDataList[i];

                        switch (displayData.type) {
                            case objects.DisplayData.ARMATURE:
                                childArmature = this.buildArmature(displayData.name, null, this._currentDataName, this._currentTextureAtlasName, null);
                                if (childArmature) {
                                    helpArray[i] = childArmature;
                                }
                                break;
                            case objects.DisplayData.IMAGE:
                            default:
                                helpArray[i] = this._generateDisplay(this._textureAtlasDic[this._currentTextureAtlasName], displayData.name, displayData.pivot.x, displayData.pivot.y);
                                break;
                        }
                    }
                    slot.setDisplayList(helpArray);
                    slot._changeDisplay(0);
                    bone.addChild(slot);
                }
                armature._slotsZOrderChanged = true;
                armature.advanceTime(0);
                return armature;
            };

            BaseFactory.prototype.getTextureDisplay = function (textureName, textureAtlasName, pivotX, pivotY) {
                if (textureAtlasName) {
                    var textureAtlas = this._textureAtlasDic[textureAtlasName];
                }
                if (!textureAtlas && !textureAtlasName) {
                    for (textureAtlasName in this._textureAtlasDic) {
                        textureAtlas = this._textureAtlasDic[textureAtlasName];
                        if (textureAtlas.getRegion(textureName)) {
                            break;
                        }
                        textureAtlas = null;
                    }
                }
                if (textureAtlas) {
                    if (isNaN(pivotX) || isNaN(pivotY)) {
                        var data = this._dataDic[textureAtlasName];
                        if (data) {
                            var pivot = data.getSubTexturePivot(textureName);
                            if (pivot) {
                                pivotX = pivot.x;
                                pivotY = pivot.y;
                            }
                        }
                    }

                    return this._generateDisplay(textureAtlas, textureName, pivotX, pivotY);
                }
                return null;
            };

            /** @private */
            BaseFactory.prototype._generateTextureAtlas = function (content, textureAtlasRawData) {
                return null;
            };

            /** @private */
            BaseFactory.prototype._generateArmature = function () {
                return null;
            };

            /** @private */
            BaseFactory.prototype._generateSlot = function () {
                return null;
            };

            /** @private */
            BaseFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
                return null;
            };
            return BaseFactory;
        })(events.EventDispatcher);
        factorys.BaseFactory = BaseFactory;

        var CreateJSFactory = (function (_super) {
            __extends(CreateJSFactory, _super);
            function CreateJSFactory() {
                _super.call(this);
            }
            /** @private */
            CreateJSFactory.prototype._generateTextureAtlas = function (content, textureAtlasRawData) {
                var textureAtlas = new textures.CreateJSTextureAtlas(content, textureAtlasRawData);
                return textureAtlas;
            };

            /** @private */
            CreateJSFactory.prototype._generateArmature = function () {
                var armature = new dragonBones.Armature(new createjs.Sprite());
                return armature;
            };

            /** @private */
            CreateJSFactory.prototype._generateSlot = function () {
                var slot = new dragonBones.Slot(new display.CreateJSDisplayBridge());
                return slot;
            };

            /** @private */
            CreateJSFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
                var rect = textureAtlas.getRegion(fullName);
                if (rect) {
                    var shape = new createjs.Shape(null);
                    shape.graphics.beginBitmapFill(textureAtlas.image, null, null);
                    shape.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
                }

                /*var subTexture:SubTexture = (textureAtlas as TextureAtlas).getTexture(fullName) as SubTexture;
                if (subTexture)
                {
                var image:Image = new Image(subTexture);
                image.pivotX = pivotX;
                image.pivotY = pivotY;
                return image;
                }*/
                return null;
            };
            return CreateJSFactory;
        })(BaseFactory);
        factorys.CreateJSFactory = CreateJSFactory;
    })(dragonBones.factorys || (dragonBones.factorys = {}));
    var factorys = dragonBones.factorys;

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
            TransformUtil.transformPointWithParent = function (transform, parent) {
                var helpMatrix = TransformUtil._helpMatrix;
                TransformUtil.transformToMatrix(parent, helpMatrix);
                helpMatrix.invert();

                var x = transform.x;
                var y = transform.y;

                transform.x = helpMatrix.a * x + helpMatrix.c * y + helpMatrix.tx;
                transform.y = helpMatrix.d * y + helpMatrix.b * x + helpMatrix.ty;

                transform.skewX = TransformUtil.formatRadian(transform.skewX - parent.skewX);
                transform.skewY = TransformUtil.formatRadian(transform.skewY - parent.skewY);
            };

            TransformUtil.transformToMatrix = function (transform, matrix) {
                matrix.a = transform.scaleX * Math.cos(transform.skewY);
                matrix.b = transform.scaleX * Math.sin(transform.skewY);
                matrix.c = -transform.scaleY * Math.sin(transform.skewX);
                matrix.d = transform.scaleY * Math.cos(transform.skewX);
                matrix.tx = transform.x;
                matrix.ty = transform.y;
            };

            TransformUtil.formatRadian = function (radian) {
                radian %= TransformUtil.DOUBLE_PI;
                if (radian > Math.PI) {
                    radian -= TransformUtil.DOUBLE_PI;
                }
                if (radian < -Math.PI) {
                    radian += TransformUtil.DOUBLE_PI;
                }
                return radian;
            };
            TransformUtil.DOUBLE_PI = Math.PI * 2;
            TransformUtil._helpMatrix = new geom.Matrix();
            return TransformUtil;
        })();
        utils.TransformUtil = TransformUtil;

        var DBDataUtil = (function () {
            function DBDataUtil() {
            }
            DBDataUtil.transformArmatureData = function (armatureData) {
                var boneDataList = armatureData.getBoneDataList();
                var i = boneDataList.length;
                var boneData;
                var parentBoneData;
                while (i--) {
                    boneData = boneDataList[i];
                    if (boneData.parent) {
                        parentBoneData = armatureData.getBoneData(boneData.parent);
                        if (parentBoneData) {
                            boneData.transform.copy(boneData.global);
                            TransformUtil.transformPointWithParent(boneData.transform, parentBoneData.global);
                        }
                    }
                }
            };

            DBDataUtil.transformArmatureDataAnimations = function (armatureData) {
                var animationDataList = armatureData.getAnimationDataList();
                var i = animationDataList.length;
                while (i--) {
                    DBDataUtil.transformAnimationData(animationDataList[i], armatureData);
                }
            };

            DBDataUtil.transformAnimationData = function (animationData, armatureData) {
                var skinData = armatureData.getSkinData(null);
                var boneDataList = armatureData.getBoneDataList();
                var slotDataList = skinData.getSlotDataList();
                var i = boneDataList.length;

                var boneData;
                var timeline;
                var slotData;
                var displayData;
                var parentTimeline;
                var frameList;
                var originTransform;
                var originPivot;
                var prevFrame;
                var frameListLength;
                var frame;

                while (i--) {
                    boneData = boneDataList[i];
                    timeline = animationData.getTimeline(boneData.name);
                    if (!timeline) {
                        continue;
                    }

                    slotData = null;

                    for (var slotIndex in slotDataList) {
                        slotData = slotDataList[slotIndex];
                        if (slotData.parent == boneData.name) {
                            break;
                        }
                    }

                    parentTimeline = boneData.parent ? animationData.getTimeline(boneData.parent) : null;

                    frameList = timeline.getFrameList();

                    originTransform = null;
                    originPivot = null;
                    prevFrame = null;
                    frameListLength = frameList.length;
                    for (var j = 0; j < frameListLength; j++) {
                        frame = frameList[j];
                        if (parentTimeline) {
                            //tweenValues to transform.
                            DBDataUtil._helpTransform1.copy(frame.global);

                            //get transform from parent timeline.
                            DBDataUtil.getTimelineTransform(parentTimeline, frame.position, DBDataUtil._helpTransform2);
                            TransformUtil.transformPointWithParent(DBDataUtil._helpTransform1, DBDataUtil._helpTransform2);

                            //transform to tweenValues.
                            frame.transform.copy(DBDataUtil._helpTransform1);
                        } else {
                            frame.transform.copy(frame.global);
                        }

                        frame.transform.x -= boneData.transform.x;
                        frame.transform.y -= boneData.transform.y;
                        frame.transform.skewX -= boneData.transform.skewX;
                        frame.transform.skewY -= boneData.transform.skewY;
                        frame.transform.scaleX -= boneData.transform.scaleX;
                        frame.transform.scaleY -= boneData.transform.scaleY;

                        if (!timeline.transformed) {
                            if (slotData) {
                                frame.zOrder -= slotData.zOrder;
                            }
                        }

                        if (!originTransform) {
                            originTransform = timeline.originTransform;
                            originTransform.copy(frame.transform);
                            originTransform.skewX = TransformUtil.formatRadian(originTransform.skewX);
                            originTransform.skewY = TransformUtil.formatRadian(originTransform.skewY);
                            originPivot = timeline.originPivot;
                            originPivot.x = frame.pivot.x;
                            originPivot.y = frame.pivot.y;
                        }

                        frame.transform.x -= originTransform.x;
                        frame.transform.y -= originTransform.y;
                        frame.transform.skewX = TransformUtil.formatRadian(frame.transform.skewX - originTransform.skewX);
                        frame.transform.skewY = TransformUtil.formatRadian(frame.transform.skewY - originTransform.skewY);
                        frame.transform.scaleX -= originTransform.scaleX;
                        frame.transform.scaleY -= originTransform.scaleY;

                        if (!timeline.transformed) {
                            frame.pivot.x -= originPivot.x;
                            frame.pivot.y -= originPivot.y;
                        }

                        if (prevFrame) {
                            var dLX = frame.transform.skewX - prevFrame.transform.skewX;

                            if (prevFrame.tweenRotate) {
                                if (prevFrame.tweenRotate > 0) {
                                    if (dLX < 0) {
                                        frame.transform.skewX += Math.PI * 2;
                                        frame.transform.skewY += Math.PI * 2;
                                    }

                                    if (prevFrame.tweenRotate > 1) {
                                        frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate - 1);
                                        frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate - 1);
                                    }
                                } else {
                                    if (dLX > 0) {
                                        frame.transform.skewX -= Math.PI * 2;
                                        frame.transform.skewY -= Math.PI * 2;
                                    }

                                    if (prevFrame.tweenRotate < 1) {
                                        frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate + 1);
                                        frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate + 1);
                                    }
                                }
                            } else {
                                frame.transform.skewX = prevFrame.transform.skewX + TransformUtil.formatRadian(frame.transform.skewX - prevFrame.transform.skewX);
                                frame.transform.skewY = prevFrame.transform.skewY + TransformUtil.formatRadian(frame.transform.skewY - prevFrame.transform.skewY);
                            }
                        }

                        prevFrame = frame;
                    }
                    timeline.transformed = true;
                }
            };

            DBDataUtil.getTimelineTransform = function (timeline, position, retult) {
                var frameList = timeline.getFrameList();
                var i = frameList.length;

                var currentFrame;
                var tweenEasing;
                var progress;
                var nextFrame;
                while (i--) {
                    currentFrame = frameList[i];
                    if (currentFrame.position <= position && currentFrame.position + currentFrame.duration > position) {
                        tweenEasing = currentFrame.tweenEasing;
                        if (i == frameList.length - 1 || isNaN(tweenEasing) || position == currentFrame.position) {
                            retult.copy(currentFrame.global);
                        } else {
                            progress = (position - currentFrame.position) / currentFrame.duration;
                            if (tweenEasing) {
                                progress = animation.TimelineState.getEaseValue(progress, tweenEasing);
                            }

                            nextFrame = frameList[i + 1];

                            retult.x = currentFrame.global.x + (nextFrame.global.x - currentFrame.global.x) * progress;
                            retult.y = currentFrame.global.y + (nextFrame.global.y - currentFrame.global.y) * progress;
                            retult.skewX = TransformUtil.formatRadian(currentFrame.global.skewX + (nextFrame.global.skewX - currentFrame.global.skewX) * progress);
                            retult.skewY = TransformUtil.formatRadian(currentFrame.global.skewY + (nextFrame.global.skewY - currentFrame.global.skewY) * progress);
                            retult.scaleX = currentFrame.global.scaleX + (nextFrame.global.scaleX - currentFrame.global.scaleX) * progress;
                            retult.scaleY = currentFrame.global.scaleY + (nextFrame.global.scaleY - currentFrame.global.scaleY) * progress;
                        }
                        break;
                    }
                }
            };

            DBDataUtil.addHideTimeline = function (animationData, armatureData) {
                var boneDataList = armatureData.getBoneDataList();
                var i = boneDataList.length;

                var boneData;
                var boneName;
                while (i--) {
                    boneData = boneDataList[i];
                    boneName = boneData.name;
                    if (!animationData.getTimeline(boneName)) {
                        animationData.addTimeline(objects.TransformTimeline.HIDE_TIMELINE, boneName);
                    }
                }
            };
            DBDataUtil._helpTransform1 = new objects.DBTransform();
            DBDataUtil._helpTransform2 = new objects.DBTransform();
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
                var displayIndexBackup = this._displayIndex;
                this._displayIndex = -1;
                this._changeDisplay(displayIndexBackup);
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

            this._tweenPivot = new geom.Point(0, 0);

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
                    /*var childArmature:Armature = this.getChildArmature();
                    if(childArmature)
                    {
                    childArmature.animation.gotoAndPlay(frame.action);
                    }*/
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
            var helpArray = [];
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
                helpArray[i] = { level: level, bone: bone };
            }

            helpArray.sort(this.sortBone);

            i = helpArray.length;
            while (i--) {
                this._boneList[i] = helpArray[i].bone;
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
