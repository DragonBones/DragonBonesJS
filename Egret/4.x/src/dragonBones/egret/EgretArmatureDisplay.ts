namespace dragonBones {
    /**
     * Egret 事件。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export class EgretEvent extends egret.Event {
        /**
         * 事件对象。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get eventObject(): EventObject {
            return this.data;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        public get animationName(): string {
            const animationState = this.eventObject.animationState;
            return animationState !== null ? animationState.name : "";
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#armature
         */
        public get armature(): Armature {
            return this.eventObject.armature;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#bone
         */
        public get bone(): Bone | null {
            return this.eventObject.bone;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#slot
         */
        public get slot(): Slot | null {
            return this.eventObject.slot;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        public get animationState(): AnimationState | null {
            return this.eventObject.animationState;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject#name
         */
        public get frameLabel(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject#name
         */
        public get sound(): string {
            return this.eventObject.name;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see #animationName
         */
        public get movementID(): string {
            return this.animationName;
        }
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.START
         */
        public static START: string = EventObject.START;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        public static LOOP_COMPLETE: string = EventObject.LOOP_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.COMPLETE
         */
        public static COMPLETE: string = EventObject.COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_IN
         */
        public static FADE_IN: string = EventObject.FADE_IN;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        public static FADE_IN_COMPLETE: string = EventObject.FADE_IN_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_OUT
         */
        public static FADE_OUT: string = EventObject.FADE_OUT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        public static FADE_OUT_COMPLETE: string = EventObject.FADE_OUT_COMPLETE;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND_EVENT: string = EventObject.SOUND_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static ANIMATION_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static BONE_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        public static MOVEMENT_FRAME_EVENT: string = EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        public static SOUND: string = EventObject.SOUND_EVENT;
    }
    /**
     * @inheritDoc
     */
    export class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureProxy {
        private static _cleanBeforeRender(): void { }
        /**
         * @internal
         * @private
         */
        public _batchEnabled: boolean = true;
        /**
         * @internal
         * @private
         */
        public _childTransformDirty: boolean = false;
        private _debugDraw: boolean = false;
        private _disposeProxy: boolean = false;
        private _armature: Armature = null as any; //
        private _debugDrawer: egret.Sprite | null = null;
        /**
         * @inheritDoc
         */
        public dbInit(armature: Armature): void {
            this._armature = armature;

            //
            this.$renderNode = new egret.sys.GroupNode();
            this.$renderNode.cleanBeforeRender = EgretArmatureDisplay._cleanBeforeRender;
        }
        /**
         * @inheritDoc
         */
        public dbClear(): void {
            this._disposeProxy = false;
            this._armature = null as any;
            this._debugDrawer = null;
        }
        /**
         * @inheritDoc
         */
        public dbUpdate(): void {
            const drawed = DragonBones.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
                if (this._debugDraw) {
                    if (this._debugDrawer === null) {
                        this._debugDrawer = new egret.Sprite();
                    }

                    this.addChild(this._debugDrawer);
                    this._debugDrawer.graphics.clear();

                    for (const bone of this._armature.getBones()) {
                        const boneLength = bone.boneData.length;
                        const startX = bone.globalTransformMatrix.tx;
                        const startY = bone.globalTransformMatrix.ty;
                        const endX = startX + bone.globalTransformMatrix.a * boneLength;
                        const endY = startY + bone.globalTransformMatrix.b * boneLength;

                        this._debugDrawer.graphics.lineStyle(2.0, 0x00FFFF, 0.7);
                        this._debugDrawer.graphics.moveTo(startX, startY);
                        this._debugDrawer.graphics.lineTo(endX, endY);
                        this._debugDrawer.graphics.lineStyle(0.0, 0, 0.0);
                        this._debugDrawer.graphics.beginFill(0x00FFFF, 0.7);
                        this._debugDrawer.graphics.drawCircle(startX, startY, 3.0);
                        this._debugDrawer.graphics.endFill();
                    }

                    for (const slot of this._armature.getSlots()) {
                        const boundingBoxData = slot.boundingBoxData;

                        if (boundingBoxData !== null) {
                            let child = this._debugDrawer.getChildByName(slot.name) as egret.Shape;
                            if (child === null) {
                                child = new egret.Shape();
                                child.name = slot.name;
                                this._debugDrawer.addChild(child);
                            }

                            child.graphics.clear();
                            child.graphics.beginFill(boundingBoxData.color ? boundingBoxData.color : 0xFF00FF, 0.3);

                            switch (boundingBoxData.type) {
                                case BoundingBoxType.Rectangle:
                                    child.graphics.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Ellipse:
                                    child.graphics.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Polygon:
                                    const polygon = boundingBoxData as PolygonBoundingBoxData;
                                    const vertices = polygon.vertices;
                                    for (let j = 0; j < polygon.count; j += 2) {
                                        if (j === 0) {
                                            child.graphics.moveTo(vertices[polygon.offset + j], vertices[polygon.offset + j + 1]);
                                        }
                                        else {
                                            child.graphics.lineTo(vertices[polygon.offset + j], vertices[polygon.offset + j + 1]);
                                        }
                                    }
                                    break;

                                default:
                                    break;
                            }

                            child.graphics.endFill();
                            slot.updateTransformAndMatrix();
                            slot.updateGlobalTransform();
                            child.$setMatrix((slot.globalTransformMatrix as any) as egret.Matrix, true);
                        }
                        else {
                            const child = this._debugDrawer.getChildByName(slot.name);
                            if (child !== null) {
                                this._debugDrawer.removeChild(child);
                            }
                        }
                    }
                }
                else if (this._debugDrawer !== null && this._debugDrawer.parent === this) {
                    this.removeChild(this._debugDrawer);
                }
            }

            if (this._batchEnabled && this._childTransformDirty && this.stage && this.stage.dirtyRegionPolicy === egret.DirtyRegionPolicy.ON) {
                this.$invalidateContentBounds();
            }
        }
        /**
         * @inheritDoc
         */
        public dispose(disposeProxy: boolean = true): void {
            this._disposeProxy = disposeProxy;

            if (this._armature !== null) {
                this._armature.dispose();
                this._armature = null as any;
            }
        }
        /**
         * @inheritDoc
         */
        public _dispatchEvent(type: EventStringType, eventObject: EventObject): void {
            const event = egret.Event.create(EgretEvent, type);
            event.data = eventObject;
            super.dispatchEvent(event);
            egret.Event.release(event);
        }
        /**
         * @inheritDoc
         */
        public hasEvent(type: EventStringType): boolean {
            return this.hasEventListener(type);
        }
        /**
         * @inheritDoc
         */
        public addEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.addEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.removeEventListener(type, listener, target);
        }
        /**
         * 关闭批次渲染。（批次渲染出于性能考虑，不会更新渲染对象的边界属性，这样将无法正确获得渲染对象的宽高属性以及其内部显示对象的变换属性，如果需要使用这些属性，可以关闭批次渲染）
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public disableBatch(): void {
            for (const slot of this._armature.getSlots()) {
                // (slot as EgretSlot).transformUpdateEnabled = true;
                const display = (slot._meshData ? slot.meshDisplay : slot.rawDisplay) as (egret.Mesh | egret.Bitmap);
                const node = display.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode);

                // Transform.
                if (node.matrix) {
                    display.$setMatrix(slot.globalTransformMatrix as any, false);
                }

                // ZOrder.
                this.addChild(display);
            }

            this._batchEnabled = false;
            this.$renderNode.cleanBeforeRender = null as any;
            this.$renderNode = null as any;
            this.armature.invalidUpdate(null, true);
        }
        /**
         * @inheritDoc
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * @inheritDoc
         */
        public get animation(): Animation {
            return this._armature.animation;
        }
        /**
         * @inheritDoc
         */
        public $getWidth(): number {
            if (this._batchEnabled) {
                const bounds = (this.$DisplayObject as any)[10] as egret.Rectangle;
                this.$measureContentBounds(bounds);

                return bounds.width;
            }

            return super.$getWidth();
        }
        /**
         * @inheritDoc
         */
        public $getHeight(): number {
            if (this._batchEnabled) {
                const bounds = (this.$DisplayObject as any)[10] as egret.Rectangle;
                this.$measureContentBounds(bounds);

                return bounds.height;
            }

            return super.$getHeight();
        }
        /**
         * @inheritDoc
         */
        $hitTest(stageX: number, stageY: number): egret.DisplayObject {
            if (this._batchEnabled && this._childTransformDirty && this.stage && this.stage.dirtyRegionPolicy === egret.DirtyRegionPolicy.OFF) {
                this.$invalidateContentBounds();
            }

            return super.$hitTest(stageX, stageY);
        }
        /**
         * @inheritDoc
         */
        $measureContentBounds(bounds: egret.Rectangle): void {
            if (this._batchEnabled) {
                if (this._childTransformDirty) {
                    this._childTransformDirty = false;
                    let isFirst = true;
                    const helpRectangle = new egret.Rectangle();
                    for (const slot of this._armature.getSlots()) {
                        const display = (slot.display || slot.rawDisplay) as (egret.Mesh | egret.Bitmap);
                        const node = display.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode);
                        const matrix = node.matrix = node.matrix || new egret.Matrix();
                        helpRectangle.x = 0;
                        helpRectangle.y = 0;
                        if (slot.displayIndex >= 0 && slot.displayIndex < slot._displayDatas.length) {
                            const displayData = slot._displayDatas[slot.displayIndex];
                            if (displayData && displayData instanceof ImageDisplayData && displayData.texture) {
                                helpRectangle.width = displayData.texture.region.width;
                                helpRectangle.height = displayData.texture.region.height;
                            }
                            else {
                                helpRectangle.width = 0;
                                helpRectangle.height = 0;
                            }
                        }
                        else {
                            helpRectangle.width = 0;
                            helpRectangle.height = 0;
                        }

                        matrix.$transformBounds(helpRectangle);

                        if (isFirst) {
                            isFirst = false;
                            bounds.x = helpRectangle.x;
                            bounds.width = helpRectangle.x + helpRectangle.width;
                            bounds.y = helpRectangle.y;
                            bounds.height = helpRectangle.y + helpRectangle.height;
                        }
                        else {
                            bounds.x = Math.min(bounds.x, helpRectangle.x);
                            bounds.width = Math.max(bounds.width, helpRectangle.x + helpRectangle.width);
                            bounds.y = Math.min(bounds.y, helpRectangle.y);
                            bounds.height = Math.max(bounds.height, helpRectangle.y + helpRectangle.height);
                        }
                    }

                    bounds.width -= bounds.x;
                    bounds.height -= bounds.y;
                }

                return;
            }

            super.$measureContentBounds(bounds);
        }

        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.Armature#clock
         * @see dragonBones.EgretFactory#clock
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        public advanceTimeBySelf(on: boolean): void {
            if (on) {
                this._armature.clock = EgretFactory.clock;
            }
            else {
                this._armature.clock = null;
            }
        }
    }

    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Armature
     */
    export type FastArmature = Armature;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Bone
     */
    export type FastBone = Bone;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Slot
     */
    export type FastSlot = Slot;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Animation
     */
    export type FastAnimation = Animation;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.AnimationState
     */
    export type FastAnimationState = AnimationState;
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class Event extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class ArmatureEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class AnimationEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class FrameEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretEvent
     */
    export class SoundEvent extends EgretEvent { }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.BaseFacory#parseTextureAtlasData()
     */
    export class EgretTextureAtlas extends EgretTextureAtlasData {
        /**
         * @private
         */
        public static toString(): string {
            return "[class dragonBones.EgretTextureAtlas]";
        }

        public constructor(texture: egret.Texture, rawData: any, scale: number = 1) {
            super();
            console.warn("已废弃，请参考 @see");

            this._onClear();

            ObjectDataParser.getInstance().parseTextureAtlasData(rawData, this, scale);
            this.renderTexture = texture;
        }
    }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretTextureAtlasData
     */
    export class EgretSheetAtlas extends EgretTextureAtlas {
    }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.EgretFactory#soundEventManager
     */
    export class SoundEventManager {
        /**
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.EgretFactory#soundEventManager
         */
        public static getInstance(): EgretArmatureDisplay {
            console.warn("已废弃，请参考 @see");
            return EgretFactory.factory.soundEventManager;
        }
    }
    /**
     * @deprecated
     * 已废弃，请参考 @see
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    export class AnimationCacheManager {
        public constructor() {
            console.warn("已废弃，请参考 @see");
        }
    }
}