module dragonBones
{

    export module animation
    {

    }

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
    
        export class EventDispatcher
        {
            private _listenersMap: Object;
            constructor()
            {
            }

            public addEventListener(type: string, listener: Function): void
            {
                if(type && listener)
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
                if (listeners)
                {
                    for (var i: number = 0, l = listeners.length; i < length; i++)
                    {
                        if (false)
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
                if(event)
                {
                    var listeners: Array<Function> = this._listenersMap[event.type];
                    if(listeners)
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
		
	        public static getInstance():SoundEventManager
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

    export module display
    {

    }

    export module factorys
    {

    }

    export module objects
    {
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

    }

    export class DBObject
    {
        public name: string;
        
        public fixedRotation: boolean;

        public global: objects.DBTransform;
        public origin: objects.DBTransform;
        public offset: objects.DBTransform;
        public tween: objects.DBTransform;
        public globalMatrix: geom.Matrix;

        public parent: Bone;
        public armature: Armature;

        private _scaleType: number;
        private _isColorChanged: boolean;

        private _visible: boolean;
        public getVisible(): boolean
        {
            return this._visible;
        }
        public setVisible(value: boolean): void
		{
			this._visible = value;
        }

        public _setParent(value: Bone): void
		{
			this.parent = value;
        }

        public _setArmature(value: Armature): void
		{
			if(this.armature)
			{
				this.armature._removeDBObject(this);
			}
			this.armature = value;
			if(this.armature)
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
			this.globalMatrix = new geom.Matrix();

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
			this.globalMatrix = null;
		}
		
        private update(): void
		{
			this.global.scaleX = (this.origin.scaleX + this.tween.scaleX) * this.offset.scaleX;
			this.global.scaleY = (this.origin.scaleY + this.tween.scaleY) * this.offset.scaleY;
			
			if(this.parent)
			{
				var x:number = this.origin.x + this.offset.x + this.tween.x;
				var y:number = this.origin.y + this.offset.y + this.tween.y;
                var parentMatrix: geom.Matrix = this.parent.globalMatrix;
				
				this.globalMatrix.tx = this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
				this.globalMatrix.ty = this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
				
				if(this.fixedRotation)
				{
					this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
					this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
				}
				else
				{
					this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX + this.parent.global.skewX;
					this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY + this.parent.global.skewY;
				}
				
				if(this.parent.scaleMode >= this._scaleType)
				{
					this.global.scaleX *= this.parent.global.scaleX;
					this.global.scaleY *= this.parent.global.scaleY;
				}
			}
			else
			{
				this.globalMatrix.tx = this.global.x = this.origin.x + this.offset.x + this.tween.x;
				this.globalMatrix.ty = this.global.y = this.origin.y + this.offset.y + this.tween.y;
				
				this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
				this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
			}

            this.globalMatrix.a = this.global.scaleX * Math.cos(this.global.skewY);
            this.globalMatrix.b = this.global.scaleX * Math.sin(this.global.skewY);
            this.globalMatrix.c = -this.global.scaleY * Math.sin(this.global.skewX);
            this.globalMatrix.d = this.global.scaleY * Math.cos(this.global.skewX);
		}
    }

    export class Bone extends DBObject
    {
        private static _soundManager: events.SoundEventManager = events.SoundEventManager.getInstance();

        public scaleMode: number;
        public displayController: string;
        public slot: Slot;

        private _tweenPivot: geom.Point;
        private _children: Array<DBObject>;
        
        public setVisible(value: boolean): void
		{
			if(this.getVisible() != value)
			{
                super.setVisible(value);
                var i: number = this._children.length;
				while(i --)
				{
                    var slot: Slot = <Slot> this._children[i];
					if(slot)
					{
						//slot.updateVisible(this.getVisible());
					}
				}
			}
		}

        private setArmature(value: Armature): void
		{
            super._setArmature(value);
            var i: number = this._children.length;
			while(i --)
			{
				this._children[i]._setArmature(this.armature);
			}
		}
        constructor()
        {
            super();
        }
    }

    export class Slot extends DBObject
    {
        constructor()
        {
            super();
        }
    }

    export class Armature extends events.EventDispatcher
    {
        private _slotList: Array<Slot>;
        private _boneList: Array<Bone>;

        constructor()
        {
            super();

            this._slotList = [];
            this._boneList = [];
        }
        
        public _addDBObject(object: DBObject): void
		{
			if(object instanceof Slot)
			{
				var slot:Slot = <Slot> object;
				if(this._slotList.indexOf(slot) < 0)
				{
					this._slotList[this._slotList.length] = slot;
				}
			}
			else if(object instanceof Bone)
			{
                var bone: Bone = <Bone> object;
				if(this._boneList.indexOf(bone) < 0)
				{
					this._boneList[this._boneList.length] = bone;
					//this.sortBoneList();
				}
			}
		}
		
		public _removeDBObject(object:DBObject):void
		{
			if(object instanceof Slot)
			{
                var slot: Slot = <Slot> object;
                var index: number = this._slotList.indexOf(slot);
				if(index >= 0)
				{
					this._slotList.splice(index, 1);
				}
			}
			else if(object instanceof Bone)
			{
                var bone: Bone = <Bone> object;
                index = this._boneList.indexOf(bone);
				if(index >= 0)
				{
					this._boneList.splice(index, 1);
				}
			}
		}
    }
}