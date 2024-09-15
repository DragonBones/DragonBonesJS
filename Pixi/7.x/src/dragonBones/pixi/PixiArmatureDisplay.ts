/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

namespace dragonBones {
    /**
     * @inheritDoc
     */
    export class PixiArmatureDisplay extends PIXI.Sprite implements IArmatureProxy {
        /**
         * @private
         */
        public debugDraw: boolean = false;
        private _debugDraw: boolean = false;
        // private _disposeProxy: boolean = false;
        private _armature: Armature = null as any;
        private _debugDrawer: PIXI.Sprite | null = null;
        /**
         * @inheritDoc
         */
        public dbInit(armature: Armature): void {
            this._armature = armature;
        }
        /**
         * @inheritDoc
         */
        public dbClear(): void {
            if (this._debugDrawer !== null) {
                this._debugDrawer.destroy(true);
            }

            this._armature = null as any;
            this._debugDrawer = null;

            super.destroy();
        }
        /**
         * @inheritDoc
         */
        public dbUpdate(): void {
            const drawed = DragonBones.debugDraw || this.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
                if (this._debugDraw) {
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
                            child.lineStyle(2.0, 0xFF00FF, 0.7);

                            switch (boundingBoxData.type) {
                                case BoundingBoxType.Rectangle:
                                    child.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Ellipse:
                                    child.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Polygon:
                                    const vertices = (boundingBoxData as PolygonBoundingBoxData).vertices;
                                    for (let i = 0, l = vertices.length; i < l; i += 2) {
                                        const x = vertices[i];
                                        const y = vertices[i + 1];

                                        if (i === 0) {
                                            child.moveTo(x, y);
                                        }
                                        else {
                                            child.lineTo(x, y);
                                        }
                                    }

                                    child.lineTo(vertices[0], vertices[1]);
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
                else if (this._debugDrawer !== null && this._debugDrawer.parent === this) {
                    this.removeChild(this._debugDrawer);
                }
            }
        }
        /**
         * @inheritDoc
         */
        public dispose(disposeProxy: boolean = true): void {
            // tslint:disable-next-line:no-unused-expression
            disposeProxy;
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
        public dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            this.emit(type, eventObject);
        }
        /**
         * @inheritDoc
         */
        public hasDBEventListener(type: EventStringType): boolean {
            return this.listeners(type, true) as boolean; // .d.ts bug
        }
        /**
         * @inheritDoc
         */
        public addDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.addListener(type as any, listener as any, target);
        }
        /**
         * @inheritDoc
         */
        public removeDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
            this.removeListener(type as any, listener as any, target);
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
    }
}