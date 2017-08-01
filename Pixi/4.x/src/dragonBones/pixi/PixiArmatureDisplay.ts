namespace dragonBones {
    /**
     * @inheritDoc
     */
    export class PixiArmatureDisplay extends PIXI.Container implements IArmatureProxy {
        private _disposeProxy: boolean = false;
        private _armature: Armature = null as any;
        private _debugDrawer: PIXI.Sprite | null = null;
        /**
         * @inheritDoc
         */
        public init(armature: Armature): void {
            this._armature = armature;
        }
        /**
         * @inheritDoc
         */
        public clear(): void {
            if (this._debugDrawer !== null) {
                this._debugDrawer.destroy(true);
            }

            this._disposeProxy = false;
            this._armature = null as any;
            this._debugDrawer = null;

            super.destroy();
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
        public destroy(): void {
            this.dispose();
        }
        /**
         * @private
         */
        public debugUpdate(isEnabled: boolean): void {
            if (isEnabled) {
                if (this._debugDrawer === null) {
                    this._debugDrawer = new PIXI.Sprite();
                    const boneDrawer = new PIXI.Graphics();
                    this._debugDrawer.addChild(boneDrawer);
                }

                this.addChild(this._debugDrawer);
                const boneDrawer = this._debugDrawer.getChildAt(0) as PIXI.Graphics;
                boneDrawer.clear();

                const bones = this._armature.getBones();
                for (let i = 0, l = bones.length; i < l; ++i) {
                    const bone = bones[i];
                    const boneLength = bone.boneData.length;
                    const startX = bone.globalTransformMatrix.tx;
                    const startY = bone.globalTransformMatrix.ty;
                    const endX = startX + bone.globalTransformMatrix.a * boneLength;
                    const endY = startY + bone.globalTransformMatrix.b * boneLength;

                    boneDrawer.lineStyle(2.0, 0x00FFFF, 0.7);
                    boneDrawer.moveTo(startX, startY);
                    boneDrawer.lineTo(endX, endY);
                    boneDrawer.lineStyle(0.0, 0, 0.0);
                    boneDrawer.beginFill(0x00FFFF, 0.7);
                    boneDrawer.drawCircle(startX, startY, 3.0);
                    boneDrawer.endFill();
                }

                const slots = this._armature.getSlots();
                for (let i = 0, l = slots.length; i < l; ++i) {
                    const slot = slots[i];
                    const boundingBoxData = slot.boundingBoxData;

                    if (boundingBoxData) {
                        let child = this._debugDrawer.getChildByName(slot.name) as PIXI.Graphics;
                        if (!child) {
                            child = new PIXI.Graphics();
                            child.name = slot.name;
                            this._debugDrawer.addChild(child);
                        }

                        child.clear();
                        child.beginFill(0xFF00FF, 0.3);

                        switch (boundingBoxData.type) {
                            case BoundingBoxType.Rectangle:
                                child.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;

                            case BoundingBoxType.Ellipse:
                                child.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;

                            case BoundingBoxType.Polygon:
                                const polygon = boundingBoxData as PolygonBoundingBoxData;
                                const vertices = polygon.vertices;
                                for (let i = 0, l = polygon.count; i < l; i += 2) {
                                    if (i === 0) {
                                        child.moveTo(vertices[i], vertices[i + 1]);
                                    }
                                    else {
                                        child.lineTo(vertices[i], vertices[i + 1]);
                                    }
                                }
                                break;

                            default:
                                break;
                        }

                        child.endFill();
                        slot.updateTransformAndMatrix();
                        slot.updateGlobalTransform();

                        const transform = slot.global;
                        child.setTransform(
                            transform.x, transform.y,
                            transform.scaleX, transform.scaleY,
                            transform.rotation,
                            transform.skew, 0.0,
                            slot._pivotX, slot._pivotY
                        );
                    }
                    else {
                        const child = this._debugDrawer.getChildByName(slot.name);
                        if (child) {
                            this._debugDrawer.removeChild(child);
                        }
                    }
                }
            }
            else if (this._debugDrawer && this._debugDrawer.parent === this) {
                this.removeChild(this._debugDrawer);
            }
        }
        /**
         * @private
         */
        public _dispatchEvent(type: EventStringType, eventObject: EventObject): void {
            this.emit(type, eventObject);
        }
        /**
         * @inheritDoc
         */
        public hasEvent(type: EventStringType): boolean {
            return this.listeners(type, true) as boolean; // .d.ts bug
        }
        /**
         * @inheritDoc
         */
        public addEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.addListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.removeListener(type, listener, target);
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
         * @deprecated
         * 已废弃，请参考 @see
         * @see dragonBones.Armature#clock
         * @see dragonBones.PixiFactory#clock
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        public advanceTimeBySelf(on: boolean): void {
            if (on) {
                this._armature.clock = PixiFactory.clock;
            }
            else {
                this._armature.clock = null;
            }
        }
    }
}