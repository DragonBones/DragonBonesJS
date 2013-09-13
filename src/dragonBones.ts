module dragonBones 
{
    export module geom 
    {
        export class Point 
        {
            public x: number;
            public y: number;

            constructor(x:number, y:number) 
            {
                this.x = x;
                this.y = y;
            }
        }

        export class Rectangle
        {
            public x: number;
            public y: number;
            public width: number;
            public height: number;

            constructor(x:number, y:number, width:number, height:number) 
            {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
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

            public invert(): void
            {
                var a1: number = this.a;
                var b1: number = this.b;
                var c1: number = this.c;
                var d1: number = this.d;
                var tx1: number = this.tx;
                var n: number = a1 * d1 - b1 * c1;

                this.a = d1 / n;
                this.b = -b1 / n;
                this.c = -c1 / n;
                this.d = a1 / n;
                this.tx = (c1 * this.ty - d1 * tx1) / n;
                this.ty = -(a1 * this.ty - b1 * tx1) / n;
            }
        }

        export class ColorTransform 
        {
            public alphaMultiplier: number;
            public alphaOffset: number
            public blueMultiplier: number;
            public blueOffset: number;
            public greenMultiplier: number;
            public greenOffset: number;
            public redMultiplier: number;
            public redOffset: number;

            constructor() 
            {
                this.alphaMultiplier = 0;
                this.alphaOffset = 0;
                this.blueMultiplier = 0;
                this.blueOffset = 0;
                this.greenMultiplier = 0;
                this.greenOffset = 0;
                this.redMultiplier = 0;
                this.redOffset = 0;
            }
        }
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

        export class Frame
        {
		    public position: number;
		    public duration: number;

		    public action: string;
		    public event: string;
		    public sound: string;

            constructor() 
            {
			    this.position = 0;
			    this.duration = 0;
            }
		
		    public dispose():void
		    {
		    }
        }

        export class TransformFrame extends Frame
        {
		    public tweenEasing:number;
		    public tweenRotate:number;
		    public displayIndex:number;
		    public visible:boolean;
		    public zOrder:number;
		
		    public global:DBTransform;
		    public transform:DBTransform;
		    public pivot:geom.Point;
		    public color:geom.ColorTransform;

            constructor() 
            {
                super();
			
			    this.tweenEasing = 0;
			    this.tweenRotate = 0;
			    this.displayIndex = 0;
			    this.visible = true;
			    this.zOrder = NaN;
			
			    this.global = new DBTransform();
			    this.transform = new DBTransform();
			    this.pivot = new geom.Point(0, 0);
            }
		
		    public dispose():void
		    {
			    super.dispose();
			    this.global = null;
			    this.transform = null;
			    //SkeletonData pivots
			    this.pivot = null;
			    this.color = null;
		    }
        }

        export class Timeline
        {
            public duration: number;
            public scale: number;

            private _frameList: Array<Frame>;
            public getFrameList(): Array<Frame>
		    {
			    return this._frameList;
		    }
		
            constructor() 
            {
			    this._frameList = [];
			    this.duration = 0;
			    this.scale = 1;
            }
            
		    public dispose():void
		    {
			    var i:number = this._frameList.length;
			    while(i --)
			    {
				    this._frameList[i].dispose();
			    }
			    this._frameList.length = 0;
			    this._frameList = null;
		    }
		
		    public addFrame(frame:Frame):void
		    {
			    if(!frame)
			    {
				    throw new Error();
			    }
			
			    if(this._frameList.indexOf(frame) < 0)
			    {
				    this._frameList[this._frameList.length] = frame;
			    }
			    else
			    {
				    throw new Error();
			    }
		    }
        }

        export class TransformTimeline extends Timeline
        {
            public static HIDE_TIMELINE:TransformTimeline = new TransformTimeline();
		
		    public transformed:boolean;
		    public offset:number;
		
		    public originTransform:DBTransform;
            public originPivot: geom.Point;


            constructor() 
            {
                super();
			    this.originTransform = new DBTransform();
			    this.originPivot = new geom.Point(0, 0);
			    this.offset = 0;
            }
		
		    public dispose():void
		    {
			    if(this == TransformTimeline.HIDE_TIMELINE)
			    {
				    return;
			    }
			    super.dispose();
			    this.originTransform = null;
			    this.originPivot = null;
		    }
        }

        export class AnimationData extends Timeline
        {
            public frameRate:number;
		    public name:string;
		    public loop:number;
		    public tweenEasing:number;
		    public fadeInTime:number;
		
		    private _timelines:any;
		    public getTimelines():any
		    {
			    return this._timelines;
		    }

            constructor() 
            {
                super();
			    this.loop = 0;
			    this.tweenEasing = NaN;
			    this.fadeInTime = 0;
			
			    this._timelines = {};
            }
            
		    public dispose():void
		    {
			    super.dispose();
			
			    for(var timelineName in this._timelines)
			    {
				    (<TransformTimeline> this._timelines[timelineName]).dispose();
			    }
			    this._timelines = null;
		    }
		
		    public getTimeline(timelineName:string):TransformTimeline
		    {
			    return <TransformTimeline> this._timelines[timelineName];
		    }
		
		    public addTimeline(timeline:TransformTimeline, timelineName:string):void
		    {
			    if(!timeline)
			    {
				    throw new Error();
			    }
			
			    this._timelines[timelineName] = timeline;
		    }
        }

        export class DisplayData
        {
            public static ARMATURE: string = "armature";
            public static IMAGE: string = "image";

            public name: string;
            public type: string;
            public transform: DBTransform;
            public pivot: geom.Point;

            constructor() 
            {
			    this.transform = new DBTransform();
            }

            public dispose(): void
            {
                this.transform = null;
                this.pivot = null;
            }
        }

        export class SlotData
        {
            public name: string;
            public parent: string;
		    public zOrder: number;

		    private _displayDataList: Array<DisplayData>;
		    public getDisplayDataList():Array<DisplayData>
		    {
			    return this._displayDataList;
		    }

            constructor() 
            {
			    this._displayDataList = [];
			    this.zOrder = 0;
            }
		
		    public dispose():void
		    {
			    var i:number = this._displayDataList.length;
			    while(i --)
			    {
				    this._displayDataList[i].dispose();
			    }
			    this._displayDataList.length = 0;
			    this._displayDataList = null;
		    }
		
		    public addDisplayData(displayData:DisplayData):void
		    {
			    if(!displayData)
			    {
				    throw new Error();
			    }
			    if (this._displayDataList.indexOf(displayData) < 0)
			    {
				    this._displayDataList[this._displayDataList.length] = displayData;
			    }
			    else
			    {
				    throw new Error();
			    }
		    }
		
		    public getDisplayData(displayName:string):DisplayData
		    {
			    var i:number = this._displayDataList.length;
			    while(i --)
			    {
				    if(this._displayDataList[i].name == displayName)
				    {
					    return this._displayDataList[i];
				    }
			    }
			
			    return null;
		    }
        }

        export class BoneData
        {
		    public name:string;
		    public parent:string;
		    public length:number;
		
		    public global:DBTransform;
            public transform: DBTransform;

            constructor() 
            {
			    this.length = 0;
			    this.global = new DBTransform();
			    this.transform = new DBTransform();
            }
		
		    public dispose():void
		    {
			    this.global = null;
			    this.transform = null;
            }
        }

        export class SkinData
        {
		    public name:string;
		
		    private _slotDataList:Array<SlotData>;
		    public getSlotDataList():Array<SlotData>
		    {
			    return this._slotDataList;
		    }

            constructor() 
            {
			    this._slotDataList = [];
            }
		
		    public dispose():void
		    {
			    var i:number = this._slotDataList.length;
			    while(i --)
			    {
				    this._slotDataList[i].dispose();
			    }
			    this._slotDataList.length = 0;
			    this._slotDataList = null;
		    }
		
		    public getSlotData(slotName:string):SlotData
		    {
			    var i:number = this._slotDataList.length;
			    while(i --)
			    {
				    if(this._slotDataList[i].name == slotName)
				    {
					    return this._slotDataList[i];
				    }
			    }
			    return null;
		    }
		
		    public addSlotData(slotData:SlotData):void
		    {
			    if(!slotData)
			    {
				    throw new Error();
			    }
			
			    if (this._slotDataList.indexOf(slotData) < 0)
			    {
				    this._slotDataList[this._slotDataList.length] = slotData;
			    }
			    else
			    {
				    throw new Error();
			    }
		    }
        }

        export class ArmatureData
        {
            public name:string;
		
		    private _boneDataList:Array<BoneData>;
		    public getBoneDataList():Array<BoneData>
		    {
			    return this._boneDataList;
		    }
		
		    private _skinDataList:Array<SkinData>;
		    public getSkinDataList():Array<SkinData>
		    {
			    return this._skinDataList;
		    }
		
		    private _animationDataList:Array<AnimationData>;
		    public getAnimationDataList():Array<AnimationData>
		    {
			    return this._animationDataList;
		    }

            constructor() 
            {
			    this._boneDataList = [];
			    this._skinDataList = [];
			    this._animationDataList = [];
            }

            public dispose():void
		    {
			    var i:number = this._boneDataList.length;
			    while(i --)
			    {
				    this._boneDataList[i].dispose();
			    }
			    i = this._skinDataList.length;
			    while(i --)
			    {
				    this._skinDataList[i].dispose();
			    }
			    i = this._animationDataList.length;
			    while(i --)
			    {
				    this._animationDataList[i].dispose();
			    }
			    this._boneDataList.length = 0;
			    this._skinDataList.length = 0;
			    this._animationDataList.length = 0;
			    this._boneDataList = null;
			    this._skinDataList = null;
			    this._animationDataList = null;
		    }
		
		    public getBoneData(boneName:string):BoneData
		    {
			    var i:number = this._boneDataList.length;
			    while(i --)
			    {
				    if(this._boneDataList[i].name == boneName)
				    {
					    return this._boneDataList[i];
				    }
			    }
			    return null;
		    }
		
		    public getSkinData(skinName:string):SkinData
		    {
			    if(!skinName)
			    {
				    return this._skinDataList[0];
			    }
			    var i:number = this._skinDataList.length;
			    while(i --)
			    {
				    if(this._skinDataList[i].name == skinName)
				    {
					    return this._skinDataList[i];
				    }
			    }
			
			    return null;
		    }
		
		    public getAnimationData(animationName:string):AnimationData
		    {
			    var i:number = this._animationDataList.length;
			    while(i --)
			    {
				    if(this._animationDataList[i].name == animationName)
				    {
					    return this._animationDataList[i];
				    }
			    }
			    return null;
		    }
		
		    public addBoneData(boneData:BoneData):void
		    {
			    if(!boneData)
			    {
				    throw new Error();
			    }
			
			    if (this._boneDataList.indexOf(boneData) < 0)
			    {
				    this._boneDataList[this._boneDataList.length] = boneData;
			    }
			    else
			    {
				    throw new Error();
			    }
		    }
		
		    public addSkinData(skinData:SkinData):void
		    {
			    if(!skinData)
			    {
				    throw new Error();
			    }
			
			    if(this._skinDataList.indexOf(skinData) < 0)
			    {
				    this._skinDataList[this._skinDataList.length] = skinData;
			    }
			    else
			    {
				    throw new Error();
			    }
		    }
		
		    public addAnimationData(animationData:AnimationData):void
		    {
			    if(!animationData)
			    {
				    throw new Error();
			    }
			
			    if(this._animationDataList.indexOf(animationData) < 0)
			    {
				    this._animationDataList[this._animationDataList.length] = animationData;
			    }
		    }
		
		    public sortBoneDataList():void
		    {
			    var i:number = this._boneDataList.length;
			    if(i == 0)
			    {
				    return;
			    }
			
			    var helpArray:Array<any> = [];
			    while(i --)
			    {
				    var boneData:BoneData = this._boneDataList[i];
				    var level:number = 0;
				    var parentData:BoneData = boneData;
				    while(parentData && parentData.parent)
				    {
					    level ++;
					    parentData = this.getBoneData(parentData.parent);
                    }
				    helpArray[i] = {level:level, boneData:boneData};
			    }
			
			    helpArray.sort(this.sortBoneData);
			    
			    i = helpArray.length;
			    while(i --)
                {
				    this._boneDataList[i] = helpArray[i].boneData;
			    }
            }

            private sortBoneData(object1:any, object2:any): number
            {
                return object1.level > object2.level ? 1 : -1;
            }
        }

        export class SkeletonData
        {
            public name:string;
		
		    private _subTexturePivots:any;
		
		    public getArmatureNames():Array<string>
		    {
			    var nameList:Array<string> = [];
			    for(var armatureDataIndex in this._armatureDataList)
			    {
				    nameList[nameList.length] = this._armatureDataList[armatureDataIndex].name;
			    }
			    return nameList;
		    }
		
		    private _armatureDataList:Array<ArmatureData>;
		    public getArmatureDataList():Array<ArmatureData>
		    {
			    return this._armatureDataList;
		    }

            constructor() 
            {
                this._armatureDataList = [];
			    this._subTexturePivots = {};
            }
            
		    public dispose():void
		    {
			    for (var armatureDataIndex in this._armatureDataList)
			    {
				    this._armatureDataList[armatureDataIndex].dispose();
			    }
			    this._armatureDataList.length = 0;
			
			    this._armatureDataList = null;
			    this._subTexturePivots = null;
		    }
		
		    public getArmatureData(armatureName:string):ArmatureData
		    {
			    var i:number = this._armatureDataList.length;
			    while(i --)
			    {
				    if(this._armatureDataList[i].name == armatureName)
				    {
					    return this._armatureDataList[i];
				    }
			    }
			
			    return null;
		    }
		
		    public addArmatureData(armatureData:ArmatureData):void
		    {
			    if(!armatureData)
			    {
				    throw new Error();
			    }
			
			    if(this._armatureDataList.indexOf(armatureData) < 0)
			    {
				    this._armatureDataList[this._armatureDataList.length] = armatureData;
			    }
			    else
			    {
				    throw new Error();
			    }
		    }
		
		    public removeArmatureData(armatureData:ArmatureData):void
		    {
			    var index:number = this._armatureDataList.indexOf(armatureData);
			    if(index >= 0)
			    {
				    this._armatureDataList.splice(index, 1);
			    }
		    }
		
		    public removeArmatureDataByName(armatureName:string):void
		    {
			    var i:number = this._armatureDataList.length;
			    while(i --)
			    {
				    if(this._armatureDataList[i].name == armatureName)
				    {
					    this._armatureDataList.splice(i, 1);
				    }
			    }
		    }
		
		    public getSubTexturePivot(subTextureName:string):geom.Point
		    {
			    return this._subTexturePivots[subTextureName];
		    }
		
		    public addSubTexturePivot(x:number, y:number, subTextureName:string):geom.Point
		    {
			    var point:geom.Point = this._subTexturePivots[subTextureName];
			    if(point)
			    {
				    point.x = x;
				    point.y = y;
			    }
			    else
			    {
				    this._subTexturePivots[subTextureName] = point = new geom.Point(x, y);
			    }
			
			    return point;
		    }
		
		    public removeSubTexturePivot(subTextureName:string):void
		    {
			    if(subTextureName)
			    {
				    delete this._subTexturePivots[subTextureName];
			    }
			    else
			    {
				    for(subTextureName in this._subTexturePivots)
				    {
					    delete this._subTexturePivots[subTextureName];
				    }
			    }
		    }
        }

        export class DataParser
        {
            public static parseTextureAtlasData(rawData:any, scale:number = 1): any
            {
			    if(!rawData)
			    {
				    throw new Error();
                }

                var textureAtlasData:any = {};
                textureAtlasData.__name = rawData[utils.ConstValues.A_NAME];
                var subTextureList:Array<any> = rawData[utils.ConstValues.SUB_TEXTURE]
			    for(var index in subTextureList)
			    {
                    var subTextureObject: any = subTextureList[index];
                    var subTextureName: string = subTextureObject[utils.ConstValues.A_NAME];
                    var subTextureData: geom.Rectangle = new geom.Rectangle(
                            Number(subTextureObject[utils.ConstValues.A_X]) / scale,
                            Number(subTextureObject[utils.ConstValues.A_Y]) / scale,
                            Number(subTextureObject[utils.ConstValues.A_WIDTH]) / scale,
                            Number(subTextureObject[utils.ConstValues.A_HEIGHT]) / scale
                        );
				    textureAtlasData[subTextureName] = subTextureData;
			    }
			    
			    return textureAtlasData;
            }

            public static parseSkeletonData(rawData:any): SkeletonData
            {
                if(!rawData)
                {
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
			
			    var frameRate:number = Number(rawData[utils.ConstValues.A_FRAME_RATE]);
			    var data:SkeletonData = new SkeletonData();
			    data.name = rawData[utils.ConstValues.A_NAME];

                var armatureObjectList: Array<any> = rawData[utils.ConstValues.ARMATURE];
			    for(var index in armatureObjectList)
			    {
                    var armatureObject: any = armatureObjectList[index];
                    data.addArmatureData(DataParser.parseArmatureData(armatureObject, data, frameRate));
			    }
			
			    return data;
            }
		
		    private static parseArmatureData(armatureObject:any, data:SkeletonData, frameRate:number):ArmatureData
		    {
			    var armatureData:ArmatureData = new ArmatureData();
			    armatureData.name = armatureObject[utils.ConstValues.A_NAME];

                var boneObjectList: Array<any> = armatureObject[utils.ConstValues.BONE];
			    for (var index in boneObjectList)
			    {
                    var boneObject: any = boneObjectList[index];
                    armatureData.addBoneData(DataParser.parseBoneData(boneObject));
                }
                
                var skinObjectList: Array<any> = armatureObject[utils.ConstValues.SKIN];
			    for (var index in skinObjectList)
			    {
                    var skinObject: any = skinObjectList[index];
                    armatureData.addSkinData(DataParser.parseSkinData(skinObject, data));
			    }
			
			    utils.DBDataUtil.transformArmatureData(armatureData);
                armatureData.sortBoneDataList();

                var animationObjectList: Array<any> = armatureObject[utils.ConstValues.ANIMATION];
			
			    for (var index in animationObjectList)
                {
                    var animationObject: any = animationObjectList[index];
				    armatureData.addAnimationData(DataParser.parseAnimationData(animationObject, armatureData, frameRate));
			    }
			
			    return armatureData;
            }

		    private static parseBoneData(boneObject:any):BoneData
		    {
			    var boneData:BoneData = new BoneData();
                boneData.name = boneObject[utils.ConstValues.A_NAME];
			    boneData.parent = boneObject[utils.ConstValues.A_PARENT];
                boneData.length = Number(boneObject[utils.ConstValues.A_LENGTH]) || 0;
			
			    DataParser.parseTransform(boneObject[utils.ConstValues.TRANSFORM], boneData.global);
                boneData.transform.copy(boneData.global);

			    return boneData;
		    }
		
		    private static parseSkinData(skinObject:any, data:SkeletonData):SkinData
		    {
			    var skinData:SkinData = new SkinData();
                skinData.name = skinObject[utils.ConstValues.A_NAME];
                var slotObjectList: Array<any> = skinObject[utils.ConstValues.SLOT];
                for (var index in slotObjectList)
			    {
				    var slotObject:any = slotObjectList[index];
                    skinData.addSlotData(DataParser.parseSlotData(slotObject, data));
			    }
			
			    return skinData;
		    }
		
		    private static parseSlotData(slotObject:any, data:SkeletonData):SlotData
		    {
			    var slotData:SlotData = new SlotData();
			    slotData.name = slotObject[utils.ConstValues.A_NAME];
			    slotData.parent = slotObject[utils.ConstValues.A_PARENT];
                slotData.zOrder = Number(slotObject[utils.ConstValues.A_Z_ORDER]);

                var displayObjectList: Array<any> = slotObject[utils.ConstValues.DISPLAY];
                for (var index in displayObjectList)
			    {
                    var displayObject:any = displayObjectList[index];
                    slotData.addDisplayData(DataParser.parseDisplayData(displayObject, data));
			    }
			
			    return slotData;
            }

		    private static parseDisplayData(displayObject:any, data:SkeletonData):DisplayData
		    {
			    var displayData:DisplayData = new DisplayData();
			    displayData.name = displayObject[utils.ConstValues.A_NAME];
			    displayData.type = displayObject[utils.ConstValues.A_TYPE];
			
			    displayData.pivot = data.addSubTexturePivot(
				    0, 
				    0, 
				    displayData.name
			    );
			
			    DataParser.parseTransform(displayObject[utils.ConstValues.TRANSFORM], displayData.transform, displayData.pivot);
			
			    return displayData;
		    }

		    private static parseAnimationData(animationObject:any, armatureData:ArmatureData, frameRate:number):AnimationData
		    {
			    var animationData:AnimationData = new AnimationData();
			    animationData.name = animationObject[utils.ConstValues.A_NAME];
			    animationData.frameRate = frameRate;
			    animationData.loop = Number(animationObject[utils.ConstValues.A_LOOP]);
                animationData.fadeInTime = Number(animationObject[utils.ConstValues.A_FADE_IN_TIME]);
			    animationData.duration = Number(animationObject[utils.ConstValues.A_DURATION]) / frameRate;
			    animationData.scale = Number(animationObject[utils.ConstValues.A_SCALE]);
			
			    if(animationObject.hasOwnProperty(utils.ConstValues.A_TWEEN_EASING))
			    {
				    var tweenEase:any = animationObject[utils.ConstValues.A_TWEEN_EASING];
				    if(
					    tweenEase == undefined ||
					    tweenEase == null
				    )
				    {
					    animationData.tweenEasing = NaN;
				    }
				    else
				    {
					    animationData.tweenEasing = Number(tweenEase);
				    }
			    }
			    else
			    {
				    animationData.tweenEasing = NaN;
			    }
			
			    DataParser.parseTimeline(animationObject, animationData, DataParser.parseMainFrame, frameRate);
			
			    var timeline:TransformTimeline;
                var timelineName: string;
                var timelineObjectList: Array<any> = animationObject[utils.ConstValues.TIMELINE];
			    for (var index in timelineObjectList)
			    {
                    var timelineObject: any = timelineObjectList[index];
                    timeline = DataParser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
				    timelineName = timelineObject[utils.ConstValues.A_NAME];
				    animationData.addTimeline(timeline, timelineName);
			    }
			
			    utils.DBDataUtil.addHideTimeline(animationData, armatureData);
			    utils.DBDataUtil.transformAnimationData(animationData, armatureData);
			
			    return animationData;
		    }
		
		    private static parseTimeline(timelineObject:any, timeline:Timeline, frameParser:Function, frameRate:number):void
		    {
			    var position:number = 0;
                var frame: Frame;
                var frameObjectList: Array<any> = timelineObject[utils.ConstValues.FRAME];
			    for (var index in frameObjectList)
			    {
                    var frameObject: any = frameObjectList[index];
                    frame = frameParser(frameObject, frameRate);
				    frame.position = position;
				    timeline.addFrame(frame);
				    position += frame.duration;
			    }
			    if(frame)
			    {
				    frame.duration = timeline.duration - frame.position;
			    }
		    }
		
		    private static parseTransformTimeline(timelineObject:any, duration:number, frameRate:number):TransformTimeline
		    {
			    var timeline:TransformTimeline = new TransformTimeline();
			    timeline.duration = duration;
			
			    DataParser.parseTimeline(timelineObject, timeline, DataParser.parseTransformFrame, frameRate);
			
			    timeline.scale = Number(timelineObject[utils.ConstValues.A_SCALE]);
			    timeline.offset = Number(timelineObject[utils.ConstValues.A_OFFSET]);
			
			    return timeline;
		    }
		
		    private static parseFrame(frameObject:any, frame:Frame, frameRate:number):void
		    {
			    frame.duration = Number(frameObject[utils.ConstValues.A_DURATION]) / frameRate;
			    frame.action = frameObject[utils.ConstValues.A_ACTION];
			    frame.event = frameObject[utils.ConstValues.A_EVENT];
			    frame.sound = frameObject[utils.ConstValues.A_SOUND];
		    }
		
		    private static parseMainFrame(frameObject:any, frameRate:number):Frame
		    {
			    var frame:Frame = new Frame();
			    DataParser.parseFrame(frameObject, frame, frameRate);
			    return frame;
		    }
		
		    private static parseTransformFrame(frameObject:any, frameRate:number):TransformFrame
		    {
			    var frame:TransformFrame = new TransformFrame();
			    DataParser.parseFrame(frameObject, frame, frameRate);
			
			    frame.visible = Number(frameObject[utils.ConstValues.A_HIDE]) != 1;
			
                if (frameObject.hasOwnProperty(utils.ConstValues.A_TWEEN_EASING))
			    {
				    var tweenEase:any = frameObject[utils.ConstValues.A_TWEEN_EASING];
				    if(
					    tweenEase == undefined ||
					    tweenEase == null
				    )
				    {
					    frame.tweenEasing = NaN;
				    }
				    else
				    {
					    frame.tweenEasing = Number(tweenEase);
				    }
			    }
			    else
			    {
				    frame.tweenEasing = 0;
			    }
			
			    frame.tweenRotate = Number(frameObject[utils.ConstValues.A_TWEEN_ROTATE]);
			    frame.displayIndex = Number(frameObject[utils.ConstValues.A_DISPLAY_INDEX]);
			    //
			    frame.zOrder = Number(frameObject[utils.ConstValues.A_Z_ORDER]);
			
			    DataParser.parseTransform(frameObject[utils.ConstValues.TRANSFORM], frame.global, frame.pivot);
			    frame.transform.copy(frame.global);
			
			    var colorTransformObject:any = frameObject[utils.ConstValues.COLOR_TRANSFORM];
			    if(colorTransformObject)
			    {
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
		    }
		
		    private static parseTransform(transformObject:any, transform:DBTransform, pivot:geom.Point = null):void
		    {
			    if(transformObject)
			    {
				    if(transform)
				    {
					    transform.x = Number(transformObject[utils.ConstValues.A_X]);
					    transform.y = Number(transformObject[utils.ConstValues.A_Y]);
					    transform.skewX = Number(transformObject[utils.ConstValues.A_SKEW_X]) * utils.ConstValues.ANGLE_TO_RADIAN;
					    transform.skewY = Number(transformObject[utils.ConstValues.A_SKEW_Y]) * utils.ConstValues.ANGLE_TO_RADIAN;
					    transform.scaleX = Number(transformObject[utils.ConstValues.A_SCALE_X]);
					    transform.scaleY = Number(transformObject[utils.ConstValues.A_SCALE_Y]);
				    }
				    if(pivot)
				    {
					    pivot.x = Number(transformObject[utils.ConstValues.A_PIVOT_X]);
					    pivot.y = Number(transformObject[utils.ConstValues.A_PIVOT_Y]);
				    }
			    }
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
    }

    export module textures 
    {
        export interface ITextureAtlas
        {
            name: string;
            dispose(): void;
            getRegion(subTextureName: string): geom.Rectangle;
        }
    }

    export module factorys
    {
        export class BaseFactory extends events.EventDispatcher
        {
            /** @private */
		    public _dataDic:any;
		    /** @private */
		    public _textureAtlasDic:any;
		    /** @private */
		    public _textureAtlasLoadingDic:any;	
		    /** @private */
		    public _currentDataName:string;
		    /** @private */
		    public _currentTextureAtlasName:string;

            constructor()
            {
                super();
                
			    this._dataDic = {};
			    this._textureAtlasDic = {};
			    this._textureAtlasLoadingDic = {};
            }

            
		    public getSkeletonData(name:string):objects.SkeletonData
		    {
			    return this._dataDic[name];
            }

		    public addSkeletonData(data:objects.SkeletonData, name:string):void
		    {
			    if(!data)
			    {
				    throw new Error();
			    }
			    name = name || data.name;
			    if(!name)
			    {
				    throw new Error("Unnamed data!");
			    }
			    if(this._dataDic[name])
			    {
				
			    }
			    this._dataDic[name] = data;
		    }

		    public removeSkeletonData(name:string):void
		    {
			    delete this._dataDic[name];
		    }

		    public getTextureAtlas(name:string):any
		    {
			    return this._textureAtlasDic[name];
            }
            
		    public addTextureAtlas(textureAtlas:textures.ITextureAtlas, name:string):void
		    {
			    if(!textureAtlas)
			    {
				    throw new Error();
			    }

                name = name || textureAtlas.name;
			    if(!name)
			    {
				    throw new Error("Unnamed data!");
			    }
			    if(this._textureAtlasDic[name])
			    {
				
			    }
			    this._textureAtlasDic[name] = textureAtlas;
		    }

		    public removeTextureAtlas(name:string):void
		    {
			    delete this._textureAtlasDic[name];
            }

            
		    public dispose(disposeData:boolean = true):void
		    {
			    if(disposeData)
			    {
                    for (var i in this._dataDic)
				    {
					    this._dataDic[i].dispose();
				    }
                    for (var i in this._textureAtlasDic)
				    {
					    this._textureAtlasDic[i].dispose();
				    }
			    }
			    this._dataDic = null
			    this._textureAtlasDic = null;
			    this._textureAtlasLoadingDic = null;		
			    this._currentDataName = null;
			    this._currentTextureAtlasName = null;
            }

            public buildArmature(armatureName:string, animationName:string, skeletonName:string, textureAtlasName:string, skinName:string):Armature
		    {
			    if(skeletonName)
			    {
				    var data:objects.SkeletonData = this._dataDic[skeletonName];
				    if(data)
				    {
					    var armatureData:objects.ArmatureData = data.getArmatureData(armatureName);
				    }
			    }
			    else
			    {
				    for (skeletonName in this._dataDic)
				    {
					    data = this._dataDic[skeletonName];
					    armatureData = data.getArmatureData(armatureName);
					    if(armatureData)
					    {
						    break;
					    }
				    }
			    }
			
			    if(!armatureData)
			    {
				    return null;
			    }
			
			    this._currentDataName = skeletonName;
			    this._currentTextureAtlasName = textureAtlasName || skeletonName;

			    var armature:Armature = this._generateArmature();
                armature.name = armatureName;
                var bone: Bone;
                var boneData: objects.BoneData;
                var boneDataList: Array<objects.BoneData> = armatureData.getBoneDataList();
			    for(var index in boneDataList)
			    {
                    boneData = boneDataList[index];
                    bone = new Bone();
				    bone.name = boneData.name;
				    bone.origin.copy(boneData.transform);
				    if(armatureData.getBoneData(boneData.parent))
				    {
					    armature.addChild(bone, boneData.parent);
				    }
				    else
				    {
					    armature.addChild(bone, null);
				    }
                }

			    if(animationName && animationName != armatureName)
			    {
				    var animationArmatureData:objects.ArmatureData = data.getArmatureData(animationName);
				    if(!animationArmatureData)
				    {
					    for (skeletonName in this._dataDic)
					    {
						    data = this._dataDic[skeletonName];
						    animationArmatureData = data.getArmatureData(animationName);
						    if(animationArmatureData)
						    {
							    break;
						    }
					    }
				    }
			    }
			    
			    /*if(animationArmatureData)
			    {
                    armature.animation.setAnimationDataList(animationArmatureData.getAnimationDataList());
			    }
			    else
			    {
				    armature.animation.setAnimationDataList(armatureData.getAnimationDataList());
			    }*/
			
			    var skinData:objects.SkinData = armatureData.getSkinData(skinName);
			    if(!skinData)
			    {
				    throw new Error();
			    }
			
			    var slot:Slot;
			    var displayData:objects.DisplayData;
			    var childArmature:Armature;
			    var i:number;
                var helpArray: Array<any> = [];
                var slotData: objects.SlotData;
                var slotDataList: Array<objects.SlotData> = skinData.getSlotDataList();
                var displayDataList: Array<objects.DisplayData>;
			    for(var index in slotDataList)
			    {
                    slotData = slotDataList[index];
                    bone = armature.getBone(slotData.parent);
				    if(!bone)
				    {
					    continue;
                    }
                    displayDataList = slotData.getDisplayDataList();
				    slot = this._generateSlot();
				    slot.name = slotData.name;
				    slot._originZOrder = slotData.zOrder;
                    slot._dislayDataList = displayDataList;
				
				    helpArray.length = 0;
				    i = displayDataList.length;
				    while(i --)
				    {
					    displayData = displayDataList[i];
					    switch(displayData.type)
					    {
						    case objects.DisplayData.ARMATURE:
                                childArmature = this.buildArmature(displayData.name, null, this._currentDataName, this._currentTextureAtlasName, null);
							    if(childArmature)
							    {
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
            }

            public getTextureDisplay(textureName:string, textureAtlasName:string, pivotX:number, pivotY:number):Object
		    {
			    if(textureAtlasName)
			    {
				    var textureAtlas:textures.ITextureAtlas = this._textureAtlasDic[textureAtlasName];
			    }
			    if(!textureAtlas && !textureAtlasName)
			    {
				    for (textureAtlasName in this._textureAtlasDic)
				    {
					    textureAtlas = this._textureAtlasDic[textureAtlasName];
					    if(textureAtlas.getRegion(textureName))
					    {
						    break;
					    }
					    textureAtlas = null;
				    }
			    }
			    if(textureAtlas)
			    {
				    if(isNaN(pivotX) || isNaN(pivotY))
				    {
					    var data:objects.SkeletonData = this._dataDic[textureAtlasName];
					    if(data)
					    {
						    var pivot:geom.Point = data.getSubTexturePivot(textureName);
						    if(pivot)
						    {
							    pivotX = pivot.x;
							    pivotY = pivot.y;
						    }
					    }
				    }
				
				    return this._generateDisplay(textureAtlas, textureName, pivotX, pivotY);
			    }
			    return null;
            }
		
		    /** @private */
		    public _generateArmature():Armature
		    {
			    return null;
		    }
		
		    /** @private */
		    public _generateSlot():Slot
		    {
			    return null;
		    }
		
		    /** @private */
		    public _generateDisplay(textureAtlas:textures.ITextureAtlas, fullName:string, pivotX:number, pivotY:number):any
		    {
			    return null;
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
		    private static DOUBLE_PI:number = Math.PI * 2;
            private static _helpMatrix: geom.Matrix = new geom.Matrix();

            public static transformPointWithParent(transform: objects.DBTransform, parent: objects.DBTransform): void
            {
                var helpMatrix: geom.Matrix = TransformUtil._helpMatrix;
			    TransformUtil.transformToMatrix(parent, helpMatrix);
                helpMatrix.invert();

			    var x:number = transform.x;
                var y: number = transform.y;

			    transform.x = helpMatrix.a * x + helpMatrix.c * y + helpMatrix.tx;
			    transform.y = helpMatrix.d * y + helpMatrix.b * x + helpMatrix.ty;
			
			    transform.skewX = TransformUtil.formatRadian(transform.skewX - parent.skewX);
			    transform.skewY = TransformUtil.formatRadian(transform.skewY - parent.skewY);
            }

            public static transformToMatrix(transform:objects.DBTransform, matrix:geom.Matrix):void
		    {
			    matrix.a = transform.scaleX * Math.cos(transform.skewY)
			    matrix.b = transform.scaleX * Math.sin(transform.skewY)
			    matrix.c = -transform.scaleY * Math.sin(transform.skewX);
			    matrix.d = transform.scaleY * Math.cos(transform.skewX);
			    matrix.tx = transform.x;
			    matrix.ty = transform.y;
            }
		
		    public static formatRadian(radian:number):number
		    {
			    radian %= TransformUtil.DOUBLE_PI;
			    if (radian > Math.PI)
			    {
				    radian -= TransformUtil.DOUBLE_PI;
			    }
			    if (radian < -Math.PI)
			    {
				    radian += TransformUtil.DOUBLE_PI;
			    }
			    return radian;
		    }
        }

        export class DBDataUtil
        {
            private static _helpTransform1: objects.DBTransform = new objects.DBTransform();
            private static _helpTransform2: objects.DBTransform = new objects.DBTransform();

		    public static transformArmatureData(armatureData:objects.ArmatureData):void
            {
                var boneDataList: Array<objects.BoneData> = armatureData.getBoneDataList();
			    var i:number = boneDataList.length;
			    var boneData:objects.BoneData;
			    var parentBoneData:objects.BoneData;
			    while(i --)
			    {
				    boneData = boneDataList[i];
				    if(boneData.parent)
				    {
					    parentBoneData = armatureData.getBoneData(boneData.parent);
					    if(parentBoneData)
					    {
						    boneData.transform.copy(boneData.global);
						    TransformUtil.transformPointWithParent(boneData.transform, parentBoneData.global);
					    }
				    }
			    }
            }
		
		    public static transformArmatureDataAnimations(armatureData:objects.ArmatureData):void
		    {
			    var animationDataList:Array<objects.AnimationData> = armatureData.getAnimationDataList();
			    var i:number = animationDataList.length;
			    while(i --)
			    {
				    DBDataUtil.transformAnimationData(animationDataList[i], armatureData);
			    }
            }

		    public static transformAnimationData(animationData:objects.AnimationData, armatureData:objects.ArmatureData):void
		    {
			    var skinData:objects.SkinData = armatureData.getSkinData(null);
                var boneDataList: Array<objects.BoneData> = armatureData.getBoneDataList();
                var slotDataList: Array<objects.SlotData> = skinData.getSlotDataList();
			    var i:number = boneDataList.length;
			
			    var boneData:objects.BoneData;
			    var timeline:objects.TransformTimeline;
			    var slotData:objects.SlotData;
			    var displayData:objects.DisplayData
			    var parentTimeline:objects.TransformTimeline;
			    var frameList:Array<objects.Frame>;
			    var originTransform:objects.DBTransform;
			    var originPivot:geom.Point;
			    var prevFrame:objects.TransformFrame;
			    var frameListLength:number;
			    var frame:objects.TransformFrame;
			
			    while(i --)
			    {
				    boneData = boneDataList[i];
				    timeline = animationData.getTimeline(boneData.name);
				    if(!timeline)
				    {
					    continue;
				    }
				
                    slotData = null;

				    for(var slotIndex in slotDataList)
                    {
                        slotData = slotDataList[slotIndex];
					    if(slotData.parent == boneData.name)
					    {
						    break;
					    }
				    }

                    parentTimeline = boneData.parent ? animationData.getTimeline(boneData.parent) : null;

                    frameList = timeline.getFrameList();
				
				    originTransform = null;
				    originPivot = null;
				    prevFrame = null;
				    frameListLength = frameList.length;
				    for(var j:number = 0;j < frameListLength;j ++)
				    {
					    frame = <objects.TransformFrame> frameList[j];
					    if(parentTimeline)
					    {
						    //tweenValues to transform.
						    DBDataUtil._helpTransform1.copy(frame.global);
						
						    //get transform from parent timeline.
						    DBDataUtil.getTimelineTransform(parentTimeline, frame.position, DBDataUtil._helpTransform2);
						    TransformUtil.transformPointWithParent(DBDataUtil._helpTransform1, DBDataUtil._helpTransform2);
						
						    //transform to tweenValues.
						    frame.transform.copy(DBDataUtil._helpTransform1);
					    }
					    else
					    {
						    frame.transform.copy(frame.global);
					    }
					
					    frame.transform.x -= boneData.transform.x;
					    frame.transform.y -= boneData.transform.y;
					    frame.transform.skewX -= boneData.transform.skewX;
					    frame.transform.skewY -= boneData.transform.skewY;
					    frame.transform.scaleX -= boneData.transform.scaleX;
					    frame.transform.scaleY -= boneData.transform.scaleY;
					
					    if(!timeline.transformed)
					    {
						    if(slotData)
						    {
							    frame.zOrder -= slotData.zOrder;
						    }
					    }
					
					    if(!originTransform)
					    {
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
					
					    if(!timeline.transformed)
					    {
						    frame.pivot.x -= originPivot.x;
						    frame.pivot.y -= originPivot.y;
					    }
					
					    if(prevFrame)
					    {
						    var dLX:number = frame.transform.skewX - prevFrame.transform.skewX;
						
						    if(prevFrame.tweenRotate)
						    {
							
							    if(prevFrame.tweenRotate > 0)
							    {
								    if(dLX < 0)
								    {
									    frame.transform.skewX += Math.PI * 2;
									    frame.transform.skewY += Math.PI * 2;
								    }
								
								    if(prevFrame.tweenRotate > 1)
								    {
									    frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate - 1);
									    frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate - 1);
								    }
							    }
							    else
							    {
								    if(dLX > 0)
								    {
									    frame.transform.skewX -= Math.PI * 2;
									    frame.transform.skewY -= Math.PI * 2;
								    }
								
								    if(prevFrame.tweenRotate < 1)
								    {
									    frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate + 1);
									    frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate + 1);
								    }
							    }
						    }
						    else
						    {
							    frame.transform.skewX = prevFrame.transform.skewX + TransformUtil.formatRadian(frame.transform.skewX - prevFrame.transform.skewX);
							    frame.transform.skewY = prevFrame.transform.skewY + TransformUtil.formatRadian(frame.transform.skewY - prevFrame.transform.skewY);
						    }
					    }
					
					    prevFrame = frame;
				    }
				    timeline.transformed = true;
			    }
            }
		
		    public static getTimelineTransform(timeline:objects.TransformTimeline, position:number, retult:objects.DBTransform):void
		    {
			    var frameList:Array<objects.Frame> = timeline.getFrameList();
			    var i:number = frameList.length;
			
			    var currentFrame:objects.TransformFrame;
			    var tweenEasing:number;
			    var progress:number;
			    var nextFrame:objects.TransformFrame;
			    while(i --)
			    {
				    currentFrame = <objects.TransformFrame> frameList[i];
				    if(currentFrame.position <= position && currentFrame.position + currentFrame.duration > position)
				    {
					    tweenEasing = currentFrame.tweenEasing;
					    if(i == frameList.length - 1 || isNaN(tweenEasing) || position == currentFrame.position)
					    {
						    retult.copy(currentFrame.global);
					    }
					    else
					    {
						    progress = (position - currentFrame.position) / currentFrame.duration;
						    if(tweenEasing)
						    {
							    //progress = animation.TimelineState.getEaseValue(progress, tweenEasing);
						    }
						
						    nextFrame = <objects.TransformFrame> frameList[i + 1];
						
						    retult.x = currentFrame.global.x +  (nextFrame.global.x - currentFrame.global.x) * progress;
						    retult.y = currentFrame.global.y +  (nextFrame.global.y - currentFrame.global.y) * progress;
						    retult.skewX = TransformUtil.formatRadian(currentFrame.global.skewX +  (nextFrame.global.skewX - currentFrame.global.skewX) * progress);
						    retult.skewY = TransformUtil.formatRadian(currentFrame.global.skewY +  (nextFrame.global.skewY - currentFrame.global.skewY) * progress);
						    retult.scaleX = currentFrame.global.scaleX +  (nextFrame.global.scaleX - currentFrame.global.scaleX) * progress;
						    retult.scaleY = currentFrame.global.scaleY +  (nextFrame.global.scaleY - currentFrame.global.scaleY) * progress;
					    }
					    break;
				    }
			    }
		    }
		
		    public static addHideTimeline(animationData:objects.AnimationData, armatureData:objects.ArmatureData):void
		    {
                var boneDataList: Array<objects.BoneData> = armatureData.getBoneDataList();
			    var i:number = boneDataList.length;
			
			    var boneData:objects.BoneData;
			    var boneName:string;
			    while(i --)
			    {
				    boneData = boneDataList[i];
				    boneName = boneData.name;
				    if(!animationData.getTimeline(boneName))
				    {
					    animationData.addTimeline(objects.TransformTimeline.HIDE_TIMELINE, boneName);
				    }
			    }
		    }
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
            var display: any = this._displayList[this._displayIndex];
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
            var display: any = this._displayList[this._displayIndex];
            if(display instanceof Armature)
            {
                return display;
            }
            return null;
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
                var displayIndexBackup: number = this._displayIndex;
                this._displayIndex = -1;
                this._changeDisplay(displayIndexBackup);
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

                    var display: any = this._displayList[this._displayIndex];
					if(display instanceof Armature)
					{
                        this._setDisplay((<Armature> display).display);
					}
					else
                    {
                        this._setDisplay(display);
                    }

                    if (this._dislayDataList && this._displayIndex <= this._dislayDataList.length) 
                    {
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
			
			/*if(childArmature)
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
			}*/
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
                    var child: DBObject = this._children[i];
                    if (child instanceof Slot) 
                    {
                        (<Slot> child)._updateVisible(this._visible);
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
			
			this._tweenPivot = new geom.Point(0, 0);
			
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
			
			if(child == this || (child instanceof Bone && (<Bone> child).contains(this)))
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
            /*if (frame)
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
			}*/
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
			
			//this.animation.dispose();
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
			//this.animation.advanceTime(passedTime);
			
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
					slot._displayBridge.addDisplay(this.display, -1);
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
			var helpArray:Array<any> = [];
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
				helpArray[i] = {level:level, bone:bone};
			}
			
			helpArray.sort(this.sortBone);
			
			i = helpArray.length;
			while(i --)
			{
				this._boneList[i] = helpArray[i].bone;
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
				/*if(animationState.isPlaying)
				{
					this.animation.gotoAndPlay(frame.action);
				}*/
			}
		}

        private sortSlot(slot1: Slot, slot2: Slot): number
		{
			return slot1.getZOrder() < slot2.getZOrder()?1: -1;
        }

        private sortBone(object1: any, object2: any): number
        {
            return object1.level < object2.level ? 1 : -1;
        }
    }
}