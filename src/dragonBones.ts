/// <reference path="createjs.d.ts"/>

module dragonBones 
{
    export module events 
    {
        export class Event 
        {
            public type: string;
            public target: EventDispatcher;
            constructor(type: string) 
            {
                this.type = type;
            }
        }

        export class AnimationEvent extends Event
        {
            public static FADE_IN: string = "fadeIn";
		    public static FADE_OUT:string = "fadeOut";
		    public static START:string = "start";
		    public static COMPLETE:string = "complete";
		    public static LOOP_COMPLETE:string = "loopComplete";
		    public static FADE_IN_COMPLETE:string = "fadeInComplete";
		    public static FADE_OUT_COMPLETE:string = "fadeOutComplete";

            public animationState: animation.AnimationState;
            public armature: Armature;

            constructor(type: string) 
            {
                super(type);
            }
        }

        export class ArmatureEvent extends Event
        {
            public static Z_ORDER_UPDATED: string = "zOrderUpdated";

            constructor(type: string) 
            {
                super(type);
            }
        }

        export class FrameEvent extends Event
        {
            public static ANIMATION_FRAME_EVENT: string = "animationFrameEvent";
            public static BONE_FRAME_EVENT: string = "boneFrameEvent";

            public animationState: animation.AnimationState;
            public armature: Armature;
		    public bone:Bone;
		    public frameLabel: string;

            constructor(type: string) 
            {
                super(type);
            }
        }

        export class SoundEvent extends Event
        {
            public static SOUND: string = "sound";
            public static BONE_FRAME_EVENT: string = "boneFrameEvent";

            public animationState: animation.AnimationState;
            public armature: Armature;
		    public sound:string;

            constructor(type: string) 
            {
                super(type);
            }
        }

        export class EventDispatcher 
        {
            private _listenersMap: Object;
            constructor() 
            {
            }

            public hasEventListener(type: string): boolean
            {
                if(this._listenersMap && this._listenersMap[type])
                {
                    return true;
                }
                return false;
            }

            public addEventListener(type: string, listener: Function): void 
            {
                if (type && listener) 
                {
                    if (!this._listenersMap) 
                    {
                        this._listenersMap = {};
                    }
                    var listeners: Array<Function> = this._listenersMap[type];
                    if (listeners) 
                    {
                        this.removeEventListener(type, listener);
                    }
                    if (listeners) 
                    {
                        listeners.push(listener);
                    }
                    else 
                    {
                        this._listenersMap[type] = [listener];
                    }
                }
            }

            public removeEventListener(type: string, listener: Function): void 
            {
                if (!this._listenersMap || !type || !listener) 
                {
                    return;
                }
                var listeners: Array<Function> = this._listenersMap[type];
                if (listeners) {
                    for (var i: number = 0, l = listeners.length; i < length; i++) 
                    {
                        if (listeners[i] == listener) 
                        {
                            if (l == 1) 
                            {
                                listeners.length = 0;
                                delete this._listenersMap[type];
                            }
                            else 
                            {
                                listeners.splice(i, 1);
                            }
                        }
                    }
                }
            }

            public removeAllEventListeners(type: string): void 
            {
                if (type) 
                {
                    delete this._listenersMap[type];
                }
                else 
                {
                    this._listenersMap = null;
                }
            }

            public dispatchEvent(event: Event): void 
            {
                if (event) 
                {
                    var listeners: Array<Function> = this._listenersMap[event.type];
                    if (listeners) 
                    {
                        event.target = this;
                        var listenersCopy: Array<Function> = listeners.concat();
                        for (var i: number = 0, l = listenersCopy.length; i < l; i++) 
                        {
                            listenersCopy[i](event);
                        }
                    }
                }
            }
        }

        export class SoundEventManager extends EventDispatcher 
        {
            private static _instance: SoundEventManager;

            public static getInstance(): SoundEventManager 
            {
                if (!SoundEventManager._instance) 
                {
                    SoundEventManager._instance = new SoundEventManager();
                }
                return SoundEventManager._instance;
            }

            constructor() 
            {
                super();
                if (SoundEventManager._instance) 
                {
                    throw new Error("Singleton already constructed!");
                }
            }
        }
    }

    export module animation 
    {
        export interface IAnimatable
        {
        }

        export class Animation
        {
            constructor(armature:Armature)
            {
            }
        }

        export class AnimationState
        {
            constructor()
            {
            }
        }

        export class TimelineState
        {
            constructor()
            {
            }
        }

