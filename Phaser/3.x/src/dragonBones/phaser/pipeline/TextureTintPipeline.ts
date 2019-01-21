namespace dragonBones.phaser.pipeline {
    export class TextureTintPipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
        private _tempMatrix1: util.TransformMatrix;
        private _tempMatrix2: util.TransformMatrix;
        private _tempMatrix3: util.TransformMatrix;

        constructor(config: any) {
            super(config);
            this._tempMatrix1 = new util.TransformMatrix();
            this._tempMatrix2 = new util.TransformMatrix();
            this._tempMatrix3 = new util.TransformMatrix();
        }

        batchSprite(sprite: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, camera: Phaser.Cameras.Scene2D.Camera, parentTransformMatrix: Phaser.GameObjects.Components.TransformMatrix): void {
            this.renderer.setPipeline(this);

            const camMatrix = this._tempMatrix1;
            const spriteMatrix = this._tempMatrix2;
            const calcMatrix = this._tempMatrix3;

            const frame = sprite.frame;
            const texture = frame.glTexture;

            let u0 = frame.u0;
            let v0 = frame.v0;
            let u1 = frame.u1;
            let v1 = frame.v1;
            let frameX = frame.x;
            let frameY = frame.y;
            let frameWidth = frame.width;
            let frameHeight = frame.height;

            let x = -sprite.displayOriginX + frameX;
            let y = -sprite.displayOriginY + frameY;

            if (sprite.isCropped) {
                const crop = sprite["_crop"];

                if (crop.flipX !== sprite.flipX || crop.flipY !== sprite.flipY)
                    frame.updateCropUVs(crop, sprite.flipX, sprite.flipY);

                u0 = crop.u0;
                v0 = crop.v0;
                u1 = crop.u1;
                v1 = crop.v1;

                frameWidth = crop.width;
                frameHeight = crop.height;

                frameX = crop.x;
                frameY = crop.y;

                x = -sprite.displayOriginX + frameX;
                y = -sprite.displayOriginY + frameY;
            }

            if (sprite.flipX) {
                x += frameWidth;
                frameWidth *= -1;
            }

            if (sprite.flipY) {
                y += frameHeight;
                frameHeight *= -1;
            }

            const xw = x + frameWidth;
            const yh = y + frameHeight;

            spriteMatrix.applyITRSC(sprite.x, sprite.y, sprite.rotation, sprite.scaleX, sprite.scaleY, sprite["skewX"] || 0, sprite["skewY"] || 0);

            camMatrix.copyFrom(camera["matrix"]);

            if (parentTransformMatrix) {
                //  Multiply the camera by the parent matrix
                camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * sprite.scrollFactorX, -camera.scrollY * sprite.scrollFactorY);

                //  Undo the camera scroll
                spriteMatrix.e = sprite.x;
                spriteMatrix.f = sprite.y;

                //  Multiply by the Sprite matrix, store result in calcMatrix
                camMatrix.multiply(spriteMatrix, calcMatrix);
            } else {
                spriteMatrix.e -= camera.scrollX * sprite.scrollFactorX;
                spriteMatrix.f -= camera.scrollY * sprite.scrollFactorY;

                //  Multiply by the Sprite matrix, store result in calcMatrix
                camMatrix.multiply(spriteMatrix, calcMatrix);
            }

            let tx0 = calcMatrix.getX(x, y);
            let ty0 = calcMatrix.getY(x, y);

            let tx1 = calcMatrix.getX(x, yh);
            let ty1 = calcMatrix.getY(x, yh);

            let tx2 = calcMatrix.getX(xw, yh);
            let ty2 = calcMatrix.getY(xw, yh);

            let tx3 = calcMatrix.getX(xw, y);
            let ty3 = calcMatrix.getY(xw, y);

            const tintTL = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha(sprite["_tintTL"], camera.alpha * sprite["_alphaTL"]);
            const tintTR = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha(sprite["_tintTR"], camera.alpha * sprite["_alphaTR"]);
            const tintBL = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha(sprite["_tintBL"], camera.alpha * sprite["_alphaBL"]);
            const tintBR = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha(sprite["_tintBR"], camera.alpha * sprite["_alphaBR"]);

            if (camera.roundPixels) {
                tx0 |= 0;
                ty0 |= 0;

                tx1 |= 0;
                ty1 |= 0;

                tx2 |= 0;
                ty2 |= 0;

                tx3 |= 0;
                ty3 |= 0;
            }

            this.setTexture2D(texture, 0);

            const tintEffect = (sprite["_isTinted"] && sprite.tintFill);

            this.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
        }
    }
}
