var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//**********************************************
var dragonBones;
(function (dragonBones) {
    (function (display) {
        var Cocos2DDisplayBridge = (function () {
            function Cocos2DDisplayBridge() {
            }
            Cocos2DDisplayBridge.prototype.getVisible = function () {
                return this._display ? this._display.visible : false;
            };
            Cocos2DDisplayBridge.prototype.setVisible = function (value) {
                if (this._display) {
                    this._display.visible = value;
                }
            };

            Cocos2DDisplayBridge.prototype.getDisplay = function () {
                return this._display;
            };
            Cocos2DDisplayBridge.prototype.setDisplay = function (value) {
                if (this._display == value) {
                    return;
                }
                if (this._display) {
                    var parent = this._display._parent;
                    if (parent) {
                        var children = this._display._parent.getChildren();
                        var index = children.indexOf(this._display);
                    }
                    this.removeDisplay();
                }
                this._display = value;
                this.addDisplay(parent, index);
            };

            Cocos2DDisplayBridge.prototype.dispose = function () {
                this._display = null;
            };

            Cocos2DDisplayBridge.prototype.updateTransform = function (matrix, transform) {
                this._display.setPositionX(matrix.tx);
                this._display.setPositionY(-matrix.ty);
                this._display.setRotationX(transform.skewX * Cocos2DDisplayBridge.RADIAN_TO_ANGLE);
                this._display.setRotationY(transform.skewY * Cocos2DDisplayBridge.RADIAN_TO_ANGLE);
              //TODO - skew?
               // this._display.setSkewX(transform.skewX * Cocos2DDisplayBridge.RADIAN_TO_ANGLE);
                //this._display.setSkewY(transform.skewY * Cocos2DDisplayBridge.RADIAN_TO_ANGLE);
                this._display.setScaleX(transform.scaleX);
                this._display.setScaleY(transform.scaleY);
            };

            Cocos2DDisplayBridge.prototype.updateColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier) {
                if (this._display) {
                    this._display.setOpacity(aMultiplier * 255);
                }
            };

            Cocos2DDisplayBridge.prototype.addDisplay = function (container, index) {
                var parent = container;
                if (parent && this._display) {
                    this._display.removeFromParent();
                    if (index < 0) {
                        if(this._display._zOrder > 0) {
							parent.addChild(this._display, this._display._zOrder);
						} else {
							parent.addChild(this._display, parent.getChildrenCount()+1);
						}
                    } else {
                        parent.addChild(this._display, Math.min(index, parent.getChildrenCount()));
                    }
                }
            };

            Cocos2DDisplayBridge.prototype.removeDisplay = function () {
                if (this._display && this._display._parent) {
                    this._display._parent.removeChild(this._display, true);
                }
            };
            Cocos2DDisplayBridge.RADIAN_TO_ANGLE = 180 / Math.PI;
            return Cocos2DDisplayBridge;
        })();
        display.Cocos2DDisplayBridge = Cocos2DDisplayBridge;
    })(dragonBones.display || (dragonBones.display = {}));
    var display = dragonBones.display;
    //**********************************************
    (function (textures) {
        var Cocos2DTextureAtlas = (function () {
            function Cocos2DTextureAtlas(image, textureAtlasRawData, scale) {
                if (typeof scale === "undefined") { scale = 1; }
                this._regions = {};

                this.image = image;
                this.scale = scale;

                this.parseData(textureAtlasRawData);
            }
            Cocos2DTextureAtlas.prototype.dispose = function () {
                this.image = null;
                this._regions = null;
            };

            Cocos2DTextureAtlas.prototype.getRegion = function (subTextureName) {
                return this._regions[subTextureName];
            };

            Cocos2DTextureAtlas.prototype.parseData = function (textureAtlasRawData) {
                var textureAtlasData = dragonBones.objects.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
                this.name = textureAtlasData.__name;
                delete textureAtlasData.__name;
                var subTextureData;
                var rect;
                var spriteFrame;
                 for (var subTextureName in textureAtlasData) {
                    //for example - {"name":"parts/clothes1","x":0,"width":104,"y":198,"height":87}
                    subTextureData = textureAtlasData[subTextureName];
                    rect = cc.rect(subTextureData.x,subTextureData.y,subTextureData.width,subTextureData.height);
                    //create a SpriteFrame instance
                    //cc.log('* region ' + subTextureName + ' x: ' + subTextureData.x + ' y: '+ subTextureData.y + ' w: ' + subTextureData.width + ' h: '+ subTextureData.height)
                    spriteFrame = cc.SpriteFrame.createWithTexture(this.image,rect);//
                    this._regions[subTextureName] = spriteFrame;//textureAtlasData[subTextureName];
                }
            };
            return Cocos2DTextureAtlas;
        })();
        textures.Cocos2DTextureAtlas = Cocos2DTextureAtlas;
    })(dragonBones.textures || (dragonBones.textures = {}));
    var textures = dragonBones.textures;
    //**********************************************
    (function (factorys) {
        var Cocos2DFactory = (function (_super) {
            __extends(Cocos2DFactory, _super);
            function Cocos2DFactory() {
                _super.call(this);
            }
            Cocos2DFactory.prototype._generateArmature = function () {
                var armature = new dragonBones.Armature(new cc.NodeRGBA());
                return armature;
            };

            Cocos2DFactory.prototype._generateSlot = function () {
                var slot = new dragonBones.Slot(new display.Cocos2DDisplayBridge());
                return slot;
            };

            Cocos2DFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
                var spriteFrame = textureAtlas.getRegion(fullName);//getRect
                //
                var rect = spriteFrame.getRect();
                Cocos2DFactory._helpMatrix.a = 1;
                Cocos2DFactory._helpMatrix.b = 0;
                Cocos2DFactory._helpMatrix.c = 0;
                Cocos2DFactory._helpMatrix.d = 1;
                
                //matrix scale!
                var scale = 1 / textureAtlas.scale;
                Cocos2DFactory._helpMatrix = cc.AffineTransformScale(Cocos2DFactory._helpMatrix,scale,scale);
                var anchorX = (pivotX / rect.width);// * -1;
                var anchorY = 1 - (pivotY / rect.height);// * -1;
                Cocos2DFactory._helpMatrix.tx = -anchorX - rect.x;
                Cocos2DFactory._helpMatrix.ty = -anchorY - rect.y;
                var sprite = cc.Sprite.createWithSpriteFrame(spriteFrame);
                sprite.setAnchorPoint(cc.p(anchorX,anchorY));
                
                return sprite;
            };
            //
            Cocos2DFactory._helpMatrix = cc.AffineTransformMake(1, 0, 0, 1, 0, 0);
            
            return Cocos2DFactory;
        })(factorys.BaseFactory);
        factorys.Cocos2DFactory = Cocos2DFactory;
    })(dragonBones.factorys || (dragonBones.factorys = {}));
    var factorys = dragonBones.factorys;
})(dragonBones || (dragonBones = {}));
