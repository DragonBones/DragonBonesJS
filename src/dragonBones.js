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

        var EventDispatcher = (function () {
            function EventDispatcher() {
            }
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
                        if (false) {
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
    })(dragonBones.objects || (dragonBones.objects = {}));
    var objects = dragonBones.objects;

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

    var DBObject = (function () {
        function DBObject() {
            this.global = new objects.DBTransform();
            this.origin = new objects.DBTransform();
            this.offset = new objects.DBTransform();
            this.tween = new objects.DBTransform();
            this.tween.scaleX = this.tween.scaleY = 0;
            this.globalMatrix = new geom.Matrix();

            this._visible = true;
        }
        DBObject.prototype.getVisible = function () {
            return this._visible;
        };
        DBObject.prototype.setVisible = function (value) {
            this._visible = value;
        };

        DBObject.prototype._setParent = function (value) {
            this.parent = value;
        };

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
            this.globalMatrix = null;
        };

        DBObject.prototype.update = function () {
            this.global.scaleX = (this.origin.scaleX + this.tween.scaleX) * this.offset.scaleX;
            this.global.scaleY = (this.origin.scaleY + this.tween.scaleY) * this.offset.scaleY;

            if (this.parent) {
                var x = this.origin.x + this.offset.x + this.tween.x;
                var y = this.origin.y + this.offset.y + this.tween.y;
                var parentMatrix = this.parent.globalMatrix;

                this.globalMatrix.tx = this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                this.globalMatrix.ty = this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;

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
                this.globalMatrix.tx = this.global.x = this.origin.x + this.offset.x + this.tween.x;
                this.globalMatrix.ty = this.global.y = this.origin.y + this.offset.y + this.tween.y;

                this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
            }

            this.globalMatrix.a = this.global.scaleX * Math.cos(this.global.skewY);
            this.globalMatrix.b = this.global.scaleX * Math.sin(this.global.skewY);
            this.globalMatrix.c = -this.global.scaleY * Math.sin(this.global.skewX);
            this.globalMatrix.d = this.global.scaleY * Math.cos(this.global.skewX);
        };
        return DBObject;
    })();
    dragonBones.DBObject = DBObject;

    var Bone = (function (_super) {
        __extends(Bone, _super);
        function Bone() {
            _super.call(this);
        }
        Bone.prototype.setVisible = function (value) {
            if (this.getVisible() != value) {
                _super.prototype.setVisible.call(this, value);
                var i = this._children.length;
                while (i--) {
                    var slot = this._children[i];
                    if (slot) {
                        //slot.updateVisible(this.getVisible());
                    }
                }
            }
        };

        Bone.prototype.setArmature = function (value) {
            _super.prototype._setArmature.call(this, value);
            var i = this._children.length;
            while (i--) {
                this._children[i]._setArmature(this.armature);
            }
        };
        Bone._soundManager = events.SoundEventManager.getInstance();
        return Bone;
    })(DBObject);
    dragonBones.Bone = Bone;

    var Slot = (function (_super) {
        __extends(Slot, _super);
        function Slot() {
            _super.call(this);
        }
        return Slot;
    })(DBObject);
    dragonBones.Slot = Slot;

    var Armature = (function (_super) {
        __extends(Armature, _super);
        function Armature() {
            _super.call(this);

            this._slotList = [];
            this._boneList = [];
        }
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
                    //this.sortBoneList();
                }
            }
        };

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
        return Armature;
    })(events.EventDispatcher);
    dragonBones.Armature = Armature;
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=dragonBones.js.map
