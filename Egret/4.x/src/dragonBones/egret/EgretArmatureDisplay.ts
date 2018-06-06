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
     * - The egret event.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - Egret 事件。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    export class EgretEvent extends egret.Event {
        /**
         * - The event object.
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 事件对象。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get eventObject(): EventObject {
            return this.data;
        }
    }
    /**
     * @inheritDoc
     */
    export class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureProxy {
        private static _cleanBeforeRender(): void { }
        /**
         * @private
         */
        public debugDraw: boolean = false;
        /**
         * @internal
         */
        public _batchEnabled: boolean = !(global["nativeRender"] || global["bricks"]); //
        /**
         * @internal
         */
        public _childDirty: boolean = true;
        private _debugDraw: boolean = false;
        private _armature: Armature = null as any; //
        private _bounds: egret.Rectangle | null = null;
        private _debugDrawer: egret.Sprite | null = null;
        /**
         * @inheritDoc
         */
        public dbInit(armature: Armature): void {
            this._armature = armature;

            if (this._batchEnabled) {
                this.$renderNode = new egret.sys.GroupNode();
                this.$renderNode.cleanBeforeRender = EgretArmatureDisplay._cleanBeforeRender;
            }
        }
        /**
         * @inheritDoc
         */
        public dbClear(): void {
            this._armature = null as any;
            this._bounds = null;
            this._debugDrawer = null;
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
                        this._debugDrawer = new egret.Sprite();
                    }

                    if (this._debugDrawer.parent !== this) {
                        this.addChild(this._debugDrawer);
                    }

                    const boneStep = 2.0;
                    const graphics = this._debugDrawer.graphics;
                    graphics.clear();

                    for (const bone of this._armature.getBones()) {
                        if (bone.boneData.type === BoneType.Bone) {
                            const boneLength = Math.max(bone.boneData.length, boneStep);
                            const startX = bone.globalTransformMatrix.tx;
                            const startY = bone.globalTransformMatrix.ty;
                            const aX = startX - bone.globalTransformMatrix.a * boneStep;
                            const aY = startY - bone.globalTransformMatrix.b * boneStep;
                            const bX = startX + bone.globalTransformMatrix.a * boneLength;
                            const bY = startY + bone.globalTransformMatrix.b * boneLength;
                            const cX = startX + aY - startY;
                            const cY = startY + aX - startX;
                            const dX = startX - aY + startY;
                            const dY = startY - aX + startX;
                            //
                            graphics.lineStyle(2.0, 0x00FFFF, 0.7);
                            graphics.moveTo(aX, aY);
                            graphics.lineTo(bX, bY);
                            graphics.moveTo(cX, cY);
                            graphics.lineTo(dX, dY);
                        }
                        else {
                            const surface = bone as Surface;
                            const surfaceData = surface._boneData as SurfaceData;
                            const segmentX = surfaceData.segmentX;
                            const segmentY = surfaceData.segmentY;
                            const vertices = surface._vertices;
                            graphics.lineStyle(2.0, 0xFFFF00, 0.3);

                            for (let iY = 0; iY < segmentY; ++iY) {
                                for (let iX = 0; iX < segmentX; ++iX) {
                                    const vertexIndex = (iX + iY * (segmentX + 1)) * 2;
                                    const x = vertices[vertexIndex];
                                    const y = vertices[vertexIndex + 1];
                                    graphics.moveTo(x, y);
                                    graphics.lineTo(vertices[vertexIndex + 2], vertices[vertexIndex + 3]);
                                    graphics.moveTo(x, y);
                                    graphics.lineTo(vertices[vertexIndex + (segmentX + 1) * 2], vertices[vertexIndex + (segmentX + 1) * 2 + 1]);

                                    if (iX === segmentX - 1) {
                                        graphics.moveTo(vertices[vertexIndex + 2], vertices[vertexIndex + 3]);
                                        graphics.lineTo(vertices[vertexIndex + (segmentX + 2) * 2], vertices[vertexIndex + (segmentX + 2) * 2 + 1]);
                                    }

                                    if (iY === segmentY - 1) {
                                        graphics.moveTo(vertices[vertexIndex + (segmentX + 1) * 2], vertices[vertexIndex + (segmentX + 1) * 2 + 1]);
                                        graphics.lineTo(vertices[vertexIndex + (segmentX + 2) * 2], vertices[vertexIndex + (segmentX + 2) * 2 + 1]);
                                    }
                                }
                            }
                        }
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
                            child.graphics.lineStyle(2.0, 0xFF00FF, 0.7);

                            switch (boundingBoxData.type) {
                                case BoundingBoxType.Rectangle:
                                    child.graphics.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Ellipse:
                                    child.graphics.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                    break;

                                case BoundingBoxType.Polygon:
                                    const vertices = (boundingBoxData as PolygonBoundingBoxData).vertices;
                                    for (let i = 0; i < vertices.length; i += 2) {
                                        const x = vertices[i];
                                        const y = vertices[i + 1];

                                        if (i === 0) {
                                            child.graphics.moveTo(x, y);
                                        }
                                        else {
                                            child.graphics.lineTo(x, y);
                                        }
                                    }

                                    child.graphics.lineTo(vertices[0], vertices[1]);
                                    break;

                                default:
                                    break;
                            }

                            slot.updateTransformAndMatrix();
                            slot.updateGlobalTransform();
                            child.$setMatrix((slot.globalTransformMatrix as any) as egret.Matrix, false);
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

            if (!isV5 && this._batchEnabled && this._childDirty) {
                (this as any).$invalidateContentBounds();
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
        public dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            const event = egret.Event.create(EgretEvent, type);
            event.data = eventObject;
            super.dispatchEvent(event);
            egret.Event.release(event);
        }
        /**
         * @inheritDoc
         */
        public hasDBEventListener(type: EventStringType): boolean {
            return this.hasEventListener(type);
        }
        /**
         * @inheritDoc
         */
        public addDBEventListener(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.addEventListener(type, listener, target);
        }
        /**
         * @inheritDoc
         */
        public removeDBEventListener(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void {
            this.removeEventListener(type, listener, target);
        }
        /**
         * - Disable the batch.
         * Batch rendering for performance reasons, the boundary properties of the render object are not updated.
         * This will not correctly obtain the wide-height properties of the rendered object and the transformation properties of its internal display objects,
         * which can turn off batch rendering if you need to use these properties.
         * @version DragonBones 5.1
         * @language en_US
         */
        /**
         * - 关闭批次渲染。
         * 批次渲染出于性能考虑，不会更新渲染对象的边界属性。
         * 这样将无法正确获得渲染对象的宽高属性以及其内部显示对象的变换属性，如果需要使用这些属性，可以关闭批次渲染。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        public disableBatch(): void {
            if (!this._batchEnabled || !this._armature) {
                return;
            }

            for (const slot of this._armature.getSlots()) {
                // (slot as EgretSlot).transformUpdateEnabled = true;
                let display = (slot._geometryData ? slot.meshDisplay : slot.rawDisplay) as (egret.Mesh | egret.Bitmap);
                if (!slot.display && display === slot.meshDisplay) {
                    display = slot.rawDisplay;
                }

                const node = display.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode);

                // Transform.
                if (node.matrix) {
                    display.$setMatrix(slot.globalTransformMatrix as any, false);
                }

                // Color.
                node.alpha = 1.0;
                node.filter = null as any;

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
        $measureContentBounds(bounds: egret.Rectangle): void {
            if (this._batchEnabled && this._armature) {
                if (this._childDirty) {
                    this._childDirty = false;

                    let isFirst = true;
                    const helpRectangle = new egret.Rectangle();

                    for (const slot of this._armature.getSlots()) {
                        const display = slot.display;
                        if (!display || !display.$renderNode || !display.$renderNode.image) {
                            continue;
                        }

                        const matrix = (display.$renderNode as (egret.sys.BitmapNode | egret.sys.MeshNode)).matrix;

                        if (display === slot.meshDisplay) {
                            const vertices = ((display as egret.Mesh).$renderNode as egret.sys.MeshNode).vertices;

                            if (vertices && vertices.length > 0) {
                                helpRectangle.setTo(999999.0, 999999.0, -999999.0, -999999.0);

                                for (let i = 0, l = vertices.length; i < l; i += 2) {
                                    const x = vertices[i];
                                    const y = vertices[i + 1];
                                    if (helpRectangle.x > x) helpRectangle.x = x;
                                    if (helpRectangle.width < x) helpRectangle.width = x;
                                    if (helpRectangle.y > y) helpRectangle.y = y;
                                    if (helpRectangle.height < y) helpRectangle.height = y;
                                }
                                helpRectangle.width -= helpRectangle.x;
                                helpRectangle.height -= helpRectangle.y;
                            }
                            else {
                                continue;
                            }
                        }
                        else if (slot._displayFrame) {
                            const textureData = slot._displayFrame.getTextureData();
                            if (textureData) {
                                const scale = textureData.parent.scale;
                                helpRectangle.x = 0;
                                helpRectangle.y = 0;
                                helpRectangle.width = textureData.region.width * scale;
                                helpRectangle.height = textureData.region.height * scale;
                            }
                            else {
                                continue;
                            }
                        }

                        matrix.$transformBounds(helpRectangle);

                        const left = helpRectangle.x;
                        const top = helpRectangle.y;
                        const right = helpRectangle.x + helpRectangle.width;
                        const bottom = helpRectangle.y + helpRectangle.height;

                        if (isFirst) {
                            isFirst = false;
                            bounds.x = left;
                            bounds.y = top;
                            bounds.width = right;
                            bounds.height = bottom;
                        }
                        else {
                            if (left < bounds.x) {
                                bounds.x = left;
                            }

                            if (top < bounds.y) {
                                bounds.y = top;
                            }

                            if (right > bounds.width) {
                                bounds.width = right;
                            }

                            if (bottom > bounds.height) {
                                bounds.height = bottom;
                            }
                        }
                    }

                    bounds.width -= bounds.x;
                    bounds.height -= bounds.y;

                    if (isV5) {
                        if (this._bounds === null) {
                            this._bounds = new egret.Rectangle();
                        }

                        this._bounds.copyFrom(bounds);
                    }
                }
                else if (isV5) {
                    if (this._bounds === null) {
                        this._bounds = new egret.Rectangle();
                    }

                    bounds.copyFrom(this._bounds);
                }

                return bounds as any; // V5
            }

            return super.$measureContentBounds(bounds) as any; // V5
        }
    }
}