        export class WorldClock implements IAnimatable
        {
            constructor()
            {
            }
        }
    }

    export module display 
    {
        export interface IDisplayBridge
        {
            getVisible(): boolean;
            setVisible(value: boolean): void;

            getDisplay(): any;
            setDisplay(value: any): void;

            dispose(): void;

            updateTransform(matrix: geom.Matrix, transform: objects.DBTransform): void;
            updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number): void;

            addDisplay(container: any, index: number): void;
            removeDisplay(): void;
        }

        export class CreateJSDisplayBridge implements IDisplayBridge
        {
            private _display: createjs.DisplayObject;
            private _colorFilter: createjs.ColorFilter;

            public getVisible(): boolean
            {
                return this._display ? this._display.visible : false;
            }
            public setVisible(value: boolean): void
            {
                if (this._display)
                {
                    this._display.visible = value;
                }
            }

            public getDisplay(): any
            {
                return this._display;
            }
            public setDisplay(value:any): void
            {
                if (this._display == value)
			    {
				    return;
			    }
			    if (this._display)
			    {
				    var parent:createjs.Container = this._display.parent;
				    if (parent)
				    {
					    var index:number = this._display.parent.getChildIndex(this._display);
				    }
				    this.removeDisplay();
			    }
			    this._display = <createjs.DisplayObject> value;
			    this.addDisplay(parent, index);
            }

            constructor()
            {
            }

            public dispose(): void
            {
			    this._display = null;
            }

            public updateTransform(matrix: geom.Matrix, transform: objects.DBTransform): void
            {
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
            }

            public updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number): void
            {

            }

            public addDisplay(container: any, index: number): void
            {
                var parent: createjs.Container = <createjs.Container> container;
                if (parent && this._display)
			    {
				    if (index < 0)
				    {
					    parent.addChild(this._display);
				    }
				    else
				    {
					    parent.addChildAt(this._display, Math.min(index, parent.getNumChildren()));
				    }
			    }
            }

