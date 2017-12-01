/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2017 DragonBones team and other contributors
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
     * @internal
     * @private
     */
    export class Surface extends Bone {
        public static toString(): string {
            return "[class dragonBones.Surface]";
        }

        private _dX: number;
        private _dY: number;
        private _k: number;
        /**
         * @internal
         * @private
         */
        public readonly _vertices: Array<number> = [];
        /**
         * @internal
         * @private
         */
        public readonly _animationVertices: Array<number> = [];

        private readonly _matrices: Array<number> = [];
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this._dX = 0.0;
            this._dY = 0.0;
            this._k = 0.0;
            this._vertices.length = 0;
            this._animationVertices.length = 0;
            this._matrices.length = 0;
        }

        private _getAffineTransform(
            x: number, y: number, lX: number, lY: number,
            aX: number, aY: number, bX: number, bY: number, cX: number, cY: number,
            transform: Transform, r: boolean
        ): Transform {
            const dabX = bX - aX;
            const dabY = bY - aY;
            const dacX = cX - aX;
            const dacY = cY - aY;

            transform.x = aX - x;
            transform.y = aY - y;
            transform.rotation = Math.atan2(dabY, dabX);

            if (r) {
                transform.rotation += Math.PI;
            }

            transform.skew = Math.atan2(dacY, dacX) - Math.PI * 0.5 - transform.rotation;
            transform.scaleX = Math.sqrt(dabX * dabX + dabY * dabY) / lX;
            transform.scaleY = Math.sqrt(dacX * dacX + dacY * dacY) / lY;

            return transform;
        }

        public _getMatrix(x: number, y: number): Matrix {
            const surfaceData = this._boneData as SurfaceData;
            const segmentXD = surfaceData.segmentX * 2;
            const ll = 1000.0;
            const l = 200.0;

            if (x < -ll || ll < x || y < -ll || ll < y) {
                return this.globalTransformMatrix;
            }

            if (x < -l) { // TODO
            }
            else if (x > l) {
            }

            if (y < -l) { // TODO
            }
            else if (y > l) {
            }

            const dX = this._dX;
            const dY = this._dY;
            const indexX = Math.floor((x + l) / dX);
            const indexY = Math.floor((y + l) / dY);
            let pX = indexX * dX - l;
            let pY = indexY * dY - l;
            const isDown = y > this._k * x + pY + dY;
            const matrixIndex = (indexX * indexY * 2 + (isDown ? 1 : 0)) * 7;
            const matrices = this._matrices;
            const helpMatrix = Surface._helpMatrix;

            if (this._matrices[matrixIndex] > 0.0) {
                helpMatrix.copyFromArray(matrices, matrixIndex + 1);
            }
            else {
                const vertexIndex = indexX * 2 + indexY * (segmentXD + 2);
                let aX = 0.0;
                let aY = 0.0;
                let bX = 0.0;
                let bY = 0.0;
                let cX = 0.0;
                let cY = 0.0;
                const vertices = this._vertices;

                if (isDown) {
                    pX += dX;
                    pY += dY;

                    aX = vertices[vertexIndex + segmentXD + 4];
                    aY = vertices[vertexIndex + segmentXD + 5];
                    bX = vertices[vertexIndex + 2];
                    bY = vertices[vertexIndex + 3];
                    cX = vertices[vertexIndex + segmentXD + 2];
                    cY = vertices[vertexIndex + segmentXD + 3];
                }
                else {
                    aX = vertices[vertexIndex];
                    aY = vertices[vertexIndex + 1];
                    bX = vertices[vertexIndex + 2];
                    bY = vertices[vertexIndex + 3];
                    cX = vertices[vertexIndex + segmentXD + 2];
                    cY = vertices[vertexIndex + segmentXD + 3];
                }

                this._getAffineTransform(pX, pY, dX, dY, aX, aY, bX, bY, cX, cY, Surface._helpTransform, isDown).toMatrix(helpMatrix);
                matrices[matrixIndex] = 1.0;
                matrices[matrixIndex + 1] = helpMatrix.a;
                matrices[matrixIndex + 2] = helpMatrix.b;
                matrices[matrixIndex + 3] = helpMatrix.c;
                matrices[matrixIndex + 4] = helpMatrix.d;
                matrices[matrixIndex + 5] = helpMatrix.tx;
                matrices[matrixIndex + 6] = helpMatrix.ty;
            }

            return helpMatrix;
        }

        public init(surfaceData: SurfaceData): void {
            if (this._boneData !== null) {
                return;
            }

            super.init(surfaceData);

            const segmentX = surfaceData.segmentX;
            const segmentY = surfaceData.segmentY;
            const vertexCount = surfaceData.vertices.length;
            //
            this._dX = 200.0 * 2.0 / segmentX;
            this._dY = 200.0 * 2.0 / segmentY;
            this._k = -this._dY / this._dX;
            this._vertices.length = vertexCount;
            this._animationVertices.length = vertexCount;
            this._matrices.length = segmentX * segmentY * 2 * 7;

            for (let i = 0; i < vertexCount; ++i) {
                this._animationVertices[i] = 0.0;
            }
        }

        public update(cacheFrameIndex: number): void {
            // tslint:disable-next-line:no-unused-expression
            cacheFrameIndex;

            if (!this._transformDirty && (this._parent !== null && this._parent._childrenTransformDirty)) { // Dirty.
                this._transformDirty = true;
            }

            if (this._transformDirty) {
                this._transformDirty = false;
                this._childrenTransformDirty = true;

                for (let i = 0, l = this._matrices.length; i < l; i += 7) {
                    this._matrices[i] = -1.0;
                }
            }
            else if (this._childrenTransformDirty) {
                this._childrenTransformDirty = false;
                return;
            }
            else {
                return;
            }

            const surfaceData = this._boneData as SurfaceData;
            const vertices = surfaceData.vertices;
            const animationVertices = this._animationVertices;

            if (this._parent !== null) {
                if (this._parent._boneData.type === BoneType.Surface) {
                    for (let i = 0, l = vertices.length; i < l; i += 2) {
                        const x = vertices[i] + animationVertices[i];
                        const y = vertices[i + 1] + animationVertices[i];
                        const matrix = (this._parent as Surface)._getMatrix(x, y);
                        //
                        this._vertices[i] = matrix.a * x + matrix.c * y + matrix.tx;
                        this._vertices[i + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                    }
                }
                else {
                    const parentMatrix = this._parent.globalTransformMatrix;

                    for (let i = 0, l = vertices.length; i < l; i += 2) {
                        const x = vertices[i] + animationVertices[i];
                        const y = vertices[i + 1] + animationVertices[i + 1];
                        //
                        this._vertices[i] = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        this._vertices[i + 1] = parentMatrix.b * x + parentMatrix.d * y + parentMatrix.ty;
                    }
                }
            }
            else {
                for (let i = 0, l = vertices.length; i < l; i += 2) {
                    this._vertices[i] = vertices[i] + animationVertices[i];
                    this._vertices[i + 1] = vertices[i + 1] + animationVertices[i + 1];
                }
            }

            const segmentXD = surfaceData.segmentX * 2;
            const lastIndex = this._vertices.length - 2;
            const l = 200.0;
            //
            const raX = this._vertices[0];
            const raY = this._vertices[1];
            const rbX = this._vertices[segmentXD];
            const rbY = this._vertices[segmentXD + 1];
            const rcX = this._vertices[lastIndex];
            const rcY = this._vertices[lastIndex + 1];
            const rdX = this._vertices[lastIndex - segmentXD];
            const rdY = this._vertices[lastIndex - segmentXD + 1];
            //
            const dacX = raX + (rcX - raX) * 0.5;
            const dacY = raY + (rcY - raY) * 0.5;
            const dbdX = rbX + (rdX - rbX) * 0.5;
            const dbdY = rbY + (rdY - rbY) * 0.5;
            const aX = dacX + (dbdX - dacX) * 0.5;
            const aY = dacY + (dbdY - dacY) * 0.5;
            const bX = rbX + (rcX - rbX) * 0.5;
            const bY = rbY + (rcY - rbY) * 0.5;
            const cX = rdX + (rcX - rdX) * 0.5;
            const cY = rdY + (rcY - rdY) * 0.5;
            //
            this._globalDirty = false;
            this._getAffineTransform(0.0, 0.0, l, l, aX, aY, bX, bY, cX, cY, this.global, false).toMatrix(this.globalTransformMatrix);
        }
    }
}