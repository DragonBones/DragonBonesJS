namespace dragonBones.phaser.display {
    export class ArmatureDisplay extends DisplayContainer implements IArmatureProxy {
        debugDraw = false;
        private _armature: Armature;

        constructor(scene: Phaser.Scene) {
            super(scene);
        }

        dbInit(armature: Armature): void {
            this._armature = armature;
        }

        dbClear(): void {
            this.removeAllListeners();
            if (this._armature)
                this._armature.dispose();
            this._armature = null;
        }

        dbUpdate(): void {
            // TODO: draw debug graphics
            if (this.debugDraw) {
            }
        }

        dispose(disposeProxy: boolean): void {
            this.dbClear();
            if (disposeProxy === true)
                super.destroy();
        }

        destroy(): void {
            this.dispose(true);
        }

        dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
            this.emit(type, eventObject);
        }

        hasDBEventListener(type: EventStringType): boolean {
            return this.listenerCount(type) > 0;
        }

        addDBEventListener(type: EventStringType, listener: (event: EventObject) => void, scope?: any): void {
            this.on(type, listener, scope);
        }

        removeDBEventListener(type: EventStringType, listener: (event: EventObject) => void, scope?: any): void {
            this.off(type, listener, scope);
        }

        get armature(): Armature {
            return this._armature;
        }

        get animation(): Animation {
            return this._armature.animation;
        }

        getBounds(output?: Phaser.Geom.Rectangle):Phaser.Geom.Rectangle {
            if (output === undefined) { output = new Phaser.Geom.Rectangle(); }

            const helpRectangle = new Phaser.Geom.Rectangle();
            const matrix = this.getBoundsTransformMatrix();

            let isFirst = true;

            for (const slot of this._armature.getSlots()) {
                const display = slot.display;
                if (!display) {
                    continue;
                }

                if (display === slot.meshDisplay) {
                    const vertices = (display as SlotMesh).fakeVertices;

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
                        helpRectangle.width = textureData.region.width * scale;
                        helpRectangle.height = textureData.region.height * scale;

                        helpRectangle.x = -helpRectangle.width / 2;
                        helpRectangle.y = -helpRectangle.height / 2;
                    }
                    else {
                        continue;
                    }
                }

                helpRectangle.width *= this.scaleX;
                helpRectangle.height *= this.scaleY;

                matrix.transformPoint(helpRectangle.x, helpRectangle.y, helpRectangle);

                if(isFirst){
                    output.x = helpRectangle.x;
                    output.y = helpRectangle.y;
                    output.width = helpRectangle.width;
                    output.height = helpRectangle.height;
                    isFirst = false;
                }else{
                    Phaser.Geom.Rectangle.Union(helpRectangle, output, output);
                }
            }


            return output;
        }
    }
}
