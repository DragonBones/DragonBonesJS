var demosPixi;
(function (demosPixi) {
    /**
     * How to use
     * 1. Load data.
     * 2. factory.parseDragonBonesData();
     *    factory.parseTextureAtlasData();
     * 3. armatureDisplay = factory.buildArmatureDisplay("armatureName");
     * 4. addChild(armatureDisplay);
     */
    var HelloDragonBones = (function () {
        function HelloDragonBones() {
            this._renderer = new PIXI.WebGLRenderer(800, 600, { backgroundColor: 0x666666 });
            this._stage = new PIXI.Container();
            this._isDown = false;
            this._isMoved = false;
            this._isHorizontalMoved = false;
            this._armatureIndex = 1;
            this._animationIndex = 0;
            this._prevArmatureScale = 1;
            this._prevAnimationScale = 1;
            this._startPoint = new PIXI.Point();
            this._backgroud = new PIXI.Sprite(PIXI.Texture.EMPTY);
            this._dragonBonesData = null;
            this._armatureDisplay = null;
            this._factory = new dragonBones.PixiFactory();
            this._init();
        }
        HelloDragonBones.prototype._init = function () {
            document.body.appendChild(this._renderer.view);
            PIXI.ticker.shared.add(this._renderHandler, this);
            // Load data.
            PIXI.loader
                .add("dragonBonesData", "./resource/assets/Ubbie/Ubbie.json")
                .add("textureDataA", "./resource/assets/Ubbie/texture.json")
                .add("textureA", "./resource/assets/Ubbie/texture.png");
            PIXI.loader.once("complete", this._loadComplateHandler, this);
            PIXI.loader.load();
        };
        HelloDragonBones.prototype._renderHandler = function (deltaTime) {
            this._renderer.render(this._stage);
        };
        HelloDragonBones.prototype._loadComplateHandler = function (loader, object) {
            // Parse data.
            this._dragonBonesData = this._factory.parseDragonBonesData(object["dragonBonesData"].data);
            this._factory.parseTextureAtlasData(object["textureDataA"].data, object["textureA"].texture);
            if (this._dragonBonesData) {
                // Add event listeners.
                this._stage.interactive = true;
                this._stage.on('touchstart', this._touchHandler, this);
                this._stage.on('touchend', this._touchHandler, this);
                this._stage.on('touchmove', this._touchHandler, this);
                this._stage.on('mousedown', this._touchHandler, this);
                this._stage.on('mouseup', this._touchHandler, this);
                this._stage.on('mousemove', this._touchHandler, this);
                this._stage.addChild(this._backgroud);
                this._backgroud.width = this._renderer.width;
                this._backgroud.height = this._renderer.height;
                // Add Armature.            
                this._changeArmature();
                this._changeAnimation();
                // Add infomation.            
                var text = new PIXI.Text("", { align: "center" });
                text.x = 0;
                text.y = this._renderer.height - 60;
                text.scale.x = 0.8;
                text.scale.y = 0.8;
                text.text = "Touch screen left to change Armature / right to change Animation.\nTouch move to scale Armatrue and Animation.";
                this._stage.addChild(text);
            }
            else {
                throw new Error();
            }
        };
        /**
         * Touch event listeners.
         * Touch to change Armature and Animation.
         * Touch move to change Armature and Animation scale.
         */
        HelloDragonBones.prototype._touchHandler = function (event) {
            switch (event.type) {
                case 'touchstart':
                case 'mousedown':
                    this._isDown = true;
                    this._prevArmatureScale = this._armatureDisplay.scale.x;
                    this._prevAnimationScale = this._armatureDisplay.animation.timeScale;
                    this._startPoint.set(event.data.global.x, event.data.global.y);
                    break;
                case 'touchend':
                case 'mouseup':
                    this._isDown = false;
                    if (this._isMoved) {
                        this._isMoved = false;
                    }
                    else {
                        var touchRight = event.data.global.x > this._renderer.width * 0.5;
                        if (this._dragonBonesData.armatureNames.length > 1 && !touchRight) {
                            this._changeArmature();
                        }
                        this._changeAnimation();
                    }
                    break;
                case 'touchmove':
                case 'mousemove':
                    if (this._isDown) {
                        var dX = this._startPoint.x - event.data.global.x;
                        var dY = this._startPoint.y - event.data.global.y;
                        if (!this._isMoved) {
                            var dAX = Math.abs(dX);
                            var dAY = Math.abs(dY);
                            if (dAX > 5 || dAY > 5) {
                                this._isMoved = true;
                                this._isHorizontalMoved = dAX > dAY;
                            }
                        }
                        if (this._isMoved) {
                            if (this._isHorizontalMoved) {
                                var currentAnimationScale = Math.max(-dX / 200 + this._prevAnimationScale, 0.01);
                                this._armatureDisplay.animation.timeScale = currentAnimationScale;
                            }
                            else {
                                var currentArmatureScale = Math.max(dY / 200 + this._prevArmatureScale, 0.01);
                                this._armatureDisplay.scale.x = this._armatureDisplay.scale.y = currentArmatureScale;
                            }
                        }
                    }
                    break;
            }
        };
        /**
         * Change Armature.
         */
        HelloDragonBones.prototype._changeArmature = function () {
            var armatureNames = this._dragonBonesData.armatureNames;
            if (armatureNames.length == 0) {
                return;
            }
            // Remove prev Armature.
            if (this._armatureDisplay) {
                this._armatureDisplay.dispose();
                this._stage.removeChild(this._armatureDisplay);
            }
            // Get next Armature name.
            this._animationIndex = 0;
            this._armatureIndex++;
            if (this._armatureIndex >= armatureNames.length) {
                this._armatureIndex = 0;
            }
            var armatureName = armatureNames[this._armatureIndex];
            // Build Armature display. (Factory.buildArmatureDisplay() will update Armature animation by Armature display)
            this._armatureDisplay = this._factory.buildArmatureDisplay(armatureName);
            // Add FrameEvent listener.
            this._armatureDisplay.addEvent(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
            // Add Armature display.
            this._armatureDisplay.x = this._renderer.width * 0.5;
            this._armatureDisplay.y = this._renderer.height * 0.5 + 100;
            this._stage.addChild(this._armatureDisplay);
        };
        /**
         * Change Armature animation.
         */
        HelloDragonBones.prototype._changeAnimation = function () {
            if (!this._armatureDisplay) {
                return;
            }
            var animationNames = this._armatureDisplay.animation.animationNames;
            if (animationNames.length == 0) {
                return;
            }
            // Get next animation name.
            this._animationIndex++;
            if (this._animationIndex >= animationNames.length) {
                this._animationIndex = 0;
            }
            var animationName = animationNames[this._animationIndex];
            // Play animation.
            this._armatureDisplay.animation.play(animationName);
        };
        /**
         * FrameEvent listener. (If animation has FrameEvent)
         */
        HelloDragonBones.prototype._frameEventHandler = function (event) {
            console.log(event.animationState.name, event.name);
        };
        return HelloDragonBones;
    }());
    demosPixi.HelloDragonBones = HelloDragonBones;
})(demosPixi || (demosPixi = {}));
