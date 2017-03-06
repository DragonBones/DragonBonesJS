namespace dragonBones {
    /**
     * @inheritDoc
     */
    export class PixiArmatureDisplay extends PIXI.Container implements IArmatureProxy {
        /**
         * @internal
         * @private
         */
        public _armature: Armature;
        private _debugDrawer: PIXI.Sprite;
        /**
         * @internal
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        public _onClear(): void {
            if (this._debugDrawer) {
                this._debugDrawer.destroy(true);
            }

            this._armature = null;
            this._debugDrawer = null;

            this.destroy();
        }
        /**
         * @private
         */
        public _dispatchEvent(type: EventStringType, eventObject: EventObject): void {
            this.emit(type, eventObject);
        }
        /**
         * @private
         */
        public _debugDraw(isEnabled: boolean): void {
            if (!this._debugDrawer) {
                this._debugDrawer = new PIXI.Sprite();
                const boneDrawer = new PIXI.Graphics();
                this._debugDrawer.addChild(boneDrawer);
            }

            if (isEnabled) {
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

                    boneDrawer.lineStyle(2, bone.ik ? 0xFF0000 : 0x00FFFF, 0.7);
                    boneDrawer.moveTo(startX, startY);
                    boneDrawer.lineTo(endX, endY);
                    boneDrawer.lineStyle(0, 0, 0);
                    boneDrawer.beginFill(0x00FFFF, 0.7);
                    boneDrawer.drawCircle(startX, startY, 3);
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
                                const vertices = boundingBoxData.vertices;
                                for (let i = 0, l = boundingBoxData.vertices.length; i < l; i += 2) {
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

                        slot._updateTransformAndMatrix();
                        slot.updateGlobalTransform();

                        const transform = slot.global;
                        child.setTransform(
                            transform.x, transform.y,
                            transform.scaleX, transform.scaleY,
                            transform.skewX,
                            0.0, transform.skewY - transform.skewX,
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
        public dispose(disposeProxy: boolean = true): void {
            if (this._armature) {
                this._armature.dispose();
                this._armature = null;
            }
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
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        public advanceTimeBySelf(on: boolean): void {
            if (on) {
                this._armature.clock = PixiFactory._clock;
            }
            else {
                this._armature.clock = null;
            }
        }
    }
}