            public removeDisplay(): void
            {
                if (this._display && this._display.parent)
			    {
				    this._display.parent.removeChild(this._display);
			    }
            }
        }
    }

    export module factorys 
    {
        export class BaseFactory
        {
            constructor()
            {
            }
        }

        export class CreateJSFactory extends BaseFactory
        {
            constructor()
            {
                super();
            }
        }
    }

    export module objects 
    {
        export class DisplayData
        {
            constructor() 
            {
            }
        }

        export class SlotData
        {
            constructor() 
            {
            }
        }

        export class BoneData
        {
            constructor() 
            {
            }
        }

        export class SkinData
        {
            constructor() 
            {
            }
        }

        export class ArmatureData
        {
            constructor() 
            {
            }
        }

        export class Timeline
        {
            constructor() 
            {
            }
        }

        export class Frame
        {
            constructor() 
            {
            }
        }

        export class TransformFrame extends Frame
        {
            constructor() 
            {
                super();
            }
        }

        export class AnimationData extends Timeline
        {
            constructor() 
            {
                super();
            }
        }


        export class DBTransform 
        {
            public x: number;
            public y: number;
            public skewX: number;
            public skewY: number;
            public scaleX: number;
            public scaleY: number;

            constructor() 
            {
                this.x = 0;
                this.y = 0;
                this.skewX = 0;
                this.skewY = 0;
                this.scaleX = 1;
                this.scaleY = 1;
            }

            public getRotation(): number 
            {
                return this.skewX;
            }
            public setRotation(value: number): void 
            {
                this.skewX = this.skewY = value;
            }

            public copy(transform: DBTransform): void 
            {
                this.x = transform.x;
                this.y = transform.y;
                this.skewX = transform.skewX;
                this.skewY = transform.skewY;
                this.scaleX = transform.scaleX;
                this.scaleY = transform.scaleY;
            }
        }
    }

    export module textures 
    {
        export interface ITextureAtlas
        {
        }

        export class CreateJSTextureAtlas implements ITextureAtlas
        {
            constructor() 
            {
            }
        }
    }

    export module geom 
    {
        export class Point 
        {
            public x: number;
            public y: number;

            constructor() 
            {
                this.x = 0;
                this.y = 0;
            }
        }

        export class Matrix 
        {
            public a: number;
            public b: number;
            public c: number;
            public d: number;
            public tx: number;
            public ty: number;
            constructor() 
            {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.tx = 0;
                this.ty = 0;
            }
        }
    }

    export module utils 
    {
        export class ConstValues
        {
            public static ANGLE_TO_RADIAN:number = Math.PI / 180;
		
		    public static DRAGON_BONES:string = "dragonBones";
		    public static ARMATURE:string = "armature";
		    public static SKIN:string = "skin";
		    public static BONE:string = "bone";
		    public static SLOT:string = "slot";
		    public static DISPLAY:string = "display";
		    public static ANIMATION:string = "animation";
		    public static TIMELINE:string = "timeline";
		    public static FRAME:string = "frame";
		    public static TRANSFORM:string = "transform";
		    public static COLOR_TRANSFORM:string = "colorTransform";
		
		    public static TEXTURE_ATLAS:string = "TextureAtlas";
		    public static SUB_TEXTURE:string = "SubTexture";
		
		    public static A_VERSION:string = "version";
		    public static A_IMAGE_PATH:string = "imagePath";
		    public static A_FRAME_RATE:string = "frameRate";
		    public static A_NAME:string = "name";
		    public static A_PARENT:string = "parent";
		    public static A_LENGTH:string = "length";
		    public static A_TYPE:string = "type";
		    public static A_FADE_IN_TIME:string = "fadeInTime";
		    public static A_DURATION:string = "duration";
		    public static A_SCALE:string = "scale";
		    public static A_OFFSET:string = "offset";
		    public static A_LOOP:string = "loop";
		    public static A_EVENT:string = "event";
		    public static A_SOUND:string = "sound";
		    public static A_ACTION:string = "action";
		    public static A_HIDE:string = "hide";
		    public static A_TWEEN_EASING:string = "tweenEasing";
		    public static A_TWEEN_ROTATE:string = "tweenRotate";
		    public static A_DISPLAY_INDEX:string = "displayIndex";
		    public static A_Z_ORDER:string = "z";
		    public static A_WIDTH:string = "width";
		    public static A_HEIGHT:string = "height";
		    public static A_X:string = "x";
		    public static A_Y:string = "y";
		    public static A_SKEW_X:string = "skX";
		    public static A_SKEW_Y:string = "skY";
		    public static A_SCALE_X:string = "scX";
		    public static A_SCALE_Y:string = "scY";
		    public static A_PIVOT_X:string = "pX";
		    public static A_PIVOT_Y:string = "pY";
		    public static A_ALPHA_OFFSET:string = "aO";
		    public static A_RED_OFFSET:string = "rO";
		    public static A_GREEN_OFFSET:string = "gO";
		    public static A_BLUE_OFFSET:string = "bO";
		    public static A_ALPHA_MULTIPLIER:string = "aM";
		    public static A_RED_MULTIPLIER:string = "rM";
		    public static A_GREEN_MULTIPLIER:string = "gM";
		    public static A_BLUE_MULTIPLIER:string = "bM";
        }

        export class TransformUtil
        {
        }

        export class DBDataUtil
        {
        }
    }
    
    /** @private */
    export class DBObject 
    {
        public name: string;

        public fixedRotation: boolean;

        public global: objects.DBTransform;
        public origin: objects.DBTransform;
        public offset: objects.DBTransform;
        public tween: objects.DBTransform;

        public parent: Bone;
        public armature: Armature;
        
        /** @private */
        public _globalTransformMatrix: geom.Matrix;
        /** @private */
        public _isDisplayOnStage: boolean;
        /** @private */
        public _scaleType: number;
        /** @private */
        public _isColorChanged: boolean;
        /** @private */
        public _visible: boolean;

        public getVisible(): boolean 
        {
            return this._visible;
        }
        public setVisible(value: boolean): void 
        {
            this._visible = value;
        }
        
        /** @private */
        public _setParent(value: Bone): void 
        {
            this.parent = value;
        }
        
        /** @private */
        public _setArmature(value: Armature): void 
        {
            if (this.armature) 
            {
                this.armature._removeDBObject(this);
            }
            this.armature = value;
            if (this.armature) 
            {
                this.armature._addDBObject(this);
            }
        }

        constructor() 
        {
            this.global = new objects.DBTransform();
            this.origin = new objects.DBTransform();
            this.offset = new objects.DBTransform();
            this.tween = new objects.DBTransform();
            this.tween.scaleX = this.tween.scaleY = 0;

            this._globalTransformMatrix = new geom.Matrix();

            this._visible = true;
        }

        public dispose(): void 
        {
            this.parent = null;
            this.armature = null;
            this.global = null;
            this.origin = null;
            this.offset = null;
            this.tween = null;
            this._globalTransformMatrix = null;
        }
        
        /** @private */
        public _update(): void 
        {
            this.global.scaleX = (this.origin.scaleX + this.tween.scaleX) * this.offset.scaleX;
            this.global.scaleY = (this.origin.scaleY + this.tween.scaleY) * this.offset.scaleY;

            if (this.parent) 
            {
                var x: number = this.origin.x + this.offset.x + this.tween.x;
                var y: number = this.origin.y + this.offset.y + this.tween.y;
                var parentMatrix: geom.Matrix = this.parent._globalTransformMatrix;

                this._globalTransformMatrix.tx = this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                this._globalTransformMatrix.ty = this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;

                if (this.fixedRotation) 
                {
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
                }
                else 
                {
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX + this.parent.global.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY + this.parent.global.skewY;
                }

                if (this.parent.scaleMode >= this._scaleType)
                {
                    this.global.scaleX *= this.parent.global.scaleX;
                    this.global.scaleY *= this.parent.global.scaleY;
                }
            }
            else 
            {
                this._globalTransformMatrix.tx = this.global.x = this.origin.x + this.offset.x + this.tween.x;
                this._globalTransformMatrix.ty = this.global.y = this.origin.y + this.offset.y + this.tween.y;

                this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
            }

            this._globalTransformMatrix.a = this.global.scaleX * Math.cos(this.global.skewY);
            this._globalTransformMatrix.b = this.global.scaleX * Math.sin(this.global.skewY);
            this._globalTransformMatrix.c = -this.global.scaleY * Math.sin(this.global.skewX);
            this._globalTransformMatrix.d = this.global.scaleY * Math.cos(this.global.skewX);
        }
    }

    export class Slot extends DBObject 
    {
        /** @private */
        public _dislayDataList: Array<objects.DisplayData>;
        /** @private */
        public _displayBridge: display.IDisplayBridge;
		/** @private */
		public _originZOrder: number;
		/** @private */
        public _tweenZorder: number;
		/** @private */
        public _isDisplayOnStage: boolean;

        private _isHideDisplay: boolean;
        private _offsetZOrder: number;
        private _displayIndex: number;

        public getZOrder(): number
		{
            return this._originZOrder + this._tweenZorder + this._offsetZOrder;
		}

        public setZOrder(value: number):void
        {
            if (this.getZOrder() != value)
            {
                this._offsetZOrder = value - this._originZOrder - this._tweenZorder;
                if (this.armature) 
                {
                    this.armature._slotsZOrderChanged = true;
                }
            }
        }

        public getDisplay(): any
		{
            var display: Object = this._displayList[this._displayIndex];
            if (display instanceof Armature)
			{
                return (<Armature> display).display;
            }
            return display;
		}
		public setDisplay(value:any):void
		{
			this._displayList[this._displayIndex] = value;
			this._setDisplay(value);
		}

        public getChildArmature(): Armature
		{
			return <Armature> this._displayList[this._displayIndex];
		}
        public setChildArmature(value: Armature): void
		{
			this._displayList[this._displayIndex] = value;
            if (value)
            {
                this._setDisplay(value.display);
            }
        }

        /** @private */
        public _displayList: Array<any>;
        public getDisplayList(): Array
        {
            return this._displayList;
        }
        public setDisplayList(value: Array): void
		{
            if(!value)
			{
                throw new Error();
            }
            var i: number = this._displayList.length = value.length;
            while (i--)
            {
                this._displayList[i] = value[i];
            }

            if (this._displayIndex >= 0)
			{
                this._displayIndex = -1;
                this._changeDisplay(this._displayIndex);
			}
		}

        private _setDisplay(display: any): void 
        {
            if (this._displayBridge.getDisplay()) 
            {
                this._displayBridge.setDisplay(display);
            }
            else 
            {
                this._displayBridge.setDisplay(display);
                if (this.armature) 
                {
                    this._displayBridge.addDisplay(this.armature.display, -1);
                    this.armature._slotsZOrderChanged = true;
                }
            }

            this.updateChildArmatureAnimation();

            if (!this._isHideDisplay && this._displayBridge.getDisplay()) 
            {
                this._isDisplayOnStage = true;
            }
            else 
            {
                this._isDisplayOnStage = false;
            }
        }

		/** @private */
        public _changeDisplay(displayIndex: number): void 
        {
            if (displayIndex < 0) 
            {
                if (!this._isHideDisplay) 
                {
                    this._isHideDisplay = true;
                    this._displayBridge.removeDisplay();
                    this.updateChildArmatureAnimation();
                }
            }
            else 
            {
                if (this._isHideDisplay) 
                {
                    this._isHideDisplay = false;
                    var changeShowState: boolean = true;
                    if (this.armature) 
                    {
                        this._displayBridge.addDisplay(this.armature.display, -1);
                        this.armature._slotsZOrderChanged = true;
                    }
                }

                var length: number = this._displayList.length;
                if (displayIndex >= length && length > 0) 
                {
                    displayIndex = length - 1;
                }
                if (this._displayIndex != displayIndex) 
                {
                    this._displayIndex = displayIndex;

                    var content: Object = this._displayList[this._displayIndex];
					if(content instanceof Armature)
					{
                        this._setDisplay((<Armature> content).display);
					}
					else
                    {
                        this._setDisplay(content);
                    }

                    if (this._dislayDataList && this._displayIndex <= this._dislayDataList.length) {
                        this.origin.copy(this._dislayDataList[this._displayIndex].transform);
                    }
                }
                else if (changeShowState) 
                {
                    this.updateChildArmatureAnimation();
                }
            }

            if (!this._isHideDisplay && this._displayBridge.getDisplay()) 
            {
                this._isDisplayOnStage = true;
            }
            else 
            {
                this._isDisplayOnStage = false;
            }
        }

        public setVisible(value: boolean): void
		{
            if(value != this._visible)
			{
                this._visible = value;
                this._updateVisible(this._visible);
			}
		}

		/** @private */
		public _setArmature(value: Armature): void 
        {
            super._setArmature(value);
            if (this.armature) 
            {
                this.armature._slotsZOrderChanged = true;
                this._displayBridge.addDisplay(this.armature.display, -1);
            }
            else
            {
                this._displayBridge.removeDisplay();
            }
        }

        constructor(displayBrideg:display.IDisplayBridge) 
        {
            super();
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

        public dispose(): void
        {
            if(!this._displayBridge)
			{
				return;
			}
			super.dispose();
			
			this._displayBridge.dispose();
			this._displayList.length = 0;
			
			this._displayBridge = null;
			this._displayList = null;
			this._dislayDataList = null;
        }
    
        /** @private */
        public _update(): void 
        {
            super._update();

            if (this._isDisplayOnStage) 
            {
                var pivotX: number = this.parent._tweenPivot.x;
                var pivotY: number = this.parent._tweenPivot.y;
                if (pivotX || pivotY) 
                {
                    var parentMatrix: geom.Matrix = this.parent._globalTransformMatrix;
                    this._globalTransformMatrix.tx += parentMatrix.a * pivotX + parentMatrix.c * pivotY;
                    this._globalTransformMatrix.ty += parentMatrix.b * pivotX + parentMatrix.d * pivotY;
                }

                this._displayBridge.updateTransform(this._globalTransformMatrix, this.global);
            }
        }
		
		/** @private */
		public _updateVisible(value:boolean):void
		{
            this._displayBridge.setVisible(this.parent.getVisible() && this._visible && value);
		}
		
		private updateChildArmatureAnimation():void
		{
			var childArmature:Armature = this.getChildArmature();
			
			if(childArmature)
			{
				if(this._isHideDisplay)
				{
					childArmature.animation.stop();
					childArmature.animation._lastAnimationState = null;
				}
				else
				{
					if(
						this.armature &&
						this.armature.animation.lastAnimationState &&
						childArmature.animation.hasAnimation(this.armature.animation.lastAnimationState.name)
					)
					{
						childArmature.animation.gotoAndPlay(this.armature.animation.lastAnimationState.name);
					}
					else
					{
						childArmature.animation.play();
					}
				}
			}
		}
    }

    export class Bone extends DBObject 
    {
        private static _soundManager: events.SoundEventManager = events.SoundEventManager.getInstance();

        public scaleMode: number;
        public displayController: string;

        public slot: Slot;
        
		/** @private */
        public _tweenPivot: geom.Point;

        private _children: Array<DBObject>;

        public setVisible(value: boolean): void 
        {
            if (this._visible != value)
            {
                this._visible = value;
                var i: number = this._children.length;
                while (i--) 
                {
                    var slot: Slot = <Slot> this._children[i];
                    if (slot) 
                    {
                        slot._updateVisible(this._visible);
                    }
                }
            }
        }
        
		/** @private */
        public _setArmature(value: Armature): void 
        {
            super._setArmature(value);
            var i: number = this._children.length;
            while (i--) 
            {
                this._children[i]._setArmature(this.armature);
            }
        }

        constructor() 
        {
            super();
			this._children = [];
			this._scaleType = 2;
			
			this._tweenPivot = new geom.Point();
			
			this.scaleMode = 1;
        }

        public dispose(): void
        {
            if(!this._children)
            {
                return;
            }
            super.dispose();

            var i: number = this._children.length;
            while(i --)
            {
                this._children[i].dispose();
            }
			this._children.length = 0;
			
			this._children = null;
            this._tweenPivot = null;

			this.slot = null;
        }
		
        public contains(child: DBObject): boolean
		{
            if (!child)
			{
				throw new Error();
			}
            if (child == this)
			{
				return false;
			}
			var ancestor:DBObject = child;
            while (!(ancestor == this || ancestor == null))
			{
				ancestor = ancestor.parent;
			}
			return ancestor == this;
		}
		
        public addChild(child: DBObject): void
		{
            if (!child)
			{
				throw new Error();
			}
			
			var bone:Bone = <Bone> child;
			if(child == this || (bone && bone.contains(this)))
			{
				throw new Error("An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)");
			}
			
			if(child.parent)
			{
				child.parent.removeChild(child);
			}
			this._children[this._children.length] = child;
			child._setParent(this);
			child._setArmature(this.armature);
			
			if(!this.slot && child instanceof Slot)
			{
				this.slot = <Slot> child;
			}
		}
		
        public removeChild(child: DBObject): void
		{
            if (!child)
			{
				throw new Error();
			}
			
			var index:number = this._children.indexOf(child);
			if (index >= 0)
			{
				this._children.splice(index, 1);
				child._setParent(null);
				child._setArmature(null);
				
				if(this.slot && child == this.slot)
				{
					this.slot = null;
				}
			}
			else
			{
				throw new Error();
			}
		}

        public getSlots(): Array<Slot>
		{
			var slotList:Array<Slot> = [];
			var i:number = this._children.length;
			while(i --)
			{
				if(this._children[i] instanceof Slot)
				{
                    slotList.unshift(<Slot> this._children[i]);
				}
			}
			return slotList;
        }

		/** @private */
        public _arriveAtFrame(frame: objects.Frame, timelineState: animation.TimelineState, animationState: animation.AnimationState, isCross: boolean): void
        {
            if (frame)
			{
				var mixingType:number = animationState.getMixingTransform(name);
				if(animationState.displayControl && (mixingType == 2 || mixingType == -1))
				{
					if(
                        !this.displayController ||
                        this.displayController == animationState.name
					)
					{
						var tansformFrame:objects.TransformFrame = <objects.TransformFrame> frame;
						if(this.slot)
						{
							var displayIndex:number = tansformFrame.displayIndex;
							if(displayIndex >= 0)
                            {
                                if (
                                    !isNaN(tansformFrame.zOrder) &&
                                    tansformFrame.zOrder != this.slot._tweenZorder
                                )
								{
									this.slot._tweenZorder = tansformFrame.zOrder;
									this.armature._slotsZOrderChanged = true;
								}
							}
							this.slot._changeDisplay(displayIndex);
							this.slot._updateVisible(tansformFrame.visible);
						}
					}
				}
				
				if(frame.event && this.armature.hasEventListener(events.FrameEvent.BONE_FRAME_EVENT))
				{
					var frameEvent:events.FrameEvent = new events.FrameEvent(events.FrameEvent.BONE_FRAME_EVENT);
					frameEvent.bone = this;
					frameEvent.animationState = animationState;
					frameEvent.frameLabel = frame.event;
					this.armature._eventList.push(frameEvent);
				}
				
				if(frame.sound && Bone._soundManager.hasEventListener(events.SoundEvent.SOUND))
				{
					var soundEvent:events.SoundEvent = new events.SoundEvent(events.SoundEvent.SOUND);
					soundEvent.armature = this.armature;
					soundEvent.animationState = animationState;
					soundEvent.sound = frame.sound;
					Bone._soundManager.dispatchEvent(soundEvent);
				}
				
				if(frame.action)
				{
					var childArmature:Armature = this.getChildArmature();
					if(childArmature)
					{
						childArmature.animation.gotoAndPlay(frame.action);
					}
				}
			}
			else
			{
				if(this.slot)
				{
					this.slot._changeDisplay(-1);
				}
			}
		}
		
		/** @private */
		public _updateColor(
			aOffset:number, 
			rOffset:number, 
			gOffset:number, 
			bOffset:number, 
			aMultiplier:number, 
			rMultiplier:number, 
			gMultiplier:number, 
			bMultiplier:number,
			isColorChanged:boolean
		):void
		{
			if(isColorChanged || this._isColorChanged)
			{
				this.slot._displayBridge.updateColor(
					aOffset, 
					rOffset, 
					gOffset, 
					bOffset, 
					aMultiplier, 
					rMultiplier, 
					gMultiplier, 
					bMultiplier
				);
			}
			this._isColorChanged = isColorChanged;
		}
	}

    export class Armature extends events.EventDispatcher
    {
		private static _soundManager: events.SoundEventManager = events.SoundEventManager.getInstance();

        public name: string;

        public display: any;
        public animation: animation.Animation;

        /** @private */
        public _slotsZOrderChanged: boolean;
        /** @private */
        public _slotList: Array<Slot>;
        /** @private */
        public _boneList: Array<Bone>;
		/** @private */
        public _eventList: Array<events.Event>;

        constructor(display:any) 
        {
            super();

			this.display = display;
            this.animation = new animation.Animation(this);

			this._slotsZOrderChanged = false;
            this._slotList = [];
            this._boneList = [];
            this._eventList = [];
        }
        
        public dispose(): void
		{
			if(!this.animation)
			{
				return;
			}
			
			this.animation.dispose();
            var i: number = this._slotList.length;

			while(i --)
			{
				this._slotList[i].dispose();
            }

            i = this._boneList.length;
			while(i --)
			{
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
        }

        public advanceTime(passedTime: number): void
		{
			this.animation.advanceTime(passedTime);
			
			var i:number = this._boneList.length;
			while(i --)
			{
				this._boneList[i]._update();
			}
			
			i = this._slotList.length;
			var slot:Slot;
			while(i --)
			{
				slot = this._slotList[i];
				slot._update();
				if(slot._isDisplayOnStage)
				{
					var childArmature:Armature = slot.getChildArmature();
					if(childArmature)
					{
						childArmature.advanceTime(passedTime);
					}
				}
			}
			
			if(this._slotsZOrderChanged)
			{
				this.updateSlotsZOrder();
				
				if(this.hasEventListener(events.ArmatureEvent.Z_ORDER_UPDATED))
				{
					this.dispatchEvent(new events.ArmatureEvent(events.ArmatureEvent.Z_ORDER_UPDATED));
				}
			}
			
			if(this._eventList.length)
			{
			    i = this._eventList.length;
				while(i --)
				{
                    this.dispatchEvent(this._eventList[i]);
				}
				this._eventList.length = 0;
			}
		}

        public getSlots(returnCopy: boolean = true): Array<Slot>
		{
			return returnCopy?this._slotList.concat():this._slotList;
		}

        public getBones(returnCopy: boolean = true): Array<Bone>
		{
			return returnCopy?this._boneList.concat():this._boneList;
		}

        public getSlot(slotName: string): Slot
		{
			var i:number = this._slotList.length;
			while(i --)
			{
				if(this._slotList[i].name == slotName)
				{
					return this._slotList[i];
				}
			}
			return null;
		}

		public getSlotByDisplay(display:Object):Slot
		{
			if(display)
			{
				var i:number = this._slotList.length;
				while(i --)
				{
					if(this._slotList[i].getDisplay() == display)
					{
						return this._slotList[i];
					}
				}
			}
			return null;
		}

        public removeSlot(slot: Slot): void
		{
			if(!slot)
			{
				throw new Error();
			}
			
			if(this._slotList.indexOf(slot) >= 0)
			{
				slot.parent.removeChild(slot);
			}
			else
			{
				throw new Error();
			}
		}

        public removeSlotByName(slotName: string): void
		{
			if(!slotName)
			{
				return;
			}
			
			var slot:Slot = this.getSlot(slotName);
			if(slot)
			{
				this.removeSlot(slot);
			}
		}

		public getBone(boneName:string):Bone
		{
			var i:number = this._boneList.length;
			while(i --)
			{
				if(this._boneList[i].name == boneName)
				{
					return this._boneList[i];
				}
			}
			return null;
		}

		public getBoneByDisplay(display:Object):Bone
		{
			var slot:Slot = this.getSlotByDisplay(display);
			return slot?slot.parent:null;
		}

		public removeBone(bone:Bone):void
		{
			if(!bone)
			{
				throw new Error();
			}
			
			if(this._boneList.indexOf(bone) >= 0)
			{
				if(bone.parent)
				{
					bone.parent.removeChild(bone);
				}
				else
				{
					bone._setArmature(null);
				}
			}
			else
			{
				throw new Error();
			}
		}

        public removeBoneByName(boneName: string): void
		{
			if(!boneName)
			{
				return;
			}
			
			var bone:Bone = this.getBone(boneName);
			if(bone)
			{
				this.removeBone(bone);
			}
		}

        public addChild(object: DBObject, parentName: string): void
		{
			if(!object)
			{
				throw new Error();
			}
			
			if(parentName)
			{
				var boneParent:Bone = this.getBone(parentName);
				if (boneParent)
				{
					boneParent.addChild(object);
				}
				else
				{
					throw new Error();
				}
			}
			else
			{
				if(object.parent)
				{
					object.parent.removeChild(object);
				}
				object._setArmature(this);
			}
		}

        public updateSlotsZOrder(): void
		{
			this._slotList.sort(this.sortSlot);
			var i:number = this._slotList.length;
			var slot:Slot;
			while(i --)
			{
				slot = this._slotList[i];
				if(slot._isDisplayOnStage)
				{
					slot._displayBridge.addDisplay(display, -1);
				}
			}
			
			this._slotsZOrderChanged = false;
		}

		/** @private */
        public _addDBObject(object: DBObject): void 
        {
            if (object instanceof Slot) 
            {
                var slot: Slot = <Slot> object;
                if (this._slotList.indexOf(slot) < 0) 
                {
                    this._slotList[this._slotList.length] = slot;
                }
            }
            else if (object instanceof Bone) 
            {
                var bone: Bone = <Bone> object;
                if (this._boneList.indexOf(bone) < 0) 
                {
                    this._boneList[this._boneList.length] = bone;
                    this._sortBoneList();
                }
            }
        }
        
		/** @private */
        public _removeDBObject(object: DBObject): void 
        {
            if (object instanceof Slot) 
            {
                var slot: Slot = <Slot> object;
                var index: number = this._slotList.indexOf(slot);
                if (index >= 0) 
                {
                    this._slotList.splice(index, 1);
                }
            }
            else if (object instanceof Bone) 
            {
                var bone: Bone = <Bone> object;
                index = this._boneList.indexOf(bone);
                if (index >= 0) 
                {
                    this._boneList.splice(index, 1);
                }
            }
        }

		/** @private */
        public _sortBoneList():void
		{
			var i:number = this._boneList.length;
			if(i == 0)
			{
				return;
			}
			var _helpArray:Array<Object> = [];
			var level:number;
			var bone:Bone;
			var boneParent:Bone;
			while(i --)
			{
				level = 0;
				bone = this._boneList[i];
				boneParent = bone;
				while(boneParent)
				{
					level ++;
					boneParent = boneParent.parent;
				}
				_helpArray[i] = {level:level, bone:bone};
			}
			
			_helpArray.sort(this.sortBone);
			
			i = _helpArray.length;
			while(i --)
			{
				this._boneList[i] = _helpArray[i].bone;
			}
        }

		/** @private */
        private arriveAtFrame(frame: objects.Frame, timelineState: animation.TimelineState, animationState: animation.AnimationState, isCross: boolean): void
        {
			if(frame.event && this.hasEventListener(events.FrameEvent.ANIMATION_FRAME_EVENT))
			{
				var frameEvent:events.FrameEvent = new events.FrameEvent(events.FrameEvent.ANIMATION_FRAME_EVENT);
				frameEvent.animationState = animationState;
				frameEvent.frameLabel = frame.event;
				this._eventList.push(frameEvent);
			}
			
			if(frame.sound && Armature._soundManager.hasEventListener(events.SoundEvent.SOUND))
			{
				var soundEvent:events.SoundEvent = new events.SoundEvent(events.SoundEvent.SOUND);
				soundEvent.armature = this;
				soundEvent.animationState = animationState;
				soundEvent.sound = frame.sound;
				Armature._soundManager.dispatchEvent(soundEvent);
			}
			
			if(frame.action)
			{
				if(animationState.isPlaying)
				{
					this.animation.gotoAndPlay(frame.action);
				}
			}
		}

        private sortSlot(slot1: Slot, slot2: Slot): number
		{
			return slot1.getZOrder() < slot2.getZOrder()?1: -1;
        }

        private sortBone(bone1: Bone, bone2: Bone): number
        {
            return 1;
        }
    }
}